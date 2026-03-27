'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Camera, Target, Brain, Play, Pause,
  Square, Trash2, Save, RefreshCw,
  Settings, Layers, Plus, Eye, Zap, Cpu,
  MousePointer, Video, Film, CheckCircle, Grid3x3,
  Download, SkipBack, SkipForward, Volume2, VolumeX,
  Power, PowerOff, Radio, Terminal, X, Copy, Clock, AlertCircle,
  Activity, Shield, ZapIcon, EyeIcon, CpuIcon, BrainCircuit,
  FileImage, FileVideo, Check, XCircle, AlertTriangle, ChevronDown,
  Loader2, Sparkles, BarChart, Cpu as CpuIcon2, Settings as SettingsIcon,
  Menu, ChevronRight, Smartphone, Tablet, Monitor, Maximize2,
  Minimize2, EyeOff, Filter, Grid, Layout, List, PanelLeft,
  PanelRight, Smartphone as Mobile, Monitor as Desktop,
  Code,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

interface Point {
  x: number;
  y: number;
}

interface ROI {
  id: string;
  type: 'rectangle' | 'polygon';
  points: Point[];
  label: string;
  color: string;
}

interface CameraDevice {
  mxid: string;
  name: string;
  state: string;
}

interface ModelInfo {
  id: string;
  name: string;
  display_name: string;
  path: string;
  created_at: string;
  session_id: string;
  rois_trained: string[];
  status: string;
  has_results: boolean;
}

interface LoadedModel {
  model_id: string;
  name: string;
  loaded_at: string;
  is_dummy: boolean;
  has_multi_roi: boolean;
}


interface RemoteCameraSession {
  sessionId: string;
  connected: boolean;
  lastFrameTime: number;
  frameCount: number;
  deviceInfo?: string;
}

interface RemoteCameraSession {
  sessionId: string;
  connected: boolean;
  lastFrameTime: number;
  frameCount: number;
  deviceInfo?: string;
}


export default function InferenceClientPage() {
  // State management
  const [activeTab, setActiveTab] = useState<'live' | 'batch'>('live');
  const [inputSource, setInputSource] = useState<'upload' | 'camera' | 'oak'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [rois, setRois] = useState<ROI[]>([]);
  const [selectedROI, setSelectedROI] = useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Inference states
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedModelType, setSelectedModelType] = useState<'motion' | 'anomaly' | ''>('');
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [processedFrame, setProcessedFrame] = useState<string>('');
  const [inferenceStats, setInferenceStats] = useState({
    totalFrames: 0,
    avgTime: 0,
    anomalies: 0,
    lastInferenceTime: 0,
    totalAnomalies: 0
  });
  const [predictions, setPredictions] = useState<any[]>([]);
  const [modelLoading, setModelLoading] = useState(false);

  // OAK Camera states
  const [oakCameraState, setOakCameraState] = useState<'idle' | 'streaming' | 'error'>('idle');
  const [oakDevices, setOakDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isOakStreaming, setIsOakStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string>('');

  // Terminal/logs
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Batch processing
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState({
    threshold: 0.5,
    tileRows: 2,
    tileCols: 2,
    tileOverlap: 0.1,
    parallelTiles: true,
    numWorkers: 4,
    useReferenceFrame: true,
    maskAlpha: 0.5,
    skipFrames: 0
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Debug states
  const [showRawImage, setShowRawImage] = useState(false);
  const [lastImageSize, setLastImageSize] = useState({ width: 0, height: 0 });
  const [connectionError, setConnectionError] = useState(false);

  // Camera selection states
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const [isLoadingCameras, setIsLoadingCameras] = useState(false);
  const [currentCameraStream, setCurrentCameraStream] = useState<MediaStream | null>(null);

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'models' | 'input' | 'controls' | 'settings' | 'stats'>('models');
  const [layoutMode, setLayoutMode] = useState<'split' | 'single'>('split');

  // Fullscreen popup states - UPDATED
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(false);
  const [popupCurrentFrame, setPopupCurrentFrame] = useState<'original' | 'processed'>('processed'); // Default to processed
  const [popupOriginalFrame, setPopupOriginalFrame] = useState<string>('');
  const [popupProcessedFrame, setPopupProcessedFrame] = useState<string>('');
  const [isLiveView, setIsLiveView] = useState(true); // Auto-refresh in popup
  const [lastFrameUpdateTime, setLastFrameUpdateTime] = useState<number>(0);

  // Video processing states
  const [unsupportedVideoFile, setUnsupportedVideoFile] = useState<File | null>(null);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [videoProcessingProgress, setVideoProcessingProgress] = useState(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string>('');
  const [processedVideoBlob, setProcessedVideoBlob] = useState<Blob | null>(null);
  const [videoProcessingStatus, setVideoProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [videoProcessingResult, setVideoProcessingResult] = useState<any>(null);



  // In your component states, add:
  const [remoteCameraSession, setRemoteCameraSession] = useState<RemoteCameraSession | null>(null);
  const [remoteCameraFrame, setRemoteCameraFrame] = useState<string | null>(null);
  const [remotePollingInterval, setRemotePollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [remoteCameraActive, setRemoteCameraActive] = useState(false);
  const [remoteCameraStatus, setRemoteCameraStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showQRCode, setShowQRCode] = useState(false);

  // Backend video processing states
  interface BackendVideoProcessingState {
    jobId: string;
    isProcessing: boolean;
    progress: number;
    currentFrame: number;
    totalFrames: number;
    totalAnomalies: number;
    status: 'idle' | 'uploaded' | 'processing' | 'completed' | 'error';
    message: string;
    frameData: any[];
    outputVideoUrl: string;
    websocket: WebSocket | null;
    uploadedFileName?: string;
    uploadedFileSize?: string;
    uploadedAt?: string;
  }

  const [backendVideoProcessing, setBackendVideoProcessing] = useState<BackendVideoProcessingState>({
    jobId: '',
    isProcessing: false,
    progress: 0,
    currentFrame: 0,
    totalFrames: 0,
    totalAnomalies: 0,
    status: 'idle',
    message: '',
    frameData: [],
    outputVideoUrl: '',
    websocket: null
  });

  // Batch processing progress
  const [batchProcessingProgress, setBatchProcessingProgress] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const processedContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const oakStreamRef = useRef<HTMLImageElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inferenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inferenceWebSocketRef = useRef<WebSocket | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const processedImageRef = useRef<HTMLImageElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenImageRef = useRef<HTMLImageElement>(null);
  const popupRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:8000';

  // Colors for visualizations
  const roiColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#f97316'];

  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedModelForDownload, setSelectedModelForDownload] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Download model function
  const downloadModel = async (modelId: string, modelInfo: any) => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setSelectedModelForDownload(modelInfo);
      setShowDownloadPopup(true);
      startModelDownload()

      // We'll show the popup first, let user decide when to download
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
      addTerminalLog(`📥 Starting download for model: ${selectedModelForDownload.id}`);

      // Construct the download URL
      const protocol = window.location.protocol === 'http:' ? 'http:' : 'http:';
      const downloadUrl = `${protocol}//${NEXT_PUBLIC_BACKEND_URL}/api/inference/models/${selectedModelForDownload.id}/download`;

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
            addTerminalLog(`⚠️ Server returned ${response.status} ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error('Download check failed:', fetchError);
        }
      }, 2000);

    } catch (error) {
      console.error('Error downloading model:', error);
      // addTerminalLog(`❌ Download failed: ${error.message || error}`);
      setIsDownloading(false);
    }
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayoutMode('single');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) drawingContextRef.current = ctx;
    }

    if (processedCanvasRef.current) {
      const ctx = processedCanvasRef.current.getContext('2d');
      if (ctx) processedContextRef.current = ctx;
    }

    loadModels();
    fetchLoadedModels();
    checkBackendConnection();
    listOakDevices();
    listAvailableCamerasOnMount();

    // Initial logs
    addTerminalLog('Vision AI Inference System Initialized');
    addTerminalLog('======================================');
    addTerminalLog('1. Select a trained model from the dropdown');
    addTerminalLog('2. Choose input source (upload, camera, or OAK)');
    addTerminalLog('3. Toggle real-time processing on/off');
    addTerminalLog('4. View inference results on the processed feed');
    addTerminalLog('======================================');

    return () => {
      if (inferenceIntervalRef.current) {
        clearInterval(inferenceIntervalRef.current);
      }
      if (inferenceWebSocketRef.current) {
        inferenceWebSocketRef.current.close();
      }
      if (currentCameraStream) {
        stopCamera();
      }
      if (backendVideoProcessing.websocket) {
        backendVideoProcessing.websocket.close();
      }
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
      }
    };
  }, []);



  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };


  // Generate session ID for remote camera
  const generateSessionId = () => {
    return `remote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Start remote camera session
  const startRemoteCameraSession = () => {
    const sessionId = generateSessionId();
    const session: RemoteCameraSession = {
      sessionId,
      connected: false,
      lastFrameTime: Date.now(),
      frameCount: 0
    };

    setRemoteCameraSession(session);
    setShowQRCode(true);
    setInputSource('upload'); // Set to upload mode for remote
    setRemoteCameraActive(true);
    setRemoteCameraStatus('connecting');

    // Generate mobile URL
    const baseUrl = window.location.origin;
    const mobileUrl = `${baseUrl}/mobile-camera?session=${sessionId}`;

    addTerminalLog(`📱 Remote camera session started: ${sessionId}`);
    addTerminalLog(`📱 Mobile URL: ${mobileUrl}`);
    addTerminalLog(`📱 Scan the QR code with your phone to connect`);

    // Start polling for frames
    startRemoteFramePolling(sessionId);

    return mobileUrl;
  };

  // Start polling for remote frames
  const startRemoteFramePolling = (sessionId: string) => {
    // Clear any existing interval
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
    }

    // Poll every 200ms for smooth streaming
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/frame/${sessionId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.frame && data.timestamp) {
            // Create image from base64
            const img = new Image();
            img.onload = () => {
              // Update video dimensions
              setVideoDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight
              });

              // Update frame state
              setRemoteCameraFrame(data.frame);
              setRemoteCameraStatus('connected');
            };
            img.src = `data:image/jpeg;base64,${data.frame}`;

            // Update session
            setRemoteCameraSession(prev => prev ? {
              ...prev,
              connected: true,
              lastFrameTime: data.timestamp,
              frameCount: prev.frameCount + 1,
              deviceInfo: data.deviceInfo
            } : null);
          }
        }
      } catch (error) {
        console.error('Error polling remote frame:', error);

        // If no frame for 5 seconds, mark as disconnected
        if (remoteCameraSession && Date.now() - remoteCameraSession.lastFrameTime > 5000) {
          setRemoteCameraStatus('disconnected');
          setRemoteCameraSession(prev => prev ? { ...prev, connected: false } : null);
        }
      }
    }, 200); // 5 FPS polling for inference

    setRemotePollingInterval(interval);
  };

  // Stop remote camera
  const stopRemoteCamera = () => {
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
      setRemotePollingInterval(null);
    }

    if (remoteCameraSession) {
      // Notify backend to clean up
      fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/stop/${remoteCameraSession.sessionId}`, {
        method: 'POST'
      }).catch(console.error);
    }

    setRemoteCameraActive(false);
    setRemoteCameraStatus('disconnected');
    setRemoteCameraSession(null);
    setShowQRCode(false);
    setRemoteCameraFrame(null);

    addTerminalLog('📱 Remote camera stopped');
  };

  // Update input source change handler
  const handleInputSourceChange = (newSource: 'upload' | 'camera' | 'oak') => {
    // Stop camera if switching away from camera
    if (inputSource === 'camera' && newSource !== 'camera') {
      stopCamera();
    }

    // Stop OAK camera if switching away from OAK
    if (inputSource === 'oak' && newSource !== 'oak') {
      if (isOakStreaming) {
        stopOakCamera();
      }
    }

    // Stop remote camera if switching away from remote
    if (remoteCameraActive && newSource !== 'upload') {
      stopRemoteCamera();
    }

    setInputSource(newSource);
    setShowCameraSelection(false);
  };

  // Check if browser can play video
  const canBrowserPlayVideo = (file: File): Promise<boolean> => {
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

      // Timeout after 3 seconds
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(false);
      }, 3000);
    });
  };

  // Process video on backend for unsupported formats
  const processVideoOnBackend = async (file: File, startInference = false) => {
    if (!selectedModel) {
      addTerminalLog('❌ Please select a model first');
      return null;
    }

    try {
      addTerminalLog(`📤 Uploading video to backend: ${file.name}`);

      const formData = new FormData();
      formData.append('model_id', selectedModel);
      formData.append('video', file);
      formData.append('session_id', selectedModelInfo?.session_id || '');
      formData.append('video_name', file.name);
      formData.append('start_inference', startInference.toString());

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/upload-video-only`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();

      if (startInference) {
        // If inference was started immediately, set up WebSocket
        setBackendVideoProcessing(prev => ({
          ...prev,
          jobId: result.job_id,
          isProcessing: true,
          status: 'processing',
          message: result.message
        }));

        // Connect to WebSocket for real-time updates
        connectToVideoWebSocket(result.job_id);
        addTerminalLog(`✅ Video uploaded and inference started: ${result.job_id}`);
      } else {
        // Just uploaded, show popup to start inference
        setUnsupportedVideoFile(file);
        // Then update the processVideoOnBackend function:
        // In the else block (when not starting inference immediately):
        setBackendVideoProcessing(prev => ({
          ...prev,
          jobId: result.job_id,
          isProcessing: false,
          status: 'uploaded',
          message: 'Video uploaded. Ready to start inference.',
          uploadedFileName: file.name,
          uploadedFileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          uploadedAt: new Date().toLocaleTimeString()
        }));


        // Show uploaded video info - NOW PROPERLY TYPED
        setUploadedVideoInfo({
          jobId: result.job_id,
          fileName: file.name,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          uploadedAt: new Date().toLocaleTimeString()
        });

        addTerminalLog(`✅ Video uploaded successfully. Job ID: ${result.job_id}`);
      }

      return result.job_id;

    } catch (error) {
      console.error('Error uploading video to backend:', error);
      addTerminalLog(`❌ Error: ${error}`);
      setBackendVideoProcessing(prev => ({
        ...prev,
        status: 'error',
        message: `Error: ${error}`
      }));
      return null;
    }
  };

  // Add this interface at the top of your component, after the other interfaces
  interface UploadedVideoInfo {
    jobId: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
  }

  // Then update the state declaration
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<UploadedVideoInfo | null>(null);

  // Add function to start inference on uploaded video
  const startInferenceOnUploadedVideo = async () => {
    const jobId = backendVideoProcessing.jobId || uploadedVideoInfo?.jobId;

    if (!jobId || !selectedModel) {
      addTerminalLog('❌ No video uploaded or model selected');
      return;
    }

    try {
      addTerminalLog(`🚀 Starting inference on uploaded video...`);

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/start-video-inference/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: selectedModel,
          session_id: selectedModelInfo?.session_id || '',
          threshold: advancedSettings.threshold,
          tile_rows: advancedSettings.tileRows,
          tile_cols: advancedSettings.tileCols,
          parallel_tiles: advancedSettings.parallelTiles,
          skip_frames: advancedSettings.skipFrames
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();

      setBackendVideoProcessing(prev => ({
        ...prev,
        jobId: jobId,
        isProcessing: true,
        status: 'processing',
        message: 'Inference started. Processing frames...'
      }));

      // Clear uploaded video info and popup
      setUploadedVideoInfo(null);
      setUnsupportedVideoFile(null);

      // Connect to WebSocket for real-time updates
      connectToVideoWebSocket(jobId);

      addTerminalLog(`✅ Inference started successfully`);

    } catch (error) {
      console.error('Error starting inference:', error);
      addTerminalLog(`❌ Error: ${error}`);
    }
  };

  // Update the WebSocket connection to handle frame streaming
  const connectToVideoWebSocket = (jobId: string) => {
    const protocol = window.location.protocol === 'http:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${NEXT_PUBLIC_BACKEND_URL}/api/inference/video-stream/${jobId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      addTerminalLog('✅ Connected to video processing WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'frame') {
          // Update processed frame in real-time
          if (data.processed_frame) {
            setProcessedFrame(data.processed_frame);

            // Update stats
            const frameAnomalies = data.anomalies || 0;
            setInferenceStats(prev => ({
              ...prev,
              totalFrames: prev.totalFrames + 1,
              avgTime: (prev.avgTime * prev.totalFrames + (data.inference_time || 0)) / (prev.totalFrames + 1),
              lastInferenceTime: data.inference_time || 0,
              anomalies: frameAnomalies,
              totalAnomalies: prev.totalAnomalies + frameAnomalies
            }));

            // Update backend processing progress
            setBackendVideoProcessing(prev => ({
              ...prev,
              currentFrame: data.frame_number || prev.currentFrame + 1,
              progress: data.progress || prev.progress
            }));

            addTerminalLog(`📊 Frame ${data.frame_number} processed - Anomalies: ${frameAnomalies}`);
          }

        } else if (data.type === 'progress') {
          setBackendVideoProcessing(prev => ({
            ...prev,
            progress: data.progress,
            currentFrame: data.current_frame,
            totalFrames: data.total_frames,
            totalAnomalies: data.total_anomalies,
            message: data.message
          }));

          // Also fetch the latest frame to display
          fetchLatestProcessedFrame(jobId);

        } else if (data.type === 'completed') {
          addTerminalLog(`🎉 Video processing completed!`);

          setBackendVideoProcessing(prev => ({
            ...prev,
            isProcessing: false,
            status: 'completed',
            progress: 100,
            message: data.message
          }));

          // Get and display output video
          fetchProcessedVideoFromBackend(jobId);

        } else if (data.type === 'error') {
          addTerminalLog(`❌ Video processing error: ${data.message}`);
          setBackendVideoProcessing(prev => ({
            ...prev,
            isProcessing: false,
            status: 'error',
            message: data.message
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      addTerminalLog('❌ WebSocket connection error');
    };

    ws.onclose = () => {
      addTerminalLog('🔌 WebSocket disconnected');
    };

    setBackendVideoProcessing(prev => ({
      ...prev,
      websocket: ws
    }));
  };

  // Add function to fetch latest processed frame
  const fetchLatestProcessedFrame = async (jobId: string) => {
    try {
      const response = await fetch(
        `http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/video-job/${jobId}/latest-frame`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.processed_frame) {
          setProcessedFrame(result.processed_frame);

          // Update stats
          setInferenceStats(prev => ({
            ...prev,
            totalFrames: result.current_frame || prev.totalFrames + 1,
            anomalies: result.anomalies || 0,
            totalAnomalies: prev.totalAnomalies + (result.anomalies || 0)
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching latest frame:', error);
    }
  };

  // Add function to fetch specific frame
  const fetchProcessedFrame = async (jobId: string, frameNumber: number) => {
    try {
      const response = await fetch(
        `http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/video-job/${jobId}/frame/${frameNumber}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.processed_frame) {
          setProcessedFrame(result.processed_frame);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error fetching frame:', error);
      return false;
    }
  };

  // Add a polling mechanism for frames (fallback if WebSocket fails)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (backendVideoProcessing.isProcessing && backendVideoProcessing.status === 'processing') {
      // Poll for new frames every 500ms
      intervalId = setInterval(() => {
        if (backendVideoProcessing.jobId) {
          fetchLatestProcessedFrame(backendVideoProcessing.jobId);
        }
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [backendVideoProcessing.isProcessing, backendVideoProcessing.status, backendVideoProcessing.jobId]);


  // Add this to your JSX to show the uploaded video popup
  const renderUploadedVideoPopup = () => {
    // Show popup when video is uploaded (status is 'uploaded') OR when we have uploadedVideoInfo
    if (!uploadedVideoInfo && backendVideoProcessing.status !== 'uploaded') {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center">
                <FileVideo className="w-5 h-5 mr-2 text-green-400" />
                Video Uploaded Successfully
              </h3>
              <button
                onClick={() => {
                  setUploadedVideoInfo(null);
                  setUnsupportedVideoFile(null);
                  setBackendVideoProcessing(prev => ({
                    ...prev,
                    status: 'idle',
                    jobId: ''
                  }));
                }}
                className="p-2 hover:bg-neutral-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="text-sm text-neutral-400 mb-1">File Name</div>
                <div className="font-medium truncate">
                  {unsupportedVideoFile?.name || uploadedVideoInfo?.fileName}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Size</div>
                    <div>
                      {uploadedVideoInfo?.fileSize ||
                        ((unsupportedVideoFile?.size || 0) / (1024 * 1024)).toFixed(2) + ' MB'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Uploaded</div>
                    <div>
                      {uploadedVideoInfo?.uploadedAt || new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-neutral-400 mb-1">Job ID</div>
                  <div className="text-xs font-mono bg-neutral-900 p-2 rounded">
                    {backendVideoProcessing.jobId || uploadedVideoInfo?.jobId}
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-300">
                Your video has been uploaded successfully. You can now start inference processing.
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={startInferenceOnUploadedVideo}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Inference
                </button>

                <button
                  onClick={() => {
                    setUploadedVideoInfo(null);
                    setUnsupportedVideoFile(null);
                    setBackendVideoProcessing(prev => ({
                      ...prev,
                      status: 'idle',
                      jobId: ''
                    }));
                  }}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="text-xs text-neutral-500 text-center">
                Inference will process the video frame by frame and display results in real-time.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fetch processed video from backend
  const fetchProcessedVideoFromBackend = async (jobId: string) => {
    try {
      addTerminalLog('📥 Downloading processed video...');

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/video-result/${jobId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch processed video');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setProcessedVideoUrl(url);
      setProcessedVideoBlob(blob);

      // Set as the video source
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }

      addTerminalLog('✅ Processed video loaded');

    } catch (error) {
      console.error('Error fetching processed video:', error);
      addTerminalLog(`❌ Error downloading video: ${error}`);
    }
  };

  // Download processed video
  const downloadProcessedVideo = () => {
    if (!processedVideoBlob) {
      addTerminalLog('❌ No processed video available to download');
      return;
    }

    try {
      const url = URL.createObjectURL(processedVideoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processed_${unsupportedVideoFile?.name || 'output.mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addTerminalLog('✅ Video download started');
    } catch (error) {
      console.error('Error downloading video:', error);
      addTerminalLog(`❌ Error downloading video: ${error}`);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    addTerminalLog(`📤 Uploading video: ${file.name}`);

    // Check if it's a video file
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|avi|mov|mkv|webm|flv|wmv)$/i)) {
      addTerminalLog('❌ Please upload a valid video file');
      return;
    }

    // Always set the video file
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Check if browser can play this video
    const canPlay = await canBrowserPlayVideo(file);

    if (canPlay) {
      // Browser can play it directly
      handleInputSourceChange('upload');
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }

      // If real-time processing is enabled, prepare for real-time inference
      if (isRealtime) {
        addTerminalLog(`✅ Video uploaded for real-time processing: ${file.name}`);
        // We'll handle real-time processing when user clicks "Start Live Inference"
      } else {
        addTerminalLog(`✅ Video uploaded for backend processing: ${file.name}`);
        // For non-realtime, show option to process on backend
        setUnsupportedVideoFile(file);
        setBackendVideoProcessing(prev => ({
          ...prev,
          uploadedFileName: file.name,
          uploadedFileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          uploadedAt: new Date().toLocaleTimeString()
        }));
      }
    } else {
      // Browser cannot play it - always use backend
      addTerminalLog(`⚠️ Video format not supported by browser. Using backend processing...`);
      setUnsupportedVideoFile(file);
      await processVideoOnBackend(file, false);
    }
  };

  // Cancel backend video processing
  const cancelBackendVideoProcessing = async () => {
    if (backendVideoProcessing.jobId) {
      try {
        await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/video-job/${backendVideoProcessing.jobId}`, {
          method: 'DELETE',
        });

        addTerminalLog('⏹️ Backend video processing cancelled');
      } catch (error) {
        console.error('Error cancelling video processing:', error);
      }
    }

    setBackendVideoProcessing({
      jobId: '',
      isProcessing: false,
      progress: 0,
      currentFrame: 0,
      totalFrames: 0,
      totalAnomalies: 0,
      status: 'idle',
      message: '',
      frameData: [],
      outputVideoUrl: '',
      websocket: null
    });
  };

  // List available cameras on component mount
  const listAvailableCamerasOnMount = async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
        // Try to select the default camera
        const defaultCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('built-in') ||
          device.deviceId === 'default'
        );

        setSelectedCameraId(defaultCamera?.deviceId || videoDevices[0].deviceId);
      }

      addTerminalLog(`Found ${videoDevices.length} camera(s) on system`);
    } catch (error) {
      console.error('Error listing cameras on mount:', error);
    }
  };

  // List available cameras with permission request
  const listAvailableCameras = async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return [];
    }

    try {
      setIsLoadingCameras(true);

      // Request permission to access camera devices
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the temporary stream immediately
        tempStream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log('Permission request failed, continuing with device enumeration');
      }

      // Then enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
        // Try to select the default camera
        const defaultCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('built-in') ||
          device.deviceId === 'default'
        );

        setSelectedCameraId(defaultCamera?.deviceId || videoDevices[0].deviceId);
      }

      addTerminalLog(`Found ${videoDevices.length} camera(s)`);
      setIsLoadingCameras(false);
      return videoDevices;
    } catch (error) {
      console.error('Error listing cameras:', error);
      addTerminalLog(`❌ Error accessing camera devices: ${error}`);
      setIsLoadingCameras(false);
      return [];
    }
  };

  // Start camera with specific device ID
  const startCamera = async (deviceId?: string) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      addTerminalLog('❌ Camera not available in current environment');
      return;
    }

    try {
      addTerminalLog('Starting webcam...');

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? {
            deviceId: { exact: deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: isMobile ? 'environment' : 'user'
          }
          : {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: isMobile ? 'environment' : 'user'
          },
        audio: false
      };

      // First, stop any existing stream
      if (currentCameraStream) {
        stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentCameraStream(stream);
      setInputSource('camera');
      setShowCameraSelection(false);

      // Give React a moment to update the DOM
      setTimeout(() => {
        if (videoRef.current) {
          // Clear any existing source
          if (videoRef.current.srcObject) {
            videoRef.current.srcObject = null;
          }

          // Set the new stream
          videoRef.current.srcObject = stream;

          // Force play
          videoRef.current.play().catch(e => {
            console.error('Auto-play failed:', e);
            addTerminalLog('⚠ Auto-play blocked, click play manually if needed');
          });

          // Set up metadata listener
          const onLoadedMetadata = () => {
            const width = videoRef.current?.videoWidth || 1280;
            const height = videoRef.current?.videoHeight || 720;
            setVideoDimensions({ width, height });
            updateCanvasDimensions();
            addTerminalLog(`✅ Camera resolution: ${width}x${height}`);

            // Remove listener after use
            videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
          };

          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);

          // Also try to trigger loadedmetadata if it's already available
          if (videoRef.current.readyState >= 1) { // HAVE_ENOUGH_DATA
            onLoadedMetadata();
          }

          addTerminalLog('✅ Webcam started successfully');
        } else {
          addTerminalLog('❌ Video element not found');
        }
      }, 100);

    } catch (error: any) {
      console.error('Error accessing camera:', error);
      addTerminalLog(`❌ Error accessing camera: ${error.message}`);

      // Try with more permissive constraints
      if (deviceId) {
        try {
          addTerminalLog('Trying with permissive constraints...');
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
          });

          setCurrentCameraStream(stream);
          setInputSource('camera');
          setShowCameraSelection(false);

          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(e => {
                console.error('Auto-play failed:', e);
              });
              addTerminalLog('✅ Webcam started with permissive constraints');
            }
          }, 100);
        } catch (fallbackError: any) {
          addTerminalLog(`❌ Could not access camera ${deviceId}: ${fallbackError.message}`);
          alert(`Could not access camera ${deviceId}. Please check permissions and try again.`);
        }
      } else {
        alert('Could not access camera. Please check permissions and try again.');
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCurrentCameraStream(null);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }

    if (inputSource === 'camera') {
      setInputSource('upload');
    }

    addTerminalLog('✅ Camera stopped');
  };

  // Handle camera selection
  const handleCameraSelect = async () => {
    if (!selectedCameraId && availableCameras.length > 0) {
      setSelectedCameraId(availableCameras[0].deviceId);
    }

    if (selectedCameraId) {
      await startCamera(selectedCameraId);
    } else {
      await startCamera();
    }
  };

  // // Handle input source change
  // const handleInputSourceChange = (newSource: 'upload' | 'camera' | 'oak') => {
  //   // Stop camera if switching away from camera
  //   if (inputSource === 'camera' && newSource !== 'camera') {
  //     stopCamera();
  //   }

  //   // Stop OAK camera if switching away from OAK
  //   if (inputSource === 'oak' && newSource !== 'oak') {
  //     if (isOakStreaming) {
  //       stopOakCamera();
  //     }
  //   }

  //   setInputSource(newSource);
  //   setShowCameraSelection(false);
  // };

  // Update canvas dimensions
  const updateCanvasDimensions = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !processedCanvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const processedCanvas = processedCanvasRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

    const aspectRatio = videoDimensions.width / videoDimensions.height;
    let width = containerWidth;
    let height = containerWidth / aspectRatio;

    if (height > containerHeight) {
      height = containerHeight;
      width = containerHeight * aspectRatio;
    }

    const scaleX = width / videoDimensions.width;
    const scaleY = height / videoDimensions.height;
    const newScale = Math.min(scaleX, scaleY);

    const offsetX = (containerWidth - videoDimensions.width * newScale) / 2;
    const offsetY = (containerHeight - videoDimensions.height * newScale) / 2;

    setScale(newScale);
    setOffset({ x: offsetX, y: offsetY });

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    processedCanvas.width = containerWidth;
    processedCanvas.height = containerHeight;
  }, [videoDimensions, isMobile]);

  // Video metadata loaded
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      setVideoDimensions({ width, height });
      updateCanvasDimensions();
      addTerminalLog(`✅ Video loaded: ${width}x${height}`);
    }
  }, [updateCanvasDimensions]);

  // OAK stream loaded
  const handleOakStreamLoad = useCallback(() => {
    if (oakStreamRef.current) {
      const img = oakStreamRef.current;
      setVideoDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      updateCanvasDimensions();
      addTerminalLog(`✅ OAK Stream loaded: ${img.naturalWidth}x${img.naturalHeight}`);
    }
  }, [updateCanvasDimensions]);

  // Resize handler
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  // Load available models
  const loadModels = async () => {
    try {
      addTerminalLog('Loading available models...');
      setModelLoading(true);

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/models`);
      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
        if (data.models && data.models.length > 0) {
          const first = data.models[0];
          setSelectedModel(first.id);

          // 🧠 auto-select best type
          if (first.has_motion) setSelectedModelType('motion');
          else if (first.has_anomaly) setSelectedModelType('anomaly');

          addTerminalLog(`✅ Loaded ${data.models.length} trained models`);
        }

      } else {
        const error = await response.text();
        addTerminalLog(`❌ Failed to load models: ${error}`);
      }
    } catch (error) {
      console.error('Error loading models:', error);
      addTerminalLog(`❌ Error loading models: ${error}`);
      setConnectionError(true);
    } finally {
      setModelLoading(false);
    }
  };

  const fetchLoadedModels = async () => {
    try {
      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/models/loaded`);
      if (response.ok) {
        const data = await response.json();
        setLoadedModels(data.models || []);
      }
    } catch (error) {
      console.error('Error fetching loaded models:', error);
    }
  };

  const checkBackendConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/health`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        addTerminalLog('✅ Backend connected');
        setConnectionError(false);
        return true;
      } else {
        addTerminalLog('❌ Backend health check failed');
        setConnectionError(true);
        return false;
      }
    } catch (error) {
      console.error('Backend connection check failed:', error);
      addTerminalLog('❌ Backend connection failed');
      setConnectionError(true);
      return false;
    }
  };

  const listOakDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/camera/devices');
      if (response.ok) {
        const data = await response.json();
        setOakDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Error listing OAK devices:', error);
    }
  };

  const startOakCamera = async () => {
    try {
      addTerminalLog('Starting OAK camera...');
      const response = await fetch('http://localhost:5000/api/camera/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to start camera');

      setIsOakStreaming(true);
      setOakCameraState('streaming');
      handleInputSourceChange('oak');
      setStreamUrl('http://localhost:5000/api/camera/stream');
      addTerminalLog('✅ OAK Camera started streaming');

    } catch (error) {
      console.error('Error starting OAK camera:', error);
      setOakCameraState('error');
      addTerminalLog(`❌ Error starting OAK camera: ${error}`);
    }
  };

  const stopOakCamera = async () => {
    try {
      await fetch('http://localhost:5000/api/camera/stop', { method: 'POST' });
      setIsOakStreaming(false);
      setOakCameraState('idle');
      setStreamUrl('');
      addTerminalLog('✅ OAK Camera stopped');
    } catch (error) {
      console.error('Error stopping OAK camera:', error);
      addTerminalLog(`❌ Error stopping OAK camera: ${error}`);
    }
  };

  // Load a specific model
  const loadSpecificModel = async (modelId: string) => {
    try {
      setModelLoading(true);
      addTerminalLog(`Loading model: ${modelId}...`);

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/models/${modelId}/load`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        addTerminalLog(`✅ Model loaded: ${data.message}`);
        if (data.is_dummy) {
          addTerminalLog('⚠ Using dummy inference (real model not available)');
        }
        if (data.has_multi_roi) {
          addTerminalLog('✅ Multi-ROI inference enabled');
        }

        // Refresh loaded models list
        fetchLoadedModels();
        return true;
      } else {
        const error = await response.text();
        addTerminalLog(`❌ Failed to load model: ${error}`);
        return false;
      }
    } catch (error) {
      console.error('Error loading model:', error);
      addTerminalLog(`❌ Error loading model: ${error}`);
      setConnectionError(true);
      return false;
    } finally {
      setModelLoading(false);
    }
  };

  // Add log to terminal
  const addTerminalLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage].slice(-200)); // Keep last 200 logs
  };

  // Process a single frame with retry logic
  const processFrameWithRetry = async (frameData?: string, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await processFrame(frameData);
        if (result) return result;
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        addTerminalLog(`⚠ Retry ${i + 1}/${retries} after error...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return false;
  };

  // Process a single frame
  // const processFrame = async (frameData?: string) => {
  //   if (!selectedModel) {
  //     addTerminalLog('❌ Please select a model first');
  //     return false;
  //   }

  //   try {
  //     const model = models.find(m => m.id === selectedModel);
  //     if (!model) {
  //       addTerminalLog('❌ Selected model not found');
  //       return false;
  //     }

  //     // Check if model is loaded
  //     const isLoaded = loadedModels.some(m => m.model_id === selectedModel);
  //     if (!isLoaded) {
  //       addTerminalLog(`❌ Model ${selectedModel} is not loaded. Please click "Load Model" first.`);
  //       return false;
  //     }

  //     let base64Data = frameData;

  //     if (!base64Data) {
  //       // Check if we're in a browser environment
  //       if (typeof document === 'undefined') return false;

  //       // Capture current frame from video
  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d');

  //       if (inputSource === 'oak' && oakStreamRef.current) {
  //         // Reduce resolution for OAK stream
  //         canvas.width = 1280;
  //         canvas.height = 720;
  //         ctx?.drawImage(oakStreamRef.current, 0, 0, canvas.width, canvas.height);
  //       } else if (videoRef.current && videoRef.current.videoWidth > 0) {
  //         // Reduce resolution for video
  //         canvas.width = 1280;
  //         canvas.height = 720;
  //         ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  //       } else {
  //         addTerminalLog('❌ No video source available');
  //         return false;
  //       }

  //       base64Data = canvas.toDataURL('image/jpeg', 0.8); // Reduced quality
  //     }

  //     // Send to backend for inference
  //     addTerminalLog(`Sending frame for inference...`);

  //     const controller = new AbortController();
  //     const timeoutId = setTimeout(() => controller.abort(), 30000);

  //     try {
  //       const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/process`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           model_id: selectedModel,
  //           frame_data: base64Data,
  //           session_id: model.session_id,
  //           roi_id: selectedROI
  //         }),
  //         signal: controller.signal
  //       });

  //       clearTimeout(timeoutId);

  //       if (response.ok) {
  //         const result = await response.json();
  //         setProcessedFrame(result.processed_frame);

  //         // Update stats
  //         const newAnomalies = result.predictions?.filter((p: any) => p.is_anomaly).length || 0;
  //         setInferenceStats(prev => ({
  //           ...prev,
  //           totalFrames: prev.totalFrames + 1,
  //           avgTime: (prev.avgTime * prev.totalFrames + result.inference_time) / (prev.totalFrames + 1),
  //           anomalies: newAnomalies,
  //           lastInferenceTime: result.inference_time,
  //           totalAnomalies: prev.totalAnomalies + newAnomalies
  //         }));

  //         setPredictions(result.predictions || []);
  //         setConnectionError(false);

  //         addTerminalLog(`✅ ${result.message}`);
  //         return true;
  //       } else {
  //         const errorText = await response.text();
  //         addTerminalLog(`❌ Inference failed (${response.status}): ${errorText}`);
  //         return false;
  //       }
  //     } catch (fetchError) {
  //       clearTimeout(timeoutId);
  //       addTerminalLog(`❌ Inference error: ${fetchError}`);
  //       return false;
  //     }

  //   } catch (error) {
  //     console.error('Error processing frame:', error);
  //     addTerminalLog(`❌ Error processing frame: ${error}`);
  //     setConnectionError(true);
  //     return false;
  //   }
  // };



  const processFrame = async (frameData?: string) => {
    if (!selectedModel) {
      addTerminalLog('❌ Please select a model first');
      return false;
    }

    try {
      const model = models.find(m => m.id === selectedModel);
      if (!model) {
        addTerminalLog('❌ Selected model not found');
        return false;
      }

      // Check if model is loaded
      const isLoaded = loadedModels.some(m => m.model_id === selectedModel);
      if (!isLoaded) {
        addTerminalLog(`❌ Model ${selectedModel} is not loaded. Please click "Load Model" first.`);
        return false;
      }

      let base64Data = frameData;

      if (!base64Data) {
        // Capture current frame from video
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // HANDLE REMOTE CAMERA
        if (remoteCameraActive && remoteCameraFrame) {
          // Create image from remote camera frame
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Draw to canvas
          canvas.width = img.naturalWidth || videoDimensions.width;
          canvas.height = img.naturalHeight || videoDimensions.height;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          base64Data = canvas.toDataURL('image/jpeg', 0.8);
        }
        else if (inputSource === 'oak' && oakStreamRef.current) {
          // Reduce resolution for OAK stream
          canvas.width = 1280;
          canvas.height = 720;
          ctx?.drawImage(oakStreamRef.current, 0, 0, canvas.width, canvas.height);
          base64Data = canvas.toDataURL('image/jpeg', 0.8);
        } else if (videoRef.current && videoRef.current.videoWidth > 0) {
          // Reduce resolution for video
          canvas.width = 1280;
          canvas.height = 720;
          ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          base64Data = canvas.toDataURL('image/jpeg', 0.8);
        } else {
          addTerminalLog('❌ No video source available');
          return false;
        }
      }

      // Send to backend for inference
      addTerminalLog(`Sending frame for inference...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model_id: selectedModel,
            frame_data: base64Data,
            session_id: model.session_id,
            roi_id: selectedROI
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          setProcessedFrame(result.processed_frame);

          // Update stats
          const newAnomalies = result.predictions?.filter((p: any) => p.is_anomaly).length || 0;
          setInferenceStats(prev => ({
            ...prev,
            totalFrames: prev.totalFrames + 1,
            avgTime: (prev.avgTime * prev.totalFrames + result.inference_time) / (prev.totalFrames + 1),
            anomalies: newAnomalies,
            lastInferenceTime: result.inference_time,
            totalAnomalies: prev.totalAnomalies + newAnomalies
          }));

          setPredictions(result.predictions || []);
          setConnectionError(false);

          addTerminalLog(`✅ ${result.message}`);
          return true;
        } else {
          const errorText = await response.text();
          addTerminalLog(`❌ Inference failed (${response.status}): ${errorText}`);
          return false;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        addTerminalLog(`❌ Inference error: ${fetchError}`);
        return false;
      }

    } catch (error) {
      console.error('Error processing frame:', error);
      addTerminalLog(`❌ Error processing frame: ${error}`);
      setConnectionError(true);
      return false;
    }
  };

  const toggleRealtimeInference = async () => {
    if (isProcessing) {
      // Stop processing
      setIsProcessing(false);
      if (inferenceIntervalRef.current) {
        clearInterval(inferenceIntervalRef.current);
        inferenceIntervalRef.current = null;
      }
      if (inferenceWebSocketRef.current) {
        inferenceWebSocketRef.current.close();
        inferenceWebSocketRef.current = null;
      }
      // Also stop backend video processing if running
      if (backendVideoProcessing.isProcessing) {
        await cancelBackendVideoProcessing();
      }
      addTerminalLog('⏹️ Stopped inference processing');
    } else {
      // Start processing
      if (!selectedModel) {
        addTerminalLog('❌ Please select a model first');
        return;
      }

      setIsProcessing(true);

      // Check if we have a video file and real-time is disabled
      if (videoFile && !isRealtime) {
        // Use backend processing for entire video
        addTerminalLog('🚀 Starting backend video processing...');

        if (unsupportedVideoFile) {
          // Already uploaded, start inference
          await startInferenceOnUploadedVideo();
        } else {
          // Upload and process
          const jobId = await processVideoOnBackend(videoFile, true);
          if (jobId) {
            connectToVideoWebSocket(jobId);
          } else {
            setIsProcessing(false);
          }
        }
      } else if (videoFile && isRealtime) {
        // Real-time frame-by-frame processing
        addTerminalLog('🎬 Starting real-time video processing...');

        // Ensure video is playing
        if (videoRef.current) {
          await videoRef.current.play();
        }

        // Process frames at video framerate
        inferenceIntervalRef.current = setInterval(() => {
          if (videoRef.current && !videoRef.current.paused) {
            processFrameWithRetry();
          } else {
            // Video paused or ended
            if (inferenceIntervalRef.current) {
              clearInterval(inferenceIntervalRef.current);
              inferenceIntervalRef.current = null;
              setIsProcessing(false);
            }
          }
        }, 1000 / 30); // ~30 FPS for real-time

        addTerminalLog('✅ Real-time video processing started');
      } else if (isRealtime && (inputSource === 'camera' || inputSource === 'oak')) {
        // Existing real-time camera processing
        if (isRealtime && isOakStreaming) {
          connectInferenceWebSocket();
        } else {
          inferenceIntervalRef.current = setInterval(() => {
            processFrameWithRetry();
          }, 500);
        }
        addTerminalLog('Started real-time inference');
      } else {
        // Single frame processing for camera
        addTerminalLog('Processing current frame...');
        await processFrameWithRetry();
        setIsProcessing(false);
      }
    }
  };

  // Function to process video frames in real-time
  const startRealTimeVideoProcessing = () => {
    if (!videoRef.current || !selectedModel) return;

    addTerminalLog('🎬 Starting real-time video inference...');

    // Get video framerate if available
    const frameRate = videoRef.current.playbackRate || 30;
    const frameInterval = 1000 / frameRate;

    inferenceIntervalRef.current = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        try {
          await processFrameWithRetry();
        } catch (error) {
          console.error('Error processing video frame:', error);
          addTerminalLog(`❌ Error processing frame: ${error}`);
        }
      } else {
        // Video ended or paused
        if (inferenceIntervalRef.current) {
          clearInterval(inferenceIntervalRef.current);
          inferenceIntervalRef.current = null;
          setIsProcessing(false);
          addTerminalLog('⏹️ Video processing completed or paused');
        }
      }
    }, frameInterval);

    // Start video playback if not already playing
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => {
        console.error('Failed to play video:', e);
        addTerminalLog('❌ Failed to play video');
      });
    }
  };

  // Connect to inference WebSocket
  const connectInferenceWebSocket = () => {
    if (!selectedModel) return;

    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const protocol = window.location.protocol === 'http:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${NEXT_PUBLIC_BACKEND_URL}/api/inference/ws/${selectedModel}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      addTerminalLog('✅ Connected to inference WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'model_loaded') {
          addTerminalLog(`✅ Model loaded via WebSocket${data.is_dummy ? ' (dummy mode)' : ''}`);
        } else if (data.type === 'result') {
          // Directly set the processed frame - no canvas manipulation
          setProcessedFrame(data.processed_frame);

          // Update stats
          const newAnomalies = data.predictions?.filter((p: any) => p.is_anomaly).length || 0;
          setInferenceStats(prev => ({
            ...prev,
            totalFrames: prev.totalFrames + 1,
            avgTime: (prev.avgTime * prev.totalFrames + data.inference_time) / (prev.totalFrames + 1),
            lastInferenceTime: data.inference_time,
            totalAnomalies: prev.totalAnomalies + newAnomalies
          }));

          setPredictions(data.predictions || []);
        } else if (data.type === 'error') {
          addTerminalLog(`❌ WebSocket error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      addTerminalLog(`❌ WebSocket error: ${error}`);
    };

    ws.onclose = () => {
      addTerminalLog('WebSocket disconnected');
      if (isProcessing) {
        setIsProcessing(false);
      }
    };

    inferenceWebSocketRef.current = ws;
  };

  // Test inference with an image
  const testInference = async (file: File) => {
    if (!selectedModel) {
      addTerminalLog('❌ Please select a model first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('model_id', selectedModel);
      formData.append('test_image', file);

      addTerminalLog(`Testing inference with: ${file.name}...`);
      setIsProcessing(true);

      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/test`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // Show comparison image
        setProcessedFrame(result.comparison);

        // Update stats
        setInferenceStats(prev => ({
          ...prev,
          totalFrames: prev.totalFrames + 1,
          avgTime: (prev.avgTime * prev.totalFrames + result.inference_time) / (prev.totalFrames + 1),
          lastInferenceTime: result.inference_time,
          totalAnomalies: prev.totalAnomalies + result.anomalies,
          anomalies: result.anomalies
        }));

        setPredictions(result.predictions || []);

        addTerminalLog(`✅ Test completed in ${result.inference_time.toFixed(2)}ms. Found ${result.anomalies} anomalies.`);
        if (result.is_dummy) {
          addTerminalLog('⚠ Note: Using dummy inference (real model not available)');
        }

      } else {
        const error = await response.text();
        addTerminalLog(`❌ Test failed: ${error}`);
      }

    } catch (error) {
      console.error('Error testing inference:', error);
      addTerminalLog(`❌ Error in test: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Batch process files
  const processBatch = async () => {
    if (!selectedModel || batchFiles.length === 0) {
      addTerminalLog('❌ Please select a model and upload files');
      return;
    }

    setIsBatchProcessing(true);
    setBatchProcessingProgress(0);
    addTerminalLog(`Starting batch processing of ${batchFiles.length} files...`);

    const results = [];

    for (let i = 0; i < batchFiles.length; i++) {
      const file = batchFiles[i];
      addTerminalLog(`Processing file ${i + 1}/${batchFiles.length}: ${file.name}`);

      // Convert file to base64
      let base64Data;
      try {
        base64Data = await fileToBase64(file);
      } catch (error) {
        addTerminalLog(`❌ Failed to convert file ${file.name} to base64: ${error}`);
        results.push({
          frame_index: i,
          success: false,
          error: 'File conversion failed'
        });
        continue;
      }

      // Process the frame
      try {
        const model = models.find(m => m.id === selectedModel);
        if (!model) {
          throw new Error('Model not found');
        }

        const base64WithPrefix = `data:image/jpeg;base64,${base64Data}`;

        const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model_id: selectedModel,
            frame_data: base64WithPrefix,
            session_id: model.session_id,
            roi_id: selectedROI
          }),
        });

        if (response.ok) {
          const result = await response.json();

          // ALWAYS SET PROCESSED FRAME FOR EACH PROCESSED FILE
          setProcessedFrame(result.processed_frame);

          // Update stats
          const newAnomalies = result.predictions?.filter((p: any) => p.is_anomaly).length || 0;
          setInferenceStats(prev => ({
            ...prev,
            totalFrames: prev.totalFrames + 1,
            avgTime: (prev.avgTime * prev.totalFrames + result.inference_time) / (prev.totalFrames + 1),
            anomalies: newAnomalies,
            lastInferenceTime: result.inference_time,
            totalAnomalies: prev.totalAnomalies + newAnomalies
          }));

          setPredictions(result.predictions || []);

          results.push({
            frame_index: i,
            success: true,
            inference_time: result.inference_time,
            has_predictions: !!result.predictions,
            anomalies: newAnomalies,
            file_name: file.name
          });

          addTerminalLog(`✅ Processed file ${i + 1}: ${result.message}`);
        } else {
          const errorText = await response.text();
          addTerminalLog(`❌ Failed to process file ${i + 1}: ${errorText}`);
          results.push({
            frame_index: i,
            success: false,
            error: errorText,
            file_name: file.name
          });
        }
      } catch (error) {
        console.error(`Error processing file ${i + 1}:`, error);
        addTerminalLog(`❌ Error processing file ${i + 1}: ${error}`);
        results.push({
          frame_index: i,
          success: false,
          error: error,
          file_name: file.name
        });
      }

      // Update progress
      const progress = ((i + 1) / batchFiles.length) * 100;
      setBatchProcessingProgress(progress);
    }

    setBatchResults(results);
    setIsBatchProcessing(false);
    addTerminalLog(`Batch processing completed. Processed ${results.filter(r => r.success).length} of ${batchFiles.length} files.`);
  };

  // Handle batch file upload
  const handleBatchFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setBatchFiles(files);
    addTerminalLog(`✅ Selected ${files.length} files for batch processing`);
  };

  // Clear terminal logs
  const clearTerminalLogs = () => {
    setTerminalLogs([]);
  };

  // Copy terminal logs
  const copyTerminalLogs = () => {
    // Check if we're in a browser environment
    if (typeof navigator === 'undefined') return;

    const logsText = terminalLogs.join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      addTerminalLog('✅ Logs copied to clipboard');
    });
  };

  // Unload model
  const unloadModel = async (modelId: string) => {
    try {
      const response = await fetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/inference/models/${modelId}/unload`, {
        method: 'POST'
      });

      if (response.ok) {
        addTerminalLog(`✅ Model ${modelId} unloaded`);
        fetchLoadedModels();
      }
    } catch (error) {
      console.error('Error unloading model:', error);
    }
  };

  // Test image loading
  const testImageLoad = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    if (processedFrame) {
      addTerminalLog(`Testing image load...`);

      const img = new Image();
      img.onload = () => {
        addTerminalLog(`✅ Image loads successfully: ${img.width}x${img.height}`);
        console.log('Image loaded:', img);
      };
      img.onerror = (e) => {
        addTerminalLog(`❌ Image load failed`);
        console.error('Image load error:', e);
      };
      img.src = processedFrame;
    } else {
      addTerminalLog('No processed frame to test');
    }
  };

  // Debug camera state
  const debugCameraState = () => {
    if (videoRef.current) {
      console.log('Video element state:', {
        srcObject: videoRef.current.srcObject,
        readyState: videoRef.current.readyState,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        paused: videoRef.current.paused,
        currentTime: videoRef.current.currentTime
      });
      addTerminalLog(`Video state: ${videoRef.current.readyState}, ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
    }
    if (currentCameraStream) {
      console.log('Stream state:', {
        active: currentCameraStream.active,
        tracks: currentCameraStream.getTracks().map(t => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState
        }))
      });
      addTerminalLog(`Stream active: ${currentCameraStream.active}`);
    }
  };

  // Safe captureOriginalFrame function
  const captureOriginalFrame = useCallback((): string => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    if (inputSource === 'oak' && isOakStreaming && oakStreamRef.current) {
      // Capture OAK stream
      canvas.width = oakStreamRef.current.naturalWidth || videoDimensions.width;
      canvas.height = oakStreamRef.current.naturalHeight || videoDimensions.height;
      ctx.drawImage(oakStreamRef.current, 0, 0, canvas.width, canvas.height);
    } else if (videoRef.current && videoRef.current.videoWidth > 0) {
      // Capture video frame
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else if (inputSource === 'camera' && currentCameraStream && videoRef.current) {
      // Capture camera stream
      canvas.width = videoRef.current.videoWidth || videoDimensions.width;
      canvas.height = videoRef.current.videoHeight || videoDimensions.height;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback to video dimensions
      canvas.width = videoDimensions.width;
      canvas.height = videoDimensions.height;
      return '';
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [inputSource, isOakStreaming, videoDimensions, currentCameraStream]);

  // NEW: Real-time updates for fullscreen popup
  useEffect(() => {
    if (!showFullscreenPopup) return;

    // Update processed frame in popup when it changes
    if (popupCurrentFrame === 'processed' && processedFrame) {
      setPopupProcessedFrame(processedFrame);
      setLastFrameUpdateTime(Date.now());
    }

    // Update original frame in popup when video plays
    if (popupCurrentFrame === 'original' && isLiveView) {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        setLastFrameUpdateTime(Date.now());
      }
    }
  }, [processedFrame, showFullscreenPopup, popupCurrentFrame, isLiveView, captureOriginalFrame]);

  // NEW: Auto-refresh for fullscreen popup
  useEffect(() => {
    if (!showFullscreenPopup || !isLiveView) {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
      return;
    }

    // Set up auto-refresh interval
    popupRefreshIntervalRef.current = setInterval(() => {
      if (popupCurrentFrame === 'original') {
        const frame = captureOriginalFrame();
        if (frame) {
          setPopupOriginalFrame(frame);
        }
      } else if (popupCurrentFrame === 'processed' && processedFrame) {
        setPopupProcessedFrame(processedFrame);
      }
    }, 100); // 10 FPS for smooth updates

    return () => {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
    };
  }, [showFullscreenPopup, isLiveView, popupCurrentFrame, processedFrame, captureOriginalFrame]);

  // Updated openFullscreenPopup function with live updates
  const openFullscreenPopup = () => {
    const originalFrame = captureOriginalFrame();
    if (!originalFrame && !processedFrame) {
      addTerminalLog('❌ No frames available to show in popup');
      return;
    }

    setPopupOriginalFrame(originalFrame || '');
    setPopupProcessedFrame(processedFrame);
    setPopupCurrentFrame('processed'); // Default to processed frame
    setIsLiveView(true); // Enable live updates by default
    setShowFullscreenPopup(true);
    addTerminalLog('✅ Opened fullscreen view with live updates (Press K to swap, ESC to close)');
  };

  const closeFullscreenPopup = () => {
    setShowFullscreenPopup(false);
    setIsLiveView(false);
    if (popupRefreshIntervalRef.current) {
      clearInterval(popupRefreshIntervalRef.current);
      popupRefreshIntervalRef.current = null;
    }
  };

  // Add keyboard event listener for K key and ESC
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullscreenPopup) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeFullscreenPopup();
      } else if (e.key === 'k' || e.key === 'K') {
        setPopupCurrentFrame(prev => prev === 'original' ? 'processed' : 'original');
        addTerminalLog(`Swapped to ${popupCurrentFrame === 'original' ? 'processed' : 'original'} frame`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFullscreenPopup, popupCurrentFrame]);

  // Get selected model info
  const selectedModelInfo = models.find(m => m.id === selectedModel);
  const isModelLoaded = loadedModels.some(m => m.model_id === selectedModel);
  const loadedModelInfo = loadedModels.find(m => m.model_id === selectedModel);

  // Render backend video processing UI
  // Update the renderBackendVideoProcessingUI function to include frame navigation
  const renderBackendVideoProcessingUI = () => {
    // Don't show the UI for 'uploaded' status - we show a popup instead
    if (backendVideoProcessing.status === 'uploaded' ||
      (!backendVideoProcessing.isProcessing && backendVideoProcessing.status === 'idle')) {
      return null;
    }

    return (
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <CpuIcon2 className="w-5 h-5 mr-2 text-purple-400" />
            Backend Video Processing
            {backendVideoProcessing.status === 'processing' && (
              <span className="ml-2 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                LIVE
              </span>
            )}
          </h3>
          {backendVideoProcessing.status === 'processing' && (
            <button
              onClick={cancelBackendVideoProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
            >
              Cancel Processing
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-300">
              {backendVideoProcessing.status === 'processing' ?
                `Processing frame ${backendVideoProcessing.currentFrame}/${backendVideoProcessing.totalFrames}` :
                backendVideoProcessing.status === 'completed' ? 'Completed!' :
                  backendVideoProcessing.status === 'error' ? 'Error' : 'Preparing...'}
            </span>
            <span className="text-neutral-300">
              {backendVideoProcessing.progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${backendVideoProcessing.status === 'error' ? 'bg-red-500' :
                backendVideoProcessing.status === 'completed' ? 'bg-green-500' :
                  'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              style={{ width: `${backendVideoProcessing.progress}%` }}
            ></div>
          </div>

          <div className="mt-2 text-sm text-neutral-400">
            {backendVideoProcessing.message}
          </div>
        </div>

        {/* Stats - Only show when processing or completed */}
        {(backendVideoProcessing.status === 'processing' || backendVideoProcessing.status === 'completed') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1">Current Frame</div>
              <div className="text-2xl font-bold">{backendVideoProcessing.currentFrame}</div>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1">Total Frames</div>
              <div className="text-2xl font-bold">{backendVideoProcessing.totalFrames}</div>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1">Anomalies Found</div>
              <div className="text-2xl font-bold text-red-400">{backendVideoProcessing.totalAnomalies}</div>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1">Status</div>
              <div className={`text-xl font-bold ${backendVideoProcessing.status === 'processing' ? 'text-yellow-400' :
                backendVideoProcessing.status === 'completed' ? 'text-green-400' :
                  backendVideoProcessing.status === 'error' ? 'text-red-400' : 'text-neutral-400'
                }`}>
                {backendVideoProcessing.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Frame Navigation (when processing) */}
        {backendVideoProcessing.status === 'processing' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Frame Navigation</div>
              <div className="text-xs text-neutral-400">
                Frame {backendVideoProcessing.currentFrame} of {backendVideoProcessing.totalFrames}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (backendVideoProcessing.currentFrame > 0) {
                    fetchProcessedFrame(
                      backendVideoProcessing.jobId,
                      Math.max(0, backendVideoProcessing.currentFrame - 1)
                    );
                    setBackendVideoProcessing(prev => ({
                      ...prev,
                      currentFrame: Math.max(0, prev.currentFrame - 1)
                    }));
                  }
                }}
                disabled={backendVideoProcessing.currentFrame <= 0}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-4 h-4 inline mr-1" />
                Previous
              </button>
              <button
                onClick={() => {
                  if (backendVideoProcessing.currentFrame < backendVideoProcessing.totalFrames) {
                    fetchProcessedFrame(
                      backendVideoProcessing.jobId,
                      Math.min(backendVideoProcessing.totalFrames, backendVideoProcessing.currentFrame + 1)
                    );
                    setBackendVideoProcessing(prev => ({
                      ...prev,
                      currentFrame: Math.min(prev.totalFrames, prev.currentFrame + 1)
                    }));
                  }
                }}
                disabled={backendVideoProcessing.currentFrame >= backendVideoProcessing.totalFrames}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <SkipForward className="w-4 h-4 inline ml-1" />
              </button>
              <button
                onClick={() => fetchLatestProcessedFrame(backendVideoProcessing.jobId)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                title="Show latest frame"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Download Button (when completed) */}
        {backendVideoProcessing.status === 'completed' && processedVideoUrl && (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
              <div className="flex items-center text-green-400 mb-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Video Processing Complete!</span>
              </div>
              <div className="text-sm text-neutral-300">
                Your video has been processed successfully. You can now play it or download the results.
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.src = processedVideoUrl;
                    videoRef.current.load();
                    addTerminalLog('✅ Loaded processed video for playback');
                  }
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Processed Video
              </button>

              <button
                onClick={downloadProcessedVideo}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded- text-sm font-medium flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {backendVideoProcessing.status === 'error' && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
            <div className="flex items-center text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-medium">Processing Error</span>
            </div>
            <div className="text-sm text-neutral-300">
              {backendVideoProcessing.message}
            </div>
            <button
              onClick={() => setBackendVideoProcessing(prev => ({ ...prev, status: 'idle' }))}
              className="mt-3 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  };

  // Update the Processed Feed rendering to show better status
  const renderProcessedFeed = () => {
    // First, handle all status cases in a type-safe way
    const status = backendVideoProcessing.status;

    if (status === 'processing') {
      return (
        <div className="relative bg-black aspect-video">
          {processedFrame ? (
            <img
              src={processedFrame}
              className="w-full h-full object-contain"
              alt="AI Inference Output"
              onLoad={() => {
                addTerminalLog(`✅ Frame ${backendVideoProcessing.currentFrame} displayed`);
              }}
              onError={(e) => {
                console.error('Image load error:', e);
                addTerminalLog('❌ Failed to load frame image');
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                <div className="text-neutral-500">Processing frames...</div>
                <div className="text-xs text-neutral-600 mt-1">
                  Frame {backendVideoProcessing.currentFrame} of {backendVideoProcessing.totalFrames}
                </div>
                <div className="text-xs text-neutral-600">
                  {backendVideoProcessing.progress.toFixed(1)}% complete
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default rendering for other cases
    return (
      <div className="relative bg-black aspect-video">
        {processedFrame ? (
          <img
            src={processedFrame}
            className="w-full h-full object-contain"
            alt="AI Inference Output"
            onLoad={() => {
              addTerminalLog(`✅ Processed frame displayed`);
            }}
            onError={(e) => {
              console.error('Image load error:', e);
              addTerminalLog('❌ Failed to load inference image');
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <Brain className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
              <div className="text-neutral-500">AI Inference Output</div>
              <div className="text-xs text-neutral-600 mt-1">
                {status === 'uploaded'
                  ? 'Video uploaded. Click "Start Inference" in the popup.'
                  : 'Processed frames will appear here'}
              </div>
              <div className="text-xs text-neutral-600">
                {backendVideoProcessing.isProcessing
                  ? `Processing frame ${backendVideoProcessing.currentFrame}/${backendVideoProcessing.totalFrames}`
                  : 'Start inference to see results'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render batch processing progress
  const renderBatchProcessingProgress = () => {
    if (!isBatchProcessing && batchProcessingProgress === 0) return null;

    return (
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold flex items-center">
            <Activity className="w-4 h-4 mr-2 text-yellow-400" />
            Batch Processing Progress
          </h3>
          <span className="text-sm">{batchProcessingProgress.toFixed(1)}%</span>
        </div>

        <div className="w-full bg-neutral-800 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${batchProcessingProgress}%` }}
          ></div>
        </div>

        <div className="text-xs text-neutral-400">
          Processing {batchFiles.length} files - Last processed: {batchFiles[batchResults.length - 1]?.name || 'None'}
        </div>
      </div>
    );
  };

  // NEW: Function to refresh current frame in popup
  const refreshPopupFrame = () => {
    if (popupCurrentFrame === 'processed' && processedFrame) {
      setPopupProcessedFrame(processedFrame);
      addTerminalLog('🔄 Refreshed processed frame in popup');
    } else if (popupCurrentFrame === 'original') {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        addTerminalLog('🔄 Refreshed original frame in popup');
      }
    }
  };

  // NEW: Function to download current popup frame
  const downloadPopupFrame = () => {
    const frameToDownload = popupCurrentFrame === 'original' ? popupOriginalFrame : popupProcessedFrame;
    if (!frameToDownload) {
      addTerminalLog('❌ No frame to download');
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `frame_${popupCurrentFrame}_${Date.now()}.jpg`;
      link.href = frameToDownload;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addTerminalLog(`✅ Downloaded ${popupCurrentFrame} frame`);
    } catch (error) {
      console.error('Error downloading frame:', error);
      addTerminalLog('❌ Failed to download frame');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold text-white">Vision AI Inference Studio</h1>
                <div className="text-xs text-neutral-400">Real-time Anomaly Detection</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">

              <Link href="/training" >
                <div className={`px-2 py-1 rounded text-xs ${models.length > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  Training
                </div>
              </Link>
              {isMobile ? (
                <>
                  <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className={`px-2 py-1 rounded text-xs ${models.length > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {models.length > 0 ? '✓' : '✗'}
                  </div>
                </>
              ) : (
                <>
                  <div className={`px-2 py-1 rounded text-xs ${models.length > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {models.length > 0 ? `${models.length} Models Available` : 'No Models'}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${isModelLoaded ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {isModelLoaded ? 'Model Loaded' : 'Model Not Loaded'}
                  </div>
                  <button
                    onClick={loadModels}
                    disabled={modelLoading}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {modelLoading ? (
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                    )}
                    Refresh Models
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-2 md:p-4">
        {/* Mobile Sidebar Toggle */}
        {isMobile && showMobileSidebar && (
          <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setShowMobileSidebar(false)}>
            <div
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-neutral-900 overflow-y-auto z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Controls</h2>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Tabs */}
                <div className="grid grid-cols-5 gap-1 mb-4">
                  <button
                    onClick={() => setActiveMobileTab('models')}
                    className={`p-2 rounded-lg text-center ${activeMobileTab === 'models' ? 'bg-purple-600' : 'bg-neutral-800'}`}
                  >
                    <Brain className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Models</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab('input')}
                    className={`p-2 rounded-lg text-center ${activeMobileTab === 'input' ? 'bg-blue-600' : 'bg-neutral-800'}`}
                  >
                    <Video className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Input</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab('controls')}
                    className={`p-2 rounded-lg text-center ${activeMobileTab === 'controls' ? 'bg-yellow-600' : 'bg-neutral-800'}`}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Controls</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab('settings')}
                    className={`p-2 rounded-lg text-center ${activeMobileTab === 'settings' ? 'bg-cyan-600' : 'bg-neutral-800'}`}
                  >
                    <SettingsIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab('stats')}
                    className={`p-2 rounded-lg text-center ${activeMobileTab === 'stats' ? 'bg-green-600' : 'bg-neutral-800'}`}
                  >
                    <Activity className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Stats</span>
                  </button>
                </div>

                {/* Mobile sidebar content would go here */}
              </div>
            </div>
          </div>
        )}

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'} gap-4`}>
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="inference-scrollbar overflow-y-auto">
              {/* Model Selection */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-400" />
                  Model Selection
                </h3>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-neutral-400">Select Model</label>
                    {modelLoading && (
                      <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                    )}
                  </div>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2 bg-neutral-800 rounded text-sm border border-neutral-700 focus:border-purple-500 focus:outline-none"
                    disabled={models.length === 0 || modelLoading}
                  >
                    <option value="">Select a model...</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.display_name}
                        {" "}
                        [{model.model_types?.join(" + ") || "unknown"}]
                      </option>
                    ))}

                  </select>
                  <div className="text-xs text-neutral-500 mt-1">
                    {models.length} trained model{models.length !== 1 ? 's' : ''} available
                  </div>
                </div>
                {/* {selectedModelInfo && selectedModelInfo.model_types?.length > 1 && (
                  <div className="mb-3">
                    <label className="text-xs text-neutral-400 mb-1 block">Model Type</label>
                    <select
                      value={selectedModelType}
                      onChange={(e) => setSelectedModelType(e.target.value as any)}
                      className="w-full p-2 bg-neutral-800 rounded text-sm border border-neutral-700 focus:border-purple-500 focus:outline-none"
                    >
                      {selectedModelInfo.has_motion && (
                        <option value="motion">Motion Model</option>
                      )}
                      {selectedModelInfo.has_anomaly && (
                        <option value="anomaly">Anomaly Model</option>
                      )}
                    </select>
                  </div>
                )} */}

                {selectedModelInfo && (
                  <div className="p-3 bg-neutral-800/50 rounded-lg mb-3">
                    <div className="text-xs text-neutral-400 mb-1">Selected Model:</div>
                    <div className="text-sm font-medium truncate">
                      {selectedModelInfo.display_name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Trained on: {selectedModelInfo.session_id || 'unknown'}
                    </div>
                    <div className="text-xs text-neutral-500">
                      ROIs: {selectedModelInfo.rois_trained?.length || 0}
                    </div>
                    <div className="flex items-center mt-2">
                      <div className={`w-2 h-2 rounded-full mr-2 ${isModelLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-xs">
                        {isModelLoaded ? 'Loaded in memory' : 'Not loaded'}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => downloadModel(selectedModel, selectedModelInfo)}
                        // onClick={startModelDownload}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center justify-center"
                        title="Download Model"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Model
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => selectedModel && loadSpecificModel(selectedModel)}
                    disabled={!selectedModel || modelLoading}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modelLoading ? 'Loading...' : 'Load Model'}
                  </button>
                  {isModelLoaded && (
                    <button
                      onClick={() => selectedModel && unloadModel(selectedModel)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                      title="Unload Model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>


              </div>



              {/* Download Model Popup */}
              {showDownloadPopup && selectedModelForDownload && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <Download className="w-6 h-6 mr-3 text-purple-400" />
                          <h2 className="text-xl font-bold">Download Model</h2>
                        </div>
                        <button
                          onClick={() => {
                            setShowDownloadPopup(false);
                            setSelectedModelForDownload(null);
                          }}
                          className="p-2 hover:bg-neutral-800 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Model Info */}
                        <div className="bg-neutral-800/50 p-4 rounded-lg">
                          <div className="flex space-x-3 pt-4 border-t border-neutral-800">

                            <button
                              onClick={startModelDownload}
                              // disabled={isDownloading}
                              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <Download className="w-4 h-4 mr-2" />
                              Download Model (.zip)

                            </button>
                            <a
                              href="/dime_v2-2.2.0-py3-none-any.whl"
                              download
                              className="flex-1"
                            >
                              <button
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 
               hover:from-purple-700 hover:to-pink-700 rounded-lg 
               text-sm font-medium flex items-center justify-center
               disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Library
                              </button>
                            </a>
                            <button
                              onClick={() => {
                                // Copy code to clipboard
                                const code = `
import cv2
import dime_v2

# Initialize detector
detector = dime_v2.create_detector(
    model_path="models",
    threshold=0.5,
)

# Process a single frame
frame = cv2.imread("test.png")
result = detector.process_frame(frame)

print(f"Anomaly score: {result['anomaly_score']:.3f}")
print(f"Processing time: {result['processing_time_ms']:.1f}ms")

coords = [list(map(int, a["bbox"])) for a in result["anomaly_areas"]]
print("Coordinates:", coords)

# Clean up when done
detector.cleanup()`;

                                navigator.clipboard.writeText(code);
                                addTerminalLog('✅ Code copied to clipboard');
                              }}
                              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium flex items-center"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Code
                            </button>
                          </div>

                        </div>

                        {/* Usage Instructions */}
                        <div>
                          <h3 className="text-lg font-bold mb-3 flex items-center">
                            <Code className="w-5 h-5 mr-2 text-blue-400" />
                            Usage Instructions
                          </h3>
                          <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto">
                            <pre className="whitespace-pre-wrap text-green-400">
                              {`
import cv2
import dime_v2

# Initialize detector
detector = dime_v2.create_detector(
    model_path="models",
    threshold=0.5,
)

# Process a single frame
frame = cv2.imread("test.png")
result = detector.process_frame(frame)

print(f"Anomaly score: {result['anomaly_score']:.3f}")
print(f"Processing time: {result['processing_time_ms']:.1f}ms")

coords = [list(map(int, a["bbox"])) for a in result["anomaly_areas"]]
print("Coordinates:", coords)

# Clean up when done
detector.cleanup()`}
                            </pre>
                          </div>
                          {/* <div className="mt-3 text-sm text-neutral-400">
              The downloaded zip includes:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Complete model files</li>
                <li>README.md with detailed instructions</li>
                <li>test_model.py for verification</li>
                <li>requirements.txt for dependencies</li>
              </ul>
            </div> */}
                        </div>

                        {/* Download Progress */}
                        {isDownloading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              {/* <span>Preparing download...</span> */}
                              <span>{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-neutral-800 rounded-full h-2">
                              {/* <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                style={{ width: `${downloadProgress}%` }}
                              ></div> */}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}

                        {/* Tips */}
                        <div className="text-xs text-neutral-500">
                          <div className="flex items-start">
                            <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            {/* <span>
                              The model will be downloaded as a zip file. Extract it and follow the README.md
                              for complete setup instructions. Make sure to install dependencies from requirements.txt first.
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Input Source (for Live Inference) */}
              {activeTab === 'live' && (
                <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                  <h3 className="text-sm font-bold mb-3 flex items-center">
                    <Video className="w-4 h-4 mr-2 text-blue-400" />
                    Input Source
                  </h3>

                  <div className="space-y-2">
                    {/* Upload Video */}
                    <button
                      onClick={() => {
                        handleInputSourceChange('upload');
                        fileInputRef.current?.click();
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${inputSource === 'upload'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-neutral-700 hover:bg-neutral-800'
                        }`}
                    >
                      <div className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Upload Video</div>
                          <div className="text-xs text-neutral-500">MP4, MOV, AVI</div>
                        </div>
                      </div>
                    </button>

                    {/* Live Camera */}
                    <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'camera'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-neutral-700 hover:bg-neutral-800'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Camera className="w-4 h-4 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Live Camera</div>
                            <div className="text-xs text-neutral-500">Webcam, IP Camera</div>
                          </div>
                        </div>
                        {inputSource === 'camera' && currentCameraStream ? (
                          <button
                            onClick={stopCamera}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            title="Stop Camera"
                          >
                            <PowerOff className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const cameras = await listAvailableCameras();
                              if (cameras.length > 1) {
                                setShowCameraSelection(true);
                              } else if (cameras.length === 1) {
                                // If only one camera, start it directly
                                await startCamera(cameras[0].deviceId);
                              } else {
                                // If no cameras found, try to start with default device
                                await startCamera();
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                            title="Start Camera"
                          >
                            <Power className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* OAK Camera */}
                    <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'oak'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-neutral-700 hover:bg-neutral-800'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CpuIcon2 className="w-4 h-4 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Neuron Camera</div>
                            <div className="text-xs text-neutral-500">Device</div>
                          </div>
                        </div>
                        {!isOakStreaming ? (
                          <button
                            onClick={startOakCamera}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                          >
                            <Power className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={stopOakCamera}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          >
                            <PowerOff className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>



                    {/* Inside your Input Source section, add remote camera option */}
                    <div className={`w-full p-3 rounded-lg border transition-colors ${remoteCameraActive
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-neutral-700 hover:bg-neutral-800'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Remote Camera</div>
                            <div className="text-xs text-neutral-500">Stream from phone</div>
                          </div>
                        </div>
                        {remoteCameraActive ? (
                          <button
                            onClick={stopRemoteCamera}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            title="Stop Remote Camera"
                          >
                            <PowerOff className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={startRemoteCameraSession}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                            title="Start Remote Camera"
                          >
                            <Power className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {remoteCameraSession && (
                        <div className="mt-2">
                          <div className="text-xs text-neutral-400 mb-1">
                            Status: <span className={remoteCameraStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}>
                              {remoteCameraStatus}
                            </span>
                          </div>
                          {remoteCameraStatus === 'connected' && (
                            <div className="text-xs text-neutral-400">
                              Frames: {remoteCameraSession.frameCount} • Device: {remoteCameraSession.deviceInfo?.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />

                  {videoFile && (
                    <div className="mt-3 p-2 bg-neutral-800/50 rounded-lg">
                      <div className="text-xs text-neutral-400 mb-1">Selected File:</div>
                      <div className="text-sm truncate">{videoFile.name}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Inference Controls */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Inference Controls
                </h3>


                {videoFile && inputSource === 'upload' && (
                  <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg">
                    <div className="text-xs text-neutral-400 mb-2">Video Processing Options</div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Real-time Processing</span>
                        <button
                          onClick={() => setIsRealtime(!isRealtime)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRealtime ? 'bg-green-500' : 'bg-blue-500'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isRealtime ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {!isRealtime && (
                        <button
                          onClick={async () => {
                            if (videoFile) {
                              addTerminalLog('📤 Uploading video for backend processing...');
                              const jobId = await processVideoOnBackend(videoFile, false);
                              if (jobId) {
                                setUploadedVideoInfo({
                                  jobId,
                                  fileName: videoFile.name,
                                  fileSize: (videoFile.size / (1024 * 1024)).toFixed(2) + ' MB', // FIXED: Changed 'file' to 'videoFile'
                                  uploadedAt: new Date().toLocaleTimeString()
                                });
                              }
                            }
                          }}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                        >
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload for Backend Processing
                        </button>
                      )}

                      {isRealtime && (
                        <div className="text-xs text-green-400 p-2 bg-green-500/10 rounded">
                          ✓ Real-time mode: Video will process frame-by-frame as it plays
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'live' ? (
                  <>
                    {/* <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-sm">Real-time Processing</span>
                      </div>
                      <button
                        onClick={() => setIsRealtime(!isRealtime)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRealtime ? 'bg-green-500' : 'bg-neutral-700'
                          }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isRealtime ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                    </div> */}

                    <div className="space-y-2">
                      <button
                        onClick={toggleRealtimeInference}
                        disabled={!selectedModel || (inputSource === 'oak' && !isOakStreaming) || modelLoading || connectionError}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${isProcessing
                          ? 'bg-red-600 hover:bg-red-700'
                          : !selectedModel || (inputSource === 'oak' && !isOakStreaming) || modelLoading || connectionError
                            ? 'bg-neutral-700 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                          }`}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                            Stop Inference
                          </div>
                        ) : (
                          <>
                            <Play className="w-4 h-4 inline mr-2" />
                            Start Live Inference
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => processFrameWithRetry()}
                        disabled={!selectedModel || isProcessing || modelLoading || connectionError}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
                      >
                        Process Single Frame
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBatchFileUpload}
                        className="hidden"
                        id="batch-file-input"
                        ref={batchFileInputRef}
                      />
                      <label
                        htmlFor="batch-file-input"
                        className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-center cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Select Files for Batch
                      </label>
                      {batchFiles.length > 0 && (
                        <div className="mt-2 p-2 bg-neutral-800/50 rounded">
                          <div className="text-xs text-neutral-400">
                            {batchFiles.length} file{batchFiles.length !== 1 ? 's' : ''} selected
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={processBatch}
                      disabled={!selectedModel || batchFiles.length === 0 || isBatchProcessing || modelLoading}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${isBatchProcessing
                        ? 'bg-yellow-600 cursor-wait'
                        : !selectedModel || batchFiles.length === 0 || modelLoading
                          ? 'bg-neutral-700 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                      {isBatchProcessing ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing Batch...
                        </div>
                      ) : (
                        <>
                          <Activity className="w-4 h-4 inline mr-2" />
                          Start Batch Inference
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Model Testing */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                  Model Testing
                </h3>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) testInference(file);
                    }}
                    className="hidden"
                    id="test-file-input"
                    ref={testFileInputRef}
                  />
                  <label
                    htmlFor="test-file-input"
                    className="block w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm text-center cursor-pointer transition-colors"
                  >
                    <FileImage className="w-4 h-4 inline mr-2" />
                    Test with Image
                  </label>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800">
                    <span className="text-neutral-400">Model Status:</span>
                    <span className={`font-medium ${isModelLoaded ? (loadedModelInfo?.is_dummy ? 'text-yellow-400' : 'text-green-400') : 'text-red-400'}`}>
                      {isModelLoaded ? (loadedModelInfo?.is_dummy ? 'Dummy Mode' : 'Ready') : 'Not Loaded'}
                    </span>
                  </div>

                  {loadedModelInfo?.has_multi_roi && (
                    <div className="text-xs text-blue-400 flex items-center mt-1">
                      <CpuIcon2 className="w-3 h-3 mr-1" />
                      Multi-ROI Enabled
                    </div>
                  )}
                </div>
              </div>

              {/* Debug Controls */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-red-400" />
                  Debug Tools
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={debugCameraState}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm"
                  >
                    Debug Camera State
                  </button>

                  <button
                    onClick={testImageLoad}
                    disabled={!processedFrame}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Test Image Load
                  </button>

                  <button
                    onClick={() => setShowRawImage(!showRawImage)}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm"
                  >
                    {showRawImage ? 'Hide Raw Image' : 'Show Raw Image'}
                  </button>

                  <button
                    onClick={checkBackendConnection}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Check Connection
                  </button>

                  {connectionError && (
                    <div className="text-xs text-red-400 p-2 bg-red-500/10 rounded border border-red-500/30">
                      ⚠ Connection issues detected
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full flex items-center justify-between text-sm font-medium mb-2"
                >
                  <div className="flex items-center">
                    <SettingsIcon className="w-4 h-4 mr-2 text-cyan-400" />
                    Advanced Settings
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
                </button>

                {showAdvancedSettings && (
                  <div className="space-y-3 pt-2 border-t border-neutral-800">
                    <div>
                      <div className="text-xs text-neutral-400 mb-1">Threshold: {advancedSettings.threshold.toFixed(2)}</div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={advancedSettings.threshold}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                        className="w-full h-1.5 bg-neutral-700 rounded appearance-none"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-neutral-400 mb-1">Tile Rows: {advancedSettings.tileRows}</div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={advancedSettings.tileRows}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, tileRows: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-neutral-700 rounded appearance-none"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-neutral-400 mb-1">Tile Columns: {advancedSettings.tileCols}</div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={advancedSettings.tileCols}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, tileCols: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-neutral-700 rounded appearance-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Parallel Tiles</span>
                      <button
                        onClick={() => setAdvancedSettings(prev => ({ ...prev, parallelTiles: !prev.parallelTiles }))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${advancedSettings.parallelTiles ? 'bg-green-500' : 'bg-neutral-700'}`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${advancedSettings.parallelTiles ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Inference Stats */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-cyan-400" />
                  Inference Statistics
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Total Frames:</span>
                    <span className="text-sm font-medium">{inferenceStats.totalFrames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Avg Time:</span>
                    <span className="text-sm font-medium">{inferenceStats.avgTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Last Inference:</span>
                    <span className="text-sm font-medium">{inferenceStats.lastInferenceTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Current Anomalies:</span>
                    <span className="text-sm font-medium text-red-400">{inferenceStats.anomalies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Total Anomalies:</span>
                    <span className="text-sm font-medium text-red-400">{inferenceStats.totalAnomalies}</span>
                  </div>
                  {lastImageSize.width > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-400">Last Image:</span>
                      <span className="text-sm font-medium">{lastImageSize.width}x{lastImageSize.height}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Current Predictions:</div>
                  {predictions.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {predictions.slice(0, 5).map((pred, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-2 rounded flex justify-between items-center ${pred.is_anomaly ? 'bg-red-500/20 border border-red-500/30' : 'bg-green-500/20 border border-green-500/30'}`}
                        >
                          <div>
                            <span className="font-medium">{pred.label}</span>
                            <div className="text-neutral-500 text-xs">
                              Confidence: {(pred.confidence * 100).toFixed(1)}%
                            </div>
                          </div>
                          {pred.is_anomaly ? (
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                          ) : (
                            <Check className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                      ))}
                      {predictions.length > 5 && (
                        <div className="text-xs text-neutral-500 text-center">
                          +{predictions.length - 5} more predictions
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500 italic">No predictions yet</div>
                  )}
                </div>
              </div>

              {/* Terminal Toggle */}
              <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-green-400" />
                  Logs & Terminal
                </h3>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowTerminal(!showTerminal)}
                    className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm transition-colors"
                  >
                    {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
                  </button>
                  <button
                    onClick={clearTerminalLogs}
                    className="px-3 py-2 bg-red-800/30 hover:bg-red-800/50 rounded text-red-400 transition-colors"
                    title="Clear logs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyTerminalLogs}
                    className="px-3 py-2 bg-blue-800/30 hover:bg-blue-800/50 rounded text-blue-400 transition-colors"
                    title="Copy logs"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-1' : 'col-span-1 md:col-span-3'}`}>
            {showTerminal ? (
              <div className="bg-black rounded-xl overflow-hidden border border-neutral-800 h-[70vh] md:h-[700px]">
                <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-mono">Training Terminal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-medium flex items-center"
                    >
                      <Video className="w-3 h-3 mr-1" />
                      {isMobile ? 'Video' : 'Switch to Video'}
                    </button>
                    {!isMobile && (
                      <>
                        <button
                          onClick={clearTerminalLogs}
                          className="px-3 py-1 bg-red-800/30 hover:bg-red-800/50 rounded text-xs font-medium text-red-400 flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Clear
                        </button>
                        <button
                          onClick={copyTerminalLogs}
                          className="px-3 py-1 bg-blue-800/30 hover:bg-blue-800/50 rounded text-xs font-medium text-blue-400 flex items-center"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-[calc(70vh-48px)] md:h-[500px] overflow-y-auto bg-black p-4 font-mono text-sm">
                  <div className="space-y-1">
                    {terminalLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`${log.includes('ERROR') || log.includes('❌')
                          ? 'text-red-400'
                          : log.includes('WARNING') || log.includes('⚠')
                            ? 'text-yellow-400'
                            : log.includes('INFO') || log.includes('INFO]') || log.includes('✓')
                              ? 'text-blue-400'
                              : log.includes('[PROGRESS]')
                                ? 'text-green-400 font-bold'
                                : log.includes('SUCCESS')
                                  ? 'text-green-400'
                                  : 'text-neutral-300'
                          } whitespace-pre-wrap break-words text-xs md:text-sm`}
                      >
                        {log}
                      </div>
                    ))}
                    {terminalLogs.length === 0 && (
                      <div className="text-neutral-500 text-center py-8">
                        No logs yet. Start inference to see logs here.
                      </div>
                    )}
                  </div>
                  <div ref={terminalEndRef} />
                </div>
              </div>
            ) : (
              <>
                {/* Video/Inference Display */}
                <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'} mb-4`}>
                  {/* Original Feed - Always show if not mobile or layout is split */}
                  {(!isMobile || layoutMode === 'split') && (
                    <div className="bg-black rounded-xl overflow-hidden border border-neutral-800">
                      <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${inputSource === 'oak' ?
                            (isOakStreaming ? 'bg-green-500' : 'bg-red-500') :
                            inputSource === 'camera' ?
                              (currentCameraStream ? 'bg-green-500' : 'bg-yellow-500') :
                              (isPlaying ? 'bg-green-500' : 'bg-yellow-500')
                            }`} />
                          <span className="text-sm">Original Feed</span>
                          <span className="text-xs text-neutral-500 hidden md:inline">
                            • {videoDimensions.width}x{videoDimensions.height}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          {inputSource === 'upload' ? 'Uploaded Video' :
                            inputSource === 'camera' ? 'Live Camera' : 'OAK Camera'}
                        </div>
                        {isMobile && layoutMode === 'split' && (
                          <button
                            onClick={openFullscreenPopup}
                            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div
                        ref={containerRef}
                        className={`relative bg-black ${isMobile ? 'h-[40vh]' : 'aspect-video'}`}
                      >
                        {remoteCameraActive && remoteCameraFrame ? (
                          <img
                            src={`data:image/jpeg;base64,${remoteCameraFrame}`}
                            className="w-full h-full object-contain"
                            alt="Remote Camera Stream"
                            onLoad={(e) => {
                              const img = e.currentTarget;
                              setVideoDimensions({
                                width: img.naturalWidth,
                                height: img.naturalHeight
                              });
                            }}
                            crossOrigin="anonymous"
                          />
                        )
                          : inputSource === 'oak' && isOakStreaming ? (
                            <img
                              ref={oakStreamRef}
                              src={streamUrl}
                              className="w-full h-full object-contain"
                              alt="OAK Camera Stream"
                              onLoad={handleOakStreamLoad}
                              crossOrigin="anonymous"
                            />
                          ) : videoUrl || processedVideoUrl ? (
                            <video
                              ref={videoRef}
                              src={processedVideoUrl || videoUrl}
                              className="w-full h-full object-contain"
                              autoPlay
                              muted
                              loop={!processedVideoUrl} // Don't loop processed videos
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                              onLoadedMetadata={handleVideoLoad}
                              playsInline
                              controls // Add controls for video playback
                            />
                          ) : inputSource === 'camera' ? (
                            <video
                              ref={videoRef}
                              className="w-full h-full object-contain"
                              autoPlay
                              muted
                              playsInline
                              controls={false}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                              onLoadedMetadata={() => {
                                if (videoRef.current) {
                                  const width = videoRef.current.videoWidth || 1280;
                                  const height = videoRef.current.videoHeight || 720;
                                  setVideoDimensions({ width, height });
                                  updateCanvasDimensions();
                                  addTerminalLog(`✅ Camera stream loaded: ${width}x${height}`);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                              <div className="text-center">
                                <Video className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                                <div className="text-neutral-500">No video selected</div>
                                <div className="text-xs text-neutral-600 mt-1">
                                  Upload a video or start camera
                                </div>
                              </div>
                            </div>
                          )}

                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Processed Feed */}
                  <div className="bg-black rounded-xl overflow-hidden border border-neutral-800">
                    <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                          }`} />
                        <span className="text-sm">Processed Feed</span>
                        <span className="text-xs text-neutral-500">
                          • AI Inference Output
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-neutral-400">
                          {isProcessing ? 'Live Processing' : 'Ready'}
                        </div>
                        <button
                          onClick={openFullscreenPopup}
                          disabled={!processedFrame && !captureOriginalFrame()}
                          className="ml-2 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Open fullscreen view"
                        >
                          <Maximize2 className="w-3 h-3 mr-1" />
                          {isMobile ? 'Expand' : 'Expand'}
                        </button>
                      </div>
                    </div>

                    <div className={`relative bg-black ${isMobile ? (layoutMode === 'split' ? 'h-[40vh]' : 'h-[50vh]') : 'aspect-video'}`}>
                      {/* ALWAYS DISPLAY PROCESSED FRAME */}
                      {processedFrame ? (
                        <img
                          ref={processedImageRef}
                          src={processedFrame}
                          className="w-full h-full object-contain"
                          alt="AI Inference Output"
                          onLoad={() => {
                            if (processedImageRef.current) {
                              const img = processedImageRef.current;
                              setLastImageSize({
                                width: img.naturalWidth,
                                height: img.naturalHeight
                              });
                              addTerminalLog(`✅ Inference image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
                            }
                          }}
                          onError={(e) => {
                            console.error('Image load error:', e);
                            addTerminalLog('❌ Failed to load inference image');
                          }}
                        />
                      ) : (
                        /* Placeholder when no processed frame is available */
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <Brain className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
                            <div className="text-neutral-500">AI Inference Output</div>
                            <div className="text-xs text-neutral-600 mt-1">
                              Processed frames will appear here
                            </div>
                            <div className="text-xs text-neutral-600">
                              {backendVideoProcessing.isProcessing ?
                                `Processing frame ${backendVideoProcessing.currentFrame}/${backendVideoProcessing.totalFrames}` :
                                'Start inference to see results'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Debug Stats Overlay */}
                      {processedFrame && (
                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs flex flex-col">
                          <div>Frame: {inferenceStats.totalFrames}</div>
                          <div>Avg: {inferenceStats.avgTime.toFixed(1)}ms</div>
                          {lastImageSize.width > 0 && (
                            <div className="text-neutral-400">Size: {lastImageSize.width}x{lastImageSize.height}</div>
                          )}
                        </div>
                      )}

                      {/* Anomaly Overlay */}
                      {inferenceStats.anomalies > 0 && (
                        <div className="absolute top-2 right-2 bg-red-600/80 px-2 py-1 rounded text-xs flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {inferenceStats.anomalies} Anomalies
                        </div>
                      )}

                      {/* Processing Overlay */}
                      {isProcessing && !processedFrame && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                            <div className="text-sm">Processing frame...</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Layout Toggle for Mobile */}
                {isMobile && (
                  <div className="mb-4 flex justify-center">
                    <div className="bg-neutral-900 rounded-xl p-2 border border-neutral-800">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setLayoutMode('split')}
                          className={`px-3 py-2 rounded ${layoutMode === 'split' ? 'bg-blue-600' : 'bg-neutral-800'}`}
                        >
                          <PanelRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayoutMode('single')}
                          className={`px-3 py-2 rounded ${layoutMode === 'single' ? 'bg-blue-600' : 'bg-neutral-800'}`}
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backend Video Processing UI */}
                {renderBackendVideoProcessingUI()}
                {renderUploadedVideoPopup()}
                {/* Batch Processing Progress */}
                {renderBatchProcessingProgress()}

                {/* Batch Results */}
                {activeTab === 'batch' && batchResults.length > 0 && (
                  <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mb-4">
                    <h3 className="text-sm font-bold mb-3 flex items-center">
                      <BarChart className="w-4 h-4 mr-2 text-purple-400" />
                      Batch Results Summary
                    </h3>

                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-3`}>
                      <div className="bg-neutral-800 p-3 rounded">
                        <div className="text-xs text-neutral-400">Total Files</div>
                        <div className="text-xl font-bold">{batchResults.length}</div>
                      </div>
                      <div className="bg-neutral-800 p-3 rounded">
                        <div className="text-xs text-neutral-400">Successful</div>
                        <div className="text-xl font-bold text-green-400">
                          {batchResults.filter(r => r.success).length}
                        </div>
                      </div>
                      <div className="bg-neutral-800 p-3 rounded">
                        <div className="text-xs text-neutral-400">Total Anomalies</div>
                        <div className="text-xl font-bold text-red-400">
                          {batchResults.reduce((sum, r) => sum + (r.anomalies || 0), 0)}
                        </div>
                      </div>
                      <div className="bg-neutral-800 p-3 rounded">
                        <div className="text-xs text-neutral-400">Avg Time</div>
                        <div className="text-xl font-bold">
                          {(batchResults.filter(r => r.success).reduce((sum, r) => sum + r.inference_time, 0) / (batchResults.filter(r => r.success).length || 1)).toFixed(1)}ms
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-500">
                      Showing results for {batchResults.length} files
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                  <div className="text-sm font-bold mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-blue-400" />
                    Instructions & Troubleshooting
                  </div>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>1. Select a trained model from the dropdown (auto-loads on selection)</li>
                    <li>2. For live inference: Choose input source (upload, camera, or Neuron camera)</li>
                    <li>3. For batch inference: Upload multiple images</li>
                    <li>4. Toggle real-time processing for live feeds (uses WebSocket for Neuron)</li>
                    <li>5. View original feed (left) vs processed feed (right)</li>
                    <li className="text-green-400">✅ Green border indicates active processing</li>
                    <li className="text-red-400">✅ Red annotations indicate detected anomalies</li>
                    <li className="text-blue-400">✅ Use terminal for detailed logs and debugging</li>
                    <li className="text-yellow-400">⚠ Yellow indicator means dummy inference (real model not available)</li>
                    <li className="text-red-400">❌ If no image appears: Check debug tools and connection</li>
                    {isMobile && (
                      <li className="text-cyan-400">📱 Tap menu button for controls • Tap Expand for fullscreen</li>
                    )}
                  </ul>
                </div>

                {/* Video Processing Section */}
                {isVideoProcessing && (
                  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center">
                        <Film className="w-5 h-5 mr-2 text-purple-400" />
                        Video Processing
                      </h3>
                      <button
                        onClick={cancelBackendVideoProcessing}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Processing: {unsupportedVideoFile?.name}</span>
                        <span>{videoProcessingProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${videoProcessingProgress}%` }}
                        ></div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <Activity className="w-4 h-4 mr-2 text-blue-400" />
                          <span>Status: {videoProcessingStatus}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                          <span>This may take several minutes depending on video length</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Processed Video Download Section */}
                {processedVideoUrl && videoProcessingStatus === 'completed' && (
                  <div className="bg-neutral-900 rounded-xl p-6 border border-green-500/30 mb-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Video Processing Complete!
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Original File:</span>
                          <span className="text-sm">{unsupportedVideoFile?.name}</span>
                        </div>

                        {videoProcessingResult && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Processing Time:</span>
                              <span className="text-sm">{videoProcessingResult.processing_time?.toFixed(2)}s</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Total Anomalies:</span>
                              <span className="text-sm text-red-400">{videoProcessingResult.total_anomalies || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Frames Processed:</span>
                              <span className="text-sm">{videoProcessingResult.total_frames || 0}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col space-y-3">
                        <button
                          onClick={downloadProcessedVideo}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Processed Video
                        </button>

                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.src = processedVideoUrl;
                              videoRef.current.load();
                              addTerminalLog('✅ Loaded processed video for playback');
                            }
                          }}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play Processed Video
                        </button>

                        <button
                          onClick={() => {
                            setProcessedVideoUrl('');
                            setProcessedVideoBlob(null);
                            setVideoProcessingResult(null);
                          }}
                          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium"
                        >
                          Clear Results
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && remoteCameraSession && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-xl p-6 max-w-md w-full border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  {/* <QRCodeCanvas className="w-5 h-5 mr-2 text-green-400" /> */}
                  Connect Mobile Camera
                </h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="p-2 hover:bg-neutral-800 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-neutral-300 mb-4">
                  Scan this QR code with your phone camera to connect
                </p>

                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeCanvas
                      value={`${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div className="text-xs text-neutral-400 mb-2">
                  Session ID: {remoteCameraSession.sessionId}
                </div>

                <div className="text-sm">
                  <div className={`inline-block px-3 py-1 rounded-full ${remoteCameraStatus === 'connected' ? 'bg-green-600' :
                    remoteCameraStatus === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    {remoteCameraStatus === 'connected' ? 'Connected' :
                      remoteCameraStatus === 'connecting' ? 'Waiting for connection...' : 'Disconnected'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-neutral-300">
                  <strong>Instructions:</strong>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Open your phone camera app</li>
                    <li>Point it at the QR code above</li>
                    <li>Tap the notification/link that appears</li>
                    <li>Allow camera permissions on your phone</li>
                    <li>Click "Start Camera" then "Connect & Stream"</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`;
                      navigator.clipboard.writeText(url);
                      addTerminalLog('✓ Mobile URL copied to clipboard');
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => setShowQRCode(false)}
                    className="flex-1 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && !showTerminal && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'models' ? 'bg-purple-600' : ''}`}
            >
              <Brain className="w-5 h-5 mb-1" />
              <span className="text-xs">Models</span>
            </button>
            <button
              onClick={() => setShowMobileSidebar(true)}
              className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'input' ? 'bg-blue-600' : ''}`}
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-xs">Input</span>
            </button>
            <button
              onClick={() => setShowMobileSidebar(true)}
              className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'controls' ? 'bg-yellow-600' : ''}`}
            >
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-xs">Controls</span>
            </button>
            <button
              onClick={() => setShowMobileSidebar(true)}
              className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'settings' ? 'bg-cyan-600' : ''}`}
            >
              <SettingsIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Settings</span>
            </button>
            <button
              onClick={() => setShowTerminal(true)}
              className={`flex flex-col items-center p-2 rounded ${showTerminal ? 'bg-green-600' : ''}`}
            >
              <Terminal className="w-5 h-5 mb-1" />
              <span className="text-xs">Logs</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Popup - UPDATED with live updates */}
      {showFullscreenPopup && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                <h2 className="text-lg font-bold">Fullscreen View - Live Updates</h2>
              </div>
              <div className="text-sm">
                <span className={`px-3 py-1.5 rounded-lg ${popupCurrentFrame === 'original' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                  {popupCurrentFrame === 'original' ? 'Original Frame' : 'Processed Frame'}
                </span>
                <span className="mx-2 text-neutral-600">|</span>
                <span className="text-neutral-400">
                  Press <kbd className="ml-1 px-2 py-0.5 bg-neutral-800 rounded">K</kbd> to swap
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Live View Toggle */}
              <button
                onClick={() => setIsLiveView(!isLiveView)}
                className={`px-3 py-1.5 rounded text-sm flex items-center ${isLiveView ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-800 hover:bg-neutral-700'}`}
              >
                {isLiveView ? (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                    <span>Live ON</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    <span>Live OFF</span>
                  </>
                )}
              </button>

              {/* Refresh Button */}
              <button
                onClick={refreshPopupFrame}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>

              {/* Download Button */}
              <button
                onClick={downloadPopupFrame}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center"
                disabled={popupCurrentFrame === 'original' ? !popupOriginalFrame : !popupProcessedFrame}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>

              {/* Close Button */}
              <button
                onClick={closeFullscreenPopup}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </button>
            </div>
          </div>

          {/* Main Content - Single Frame View with Live Updates */}
          <div className="flex-1 relative bg-black overflow-hidden">
            {/* Frame indicator */}
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-medium">
                  {popupCurrentFrame === 'original' ? 'Original Frame' : 'Processed Frame'}
                  {isLiveView && (
                    <span className="ml-2 text-green-400">• LIVE</span>
                  )}
                </div>
                <div className="text-xs text-neutral-400">
                  Press <kbd className="ml-1 px-1.5 py-0.5 bg-neutral-800 rounded">K</kbd> to swap
                </div>
              </div>
            </div>

            {/* Live Status Indicator */}
            {isLiveView && (
              <div className="absolute top-4 right-4 z-20 bg-green-900/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                  <span className="text-sm text-green-300">Live Updates Active</span>
                </div>
              </div>
            )}

            {/* Frame display with real-time updates */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {popupCurrentFrame === 'original' ? (
                popupOriginalFrame ? (
                  <img
                    ref={fullscreenImageRef}
                    src={popupOriginalFrame}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    alt="Original Frame"
                    onLoad={() => {
                      if (fullscreenImageRef.current) {
                        addTerminalLog(`✅ Fullscreen original frame loaded: ${fullscreenImageRef.current.naturalWidth}x${fullscreenImageRef.current.naturalHeight}`);
                      }
                    }}
                    onError={(e) => {
                      console.error('Failed to load original frame in popup');
                      addTerminalLog('❌ Failed to load original frame in popup');
                    }}
                  />
                ) : (
                  <div className="text-center p-8 bg-neutral-900/50 rounded-xl">
                    <Video className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <div className="text-neutral-400 text-lg mb-2">No original frame available</div>
                    <div className="text-neutral-500 text-sm">
                      Make sure video is playing or camera is streaming
                    </div>
                    {isLiveView && (
                      <div className="mt-2 text-xs text-yellow-500">
                        Live updates will capture frames automatically
                      </div>
                    )}
                  </div>
                )
              ) : (
                popupProcessedFrame ? (
                  <img
                    ref={fullscreenImageRef}
                    src={popupProcessedFrame}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    alt="Processed Frame"
                    onLoad={() => {
                      if (fullscreenImageRef.current) {
                        addTerminalLog(`✅ Fullscreen processed frame loaded: ${fullscreenImageRef.current.naturalWidth}x${fullscreenImageRef.current.naturalHeight}`);
                      }
                    }}
                    onError={(e) => {
                      console.error('Failed to load processed frame in popup');
                      addTerminalLog('❌ Failed to load processed frame in popup');
                    }}
                  />
                ) : (
                  <div className="text-center p-8 bg-neutral-900/50 rounded-xl">
                    <Brain className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <div className="text-neutral-400 text-lg mb-2">No processed frame available</div>
                    <div className="text-neutral-500 text-sm">
                      Process a frame first using inference controls
                    </div>
                    {isLiveView && (
                      <div className="mt-2 text-xs text-yellow-500">
                        New processed frames will appear here automatically
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setPopupCurrentFrame('original')}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-sm transition-all ${popupCurrentFrame === 'original'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                }`}
              title="Show Original Frame"
            >
              <Eye className="w-5 h-5" />
            </button>

            <button
              onClick={() => setPopupCurrentFrame('processed')}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-sm transition-all ${popupCurrentFrame === 'processed'
                ? 'bg-purple-600 text-white'
                : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                }`}
              title="Show Processed Frame"
            >
              <Brain className="w-5 h-5" />
            </button>

            {/* Frame Counter Overlay */}
            {backendVideoProcessing.isProcessing && (
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
                <div className="text-sm">
                  Frame: {backendVideoProcessing.currentFrame}/{backendVideoProcessing.totalFrames}
                </div>
                <div className="text-xs text-neutral-400">
                  {backendVideoProcessing.progress.toFixed(1)}% complete
                </div>
              </div>
            )}

            {/* Last Update Time */}
            <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
              <div className="text-xs text-neutral-400">
                Last update: {lastFrameUpdateTime ? new Date(lastFrameUpdateTime).toLocaleTimeString() : 'Never'}
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-3 bg-neutral-900/90 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="text-neutral-400">Current Frame:</span>
                  <span className="ml-2 font-medium">
                    {popupCurrentFrame === 'original' ? 'Original' : 'Processed'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Live Updates:</span>
                  <span className={`ml-2 font-medium ${isLiveView ? 'text-green-400' : 'text-red-400'}`}>
                    {isLiveView ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Model:</span>
                  <span className="ml-2 font-medium">
                    {selectedModelInfo?.display_name || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Total Frames:</span>
                  <span className="ml-2 font-medium">
                    {inferenceStats.totalFrames}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Anomalies:</span>
                  <span className="ml-2 font-medium text-red-400">
                    {inferenceStats.totalAnomalies}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${popupCurrentFrame === 'original' ? 'bg-blue-500' : 'bg-neutral-700'}`} />
                  <span className="text-xs text-neutral-400">Original</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${popupCurrentFrame === 'processed' ? 'bg-purple-500' : 'bg-neutral-700'}`} />
                  <span className="text-xs text-neutral-400">Processed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar - Desktop */}
      {!isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Brain className="w-3 h-3 mr-1 text-purple-400" />
                <span>Model: {selectedModelInfo?.display_name || 'None'}</span>
              </div>
              <div className="flex items-center">
                <Activity className="w-3 h-3 mr-1 text-green-400" />
                <span>Frames: {inferenceStats.totalFrames}</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                <span>Avg Time: {inferenceStats.avgTime.toFixed(1)}ms</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
                <span>Anomalies: {inferenceStats.totalAnomalies}</span>
              </div>
              <div className="flex items-center">
                <Video className="w-3 h-3 mr-1 text-blue-400" />
                <span>Mode: {activeTab === 'live' ? (isProcessing ? 'Live Processing' : 'Live View') : 'Batch'}</span>
              </div>
              {inputSource === 'oak' && (
                <div className="flex items-center">
                  <CpuIcon2 className="w-3 h-3 mr-1 text-cyan-400" />
                  <span>Neuron: {isOakStreaming ? 'ON' : 'OFF'}</span>
                </div>
              )}
              {inputSource === 'camera' && (
                <div className="flex items-center">
                  <Camera className="w-3 h-3 mr-1 text-blue-400" />
                  <span>Cameras: {availableCameras.length}</span>
                </div>
              )}
              {connectionError && (
                <div className="flex items-center text-red-400">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  <span>Connection Issue</span>
                </div>
              )}
            </div>

            <div className="text-neutral-500">
              Status: <span className={`font-medium ${isProcessing ? 'text-green-400' : 'text-yellow-400'}`}>
                {isProcessing ? 'PROCESSING' : 'IDLE'}
              </span>
              {loadedModelInfo?.is_dummy && (
                <span className="ml-2 text-yellow-400">(DUMMY MODE)</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}