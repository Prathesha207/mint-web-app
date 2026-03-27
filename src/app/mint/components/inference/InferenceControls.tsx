'use client';

import { motion } from 'framer-motion';
import { Activity, Loader2, Play, Upload, Zap } from 'lucide-react';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  InferenceInputSource,
  InferenceModel,
  InferencePrediction,
  InferenceStats,
  UploadedVideoInfo,
} from '../../hooks/useInference';
import { UploadedVideoProcessingModal } from '../BackendVideoProcessingUI';

interface InferenceControlsProps {
  activeTab: 'live' | 'batch';
  onActiveTabChange: (tab: 'live' | 'batch') => void;
  inputSource: InferenceInputSource;
  videoFile: File | null;
  isRealtime: boolean;
  setIsRealtime: Dispatch<SetStateAction<boolean>>;
  selectedModel: string;
  selectedModelInfo?: InferenceModel;
  selectedModelAvailableTypes: Array<'motion' | 'anomaly'>;
  isOakStreaming: boolean;
  modelLoading: boolean;
  connectionError: boolean;
  isProcessing: boolean;
  inferenceWarning: string;
  backendVideoStatus: 'idle' | 'uploaded' | 'processing' | 'paused' | 'completed' | 'error';
  uploadedVideoInfo: UploadedVideoInfo | null;
  predictions: InferencePrediction[];
  inferenceStats: InferenceStats;
  onToggleRealtimeInference: () => void;
  onProcessSingleFrame: () => void;
  onUploadVideoForBackend: () => void;
  onStartUploadedVideoInference: () => void;
  onCancelBackendVideo: () => void;
  batchFiles: File[];
  isBatchProcessing: boolean;
  onBatchFilesSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  onProcessBatch: () => void;
}

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);


export default function InferenceControls({
  activeTab,
  onActiveTabChange,
  inputSource,
  videoFile,
  isRealtime,
  setIsRealtime,
  selectedModel,
  selectedModelInfo,
  selectedModelAvailableTypes,
  isOakStreaming,
  modelLoading,
  connectionError,
  isProcessing,
  inferenceWarning,
  backendVideoStatus,
  uploadedVideoInfo,
  predictions,
  inferenceStats,
  onToggleRealtimeInference,
  onProcessSingleFrame,
  onUploadVideoForBackend,
  onStartUploadedVideoInference,
  onCancelBackendVideo,
  batchFiles,
  isBatchProcessing,
  onBatchFilesSelected,
  onProcessBatch,
}: InferenceControlsProps) {
  const trainedTypesSource =
    Array.isArray(selectedModelInfo?.training_options) &&
      selectedModelInfo.training_options.length > 0
      ? selectedModelInfo.training_options
      : selectedModelAvailableTypes;

  const trainedTypesLabel =
    trainedTypesSource
      .filter((type): type is string => typeof type === 'string' && type.length > 0)
      .map(toTitleCase)
      .join(' / ') || 'None';

  const inferenceTypesLabel =
    (Array.isArray(selectedModelInfo?.model_types) && selectedModelInfo!.model_types.length > 0
      ? selectedModelInfo!.model_types
      : selectedModelAvailableTypes
    )
      .map(toTitleCase)
      .join(' / ') || 'None';

  const isLiveDisabled =
    !selectedModel ||
    (inputSource === 'oak' && !isOakStreaming) ||
    modelLoading ||
    connectionError;

  const primaryActionLabel =
    videoFile && inputSource === 'upload' && !isRealtime
      ? 'Start Backend Inference'
      : 'Start Live Inference';

  const activePredictions = predictions.filter((prediction) => prediction.is_anomaly);
  const totalDetectedAnomalies = Math.max(
    inferenceStats.totalAnomalies,
    inferenceStats.anomalies,
    activePredictions.length
  );
  const hasBackendVideoSummary =
    backendVideoStatus === 'processing' ||
    backendVideoStatus === 'completed' ||
    backendVideoStatus === 'paused';
  const detectionSummary = activePredictions.reduce<Record<string, number>>((summary, prediction) => {
    const nextType =
      typeof prediction.type === 'string' && prediction.type.length > 0
        ? prediction.type
        : 'general';
    summary[nextType] = (summary[nextType] || 0) + 1;
    return summary;
  }, {});

  const visiblePredictions = activePredictions.slice(0, 3);
  const getPredictionLabel = (prediction: InferencePrediction) => {
    if (typeof prediction.message === 'string' && prediction.message.trim().length > 0) {
      return prediction.message.trim();
    }
    if (prediction.type === 'motion') {
      const roiName =
        typeof prediction.roi_name === 'string' && prediction.roi_name.trim().length > 0
          ? prediction.roi_name
          : typeof prediction.label === 'string' && prediction.label.trim().length > 0
            ? prediction.label
            : 'ROI';
      return `Motion anomaly in ${roiName}`;
    }
    if (prediction.type === 'anomaly') {
      if (typeof prediction.score === 'number') {
        return `Anomaly score ${prediction.score.toFixed(3)}`;
      }
      return 'Anomaly detected';
    }
    if (typeof prediction.label === 'string' && prediction.label.trim().length > 0) {
      return prediction.label.trim();
    }
    return 'Detection received from backend';
  };

  return (
    <>
      <motion.div
        key="inference-controls"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-white/5 bg-zinc-900/40 p-3"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Inference Controls
            </h3>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {/* <div className="grid grid-cols-2 gap-2">
            {(['live', 'batch'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onActiveTabChange(tab)}
                  className={`rounded-lg border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors ${active
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                    : 'border-white/10 bg-zinc-950 text-zinc-500 hover:text-zinc-200'
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div> */}
          <div className="space-y-2 rounded-lg border border-white/5 bg-black/20 p-3 text-[11px]">
            <div className="flex items-center justify-between gap-3">
              <span className="uppercase tracking-[0.18em] text-zinc-500">Trained</span>
              <span className="text-right text-zinc-200">{trainedTypesLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="uppercase tracking-[0.18em] text-zinc-500">Inference</span>
              <span className="text-right text-zinc-300">{inferenceTypesLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="uppercase tracking-[0.18em] text-zinc-500">Results</span>
              <span className="text-right text-zinc-300">
                {hasBackendVideoSummary && totalDetectedAnomalies > 0
                  ? `${totalDetectedAnomalies} anomaly${totalDetectedAnomalies === 1 ? '' : 'ies'} found`
                  : activePredictions.length > 0
                    ? `${activePredictions.length} alert${activePredictions.length === 1 ? '' : 's'}`
                    : backendVideoStatus === 'processing' || isProcessing
                      ? 'Watching feed...'
                      : 'Idle'}
              </span>
            </div>

            {Object.entries(detectionSummary).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(detectionSummary).map(([type, count]) => (
                  <span
                    key={type}
                    className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[10px] font-medium text-rose-200"
                  >
                    {toTitleCase(type)} {count}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              {visiblePredictions.length > 0 ? (
                visiblePredictions.map((prediction, index) => (
                  <div
                    key={`${prediction.type || 'result'}-${index}`}
                    className="rounded-md border border-rose-500/15 bg-rose-500/5 px-2.5 py-2 text-[10px] text-rose-100"
                  >
                    {getPredictionLabel(prediction)}
                  </div>
                ))
              ) : hasBackendVideoSummary && totalDetectedAnomalies > 0 ? (
                <div className="rounded-md border border-rose-500/15 bg-rose-500/5 px-2.5 py-2 text-[10px] text-rose-100">
                  Backend video inference found {totalDetectedAnomalies} anomaly
                  {totalDetectedAnomalies === 1 ? '' : 'ies'} in this run.
                </div>
              ) : (
                <div className="rounded-md border border-white/5 bg-zinc-950/70 px-2.5 py-2 text-[10px] text-zinc-500">
                  Start inference to surface anomaly and motion results here.
                </div>
              )}
            </div>
          </div>

          {inferenceWarning && (
            <div className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-2 text-[11px] text-amber-200">
              {inferenceWarning}
            </div>
          )}

          {videoFile && inputSource === 'upload' && (
            <div className="space-y-3 rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Video Processing
                </span>
                <button
                  type="button"
                  onClick={() => setIsRealtime((prev) => !prev)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${isRealtime ? 'bg-blue-600' : 'bg-zinc-700'
                    }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${isRealtime ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              {!isRealtime ? (
                <>
                  <button
                    type="button"
                    onClick={onUploadVideoForBackend}
                    disabled={!videoFile || !selectedModel || modelLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Backend for Processing
                  </button>
                  <div className="text-[11px] text-zinc-500">
                    Upload the selected video to the backend pipeline, then continue from the popup.
                  </div>
                </>
              ) : (
                <div className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-2 text-[11px] text-blue-200">
                  Real-time mode processes the playing video frame by frame in the viewer.
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={onToggleRealtimeInference}
                disabled={isLiveDisabled}
                className={`w-full rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${isProcessing
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : isLiveDisabled
                    ? 'cursor-not-allowed bg-zinc-800 text-zinc-600'
                    : 'bg-[#171717] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.3)] hover:bg-[#222]'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
                    Stop Inference
                  </>
                ) : (
                  <>
                    <Play className="mr-2 inline h-3.5 w-3.5" />
                    {primaryActionLabel}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onProcessSingleFrame}
                disabled={!selectedModel || isProcessing || modelLoading || connectionError}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
              >
                Process Single Frame
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onBatchFilesSelected}
                  className="hidden"
                  id="mint-inference-batch-upload"
                />
                <label
                  htmlFor="mint-inference-batch-upload"
                  className="block w-full cursor-pointer rounded-lg bg-blue-600 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
                >
                  <Upload className="mr-2 inline h-3.5 w-3.5" />
                  Select Batch Files
                </label>
                {batchFiles.length > 0 && (
                  <div className="mt-2 text-[11px] text-zinc-500">
                    {batchFiles.length} file{batchFiles.length === 1 ? '' : 's'} selected
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onProcessBatch}
                disabled={!selectedModel || batchFiles.length === 0 || isBatchProcessing || modelLoading}
                className={`w-full rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${isBatchProcessing
                  ? 'cursor-wait bg-amber-600 text-white'
                  : !selectedModel || batchFiles.length === 0 || modelLoading
                    ? 'cursor-not-allowed bg-zinc-800 text-zinc-600'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
              >
                {isBatchProcessing ? (
                  <>
                    <Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />
                    Processing Batch...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 inline h-3.5 w-3.5" />
                    Start Batch Inference
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <UploadedVideoProcessingModal
        open={Boolean(uploadedVideoInfo)}
        uploadedVideoInfo={uploadedVideoInfo}
        onClose={onCancelBackendVideo}
        onStartInference={onStartUploadedVideoInference}
        isStarting={backendVideoStatus === 'processing' || isProcessing}
      />
    </>
  );
}
