'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Camera, Target, Brain, Play, Pause,
  Square, Hexagon, Trash2, Save, RefreshCw,
  Settings, Layers, Plus, Edit2, Eye, Zap, Cpu,
  MousePointer, Video, Film, CheckCircle, Grid3x3,
  Download, SkipBack, SkipForward, Volume2, VolumeX,
  Power, PowerOff, Radio, Terminal, X, Copy, Clock, AlertCircle,
  Menu, ChevronDown, ChevronUp, Smartphone, Tablet, Monitor,
  CloudUpload, AlertTriangle, Check, QrCode
} from 'lucide-react';
import Link from 'next/link'
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

interface RemoteCameraSession {
  sessionId: string;
  connected: boolean;
  lastFrameTime: number;
  frameCount: number;
  deviceInfo?: string;
}

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function TrainingPage() {
  // State management
  const [activeTab, setActiveTab] = useState<'setup' | 'record' | 'review' | 'train'>('setup');
  const [inputSource, setInputSource] = useState<'upload' | 'camera' | 'oak' | 'remote'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'rectangle' | 'polygon' | 'select'>('select');
  const [rois, setRois] = useState<ROI[]>([]);
  const [currentROI, setCurrentROI] = useState<ROI | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [frameRate, setFrameRate] = useState(30);
  // Avoid non-deterministic value during SSR. Generate session name on client mount.
  const [sessionName, setSessionName] = useState<string>('');
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [backendConnected, setBackendConnected] = useState(false);
  const [selectedROI, setSelectedROI] = useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const remoteImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sessionName) {
      const generated = `session_${Date.now()}`;
      setSessionName(generated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New states
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(10); // seconds
  const [remainingTime, setRemainingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [trainingWebSocket, setTrainingWebSocket] = useState<WebSocket | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [captureCount, setCaptureCount] = useState(0);
  const [lastSaveStatus, setLastSaveStatus] = useState<string>('');
  const [isCapturingTrainingFrames, setIsCapturingTrainingFrames] = useState(false);

  // OAK Camera states
  const [oakCameraState, setOakCameraState] = useState<'idle' | 'streaming' | 'error'>('idle');
  const [oakDevices, setOakDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isOakStreaming, setIsOakStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string>('');

  // Camera selection states
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const [isLoadingCameras, setIsLoadingCameras] = useState(false);
  const [currentCameraStream, setCurrentCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'input' | 'roi' | 'settings' | 'training'>('input');

  // Backend extraction states
  const [backendExtractionMode, setBackendExtractionMode] = useState(false);
  const [extractionJobId, setExtractionJobId] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionLogs, setExtractionLogs] = useState<string[]>([]);
  const [extractedFramesCount, setExtractedFramesCount] = useState(0);
  const [autoUploadToBackend, setAutoUploadToBackend] = useState(true);

  // Video playback states
  const [isStaticFrameMode, setIsStaticFrameMode] = useState(false);
  const [staticFrameImage, setStaticFrameImage] = useState<HTMLImageElement | null>(null);
  const staticFrameRef = useRef<HTMLImageElement | null>(null);
  const extractorVideoRef = useRef<HTMLVideoElement | null>(null);

  type PlaybackMode = 'video' | 'frames' | 'backend';
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('video');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  // Remote camera states
  const [remoteCameraSession, setRemoteCameraSession] = useState<RemoteCameraSession | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [remoteFrameUrl, setRemoteFrameUrl] = useState<string>('');
  const [remotePollingInterval, setRemotePollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [remoteCameraActive, setRemoteCameraActive] = useState(false);
  const [remoteCameraFrame, setRemoteCameraFrame] = useState<string | null>(null);
  const [remoteCameraStatus, setRemoteCameraStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Collapsible sidebar states
  const [collapsedSections, setCollapsedSections] = useState({
    inputSource: false,
    trainingTypes: false,
    roiTools: false,
    backendExtraction: false,
    recordingSettings: false,
    sessionInfo: false,
    debugTools: false,
  });

  // Analysis modal states
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'extracting' | 'uploading' | 'processing' | 'completed'>('idle');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [analysisDetails, setAnalysisDetails] = useState<string[]>([]);
  const [currentFrameAnalysis, setCurrentFrameAnalysis] = useState(0);
  const [totalFramesAnalysis, setTotalFramesAnalysis] = useState(0);

  const [showUpload, setShowUpload] = useState(false)
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const oakStreamRef = useRef<HTMLImageElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const roiCanvasRef = useRef<HTMLCanvasElement>(null);

  const [trainingTypes, setTrainingTypes] = useState({
    anomaly: true,      // Default enabled
    sequential: false,
    motion: false
  })


  const isRemoteCameraReady = useCallback(() => {
    return remoteCameraStatus === 'connected' && remoteCameraFrame !== null;
  }, [remoteCameraStatus, remoteCameraFrame]);

  // Colors
  const roiColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#f97316'];

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'losses-harris-homework-roll.trycloudflare.com';

  // Helper functions
  const renderProgressBar = (percent: number, width = 20) => {
    const filled = Math.round((percent / 100) * width);
    return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${percent.toFixed(1)}%`;
  };

  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = terminalContainerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [terminalLogs]);

  const addTerminalLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setTrainingLogs(prev => [...prev, logMessage]);
  };

  const addExtractionLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] [BACKEND] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setExtractionLogs(prev => [...prev, logMessage]);
  };

  // Toggle sidebar sections
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Analysis functions
  const startAnalysis = async (type: 'extraction' | 'upload' | 'training') => {
    setShowUpload(true);
    setAnalysisStatus('analyzing');
    setAnalysisProgress(0);
    setAnalysisMessage('Initializing analysis...');
    setAnalysisDetails([]);
    setCurrentFrameAnalysis(0);

    // Initial analysis details
    setAnalysisDetails([
      'Loading video metadata...',
      'Analyzing frame structure...',
      'Detecting scene changes...',
      'Preparing ROI data...'
    ]);

    // Simulate initial analysis
    await simulateAnalysisStep(1000, 'analyzing', 'Analyzing video content...', 10);

    if (type === 'extraction') {
      await startExtractionAnalysis();
    } else if (type === 'upload') {
      await startUploadAnalysis();
    } else if (type === 'training') {
      await startTrainingAnalysis();
    }
  };

  const simulateAnalysisStep = async (
    duration: number,
    status: typeof analysisStatus,
    message: string,
    progressIncrement: number
  ) => {
    return new Promise<void>((resolve) => {
      setAnalysisStatus(status);
      setAnalysisMessage(message);

      const interval = 100; // Update every 100ms
      const steps = duration / interval;
      const increment = progressIncrement / steps;

      let current = analysisProgress;
      const timer = setInterval(() => {
        current += increment;
        setAnalysisProgress(Math.min(current, analysisProgress + progressIncrement));

        if (current >= analysisProgress + progressIncrement) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  };

  const startExtractionAnalysis = async () => {
    setAnalysisDetails([
      `Video: ${videoFile?.name || 'Unknown'}`,
      `Dimensions: ${videoDimensions.width}x${videoDimensions.height}`,
      `Frame Rate: ${frameRate} FPS`,
      `Duration: ${recordingDuration}s`,
      `Total Frames: ${recordingDuration * frameRate}`
    ]);

    // Step 1: Frame extraction
    await simulateAnalysisStep(2000, 'extracting', 'Extracting frames from video...', 25);
    setAnalysisDetails(prev => [...prev, '✓ Frame extraction started']);

    // Step 2: ROI processing
    await simulateAnalysisStep(1500, 'analyzing', 'Processing ROI data...', 15);
    setAnalysisDetails(prev => [...prev, `✓ ${rois.length} ROI${rois.length !== 1 ? 's' : ''} processed`]);

    // Step 3: Frame analysis
    await simulateAnalysisStep(3000, 'analyzing', 'Analyzing extracted frames...', 25);

    // Update frame count progress
    const totalFrames = recordingDuration * frameRate;
    setTotalFramesAnalysis(totalFrames);

    // Simulate frame-by-frame analysis
    for (let i = 0; i < totalFrames; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate frame processing
      setCurrentFrameAnalysis(i + 1);
      const progress = 65 + ((i + 1) / totalFrames) * 25; // 65% to 90%
      setAnalysisProgress(progress);

      if ((i + 1) % 10 === 0) {
        setAnalysisMessage(`Analyzing frame ${i + 1} of ${totalFrames}...`);
      }
    }

    // Completion
    await simulateAnalysisStep(1000, 'completed', 'Extraction complete!', 10);
    setAnalysisDetails(prev => [...prev, '✓ All frames analyzed successfully']);
    setAnalysisMessage('Video analysis complete! Ready for AI training.');
  };

  const startUploadAnalysis = async () => {
    setAnalysisDetails([
      `Uploading to: ${NEXT_PUBLIC_BACKEND_URL}`,
      `File Size: ${videoFile ? (videoFile.size / 1024 / 1024).toFixed(2) : '0'} MB`,
      `Session: ${sessionName}`,
      `ROIs: ${rois.length}`,
      `Frame Rate: ${frameRate} FPS`
    ]);

    // Step 1: Preparing upload
    await simulateAnalysisStep(1000, 'uploading', 'Preparing data for upload...', 10);

    // Step 2: Uploading
    await simulateAnalysisStep(3000, 'uploading', 'Uploading to backend server...', 40);
    setAnalysisDetails(prev => [...prev, '✓ Data upload in progress']);

    // Step 3: Server processing
    await simulateAnalysisStep(4000, 'processing', 'Server processing data...', 30);
    setAnalysisDetails(prev => [...prev, '✓ Server processing frames']);

    // Step 4: Completion
    await simulateAnalysisStep(1000, 'completed', 'Upload complete!', 20);
    setAnalysisDetails(prev => [...prev, '✓ Upload completed successfully']);
    setAnalysisMessage('Data successfully uploaded to backend!');
  };

  const startTrainingAnalysis = async () => {
    setAnalysisDetails([
      `Training Session: ${sessionName}`,
      `Input Source: ${inputSource}`,
      `Frame Rate: ${frameRate} FPS`,
      `ROIs: ${rois.length}`,
      `Training Modes: ${Object.entries(trainingTypes).filter(([_, v]) => v).map(([k]) => k).join(', ')}`
    ]);

    // Step 1: Preparing training data
    await simulateAnalysisStep(2000, 'processing', 'Preparing training dataset...', 20);

    // Step 2: Model initialization
    await simulateAnalysisStep(3000, 'processing', 'Initializing AI models...', 30);
    setAnalysisDetails(prev => [...prev, '✓ AI models initialized']);

    // Step 3: Feature extraction
    await simulateAnalysisStep(4000, 'processing', 'Extracting features from frames...', 30);
    setAnalysisDetails(prev => [...prev, '✓ Feature extraction complete']);

    // Step 4: Training preparation
    await simulateAnalysisStep(2000, 'processing', 'Finalizing training setup...', 20);

    // Completion
    await simulateAnalysisStep(1000, 'completed', 'Training ready!', 20);
    setAnalysisDetails(prev => [...prev, '✓ Training setup complete']);
    setAnalysisMessage('AI training is ready to start!');
  };

  // Remote camera functions
  const generateSessionId = () => {
    return `remote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

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
    setInputSource('remote');
    setRemoteCameraActive(true);
    setRemoteCameraStatus('connecting');

    // Generate the URL for mobile phone
    const baseUrl = window.location.origin;
    const mobileUrl = `${baseUrl}/mobile-camera?session=${sessionId}`;

    addTerminalLog(`📱 Remote camera session started: ${sessionId}`);
    addTerminalLog(`📱 Mobile URL: ${mobileUrl}`);
    addTerminalLog(`📱 Scan the QR code with your phone to connect`);

    // Start polling for frames
    startRemoteFramePolling(sessionId);

    return mobileUrl;
  };

  // const startLiveTraining = async () => {
  //   try {
  //     addTerminalLog(`=== Starting Live Training with Remote Camera ===`);

  //     if (remoteCameraStatus !== 'connected') {
  //       alert('Please connect remote camera first');
  //       return;
  //     }

  //     if (rois.length === 0) {
  //       addTerminalLog(`Mode: Full Frame (no ROIs drawn)`);
  //     } else {
  //       addTerminalLog(`Mode: ROI-based`);
  //       addTerminalLog(`Number of ROIs: ${rois.length}`);
  //     }

  //     setShowUpload(true)
  //     const trainingROIs = rois.length === 0
  //       ? [{
  //         id: 'full_frame',
  //         type: 'rectangle',
  //         points: [
  //           { x: 0, y: 0 },
  //           { x: videoDimensions.width, y: videoDimensions.height }
  //         ],
  //         label: 'Full Frame',
  //         color: '#3b82f6'
  //       }]
  //       : rois;

  //     // Start continuous capture for live training
  //     setIsRecording(true);
  //     setCaptureCount(0);

  //     let frameNumber = 0;
  //     const captureInterval = setInterval(async () => {
  //       if (!isRecording || remoteCameraStatus !== 'connected') {
  //         clearInterval(captureInterval);
  //         return;
  //       }

  //       try {
  //         await captureFrame(frameNumber);
  //         frameNumber++;

  //         // Update progress
  //         const progress = frameNumber % 100; // Show progress in batches of 100
  //         if (progress === 0) {
  //           addTerminalLog(`📊 Captured ${frameNumber} frames from remote camera`);
  //         }
  //       } catch (error) {
  //         console.error('Error capturing frame:', error);
  //       }
  //     }, 1000 / frameRate); // Capture at the specified frame rate

  //     // Store interval reference for cleanup
  //     recordingIntervalRef.current = captureInterval;

  //     // Start training session
  //     addTerminalLog(`Step 2: Starting training session...`);

  //     const trainingOptions = [];
  //     if (trainingTypes.anomaly) trainingOptions.push("anomaly");
  //     if (trainingTypes.sequential) trainingOptions.push("sequential");
  //     if (trainingTypes.motion) trainingOptions.push("motion");

  //     const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/start/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         session_id: sessionName,
  //         rois: trainingROIs,
  //         frame_rate: frameRate,
  //         training_options: trainingOptions,
  //         source_type: 'remote_camera',
  //         live_mode: true
  //       })
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       addTerminalLog(`✓ Live training started!`);
  //       addTerminalLog(`Training ID: ${result.training_id}`);

  //       // Connect to WebSocket for logs
  //       connectToTrainingWebSocket(result.training_id);
  //       setShowUpload(false)
  //       setShowTerminal(true);
  //       setTrainingStatus('running');
  //     } else {
  //       const errorText = await response.text();
  //       addTerminalLog(`❌ ERROR: ${errorText}`);
  //       alert(`Failed to start training: ${errorText}`);
  //     }

  //   } catch (error) {
  //     console.error('Error starting live training:', error);
  //     addTerminalLog(`❌ ERROR: ${error}`);
  //   }
  // };
  const startLiveTraining = async () => {
    try {
      addTerminalLog(`=== Starting Live Training with Remote Camera ===`);

      if (remoteCameraStatus !== 'connected') {
        alert('Please connect remote camera first');
        return;
      }

      if (rois.length === 0) {
        addTerminalLog(`Mode: Full Frame (no ROIs drawn)`);
      } else {
        addTerminalLog(`Mode: ROI-based`);
        addTerminalLog(`Number of ROIs: ${rois.length}`);
      }

      setShowUpload(true);

      // Step 1: First capture frames from the canvas (like we do for other sources)
      addTerminalLog(`Step 1: Capturing frames from canvas...`);

      setIsRecording(true);
      setCaptureCount(0);
      const initialFrames = 30; // Capture 30 frames first

      // Use the existing canvas for capturing
      const videoCanvas = document.createElement('canvas');
      videoCanvas.width = videoDimensions.width;
      videoCanvas.height = videoDimensions.height;
      const videoCtx = videoCanvas.getContext('2d');

      if (!videoCtx) {
        throw new Error('Failed to create canvas context');
      }

      // Create hidden canvas for ROI captures
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = videoDimensions.width;
      hiddenCanvas.height = videoDimensions.height;
      const hiddenCtx = hiddenCanvas.getContext('2d');

      if (!hiddenCtx) {
        throw new Error('Failed to create hidden canvas context');
      }

      for (let i = 0; i < initialFrames; i++) {
        if (!isRecording || remoteCameraStatus !== 'connected') {
          addTerminalLog('Recording stopped or camera disconnected');
          break;
        }

        try {
          // Wait for remote camera frame to be available
          await new Promise(resolve => setTimeout(resolve, 100));

          if (!remoteCameraFrame) {
            addTerminalLog(`⚠ Waiting for remote camera frame ${i + 1}...`);
            continue;
          }

          // Draw the current remote frame to our canvas
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Draw to video canvas
          videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
          videoCtx.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);

          // Draw to hidden canvas (for ROI captures)
          hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
          hiddenCtx.drawImage(img, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

          // Capture from canvas
          if (rois.length === 0) {
            // Full frame capture
            await captureFullFrameFromCanvas(videoCanvas, i);
          } else {
            // ROI-based capture
            for (const roi of rois) {
              await captureROIFromCanvas(hiddenCanvas, hiddenCtx, roi, i);
            }
          }

          setCaptureCount(prev => prev + 1);
          addTerminalLog(`✓ Captured frame ${i + 1}/${initialFrames}`);

          // Wait for next frame
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));

        } catch (error) {
          console.error(`Error capturing frame ${i}:`, error);
          // addTerminalLog(`⚠ Error capturing frame ${i}: ${error.message}`);
        }
      }

      setIsRecording(false);
      addTerminalLog(`✓ Initial ${captureCount} frames captured and saved to session`);

      // Step 2: Verify session has frames
      addTerminalLog(`Step 2: Verifying session...`);

      try {
        const verifyResponse = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/sessions/${sessionName}/frame-count`);
        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          addTerminalLog(`✓ Session verified: ${data.total_frames || 0} frames available`);

          if (!data.total_frames || data.total_frames === 0) {
            throw new Error('No frames found in session');
          }
        } else {
          throw new Error('Failed to verify session');
        }
      } catch (error) {
        // addTerminalLog(`❌ Session verification failed: ${error.message}`);
        alert('Failed to create session with frames. Please try again.');
        setShowUpload(false);
        return;
      }

      // Step 3: Start training session
      addTerminalLog(`Step 3: Starting training session...`);

      const trainingOptions = [];
      if (trainingTypes.anomaly) trainingOptions.push("anomaly");
      if (trainingTypes.sequential) trainingOptions.push("sequential");
      if (trainingTypes.motion) trainingOptions.push("motion");

      const trainingROIs = rois.length === 0
        ? [{
          id: 'full_frame',
          type: 'rectangle',
          points: [
            { x: 0, y: 0 },
            { x: videoDimensions.width, y: videoDimensions.height }
          ],
          label: 'Full Frame',
          color: '#3b82f6'
        }]
        : rois;

      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionName,
          rois: trainingROIs,
          frame_rate: frameRate,
          training_options: trainingOptions,
          source_type: 'remote_camera',
          live_mode: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        addTerminalLog(`✓ Live training started!`);
        addTerminalLog(`Training ID: ${result.training_id}`);

        // Step 4: Start continuous capture for ongoing training
        setIsRecording(true);

        let frameNumber = captureCount; // Continue from where we left off
        const captureInterval = setInterval(async () => {
          if (!isRecording || remoteCameraStatus !== 'connected') {
            clearInterval(captureInterval);
            return;
          }

          try {
            // Capture frame from canvas and send for inference
            if (remoteCameraFrame) {
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
              });

              videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
              videoCtx.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);

              // Send frame for inference
              const blob = await new Promise<Blob | null>((resolve) => {
                videoCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
              });

              if (blob) {
                const inferenceFormData = new FormData();
                inferenceFormData.append('frame', blob);
                inferenceFormData.append('session_id', sessionName);
                inferenceFormData.append('training_id', result.training_id);
                inferenceFormData.append('frame_number', frameNumber.toString());

                await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/live-frame`, {
                  method: 'POST',
                  body: inferenceFormData,
                });

                frameNumber++;
                setCaptureCount(frameNumber);

                // Log progress every 10 frames
                if (frameNumber % 10 === 0) {
                  addTerminalLog(`📊 Sent ${frameNumber} frames for live inference`);
                }
              }
            }
          } catch (error) {
            console.error('Error sending live frame:', error);
          }
        }, 1000 / frameRate);

        // Store interval reference for cleanup
        recordingIntervalRef.current = captureInterval;

        // Connect to WebSocket for logs
        connectToTrainingWebSocket(result.training_id);
        setShowUpload(false);
        setShowTerminal(true);
        setTrainingStatus('running');
      } else {
        const errorText = await response.text();
        addTerminalLog(`❌ ERROR: ${errorText}`);
        alert(`Failed to start training: ${errorText}`);
        setShowUpload(false);
      }

    } catch (error) {
      console.error('Error starting live training:', error);
      // addTerminalLog(`❌ ERROR: ${error.message || error}`);
      setShowUpload(false);
    }
  };

  // Add these helper functions:
  // const captureFullFrameFromCanvas = async (canvas: HTMLCanvasElement, frameNumber: number) => {
  //   const blob = await new Promise<Blob | null>((resolve) => {
  //     canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  //   });

  //   if (blob && blob.size > 1000) {
  //     const formData = new FormData();
  //     formData.append('frame', blob, `frame_${frameNumber}.jpg`);
  //     formData.append('session_id', sessionName);
  //     formData.append('frame_number', frameNumber.toString());
  //     formData.append('video_width', videoDimensions.width.toString());
  //     formData.append('video_height', videoDimensions.height.toString());

  //     const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       addTerminalLog(`↑ Uploaded full frame ${frameNumber}`);
  //       return await response.json();
  //     } else {
  //       const errorText = await response.text();
  //       throw new Error(`Failed to upload frame: ${errorText}`);
  //     }
  //   } else {
  //     throw new Error('Failed to create blob from canvas');
  //   }
  // };

  // const captureROIFromCanvas = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roi: ROI, frameNumber: number) => {
  //   let x = 0, y = 0, width = 0, height = 0;

  //   if (roi.type === 'rectangle' && roi.points.length === 2) {
  //     const [p1, p2] = roi.points;
  //     x = Math.min(p1.x, p2.x);
  //     y = Math.min(p1.y, p2.y);
  //     width = Math.abs(p2.x - p1.x);
  //     height = Math.abs(p2.y - p1.y);
  //   } else if (roi.type === 'polygon' && roi.points.length >= 3) {
  //     const xs = roi.points.map(p => p.x);
  //     const ys = roi.points.map(p => p.y);
  //     x = Math.min(...xs);
  //     y = Math.min(...ys);
  //     width = Math.max(...xs) - x;
  //     height = Math.max(...ys) - y;
  //   }

  //   if (width > 10 && height > 10) {
  //     // Extract ROI from canvas
  //     const imageData = ctx.getImageData(x, y, width, height);
  //     const roiCanvas = document.createElement('canvas');
  //     roiCanvas.width = width;
  //     roiCanvas.height = height;
  //     const roiCtx = roiCanvas.getContext('2d');

  //     if (roiCtx) {
  //       roiCtx.putImageData(imageData, 0, 0);

  //       const blob = await new Promise<Blob | null>((resolve) => {
  //         roiCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  //       });

  //       if (blob && blob.size > 1000) {
  //         const formData = new FormData();
  //         formData.append('frame', blob, `frame_${frameNumber}_${roi.id}.jpg`);
  //         formData.append('session_id', sessionName);
  //         formData.append('roi_id', roi.id);
  //         formData.append('roi_label', roi.label);
  //         formData.append('roi_type', roi.type);
  //         formData.append('frame_number', frameNumber.toString());
  //         formData.append('video_width', videoDimensions.width.toString());
  //         formData.append('video_height', videoDimensions.height.toString());

  //         const pointsArray = roi.points.map(p => [p.x, p.y]);
  //         formData.append('roi_points', JSON.stringify(pointsArray));

  //         const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
  //           method: 'POST',
  //           body: formData,
  //         });

  //         if (response.ok) {
  //           addTerminalLog(`↑ Uploaded frame ${frameNumber} for ROI ${roi.label}`);
  //           return await response.json();
  //         } else {
  //           const errorText = await response.text();
  //           throw new Error(`Failed to upload ROI frame: ${errorText}`);
  //         }
  //       } else {
  //         throw new Error('Failed to create blob from ROI canvas');
  //       }
  //     }
  //   } else {
  //     throw new Error(`ROI ${roi.label} too small: ${width}x${height}`);
  //   }
  // };

  const startRecordingForRemote = async () => {
    try {
      if (!remoteCameraFrame) {
        alert('No frame available from remote camera');
        return;
      }

      setIsRecording(true);
      setCaptureCount(0);
      const framesToCapture = recordingDuration * frameRate;

      addTerminalLog(`=== Starting Recording ===`);
      addTerminalLog(`Session: ${sessionName}`);
      addTerminalLog(`Duration: ${recordingDuration} seconds`);
      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`ROIs: ${rois.length} (${rois.length === 0 ? 'Full Frame mode' : 'ROI mode'})`);
      addTerminalLog(`========================`);

      for (let i = 0; i < framesToCapture; i++) {
        if (!isRecording) break;

        try {
          // Wait for a frame to be available
          if (!remoteCameraFrame) {
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }

          // Create image from base64
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Create canvas and draw image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = videoDimensions.width;
          tempCanvas.height = videoDimensions.height;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            // Convert to blob
            const blob = await new Promise<Blob | null>((resolve) => {
              tempCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
            });

            if (blob) {
              // Send frame to backend
              const formData = new FormData();
              formData.append('frame', blob, `frame_${i}.jpg`);
              formData.append('session_id', sessionName);
              formData.append('frame_number', i.toString());
              formData.append('video_width', videoDimensions.width.toString());
              formData.append('video_height', videoDimensions.height.toString());

              // Add ROI data if we have ROIs
              if (rois.length > 0) {
                for (const roi of rois) {
                  const roiFormData = new FormData();
                  roiFormData.append('frame', blob, `frame_${i}_${roi.id}.jpg`);
                  roiFormData.append('session_id', sessionName);
                  roiFormData.append('roi_id', roi.id);
                  roiFormData.append('roi_label', roi.label);
                  roiFormData.append('roi_type', roi.type);
                  roiFormData.append('frame_number', i.toString());
                  roiFormData.append('video_width', videoDimensions.width.toString());
                  roiFormData.append('video_height', videoDimensions.height.toString());

                  const pointsArray = roi.points.map(p => [p.x, p.y]);
                  roiFormData.append('roi_points', JSON.stringify(pointsArray));

                  await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
                    method: 'POST',
                    body: roiFormData,
                  });
                }
              } else {
                // Full frame mode
                await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
                  method: 'POST',
                  body: formData,
                });
              }

              setCaptureCount(prev => prev + 1);

              // Update progress
              const progress = ((i + 1) / framesToCapture) * 100;
              setRecordingProgress(progress);

              if ((i + 1) % 10 === 0) {
                addTerminalLog(`📸 Captured ${i + 1}/${framesToCapture} frames (${progress.toFixed(1)}%)`);
              }
            }
          }

          // Wait for next frame
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
        } catch (error) {
          console.error(`Error capturing frame ${i}:`, error);
          // addTerminalLog(`⚠ Error capturing frame ${i}: ${error.message}`);
        }
      }

      setIsRecording(false);
      addTerminalLog(`✓ Recording completed. Captured ${captureCount} frames.`);

    } catch (error) {
      console.error('Error in recording:', error);
      // addTerminalLog(`❌ Recording error: ${error.message}`);
      setIsRecording(false);
    }
  };
  // Add this useEffect to properly handle mobile camera dimensions
  useEffect(() => {
    if (inputSource === 'remote' && remoteCameraFrame) {
      // Force recalculation of canvas dimensions for mobile camera
      const updateMobileCanvasDimensions = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        const containerWidth = container.clientWidth;
        const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

        // Use actual mobile camera dimensions or default
        const mobileWidth = videoDimensions.width || 1280;
        const mobileHeight = videoDimensions.height || 720;

        const aspectRatio = mobileWidth / mobileHeight;
        let width = containerWidth;
        let height = containerWidth / aspectRatio;

        if (height > containerHeight) {
          height = containerHeight;
          width = containerHeight * aspectRatio;
        }

        const scaleX = width / mobileWidth;
        const scaleY = height / mobileHeight;
        const newScale = Math.min(scaleX, scaleY);

        const offsetX = (containerWidth - mobileWidth * newScale) / 2;
        const offsetY = (containerHeight - mobileHeight * newScale) / 2;

        setScale(newScale);
        setOffset({ x: offsetX, y: offsetY });

        canvas.width = containerWidth;
        canvas.height = containerHeight;
      };

      updateMobileCanvasDimensions();

      // Redraw canvas with correct dimensions
      drawCanvas();
    }
  }, [inputSource, remoteCameraFrame, videoDimensions, isMobile]);

  const startRemoteFramePolling = (sessionId: string) => {
    // Clear any existing interval
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
    }

    // Poll every 100ms for smooth streaming
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/frame/${sessionId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.frame && data.timestamp) {
            // Create image from base64
            const img = new Image();
            img.onload = () => {
              // Set actual dimensions from the image
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
    }, 100); // 10 FPS polling

    setRemotePollingInterval(interval);
  };

  const stopRemoteCamera = () => {
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
      setRemotePollingInterval(null);
    }

    if (remoteCameraSession) {
      // Notify backend to clean up
      fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/stop/${remoteCameraSession.sessionId}`, {
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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize video extractor
  useEffect(() => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.crossOrigin = 'anonymous';
    extractorVideoRef.current = v;

    return () => {
      v.src = '';
    };
  }, []);

  // Initialize canvas and connections
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) drawingContextRef.current = ctx;
    }

    // Create hidden canvas for capture
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 1280;
    hiddenCanvas.height = 720;
    captureCanvasRef.current = hiddenCanvas;

    // Check connections
    checkBackendConnection();
    checkOakCameraConnection();
    listOakDevices();

    // Initial terminal message
    addTerminalLog('System initialized. Ready to start.');
    addTerminalLog('1. Select input source (upload, camera, OAK, or remote)');
    addTerminalLog('2. Draw ROIs on the video');
    addTerminalLog('3. Adjust recording settings');
    addTerminalLog('4. Click "Start AI Training"');

    // List available cameras on mount
    listAvailableCamerasOnMount();

    // Cleanup function
    return () => {
      if (currentCameraStream) {
        stopCamera();
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (trainingWebSocket) {
        trainingWebSocket.close();
      }
      // Add remote camera cleanup
      if (remotePollingInterval) {
        clearInterval(remotePollingInterval);
      }
      if (remoteCameraSession) {
        stopRemoteCamera();
      }
    };
  }, []);

  // Video support checking
  const checkVideoSupport = (video: HTMLVideoElement): Promise<boolean> => {
    return new Promise((resolve) => {
      let resolved = false;

      const success = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(true);
        }
      };

      const fail = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      };

      const cleanup = () => {
        video.removeEventListener('canplay', success);
        video.removeEventListener('error', fail);
      };

      video.addEventListener('canplay', success);
      video.addEventListener('error', fail);

      // Timeout fallback
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 2000);
    });
  };

  // FFmpeg frame extraction
  const extractFrameWithFFmpeg = async (file: File): Promise<HTMLImageElement> => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    await ffmpeg.writeFile('input', await fetchFile(file));
    await ffmpeg.exec([
      '-i', 'input',
      '-vf', 'select=eq(n\\,12)',
      '-vframes', '1',
      'frame.png'
    ]);

    const data = await ffmpeg.readFile('frame.png');

    let blob: Blob;

    if (data instanceof Uint8Array) {
      blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
    } else {
      blob = new Blob(
        [new TextEncoder().encode(data)],
        { type: 'image/png' }
      );
    }

    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    await img.decode();

    return img;
  };

  // Video frame utilities
  const waitForVideoFrame = (video: HTMLVideoElement): Promise<void> => {
    return new Promise(resolve => {
      if ('requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(() => resolve());
      } else {
        requestAnimationFrame(() => resolve());
      }
    });
  };

  const seekAndDecodeFrame = async (
    video: HTMLVideoElement,
    frameNumber: number,
    fps: number
  ) => {
    const targetTime = frameNumber / fps;

    if (video.paused) {
      await video.play().catch(() => { });
    }

    video.currentTime = Math.min(targetTime, video.duration || targetTime);
    await waitForVideoFrame(video);
    video.pause();
  };

  const extractFrame = async (
    frameNumber: number,
    fps: number,
    canvas: HTMLCanvasElement
  ) => {
    const video = extractorVideoRef.current;
    if (!video) throw new Error('Extractor video missing');

    const ctx = canvas.getContext('2d')!;
    const targetTime = frameNumber / fps;

    await new Promise<void>(resolve => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        resolve();
      };

      video.addEventListener('seeked', onSeeked);
      video.currentTime = Math.min(targetTime, video.duration || targetTime);
    });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0);
  };

  // Camera handling
  const listAvailableCamerasOnMount = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
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

  const listAvailableCameras = async () => {
    try {
      setIsLoadingCameras(true);
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log('Permission request failed, continuing with device enumeration');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
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

  const startCamera = async (deviceId?: string) => {
    try {
      // 1. Start with bare minimum constraints
      let constraints: MediaStreamConstraints = {
        video: true, // Let the browser choose defaults
        audio: false
      };

      // 2. Only apply device-specific constraints if a device is selected
      if (deviceId) {
        constraints.video = {
          deviceId: { exact: deviceId },
          // Use 'ideal' instead of 'exact' for dimensions to be more flexible
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // 3. Rest of your code to handle the stream...
      if (currentCameraStream) {
        stopCamera();
      }

      setCurrentCameraStream(stream);
      ~setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setInputSource('camera');
        setShowCameraSelection(false);
        addTerminalLog('✓ Webcam started successfully');

        // Force play to avoid browser autoplay block even when muted/playsInline
        videoRef.current.play().then(() => {
          addTerminalLog('✓ Webcam playback started');
        }).catch((err: any) => {
          addTerminalLog(`⚠️ Webcam playback was blocked: ${err?.message || err}`);
        });

        // Wait for video metadata to get actual resolution
        videoRef.current.onloadedmetadata = () => {
          const width = videoRef.current!.videoWidth;
          const height = videoRef.current!.videoHeight;
          setVideoDimensions({ width, height });
          updateCanvasDimensions();
          addTerminalLog(`✓ Camera resolution: ${width}x${height}`);
        };
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      const msg = error?.name === 'NotAllowedError'
        ? 'Camera access denied. Please allow camera permissions in your browser settings.'
        : error?.name === 'NotFoundError'
          ? 'No camera found. Connect a camera and try again.'
          : error?.name === 'NotReadableError'
            ? 'Camera is already in use by another app.'
            : `Error accessing camera: ${error?.message || 'unknown error'}`;

      setCameraError(msg);
      addTerminalLog(`❌ ${msg}`);

      // 4. Fallback: Try without any constraints at all
      try {
        addTerminalLog('Trying with fallback constraints (video: true)...');
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        setCurrentCameraStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          setInputSource('camera');
          setShowCameraSelection(false);
          addTerminalLog('✓ Webcam started with fallback constraints');
        }
      } catch (fallbackError: any) {
        const msg = `Fallback also failed: ${fallbackError?.message || 'unknown error'}`;
        setCameraError(msg);
        addTerminalLog(`❌ ${msg}`);
        alert(`Could not access any camera. ${fallbackError?.message || fallbackError}`);
      }
    }
  };

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

    setCameraError(null);
    addTerminalLog('✓ Camera stopped');
  };

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

  const handleInputSourceChange = (newSource: 'upload' | 'camera' | 'oak' | 'remote') => {
    if (inputSource === 'camera' && newSource !== 'camera') {
      stopCamera();
    }

    if (inputSource === 'oak' && newSource !== 'oak') {
      if (isOakStreaming) {
        stopOakCamera();
      }
    }

    if (inputSource === 'remote' && newSource !== 'remote') {
      stopRemoteCamera();
    }

    setInputSource(newSource);
    setShowCameraSelection(false);
  };

  // Backend extraction functions
  const uploadVideoToBackend = async (file: File) => {
    try {
      // Show analysis modal
      startAnalysis('upload');

      setExtractionStatus('uploading');
      addExtractionLog(`📤 Uploading video to backend for frame extraction...`);
      addExtractionLog(`File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      // Prepare ROI data
      const roiData = rois.map(roi => ({
        id: roi.id,
        label: roi.label,
        type: roi.type,
        points: roi.points.map(p => ({ x: p.x, y: p.y }))
      }));

      const formData = new FormData();
      formData.append('video', file);
      formData.append('session_id', sessionName);
      formData.append('rois', JSON.stringify(roiData));
      formData.append('frame_rate', frameRate.toString());
      formData.append('video_width', videoDimensions.width.toString());
      formData.append('video_height', videoDimensions.height.toString());

      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setExtractionJobId(result.job_id);
        setExtractionStatus('processing');
        addExtractionLog(`✅ Video uploaded successfully`);
        addExtractionLog(`🔧 Extraction Job ID: ${result.job_id}`);
        addExtractionLog(`⏳ Frame extraction started on backend...`);

        // Start polling for extraction status
        pollExtractionStatus(result.job_id);

      } else {
        const errorText = await response.text();
        addExtractionLog(`❌ Failed to upload video: ${errorText}`);
        setExtractionStatus('failed');
        setShowUpload(false);
      }

    } catch (error) {
      console.error('Error uploading video:', error);
      addExtractionLog(`❌ Error uploading video: ${error}`);
      setExtractionStatus('failed');
      setShowUpload(false);
    }
  };

  const pollExtractionStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(
          `https://${NEXT_PUBLIC_BACKEND_URL}/api/training/extraction-status/${jobId}`
        );

        if (response.ok) {
          const status = await response.json();

          setExtractionProgress(status.progress || 0);
          setExtractionStatus(status.status as any);

          // Update extracted frames count
          if (status.extracted_frames) {
            setExtractedFramesCount(status.extracted_frames);
          }

          // Update logs
          if (status.logs && status.logs.length > 0) {
            const newLogs = status.logs.filter((log: string) =>
              !extractionLogs.includes(log)
            );

            if (newLogs.length > 0) {
              newLogs.forEach((log: string) => addExtractionLog(log));
              setExtractionLogs(prev => [...prev, ...newLogs]);
            }
          }

          // Update analysis modal progress
          setAnalysisProgress(status.progress || 0);
          setCurrentFrameAnalysis(status.extracted_frames || 0);

          // Continue polling if still processing
          if (status.status === 'processing') {
            setTimeout(poll, 1000);
          } else if (status.status === 'completed') {
            addExtractionLog(`✅ Backend frame extraction completed!`);
            addExtractionLog(`📊 Total frames extracted: ${status.extracted_frames}`);
            addExtractionLog(`🎯 Ready for training`);

            // Update capture count
            setCaptureCount(status.extracted_frames || 0);

            // Update analysis modal
            setAnalysisStatus('completed');
            setAnalysisMessage('Frame extraction completed!');
            setAnalysisDetails(prev => [...prev, `✓ ${status.extracted_frames} frames extracted`]);

          } else if (status.status === 'failed') {
            addExtractionLog(`❌ Backend frame extraction failed`);
            setShowUpload(false);
          }
        }
      } catch (error) {
        console.error('Error polling extraction status:', error);
        // Retry after delay
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  const cancelBackendExtraction = async () => {
    if (extractionJobId) {
      addExtractionLog(`Cancelling backend extraction...`);
      setExtractionStatus('failed');
      setBackendExtractionMode(false);
      setShowUpload(false);
    }
  };

  // Video upload handler
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !videoRef.current || !canvasRef.current) return;

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setIsStaticFrameMode(false);
    setStaticFrameImage(null);
    setBackendExtractionMode(false);
    setExtractionStatus('idle');

    const video = videoRef.current;
    video.src = url;

    addTerminalLog(`📂 Video uploaded: ${file.name}`);
    addTerminalLog(`🔍 Checking video codec support...`);

    const supported = await checkVideoSupport(video);

    // Prepare extractor video
    if (extractorVideoRef.current) {
      extractorVideoRef.current.src = url;
      await extractorVideoRef.current.play().catch(() => { });
      extractorVideoRef.current.pause();
      extractorVideoRef.current.currentTime = 0;
    }

    // CASE 1: Browser-supported video
    if (supported) {
      setPlaybackMode('video');
      setIsStaticFrameMode(false);

      video.addEventListener('loadedmetadata', () => {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        setVideoDimensions({ width, height });
        updateCanvasDimensions();
        addTerminalLog(`✅ Video supported. Using native playback.`);
      }, { once: true });

      return;
    }

    // CASE 2: Unsupported → BACKEND EXTRACTION MODE
    addTerminalLog(`⚠ Unsupported codec. Switching to backend extraction mode.`);
    setBackendExtractionMode(true);
    setIsStaticFrameMode(true);
    setPlaybackMode('backend');

    // Extract a static frame for UI preview using FFmpeg
    try {
      const img = await extractFrameWithFFmpeg(file);
      staticFrameRef.current = img;
      setStaticFrameImage(img);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      setVideoDimensions({
        width: img.width,
        height: img.height,
      });

      addTerminalLog(`🖼 Static preview frame loaded (${img.width}x${img.height})`);
      addTerminalLog(`🔄 Video will be processed on backend for frame extraction`);

      // Show analysis modal
      setTimeout(() => {
        startAnalysis('extraction');
      }, 500);

      // Auto-upload to backend
      if (autoUploadToBackend) {
        addTerminalLog(`📤 Auto-uploading video to backend...`);
        setTimeout(() => {
          if (backendExtractionMode) {
            uploadVideoToBackend(file);
          }
        }, 2000);
      } else {
        addTerminalLog(`📤 Click "Process on Backend" button to start extraction`);
      }

    } catch (err) {
      addTerminalLog(`❌ Failed to extract preview frame`);
      console.error(err);

      // Fallback: Create blank canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1280;
      canvas.height = 720;
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText('Unsupported video format', 20, 50);
      ctx.fillText('Uploading to backend for processing...', 20, 80);
    }
  };

  // Update canvas dimensions
  const updateCanvasDimensions = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

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
  }, [videoDimensions, isMobile]);

  // Video metadata loaded
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      setVideoDimensions({ width, height });
      updateCanvasDimensions();
      addTerminalLog(`✓ Video loaded: ${width}x${height}`);
    }
  }, [updateCanvasDimensions]);

  // OAK stream load
  const handleOakStreamLoad = useCallback(() => {
    if (oakStreamRef.current) {
      const img = oakStreamRef.current;
      setVideoDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      updateCanvasDimensions();
      addTerminalLog(`✓ OAK Stream loaded: ${img.naturalWidth}x${img.naturalHeight}`);
    }
  }, [updateCanvasDimensions]);

  // Resize handler
  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  // Draw function
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !drawingContextRef.current) return;

    const canvas = canvasRef.current;
    const ctx = drawingContextRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static frame for backend mode
    if (backendExtractionMode && staticFrameRef.current) {
      const img = staticFrameRef.current;
      ctx.drawImage(
        img,
        offset.x,
        offset.y,
        videoDimensions.width * scale,
        videoDimensions.height * scale
      );
    }

    // Draw video bounds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(offset.x, offset.y, videoDimensions.width * scale, videoDimensions.height * scale);

    // Draw all ROIs
    rois.forEach((roi, index) => {
      const color = roiColors[index % roiColors.length];

      if (roi.type === 'rectangle' && roi.points.length === 2) {
        const [p1, p2] = roi.points;
        const x = Math.min(p1.x, p2.x) * scale + offset.x;
        const y = Math.min(p1.y, p2.y) * scale + offset.y;
        const width = Math.abs(p2.x - p1.x) * scale;
        const height = Math.abs(p2.y - p1.y) * scale;

        ctx.fillStyle = `${color}40`;
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = color;
        ctx.lineWidth = roi.id === selectedROI ? (isMobile ? 4 : 3) : (isMobile ? 3 : 2);
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = color;
        ctx.font = isMobile ? 'bold 14px Inter, sans-serif' : 'bold 12px Inter, sans-serif';
        ctx.fillText(roi.label, x + 5, y - 5);

      } else if (roi.type === 'polygon' && roi.points.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(roi.points[0].x * scale + offset.x, roi.points[0].y * scale + offset.y);

        for (let i = 1; i < roi.points.length; i++) {
          ctx.lineTo(roi.points[i].x * scale + offset.x, roi.points[i].y * scale + offset.y);
        }

        ctx.closePath();
        ctx.fillStyle = `${color}40`;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = roi.id === selectedROI ? (isMobile ? 4 : 3) : (isMobile ? 3 : 2);
        ctx.stroke();

        roi.points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x * scale + offset.x, point.y * scale + offset.y, isMobile ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });

        const centerX = roi.points.reduce((sum, p) => sum + p.x, 0) / roi.points.length;
        const centerY = roi.points.reduce((sum, p) => sum + p.y, 0) / roi.points.length;
        ctx.fillStyle = color;
        ctx.font = isMobile ? 'bold 14px Inter, sans-serif' : 'bold 12px Inter, sans-serif';
        ctx.fillText(roi.label, centerX * scale + offset.x - 15, centerY * scale + offset.y);
      }
    });

    // Draw current ROI being drawn
    if (currentROI && isDrawing) {
      const color = roiColors[rois.length % roiColors.length];

      if (currentROI.type === 'rectangle' && currentROI.points.length === 2) {
        const [p1, p2] = currentROI.points;
        const x = Math.min(p1.x, p2.x) * scale + offset.x;
        const y = Math.min(p1.y, p2.y) * scale + offset.y;
        const width = Math.abs(p2.x - p1.x) * scale;
        const height = Math.abs(p2.y - p1.y) * scale;

        ctx.strokeStyle = color;
        ctx.lineWidth = isMobile ? 3 : 2;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([]);

      } else if (currentROI.type === 'polygon' && currentROI.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentROI.points[0].x * scale + offset.x, currentROI.points[0].y * scale + offset.y);

        for (let i = 1; i < currentROI.points.length; i++) {
          ctx.lineTo(currentROI.points[i].x * scale + offset.x, currentROI.points[i].y * scale + offset.y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = isMobile ? 3 : 2;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        currentROI.points.forEach((point, i) => {
          ctx.beginPath();
          ctx.arc(point.x * scale + offset.x, point.y * scale + offset.y, isMobile ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });
      }
    }
  }, [rois, currentROI, isDrawing, selectedROI, scale, offset, videoDimensions, isMobile, backendExtractionMode]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Canvas interaction functions
  const getCanvasCoordinates = (clientX: number, clientY: number): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const convertToVideoCoordinates = (canvasPoint: Point): Point => {
    return {
      x: (canvasPoint.x - offset.x) / scale,
      y: (canvasPoint.y - offset.y) / scale
    };
  };

  const getVideoCoordinates = (clientX: number, clientY: number): Point => {
    const canvasCoords = getCanvasCoordinates(clientX, clientY);

    // For remote camera, use actual image dimensions
    if (inputSource === 'remote' && remoteImageRef.current) {
      const img = remoteImageRef.current;
      const rect = canvasRef.current?.getBoundingClientRect();

      if (!rect) return { x: 0, y: 0 };

      // Get displayed dimensions (accounting for object-contain scaling)
      const displayedWidth = videoDimensions.width * scale;
      const displayedHeight = videoDimensions.height * scale;

      // Calculate position within the displayed image
      const relativeX = (canvasCoords.x - offset.x) / scale;
      const relativeY = (canvasCoords.y - offset.y) / scale;

      // Clamp to image bounds
      const boundedX = Math.max(0, Math.min(relativeX, videoDimensions.width));
      const boundedY = Math.max(0, Math.min(relativeY, videoDimensions.height));

      return { x: boundedX, y: boundedY };
    }

    // Original logic for other sources
    return convertToVideoCoordinates(canvasCoords);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const videoCoords = getVideoCoordinates(event.clientX, event.clientY);

    if (drawingMode === 'rectangle') {
      if (!isDrawing) {
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'rectangle',
          points: [videoCoords, videoCoords],
          label: `ROI ${rois.length + 1}`,
          color: roiColors[rois.length % roiColors.length],
        };
        setCurrentROI(newROI);
        setIsDrawing(true);
      } else if (currentROI && currentROI.type === 'rectangle') {
        const updatedPoints = [...currentROI.points];
        updatedPoints[1] = videoCoords;
        const updatedROI = { ...currentROI, points: updatedPoints };

        setRois(prev => [...prev, updatedROI]);
        setCurrentROI(null);
        setIsDrawing(false);
        setSelectedROI(updatedROI.id);
        addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
      }
    } else if (drawingMode === 'polygon') {
      if (!currentROI) {
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'polygon',
          points: [videoCoords],
          label: `ROI ${rois.length + 1}`,
          color: roiColors[rois.length % roiColors.length],
        };
        setCurrentROI(newROI);
        setIsDrawing(true);
      } else {
        const updatedPoints = [...currentROI.points, videoCoords];
        setCurrentROI({ ...currentROI, points: updatedPoints });

        if (updatedPoints.length > 2) {
          const first = updatedPoints[0];
          const last = updatedPoints[updatedPoints.length - 1];
          const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);

          if (distance < 20) {
            finishPolygon();
          }
        }
      }
    } else if (drawingMode === 'select') {
      let clickedROI = null;
      for (const roi of rois) {
        if (isPointInROI(videoCoords, roi)) {
          clickedROI = roi;
          break;
        }
      }
      setSelectedROI(clickedROI?.id || null);
    }
  };

  const handleCanvasTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const videoCoords = getVideoCoordinates(touch.clientX, touch.clientY);

      if (drawingMode === 'rectangle') {
        if (!isDrawing) {
          const newROI: ROI = {
            id: `roi_${Date.now()}`,
            type: 'rectangle',
            points: [videoCoords, videoCoords],
            label: `ROI ${rois.length + 1}`,
            color: roiColors[rois.length % roiColors.length],
          };
          setCurrentROI(newROI);
          setIsDrawing(true);
        } else if (currentROI && currentROI.type === 'rectangle') {
          const updatedPoints = [...currentROI.points];
          updatedPoints[1] = videoCoords;
          const updatedROI = { ...currentROI, points: updatedPoints };

          setRois(prev => [...prev, updatedROI]);
          setCurrentROI(null);
          setIsDrawing(false);
          setSelectedROI(updatedROI.id);
          addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
        }
      } else if (drawingMode === 'polygon') {
        if (!currentROI) {
          const newROI: ROI = {
            id: `roi_${Date.now()}`,
            type: 'polygon',
            points: [videoCoords],
            label: `ROI ${rois.length + 1}`,
            color: roiColors[rois.length % roiColors.length],
          };
          setCurrentROI(newROI);
          setIsDrawing(true);
        } else {
          const updatedPoints = [...currentROI.points, videoCoords];
          setCurrentROI({ ...currentROI, points: updatedPoints });

          if (updatedPoints.length > 2) {
            const first = updatedPoints[0];
            const last = updatedPoints[updatedPoints.length - 1];
            const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);

            if (distance < 30) {
              finishPolygon();
            }
          }
        }
      } else if (drawingMode === 'select') {
        let clickedROI = null;
        for (const roi of rois) {
          if (isPointInROI(videoCoords, roi)) {
            clickedROI = roi;
            break;
          }
        }
        setSelectedROI(clickedROI?.id || null);
      }
    }
  };

  const handleCanvasTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing || !currentROI || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const videoCoords = getVideoCoordinates(touch.clientX, touch.clientY);

    if (currentROI.type === 'rectangle') {
      const updatedPoints = [...currentROI.points];
      updatedPoints[1] = videoCoords;
      setCurrentROI({ ...currentROI, points: updatedPoints });
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentROI) return;

    const videoCoords = getVideoCoordinates(event.clientX, event.clientY);

    if (currentROI.type === 'rectangle') {
      const updatedPoints = [...currentROI.points];
      updatedPoints[1] = videoCoords;
      setCurrentROI({ ...currentROI, points: updatedPoints });
    }
  };

  const isPointInROI = (point: Point, roi: ROI): boolean => {
    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);

      return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    } else if (roi.type === 'polygon' && roi.points.length >= 3) {
      let inside = false;
      for (let i = 0, j = roi.points.length - 1; i < roi.points.length; j = i++) {
        const xi = roi.points[i].x, yi = roi.points[i].y;
        const xj = roi.points[j].x, yj = roi.points[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }
    return false;
  };

  const finishPolygon = () => {
    if (currentROI && currentROI.type === 'polygon' && currentROI.points.length >= 3) {
      const points = [...currentROI.points];
      if (points.length > 3) {
        const first = points[0];
        const last = points[points.length - 1];
        const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);
        if (distance < (isMobile ? 30 : 20)) {
          points.pop();
        }
      }

      const finalROI = { ...currentROI, points };
      setRois(prev => [...prev, finalROI]);
      setCurrentROI(null);
      setIsDrawing(false);
      setSelectedROI(finalROI.id);
      addTerminalLog(`✓ Created Polygon ROI: ${finalROI.label} with ${points.length} points`);
    }
  };

  // ROI management
  const addNewROI = (type: 'rectangle' | 'polygon') => {
    setDrawingMode(type);
    setCurrentROI(null);
    setIsDrawing(false);
    addTerminalLog(`Drawing mode set to: ${type}`);
  };

  const deleteROI = (id: string) => {
    const roiToDelete = rois.find(roi => roi.id === id);
    setRois(prev => prev.filter(roi => roi.id !== id));
    if (selectedROI === id) {
      setSelectedROI(null);
    }
    if (roiToDelete) {
      addTerminalLog(`Deleted ROI: ${roiToDelete.label}`);
    }
  };

  const updateROILabel = (id: string, label: string) => {
    setRois(prev => prev.map(roi =>
      roi.id === id ? { ...roi, label } : roi
    ));
  };
  const captureFrame = async (frameNumber: number) => {
    const video = videoRef.current;
    const captureCanvas = captureCanvasRef.current;

    if (!captureCanvas) {
      console.error('Capture canvas not available');
      addTerminalLog('❌ Capture canvas not available');
      return;
    }

    const captureCtx = captureCanvas.getContext('2d');
    if (!captureCtx) {
      console.error('Capture context not available');
      addTerminalLog('❌ Capture context not available');
      return;
    }

    captureCanvas.width = videoDimensions.width;
    captureCanvas.height = videoDimensions.height;
    captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);

    // Select frame source
    if (inputSource === 'oak' && oakStreamRef.current) {
      captureCtx.drawImage(
        oakStreamRef.current,
        0, 0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'upload' && extractorVideoRef.current) {
      await extractFrame(frameNumber, frameRate, captureCanvas);
    } else if (inputSource === 'camera' && video && video.srcObject) {
      captureCtx.drawImage(
        video,
        0, 0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'remote') {
      // Handle remote camera capture - FIXED VERSION
      try {
        await captureRemoteFrame(captureCanvas, captureCtx, frameNumber);
      } catch (error) {
        console.error('Error capturing remote frame:', error);
        // addTerminalLog(`❌ Failed to capture remote frame ${frameNumber}: ${error.message}`);
        return;
      }
    } else {
      console.error('No valid source available for capture');
      addTerminalLog(`❌ No valid source available for frame ${frameNumber}`);
      return;
    }

    console.log(`📸 Capturing frame ${frameNumber}...`);

    if (rois.length === 0) {
      await captureFullFrame(frameNumber);
    } else {
      for (const roi of rois) {
        let x = 0, y = 0, width = 0, height = 0;

        if (roi.type === 'rectangle' && roi.points.length === 2) {
          const [p1, p2] = roi.points;
          x = Math.min(p1.x, p2.x);
          y = Math.min(p1.y, p2.y);
          width = Math.abs(p2.x - p1.x);
          height = Math.abs(p2.y - p1.y);
        } else if (roi.type === 'polygon' && roi.points.length >= 3) {
          const xs = roi.points.map(p => p.x);
          const ys = roi.points.map(p => p.y);
          x = Math.min(...xs);
          y = Math.min(...ys);
          width = Math.max(...xs) - x;
          height = Math.max(...ys) - y;
        }

        if (width > 10 && height > 10) {
          await captureROIArea(x, y, width, height, roi, frameNumber);
        } else {
          console.warn(`ROI ${roi.label} too small: ${width}x${height}`);
        }
      }
    }

    setCaptureCount(prev => prev + 1);
  };


  // Update the captureRemoteFrame function:
  const captureRemoteFrame = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, frameNumber: number) => {
    return new Promise<void>((resolve, reject) => {
      if (!remoteCameraFrame) {
        reject(new Error('No remote camera frame available'));
        return;
      }

      // Create a new image object from the base64 data
      const img = new Image();
      img.onload = () => {
        // Set canvas to image dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Update video dimensions if needed
        if (videoDimensions.width !== img.naturalWidth || videoDimensions.height !== img.naturalHeight) {
          setVideoDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }

        resolve();
      };

      img.onerror = () => {
        reject(new Error('Failed to load remote image'));
      };

      img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;

      // Timeout in case image takes too long to load
      setTimeout(() => {
        if (!img.complete) {
          reject(new Error('Image loading timeout'));
        }
      }, 1000);
    });
  };

  const captureFullFrame = async (frameNumber: number) => {
    const captureCanvas = captureCanvasRef.current;
    const captureCtx = captureCanvas?.getContext('2d');

    if (!captureCanvas || !captureCtx) {
      console.error('Capture canvas not available');
      addTerminalLog('❌ Capture canvas not available');
      return;
    }

    captureCanvas.width = videoDimensions.width;
    captureCanvas.height = videoDimensions.height;
    captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);

    if (inputSource === 'oak' && oakStreamRef.current) {
      captureCtx.drawImage(
        oakStreamRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'upload' && extractorVideoRef.current) {
      await extractFrame(frameNumber, frameRate, captureCanvas);
    } else if (videoRef.current && videoRef.current.videoWidth > 0) {
      captureCtx.drawImage(
        videoRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (videoRef.current && videoRef.current.srcObject) {
      captureCtx.drawImage(
        videoRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else {
      console.error('No valid source available for full frame capture');
      addTerminalLog(`❌ No valid source available for frame ${frameNumber}`);
      return;
    }

    captureCanvas.toBlob(async (blob) => {
      if (blob && blob.size > 1000) {
        await sendFullFrameToBackend(blob, frameNumber);
      } else {
        console.error('Blob creation failed or blob too small');
        addTerminalLog(`❌ Failed to capture full frame for frame ${frameNumber}`);
      }
    }, 'image/jpeg', 0.9);
  };

  const sendFullFrameToBackend = async (blob: Blob, frameNumber: number) => {
    const formData = new FormData();
    formData.append('frame', blob, `frame_${frameNumber}.jpg`);
    formData.append('session_id', sessionName);
    formData.append('frame_number', frameNumber.toString());
    formData.append('video_width', videoDimensions.width.toString());
    formData.append('video_height', videoDimensions.height.toString());

    try {
      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setLastSaveStatus(`✓ Full frame ${frameNumber} saved`);
        console.log('Full frame saved:', result);
      } else {
        const errorText = await response.text();
        console.error(`Failed to send full frame: ${response.status} - ${errorText}`);
        setLastSaveStatus(`❌ Failed to save full frame ${frameNumber}`);
      }
    } catch (error) {
      console.error('Error sending full frame:', error);
      setLastSaveStatus(`❌ Error sending full frame ${frameNumber}`);
    }
  };

  const captureROIArea = async (x: number, y: number, width: number, height: number, roi: ROI, frameNumber: number) => {
    const captureCanvas = captureCanvasRef.current;
    const captureCtx = captureCanvas?.getContext('2d');

    if (!captureCanvas || !captureCtx) {
      console.error('Capture canvas not available');
      addTerminalLog('❌ Capture canvas not available');
      return;
    }

    const imageData = captureCtx.getImageData(x, y, width, height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);

      tempCanvas.toBlob(async (blob) => {
        if (blob && blob.size > 1000) {
          console.log(`Sending frame ${frameNumber} for ROI ${roi.label}, size: ${blob.size} bytes`);
          await sendFrameToBackend(blob, roi, frameNumber);
        } else {
          console.error(`Failed to create blob or blob too small for ROI ${roi.label}`);
          addTerminalLog(`❌ Failed to capture ROI ${roi.label} for frame ${frameNumber}`);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const sendFrameToBackend = async (blob: Blob, roi: ROI, frameNumber: number) => {
    const formData = new FormData();
    formData.append('frame', blob, `frame_${frameNumber}.jpg`);
    formData.append('session_id', sessionName);
    formData.append('roi_id', roi.id);
    formData.append('roi_label', roi.label);
    formData.append('roi_type', roi.type);

    const pointsArray = roi.points.map(p => [p.x, p.y]);
    formData.append('roi_points', JSON.stringify(pointsArray));

    formData.append('frame_number', frameNumber.toString());
    formData.append('video_width', videoDimensions.width.toString());
    formData.append('video_height', videoDimensions.height.toString());

    if (roi.type === 'polygon' && roi.points.length >= 3) {
      const xs = roi.points.map(p => p.x);
      const ys = roi.points.map(p => p.y);
      const bbox = {
        x_min: Math.min(...xs),
        y_min: Math.min(...ys),
        x_max: Math.max(...xs),
        y_max: Math.max(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
      formData.append('bounding_box', JSON.stringify(bbox));
    }

    try {
      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        addTerminalLog(`↑ Uploaded frame ${frameNumber} → ${roi.label}`);

        const result = await response.json();
        setLastSaveStatus(`✓ Frame ${frameNumber} saved for ${roi.label}`);
        console.log('Frame saved with metadata:', result.roi_metadata);
      } else {
        const errorText = await response.text();
        console.error(`Failed to send frame: ${response.status} - ${errorText}`);
        setLastSaveStatus(`❌ Failed to save frame ${frameNumber} for ${roi.label}`);
      }
    } catch (error) {
      console.error('Error sending frame:', error);
      setLastSaveStatus(`❌ Error sending frame ${frameNumber} for ${roi.label}`);
    }
  };

  // Training functions
  const connectToTrainingWebSocket = (trainingId: string) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${NEXT_PUBLIC_BACKEND_URL}/api/training/ws/${trainingId}`;

    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket connection timeout');
        ws.close();
        addTerminalLog('❌ WebSocket connection timeout. Please check your connection.');
      }
    }, 5000);

    ws.onopen = () => {
      clearTimeout(connectionTimeout);
      addTerminalLog('✓ Connected to training WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'log') {
          addTerminalLog(data.message);
        } else if (data.type === 'status_update') {
          console.log('Training status update:', data);
          if (data.status === 'completed') {
            setTrainingStatus('completed');
            addTerminalLog(`✓ Training completed successfully!`);
          } else if (data.status === 'failed') {
            setTrainingStatus('failed');
            addTerminalLog(`❌ Training failed: ${data.message}`);
          } else if (data.status === 'processing') {
            setTrainingStatus('running');
          }
        } else if (data.type === 'pong') {
          console.log('WebSocket pong received');
        } else if (data.type === 'initial_status') {
          console.log('Initial status received:', data);
          if (data.data && data.data.logs) {
            data.data.logs.forEach((log: string) => {
              if (!terminalLogs.includes(log)) {
                setTerminalLogs(prev => [...prev, log]);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      addTerminalLog(`❌ WebSocket connection error`);
    };

    ws.onclose = (event) => {
      const timestamp = new Date().toLocaleTimeString();
      addTerminalLog(`${timestamp} - WebSocket disconnected`);
      console.log('WebSocket closed:', event.code, event.reason);
    };

    setTrainingWebSocket(ws);
    return ws;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Validate input source
      if (inputSource === 'remote' && !isRemoteCameraReady()) {
        alert('Remote camera not connected or no frame available');
        return;
      }
      if (
        inputSource === 'upload' &&
        !backendExtractionMode &&
        (!videoUrl || !videoRef.current?.videoWidth)
      ) {
        alert('Please load a video first');
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        alert('Please start OAK camera first');
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        alert('Please connect remote camera first');
        return;
      }

      setIsRecording(true);
      setRecordingProgress(0);
      setRemainingTime(recordingDuration);
      setCaptureCount(0);

      addTerminalLog(`=== Starting Recording ===`);
      addTerminalLog(`Session: ${sessionName}`);
      addTerminalLog(`Duration: ${recordingDuration} seconds`);
      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`ROIs: ${rois.length} (${rois.length === 0 ? 'Full Frame mode' : 'ROI mode'})`);
      addTerminalLog(`========================`);

      let currentFrame = 0;
      const totalFrames = recordingDuration * frameRate;
      const runRecording = async () => {
        for (let i = 0; i < totalFrames; i++) {
          if (!isRecording) break;

          await captureFrame(i);
          const progress = ((i + 1) / totalFrames) * 100;
          setRecordingProgress(progress);
          setCaptureCount(prev => prev + 1);

          if (i < totalFrames - 1) {
            await new Promise(res => setTimeout(res, 1000 / frameRate));
          }
        }

        setIsRecording(false);
        addTerminalLog(`✓ Recording completed.`);
      };

      runRecording();

      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRecording(false);
            addTerminalLog(`✓ Recording completed. Captured ${captureCount} frames.`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setRecordingTimer(timer);

    } else {
      // Stop recording
      setIsRecording(false);

      // Clear remote camera interval if it exists
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }

      addTerminalLog(`Recording stopped manually. Captured ${captureCount} frames.`);
    }
  };

  useEffect(() => {
    if (inputSource === 'remote' && remoteCameraFrame) {
      // Update canvas when remote frame dimensions change
      const updateRemoteCanvas = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // Get actual container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

        // Calculate scale based on actual video dimensions
        const scaleX = containerWidth / videoDimensions.width;
        const scaleY = containerHeight / videoDimensions.height;
        const newScale = Math.min(scaleX, scaleY);

        // Calculate offset to center the image
        const offsetX = (containerWidth - videoDimensions.width * newScale) / 2;
        const offsetY = (containerHeight - videoDimensions.height * newScale) / 2;

        setScale(newScale);
        setOffset({ x: offsetX, y: offsetY });

        // Set canvas to container size
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Redraw
        drawCanvas();
      };

      updateRemoteCanvas();

      // Also update on window resize
      const handleResize = () => updateRemoteCanvas();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [inputSource, remoteCameraFrame, videoDimensions, isMobile]);

  const startTraining = async () => {
    try {
      // Show training analysis
      startAnalysis('training');

      addTerminalLog(`=== Starting Training Session ===`);
      addTerminalLog(`Session: ${sessionName}`);

      // Check if we need to wait for backend extraction
      if (backendExtractionMode && extractionStatus !== 'completed') {
        if (extractionStatus === 'processing') {
          addTerminalLog(`⏳ Waiting for backend frame extraction to complete...`);
          addTerminalLog(`📈 Progress: ${extractionProgress.toFixed(1)}%`);
          alert('Please wait for backend frame extraction to complete before starting training.');
          setShowUpload(false);
          return;
        } else if (extractionStatus === 'idle' || extractionStatus === 'failed' || extractionStatus === 'uploading') {
          addTerminalLog(`❌ Backend frame extraction not completed or failed`);
          alert('Please complete backend frame extraction first or try uploading the video again.');
          setShowUpload(false);
          return;
        }
      }

      if (rois.length === 0) {
        addTerminalLog(`Mode: Full Frame (no ROIs drawn)`);
      } else {
        addTerminalLog(`Mode: ROI-based`);
        addTerminalLog(`Number of ROIs: ${rois.length}`);
      }

      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`================================`);

      // Validate input sources
      if (
        inputSource === 'upload' &&
        !backendExtractionMode &&
        (!videoUrl || !videoRef.current?.videoWidth)
      ) {
        alert('Please load a video first');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        addTerminalLog(`❌ ERROR: Please start OAK camera first`);
        alert('Please start OAK camera first');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        addTerminalLog(`❌ ERROR: Please connect remote camera first`);
        alert('Please connect remote camera first');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'camera' && !currentCameraStream) {
        addTerminalLog(`❌ ERROR: Please start camera first`);
        alert('Please start camera first');
        setShowUpload(false);
        return;
      }

      if (!recordingDuration || recordingDuration <= 0) {
        addTerminalLog(`❌ Training cancelled: Invalid duration`);
        setShowUpload(false);
        return;
      }

      const totalFrames = recordingDuration * frameRate;

      // SPECIAL HANDLING FOR REMOTE CAMERA - Capture from canvas
      if (inputSource === 'remote') {
        addTerminalLog(`🔄 Remote Camera: Using canvas-based frame capture`);
        await captureFramesFromCanvas(totalFrames);
      } else {
        // Original logic for other sources
        addTerminalLog(`Step 1: Capturing ${totalFrames} frames (${recordingDuration} seconds)...`);
        setIsCapturingTrainingFrames(true);

        for (let i = 0; i < totalFrames; i++) {
          await captureFrame(i);
          const progress = ((i + 1) / totalFrames) * 100;
          addTerminalLog(`[CAPTURE] ${renderProgressBar(progress)} (${i + 1}/${totalFrames})`);

          if (i < totalFrames - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
          }
        }

        setIsCapturingTrainingFrames(false);
      }

      addTerminalLog(`Step 2: Waiting for frames to save to backend...`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      addTerminalLog(`Step 3: Verifying saved frames...`);
      try {
        const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/sessions/${sessionName}/frame-count`);
        if (response.ok) {
          const data = await response.json();
          const totalSavedFrames = data.total_frames || 0;
          addTerminalLog(`✓ ${totalSavedFrames} frames saved successfully`);

          if (totalSavedFrames === 0) {
            addTerminalLog(`❌ ERROR: No frames were saved. Check backend connection.`);
            alert('No frames were saved. Please check backend connection and try again.');
            setShowUpload(false);
            return;
          }
        }
      } catch (error) {
        addTerminalLog(`⚠ WARNING: Could not verify frames: ${error}`);
      }

      addTerminalLog(`Step 4: Starting training process...`);
      setShowUpload(true);

      const trainingROIs = rois.length === 0
        ? [{
          id: 'full_frame',
          type: 'rectangle',
          points: [
            { x: 0, y: 0 },
            { x: videoDimensions.width, y: videoDimensions.height }
          ],
          label: 'Full Frame',
          color: '#3b82f6'
        }]
        : rois;

      const trainingOptions = [];
      if (trainingTypes.anomaly) trainingOptions.push("anomaly");
      if (trainingTypes.sequential) trainingOptions.push("sequential");
      if (trainingTypes.motion) trainingOptions.push("motion");

      if (trainingOptions.length === 0) {
        trainingOptions.push("anomaly");
        addTerminalLog("⚠ No training type selected, defaulting to Anomaly Training");
      }

      addTerminalLog(`📊 Selected Training Types: ${trainingOptions.join(", ")}`);

      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionName,
          rois: trainingROIs,
          frame_rate: backendExtractionMode ? frameRate : frameRate,
          training_options: trainingOptions,
          source_type: inputSource === 'remote' ? 'remote_camera' : (backendExtractionMode ? 'backend_extraction' : inputSource),
        })
      });

      if (response.ok) {
        const result = await response.json();
        addTerminalLog(`✓ Training started successfully!`);
        addTerminalLog(`Training ID: ${result.training_id}`);
        addTerminalLog(`Status: ${result.status}`);
        addTerminalLog(`Training Types: ${result.details?.training_options?.join(', ') || 'Anomaly'}`);
        console.log("Sending training options:", trainingOptions);

        if (result.details) {
          addTerminalLog(`Total frames: ${result.details.total_frames || 0}`);
          if (result.details.frames_by_roi) {
            Object.entries(result.details.frames_by_roi).forEach(([roiId, info]: [string, any]) => {
              if (info.frames > 0) {
                addTerminalLog(`  ROI ${info.label}: ${info.frames} frames`);
              }
            });
          }
        }

        // Connect to WebSocket for logs
        connectToTrainingWebSocket(result.training_id);

        // Update analysis modal
        setAnalysisStatus('completed');
        setAnalysisMessage('Training started successfully!');
        setAnalysisDetails(prev => [...prev, '✓ Training session created', `✓ Training ID: ${result.training_id}`]);

        // Switch to terminal view
        setShowUpload(false);
        setShowTerminal(true);
        setTrainingStatus('running');

      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to start training';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorText;
        } catch {
          errorMessage = errorText;
        }

        addTerminalLog(`❌ ERROR: ${errorMessage}`);
        alert(`Failed to start training: ${errorMessage}`);
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      addTerminalLog(`❌ ERROR: Error in training process: ${error}`);
      alert('Error in training process');
      setShowUpload(false);
    }
  };

  // NEW HELPER FUNCTION: Capture frames from canvas (for Remote Camera)
  const captureFramesFromCanvas = async (totalFrames: number) => {
    try {
      addTerminalLog(`🖼 Capturing ${totalFrames} frames from canvas...`);
      setIsCapturingTrainingFrames(true);
      setCaptureCount(0);

      // Create a canvas for capturing
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = videoDimensions.width;
      captureCanvas.height = videoDimensions.height;
      const captureCtx = captureCanvas.getContext('2d');

      if (!captureCtx) {
        throw new Error('Failed to create capture canvas context');
      }

      for (let i = 0; i < totalFrames; i++) {
        // For remote camera, draw the current remote frame onto canvas
        if (inputSource === 'remote') {
          if (!remoteCameraFrame) {
            addTerminalLog(`⏳ Waiting for remote frame ${i + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
            continue;
          }

          // Create image from base64
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Draw to capture canvas
          captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
          captureCtx.drawImage(img, 0, 0, captureCanvas.width, captureCanvas.height);
        }

        // Now capture from this canvas (same as other sources)
        if (rois.length === 0) {
          await captureFullFrameFromCanvas(captureCanvas, i);
        } else {
          for (const roi of rois) {
            await captureROIFromCanvas(captureCanvas, captureCtx, roi, i);
          }
        }

        setCaptureCount(prev => prev + 1);
        const progress = ((i + 1) / totalFrames) * 100;
        addTerminalLog(`[CANVAS CAPTURE] ${renderProgressBar(progress)} (${i + 1}/${totalFrames})`);

        if (i < totalFrames - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
        }
      }

      setIsCapturingTrainingFrames(false);
      addTerminalLog(`✓ Canvas capture completed: ${captureCount} frames`);

    } catch (error) {
      console.error('Error in canvas capture:', error);
      addTerminalLog(`❌ Canvas capture error: ${error}`);
      throw error;
    }
  };

  // Canvas-based capture functions
  const captureFullFrameFromCanvas = async (canvas: HTMLCanvasElement, frameNumber: number) => {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });

    if (blob && blob.size > 1000) {
      const formData = new FormData();
      formData.append('frame', blob, `frame_${frameNumber}.jpg`);
      formData.append('session_id', sessionName);
      formData.append('frame_number', frameNumber.toString());
      formData.append('video_width', videoDimensions.width.toString());
      formData.append('video_height', videoDimensions.height.toString());

      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        addTerminalLog(`↑ Uploaded full frame ${frameNumber} from canvas`);
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to upload frame: ${errorText}`);
      }
    } else {
      throw new Error('Failed to create blob from canvas');
    }
  };

  const captureROIFromCanvas = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roi: ROI, frameNumber: number) => {
    let x = 0, y = 0, width = 0, height = 0;

    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      x = Math.min(p1.x, p2.x);
      y = Math.min(p1.y, p2.y);
      width = Math.abs(p2.x - p1.x);
      height = Math.abs(p2.y - p1.y);
    } else if (roi.type === 'polygon' && roi.points.length >= 3) {
      const xs = roi.points.map(p => p.x);
      const ys = roi.points.map(p => p.y);
      x = Math.min(...xs);
      y = Math.min(...ys);
      width = Math.max(...xs) - x;
      height = Math.max(...ys) - y;
    }

    if (width > 10 && height > 10) {
      // Extract ROI from canvas
      const imageData = ctx.getImageData(x, y, width, height);
      const roiCanvas = document.createElement('canvas');
      roiCanvas.width = width;
      roiCanvas.height = height;
      const roiCtx = roiCanvas.getContext('2d');

      if (roiCtx) {
        roiCtx.putImageData(imageData, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => {
          roiCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
        });

        if (blob && blob.size > 1000) {
          const formData = new FormData();
          formData.append('frame', blob, `frame_${frameNumber}_${roi.id}.jpg`);
          formData.append('session_id', sessionName);
          formData.append('roi_id', roi.id);
          formData.append('roi_label', roi.label);
          formData.append('roi_type', roi.type);
          formData.append('frame_number', frameNumber.toString());
          formData.append('video_width', videoDimensions.width.toString());
          formData.append('video_height', videoDimensions.height.toString());

          const pointsArray = roi.points.map(p => [p.x, p.y]);
          formData.append('roi_points', JSON.stringify(pointsArray));

          const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            addTerminalLog(`↑ Uploaded frame ${frameNumber} for ROI ${roi.label} from canvas`);
            return await response.json();
          } else {
            const errorText = await response.text();
            throw new Error(`Failed to upload ROI frame: ${errorText}`);
          }
        } else {
          throw new Error('Failed to create blob from ROI canvas');
        }
      }
    } else {
      throw new Error(`ROI ${roi.label} too small: ${width}x${height}`);
    }
  };

  // Backend connection functions
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/health`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setBackendConnected(true);
          addTerminalLog(`✓ Backend connected: ${data.service} v${data.version}`);
          return true;
        }
      }
    } catch (error) {
      console.error('Main backend connection failed:', error);
    }

    try {
      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/health/`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setBackendConnected(true);
          addTerminalLog(`✓ Backend connected: ${data.service} v${data.version}`);
          return true;
        }
      }
    } catch (error) {
      console.error('Main backend connection failed (with slash):', error);
    }

    setBackendConnected(false);
    addTerminalLog('❌ Backend connection failed');
    return false;
  };

  const checkOakCameraConnection = async () => {
    try {
      const response = await fetch('https://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        return data.camera_running ? 'streaming' : 'idle';
      }
    } catch (error) {
      console.error('OAK camera backend connection failed:', error);
    }
    return 'error';
  };

  const listOakDevices = async () => {
    try {
      const response = await fetch('https://localhost:5000/api/camera/devices');
      if (response.ok) {
        const data = await response.json();
        setOakDevices(data.devices || []);
        if (data.devices && data.devices.length > 0) {
          setSelectedDevice(data.devices[0].mxid);
        }
      }
    } catch (error) {
      console.error('Error listing OAK devices:', error);
    }
  };

  const startOakCamera = async () => {
    try {
      const response = await fetch('https://localhost:5000/api/camera/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to start camera');

      setIsOakStreaming(true);
      setOakCameraState('streaming');
      handleInputSourceChange('oak');
      setStreamUrl('https://localhost:5000/api/camera/stream');
      addTerminalLog('✓ OAK Camera started streaming');

    } catch (error) {
      console.error('Error starting OAK camera:', error);
      setOakCameraState('error');
      addTerminalLog(`❌ Error starting OAK camera: ${error}`);
    }
  };

  const stopOakCamera = async () => {
    try {
      await fetch('https://localhost:5000/api/camera/stop', { method: 'POST' });

      setIsOakStreaming(false);
      setOakCameraState('idle');
      setStreamUrl('');
      addTerminalLog('✓ OAK Camera stopped');

    } catch (error) {
      console.error('Error stopping OAK camera:', error);
      addTerminalLog(`❌ Error stopping OAK camera: ${error}`);
    }
  };

  const copyTerminalLogs = () => {
    const logsText = terminalLogs.join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      addTerminalLog('✓ Logs copied to clipboard');
    });
  };

  const clearTerminalLogs = () => {
    setTerminalLogs([]);
    setTrainingLogs([]);
  };

  const testCapture = async () => {
    addTerminalLog('Testing frame capture...');
    await captureFrame(0);
    addTerminalLog('✓ Test capture completed');
  };

  const checkDatasets = async () => {
    try {
      const response = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/datasets`);
      const data = await response.json();
      console.log('Datasets:', data);
      addTerminalLog(`Found ${data.datasets?.length || 0} datasets`);
    } catch (error) {
      console.error('Failed to list datasets:', error);
      addTerminalLog(`❌ Error checking datasets: ${error}`);
    }
  };

  // Particle Animation Component
  const ParticleAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );

  // Render backend extraction status UI
  const renderBackendExtractionStatus = () => {
    if (!backendExtractionMode) return null;

    const statusColors = {
      idle: 'bg-yellow-500/20 text-yellow-400',
      uploading: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400'
    };

    const statusIcons = {
      idle: <AlertTriangle className="w-4 h-4" />,
      uploading: <CloudUpload className="w-4 h-4 animate-pulse" />,
      processing: <RefreshCw className="w-4 h-4 animate-spin" />,
      completed: <Check className="w-4 h-4" />,
      failed: <AlertTriangle className="w-4 h-4" />
    };

    return (
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center">
            {statusIcons[extractionStatus]}
            <span className="ml-2">Backend Video Processing</span>
          </h3>
          <div className={`px-2 py-1 rounded text-xs ${statusColors[extractionStatus]}`}>
            {extractionStatus.charAt(0).toUpperCase() + extractionStatus.slice(1)}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-neutral-300 mb-1">
              Processing: {videoFile?.name}
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${extractionProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>Progress: {extractionProgress.toFixed(1)}%</span>
              <span>Frames: {extractedFramesCount}</span>
            </div>
          </div>

          {extractionJobId && (
            <div className="text-xs">
              <div className="text-neutral-400 mb-1">Job ID:</div>
              <code className="bg-neutral-800 px-2 py-1 rounded text-neutral-300 text-xs break-all">
                {extractionJobId}
              </code>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (videoFile && extractionStatus !== 'processing' && extractionStatus !== 'uploading') {
                  uploadVideoToBackend(videoFile);
                }
              }}
              disabled={!videoFile || extractionStatus === 'processing' || extractionStatus === 'uploading'}
              className={`flex-1 py-2 rounded text-sm font-medium ${!videoFile || extractionStatus === 'processing' || extractionStatus === 'uploading'
                ? 'bg-neutral-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {extractionStatus === 'processing' ? 'Processing...' :
                extractionStatus === 'uploading' ? 'Uploading...' :
                  extractionStatus === 'completed' ? 'Re-process' : 'Process on Backend'}
            </button>

            <button
              onClick={cancelBackendExtraction}
              disabled={extractionStatus !== 'processing' && extractionStatus !== 'uploading'}
              className={`px-3 py-2 rounded text-sm font-medium ${extractionStatus !== 'processing' && extractionStatus !== 'uploading'
                ? 'bg-neutral-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              Cancel
            </button>
          </div>

          <div className="text-xs">
            <div className="flex items-center text-neutral-400 mb-1">
              <input
                type="checkbox"
                id="auto-upload"
                checked={autoUploadToBackend}
                onChange={(e) => setAutoUploadToBackend(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="auto-upload">Auto-upload unsupported videos to backend</label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render mobile sidebar content
  const renderMobileSidebarContent = () => {
    switch (activeMobileTab) {
      case 'input':
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <Film className="w-4 h-4 mr-2 text-blue-400" />
                Input Source
              </h3>
              <div className="space-y-2">
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
                            await startCamera(cameras[0].deviceId);
                          } else {
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

                  {showCameraSelection && availableCameras.length > 0 && (
                    <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                      <div className="text-xs text-neutral-400 mb-2">Select Camera:</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableCameras.map((camera, index) => (
                          <label
                            key={camera.deviceId}
                            className={`flex items-center p-2 rounded cursor-pointer ${selectedCameraId === camera.deviceId
                              ? 'bg-blue-900/30 border border-blue-700'
                              : 'hover:bg-neutral-700/50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="camera"
                              value={camera.deviceId}
                              checked={selectedCameraId === camera.deviceId}
                              onChange={(e) => setSelectedCameraId(e.target.value)}
                              className="mr-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">
                                {camera.label || `Camera ${index + 1}`}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">
                                ID: {camera.deviceId.substring(0, 8)}...
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleCameraSelect}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                        >
                          Use Selected Camera
                        </button>
                        <button
                          onClick={() => setShowCameraSelection(false)}
                          className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {inputSource === 'camera' && !showCameraSelection && availableCameras.length > 1 && (
                    <button
                      onClick={async () => {
                        const cameras = await listAvailableCameras();
                        if (cameras.length > 1) {
                          setShowCameraSelection(true);
                        }
                      }}
                      className="w-full mt-2 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm font-medium flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Switch Camera
                    </button>
                  )}
                </div>

                <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'oak'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-neutral-700 hover:bg-neutral-800'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2" />
                      <div>
                        <div className="text-sm font-medium">OAK Camera</div>
                        <div className="text-xs text-neutral-500">DepthAI Device</div>
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

                  {oakDevices.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-neutral-400 mb-1">Available Devices:</div>
                      <select
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="w-full p-1 bg-neutral-800 rounded text-xs"
                      >
                        {oakDevices.map((device) => (
                          <option key={device.mxid} value={device.mxid}>
                            {device.name || device.mxid}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Remote Camera Option */}
                <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'remote'
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
                    {inputSource === 'remote' && remoteCameraActive ? (
                      <button
                        onClick={stopRemoteCamera}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                      >
                        <PowerOff className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={startRemoteCameraSession}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
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

              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />

              {videoFile && (
                <div className="mt-3 p-2 bg-neutral-800/50 rounded-lg">
                  <div className="text-xs text-neutral-400 mb-1">Selected File:</div>
                  <div className="text-sm truncate">{videoFile.name}</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'roi':
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-400" />
                ROI Tools
              </h3>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <button
                  onClick={() => {
                    setDrawingMode('select');
                    setCurrentROI(null);
                    setIsDrawing(false);
                  }}
                  className={`p-3 rounded-lg border flex flex-col items-center ${drawingMode === 'select'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-700 hover:bg-neutral-800'
                    }`}
                >
                  <MousePointer className="w-5 h-5 mb-1" />
                  <span className="text-xs">Select</span>
                </button>

                <button
                  onClick={() => addNewROI('rectangle')}
                  className={`p-3 rounded-lg border flex flex-col items-center ${drawingMode === 'rectangle'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-700 hover:bg-neutral-800'
                    }`}
                >
                  <Square className="w-5 h-5 mb-1" />
                  <span className="text-xs">Rectangle</span>
                </button>

                <button
                  onClick={() => addNewROI('polygon')}
                  className={`p-3 rounded-lg border flex flex-col items-center ${drawingMode === 'polygon'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-neutral-700 hover:bg-neutral-800'
                    }`}
                >
                  <Hexagon className="w-5 h-5 mb-1" />
                  <span className="text-xs">Polygon</span>
                </button>

                <button
                  onClick={() => setRois([])}
                  className="p-3 rounded-lg border border-red-700 hover:bg-red-900/20 flex flex-col items-center"
                >
                  <Trash2 className="w-5 h-5 mb-1 text-red-400" />
                  <span className="text-xs text-red-400">Clear All</span>
                </button>
              </div>

              {drawingMode === 'polygon' && isDrawing && (
                <button
                  onClick={finishPolygon}
                  className="w-full mb-3 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
                >
                  Finish Polygon
                </button>
              )}

              <div className="space-y-2">
                <div className="text-xs text-neutral-500 mb-2">ROIs ({rois.length})</div>
                <div className="max-h-60 overflow-y-auto">
                  {rois.map((roi, index) => (
                    <div
                      key={roi.id}
                      className={`p-3 rounded-lg mb-2 cursor-pointer text-sm ${selectedROI === roi.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/50'
                        }`}
                      onClick={() => setSelectedROI(roi.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: roiColors[index % roiColors.length] }}
                          />
                          <input
                            type="text"
                            value={roi.label}
                            onChange={(e) => updateROILabel(roi.id, e.target.value)}
                            className="bg-transparent border-none outline-none w-24 text-sm text-base"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteROI(roi.id);
                          }}
                          className="p-2 hover:bg-neutral-700 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-neutral-500 ml-6">
                        {roi.type} • {roi.points.length} points
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-cyan-400" />
                Recording Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-neutral-400 mb-2">Frame Rate: {frameRate} FPS</div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={frameRate}
                    onChange={(e) => setFrameRate(parseInt(e.target.value))}
                    className="w-full h-3 bg-neutral-700 rounded appearance-none"
                  />
                </div>

                <div>
                  <div className="text-sm text-neutral-400 mb-2">
                    Duration: {recordingDuration} seconds
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5" />
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={recordingDuration}
                      onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-neutral-700 rounded appearance-none"
                    />
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-neutral-500 mt-2">
                    Total frames: {recordingDuration * frameRate}
                  </div>
                </div>

                <button
                  onClick={toggleRecording}
                  disabled={(inputSource === 'camera' && !currentCameraStream) ||
                    (inputSource === 'oak' && !isOakStreaming) ||
                    (inputSource === 'remote' && remoteCameraStatus !== 'connected')}
                  className={`w-full py-3 rounded-lg text-base font-medium ${isRecording
                    ? 'bg-red-600 hover:bg-red-700'
                    : (inputSource === 'camera' && !currentCameraStream) ||
                      (inputSource === 'oak' && !isOakStreaming) ||
                      (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                      ? 'bg-neutral-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {isRecording ? (
                    <>
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
                        Stop Recording ({remainingTime}s left)
                      </div>
                    </>
                  ) : (
                    'Start Recording'
                  )}
                </button>

                {isRecording && (
                  <div className="pt-3">
                    <div className="h-3 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-100"
                        style={{
                          width: `${((recordingDuration - remainingTime) / recordingDuration) * 100}%`
                        }}
                      />
                    </div>
                    <div className="text-sm text-neutral-400 mt-2">
                      Captured: {captureCount} frames
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
                Debug Tools
              </h3>

              <div className="space-y-2">
                <button
                  onClick={testCapture}
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded text-base"
                >
                  Test Capture Single Frame
                </button>
                <button
                  onClick={checkDatasets}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded text-base"
                >
                  Check Datasets
                </button>
                {lastSaveStatus && (
                  <div className="text-sm p-3 bg-neutral-800 rounded">
                    {lastSaveStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <Video className="w-4 h-4 mr-2 text-green-400" />
                Session Info
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-neutral-400">Session Name</div>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full p-3 bg-neutral-800 rounded text-base mt-1"
                    placeholder="Enter session name"
                  />
                </div>

                <div className="pt-3">
                  <button
                    onClick={startTraining}
                    disabled={!backendConnected || isCapturingTrainingFrames}
                    className={`w-full py-4 rounded-lg text-base font-medium ${!backendConnected || isCapturingTrainingFrames
                      ? 'bg-neutral-700 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {isCapturingTrainingFrames ? (
                      'Capturing Frames...'
                    ) : (
                      <>
                        <Brain className="w-5 h-5 inline mr-2" />
                        Start AI Training
                      </>
                    )}
                  </button>

                  <div className="text-sm text-neutral-500 mt-3">
                    {rois.length === 0 ? 'Full Frame mode - no ROIs defined' : `${rois.length} ROI${rois.length !== 1 ? 's' : ''} ready for training`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.2;
          }
          33% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.4;
          }
          66% {
            transform: translateY(20px) translateX(-10px) scale(0.8);
            opacity: 0.1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-pop {
          animation: pop 0.4s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>

      <div className="min-h-screen bg-neutral-950 text-neutral-200">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm md:text-base font-bold text-white">Vision AI Training</h1>
                  <div className="text-xs text-neutral-400">Real-time ROI Detection</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:space-x-3">
                {isMobile ? (
                  <>
                    <button
                      onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <div className={`px-2 py-1 rounded text-xs ${backendConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {backendConnected ? '✓' : '✗'}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="inference" >
                      <div className={`px-2 py-1 rounded text-xs ${backendConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        Inference
                      </div>
                    </Link>

                    <div className={`px-2 py-1 rounded text-xs ${backendConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${oakCameraState === 'streaming' ? 'bg-green-500/20 text-green-400' :
                      oakCameraState === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                      Neuron Camera: {oakCameraState}
                    </div>
                    <button
                      onClick={() => {
                        checkBackendConnection();
                        checkOakCameraConnection();
                      }}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-sm font-medium transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Reconnect
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-2 md:p-4 pb-20">
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
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                      onClick={() => setActiveMobileTab('input')}
                      className={`p-3 rounded-lg text-center ${activeMobileTab === 'input' ? 'bg-blue-600' : 'bg-neutral-800'}`}
                    >
                      <Film className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Input</span>
                    </button>
                    <button
                      onClick={() => setActiveMobileTab('roi')}
                      className={`p-3 rounded-lg text-center ${activeMobileTab === 'roi' ? 'bg-purple-600' : 'bg-neutral-800'}`}
                    >
                      <Target className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">ROI</span>
                    </button>
                    <button
                      onClick={() => setActiveMobileTab('settings')}
                      className={`p-3 rounded-lg text-center ${activeMobileTab === 'settings' ? 'bg-cyan-600' : 'bg-neutral-800'}`}
                    >
                      <Settings className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Settings</span>
                    </button>
                    <button
                      onClick={() => setActiveMobileTab('training')}
                      className={`p-3 rounded-lg text-center ${activeMobileTab === 'training' ? 'bg-green-600' : 'bg-neutral-800'}`}
                    >
                      <Brain className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Training</span>
                    </button>
                  </div>

                  {renderMobileSidebarContent()}
                </div>
              </div>
            </div>
          )}

          {/* QR Code Modal */}
          {showQRCode && remoteCameraSession && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-neutral-900 rounded-xl p-6 max-w-md w-full border border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <QrCode className="w-5 h-5 mr-2 text-green-400" />
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

          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'} gap-4 h-full`}>
            {/* Left Sidebar - Desktop Only */}
            {!isMobile && (
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar pr-2">
                {/* Input Source - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('inputSource')}
                  >
                    <div className="flex items-center">
                      <Film className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-sm font-bold">Input Source</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.inputSource ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.inputSource && (
                    <div className="px-4 pb-4 space-y-2">
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
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
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
                                  await startCamera(cameras[0].deviceId);
                                } else {
                                  await startCamera();
                                }
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                              title="Start Camera"
                            >
                              <Power className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {showCameraSelection && availableCameras.length > 0 && (
                          <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                            <div className="text-xs text-neutral-400 mb-2">Select Camera:</div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {availableCameras.map((camera, index) => (
                                <label
                                  key={camera.deviceId}
                                  className={`flex items-center p-2 rounded cursor-pointer ${selectedCameraId === camera.deviceId
                                    ? 'bg-blue-900/30 border border-blue-700'
                                    : 'hover:bg-neutral-700/50'
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name="camera"
                                    value={camera.deviceId}
                                    checked={selectedCameraId === camera.deviceId}
                                    onChange={(e) => setSelectedCameraId(e.target.value)}
                                    className="mr-2"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm truncate">
                                      {camera.label || `Camera ${index + 1}`}
                                    </div>
                                    <div className="text-xs text-neutral-500 truncate">
                                      ID: {camera.deviceId.substring(0, 8)}...
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={handleCameraSelect}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                              >
                                Use Selected Camera
                              </button>
                              <button
                                onClick={() => setShowCameraSelection(false)}
                                className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* OAK Camera */}
                      <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'oak'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-neutral-700 hover:bg-neutral-800'
                        }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Cpu className="w-4 h-4 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Neuron Camera</div>
                              <div className="text-xs text-neutral-500">Device</div>
                            </div>
                          </div>
                          {!isOakStreaming ? (
                            <button
                              onClick={startOakCamera}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                            >
                              <Power className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={stopOakCamera}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              <PowerOff className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Remote Camera */}
                      <div className={`w-full p-3 rounded-lg border transition-colors ${inputSource === 'remote'
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
                          {inputSource === 'remote' && remoteCameraActive ? (
                            <button
                              onClick={stopRemoteCamera}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              <PowerOff className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={startRemoteCameraSession}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                            >
                              <Power className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </div>
                  )}
                </div>

                {/* Training Types - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('trainingTypes')}
                  >
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-orange-400" />
                      <span className="text-sm font-bold">Training Types</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.trainingTypes ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.trainingTypes && (
                    <div className="px-4 pb-4 space-y-3">
                      {/* Anomaly Training */}
                      <label className="flex items-center p-3 rounded-lg border border-neutral-700 hover:bg-neutral-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trainingTypes.anomaly}
                          onChange={(e) => setTrainingTypes(prev => ({ ...prev, anomaly: e.target.checked }))}
                          className="mr-3 h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Anomaly Training</div>
                          <div className="text-xs text-neutral-500">
                            Detect anomalies in static images
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${trainingTypes.anomaly ? 'bg-blue-500' : 'bg-neutral-700'}`} />
                      </label>

                      {/* Sequential Training */}
                      <label className="flex items-center p-3 rounded-lg border border-neutral-700 hover:bg-neutral-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trainingTypes.sequential}
                          onChange={(e) => setTrainingTypes(prev => ({ ...prev, sequential: e.target.checked }))}
                          className="mr-3 h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-purple-500 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Sequential Training</div>
                          <div className="text-xs text-neutral-500">
                            Analyze temporal patterns
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${trainingTypes.sequential ? 'bg-purple-500' : 'bg-neutral-700'}`} />
                      </label>

                      {/* Motion Tracking */}
                      <label className="flex items-center p-3 rounded-lg border border-neutral-700 hover:bg-neutral-800/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trainingTypes.motion}
                          onChange={(e) => setTrainingTypes(prev => ({ ...prev, motion: e.target.checked }))}
                          className="mr-3 h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-green-500 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Motion Tracking</div>
                          <div className="text-xs text-neutral-500">
                            Track object movement
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${trainingTypes.motion ? 'bg-green-500' : 'bg-neutral-700'}`} />
                      </label>
                    </div>
                  )}
                </div>

                {/* ROI Tools - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('roiTools')}
                  >
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="text-sm font-bold">ROI Tools</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.roiTools ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.roiTools && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => {
                            setDrawingMode('select');
                            setCurrentROI(null);
                            setIsDrawing(false);
                          }}
                          className={`p-2 rounded-lg border flex flex-col items-center ${drawingMode === 'select'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-neutral-700 hover:bg-neutral-800'
                            }`}
                        >
                          <MousePointer className="w-4 h-4 mb-1" />
                          <span className="text-xs">Select</span>
                        </button>

                        <button
                          onClick={() => addNewROI('rectangle')}
                          className={`p-2 rounded-lg border flex flex-col items-center ${drawingMode === 'rectangle'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-neutral-700 hover:bg-neutral-800'
                            }`}
                        >
                          <Square className="w-4 h-4 mb-1" />
                          <span className="text-xs">Rectangle</span>
                        </button>

                        <button
                          onClick={() => addNewROI('polygon')}
                          className={`p-2 rounded-lg border flex flex-col items-center ${drawingMode === 'polygon'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-neutral-700 hover:bg-neutral-800'
                            }`}
                        >
                          <Hexagon className="w-4 h-4 mb-1" />
                          <span className="text-xs">Polygon</span>
                        </button>

                        <button
                          onClick={() => setRois([])}
                          className="p-2 rounded-lg border border-red-700 hover:bg-red-900/20 flex flex-col items-center"
                        >
                          <Trash2 className="w-4 h-4 mb-1 text-red-400" />
                          <span className="text-xs text-red-400">Clear All</span>
                        </button>
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {rois.map((roi, index) => (
                          <div
                            key={roi.id}
                            className={`p-2 rounded-lg mb-1 cursor-pointer text-sm ${selectedROI === roi.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/50'
                              }`}
                            onClick={() => setSelectedROI(roi.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ backgroundColor: roiColors[index % roiColors.length] }}
                                />
                                <input
                                  type="text"
                                  value={roi.label}
                                  onChange={(e) => updateROILabel(roi.id, e.target.value)}
                                  className="bg-transparent border-none outline-none w-20 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteROI(roi.id);
                                }}
                                className="p-1 hover:bg-neutral-700 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {showUpload && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
                    {/* Simple modal container */}
                    <div className="relative bg-neutral-900/90 backdrop-blur-md rounded-xl p-6 max-w-sm w-full border border-neutral-700 shadow-xl">
                      {/* Close button */}
                      <button
                        onClick={() => setShowUpload(false)}
                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                        aria-label="Close"
                      >
                        <svg className="w-3 h-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Content */}
                      <div className="flex flex-col items-center justify-center py-4">
                        {/* Upload spinner */}
                        <div className="relative mb-6">
                          <div className="w-16 h-16 rounded-full border-4 border-neutral-700 flex items-center justify-center">
                            {/* Spinner circle */}
                            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-neutral-400 animate-spin"></div>

                            {/* File icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Text content */}
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Uploading File
                        </h3>
                        <p className="text-neutral-400 text-center mb-4">
                          Please wait while we process your file...
                        </p>

                        {/* Simple progress indicator */}
                        <div className="w-full space-y-2">
                          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-neutral-400 rounded-full animate-pulse"
                              style={{ width: '60%' }}
                            ></div>
                          </div>
                          <p className="text-xs text-neutral-500 text-center">
                            Uploading...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backend Extraction Backend Processing- Only show if active  */}
                {backendExtractionMode && (
                  <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                      onClick={() => toggleSection('backendExtraction')}
                    >
                      <div className="flex items-center">
                        <CloudUpload className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="text-sm font-bold">Backend Processing</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.backendExtraction ? 'rotate-180' : ''}`} />
                    </div>

                    {!collapsedSections.backendExtraction && (
                      <div className="px-4 pb-4">
                        {renderBackendExtractionStatus()}
                      </div>
                    )}
                  </div>
                )}

                {/* Recording Settings - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('recordingSettings')}
                  >
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="text-sm font-bold">Recording Settings</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.recordingSettings ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.recordingSettings && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <div className="text-xs text-neutral-400 mb-1">Frame Rate: {frameRate} FPS</div>
                        <input
                          type="range"
                          min="1"
                          max="60"
                          value={frameRate}
                          onChange={(e) => setFrameRate(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-neutral-700 rounded appearance-none"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-neutral-400 mb-1">
                          Duration: {recordingDuration} seconds
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <input
                            type="range"
                            min="5"
                            max="60"
                            step="1"
                            value={recordingDuration}
                            onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-neutral-700 rounded appearance-none"
                          />
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>

                      <button
                        onClick={toggleRecording}
                        disabled={(inputSource === 'camera' && !currentCameraStream) ||
                          (inputSource === 'oak' && !isOakStreaming) ||
                          (inputSource === 'remote' && remoteCameraStatus !== 'connected')}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium ${isRecording
                          ? 'bg-red-600 hover:bg-red-700'
                          : (inputSource === 'camera' && !currentCameraStream) ||
                            (inputSource === 'oak' && !isOakStreaming) ||
                            (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                            ? 'bg-neutral-700 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                      >
                        {isRecording ? (
                          <>
                            <div className="flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                              Stop Recording ({remainingTime}s left)
                            </div>
                          </>
                        ) : (
                          'Start Recording'
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Session Info - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('sessionInfo')}
                  >
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm font-bold">Session Info</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.sessionInfo ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.sessionInfo && (
                    <div className="px-4 pb-4 space-y-2">
                      <div>
                        <div className="text-xs text-neutral-400">Session Name</div>
                        <input
                          type="text"
                          value={sessionName}
                          onChange={(e) => setSessionName(e.target.value)}
                          className="w-full p-2 bg-neutral-800 rounded text-sm mt-1"
                          placeholder="Enter session name"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={startTraining}
                          disabled={!backendConnected || isCapturingTrainingFrames}
                          className={`w-full py-2.5 rounded-lg text-sm font-medium ${!backendConnected || isCapturingTrainingFrames
                            ? 'bg-neutral-700 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                          {isCapturingTrainingFrames ? (
                            'Capturing Frames...'
                          ) : (
                            <>
                              <Brain className="w-4 h-4 inline mr-2" />
                              Start AI Training
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Debug Tools - Collapsible */}
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('debugTools')}
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="text-sm font-bold">Debug Tools</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.debugTools ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.debugTools && (
                    <div className="px-4 pb-4 space-y-2">
                      <button
                        onClick={testCapture}
                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                      >
                        Test Capture
                      </button>
                      <button
                        onClick={checkDatasets}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                      >
                        Check Datasets
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Content - Video or Terminal */}
            <div className={`${isMobile ? 'col-span-1' : 'md:col-span-3'}`}>
              {showTerminal ? (
                <div className="bg-black rounded-xl overflow-hidden border border-neutral-800 h-[90vh] md:h-[700px]">
                  <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-mono">Training Terminal</span>
                      <span className="text-xs text-neutral-500 hidden md:inline">
                        • Session: {sessionName}
                      </span>
                      {trainingStatus !== 'idle' && (
                        <div className={`px-2 py-1 rounded text-xs ${trainingStatus === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          trainingStatus === 'completed' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                          {trainingStatus === 'running' ? 'Running' :
                            trainingStatus === 'completed' ? 'Completed' : 'Failed'}
                        </div>
                      )}
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

                  <div
                    ref={terminalContainerRef}
                    className="h-[calc(70vh-48px)] md:h-[640px] overflow-y-auto bg-black p-4 font-mono text-sm"
                  >
                    <div className="space-y-1">
                      {[...new Set(terminalLogs)].map((log, i) => (
                        <div
                          key={i}
                          className={
                            log.includes("ERROR") || log.includes("❌")
                              ? "text-red-400"
                              : log.includes("WARNING") || log.includes("⚠")
                                ? "text-yellow-400"
                                : log.includes("INFO") || log.includes("INFO]") || log.includes("✓")
                                  ? "text-blue-400"
                                  : log.includes("[PROGRESS]")
                                    ? "text-green-400 font-bold"
                                    : log.includes("SUCCESS")
                                      ? "text-green-400"
                                      : "text-neutral-300"
                          }
                        >
                          <span className="text-blue-500/50 mr-2">›</span>
                          {log}
                        </div>
                      ))}
                      {terminalLogs.length === 0 && (
                        <div className="text-neutral-600 italic">No logs yet. Start recording or training to see logs here.</div>
                      )}
                    </div>

                    {/* 👇 auto-scroll anchor */}
                    <div ref={terminalEndRef} />
                  </div>

                </div>
              ) : (
                <div className="bg-black rounded-xl overflow-hidden border border-neutral-800">
                  {/* Video Header */}
                  <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${inputSource === 'oak' ?
                        (isOakStreaming ? 'bg-green-500' : 'bg-red-500') :
                        inputSource === 'camera' ?
                          (currentCameraStream ? 'bg-green-500' : 'bg-red-500') :
                          inputSource === 'remote' ?
                            (remoteCameraStatus === 'connected' ? 'bg-green-500' : remoteCameraStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500') :
                            (isPlaying ? 'bg-green-500' : 'bg-yellow-500')
                        }`} />
                      <span className="text-sm truncate max-w-[150px] md:max-w-none">
                        {inputSource === 'upload' && videoFile ? videoFile.name :
                          inputSource === 'camera' ? `Live Camera` :
                            inputSource === 'oak' ? 'OAK Camera' :
                              inputSource === 'remote' ? `Remote Camera ${remoteCameraStatus === 'connected' ? '(Connected)' : '(Disconnected)'}` :
                                'Upload Video'}
                        {backendExtractionMode && ' (Backend Processing)'}
                      </span>
                      <span className="text-xs text-neutral-500 hidden md:inline">
                        • {videoDimensions.width}x{videoDimensions.height}
                        {backendExtractionMode && ' • Backend Mode'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isMobile && (
                        <button
                          onClick={() => setShowMobileSidebar(true)}
                          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs"
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                      )}
                      {trainingLogs.length > 0 && (
                        <button
                          onClick={() => setShowTerminal(true)}
                          className="px-2 py-1 bg-green-800/30 hover:bg-green-800/50 rounded text-xs font-medium text-green-400 flex items-center"
                          title="View Training Logs"
                        >
                          <Terminal className="w-3 h-3 mr-1" />
                          {isMobile ? `${trainingLogs.length}` : `View Logs (${trainingLogs.length})`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Video Container */}
                  <div
                    ref={containerRef}
                    className={`relative bg-black ${isMobile ? 'h-[60vh]' : 'aspect-video'}`}
                  >
                    {/* Backend extraction mode overlay */}
                    {backendExtractionMode && (
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                          <div className="text-center p-4 bg-neutral-900/90 rounded-xl mx-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              {extractionStatus === 'processing' || extractionStatus === 'uploading' ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                              ) : extractionStatus === 'completed' ? (
                                <Check className="w-6 h-6" />
                              ) : (
                                <CloudUpload className="w-6 h-6" />
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2">
                              {extractionStatus === 'processing' ? 'Backend Processing' :
                                extractionStatus === 'uploading' ? 'Uploading to Backend' :
                                  extractionStatus === 'completed' ? 'Processing Complete' :
                                    'Backend Processing Required'}
                            </h3>
                            <p className="text-xs text-neutral-300 mb-3">
                              {extractionStatus === 'processing' ? 'Extracting frames on backend...' :
                                extractionStatus === 'uploading' ? 'Uploading video...' :
                                  extractionStatus === 'completed' ? 'Ready for training' :
                                    'Click "Process on Backend" to start'}
                            </p>

                            {extractionStatus === 'processing' && (
                              <div className="space-y-1">
                                <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                    style={{ width: `${extractionProgress}%` }}
                                  />
                                </div>
                                <div className="text-xs text-white">
                                  {extractionProgress.toFixed(1)}% • {extractedFramesCount} frames
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Video sources */}
                    {inputSource === 'oak' && isOakStreaming && (
                      <img
                        ref={oakStreamRef}
                        src={streamUrl}
                        className="w-full h-full object-contain"
                        alt="OAK Camera Stream"
                        onLoad={handleOakStreamLoad}
                        crossOrigin="anonymous"
                      />
                    )}
                    {inputSource === 'upload' && playbackMode === 'video' && !backendExtractionMode && (
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        autoPlay
                        muted
                        loop
                        onLoadedMetadata={handleVideoLoad}
                        playsInline
                      />
                    )}
                    {inputSource === 'camera' && (
                      <div className="relative w-full h-full overflow-hidden">
                        <video
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                          onLoadedMetadata={handleVideoLoad}
                        />
                        {cameraError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white p-4 text-center">
                            <div>
                              <div className="font-semibold text-sm">Camera error</div>
                              <div className="text-xs mt-2">{cameraError}</div>
                              <button
                                onClick={() => setCameraError(null)}
                                className="mt-3 inline-flex rounded-md bg-blue-600 px-3 py-1 text-xs font-medium hover:bg-blue-500"
                                type="button"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {inputSource === 'remote' && remoteCameraFrame && (
                      <img
                        ref={remoteImageRef}
                        src={`data:image/jpeg;base64,${remoteCameraFrame}`}
                        className="w-full h-full object-contain"
                        alt="Remote Camera Stream"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          // Update dimensions from actual image
                          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                            setVideoDimensions({
                              width: img.naturalWidth,
                              height: img.naturalHeight
                            });
                            // Force redraw with new dimensions
                            setTimeout(() => drawCanvas(), 100);
                          }
                        }}
                        crossOrigin="anonymous"
                      />
                    )}

                    {/* ROI Canvas */}
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                      onClick={handleCanvasClick}
                      onTouchStart={handleCanvasTouch}
                      onTouchMove={handleCanvasTouchMove}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseLeave={() => {
                        if (isDrawing && currentROI && currentROI.type === 'rectangle') {
                          setIsDrawing(false);
                        }
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        if (isDrawing && currentROI && currentROI.type === 'polygon') {
                          finishPolygon();
                        }
                      }}
                    />

                    {/* Drawing Instructions */}
                    {drawingMode !== 'select' && (
                      <div className="absolute top-2 left-2 px-3 py-1.5 bg-black/80 rounded text-xs z-20">
                        {drawingMode === 'rectangle' ? 'Click and drag to draw rectangle' :
                          drawingMode === 'polygon' ? 'Click to add polygon points, double-click to finish' :
                            'Click to select ROI'}
                      </div>
                    )}

                    {/* Recording Indicator */}
                    {isRecording && (
                      <div className="absolute top-2 right-2 px-3 py-1.5 bg-red-600/80 rounded flex items-center z-20">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                        <span className="text-xs font-medium">REC - {remainingTime}s</span>
                      </div>
                    )}

                    {/* Backend Status */}
                    <div className={`absolute bottom-2 left-2 px-3 py-1.5 rounded text-xs z-20 ${backendConnected ? 'bg-green-600/80' : 'bg-red-600/80'
                      }`}>
                      {backendConnected ? '✓ Backend' : '✗ Backend'}
                    </div>

                    {/* Camera Status */}
                    {inputSource === 'camera' && (
                      <div className={`absolute bottom-2 right-2 px-3 py-1.5 rounded text-xs z-20 ${currentCameraStream ? 'bg-blue-600/80' : 'bg-yellow-600/80'
                        }`}>
                        {currentCameraStream ? '📷 On' : '📷 Off'}
                      </div>
                    )}

                    {/* OAK Camera Status */}
                    {inputSource === 'oak' && (
                      <div className={`absolute bottom-2 right-2 px-3 py-1.5 rounded text-xs z-20 ${isOakStreaming ? 'bg-purple-600/80' : 'bg-yellow-600/80'
                        }`}>
                        OAK: {isOakStreaming ? 'On' : 'Off'}
                      </div>
                    )}

                    {/* Remote Camera Status */}
                    {inputSource === 'remote' && (
                      <div className={`absolute bottom-2 right-2 px-3 py-1.5 rounded text-xs z-20 ${remoteCameraStatus === 'connected' ? 'bg-green-600/80' :
                        remoteCameraStatus === 'connecting' ? 'bg-yellow-600/80' : 'bg-red-600/80'
                        }`}>
                        Remote: {remoteCameraStatus === 'connected' ? 'Connected' :
                          remoteCameraStatus === 'connecting' ? 'Connecting' : 'Disconnected'}
                      </div>
                    )}

                    {/* Backend Extraction Mode Badge */}
                    {backendExtractionMode && (
                      <div className="absolute top-2 left-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-xs flex items-center z-20">
                        <CloudUpload className="w-3 h-3 mr-1" />
                        Backend Processing
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="px-4 py-3 bg-neutral-900/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {inputSource !== 'oak' && inputSource !== 'camera' && inputSource !== 'remote' && !backendExtractionMode && (
                        <>
                          <button
                            onClick={async () => {
                              if (playbackMode === 'video') {
                                videoRef.current?.play();
                              }
                            }}
                            className="p-2 hover:bg-neutral-800 rounded"
                            title="Play"
                          >
                            <Play className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (playbackMode === 'video') {
                                videoRef.current?.pause();
                              }
                            }}
                            className="p-2 hover:bg-neutral-800 rounded"
                            title="Pause"
                          >
                            <Pause className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                              }
                            }}
                            className="p-2 hover:bg-neutral-800 rounded"
                            title="Restart"
                          >
                            <SkipBack className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                        </>
                      )}

                      {inputSource === 'upload' && !isMobile && !backendExtractionMode && (
                        <div className="w-64">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={recordingProgress}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setRecordingProgress(value);
                              if (videoRef.current && videoRef.current.duration) {
                                videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
                              }
                            }}
                            className="w-full h-1.5 bg-neutral-700 rounded appearance-none"
                          />
                        </div>
                      )}

                      {inputSource === 'upload' && !isMobile && !backendExtractionMode && (
                        <span className="text-xs text-neutral-400">
                          {Math.round(recordingProgress)}%
                        </span>
                      )}

                      {/* Terminal Toggle Button */}
                      <button
                        onClick={() => setShowTerminal(!showTerminal)}
                        className={`p-2 hover:bg-neutral-800 rounded ${showTerminal || trainingLogs.length > 0 ? 'bg-green-600' : ''
                          }`}
                        title="Toggle Terminal"
                      >
                        <Terminal className="w-5 h-5 md:w-4 md:h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-neutral-500">
                      {isMobile ? (
                        <>
                          {backendExtractionMode ? 'Backend' :
                            inputSource === 'oak' ? 'OAK' :
                              inputSource === 'camera' ? 'Camera' :
                                inputSource === 'remote' ? 'Remote' :
                                  (isPlaying ? '▶' : '⏸')} • {frameRate}fps • {captureCount}f
                        </>
                      ) : (
                        <>
                          {backendExtractionMode ? 'Backend Processing' :
                            inputSource === 'oak' ? 'OAK Camera' :
                              inputSource === 'camera' ? 'Live Camera' :
                                inputSource === 'remote' ? `Remote Camera (${remoteCameraStatus})` :
                                  (isPlaying ? 'Playing' : 'Paused')} • {frameRate} FPS • Frames: {captureCount}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Backend Extraction Status - Mobile/Desktop */}
              {!showTerminal && backendExtractionMode && isMobile && (
                <div className="mt-4">
                  {renderBackendExtractionStatus()}
                </div>
              )}

              {/* Instructions - Mobile Collapsible */}
              {!showTerminal && (
                <div className="mt-4 bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold flex items-center">
                      <Smartphone className="w-4 h-4 mr-2 text-blue-400" />
                      Instructions
                    </div>
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {isMobile ? 'Tap for details' : 'View details'}
                    </button>
                  </div>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>1. Select input source (upload, camera, OAK, or remote)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">2.</span>
                      <span>Draw ROIs using tools (skip for full frame)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">3.</span>
                      <span>Adjust settings & click "Start AI Training"</span>
                    </li>
                    {backendExtractionMode && (
                      <li className="flex items-start text-yellow-300">
                        <span className="mr-2">⚠</span>
                        <span>Video format not supported - using backend processing</span>
                      </li>
                    )}
                    {isMobile && (
                      <li className="text-cyan-400 text-xs italic">
                        Tap menu button for controls
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Status - Mobile Grid */}
              {!showTerminal && (
                <div className={`mt-4 grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-3 gap-4'}`}>
                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">
                    <div className="text-xs text-neutral-500 mb-1">Recording</div>
                    <div className="text-sm">
                      {isRecording ? `REC ${remainingTime}s` : 'Ready'}
                      <div className="text-xs text-neutral-400 mt-1">
                        Frames: {captureCount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">
                    <div className="text-xs text-neutral-500 mb-1">Storage</div>
                    <div className="text-sm">
                      Backend {backendConnected ? '✓' : '✗'}
                      <div className="text-xs text-neutral-400 mt-1 truncate">
                        {sessionName.substring(0, isMobile ? 8 : 20)}...
                      </div>
                    </div>
                  </div>

                  {!isMobile && (
                    <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">
                      <div className="text-xs text-neutral-500 mb-1">Camera Status</div>
                      <div className="text-sm">
                        {backendExtractionMode ? 'Backend Mode' :
                          inputSource === 'camera' ?
                            `Camera: ${currentCameraStream ? 'Active' : 'Inactive'}` :
                            inputSource === 'oak' ?
                              `OAK: ${isOakStreaming ? 'Streaming' : 'Idle'}` :
                              inputSource === 'remote' ?
                                `Remote: ${remoteCameraStatus}` :
                                'Upload Mode'
                        }
                        <div className="text-xs text-neutral-400 mt-1">
                          ROIs: {rois.length} active
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Status Bar - Mobile Bottom Navigation */}
        {isMobile && !showTerminal && (
          <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-2 py-2">
            <div className="grid grid-cols-5 gap-1">
              <button
                onClick={() => setActiveMobileTab('input')}
                className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'input' ? 'bg-blue-600' : ''}`}
              >
                <Film className="w-5 h-5 mb-1" />
                <span className="text-xs">Input</span>
              </button>
              <button
                onClick={() => setActiveMobileTab('roi')}
                className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'roi' ? 'bg-purple-600' : ''}`}
              >
                <Target className="w-5 h-5 mb-1" />
                <span className="text-xs">ROI</span>
              </button>
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="flex flex-col items-center p-2 rounded bg-neutral-800"
              >
                <Settings className="w-5 h-5 mb-1" />
                <span className="text-xs">Settings</span>
              </button>
              <button
                onClick={() => setActiveMobileTab('training')}
                className={`flex flex-col items-center p-2 rounded ${activeMobileTab === 'training' ? 'bg-green-600' : ''}`}
              >
                <Brain className="w-5 h-5 mb-1" />
                <span className="text-xs">Train</span>
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

        {/* Status Bar - Desktop */}
        {!isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Target className="w-3 h-3 mr-1 text-blue-400" />
                  <span>ROIs: {rois.length}</span>
                </div>
                <div className="flex items-center">
                  <Video className="w-3 h-3 mr-1 text-green-400" />
                  <span>FPS: {frameRate}</span>
                </div>
                <div className="flex items-center">
                  <Brain className="w-3 h-3 mr-1 text-purple-400" />
                  <span>Session: {sessionName}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-cyan-400" />
                  <span>Duration: {recordingDuration}s</span>
                </div>
                <div className="flex items-center">
                  <Camera className="w-3 h-3 mr-1 text-yellow-400" />
                  <span>Frames: {captureCount}</span>
                </div>
                {backendExtractionMode && (
                  <div className="flex items-center">
                    <CloudUpload className="w-3 h-3 mr-1 text-purple-400" />
                    <span>Backend: {extractionStatus}</span>
                  </div>
                )}
                {inputSource === 'remote' && (
                  <div className="flex items-center">
                    <Smartphone className="w-3 h-3 mr-1 text-green-400" />
                    <span>Remote: {remoteCameraStatus}</span>
                  </div>
                )}
              </div>

              <div className="text-neutral-500">
                Mode: <span className="text-neutral-300">{drawingMode}</span> •
                Terminal: <span className="text-neutral-300">{showTerminal ? 'ON' : 'OFF'}</span>
                {backendExtractionMode && ' • Backend Mode'}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}