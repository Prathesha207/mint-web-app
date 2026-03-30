import { ChangeEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authFetch } from '../../lib/authFetch';

export type InferenceInputSource = 'upload' | 'camera' | 'oak' | 'remote';

export interface InferenceStats {
  totalFrames: number;
  avgTime: number;
  anomalies: number;
  lastInferenceTime: number;
  totalAnomalies: number;
}

export interface AdvancedSettings {
  threshold: number;
  tileRows: number;
  tileCols: number;
  parallelTiles: boolean;
  skipFrames: number;
}

export interface LoadedModel {
  model_id: string;
  name: string;
  loaded_at: string;
  is_dummy: boolean;
  has_multi_roi: boolean;
}

export interface BackendVideoProcessingState {
  jobId: string;
  isProcessing: boolean;
  progress: number;
  currentFrame: number;
  totalFrames: number;
  totalAnomalies: number;
  status: 'idle' | 'uploaded' | 'processing' | 'paused' | 'completed' | 'error';
  message: string;
  websocket: WebSocket | null;
}

export interface UploadedVideoInfo {
  jobId: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export type InferenceModelType = 'motion' | 'anomaly';

export interface InferenceModel {
  id: string;
  name?: string;
  display_name?: string;
  session_id?: string;
  rois_trained?: string[];
  has_motion?: boolean;
  has_anomaly?: boolean;
  model_types?: InferenceModelType[];
  training_options?: string[];
  [key: string]: unknown;
}

export interface DownloadDebugInfo {
  modelId: string;
  modelType: InferenceModelType | '';
  sessionId: string;
  availableTypes: InferenceModelType[];
}

export interface InferencePrediction {
  is_anomaly?: boolean;
  type?: 'anomaly' | 'motion' | string;
  label?: string;
  message?: string;
  roi_name?: string;
  speed_percent?: number;
  score?: number;
  confidence?: number;
  anomaly_count?: number;
  anomaly_areas?: Array<{ bbox?: [number, number, number, number] | number[] }>;
  [key: string]: unknown;
}

export interface BatchResult {
  success: boolean;
  file_name: string;
  inference_time?: number;
  anomalies?: number;
  error?: string;
}

interface UseInferenceOptions {
  backendUrl: string;
  inputSource: InferenceInputSource;
  isOakStreaming: boolean;
  remoteCameraActive: boolean;
  remoteCameraFrame: string | null;
  selectedROI: string | null;
  videoDimensions: { width: number; height: number };
  videoRef: RefObject<HTMLVideoElement | null>;
  oakStreamRef: RefObject<HTMLImageElement | null>;
  getVideoFile: () => File | null;
  onInputSourceChange: (source: InferenceInputSource) => void;
  onVideoLoaded: (file: File, url: string) => void;
  addTerminalLog: (message: string) => void;
}

const defaultAdvancedSettings: AdvancedSettings = {
  threshold: 0.5,
  tileRows: 2,
  tileCols: 2,
  parallelTiles: true,
  skipFrames: 0,
};

const initialInferenceStats: InferenceStats = {
  totalFrames: 0,
  avgTime: 0,
  anomalies: 0,
  lastInferenceTime: 0,
  totalAnomalies: 0,
};

const initialBackendState: BackendVideoProcessingState = {
  jobId: '',
  isProcessing: false,
  progress: 0,
  currentFrame: 0,
  totalFrames: 0,
  totalAnomalies: 0,
  status: 'idle',
  message: '',
  websocket: null,
};

const countAnomalies = (predictions?: InferencePrediction[] | null) =>
  Array.isArray(predictions)
    ? predictions.reduce((total, prediction) => {
      if (!prediction.is_anomaly) return total;
      const anomalyCount = prediction.anomaly_count;
      return total + (typeof anomalyCount === 'number' && anomalyCount > 0 ? anomalyCount : 1);
    }, 0)
    : 0;

const normalizeBackendVideoStatus = (
  status: unknown
): BackendVideoProcessingState['status'] => {
  if (
    status === 'uploaded' ||
    status === 'processing' ||
    status === 'paused' ||
    status === 'completed' ||
    status === 'error'
  ) {
    return status;
  }

  if (status === 'pending') {
    return 'processing';
  }

  return 'idle';
};

const toApiBase = (backendUrl: string) =>
  backendUrl.startsWith('https://') || backendUrl.startsWith('https://')
    ? backendUrl.replace(/\/$/, '')
    : `https://${backendUrl.replace(/\/$/, '')}`;

const getStoredAccessToken = () =>
  typeof window === 'undefined' ? '' : window.localStorage.getItem('access_token') || '';

const LAST_TRAINING_MODEL_ID_STORAGE_KEY = 'mint:last-training-model-id';

const getStoredPreferredInferenceModelId = () =>
  typeof window === 'undefined'
    ? ''
    : window.localStorage.getItem(LAST_TRAINING_MODEL_ID_STORAGE_KEY) || '';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Invalid file result'));
        return;
      }
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function useInference({
  backendUrl,
  inputSource,
  isOakStreaming,
  remoteCameraActive,
  remoteCameraFrame,
  selectedROI,
  videoDimensions,
  videoRef,
  oakStreamRef,
  getVideoFile,
  onInputSourceChange,
  onVideoLoaded,
  addTerminalLog,
}: UseInferenceOptions) {
  const apiBase = useMemo(() => toApiBase(backendUrl), [backendUrl]);

  const [models, setModels] = useState<InferenceModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedModelType, setSelectedModelType] = useState<'motion' | 'anomaly' | ''>('');
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [loadedModelTypesById, setLoadedModelTypesById] = useState<
    Partial<Record<string, InferenceModelType[]>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [processedFrame, setProcessedFrame] = useState<string>('');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string>('');
  const [processedVideoBlob, setProcessedVideoBlob] = useState<Blob | null>(null);
  const [inferenceStats, setInferenceStats] = useState<InferenceStats>(initialInferenceStats);
  const [predictions, setPredictions] = useState<InferencePrediction[]>([]);
  const [modelLoading, setModelLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>(defaultAdvancedSettings);

  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProcessingProgress, setBatchProcessingProgress] = useState(0);

  const [backendVideoProcessing, setBackendVideoProcessing] =
    useState<BackendVideoProcessingState>(initialBackendState);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<UploadedVideoInfo | null>(null);
  const [unsupportedVideoFile, setUnsupportedVideoFile] = useState<File | null>(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedModelForDownload, setSelectedModelForDownload] = useState<InferenceModel | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState('');
  const [downloadDebugInfo, setDownloadDebugInfo] = useState<DownloadDebugInfo | null>(null);
  const [inferenceWarning, setInferenceWarning] = useState('');

  const inferenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inferenceWebSocketRef = useRef<WebSocket | null>(null);
  const backendVideoWebSocketRef = useRef<WebSocket | null>(null);
  const activeFrameAbortControllerRef = useRef<AbortController | null>(null);
  const frameRequestInFlightRef = useRef(false);
  const processedVideoUrlRef = useRef('');
  const processedVideoJobIdRef = useRef('');
  const selectedModelInfo = useMemo(
    () => models.find((m) => m.id === selectedModel),
    [models, selectedModel]
  );

  const clearProcessedVideoState = useCallback(
    (options?: { clearFrame?: boolean }) => {
      setProcessedVideoUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return '';
      });
      processedVideoUrlRef.current = '';
      processedVideoJobIdRef.current = '';
      setProcessedVideoBlob(null);
      if (options?.clearFrame) {
        setProcessedFrame('');
      }
    },
    []
  );

  const resetInferenceResults = useCallback(
    (options?: { clearFrame?: boolean; clearVideo?: boolean }) => {
      if (options?.clearVideo) {
        clearProcessedVideoState({ clearFrame: options?.clearFrame });
      } else if (options?.clearFrame) {
        setProcessedFrame('');
      }
      setPredictions([]);
      setInferenceStats({ ...initialInferenceStats });
    },
    [clearProcessedVideoState]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedModel) return;
    window.localStorage.setItem(LAST_TRAINING_MODEL_ID_STORAGE_KEY, selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    processedVideoUrlRef.current = processedVideoUrl;
  }, [processedVideoUrl]);

  const getAvailableModelTypes = useCallback(
    (model?: InferenceModel | null): InferenceModelType[] => {
      if (!model) return [];

      if (Array.isArray(model.model_types) && model.model_types.length > 0) {
        return model.model_types.filter(
          (type): type is InferenceModelType => type === 'motion' || type === 'anomaly'
        );
      }

      const nextTypes: InferenceModelType[] = [];
      if (model.has_anomaly) nextTypes.push('anomaly');
      if (model.has_motion) nextTypes.push('motion');
      return nextTypes;
    },
    []
  );

  const selectedModelAvailableTypes = useMemo(
    () => getAvailableModelTypes(selectedModelInfo),
    [getAvailableModelTypes, selectedModelInfo]
  );

  const getModelTypeLabel = useCallback((type: InferenceModelType | '' | null | undefined) => {
    if (type === 'motion') return 'Motion';
    if (type === 'anomaly') return 'Anomaly';
    return 'None';
  }, []);

  useEffect(() => {
    if (!selectedModelInfo) {
      setSelectedModelType('');
      return;
    }

    if (
      selectedModelType &&
      selectedModelAvailableTypes.includes(selectedModelType as InferenceModelType)
    ) {
      return;
    }

    setSelectedModelType(selectedModelAvailableTypes[0] || '');
  }, [selectedModelAvailableTypes, selectedModelInfo, selectedModelType]);

  const setWarningMessage = useCallback(
    (message: string) => {
      setInferenceWarning(message);
      addTerminalLog(`WARNING: ${message}`);
    },
    [addTerminalLog]
  );

  const getRequestedModelTypes = useCallback(
    (model?: InferenceModel | null): InferenceModelType[] => {
      const availableTypes = getAvailableModelTypes(model ?? selectedModelInfo);
      if (
        selectedModelType &&
        availableTypes.includes(selectedModelType as InferenceModelType)
      ) {
        return [selectedModelType as InferenceModelType];
      }

      return availableTypes;
    },
    [getAvailableModelTypes, selectedModelInfo, selectedModelType]
  );

  const validateInferenceReadiness = useCallback(
    (options?: { requireLoadedModel?: boolean }) => {
      const requireLoadedModel = options?.requireLoadedModel ?? false;

      if (!selectedModel) {
        return { ok: false, message: 'No trained model is ready yet. Train a model first.' };
      }

      if (!selectedModelInfo) {
        return { ok: false, message: 'The selected model could not be found. Refresh the model list.' };
      }

      const availableTypes = getAvailableModelTypes(selectedModelInfo);
      if (availableTypes.length === 0) {
        return {
          ok: false,
          message: 'This training does not contain usable inference artifacts yet.',
        };
      }

      if (requireLoadedModel && !loadedModels.some((m) => m.model_id === selectedModel)) {
        return { ok: false, message: 'Prepare the trained model before running inference.' };
      }

      const requestedTypes = getRequestedModelTypes(selectedModelInfo);
      const loadedTypes = loadedModelTypesById[selectedModel];
      const missingLoadedTypes = requestedTypes.filter((type) => !loadedTypes?.includes(type));
      if (
        requireLoadedModel &&
        loadedTypes &&
        loadedTypes.length > 0 &&
        missingLoadedTypes.length > 0
      ) {
        return {
          ok: false,
          message: `The prepared model is missing ${missingLoadedTypes
            .map(getModelTypeLabel)
            .join(', ')}. Prepare it again to use the selected inference type.`,
        };
      }

      return { ok: true, message: '' };
    },
    [
      getAvailableModelTypes,
      getRequestedModelTypes,
      getModelTypeLabel,
      loadedModelTypesById,
      loadedModels,
      selectedModel,
      selectedModelInfo,
    ]
  );

  const buildWebSocketUrl = useCallback(
    (pathname: string, options?: { sessionId?: string }) => {
      const baseUrl = new URL(apiBase);
      const protocol = baseUrl.protocol === 'https:' ? 'wss' : 'ws';
      const url = new URL(pathname, `${protocol}//${baseUrl.host}`);
      const token = getStoredAccessToken();
      if (token) {
        url.searchParams.set('token', token);
      }
      if (options?.sessionId) {
        url.searchParams.set('session_id', options.sessionId);
      }
      return url.toString();
    },
    [apiBase]
  );

  const isModelLoaded = useMemo(
    () => loadedModels.some((m) => m.model_id === selectedModel),
    [loadedModels, selectedModel]
  );

  const loadedModelInfo = useMemo(
    () => loadedModels.find((m) => m.model_id === selectedModel),
    [loadedModels, selectedModel]
  );

  const clearRealtimeHandles = useCallback(() => {
    if (inferenceIntervalRef.current) {
      clearInterval(inferenceIntervalRef.current);
      inferenceIntervalRef.current = null;
    }
    if (inferenceWebSocketRef.current) {
      inferenceWebSocketRef.current.close();
      inferenceWebSocketRef.current = null;
    }
  }, []);

  const fetchLoadedModels = useCallback(async () => {
    try {
      const response = await authFetch(`${apiBase}/api/inference/models/loaded`);
      if (!response.ok) return;
      const data = await response.json();
      setLoadedModels(data.models || []);
    } catch {
      // keep silent; this is a best-effort refresh
    }
  }, [apiBase]);

  const loadModels = useCallback(async () => {
    try {
      setModelLoading(true);
      addTerminalLog('Loading available models...');
      const response = await authFetch(`${apiBase}/api/inference/models`);
      if (!response.ok) {
        const error = await response.text();
        addTerminalLog(`❌ Failed to load models: ${error}`);
        return;
      }
      const data = await response.json();
      const nextModels = data.models || [];
      const skippedTrainings = Array.isArray(data.skipped_trainings) ? data.skipped_trainings : [];
      setModels(nextModels);
      if (nextModels.length > 0) {
        const preferredModelId = getStoredPreferredInferenceModelId();
        const preferredModel =
          nextModels.find((model: InferenceModel) => model.id === preferredModelId) || nextModels[0];
        setSelectedModel(preferredModel.id);
        setSelectedModelType(getAvailableModelTypes(preferredModel)[0] || '');
      } else if (skippedTrainings.length > 0) {
        const failedCount = skippedTrainings.filter(
          (item: { reason?: string } | null | undefined) => item?.reason === 'no_model_artifacts'
        ).length;
        addTerminalLog(
          `No loadable models found. ${failedCount || skippedTrainings.length} training run(s) exist but produced no model artifacts.`
        );
        const firstSkipped = skippedTrainings[0] as
          | { id?: string; status?: string; reason?: string }
          | undefined;
        if (firstSkipped?.id) {
          addTerminalLog(
            `Latest skipped training: ${firstSkipped.id} (${firstSkipped.status || firstSkipped.reason || 'unknown'})`
          );
        }
      }
      addTerminalLog(`✅ Loaded ${nextModels.length} trained models`);
      setConnectionError(false);
    } catch (error) {
      addTerminalLog(`❌ Error loading models: ${error}`);
      setConnectionError(true);
    } finally {
      setModelLoading(false);
    }
  }, [addTerminalLog, apiBase, getAvailableModelTypes]);

  const loadSpecificModel = useCallback(
    async (modelId: string, requestedType?: InferenceModelType | '') => {
      try {
        setModelLoading(true);
        const model = models.find((item) => item.id === modelId);
        const availableTypes = getAvailableModelTypes(model);
        const requestedTypes =
          requestedType && availableTypes.includes(requestedType as InferenceModelType)
            ? [requestedType as InferenceModelType]
            : availableTypes;

        if (requestedTypes.length === 0) {
          setWarningMessage('No trained inference types are available for this model.');
          return false;
        }

        if (
          requestedType &&
          !availableTypes.includes(requestedType as InferenceModelType)
        ) {
          setWarningMessage(
            `${getModelTypeLabel(requestedType)} inference is not available for model ${modelId}.`
          );
          return false;
        }

        addTerminalLog(
          `Loading model: ${modelId} (${requestedTypes.map(getModelTypeLabel).join(', ')})${model?.session_id ? ` | session=${model.session_id}` : ''
          }...`
        );
        const response = await authFetch(`${apiBase}/api/inference/models/${modelId}/load`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: model?.session_id || '',
            model_types: requestedTypes,
          }),
        });
        if (!response.ok) {
          const error = await response.text();
          addTerminalLog(`❌ Failed to load model: ${error}`);
          return false;
        }
        const data = await response.json();
        const loadedTypes = Array.isArray(data.successfully_loaded_types)
          ? data.successfully_loaded_types.filter(
            (type: unknown): type is InferenceModelType =>
              type === 'motion' || type === 'anomaly'
          )
          : [];
        setLoadedModelTypesById((prev) => ({
          ...prev,
          [modelId]: loadedTypes.length > 0 ? loadedTypes : requestedTypes,
        }));
        setInferenceWarning('');
        addTerminalLog(`✅ Model loaded: ${data.message}`);
        if (data.is_dummy) addTerminalLog('⚠ Using dummy inference (real model not available)');
        await fetchLoadedModels();
        return true;
      } catch (error) {
        addTerminalLog(`❌ Error loading model: ${error}`);
        setConnectionError(true);
        return false;
      } finally {
        setModelLoading(false);
      }
    },
    [
      addTerminalLog,
      apiBase,
      fetchLoadedModels,
      getAvailableModelTypes,
      getModelTypeLabel,
      models,
      setWarningMessage,
    ]
  );

  const getInferenceRoiIds = useCallback((): string[] => {
    // `selectedROI` tracks the training editor selection. Inference should use
    // the full trained ROI set until we add a dedicated inference ROI picker.
    void selectedROI;
    return [];
  }, [selectedROI]);

  const ensureSelectedModelLoaded = useCallback(async () => {
    if (!selectedModel) {
      setWarningMessage('No trained model is ready yet. Train a model first.');
      return false;
    }

    const model = models.find((item) => item.id === selectedModel);
    if (!model) {
      setWarningMessage('The selected model could not be found. Refresh the model list.');
      return false;
    }

    const requestedTypes = getRequestedModelTypes(model);
    if (requestedTypes.length === 0) {
      setWarningMessage('This training does not contain usable inference artifacts yet.');
      return false;
    }

    const loadedTypes = loadedModelTypesById[selectedModel] || [];
    const hasLoadedModel = loadedModels.some((loaded) => loaded.model_id === selectedModel);
    const missingRequestedTypes = requestedTypes.filter((type) => !loadedTypes.includes(type));

    if (hasLoadedModel && missingRequestedTypes.length === 0) {
      return true;
    }

    if (requestedTypes.length === 1) {
      return loadSpecificModel(selectedModel, requestedTypes[0]);
    }

    return loadSpecificModel(selectedModel);
  }, [
    getRequestedModelTypes,
    loadedModelTypesById,
    loadedModels,
    loadSpecificModel,
    models,
    selectedModel,
    setWarningMessage,
  ]);

  const unloadModel = useCallback(
    async (modelId: string) => {
      try {
        const response = await authFetch(`${apiBase}/api/inference/models/${modelId}/unload`, {
          method: 'POST',
        });
        if (!response.ok) return false;
        setLoadedModelTypesById((prev) => {
          const next = { ...prev };
          delete next[modelId];
          return next;
        });
        addTerminalLog(`✅ Model ${modelId} unloaded`);
        await fetchLoadedModels();
        return true;
      } catch (error) {
        addTerminalLog(`❌ Error unloading model: ${error}`);
        return false;
      }
    },
    [addTerminalLog, apiBase, fetchLoadedModels]
  );

  const captureCurrentFrameData = useCallback(async (): Promise<string | null> => {
    if (remoteCameraActive && remoteCameraFrame) {
      return remoteCameraFrame.startsWith('data:image')
        ? remoteCameraFrame
        : `data:image/jpeg;base64,${remoteCameraFrame}`;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (inputSource === 'oak' && isOakStreaming && oakStreamRef.current) {
      canvas.width = 1280;
      canvas.height = 720;
      ctx.drawImage(oakStreamRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }

    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      canvas.width = 1280;
      canvas.height = 720;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }

    canvas.width = videoDimensions.width;
    canvas.height = videoDimensions.height;
    return null;
  }, [
    inputSource,
    isOakStreaming,
    oakStreamRef,
    remoteCameraActive,
    remoteCameraFrame,
    videoDimensions.height,
    videoDimensions.width,
    videoRef,
  ]);

  const processFrame = useCallback(
    async (frameData?: string) => {
      if (!selectedModel) {
        addTerminalLog('❌ No trained model is available yet');
        return false;
      }

      const readiness = validateInferenceReadiness();
      if (!readiness.ok) {
        setWarningMessage(readiness.message);
        return false;
      }

      const model = models.find((m) => m.id === selectedModel);
      if (!model) {
        setWarningMessage('The selected model could not be found. Refresh the model list.');
        addTerminalLog('❌ Selected model not found');
        return false;
      }

      const requestedTypes = getRequestedModelTypes(model);
      const selectedRoiIds = getInferenceRoiIds();
      const base64Data = frameData || (await captureCurrentFrameData());
      if (!base64Data) {
        addTerminalLog('❌ No video source available');
        return false;
      }

      try {
        addTerminalLog('Sending frame for inference...');

        const controller = new AbortController();
        activeFrameAbortControllerRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), 30000);
        let response: Response;
        try {
          response = await authFetch(`${apiBase}/api/inference/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model_id: selectedModel,
              frame_data: base64Data,
              session_id: model.session_id,
              roi_ids: selectedRoiIds,
              model_types: requestedTypes,
              inference_order: requestedTypes,
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
          if (activeFrameAbortControllerRef.current === controller) {
            activeFrameAbortControllerRef.current = null;
          }
        }

        if (!response.ok) {
          const errorText = await response.text();
          addTerminalLog(`❌ Inference failed (${response.status}): ${errorText}`);
          return false;
        }

        const result = await response.json();
        setProcessedFrame(result.processed_frame || '');
        setPredictions(result.predictions || []);
        const newAnomalies = countAnomalies(result.predictions as InferencePrediction[] | undefined);
        setInferenceStats((prev) => ({
          ...prev,
          totalFrames: prev.totalFrames + 1,
          avgTime:
            (prev.avgTime * prev.totalFrames + (result.inference_time || 0)) /
            (prev.totalFrames + 1),
          anomalies: newAnomalies,
          lastInferenceTime: result.inference_time || 0,
          totalAnomalies: prev.totalAnomalies + newAnomalies,
        }));
        addTerminalLog(`✅ ${result.message || 'Frame processed'}`);
        setInferenceWarning('');
        setConnectionError(false);
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return false;
        }
        addTerminalLog(`❌ Inference error: ${error}`);
        setConnectionError(true);
        return false;
      }
    },
    [
      addTerminalLog,
      apiBase,
      captureCurrentFrameData,
      getInferenceRoiIds,
      getRequestedModelTypes,
      models,
      selectedModel,
      setWarningMessage,
      validateInferenceReadiness,
    ]
  );

  const processFrameWithRetry = useCallback(
    async (frameData?: string, retries = 2) => {
      for (let i = 0; i < retries; i += 1) {
        try {
          const success = await processFrame(frameData);
          if (success) return true;
        } catch {
          // retry on next iteration
        }
        if (i < retries - 1) {
          addTerminalLog(`⚠ Retry ${i + 1}/${retries} after error...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
      return false;
    },
    [addTerminalLog, processFrame]
  );

  const connectInferenceWebSocket = useCallback(() => {
    if (!selectedModel || typeof window === 'undefined') return;
    if (inferenceWebSocketRef.current) {
      inferenceWebSocketRef.current.close();
      inferenceWebSocketRef.current = null;
    }
    const ws = new WebSocket(
      buildWebSocketUrl(`/api/inference/ws/${selectedModel}`, {
        sessionId: selectedModelInfo?.session_id,
      })
    );
    ws.onopen = () => addTerminalLog('✅ Connected to inference WebSocket');
    ws.onopen = () => {
      setConnectionError(false);
      addTerminalLog('Connected to inference WebSocket');
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected' || data.type === 'model_loaded') {
          if (typeof data.message === 'string' && data.message.length > 0) {
            addTerminalLog(data.message);
          }
          return;
        }
        if (data.type === 'error') {
          const message =
            typeof data.message === 'string' && data.message.length > 0
              ? data.message
              : 'Inference WebSocket error';
          addTerminalLog(`WebSocket error: ${message}`);
          setWarningMessage(message);
          setConnectionError(true);
          return;
        }
        if (data.type !== 'result') return;
        setProcessedFrame(data.processed_frame || '');
        setPredictions(data.predictions || []);
        const newAnomalies =
          ((data.predictions as InferencePrediction[] | undefined)?.filter((p) => p.is_anomaly)
            .length ?? 0);
        setInferenceStats((prev) => ({
          ...prev,
          totalFrames: prev.totalFrames + 1,
          avgTime:
            (prev.avgTime * prev.totalFrames + (data.inference_time || 0)) / (prev.totalFrames + 1),
          lastInferenceTime: data.inference_time || 0,
          anomalies: newAnomalies,
          totalAnomalies: prev.totalAnomalies + newAnomalies,
        }));
      } catch {
        // ignore malformed payloads
      }
    };
    ws.onerror = (error) => addTerminalLog(`❌ WebSocket error: ${error}`);
    ws.onclose = () => addTerminalLog('WebSocket disconnected');
    ws.onerror = () => {
      setConnectionError(true);
      addTerminalLog('Inference WebSocket connection error');
    };
    ws.onclose = (event) => {
      if (inferenceWebSocketRef.current === ws) {
        inferenceWebSocketRef.current = null;
      }
      if (!event.wasClean && event.code !== 1000) {
        setConnectionError(true);
        addTerminalLog(`Inference WebSocket disconnected (code ${event.code})`);
        return;
      }
      addTerminalLog('Inference WebSocket disconnected');
    };
    inferenceWebSocketRef.current = ws;
  }, [
    addTerminalLog,
    buildWebSocketUrl,
    selectedModel,
    selectedModelInfo?.session_id,
    setWarningMessage,
  ]);

  const fetchLatestProcessedFrame = useCallback(
    async (jobId: string) => {
      try {
        const response = await authFetch(`${apiBase}/api/inference/video-job/${jobId}/latest-frame`);
        if (!response.ok) return false;
        const result = await response.json();
        if (!result.success || !result.processed_frame) return false;
        const nextPredictions = Array.isArray(result.predictions)
          ? (result.predictions as InferencePrediction[])
          : [];
        const nextAnomalies =
          typeof result.anomalies === 'number' ? result.anomalies : countAnomalies(nextPredictions);
        const nextCurrentFrame =
          typeof result.current_frame === 'number' ? result.current_frame : undefined;
        const nextTotalAnomalies =
          typeof result.total_anomalies === 'number' ? result.total_anomalies : undefined;

        setProcessedFrame(result.processed_frame);
        setPredictions(nextPredictions);
        setBackendVideoProcessing((prev) => {
          return {
            ...prev,
            currentFrame:
              typeof nextCurrentFrame === 'number' ? nextCurrentFrame : prev.currentFrame,
            totalFrames:
              typeof result.total_frames === 'number' ? result.total_frames : prev.totalFrames,
            progress: typeof result.progress === 'number' ? result.progress : prev.progress,
            totalAnomalies:
              typeof nextTotalAnomalies === 'number'
                ? nextTotalAnomalies
                : typeof nextCurrentFrame === 'number' && nextCurrentFrame > prev.currentFrame
                  ? prev.totalAnomalies + nextAnomalies
                  : prev.totalAnomalies,
          };
        });
        setInferenceStats((prev) => ({
          ...prev,
          totalFrames:
            typeof nextCurrentFrame === 'number'
              ? Math.max(prev.totalFrames, nextCurrentFrame)
              : prev.totalFrames,
          avgTime:
            typeof nextCurrentFrame === 'number' &&
              nextCurrentFrame > prev.totalFrames &&
              typeof result.inference_time === 'number' &&
              nextCurrentFrame > 0
              ? (prev.avgTime * prev.totalFrames + result.inference_time) / nextCurrentFrame
              : prev.avgTime,
          anomalies: nextAnomalies,
          lastInferenceTime:
            typeof result.inference_time === 'number'
              ? result.inference_time
              : prev.lastInferenceTime,
          totalAnomalies:
            typeof nextTotalAnomalies === 'number'
              ? Math.max(prev.totalAnomalies, nextTotalAnomalies)
              : typeof nextCurrentFrame === 'number' &&
                nextCurrentFrame > prev.totalFrames
                ? prev.totalAnomalies + nextAnomalies
                : prev.totalAnomalies,
        }));
        return true;
      } catch {
        // best-effort polling
        return false;
      }
    },
    [apiBase]
  );

  const fetchProcessedFrame = useCallback(
    async (jobId: string, frameNumber: number) => {
      try {
        const response = await authFetch(`${apiBase}/api/inference/video-job/${jobId}/frame/${frameNumber}`);
        if (!response.ok) return false;
        const result = await response.json();
        if (!result.success || !result.processed_frame) return false;
        const nextPredictions = Array.isArray(result.predictions)
          ? (result.predictions as InferencePrediction[])
          : [];
        const nextAnomalies =
          typeof result.anomalies === 'number' ? result.anomalies : countAnomalies(nextPredictions);
        const nextTotalAnomalies =
          typeof result.total_anomalies === 'number' ? result.total_anomalies : undefined;
        setProcessedFrame(result.processed_frame);
        setPredictions(nextPredictions);
        setBackendVideoProcessing((prev) => ({
          ...prev,
          currentFrame:
            typeof result.frame_number === 'number' ? result.frame_number : prev.currentFrame,
          totalFrames:
            typeof result.total_frames === 'number' ? result.total_frames : prev.totalFrames,
          progress: typeof result.progress === 'number' ? result.progress : prev.progress,
          totalAnomalies:
            typeof nextTotalAnomalies === 'number'
              ? Math.max(prev.totalAnomalies, nextTotalAnomalies)
              : prev.totalAnomalies,
        }));
        setInferenceStats((prev) => ({
          ...prev,
          anomalies: nextAnomalies,
          lastInferenceTime:
            typeof result.inference_time === 'number'
              ? result.inference_time
              : prev.lastInferenceTime,
          totalAnomalies:
            typeof nextTotalAnomalies === 'number'
              ? Math.max(prev.totalAnomalies, nextTotalAnomalies)
              : prev.totalAnomalies,
        }));
        return true;
      } catch {
        return false;
      }
    },
    [apiBase]
  );

  const fetchProcessedVideoFromBackend = useCallback(
    async (jobId: string, retryCount = 0) => {
      try {
        addTerminalLog('📥 Downloading processed video...');
        const response = await authFetch(`${apiBase}/api/inference/video-result/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch processed video`);
        }

        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error('Received empty video blob');
        }

        // Create object URL with proper error handling
        let objectUrl = '';
        try {
          objectUrl = URL.createObjectURL(blob);

          // Verify the blob URL is usable
          if (!objectUrl || !objectUrl.startsWith('blob:')) {
            throw new Error('Invalid blob URL created');
          }
        } catch (blobError) {
          addTerminalLog(`⚠️ Blob URL creation issue: ${blobError}`);
          throw blobError;
        }

        setProcessedVideoUrl((prev) => {
          if (prev && prev.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(prev);
            } catch {
              // ignore revocation errors
            }
          }
          return objectUrl;
        });
        processedVideoJobIdRef.current = jobId;
        setProcessedVideoBlob(blob);
        addTerminalLog(`✅ Processed video loaded (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);
        return objectUrl;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        addTerminalLog(`❌ Error downloading video: ${errorMsg}`);

        // Retry up to 2 times on temporary failures
        if (retryCount < 2 && errorMsg.includes('HTTP')) {
          addTerminalLog(`⏳ Retrying video download (${retryCount + 1}/2)...`);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchProcessedVideoFromBackend(jobId, retryCount + 1);
        }
        return '';
      }
    },
    [addTerminalLog, apiBase]
  );

  const fetchBackendVideoStatus = useCallback(
    async (jobId: string) => {
      try {
        const response = await authFetch(`${apiBase}/api/inference/video-status/${jobId}`);
        if (!response.ok) return null;

        const result = await response.json();
        // If server tells us there's no need to poll further, stop processing state.
        if (result && result._should_poll === false) {
          if (backendVideoWebSocketRef.current) {
            backendVideoWebSocketRef.current.close();
            backendVideoWebSocketRef.current = null;
          }
          setIsProcessing(false);
        }
        const nextStatus = normalizeBackendVideoStatus(result.status);
        const nextCurrentFrame =
          typeof result.current_frame === 'number'
            ? result.current_frame
            : typeof result.processed_frames === 'number'
              ? result.processed_frames
              : undefined;

        setBackendVideoProcessing((prev) => ({
          ...prev,
          jobId,
          isProcessing: nextStatus === 'processing',
          status: nextStatus,
          progress: typeof result.progress === 'number' ? result.progress : prev.progress,
          currentFrame:
            typeof nextCurrentFrame === 'number' ? nextCurrentFrame : prev.currentFrame,
          totalFrames:
            typeof result.total_frames === 'number' ? result.total_frames : prev.totalFrames,
          totalAnomalies:
            typeof result.total_anomalies === 'number'
              ? result.total_anomalies
              : prev.totalAnomalies,
          message: typeof result.message === 'string' ? result.message : prev.message,
        }));
        setInferenceStats((prev) => ({
          ...prev,
          totalFrames:
            typeof nextCurrentFrame === 'number'
              ? Math.max(prev.totalFrames, nextCurrentFrame)
              : prev.totalFrames,
          totalAnomalies:
            typeof result.total_anomalies === 'number'
              ? Math.max(prev.totalAnomalies, result.total_anomalies)
              : prev.totalAnomalies,
        }));

        if (nextStatus === 'completed' || nextStatus === 'paused') {
          await fetchLatestProcessedFrame(jobId);
          // Always fetch the video if it hasn't been fetched for this job yet
          if (processedVideoJobIdRef.current !== jobId) {
            // Prioritize fetching the processed video
            await fetchProcessedVideoFromBackend(jobId);
          } else if (typeof result.output_video === 'string' && result.output_video.length > 0) {
            addTerminalLog('✅ Video processing completed');
          }
          if (backendVideoWebSocketRef.current) {
            backendVideoWebSocketRef.current.close();
            backendVideoWebSocketRef.current = null;
          }
          setIsProcessing(false);
        } else if (nextStatus === 'error') {
          if (backendVideoWebSocketRef.current) {
            backendVideoWebSocketRef.current.close();
            backendVideoWebSocketRef.current = null;
          }
          setIsProcessing(false);
        }

        return nextStatus;
      } catch {
        return null;
      }
    },
    [apiBase, fetchLatestProcessedFrame, fetchProcessedVideoFromBackend]
  );

  const downloadProcessedVideo = useCallback(() => {
    if (!processedVideoBlob) {
      addTerminalLog('❌ No processed video available to download');
      return false;
    }

    try {
      const objectUrl = URL.createObjectURL(processedVideoBlob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `processed_${unsupportedVideoFile?.name || 'output.mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      addTerminalLog('✅ Video download started');
      return true;
    } catch (error) {
      addTerminalLog(`❌ Error downloading video: ${error}`);
      return false;
    }
  }, [addTerminalLog, processedVideoBlob, unsupportedVideoFile?.name]);

  const connectToVideoWebSocket = useCallback(
    (jobId: string) => {
      if (typeof window === 'undefined') return;
      if (backendVideoWebSocketRef.current) {
        backendVideoWebSocketRef.current.close();
        backendVideoWebSocketRef.current = null;
      }
      const ws = new WebSocket(buildWebSocketUrl(`/api/inference/video-stream/${jobId}`));
      ws.onopen = () => addTerminalLog('✅ Connected to video processing WebSocket');
      ws.onopen = () => {
        setConnectionError(false);
        addTerminalLog('Connected to video processing WebSocket');
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') {
            if (typeof data.message === 'string' && data.message.length > 0) {
              addTerminalLog(data.message);
            }
          } else if (data.type === 'job_info') {
            const nextStatus = normalizeBackendVideoStatus(data.status);
            setBackendVideoProcessing((prev) => ({
              ...prev,
              jobId,
              isProcessing: nextStatus === 'processing',
              status: nextStatus,
              progress: typeof data.progress === 'number' ? data.progress : prev.progress,
              currentFrame:
                typeof data.current_frame === 'number' ? data.current_frame : prev.currentFrame,
              totalFrames:
                typeof data.total_frames === 'number' ? data.total_frames : prev.totalFrames,
              totalAnomalies:
                typeof data.total_anomalies === 'number'
                  ? data.total_anomalies
                  : prev.totalAnomalies,
              message: typeof data.message === 'string' ? data.message : prev.message,
            }));
            if (typeof data.total_anomalies === 'number') {
              setInferenceStats((prev) => ({
                ...prev,
                totalAnomalies: Math.max(prev.totalAnomalies, data.total_anomalies),
              }));
            }
          } else if (data.type === 'stopped') {
            void fetchLatestProcessedFrame(jobId);
            if (typeof data.output_video === 'string' && data.output_video.length > 0) {
              void fetchProcessedVideoFromBackend(jobId);
            }
            addTerminalLog(data.message || '⏹️ Video processing stopped');
            setBackendVideoProcessing((prev) => ({
              ...prev,
              isProcessing: false,
              status: 'paused',
              message: data.message || 'Processing stopped',
            }));
            setIsProcessing(false);
          } else if (data.type === 'frame' && data.processed_frame) {
            const nextPredictions = Array.isArray(data.predictions)
              ? (data.predictions as InferencePrediction[])
              : [];
            const nextFrameNumber =
              typeof data.frame_number === 'number' ? data.frame_number : undefined;
            const nextTotalAnomalies =
              typeof data.total_anomalies === 'number' ? data.total_anomalies : undefined;
            setProcessedFrame(data.processed_frame);
            setPredictions(nextPredictions);
            const frameAnomalies =
              typeof data.anomalies === 'number' ? data.anomalies : countAnomalies(nextPredictions);
            setBackendVideoProcessing((prev) => ({
              ...prev,
              currentFrame:
                typeof nextFrameNumber === 'number' ? nextFrameNumber : prev.currentFrame,
              totalFrames:
                typeof data.total_frames === 'number' ? data.total_frames : prev.totalFrames,
              progress: typeof data.progress === 'number' ? data.progress : prev.progress,
              totalAnomalies:
                typeof nextTotalAnomalies === 'number'
                  ? Math.max(prev.totalAnomalies, nextTotalAnomalies)
                  : prev.totalAnomalies + frameAnomalies,
            }));
            setInferenceStats((prev) => ({
              ...prev,
              totalFrames:
                typeof nextFrameNumber === 'number'
                  ? Math.max(prev.totalFrames, nextFrameNumber)
                  : prev.totalFrames + 1,
              avgTime:
                (prev.avgTime * prev.totalFrames + (data.inference_time || 0)) / (prev.totalFrames + 1),
              lastInferenceTime: data.inference_time || 0,
              anomalies: frameAnomalies,
              totalAnomalies:
                typeof nextTotalAnomalies === 'number'
                  ? Math.max(prev.totalAnomalies, nextTotalAnomalies)
                  : prev.totalAnomalies + frameAnomalies,
            }));
          } else if (data.type === 'progress') {
            setBackendVideoProcessing((prev) => ({
              ...prev,
              progress: data.progress || 0,
              currentFrame: data.current_frame || prev.currentFrame,
              totalFrames: data.total_frames || prev.totalFrames,
              totalAnomalies: data.total_anomalies || prev.totalAnomalies,
              message: data.message || prev.message,
            }));
            if (typeof data.total_anomalies === 'number') {
              setInferenceStats((prev) => ({
                ...prev,
                totalAnomalies: Math.max(prev.totalAnomalies, data.total_anomalies),
              }));
            }
            void fetchLatestProcessedFrame(jobId);
          } else if (data.type === 'completed') {
            void fetchLatestProcessedFrame(jobId);
            void fetchProcessedVideoFromBackend(jobId);
            addTerminalLog('🎉 Video processing completed!');
            setBackendVideoProcessing((prev) => ({
              ...prev,
              isProcessing: false,
              status: 'completed',
              progress: 100,
              message: data.message || 'Completed',
            }));
            if (typeof data.total_anomalies === 'number') {
              setInferenceStats((prev) => ({
                ...prev,
                totalAnomalies: Math.max(prev.totalAnomalies, data.total_anomalies),
              }));
            }
            setIsProcessing(false);
          } else if (data.type === 'error') {
            const message =
              typeof data.message === 'string' && data.message.length > 0
                ? data.message
                : 'Processing failed';
            addTerminalLog(`❌ Video processing error: ${data.message}`);
            setBackendVideoProcessing((prev) => ({
              ...prev,
              isProcessing: false,
              status: 'error',
              message,
            }));
            setConnectionError(true);
            setIsProcessing(false);
          }
        } catch {
          // ignore invalid payloads
        }
      };
      ws.onerror = () => addTerminalLog('❌ WebSocket connection error');
      ws.onclose = () => addTerminalLog('🔌 WebSocket disconnected');
      ws.onerror = () => {
        setConnectionError(true);
        addTerminalLog('Video processing WebSocket connection error');
      };
      ws.onclose = (event) => {
        if (backendVideoWebSocketRef.current === ws) {
          backendVideoWebSocketRef.current = null;
        }
        if (!event.wasClean && event.code !== 1000) {
          setConnectionError(true);
          addTerminalLog(`Video processing WebSocket disconnected (code ${event.code})`);
          return;
        }
        addTerminalLog('Video processing WebSocket disconnected');
      };
      backendVideoWebSocketRef.current = ws;
      setBackendVideoProcessing((prev) => ({ ...prev, websocket: ws }));
    },
    [addTerminalLog, buildWebSocketUrl, fetchLatestProcessedFrame, fetchProcessedVideoFromBackend]
  );

  const processVideoOnBackend = useCallback(
    async (file: File, startInference = false) => {
      if (!selectedModel) {
        addTerminalLog('❌ No trained model is available yet');
        return null;
      }
      try {
        addTerminalLog(`📤 Uploading video to backend: ${file.name}`);
        resetInferenceResults({ clearFrame: true, clearVideo: true });
        setUploadedVideoInfo(null);
        const readiness = validateInferenceReadiness();
        if (!readiness.ok) {
          setWarningMessage(readiness.message);
          return null;
        }

        const requestedTypes = getRequestedModelTypes(selectedModelInfo);
        const selectedRoiIds = getInferenceRoiIds();
        const formData = new FormData();
        formData.append('model_id', selectedModel);
        formData.append('video', file);
        formData.append('session_id', selectedModelInfo?.session_id || '');
        formData.append('roi_ids_json', JSON.stringify(selectedRoiIds));
        formData.append('model_types_json', JSON.stringify(requestedTypes));
        formData.append('inference_order_json', JSON.stringify(requestedTypes));
        formData.append('video_name', file.name);
        formData.append('start_inference', String(startInference));

        const response = await authFetch(`${apiBase}/api/inference/upload-video-only`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const result = await response.json();
        setUnsupportedVideoFile(file);
        if (startInference) {
          setBackendVideoProcessing((prev) => ({
            ...prev,
            jobId: result.job_id,
            isProcessing: true,
            status: 'processing',
            message: result.message || 'Inference started',
          }));
          connectToVideoWebSocket(result.job_id);
          addTerminalLog(`✅ Video uploaded and inference started: ${result.job_id}`);
        } else {
          setUploadedVideoInfo({
            jobId: result.job_id,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedAt: new Date().toLocaleTimeString(),
          });
          setBackendVideoProcessing((prev) => ({
            ...prev,
            jobId: result.job_id,
            status: 'uploaded',
            message: 'Video uploaded. Ready to start inference.',
            isProcessing: false,
          }));
          addTerminalLog(`✅ Video uploaded successfully. Job ID: ${result.job_id}`);
        }
        return result.job_id as string;
      } catch (error) {
        addTerminalLog(`❌ Error: ${error}`);
        setBackendVideoProcessing((prev) => ({
          ...prev,
          status: 'error',
          isProcessing: false,
          message: `Error: ${error}`,
        }));
        return null;
      }
    },
    [
      addTerminalLog,
      apiBase,
      connectToVideoWebSocket,
      getInferenceRoiIds,
      getRequestedModelTypes,
      resetInferenceResults,
      selectedModel,
      selectedModelInfo?.session_id,
      selectedModelInfo,
      setWarningMessage,
      validateInferenceReadiness,
    ]
  );

  const startInferenceOnUploadedVideo = useCallback(async (jobIdOverride?: string) => {
    const jobId = jobIdOverride || backendVideoProcessing.jobId || uploadedVideoInfo?.jobId;
    if (!jobId || !selectedModel) {
      addTerminalLog('❌ No video uploaded or model selected');
      return false;
    }
    try {
      addTerminalLog('🚀 Starting inference on uploaded video...');
      setIsProcessing(true);
      resetInferenceResults({ clearFrame: true, clearVideo: true });
      const response = await authFetch(`${apiBase}/api/inference/start-video-inference/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_id: selectedModel,
          session_id: selectedModelInfo?.session_id || '',
          roi_ids: getInferenceRoiIds(),
          threshold: advancedSettings.threshold,
          tile_rows: advancedSettings.tileRows,
          tile_cols: advancedSettings.tileCols,
          parallel_tiles: advancedSettings.parallelTiles,
          skip_frames: advancedSettings.skipFrames,
          model_types: getRequestedModelTypes(selectedModelInfo),
          inference_order: getRequestedModelTypes(selectedModelInfo),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      setBackendVideoProcessing((prev) => ({
        ...prev,
        jobId,
        isProcessing: true,
        status: 'processing',
        message: 'Inference started. Processing frames...',
      }));
      setUploadedVideoInfo(null);
      connectToVideoWebSocket(jobId);
      addTerminalLog('✅ Inference started successfully');
      return true;
    } catch (error) {
      setIsProcessing(false);
      addTerminalLog(`❌ Error: ${error}`);
      return false;
    }
  }, [
    addTerminalLog,
    advancedSettings.parallelTiles,
    advancedSettings.skipFrames,
    advancedSettings.threshold,
    advancedSettings.tileCols,
    advancedSettings.tileRows,
    apiBase,
    backendVideoProcessing.jobId,
    connectToVideoWebSocket,
    getInferenceRoiIds,
    getRequestedModelTypes,
    resetInferenceResults,
    selectedModel,
    selectedModelInfo?.session_id,
    selectedModelInfo,
    uploadedVideoInfo?.jobId,
  ]);

  const stopBackendVideoProcessing = useCallback(async () => {
    const jobId = backendVideoProcessing.jobId;
    if (!jobId) {
      setIsProcessing(false);
      return false;
    }

    if (backendVideoWebSocketRef.current) {
      backendVideoWebSocketRef.current.close();
      backendVideoWebSocketRef.current = null;
    }

    try {
      const response = await authFetch(`${apiBase}/api/inference/video-job/${jobId}/stop`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      const job = typeof result.job === 'object' && result.job ? result.job : {};
      const nextStatus = normalizeBackendVideoStatus(job.status);
      const nextCurrentFrame =
        typeof job.current_frame === 'number'
          ? job.current_frame
          : typeof job.processed_frames === 'number'
            ? job.processed_frames
            : undefined;

      setBackendVideoProcessing((prev) => ({
        ...prev,
        jobId,
        websocket: null,
        isProcessing: nextStatus === 'processing',
        status: nextStatus,
        progress: typeof job.progress === 'number' ? job.progress : prev.progress,
        currentFrame:
          typeof nextCurrentFrame === 'number' ? nextCurrentFrame : prev.currentFrame,
        totalFrames: typeof job.total_frames === 'number' ? job.total_frames : prev.totalFrames,
        totalAnomalies:
          typeof job.total_anomalies === 'number' ? job.total_anomalies : prev.totalAnomalies,
        message:
          typeof job.message === 'string'
            ? job.message
            : typeof result.message === 'string'
              ? result.message
              : prev.message,
      }));

      if (typeof nextCurrentFrame === 'number' || typeof job.total_anomalies === 'number') {
        setInferenceStats((prev) => ({
          ...prev,
          totalFrames:
            typeof nextCurrentFrame === 'number'
              ? Math.max(prev.totalFrames, nextCurrentFrame)
              : prev.totalFrames,
          totalAnomalies:
            typeof job.total_anomalies === 'number'
              ? Math.max(prev.totalAnomalies, job.total_anomalies)
              : prev.totalAnomalies,
        }));
      }

      await fetchLatestProcessedFrame(jobId);
      if (typeof job.output_video === 'string' && job.output_video.length > 0) {
        await fetchProcessedVideoFromBackend(jobId);
      }

      setUploadedVideoInfo(null);
      setIsProcessing(false);
      addTerminalLog(
        `⏹️ ${typeof result.message === 'string' ? result.message : 'Stopped backend video processing'}`
      );
      return true;
    } catch (error) {
      setIsProcessing(false);
      addTerminalLog(`❌ Failed to stop backend video processing: ${error}`);
      return false;
    }
  }, [
    addTerminalLog,
    apiBase,
    backendVideoProcessing.jobId,
    fetchLatestProcessedFrame,
    fetchProcessedVideoFromBackend,
  ]);

  const cancelBackendVideoProcessing = useCallback(async () => {
    if (backendVideoWebSocketRef.current) {
      backendVideoWebSocketRef.current.close();
      backendVideoWebSocketRef.current = null;
    }
    if (backendVideoProcessing.jobId) {
      try {
        await authFetch(`${apiBase}/api/inference/video-job/${backendVideoProcessing.jobId}`, {
          method: 'DELETE',
        });
        addTerminalLog('⏹️ Backend video job cleared');
      } catch {
        // ignored
      }
    }
    setBackendVideoProcessing(initialBackendState);
    setUploadedVideoInfo(null);
    setUnsupportedVideoFile(null);
    setIsProcessing(false);
  }, [
    addTerminalLog,
    apiBase,
    backendVideoProcessing.jobId,
  ]);

  const dismissBackendVideoError = useCallback(() => {
    setBackendVideoProcessing((prev) => ({
      ...prev,
      isProcessing: false,
      status: 'idle',
      message: '',
    }));
  }, []);

  const stopInference = useCallback(async () => {
    clearRealtimeHandles();
    if (activeFrameAbortControllerRef.current) {
      activeFrameAbortControllerRef.current.abort();
      activeFrameAbortControllerRef.current = null;
    }
    frameRequestInFlightRef.current = false;
    if (backendVideoWebSocketRef.current) {
      backendVideoWebSocketRef.current.close();
      backendVideoWebSocketRef.current = null;
    }
    if (backendVideoProcessing.isProcessing) {
      await stopBackendVideoProcessing();
    }
    setIsProcessing(false);
    addTerminalLog('⏹️ Stopped inference processing');
  }, [
    addTerminalLog,
    backendVideoProcessing.isProcessing,
    clearRealtimeHandles,
    stopBackendVideoProcessing,
  ]);

  const processFrameTick = useCallback(async () => {
    if (frameRequestInFlightRef.current) return;
    frameRequestInFlightRef.current = true;
    try {
      await processFrameWithRetry();
    } finally {
      frameRequestInFlightRef.current = false;
    }
  }, [processFrameWithRetry]);

  const toggleRealtimeInference = useCallback(async () => {
    if (isProcessing) {
      await stopInference();
      return;
    }

    if (!selectedModel) {
      addTerminalLog('❌ No trained model is available yet');
      return;
    }

    const readiness = validateInferenceReadiness();
    if (!readiness.ok) {
      setWarningMessage(readiness.message);
      return;
    }

    setIsProcessing(true);
    const videoFile = getVideoFile();

    if (videoFile && !isRealtime) {
      if (
        backendVideoProcessing.status === 'uploaded' &&
        (backendVideoProcessing.jobId || uploadedVideoInfo?.jobId)
      ) {
        const started = await startInferenceOnUploadedVideo();
        if (!started) setIsProcessing(false);
        return;
      }
      addTerminalLog('🚀 Starting backend video processing...');
      const jobId = await processVideoOnBackend(videoFile, false);
      if (!jobId) {
        setIsProcessing(false);
        return;
      }
      const started = await startInferenceOnUploadedVideo(jobId);
      if (!started) setIsProcessing(false);
      return;
    }

    if (videoFile && isRealtime) {
      addTerminalLog('🎬 Starting real-time video processing...');
      if (videoRef.current) {
        await videoRef.current.play().catch(() => undefined);
      }
      inferenceIntervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
          if (inferenceIntervalRef.current) {
            clearInterval(inferenceIntervalRef.current);
            inferenceIntervalRef.current = null;
          }
          setIsProcessing(false);
          return;
        }
        void processFrameTick();
      }, 1000 / 30);
      return;
    }

    if (isRealtime && (inputSource === 'camera' || inputSource === 'oak' || inputSource === 'remote')) {
      if (inputSource === 'oak' && isOakStreaming) {
        connectInferenceWebSocket();
      } else {
        inferenceIntervalRef.current = setInterval(() => {
          void processFrameTick();
        }, 500);
      }
      addTerminalLog('Started real-time inference');
      return;
    }

    await processFrameTick();
    setIsProcessing(false);
  }, [
    addTerminalLog,
    connectInferenceWebSocket,
    getVideoFile,
    inputSource,
    isOakStreaming,
    isProcessing,
    isRealtime,
    processFrameTick,
    processVideoOnBackend,
    selectedModel,
    startInferenceOnUploadedVideo,
    stopInference,
    setWarningMessage,
    validateInferenceReadiness,
    backendVideoProcessing.status,
    backendVideoProcessing.jobId,
    uploadedVideoInfo?.jobId,
    videoRef,
  ]);

  const processBatch = useCallback(async () => {
    if (!selectedModel || batchFiles.length === 0) {
      addTerminalLog('❌ No trained model is available yet, or no batch files were added');
      return;
    }
    const model = models.find((m) => m.id === selectedModel);
    if (!model) {
      addTerminalLog('❌ Selected model not found');
      return;
    }

    const requestedTypes = getRequestedModelTypes(model);
    const selectedRoiIds = getInferenceRoiIds();
    const readiness = validateInferenceReadiness();
    if (!readiness.ok) {
      setWarningMessage(readiness.message);
      return;
    }

    setIsBatchProcessing(true);
    setBatchProcessingProgress(0);
    const results: BatchResult[] = [];

    for (let i = 0; i < batchFiles.length; i += 1) {
      const file = batchFiles[i];
      addTerminalLog(`Processing file ${i + 1}/${batchFiles.length}: ${file.name}`);
      try {
        const base64Data = await fileToBase64(file);
        const response = await authFetch(`${apiBase}/api/inference/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model_id: selectedModel,
            frame_data: `data:image/jpeg;base64,${base64Data}`,
            session_id: model.session_id,
            roi_ids: selectedRoiIds,
            model_types: requestedTypes,
            inference_order: requestedTypes,
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          results.push({ success: false, error: errorText, file_name: file.name });
        } else {
          const result = await response.json();
          setProcessedFrame(result.processed_frame || '');
          const newAnomalies = countAnomalies(result.predictions as InferencePrediction[] | undefined);
          setInferenceStats((prev) => ({
            ...prev,
            totalFrames: prev.totalFrames + 1,
            avgTime:
              (prev.avgTime * prev.totalFrames + (result.inference_time || 0)) /
              (prev.totalFrames + 1),
            anomalies: newAnomalies,
            lastInferenceTime: result.inference_time || 0,
            totalAnomalies: prev.totalAnomalies + newAnomalies,
          }));
          setPredictions(result.predictions || []);
          results.push({
            success: true,
            inference_time: result.inference_time,
            anomalies: newAnomalies,
            file_name: file.name,
          });
        }
      } catch (error) {
        results.push({ success: false, error: String(error), file_name: file.name });
      }
      setBatchProcessingProgress(((i + 1) / batchFiles.length) * 100);
    }

    setBatchResults(results);
    setIsBatchProcessing(false);
    addTerminalLog(
      `Batch processing completed. Processed ${results.filter((r) => r.success).length} of ${batchFiles.length} files.`
    );
  }, [
    addTerminalLog,
    apiBase,
    batchFiles,
    getInferenceRoiIds,
    getRequestedModelTypes,
    models,
    selectedModel,
    setWarningMessage,
    validateInferenceReadiness,
  ]);

  const handleBatchFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setBatchFiles(files);
      addTerminalLog(`✅ Selected ${files.length} files for batch processing`);
    },
    [addTerminalLog]
  );

  const canBrowserPlayVideo = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      video.oncanplay = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      video.src = url;
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(false);
      }, 3000);
    });
  }, []);

  const handleInferenceVideoUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      resetInferenceResults({ clearFrame: true, clearVideo: true });
      setUploadedVideoInfo(null);

      addTerminalLog(`📤 Uploading video: ${file.name}`);
      if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|avi|mov|mkv|webm|flv|wmv)$/i)) {
        addTerminalLog('❌ Please upload a valid video file');
        return;
      }

      const url = URL.createObjectURL(file);
      onVideoLoaded(file, url);
      onInputSourceChange('upload');

      const canPlay = await canBrowserPlayVideo(file);
      if (canPlay) {
        if (isRealtime) {
          addTerminalLog(`✅ Video uploaded for real-time processing: ${file.name}`);
        } else {
          addTerminalLog(`✅ Video uploaded. Use "Upload for Backend Processing" to start server pipeline.`);
          setUnsupportedVideoFile(file);
          setBackendVideoProcessing(initialBackendState);
        }
      } else {
        addTerminalLog('⚠️ Video format not supported by browser. Using backend processing...');
        setUnsupportedVideoFile(file);
        await processVideoOnBackend(file, false);
      }
    },
    [
      addTerminalLog,
      canBrowserPlayVideo,
      isRealtime,
      onInputSourceChange,
      onVideoLoaded,
      processVideoOnBackend,
      resetInferenceResults,
    ]
  );

  // Download model function
  const downloadModel = async (modelId: string, modelInfo?: InferenceModel) => {
    try {
      const model = modelInfo ?? models.find((item) => item.id === modelId);
      if (!model) return;

      const availableTypes = getAvailableModelTypes(model);
      const resolvedType =
        selectedModel === model.id && selectedModelType && availableTypes.includes(selectedModelType)
          ? selectedModelType
          : availableTypes[0] || '';

      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadError('');
      setSelectedModelForDownload(model);
      setDownloadDebugInfo({
        modelId: model.id,
        modelType: resolvedType,
        sessionId: model.session_id || '',
        availableTypes,
      });
      setShowDownloadPopup(true);
      addTerminalLog(
        `[DOWNLOAD_DEBUG] model=${model.id} type=${resolvedType || 'none'} session=${model.session_id || 'unknown'
        } available=${availableTypes.join(',') || 'none'}`
      );
    } catch (error) {
      console.error('Error preparing download:', error);
      addTerminalLog(`❌ Error preparing download: ${error}`);
    }
  };

  // Updated and improved startModelDownload function
  const startModelDownload = async () => {
    if (!selectedModelForDownload) return;

    try {
      setIsDownloading(true);
      setDownloadError('');
      setDownloadProgress(20);
      addTerminalLog(`📥 Starting download for model: ${selectedModelForDownload.id}`);

      // Construct the download URL
      const downloadUrl = `${apiBase}/api/inference/models/${encodeURIComponent(
        selectedModelForDownload.id
      )}/download`;

      // Method 1: Direct download using anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `dime_model_${selectedModelForDownload.id}_${Date.now()}.zip`;

      // Add to document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        addTerminalLog(`✅ Download triggered for model: ${selectedModelForDownload.id}`);
        setShowDownloadPopup(false);
        setIsDownloading(false);
      }, 1000);

      // Optional: Fallback method using fetch for better error handling
      setTimeout(async () => {
        try {
          // Check if download actually started
          const response = await fetch(downloadUrl, { method: 'HEAD' });
          if (!response.ok) {
            const friendlyMessage =
              response.status === 404
                ? 'Model package is not available yet. Model export files are missing or incomplete.'
                : `Download failed: ${response.status} ${response.statusText}`;
            setDownloadError(friendlyMessage);
            addTerminalLog(`⚠️ Server returned ${response.status} ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error('Download check failed:', fetchError);
          setDownloadError('Unable to verify the export package. Check whether the model finished training and produced export files.');
        }
      }, 2000);

    } catch (error) {
      console.error('Error downloading model:', error);
      // addTerminalLog(`❌ Download failed: ${error.message || error}`);
      setIsDownloading(false);
    }
  };


  // Poll latest frame while backend processing is active
  useEffect(() => {
    if (!backendVideoProcessing.isProcessing || backendVideoProcessing.status !== 'processing') return;
    if (!backendVideoProcessing.jobId) return;

    let pollInFlight = false;
    const pollLatestFrame = async () => {
      if (pollInFlight) return;
      pollInFlight = true;
      try {
        await fetchLatestProcessedFrame(backendVideoProcessing.jobId);
      } finally {
        pollInFlight = false;
      }
    };

    void pollLatestFrame();
    const pollId = setInterval(() => {
      void pollLatestFrame();
    }, 500);
    return () => clearInterval(pollId);
  }, [
    backendVideoProcessing.isProcessing,
    backendVideoProcessing.jobId,
    backendVideoProcessing.status,
    fetchLatestProcessedFrame,
  ]);

  useEffect(() => {
    if (!backendVideoProcessing.isProcessing || backendVideoProcessing.status !== 'processing') return;
    if (!backendVideoProcessing.jobId) return;

    let pollInFlight = false;
    const pollStatus = async () => {
      if (pollInFlight) return;
      pollInFlight = true;
      try {
        await fetchBackendVideoStatus(backendVideoProcessing.jobId);
      } finally {
        pollInFlight = false;
      }
    };

    void pollStatus();
    const pollId = setInterval(() => {
      void pollStatus();
    }, 1000);

    return () => clearInterval(pollId);
  }, [
    backendVideoProcessing.isProcessing,
    backendVideoProcessing.jobId,
    backendVideoProcessing.status,
    fetchBackendVideoStatus,
  ]);

  // Cleanup all resources
  useEffect(() => {
    return () => {
      if (inferenceIntervalRef.current) clearInterval(inferenceIntervalRef.current);
      if (inferenceWebSocketRef.current) inferenceWebSocketRef.current.close();
      if (backendVideoWebSocketRef.current) backendVideoWebSocketRef.current.close();
      if (activeFrameAbortControllerRef.current) {
        activeFrameAbortControllerRef.current.abort();
      }
      if (processedVideoUrlRef.current) {
        URL.revokeObjectURL(processedVideoUrlRef.current);
      }
    };
  }, []);

  return {
    models,
    selectedModel,
    setSelectedModel,
    selectedModelType,
    setSelectedModelType,
    selectedModelAvailableTypes,
    getModelTypeLabel,
    loadedModels,
    loadedModelTypesById,
    isModelLoaded,
    loadedModelInfo,
    selectedModelInfo,
    modelLoading,
    connectionError,
    isProcessing,
    isRealtime,
    setIsRealtime,
    processedFrame,
    setProcessedFrame,
    processedVideoUrl,
    inferenceStats,
    predictions,
    advancedSettings,
    setAdvancedSettings,
    batchFiles,
    batchResults,
    isBatchProcessing,
    batchProcessingProgress,
    backendVideoProcessing,
    uploadedVideoInfo,
    unsupportedVideoFile,
    showDownloadPopup,
    setShowDownloadPopup,
    selectedModelForDownload,
    isDownloading,
    downloadProgress,
    downloadError,
    downloadDebugInfo,
    inferenceWarning,
    loadModels,
    fetchLoadedModels,
    loadSpecificModel,
    unloadModel,
    processFrameWithRetry,
    toggleRealtimeInference,
    stopInference,
    processBatch,
    handleBatchFileUpload,
    processVideoOnBackend,
    startInferenceOnUploadedVideo,
    cancelBackendVideoProcessing,
    stopBackendVideoProcessing,
    dismissBackendVideoError,
    handleInferenceVideoUpload,
    validateInferenceReadiness,
    fetchLatestProcessedFrame,
    fetchProcessedFrame,
    fetchProcessedVideoFromBackend,
    downloadProcessedVideo,
    downloadModel,
    startModelDownload,
  };
}
