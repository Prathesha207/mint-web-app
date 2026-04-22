
'use client';

// Design system tokens for this page
const ds = {
  radius: {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-[2.5rem]',
    pill: 'rounded-full',
  },
  colors: {
    bg: 'bg-[#080808]',
    surface: 'bg-zinc-900/40',
    surfaceBlur: 'bg-zinc-900/40 ',
    surfaceSolid: 'bg-[#121212]',
    borderSubtle: 'border-zinc-800/50',
    borderStrong: 'border-zinc-700/50',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-500',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryRing: 'focus-visible:ring-blue-500/80',
    accent: 'bg-indigo-500',
    accentSoft: 'bg-indigo-500/15',
    dangerSoft: 'bg-rose-500/15',
    warningSoft: 'bg-amber-500/15',
    successSoft: 'bg-blue-500/12',
    outline: 'border-zinc-800',
  },
  shadow: {
    soft: 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
    strong: 'shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
  },
  text: {
    label: 'text-[10px] font-bold tracking-[0.2em] uppercase',
    mono: 'font-mono text-[10px]',
  },
};

const buttonPrimary =
  `inline-flex items-center justify-center gap-2 px-4 h-9 text-xs font-bold ${ds.radius.sm} ` +
  `${ds.colors.primary} ${ds.colors.primaryHover} text-black ${ds.shadow.soft} ` +
  'transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 ' +
  `${ds.colors.primaryRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`;

const buttonSecondary =
  `inline-flex items-center justify-center gap-2 px-4 h-9 text-xs font-bold ${ds.radius.sm} ` +
  'bg-zinc-800/50 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/50 ' +
  'transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]';

const buttonGhost =
  `inline-flex items-center justify-center gap-2 px-3 h-9 text-[11px] font-bold ${ds.radius.sm} ` +
  'bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 ' +
  'transition-colors';

const toolbarIconButton =
  `flex items-center justify-center px-2 py-1.5 text-xs ${ds.radius.sm} ` +
  'bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 ' +
  'transition-colors';

const panelCard =
  `${ds.radius.md} ${ds.colors.surfaceBlur} border ${ds.colors.borderSubtle} ` +
  `${ds.shadow.soft}`;

const subtleBadge =
  `inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold ${ds.radius.pill} ` +
  'bg-zinc-900/80 border border-zinc-700 text-zinc-300';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Upload, Camera, Target, Brain, Play, Pause,
  Square, Hexagon, Trash2, Save, RefreshCw,
  Settings, Layers, Plus, Edit2, Eye, Zap, Cpu,
  MousePointer, Video, Film, CheckCircle, Grid3x3,
  Download, SkipBack, SkipForward, Volume2, VolumeX,
  Power, PowerOff, Radio, Terminal, X, Copy, Clock, AlertCircle,
  Menu, ChevronDown, ChevronUp, Smartphone, Tablet, Monitor,
  CloudUpload, AlertTriangle, Check, QrCode,
  Workflow,
  Activity,
  Crosshair,
  Bug,

  Settings2,
  Sliders,
  Info,
  BugIcon,
  Database,
  HelpCircle,
  Maximize2,
  Frame,
  ScrollTextIcon,
  Scroll,
  VideoIcon,

  User,
  CloudOff,
  CloudCheck,
  FolderKanban
} from 'lucide-react';
import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react';

interface Point {
  x: number;
  y: number;
}
type TrainingType = 'anomaly' | 'sequential' | 'motion';
type ToolbarDropdownId =
  | 'inputSource'
  | 'inferenceModel'
  | 'inferenceControls'
  | 'inferenceAdvanced'
  | 'inferenceStats';

type PanelType = 'terminal' | 'instructions' | null;

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ROI {
  training: TrainingType[];
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
  downloadUrl?: string;
  storedVideoPath?: string;
  storageOwner?: string;
}

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROIToolsPalette from './components/ROIToolsPalette';
import TrainingTypeModal from './components/TrainingTypeModal';
import TrainingFooter from './components/footers/TrainingFooter';
import InferenceFooter from './components/footers/InferenceFooter';
import InferenceControls from './components/inference/InferenceControls';
import InferenceModelDropdown from './components/inference/ModelSelection';
import InferenceSettings from './components/inference/InferenceSettings';
import { InferenceModel, useInference } from './hooks/useInference';
import React from 'react';
import { showToast } from './lib/toast';
import BackendExtractionCard from './components/BackendExtraction';
import { authFetch } from '../lib/authFetch';
import { BackendVideoProcessingPanel } from './components/BackendVideoProcessingUI';
import MobileToolbox, { type MobilePanelMenu } from './components/MobileToolbox';
import MobileSidePanelMenu from './components/MobileSidePanelMenu';

export default function TrainingContent() {
  const router = useRouter();

  // Inference UI States
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeInferenceTab, setActiveInferenceTab] = useState<'live' | 'batch'>('live');
  // New States
  const [viewMode, setViewMode] = useState<'training' | 'inference'>('training');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedProgress, setDraggedProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<ToolbarDropdownId | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [mobileActivePanelMenu, setMobileActivePanelMenu] = useState<MobilePanelMenu | null>(null);
  const [inferenceViewerMode, setInferenceViewerMode] = useState<'processed' | 'original'>('processed');
  const [hoveredROI, setHoveredROI] = useState<string | null>(null);
  // State management
  const [activeTab, setActiveTab] = useState<'setup' | 'record' | 'review' | 'train'>('setup');
  const [inputSource, setInputSource] = useState<'upload' | 'camera' | 'oak' | 'remote'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'rectangle' | 'polygon' | 'select'>('select');
  const [rois, setRois] = useState<ROI[]>([]);
  const [inferenceRois, setInferenceRois] = useState<ROI[]>([]);
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
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0, visible: false });
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  // Panel: only one of terminal | instructions is visible
  const showTerminal = activePanel === 'terminal';
  const showInstructions = activePanel === 'instructions';
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempSessionName, setTempSessionName] = useState(sessionName);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (!sessionName) {
      const generated = `session_${Date.now()}`;
      setSessionName(generated);
      setTempSessionName(generated);
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ROI tools: visible only when user clicks ROI icon (no flicker, stays open while working)
  const [roiToolsVisible, setRoiToolsVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Toast notification system
  // const [toasts, setToasts] = useState<Toast[]>([]);

  // Workflow stepper
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
  // const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // const [activeMobileTab, setActiveMobileTab] = useState<'input' | 'roi' | 'settings' | 'training'>('input');


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
  const [remoteCameraActive, setRemoteCameraActive] = useState(false);
  const [remoteCameraFrame, setRemoteCameraFrame] = useState<string | null>(null);
  const [remoteCameraStatus, setRemoteCameraStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [remoteDownloadUrl, setRemoteDownloadUrl] = useState<string>('');
  const [remoteStoragePath, setRemoteStoragePath] = useState<string>('');

  useEffect(() => {
    remoteSessionRef.current = remoteCameraSession;
  }, [remoteCameraSession]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleDropdown = useCallback((id: ToolbarDropdownId) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  const closeDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- Toast notification system ---
  // const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
  //   const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  //   setToasts(prev => [...prev, { id, message, type }]);
  //   setTimeout(() => {
  //     setToasts(prev => prev.filter(t => t.id !== id));
  //   }, 4000);
  // }, []);

  // --- Panel mutual exclusion toggle ---
  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);
  const toggleMobilePanelMenu = useCallback((panel: MobilePanelMenu) => {
    const nextMode =
      panel === 'inference' || panel === 'model'
        ? 'inference'
        : panel === 'training-model' ||
          panel === 'roi' ||
          panel === 'recording' ||
          panel === 'projects'
          ? 'training'
          : null;

    if (nextMode && nextMode !== viewMode) {
      handleViewModeChange(nextMode);
      setMobileActivePanelMenu(panel);
      return;
    }

    setMobileActivePanelMenu((prev) => (prev === panel ? null : panel));
  }, [viewMode]);
  const inputSourceDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceModelDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceControlsDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceAdvancedDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceStatsDropdownRef = useRef<HTMLDivElement>(null);
  const roiToolsDropdownRef = useRef<HTMLDivElement>(null);
  const mobileBatchFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!openDropdown) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      let activeDropdown: HTMLDivElement | null = null;
      if (openDropdown === 'inputSource') activeDropdown = inputSourceDropdownRef.current;
      if (openDropdown === 'inferenceModel') activeDropdown = inferenceModelDropdownRef.current;
      if (openDropdown === 'inferenceControls') activeDropdown = inferenceControlsDropdownRef.current;
      if (openDropdown === 'inferenceAdvanced') activeDropdown = inferenceAdvancedDropdownRef.current;
      if (openDropdown === 'inferenceStats') activeDropdown = inferenceStatsDropdownRef.current;

      if (activeDropdown && !activeDropdown.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!collapsedSections.roiTools) return;

    const handleRoiToolsOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (roiToolsDropdownRef.current && !roiToolsDropdownRef.current.contains(target)) {
        setCollapsedSections((prev) => ({
          ...prev,
          roiTools: false,
        }));
      }
    };

    document.addEventListener('mousedown', handleRoiToolsOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleRoiToolsOutsideClick);
    };
  }, [collapsedSections.roiTools]);

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
  const isPausedBeforeScrub = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const oakStreamRef = useRef<HTMLImageElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef<boolean>(false); // track live recording state in async loops
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const roiCanvasRef = useRef<HTMLCanvasElement>(null);
  const remoteSessionRef = useRef<RemoteCameraSession | null>(null);
  const remoteViewerSocketRef = useRef<WebSocket | null>(null);
  const remoteRenderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const remoteStopRequestedRef = useRef(false);
  const trainingRef = useRef<boolean>(true); // track training capture state - set to false to stop
  const processedInferenceVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenImageRef = useRef<HTMLImageElement>(null);
  const popupRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoReloadAttemptsRef = useRef(0);
  const videoErrorCountRef = useRef(0);
  const [processedVideoUnsupported, setProcessedVideoUnsupported] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipHoveredRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(false);
  const [popupCurrentFrame, setPopupCurrentFrame] = useState<'original' | 'processed'>('processed');
  const [popupOriginalFrame, setPopupOriginalFrame] = useState('');
  const [popupProcessedFrame, setPopupProcessedFrame] = useState('');
  const [isLiveView, setIsLiveView] = useState(true);
  const [lastFrameUpdateTime, setLastFrameUpdateTime] = useState(0);
  const [pendingROI, setPendingROI] = useState<ROI | null>(null);
  const initialTrainingTypes = {
    anomaly: true,
    sequential: false,
    motion: false,
  };
  const [trainingTypes, setTrainingTypes] = useState(initialTrainingTypes);
  const [selectedTrainingModel, setSelectedTrainingModel] = useState<string>('');

  const getSelectedTrainingOptions = useCallback((): TrainingType[] => {
    const selectedTypes = new Set<TrainingType>();

    if (trainingTypes.anomaly) selectedTypes.add('anomaly');
    if (trainingTypes.sequential) selectedTypes.add('sequential');
    if (trainingTypes.motion) selectedTypes.add('motion');

    rois.forEach((roi) => {
      roi.training.forEach((type) => selectedTypes.add(type));
    });

    if (selectedTypes.size === 0) {
      selectedTypes.add('anomaly');
    }

    return Array.from(selectedTypes);
  }, [rois, trainingTypes.anomaly, trainingTypes.motion, trainingTypes.sequential]);
  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.paused) {
          await videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } catch (err) {
        addTerminalLog(`Playback error: ${err}`);
      }
    }
  };

  const isRemoteCameraReady = useCallback(() => {
    return remoteCameraStatus === 'connected' && remoteCameraFrame !== null;
  }, [remoteCameraStatus, remoteCameraFrame]);

  // Color system / design tokens
  const roiColors = ['#38bdf8', '#22c55e', '#f97316', '#eab308', '#ef4444', '#6366f1', '#06b6d4', '#a855f7'];
  const updateROI = (id: string, updates: Partial<ROI>) => {
    setRois(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };


  const itemDefault =
    "bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-100 border border-zinc-600/70 shadow-[0_14px_45px_rgba(0,0,0,0.85)] transition-colors transition-shadow duration-150 ease-out";
  const itemSelected =
    "bg-blue-600/15 text-blue-100 border border-blue-500/80 shadow-[0_18px_55px_rgba(37,99,235,0.75)] hover:bg-blue-600/25 active:translate-y-[1px]";

  const addTerminalLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setTrainingLogs(prev => [...prev, logMessage]);
  }, []);

  const addExtractionLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] [BACKEND] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setExtractionLogs(prev => [...prev, logMessage]);
  }, []);

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'games-measure-gap-rows.trycloudflare.com';

  const backendHttpBase = useMemo(() => {
    const normalized = NEXT_PUBLIC_BACKEND_URL.trim().replace(/\/$/, '');
    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    return `${protocol}//${normalized}`;
  }, [NEXT_PUBLIC_BACKEND_URL]);

  const backendWsBase = useMemo(() => {
    const parsed = new URL(backendHttpBase);
    return `${parsed.protocol === 'https:' ? 'wss:' : 'ws:'}//${parsed.host}`;
  }, [backendHttpBase]);

  const getStoredAccessToken = useCallback(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.localStorage.getItem('access_token') || '';
  }, []);

  const resolveRemoteDownloadUrl = useCallback((sessionId: string, nextUrl?: string) => {
    const normalized = (nextUrl || '').trim();
    if (!normalized) {
      const url = new URL(`${backendHttpBase}/api/remote-camera/download/${encodeURIComponent(sessionId)}`);
      const token = getStoredAccessToken();
      if (token) {
        url.searchParams.set('token', token);
      }
      return url.toString();
    }

    const url = normalized.startsWith('http')
      ? new URL(normalized)
      : new URL(normalized, backendHttpBase);
    const token = getStoredAccessToken();
    if (token && !url.searchParams.has('token')) {
      url.searchParams.set('token', token);
    }
    return url.toString();
  }, [backendHttpBase, getStoredAccessToken]);

  const resetRemoteVideoSurface = useCallback(() => {
    if (remoteVideoRef.current?.srcObject instanceof MediaStream) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    remoteRenderCanvasRef.current = null;
  }, []);

  const renderRemoteFrameToVideo = useCallback((frameData: string, width: number, height: number) => {
    if (typeof document === 'undefined') {
      return;
    }

    const normalizedFrame = frameData.startsWith('data:image')
      ? frameData
      : `data:image/jpeg;base64,${frameData}`;

    let canvas = remoteRenderCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      remoteRenderCanvasRef.current = canvas;
    }

    const targetWidth = Math.max(1, width || videoDimensions.width || 1280);
    const targetHeight = Math.max(1, height || videoDimensions.height || 720);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = canvas.captureStream(Math.max(frameRate, 12));
      remoteVideoRef.current.muted = true;
      remoteVideoRef.current.playsInline = true;
      remoteVideoRef.current.autoplay = true;
      void remoteVideoRef.current.play().catch(() => undefined);
    }

    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas!.width, canvas!.height);
      context.drawImage(image, 0, 0, canvas!.width, canvas!.height);
      if (remoteVideoRef.current?.paused) {
        void remoteVideoRef.current.play().catch(() => undefined);
      }
    };
    image.src = normalizedFrame;
  }, [frameRate, videoDimensions.height, videoDimensions.width]);

  const connectRemoteViewerSocket = useCallback((sessionId: string) => {
    if (!sessionId) {
      return;
    }

    remoteStopRequestedRef.current = false;

    if (remoteViewerSocketRef.current) {
      remoteViewerSocketRef.current.close();
      remoteViewerSocketRef.current = null;
    }

    const socketUrl = new URL(`/api/remote-camera/ws/${encodeURIComponent(sessionId)}/viewer`, backendWsBase);
    const token = getStoredAccessToken();
    if (token) {
      socketUrl.searchParams.set('token', token);
    }

    const socket = new WebSocket(socketUrl.toString());
    remoteViewerSocketRef.current = socket;
    setRemoteCameraStatus('connecting');

    socket.onopen = () => {
      if (remoteViewerSocketRef.current !== socket) {
        return;
      }
      addTerminalLog(`📡 Waiting for mobile camera on session ${sessionId}`);
    };

    socket.onmessage = (event) => {
      if (remoteViewerSocketRef.current !== socket) {
        return;
      }
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'error') {
          addTerminalLog(`❌ Remote camera error: ${data.message || 'Unknown error'}`);
          setRemoteCameraStatus('disconnected');
          setRemoteCameraActive(false);
          return;
        }

        if (typeof data.download_url === 'string' && data.download_url) {
          setRemoteDownloadUrl(resolveRemoteDownloadUrl(sessionId, data.download_url));
        }
        if (typeof data.stored_video_path === 'string') {
          setRemoteStoragePath(data.stored_video_path);
        }

        if (data.type === 'session_state' || data.type === 'broadcaster_connected') {
          setRemoteCameraSession((prev) => ({
            sessionId,
            connected: Boolean(data.broadcaster_connected),
            lastFrameTime: prev?.lastFrameTime || Date.now(),
            frameCount: typeof data.frame_count === 'number' ? data.frame_count : prev?.frameCount || 0,
            deviceInfo: typeof data.device_info === 'string' ? data.device_info : prev?.deviceInfo,
            downloadUrl: typeof data.download_url === 'string' ? data.download_url : prev?.downloadUrl,
            storedVideoPath: typeof data.stored_video_path === 'string' ? data.stored_video_path : prev?.storedVideoPath,
            storageOwner: typeof data.storage_owner === 'string' ? data.storage_owner : prev?.storageOwner,
          }));

          if (data.type === 'session_state' && data.frame) {
            const frame = typeof data.frame === 'string' ? data.frame : '';
            const normalizedFrame = frame.startsWith('data:image') ? frame.split(',')[1] : frame;
            const frameWidth = Number(data.width) || videoDimensions.width || 1280;
            const frameHeight = Number(data.height) || videoDimensions.height || 720;
            setRemoteCameraFrame(normalizedFrame);
            setVideoDimensions({ width: frameWidth, height: frameHeight });
            renderRemoteFrameToVideo(frame, frameWidth, frameHeight);
          }

          return;
        }

        if (data.type === 'frame') {
          const frame = typeof data.frame === 'string' ? data.frame : '';
          const normalizedFrame = frame.startsWith('data:image') ? frame.split(',')[1] : frame;
          const frameWidth = Number(data.width) || videoDimensions.width || 1280;
          const frameHeight = Number(data.height) || videoDimensions.height || 720;
          const frameTimestamp = typeof data.last_frame_at === 'string' ? Date.parse(data.last_frame_at) : Date.now();

          setRemoteCameraFrame(normalizedFrame);
          setRemoteCameraStatus('connected');
          setRemoteCameraActive(true);
          setVideoDimensions({ width: frameWidth, height: frameHeight });
          renderRemoteFrameToVideo(frame, frameWidth, frameHeight);

          setRemoteCameraSession((prev) => ({
            sessionId,
            connected: true,
            lastFrameTime: Number.isFinite(frameTimestamp) ? frameTimestamp : Date.now(),
            frameCount: typeof data.frame_count === 'number' ? data.frame_count : (prev?.frameCount || 0) + 1,
            deviceInfo: typeof data.device_info === 'string' ? data.device_info : prev?.deviceInfo,
            downloadUrl: typeof data.download_url === 'string' ? data.download_url : prev?.downloadUrl,
            storedVideoPath: typeof data.stored_video_path === 'string' ? data.stored_video_path : prev?.storedVideoPath,
            storageOwner: typeof data.storage_owner === 'string' ? data.storage_owner : prev?.storageOwner,
          }));
          return;
        }

        if (data.type === 'session_stopped') {
          setRemoteCameraStatus('disconnected');
          setRemoteCameraActive(false);
          setRemoteCameraSession((prev) => prev ? { ...prev, connected: false } : prev);
          addTerminalLog('📱 Remote camera stopped. Recording is ready to download.');
        }
      } catch (parseError) {
        console.error('Remote viewer socket message error:', parseError);
      }
    };

    socket.onclose = () => {
      const isActiveSocket = remoteViewerSocketRef.current === socket;
      if (isActiveSocket) {
        remoteViewerSocketRef.current = null;
      }
      if (isActiveSocket && !remoteStopRequestedRef.current) {
        setRemoteCameraStatus('disconnected');
        setRemoteCameraActive(false);
        addTerminalLog('📱 Remote camera viewer disconnected.');
      }
    };

    socket.onerror = () => {
      if (remoteViewerSocketRef.current !== socket) {
        return;
      }
      setRemoteCameraStatus('disconnected');
      setRemoteCameraActive(false);
      addTerminalLog('❌ Remote camera viewer connection failed.');
    };
  }, [
    addTerminalLog,
    backendWsBase,
    getStoredAccessToken,
    renderRemoteFrameToVideo,
    resolveRemoteDownloadUrl,
    videoDimensions.height,
    videoDimensions.width,
  ]);

  const downloadRemoteVideo = useCallback(() => {
    const sessionId = remoteCameraSession?.sessionId;
    if (!sessionId) {
      return;
    }

    const resolvedUrl = remoteDownloadUrl || resolveRemoteDownloadUrl(sessionId);
    setRemoteDownloadUrl(resolvedUrl);

    const anchor = document.createElement('a');
    anchor.href = resolvedUrl;
    anchor.download = `${sessionId}.mp4`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, [remoteCameraSession?.sessionId, remoteDownloadUrl, resolveRemoteDownloadUrl]);



  useEffect(() => {
    console.log("1. Component Mounted");

    const checkBackend = async () => {
      const apiUrl = `${backendHttpBase}/api/health`;

      console.log("2. Testing connection to:", apiUrl);

      try {
        // Use a timeout to avoid long hangs if the tunnel is down
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        // 3. Check for Cloudflare-specific headers
        const serverHeader = response.headers.get("server");
        const cfRay = response.headers.get("cf-ray");

        console.log("3. Status Received:", response.status);

        if (cfRay) {
          console.log("✅ SUCCESS: Connected via Cloudflare Tunnel");
          console.log("   Cloudflare Ray ID:", cfRay);
        } else {
          console.warn("⚠️ WARNING: Connected, but Cloudflare headers are missing.");
        }

        console.log("   Server type reported:", serverHeader || "Unknown");
      } catch (err) {
        // Narrow the type from 'unknown' to 'Error'
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.error("❌ ERROR: Connection timed out. Is the tunnel running?");
          } else {
            console.error("❌ ERROR: Fetch Failed. Details:", err.message);
          }
        } else {
          // Handle cases where something non-standard was thrown
          console.error("❌ ERROR: An unexpected error occurred", err);
        }
      }

    };

    checkBackend();
  }, [backendHttpBase]);



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
    const selectedTrainingOptions = getSelectedTrainingOptions();

    setAnalysisDetails([
      `Training Session: ${sessionName}`,
      `Input Source: ${inputSource}`,
      `Frame Rate: ${frameRate} FPS`,
      `ROIs: ${rois.length}`,
      `Training Modes: ${selectedTrainingOptions.join(', ')}`
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
    if (remoteCameraSession) {
      stopRemoteCamera();
    }

    const sessionId = generateSessionId();
    const session: RemoteCameraSession = {
      sessionId,
      connected: false,
      lastFrameTime: Date.now(),
      frameCount: 0,
    };

    setRemoteCameraSession(session);
    setShowQRCode(true);
    setInputSource('remote');
    setRemoteCameraActive(true);
    setRemoteCameraStatus('connecting');
    setRemoteCameraFrame(null);
    setRemoteDownloadUrl('');
    setRemoteStoragePath('');
    resetRemoteVideoSurface();

    // Generate the URL for mobile phone
    const baseUrl = window.location.origin;
    const mobileUrl = `${baseUrl}/mobile-camera?session=${sessionId}`;

    addTerminalLog(`📱 Remote camera session started: ${sessionId}`);
    addTerminalLog(`📱 Mobile URL: ${mobileUrl}`);
    addTerminalLog(`📱 Scan the QR code with your phone to connect`);

    connectRemoteViewerSocket(sessionId);

    return mobileUrl;
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [terminalLogs]);

  const startLiveTraining = async () => {
    try {
      addTerminalLog(`=== Starting Live Training with Remote Camera ===`);

      if (remoteCameraStatus !== 'connected') {
        showToast('Please connect remote camera first', "warning");
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
          // addTerminalLog(`âš  Error capturing frame ${i}: ${error.message}`);
        }
      }

      setIsRecording(false);
      addTerminalLog(`✓ Initial ${captureCount} frames captured and saved to session`);

      // Step 2: Verify session has frames
      addTerminalLog(`Step 2: Verifying session...`);

      try {
        const verifyResponse = await authFetch(`${backendHttpBase}/api/sessions/${sessionName}/frame-count`);
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
        showToast('Failed to create session with frames. Please try again.', 'error');
        setShowUpload(false);
        return;
      }

      // Step 3: Start training session
      addTerminalLog(`Step 3: Starting training session...`);

      const trainingOptions = getSelectedTrainingOptions();
      addTerminalLog(`Training Types: ${trainingOptions.join(", ")}`);

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

      const response = await authFetch(`${backendHttpBase}/api/training/start/`, {
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
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('mint:last-training-model-id', result.training_id);
        }

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

                await authFetch(`${backendHttpBase}/api/training/live-frame`, {
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
        setActivePanel('terminal');
        setTrainingStatus('running');
      } else {
        const errorText = await response.text();
        addTerminalLog(`❌ ERROR: ${errorText}`);
        showToast(`Failed to start training: ${errorText}`, 'error');
        setShowUpload(false);
      }

    } catch (error) {
      console.error('Error starting live training:', error);
      // addTerminalLog(`❌ ERROR: ${error.message || error}`);
      setShowUpload(false);
    }
  };



  const startRecordingForRemote = async () => {
    try {
      if (!remoteCameraFrame) {
        showToast('No frame available from remote camera', 'warning');
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

                  await authFetch(`${backendHttpBase}/api/training/frames/`, {
                    method: 'POST',
                    body: roiFormData,
                  });
                }
              } else {
                // Full frame mode
                await authFetch(`${backendHttpBase}/api/training/full-frame`, {
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
          // addTerminalLog(`⚠  Error capturing frame ${i}: ${error.message}`);
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
  const stopRemoteCamera = () => {
    const sessionIdToStop = remoteCameraSession?.sessionId;
    remoteStopRequestedRef.current = true;

    // STOP INFERENCE FIRST before stopping camera
    if (inference.isProcessing) {
      void inference.stopInference();
      addTerminalLog('🛑 Inference stopped');
    }

    if (remoteViewerSocketRef.current) {
      try {
        remoteViewerSocketRef.current.close();
      } catch {
        // ignored
      }
      remoteViewerSocketRef.current = null;
    }

    if (sessionIdToStop) {
      authFetch(`${backendHttpBase}/api/remote-camera/stop/${sessionIdToStop}`, {
        method: 'POST'
      })
        .then(async (response) => {
          if (!response.ok) {
            return;
          }
          const data = await response.json();
          if (remoteSessionRef.current && remoteSessionRef.current.sessionId !== sessionIdToStop) {
            return;
          }
        })
        .catch(console.error);
    }

    resetRemoteVideoSurface();
    setRemoteCameraActive(false);
    setRemoteCameraStatus('disconnected');
    setRemoteCameraSession(prev => prev ? { ...prev, connected: false } : null);
    setShowQRCode(false);
    if (inputSource === 'remote') {
      setInputSource('upload');
    }
    addTerminalLog('📱 Remote camera stopped');
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
      if (remoteViewerSocketRef.current) {
        remoteStopRequestedRef.current = true;
        remoteViewerSocketRef.current.close();
        remoteViewerSocketRef.current = null;
      }
      resetRemoteVideoSurface();
      if (remoteSessionRef.current) {
        authFetch(`${backendHttpBase}/api/remote-camera/stop/${remoteSessionRef.current.sessionId}`, {
          method: 'POST'
        }).catch(() => undefined);
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
      setCameraError(null);
      setInputSource('camera');
      setShowCameraSelection(false);
      setInferenceViewerMode('processed');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        addTerminalLog('✓ Webcam started successfully');

        // Debug: Log stream and video element info
        const videoTracks = stream.getVideoTracks();
        addTerminalLog(`📹 Stream active tracks: ${videoTracks.length} video, ${stream.getAudioTracks().length} audio`);
        addTerminalLog(`📹 Video element: ${videoRef.current ? 'attached' : 'not attached'}`);

        // For MediaStream, dimensions are available from the track
        if (videoTracks.length > 0) {
          const track = videoTracks[0];
          const settings = track.getSettings?.() || {};
          if (settings.width && settings.height) {
            addTerminalLog(`📹 Track resolution: ${settings.width}x${settings.height}`);
          } else {
            addTerminalLog(`📹 Track settings unavailable, waiting for onPlay event...`);
          }
        }

        // Force play immediately
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              addTerminalLog('✓ Video playback started');
            })
            .catch((err: any) => {
              addTerminalLog(`⚠️ Autoplay blocked: ${err.message}`);
              addTerminalLog('💡 Tip: Click the video area or wait - dimensions will show once video renders');
            });
        }
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
        setInputSource('camera');
        setShowCameraSelection(false);
        setInferenceViewerMode('processed');
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          addTerminalLog('✓ Webcam started with fallback constraints');

          // Force play with error handling
          videoRef.current.play().catch((err: any) => {
            addTerminalLog(`⚠️ Autoplay blocked: ${err.message}`);
            addTerminalLog('💡 Hint: Try clicking on the video to start playback');
          });
        }
      } catch (fallbackError: any) {
        const msg = `Fallback also failed: ${fallbackError?.message || 'unknown error'}`;
        setCameraError(msg);
        addTerminalLog(`❌ ${msg}`);
        showToast(`Could not access any camera. ${fallbackError?.message || fallbackError}`, 'error');
      }
    }
  };

  const stopCamera = () => {
    // Stop inference if running
    if (inference.isProcessing) {
      inference.toggleRealtimeInference();
    }

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

  useEffect(() => {
    if (inputSource !== 'camera') return;
    if (!currentCameraStream) return;
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    videoElement.muted = true;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    if (videoElement.srcObject !== currentCameraStream) {
      videoElement.srcObject = currentCameraStream;
    }

    const ensurePlayback = async () => {
      try {
        await videoElement.play();
      } catch (error: any) {
        addTerminalLog(`❌ Camera autoplay blocked: ${error?.message || error}`);
      }
    };

    void ensurePlayback();
  }, [addTerminalLog, currentCameraStream, inputSource]);

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

  const roisForInference = viewMode === 'inference' ? inferenceRois : rois;
  const inference = useInference({
    backendUrl: NEXT_PUBLIC_BACKEND_URL,
    inputSource,
    isOakStreaming,
    remoteCameraActive,
    remoteCameraFrame,
    rois: roisForInference,
    selectedROI,
    videoDimensions,
    videoRef,
    oakStreamRef,
    getVideoFile: () => videoFile,
    onInputSourceChange: handleInputSourceChange,
    onVideoLoaded: (file, url) => {
      setVideoFile(file);
      setVideoUrl(url);
    },
    addTerminalLog,
  });
  const isInferenceOriginalViewActive =
    viewMode === 'inference' && inferenceViewerMode === 'original';
  const isCanvasInteractive = viewMode === 'training' || isInferenceOriginalViewActive;
  const shouldShowCanvasOverlay = isCanvasInteractive;
  const canvasBackgroundAlpha = (viewMode === 'inference' && inferenceViewerMode === 'processed') ? 0.85 : 1.0;
  const activeViewerROI =
    selectedROI
      ? rois.find((roi) => roi.id === selectedROI) ?? null
      : null;

  // REMOVED AUTO-START: User must manually click "Start Inference" button
  // Inference will NOT start automatically when remote camera connects

  const handleViewModeChange = (mode: 'training' | 'inference') => {
    if (mode === viewMode) {
      return;
    }

    // Auto-close ROI palette if currently open during mode switch
    if (roiToolsVisible) {
      setRoiToolsVisible(false);
    }

    closeDropdowns();
    setActivePanel(null);
    setMobileActivePanelMenu(null);
    setShowMobileMenu(false);
    closeFullscreenPopup();
    if (mode === 'training') {
      void inference.stopInference();
    } else {
      setInferenceViewerMode('processed');
      void inference.loadModels();
      void inference.fetchLoadedModels();
    }
    setViewMode(mode);
  };

  const liveProcessedFrameNumber =
    typeof inference.liveProcessedFrameNumber === 'number'
      ? inference.liveProcessedFrameNumber
      : inference.backendVideoProcessing.currentFrame;
  const displayedProcessedFrameNumber =
    typeof inference.displayedProcessedFrameNumber === 'number'
      ? inference.displayedProcessedFrameNumber
      : liveProcessedFrameNumber;
  const inferenceSourceVisibilityClass =
    viewMode === 'inference' &&
      inferenceViewerMode === 'processed' &&
      (Boolean(inference.processedFrame) ||
        (Boolean(inference.processedVideoUrl) &&
          !processedVideoUnsupported &&
          inference.isFollowingLiveFrame))
      ? 'opacity-0'
      : 'opacity-100';
  const backendVideoStatus = inference.backendVideoProcessing.status;
  const showPersistedProcessedVideo =
    Boolean(inference.processedVideoUrl) &&
    !processedVideoUnsupported &&
    inference.isFollowingLiveFrame &&
    (backendVideoStatus === 'completed' || backendVideoStatus === 'paused');
  const showProcessedPreviewFrame =
    Boolean(inference.processedFrame) && !showPersistedProcessedVideo;
  const hasProcessedViewerContent = showPersistedProcessedVideo || showProcessedPreviewFrame;
  const hasBufferedProcessedFrames =
    liveProcessedFrameNumber > 0 ||
    displayedProcessedFrameNumber > 0 ||
    inference.bufferedProcessedFrameCount > 0 ||
    (typeof inference.displayedProcessedFrameNumber === 'number' &&
      inference.displayedProcessedFrameNumber === 0);
  const totalProcessedFramesForDisplay = Math.max(
    inference.backendVideoProcessing.totalFrames,
    liveProcessedFrameNumber,
    displayedProcessedFrameNumber,
    0
  );
  const inferenceCurrentAnomalyCount = Math.max(
    inference.inferenceStats.anomalies,
    inference.predictions.filter((prediction) => prediction.is_anomaly).length
  );
  const inferenceTotalAnomalyCount = Math.max(
    inference.inferenceStats.totalAnomalies,
    inference.backendVideoProcessing.totalAnomalies,
    inferenceCurrentAnomalyCount
  );
  const isBackendVideoInferenceActive =
    backendVideoStatus === 'processing' ||
    backendVideoStatus === 'completed' ||
    backendVideoStatus === 'paused';
  const visibleInferenceAnomalyCount = isBackendVideoInferenceActive
    ? inferenceTotalAnomalyCount
    : inferenceCurrentAnomalyCount;

  const playProcessedInferenceVideo = useCallback(() => {
    setInferenceViewerMode('processed');
    const playVideo = () => {
      const videoElement = processedInferenceVideoRef.current;
      if (!videoElement) return;
      videoElement.currentTime = 0;
      void videoElement.play().catch(() => undefined);
    };

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(playVideo);
    } else {
      playVideo();
    }
  }, []);

  useEffect(() => {
    if (viewMode !== 'inference' || inferenceViewerMode !== 'processed') {
      return;
    }

    const videoElement = processedInferenceVideoRef.current;
    if (!videoElement) return;

    // Only play if we actually have a processed video URL
    if (inference.processedVideoUrl && !processedVideoUnsupported) {
      void videoElement.play().catch(() => undefined);
    }
  }, [
    inference.processedVideoUrl,
    inferenceViewerMode,
    viewMode,
    processedVideoUnsupported,
  ]);

  const captureOriginalFrame = useCallback(() => {
    if (typeof document === 'undefined') {
      return '';
    }

    if (inputSource === 'remote' && remoteCameraFrame) {
      return remoteCameraFrame.startsWith('data:image')
        ? remoteCameraFrame
        : `data:image/jpeg;base64,${remoteCameraFrame}`;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }

    if (inputSource === 'oak' && oakStreamRef.current) {
      const image = oakStreamRef.current;
      const width = image.naturalWidth || videoDimensions.width;
      const height = image.naturalHeight || videoDimensions.height;
      if (width <= 0 || height <= 0) {
        return '';
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || videoDimensions.width;
      const height = video.videoHeight || videoDimensions.height;
      if (width <= 0 || height <= 0) {
        return '';
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    return '';
  }, [
    inputSource,
    remoteCameraFrame,
    videoDimensions.height,
    videoDimensions.width,
  ]);

  const closeFullscreenPopup = useCallback(() => {
    setShowFullscreenPopup(false);
    setIsLiveView(false);
    if (popupRefreshIntervalRef.current) {
      clearInterval(popupRefreshIntervalRef.current);
      popupRefreshIntervalRef.current = null;
    }
  }, []);

  const refreshPopupFrame = useCallback(() => {
    if (popupCurrentFrame === 'original') {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        setLastFrameUpdateTime(Date.now());
      }
      return;
    }

    if (showPersistedProcessedVideo && fullscreenVideoRef.current) {
      fullscreenVideoRef.current.currentTime = 0;
      void fullscreenVideoRef.current.play().catch(() => undefined);
      setLastFrameUpdateTime(Date.now());
      return;
    }

    if (inference.processedFrame) {
      setPopupProcessedFrame(inference.processedFrame);
      setLastFrameUpdateTime(Date.now());
    }
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    popupCurrentFrame,
    showPersistedProcessedVideo,
  ]);

  const downloadPopupFrame = useCallback(() => {
    if (popupCurrentFrame === 'processed' && showPersistedProcessedVideo) {
      inference.downloadProcessedVideo();
      return;
    }

    const frameToDownload =
      popupCurrentFrame === 'original' ? popupOriginalFrame : popupProcessedFrame;
    if (!frameToDownload || typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('a');
    link.href = frameToDownload;
    link.download = `inference_${popupCurrentFrame}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [
    inference,
    popupCurrentFrame,
    popupOriginalFrame,
    popupProcessedFrame,
    showPersistedProcessedVideo,
  ]);

  const openFullscreenPopup = useCallback(async () => {
    const originalFrame = captureOriginalFrame();
    const hasProcessedContent = Boolean(showPersistedProcessedVideo || inference.processedFrame);

    if (!originalFrame && !hasProcessedContent) {
      addTerminalLog('❌ No frames available to show in popup');
      return;
    }

    setPopupOriginalFrame(originalFrame || '');
    setPopupProcessedFrame(inference.processedFrame || '');
    setPopupCurrentFrame(hasProcessedContent ? 'processed' : 'original');
    setIsLiveView(true);
    setShowFullscreenPopup(true);
    setLastFrameUpdateTime(Date.now());

    if (showPersistedProcessedVideo) {
      setInferenceViewerMode('processed');
      window.requestAnimationFrame(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = 0;
          void fullscreenVideoRef.current.play().catch(() => undefined);
        }
      });
    }
  }, [
    addTerminalLog,
    captureOriginalFrame,
    inference.processedFrame,
    showPersistedProcessedVideo,
  ]);

  const showPreviousProcessedPopupFrame = useCallback(() => {
    const jobId = inference.backendVideoProcessing.jobId;
    const baseFrame =
      typeof displayedProcessedFrameNumber === 'number'
        ? displayedProcessedFrameNumber
        : liveProcessedFrameNumber;

    if (!jobId || typeof baseFrame !== 'number') {
      return;
    }

    setPopupCurrentFrame('processed');
    setInferenceViewerMode('processed');
    void inference.viewProcessedFrame(jobId, Math.max(0, baseFrame - 1));
  }, [
    displayedProcessedFrameNumber,
    inference,
    liveProcessedFrameNumber,
  ]);

  const showNextProcessedPopupFrame = useCallback(() => {
    const jobId = inference.backendVideoProcessing.jobId;
    const baseFrame =
      typeof displayedProcessedFrameNumber === 'number'
        ? displayedProcessedFrameNumber
        : liveProcessedFrameNumber;

    if (!jobId || typeof baseFrame !== 'number') {
      return;
    }

    setPopupCurrentFrame('processed');
    setInferenceViewerMode('processed');
    void inference.viewProcessedFrame(
      jobId,
      Math.min(liveProcessedFrameNumber, baseFrame + 1)
    );
  }, [
    displayedProcessedFrameNumber,
    inference,
    liveProcessedFrameNumber,
  ]);

  const showLiveProcessedPopupFrame = useCallback(() => {
    const jobId = inference.backendVideoProcessing.jobId;
    if (!jobId) {
      return;
    }

    setPopupCurrentFrame('processed');
    setInferenceViewerMode('processed');
    void inference.goLiveToLatestProcessedFrame(jobId);
  }, [inference, setInferenceViewerMode]);


  useEffect(() => {
    if (!showFullscreenPopup) return;

    if (popupCurrentFrame === 'processed' && inference.processedFrame && !showPersistedProcessedVideo) {
      setPopupProcessedFrame(inference.processedFrame);
      setLastFrameUpdateTime(Date.now());
    }

    if (popupCurrentFrame === 'original' && isLiveView) {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        setLastFrameUpdateTime(Date.now());
      }
    }
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    isLiveView,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (!showFullscreenPopup || popupCurrentFrame !== 'processed' || !showPersistedProcessedVideo) {
      return;
    }

    const videoElement = fullscreenVideoRef.current;
    if (!videoElement) return;

    void videoElement.play().catch(() => undefined);
  }, [
    inference.processedVideoUrl,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (!showFullscreenPopup || !isLiveView || showPersistedProcessedVideo) {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
      return;
    }

    popupRefreshIntervalRef.current = setInterval(() => {
      if (popupCurrentFrame === 'original') {
        const frame = captureOriginalFrame();
        if (frame) {
          setPopupOriginalFrame(frame);
          setLastFrameUpdateTime(Date.now());
        }
      } else if (inference.processedFrame) {
        setPopupProcessedFrame(inference.processedFrame);
        setLastFrameUpdateTime(Date.now());
      }
    }, 120);

    return () => {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
    };
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    isLiveView,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !showFullscreenPopup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeFullscreenPopup();
      } else if (event.key === 'k' || event.key === 'K') {
        setPopupCurrentFrame((prev) => (prev === 'original' ? 'processed' : 'original'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeFullscreenPopup, showFullscreenPopup]);

  useEffect(() => {
    if (!showFullscreenPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showFullscreenPopup]);

  useEffect(() => {
    if (viewMode !== 'inference') return;
    if (
      inference.backendVideoProcessing.status !== 'completed' &&
      inference.backendVideoProcessing.status !== 'paused'
    ) {
      return;
    }
    if (!inference.processedVideoUrl) return;
    playProcessedInferenceVideo();
  }, [
    inference.backendVideoProcessing.status,
    inference.processedVideoUrl,
    playProcessedInferenceVideo,
    viewMode,
  ]);
  const popupPreviousDisabled =
    popupCurrentFrame !== 'processed' ||
    inference.isStoppingBackendVideo ||
    !hasBufferedProcessedFrames ||
    displayedProcessedFrameNumber <= 0;
  const popupNextDisabled =
    popupCurrentFrame !== 'processed' ||
    inference.isStoppingBackendVideo ||
    !hasBufferedProcessedFrames ||
    displayedProcessedFrameNumber >= liveProcessedFrameNumber;
  const popupLiveDisabled =
    popupCurrentFrame !== 'processed' ||
    inference.isStoppingBackendVideo ||
    !hasBufferedProcessedFrames ||
    inference.isFollowingLiveFrame;
  // Reset video error tracking when URL changes
  useEffect(() => {
    if (inference.processedVideoUrl) {
      videoReloadAttemptsRef.current = 0;
      videoErrorCountRef.current = 0;
      setProcessedVideoUnsupported(false);
    }
  }, [inference.processedVideoUrl]);

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

      const response = await authFetch(`${backendHttpBase}/api/training/upload-video`, {
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
          `${backendHttpBase}/api/training/extraction-status/${jobId}`
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

  const handleConfirmTraining = () => {
    setShowConfirm(false);
    showToast("Training started, see logs in terminal", "success");
    setActivePanel('terminal');
    startTraining();
  };

  // Video upload handler
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (viewMode === 'inference') {
      // Keep shared training/inference video container state aligned.
      setBackendExtractionMode(false);
      setExtractionStatus('idle');
      setIsStaticFrameMode(false);
      setStaticFrameImage(null);
      setPlaybackMode('video');

      await inference.handleInferenceVideoUpload(event);
      closeDropdowns();
      event.target.value = '';
      return;
    }

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

      closeDropdowns();
      event.target.value = '';
      return;
    }

    // CASE 2: Unsupported â†’ BACKEND EXTRACTION MODE
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
        addTerminalLog(`ðŸ“¤ Auto-uploading video to backend...`);
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

    closeDropdowns();
    event.target.value = '';
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
      let width = video.videoWidth;
      let height = video.videoHeight;

      // Set duration when metadata is loaded
      if (video.duration && video.duration > 0) {
        setDuration(video.duration);
      }

      // Fallback to defaults if still 0 (will be set by onPlay event for cameras)
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

    // Apply background alpha for inference processed mode (show backend overlays)
    ctx.save();
    ctx.globalAlpha = canvasBackgroundAlpha;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Clear any remaining areas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static frame for backend mode
    if (viewMode === 'training' && backendExtractionMode && staticFrameRef.current) {
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
    ctx.strokeRect(
      offset.x,
      offset.y,
      videoDimensions.width * scale,
      videoDimensions.height * scale
    );

    // Draw ROIs conditionally - skip in inference processed mode to show backend overlays
    const roisToDraw = viewMode === 'inference' ? inferenceRois : rois;
    roisToDraw.forEach((roi, index) => {
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
  }, [
    rois,
    currentROI,
    isDrawing,
    selectedROI,
    scale,
    offset,
    videoDimensions,
    isMobile,
    backendExtractionMode,
    viewMode,
    inferenceViewerMode,
  ]);

  // Redraw when dependencies change or view mode switches
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, viewMode]);

  // Update canvas when switching back to training mode
  useEffect(() => {
    if (viewMode === 'training') {
      updateCanvasDimensions();
      // Ensure video stays paused when entering training mode (preserve stopped state from ROI drawing)
      if (videoRef.current && inputSource === 'upload') {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [viewMode, updateCanvasDimensions, inputSource]);

  // Ensure video plays non-stop in inference mode only
  useEffect(() => {
    if (viewMode === 'inference' && videoRef.current && inputSource === 'upload') {
      // Resume video playback when entering inference mode
      void videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [viewMode, inputSource]);

  const hoveredROIData = hoveredROI ? rois.find((roi) => roi.id === hoveredROI) ?? null : null;
  const showLegacyHoverOverlay = false;

  const clearTooltipHideTimeout = useCallback(() => {
    if (tooltipHideTimeoutRef.current) {
      clearTimeout(tooltipHideTimeoutRef.current);
      tooltipHideTimeoutRef.current = null;
    }
  }, []);

  const scheduleTooltipHide = useCallback((delay = 220) => {
    clearTooltipHideTimeout();
    tooltipHideTimeoutRef.current = setTimeout(() => {
      tooltipHideTimeoutRef.current = null;
      if (!tooltipHoveredRef.current) {
        setHoveredROI(null);
      }
    }, delay);
  }, [clearTooltipHideTimeout]);

  const getROIBoundsInContainer = useCallback((roi: ROI) => {
    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      const x = Math.min(p1.x, p2.x) * scale + offset.x;
      const y = Math.min(p1.y, p2.y) * scale + offset.y;
      const width = Math.abs(p2.x - p1.x) * scale;
      const height = Math.abs(p2.y - p1.y) * scale;
      return { x, y, width: Math.max(width, 1), height: Math.max(height, 1) };
    }

    if (roi.points.length === 0) {
      return { x: offset.x, y: offset.y, width: 1, height: 1 };
    }

    const xs = roi.points.map((point) => point.x);
    const ys = roi.points.map((point) => point.y);
    const minX = Math.min(...xs) * scale + offset.x;
    const minY = Math.min(...ys) * scale + offset.y;
    const maxX = Math.max(...xs) * scale + offset.x;
    const maxY = Math.max(...ys) * scale + offset.y;

    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1)
    };
  }, [scale, offset]);

  const updateTooltipPosition = useCallback(() => {
    if (!hoveredROIData || !containerRef.current || !tooltipRef.current || viewMode !== 'training') {
      setTooltipPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const roiBounds = getROIBoundsInContainer(hoveredROIData);
    const roiRect = {
      left: containerRect.left + roiBounds.x,
      top: containerRect.top + roiBounds.y,
      right: containerRect.left + roiBounds.x + roiBounds.width,
      bottom: containerRect.top + roiBounds.y + roiBounds.height,
      width: roiBounds.width,
      height: roiBounds.height
    };
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    const viewportPadding = 8;
    const gap = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const candidates = [
      {
        left: roiRect.right + gap,
        top: roiRect.top + (roiRect.height - tooltipHeight) / 2
      },
      {
        left: roiRect.left - tooltipWidth - gap,
        top: roiRect.top + (roiRect.height - tooltipHeight) / 2
      },
      {
        left: roiRect.left + (roiRect.width - tooltipWidth) / 2,
        top: roiRect.bottom + gap
      },
      {
        left: roiRect.left + (roiRect.width - tooltipWidth) / 2,
        top: roiRect.top - tooltipHeight - gap
      }
    ];

    const fitsViewport = (candidate: { left: number; top: number }) => (
      candidate.left >= viewportPadding &&
      candidate.top >= viewportPadding &&
      candidate.left + tooltipWidth <= viewportWidth - viewportPadding &&
      candidate.top + tooltipHeight <= viewportHeight - viewportPadding
    );

    const viewportOverflow = (candidate: { left: number; top: number }) => {
      const leftOverflow = Math.max(viewportPadding - candidate.left, 0);
      const topOverflow = Math.max(viewportPadding - candidate.top, 0);
      const rightOverflow = Math.max(candidate.left + tooltipWidth - (viewportWidth - viewportPadding), 0);
      const bottomOverflow = Math.max(candidate.top + tooltipHeight - (viewportHeight - viewportPadding), 0);
      return leftOverflow + topOverflow + rightOverflow + bottomOverflow;
    };

    const chosenCandidate = candidates.find(fitsViewport) ??
      candidates.reduce((best, current) => (
        viewportOverflow(current) < viewportOverflow(best) ? current : best
      ));

    const clampedLeft = Math.min(
      Math.max(chosenCandidate.left, viewportPadding),
      Math.max(viewportPadding, viewportWidth - tooltipWidth - viewportPadding)
    );
    const clampedTop = Math.min(
      Math.max(chosenCandidate.top, viewportPadding),
      Math.max(viewportPadding, viewportHeight - tooltipHeight - viewportPadding)
    );

    setTooltipPosition({ left: clampedLeft, top: clampedTop, visible: true });
  }, [hoveredROIData, getROIBoundsInContainer, viewMode]);

  useEffect(() => {
    if (!hoveredROIData || viewMode !== 'training') {
      setTooltipPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const frame = window.requestAnimationFrame(updateTooltipPosition);
    const handleViewportChange = () => updateTooltipPosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [hoveredROIData, updateTooltipPosition, viewMode]);

  useEffect(() => () => clearTooltipHideTimeout(), [clearTooltipHideTimeout]);

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
    if (inputSource === 'remote' && remoteVideoRef.current) {
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

  const commitROI = useCallback((roi: ROI) => {
    if (viewMode === 'training') {
      setRois((prev) => [...prev, roi]);
    } else {
      setInferenceRois((prev) => [...prev, roi]);
    }
    setSelectedROI(roi.id);

    if (viewMode === 'training') {
      addTerminalLog(
        roi.type === 'rectangle'
          ? `✓ Created ROI: ${roi.label} (${roi.type}) | Training: ${roi.training.join(', ')}`
          : `✓ Created Polygon ROI: ${roi.label} with ${roi.points.length} points | Training: ${roi.training.join(', ')}`
      );
      return;
    }

    setDrawingMode('select');
    addTerminalLog(
      roi.type === 'rectangle'
        ? `✓ Inference ROI ready: ${roi.label} (${roi.type})`
        : `✓ Inference ROI ready: ${roi.label} (${roi.points.length} points)`
    );
  }, [addTerminalLog, viewMode]);

  const completeROISetup = useCallback((roi: ROI) => {
    if (viewMode === 'training') {
      setPendingROI(roi);
      setTimeout(() => setIsOpen(true), 300);
      return;
    }

    commitROI(roi);
  }, [commitROI, viewMode]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const videoCoords = getVideoCoordinates(event.clientX, event.clientY);

    if (drawingMode === 'rectangle') {
      if (!isDrawing) {
        const targetRois = viewMode === 'training' ? rois : inferenceRois;
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'rectangle',
          points: [videoCoords, videoCoords],
          label: `ROI ${targetRois.length + 1}`,
          color: roiColors[targetRois.length % roiColors.length],
          training: []
        };

        setCurrentROI(newROI);
        setIsDrawing(true);
      } else if (currentROI && currentROI.type === 'rectangle') {
        const updatedPoints = [...currentROI.points];
        updatedPoints[1] = videoCoords;
        const updatedROI = { ...currentROI, points: updatedPoints };

        // Instead of committing immediately:
        completeROISetup(updatedROI);
        setCurrentROI(null);
        setIsDrawing(false);
        // else if (currentROI && currentROI.type === 'rectangle') {
        //         const updatedPoints = [...currentROI.points];
        //         updatedPoints[1] = videoCoords;
        //         const updatedROI = { ...currentROI, points: updatedPoints };
        //         setRois(prev => [...prev, updatedROI]);
        //         setCurrentROI(null);
        //         setIsDrawing(false);
        //         setSelectedROI(updatedROI.id);
        //         addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
      }
    } else if (drawingMode === 'polygon') {
      if (!currentROI) {
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'polygon',
          points: [videoCoords],
          label: `ROI ${rois.length + 1}`,
          color: roiColors[rois.length % roiColors.length],
          training: []//here I have to pass the selected training 

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
            training: []
          };
          setCurrentROI(newROI);
          setIsDrawing(true);
        } else if (currentROI && currentROI.type === 'rectangle') {
          const updatedPoints = [...currentROI.points];
          updatedPoints[1] = videoCoords;
          const updatedROI = { ...currentROI, points: updatedPoints };
          completeROISetup(updatedROI);
          setCurrentROI(null);
          setIsDrawing(false);

          // setRois(prev => [...prev, updatedROI]);
          // setCurrentROI(null);
          // setIsDrawing(false);
          // setSelectedROI(updatedROI.id);
          // addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
        }
      } else if (drawingMode === 'polygon') {
        if (!currentROI) {
          const newROI: ROI = {
            id: `roi_${Date.now()}`,
            type: 'polygon',
            points: [videoCoords],
            label: `ROI ${rois.length + 1}`,
            color: roiColors[rois.length % roiColors.length],
            training: []
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
  // --- Interaction Logic ---
  const getVideoCoords = (clientX: number, clientY: number): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale
    };
  };
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getVideoCoords(event.clientX, event.clientY);

    // Hover detection
    let foundHover: string | null = null;
    for (let i = rois.length - 1; i >= 0; i--) {
      if (isPointInROI(coords, rois[i])) {
        foundHover = rois[i].id;
        break;
      }
    }
    if (foundHover) {
      clearTooltipHideTimeout();
      if (hoveredROI !== foundHover) {
        setHoveredROI(foundHover);
      }
    } else if (!tooltipHoveredRef.current && hoveredROI && !tooltipHideTimeoutRef.current) {
      scheduleTooltipHide();
    }
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
      completeROISetup(finalROI);
      setCurrentROI(null);
      setIsDrawing(false);
      // addTerminalLog(`✓ Polygon complete: ${finalROI.label} (${points.length} points) – select training types`);
    }
  };

  // ROI management
  const addNewROI = (type: 'rectangle' | 'polygon') => {
    if (viewMode === 'inference') {
      setInferenceViewerMode('original');
    }
    setDrawingMode(type);

    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentROI(null);
    setIsDrawing(false);
    addTerminalLog(`Drawing mode set to: ${type}`);
  };

  const clearAllROIs = () => {
    setRois([]);
    setSelectedROI(null);
    setHoveredROI(null);
    setCurrentROI(null);
    setIsDrawing(false);
    addTerminalLog('Cleared all ROIs');
  };

  const deleteROI = (id: string) => {
    const roiToDelete = rois.find(roi => roi.id === id);
    setRois(prev => prev.filter(roi => roi.id !== id));
    if (selectedROI === id) {
      setSelectedROI(null);
    }
    if (hoveredROI === id) {
      setHoveredROI(null);
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

    // For remote camera, include session ID in source_type for proper path organization
    let source_type = 'browser';
    if (inputSource === 'camera' || inputSource === 'oak') {
      source_type = 'live_camera';
    } else if (inputSource === 'remote' && sessionName) {
      source_type = `remote_${sessionName}`;
    }
    formData.append('source_type', source_type);

    try {
      const response = await authFetch(`${backendHttpBase}/api/training/full-frame`, {
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
        setLastSaveStatus(`❌  Failed to save full frame ${frameNumber}`);
      }
    } catch (error) {
      console.error('Error sending full frame:', error);
      setLastSaveStatus(`❌  Error sending full frame ${frameNumber}`);
    }
  };

  const captureROIArea = async (x: number, y: number, width: number, height: number, roi: ROI, frameNumber: number) => {
    const captureCanvas = captureCanvasRef.current;
    const captureCtx = captureCanvas?.getContext('2d');

    if (!captureCanvas || !captureCtx) {
      console.error('Capture canvas not available');
      addTerminalLog('❌  Capture canvas not available');
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

    // For remote camera, include session ID in source_type for proper path organization
    let source_type = 'browser';
    if (inputSource === 'camera' || inputSource === 'oak') {
      source_type = 'live_camera';
    } else if (inputSource === 'remote' && sessionName) {
      source_type = `remote_${sessionName}`;
    }
    formData.append('source_type', source_type);

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
      const response = await authFetch(`${backendHttpBase}/api/training/frames/`, {
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
    // Choose ws/wss based on current page protocol
    const wsUrl = `${backendWsBase}/api/training/ws/${trainingId}`;

    console.log('Connecting to WebSocket:', wsUrl);

    let attempts = 0;
    const maxAttempts = 5;

    let ws: WebSocket | null = null;
    let connectionTimeout: ReturnType<typeof setTimeout> | null = null;

    const create = () => {
      attempts += 1;
      try {
        ws = new WebSocket(wsUrl);
      } catch (err) {
        console.error('Failed to construct WebSocket:', err);
        addTerminalLog('❌ Failed to create WebSocket.');
        scheduleReconnect();
        return;
      }

      connectionTimeout = setTimeout(() => {
        if (ws && ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          try { ws.close(); } catch (_) { }
          addTerminalLog('❌ WebSocket connection timeout. Please check your connection.');
        }
      }, 5000);

      ws.onopen = () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        attempts = 0;
        addTerminalLog('✓ Connected to training WebSocket');
        setTrainingWebSocket(ws);
      };

      ws.onmessage = (event) => {
        // Keep the log here for debugging
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'log') {
            addTerminalLog(data.message);
          } else if (data.type === 'status_update') {
            console.log('Training status update:', data);
            if (data.status === 'completed') {
              setTrainingStatus('completed');
              void inference.loadModels();
              addTerminalLog('✓ Training completed successfully!');
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

      ws.onerror = (event) => {
        console.error('WebSocket error event:', event);
        addTerminalLog('❌ WebSocket connection error');
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      ws.onclose = (event) => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        const timestamp = new Date().toLocaleTimeString();
        addTerminalLog(`${timestamp} - WebSocket disconnected (code ${event.code})`);
        console.log('WebSocket closed:', event.code, event.reason);
        // Try to reconnect with backoff
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (attempts >= maxAttempts) {
        addTerminalLog('❌ WebSocket reconnection failed after multiple attempts.');
        return;
      }

      const backoff = Math.min(30000, 1000 * 2 ** attempts);
      addTerminalLog(`↻ Attempting WebSocket reconnect in ${Math.round(backoff / 1000)}s (attempt ${attempts + 1}/${maxAttempts})`);
      setTimeout(() => {
        create();
      }, backoff);
    };

    create();
    return ws;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Validate input source
      if (inputSource === 'remote' && !isRemoteCameraReady()) {
        showToast('Remote camera not connected or no frame available', "warning");
        return;
      }
      if (
        inputSource === 'upload' &&
        !backendExtractionMode &&
        (!videoUrl || !videoRef.current?.videoWidth)
      ) {
        showToast("Please upload a video first", "warning")
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        showToast('Please start OAK camera first', "warning");
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        showToast('Please connect remote camera first', "warning");
        return;
      }

      setIsRecording(true);
      recordingRef.current = true;
      setRecordingProgress(0);
      setCaptureCount(0);

      const isLiveSource = inputSource === 'camera' || inputSource === 'oak' || inputSource === 'remote';
      if (isLiveSource) {
        setRemainingTime(-1); // indefinite until stop
      } else {
        setRemainingTime(recordingDuration);
      }

      addTerminalLog(`=== Starting Recording ===`);
      addTerminalLog(`Session: ${sessionName}`);
      addTerminalLog(`Duration: ${isLiveSource ? 'Live (manual stop)' : `${recordingDuration} seconds`}`);
      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`ROIs: ${rois.length} (${rois.length === 0 ? 'Full Frame mode' : 'ROI mode'})`);
      addTerminalLog(`========================`);

      const runRecording = async () => {
        let i = 0;
        const totalFrames = recordingDuration * frameRate;

        while (recordingRef.current && (isLiveSource ? true : i < totalFrames)) {
          await captureFrame(i);

          i += 1;
          setCaptureCount(i);

          if (!isLiveSource) {
            setRecordingProgress((i / totalFrames) * 100);
          } else {
            setRecordingProgress((i % frameRate) / frameRate * 100);
          }

          await new Promise(res => setTimeout(res, 1000 / frameRate));
        }

        recordingRef.current = false;
        setIsRecording(false);
        addTerminalLog(`✓ ${isLiveSource ? 'Live recording stopped' : 'Recording completed'}. Captured ${i} frames.`);
      };

      runRecording();

      if (!isLiveSource) {
        const timer = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              recordingRef.current = false;
              setIsRecording(false);
              addTerminalLog(`✓ Recording completed. Captured ${captureCount} frames.`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setRecordingTimer(timer);
      } else {
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }
      }

    } else {
      // Stop recording
      setIsRecording(false);
      recordingRef.current = false;

      // Clear any active interval used for remote/live
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
          showToast('Please wait for backend frame extraction to complete before starting training.', 'warning');
          setShowUpload(false);
          return;
        } else if (extractionStatus === 'idle' || extractionStatus === 'failed' || extractionStatus === 'uploading') {
          addTerminalLog(`❌ Backend frame extraction not completed or failed`);
          showToast('Please complete backend frame extraction first or try uploading the video again.', 'warning');
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
        showToast('Please load a video first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        addTerminalLog(`❌ ERROR: Please start OAK camera first`);
        showToast('Please start OAK camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        addTerminalLog(`❌ ERROR: Please connect remote camera first`);
        showToast('Please connect remote camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'camera' && !currentCameraStream) {
        addTerminalLog(`❌ ERROR: Please start camera first`);
        showToast('Please start camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (!recordingDuration || recordingDuration <= 0) {
        addTerminalLog(`❌Training cancelled: Invalid duration`);
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
        trainingRef.current = true; // Allow training to proceed

        for (let i = 0; i < totalFrames; i++) {
          // Check if training was stopped externally
          if (!trainingRef.current) {
            addTerminalLog(`⏹ Training stopped at frame ${i}/${totalFrames}`);
            setIsCapturingTrainingFrames(false);
            return; // Exit early
          }

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
        const response = await authFetch(`${backendHttpBase}/api/sessions/${sessionName}/frame-count`);
        if (response.ok) {
          const data = await response.json();
          const totalSavedFrames = data.total_frames || 0;
          addTerminalLog(`✓ ${totalSavedFrames} frames saved successfully`);

          if (totalSavedFrames === 0) {
            addTerminalLog(`❌  ERROR: No frames were saved. Check backend connection.`);
            showToast('No frames were saved. Please check backend connection and try again.', 'error');
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

      const trainingOptions = getSelectedTrainingOptions();

      if (trainingOptions.length === 0) {
        trainingOptions.push("anomaly");
        addTerminalLog("⚠ No training type selected, defaulting to Anomaly Training");
      }

      addTerminalLog(`📊  Selected Training Types: ${trainingOptions.join(", ")}`);

      const response = await authFetch(`${backendHttpBase}/api/training/start/`, {
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
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('mint:last-training-model-id', result.training_id);
        }
        addTerminalLog(`Status: ${result.status}`);
        addTerminalLog(`Training Types: ${result.details?.training_options?.join(', ') || 'Anomaly'}`);

        if (result.details) {
          addTerminalLog(`Total frames: ${result.details.total_frames || 0}`);
          if (result.details.frames_by_roi) {
            Object.entries(result.details.frames_by_roi).forEach(([roiId, info]: [string, any]) => {
              if (info.frames > 0) {
                addTerminalLog(` ROI ${info.label}: ${info.frames} frames`);
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
        setActivePanel('terminal');
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
        showToast(`Failed to start training: ${errorMessage}`, 'error');
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      addTerminalLog(`❌ ERROR: Error in training process: ${error}`);
      showToast('Error in training process', 'error');
      setShowUpload(false);
    }
  };

  // STOP TRAINING FUNCTION: Interrupt ongoing training process
  const stopTraining = () => {
    trainingRef.current = false; // Signal to training loop to stop
    setIsCapturingTrainingFrames(false); // Reset state immediately
    addTerminalLog(`⏹ Training stopped`);
    showToast('Training stopped', 'warning');
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

      const response = await authFetch(`${backendHttpBase}/api/training/full-frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        addTerminalLog(`â†‘ Uploaded full frame ${frameNumber} from canvas`);
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

          const response = await authFetch(`${backendHttpBase}/api/training/frames/`, {
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
      const response = await authFetch(`${backendHttpBase}/api/health`, { skipAuth: true });
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
      const response = await authFetch(`${backendHttpBase}/api/health/`, { skipAuth: true });
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
  };;

  const clearTerminalLogs = () => {
    setTerminalLogs([]);
    setTrainingLogs([]);

  };

  const testCapture = async () => {
    addTerminalLog('Testing frame capture...');
    await captureFrame(0);
    addTerminalLog('✓ Test capture completed');
    showToast('Test capture completed', 'success');
  };

  const checkDatasets = async () => {
    try {
      const response = await authFetch(`${backendHttpBase}/api/datasets`);
      const data = await response.json();
      console.log('Datasets:', data);
      addTerminalLog(`Found ${data.datasets?.length || 0} datasets`);
      showToast(`Found ${data.datasets?.length || 0} datasets on server`, 'success');
    } catch (error) {
      console.error('Failed to list datasets:', error);
      addTerminalLog(`❌ Error checking datasets: ${error}`);
      showToast(`Error checking datasets: ${error}`, 'error');
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



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = inference.models.find(
    (m) => m.id === inference.selectedModel
  );

  const getLabel = (model: InferenceModel) => {
    const types = (
      Array.isArray(model.training_options) && model.training_options.length > 0
        ? model.training_options
        : model.model_types || []
    ).join(' + ') || 'Unknown';

    const label = model.display_name || model.name || model.id;

    // ✅ NO truncation — full text
    return `${label} [${types}]`;
  };
  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 't':
          handleViewModeChange('training');
          break;
        case 'i':
          handleViewModeChange('inference');
          break;
        case 'r':
          if (viewMode === 'training') addNewROI('rectangle');
          break;
        case 'p':
          if (viewMode === 'training') addNewROI('polygon');
          break;
        case 's':
          if (viewMode === 'training') {
            setDrawingMode('select');
            setCurrentROI(null);
            setIsDrawing(false);
          }
          break;
        case ' ':
          e.preventDefault();
          if (viewMode === 'training') {
            const canRecord = !((inputSource === 'camera' && !currentCameraStream) || (inputSource === 'oak' && !isOakStreaming) || (inputSource === 'remote' && remoteCameraStatus !== 'connected'));
            if (canRecord) toggleRecording();
          }
          break;
        case 'escape':
          setActivePanel(null);
          setOpenDropdown(null);
          setMobileActivePanelMenu(null);
          setShowMobileMenu(false);
          setCollapsedSections({
            inputSource: false,
            trainingTypes: false,
            roiTools: false,
            backendExtraction: false,
            recordingSettings: false,
            sessionInfo: false,
            debugTools: false,
          });
          break;
        case 'delete':
        case 'backspace':
          if (selectedROI) {
            deleteROI(selectedROI);
          }
          break;
        case '`':
          togglePanel('terminal');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedROI, togglePanel, inputSource, currentCameraStream, isOakStreaming, remoteCameraStatus]);


  type User = {
    id: string
    name: string
    email: string
  }

  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    authFetch(`${backendHttpBase}/api/auth/me`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setIsLoggedIn(true)
      })
      .catch(() => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
      })
  }, [])

  const Header = () => (
    <header className={`shrink-0 min-h-[3.75rem] md:h-12 ${ds.colors.surfaceBlur} border-b ${ds.colors.borderSubtle} flex flex-col md:flex-row items-center justify-between z-50 px-3 sm:px-4 md:px-6 py-2 md:py-0`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 shadow-lg shadow-blue-500/10`}>
            {/* <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-white" /> */}
            <img
              src="/1. E only.png"   // path relative to /public
              alt="Logo"
              width={20}             // adjust to fit
              height={20}
              className="w-4 sm:w-5 h-4 sm:h-5"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-blue-500 uppercase">MINT</span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-zinc-500 uppercase opacity-70">Vision Intelligence</span>
          </div>
        </div>

        {/* Mobile Menu Toggle + Status Bar */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Status & User - Always visible on mobile */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${backendConnected
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
                }`}
              title={backendConnected ? 'Backend connected' : 'Backend offline'}
            >
              {backendConnected ? <CloudCheck className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="mb-2 px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
                        {isLoggedIn ? user?.name : 'Guest'}
                      </div>
                      {!isLoggedIn ? (
                        <>
                          <Link
                            href="/auth"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            Sign In
                          </Link>
                          <Link
                            href="/auth"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Plus className="w-4 h-4" />
                            Sign Up
                          </Link>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            localStorage.removeItem("access_token")
                            setUser(null)
                            setIsLoggedIn(false)
                            setShowProfileMenu(false)
                            router.push("/auth")
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                        >
                          <Power className="w-4 h-4" />
                          Log Out
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Menu Toggle */}
          <button
            onClick={() => toggleMobilePanelMenu('menu')}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation - Hidden on mobile, shown on sm and up */}
      <nav className="hidden md:flex gap-4 md:gap-8">
        {(['training', 'inference'] as const).map((mode) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => {
                handleViewModeChange(mode);
                setShowMobileMenu(false);
              }}
              className={`relative flex flex-col items-center px-1 py-1 text-xs md:text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${active ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <span>{mode}</span>
              <span className="mt-0.5 md:mt-1 h-0.5 w-6 md:w-10 rounded-full bg-transparent">
                {active && (
                  <motion.span
                    layoutId="mint-header-tab"
                    className="block h-full w-full rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Section - Status & Profile (Desktop/Tablet only) */}
      <div className="hidden md:flex items-center gap-3 md:gap-6">
        <div className="w-px h-3 md:h-4 bg-zinc-800" />
        <div
          className={`flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full border ${backendConnected
            ? 'bg-green-500/20 border-none text-green-400'
            : 'bg-red-500/20 border-none text-red-400'
            }`}
          title={backendConnected ? 'Backend connected' : 'Backend offline'}
        >
          {backendConnected ? <CloudCheck className="w-4 md:w-5 h-4 md:h-5" /> : <CloudOff className="w-4 md:w-5 h-4 md:h-5" />}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 group"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-300">{isLoggedIn ? user?.name : "Guest"}</span>
              <span className="text-[8px] text-blue-500/70 font-mono">v2.0.4</span>
            </div>
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <User className="w-3.5 md:w-4 h-3.5 md:h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Plus className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token")
                        setUser(null)
                        setIsLoggedIn(false)
                        setShowProfileMenu(false)
                        router.push("/auth")
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <Power className="w-4 h-4" />
                      Log Out
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu - Shown on mobile when toggled (NAVIGATION ONLY) */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full md:hidden mt-2 pt-2 border-t border-white/10"
          >
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-1">
              {(['training', 'inference'] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      handleViewModeChange(mode);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-white/5'
                      }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  const mobilePanelTitle = (() => {
    switch (mobileActivePanelMenu) {
      case 'controls':
        return 'Training Settings';
      case 'menu':
        return viewMode === 'training' ? 'Training Menu' : 'Inference Menu';
      case 'sources':
        return 'Camera Sources';
      case 'training-model':
        return 'Training Model';
      case 'terminal':
        return 'Terminal Output';
      case 'instructions':
        return 'Guide';
      case 'projects':
        return 'Projects';
      case 'tools':
        return 'Tools';
      case 'recording':
        return 'Recording Settings';
      case 'roi':
        return 'ROI Tools';
      case 'inference':
        return 'Inference Control';
      case 'model':
        return 'Model Selection';
      default:
        return 'Mobile Tools';
    }
  })();

  const renderMobilePanelContent = () => {
    switch (mobileActivePanelMenu) {
      case 'menu':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/5 p-1">
              {(['training', 'inference'] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleViewModeChange(mode)}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${active
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {viewMode === 'training' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('sources')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('sources')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('roi')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Target className="h-4 w-4" />
                    ROIs
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('training-model')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Cpu className="h-4 w-4" />
                    Training Model
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('recording')}
                    className={`${buttonPrimary} !h-12 !justify-start w-full px-3 text-[10px] col-span-2`}
                  >
                    <Settings2 className="h-4 w-4" />
                    Recording Settings
                  </button>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-[11px] text-zinc-400">
                  Training mode keeps the menu focused on source setup, ROI editing, recording, and model prep.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('sources')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Camera className="h-4 w-4" />
                    Camera Options
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('model')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Sliders className="h-4 w-4" />
                    Model Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('inference')}
                    className={`${buttonPrimary} !h-12 !justify-start w-full px-3 text-[10px] col-span-2`}
                  >
                    <Zap className="h-4 w-4" />
                    Inference Control
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('terminal')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Terminal className="h-4 w-4" />
                    Terminal
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActivePanelMenu('instructions')}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Instruction
                  </button>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-[11px] text-zinc-400">
                  Inference mode keeps the menu focused on camera options, model selection, runtime control, terminal, and instructions.
                </div>
              </div>
            )}
          </div>
        );

      case 'sources':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-black/30 p-3">


              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    handleInputSourceChange('upload');
                    setMobileActivePanelMenu(null);
                    fileInputRef.current?.click();
                  }}
                  className={`${buttonPrimary} !h-12 w-full text-[9px]`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Video
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const cameras = await listAvailableCameras();
                    const nextCameraId = selectedCameraId || cameras[0]?.deviceId;
                    if (nextCameraId) {
                      await startCamera(nextCameraId);
                    } else {
                      await startCamera();
                    }
                    setMobileActivePanelMenu(null);
                  }}
                  disabled={!backendConnected}
                  className={`${buttonSecondary} !h-12 w-full text-[9px] ${!backendConnected ? 'opacity-60' : ''}`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  Live Camera
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    handleInputSourceChange('oak');
                    await startOakCamera();
                    setMobileActivePanelMenu(null);
                  }}
                  disabled={!backendConnected}
                  className={`${buttonSecondary} !h-12 w-full text-[9px] ${!backendConnected ? 'opacity-60' : ''}`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  Neuron Camera
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleInputSourceChange('remote');
                    startRemoteCameraSession();
                    setMobileActivePanelMenu(null);
                  }}
                  disabled={!backendConnected}
                  className={`${buttonSecondary} !h-12 w-full text-[9px] ${!backendConnected ? 'opacity-60' : ''}`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Remote Stream
                </button>
              </div>
            </div>

            {/* <div className="rounded-2xl border border-white/5 bg-white/5 p-3">


              {availableCameras.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Camera Options</span>
                    <span className="font-mono text-blue-400">{availableCameras.length}</span>
                  </div>
                  <div className="max-h-32 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                    {availableCameras.map((camera, index) => (
                      <button
                        key={camera.deviceId}
                        type="button"
                        onClick={async () => {
                          setSelectedCameraId(camera.deviceId);
                          await startCamera(camera.deviceId);
                          setMobileActivePanelMenu(null);
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-[11px] transition-all ${selectedCameraId === camera.deviceId
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                          : 'border-white/5 bg-black/20 text-zinc-300 hover:border-white/10 hover:bg-white/5'
                          }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {camera.label || `Camera ${index + 1}`}
                          </div>
                          <div className="truncate text-[10px] text-zinc-500">
                            {camera.deviceId}
                          </div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Use
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!backendConnected && (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                  Connect the backend before using live, neuron or remote camera sources.
                </div>
              )}
            </div> */}
          </div>
        );

      case 'training-model':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-black/30 p-3">


              <div className="space-y-2 text-[11px] text-zinc-400">


                <div className="flex items-center justify-between gap-3">
                  <span className="uppercase tracking-widest text-zinc-500">Session</span>
                  <span className="truncate text-right text-zinc-200">{sessionName}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setTrainingTypes((prev) => ({ ...prev, anomaly: !prev.anomaly }))}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${trainingTypes.anomaly ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
              >
                <Bug className="h-4 w-4" />
                Anomaly Detection
              </button>
              <button
                type="button"
                onClick={() => setTrainingTypes((prev) => ({ ...prev, sequential: !prev.sequential }))}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${trainingTypes.sequential ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
              >
                <Workflow className="h-4 w-4" />
                Sequential Analysis
              </button>
              <button
                type="button"
                onClick={() => setTrainingTypes((prev) => ({ ...prev, motion: !prev.motion }))}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${trainingTypes.motion ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
              >
                <Crosshair className="h-4 w-4" />
                Motion Tracking
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMobileActivePanelMenu('roi')}
                className={`${buttonSecondary} !h-11 w-full text-[9px]`}
              >
                <Target className="h-3.5 w-3.5" />
                ROI Tools
              </button>
              <button
                type="button"
                onClick={() => setMobileActivePanelMenu('recording')}
                className={`${buttonSecondary} !h-11 w-full text-[9px]`}
              >
                <Settings2 className="h-3.5 w-3.5" />
                Recording
              </button>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/5 p-1">
              {(['training', 'inference'] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleViewModeChange(mode)}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${active
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 rounded-2xl border border-white/5 bg-black/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Session
                </span>
                <span className="font-mono text-[10px] text-blue-400">{sessionName}</span>
              </div>

              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white outline-none transition-all focus:border-blue-500/60"
              />

              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Source</div>
                  <div className="mt-1 font-semibold text-zinc-200 capitalize">{inputSource}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Backend</div>
                  <div className="mt-1 font-semibold text-zinc-200">
                    {backendConnected ? 'Connected' : 'Offline'}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Recording</div>
                  <div className="mt-1 font-semibold text-zinc-200">
                    {isRecording ? 'Live' : 'Ready'}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Mode</div>
                  <div className="mt-1 font-semibold text-zinc-200 capitalize">{viewMode}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMobileActivePanelMenu('terminal')}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
              >
                <Terminal className="h-4 w-4" />
                Terminal
              </button>
              <button
                type="button"
                onClick={() => setMobileActivePanelMenu('instructions')}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
              >
                <HelpCircle className="h-4 w-4" />
                Guide
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-[11px] text-zinc-400">
              Open the tool rail below for source, ROI, recording and model shortcuts.
            </div>
          </div>
        );

      case 'recording':
        return (
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-white/5 bg-black/30 p-3">

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Frame Rate</span>
                    <span className="font-mono text-blue-400">{frameRate} FPS</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={frameRate}
                    onChange={(e) => setFrameRate(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-full bg-neutral-700 accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Duration</span>
                    <span className="font-mono text-blue-400">{recordingDuration}s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={recordingDuration}
                    onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-full bg-neutral-700 accent-blue-500"
                  />
                </div>

                {isRecording && (
                  <div className="space-y-1 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                        Recording
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">{captureCount} frames</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/30">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, ((recordingDuration - remainingTime) / recordingDuration) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-white/5 bg-neutral-950/95 pt-3">
              <button
                type="button"
                onClick={toggleRecording}
                disabled={
                  !inputSource ||
                  (inputSource === 'camera' && !currentCameraStream) ||
                  (inputSource === 'oak' && !isOakStreaming) ||
                  (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                }
                className={`${buttonPrimary} !h-11 w-full text-[9px]`}
              >
                <Radio className="h-3.5 w-3.5" />
                {isRecording ? `Stop REC (${remainingTime}s)` : 'Start Recording'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isCapturingTrainingFrames) {
                    stopTraining();
                  } else {
                    const hasSourceReady = videoFile || videoUrl || currentCameraStream || isOakStreaming || remoteCameraActive || backendExtractionMode;
                    if (!hasSourceReady) {
                      showToast("Please select a video or start camera first", "warning");
                      return;
                    }
                    setShowConfirm(true);
                  }
                }}
                disabled={isCapturingTrainingFrames ? false : !backendConnected}
                className={`flex w-full items-center justify-center gap-2 rounded-md border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all md:w-auto md:px-3 md:py-1.5 md:text-[10px] ${isCapturingTrainingFrames
                  ? 'bg-red-600/80 border-red-500/40 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                  : !backendConnected
                    ? 'bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed'
                    : 'bg-zinc-800/80 border-white/10 text-zinc-100 hover:bg-zinc-700/80'
                  }`}
              >
                {isCapturingTrainingFrames ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    Stop Training
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5" />
                    Start Training
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'roi':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-black/30 p-3">


              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawingMode('select');
                    setCurrentROI(null);
                    setIsDrawing(false);
                  }}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${drawingMode === 'select' ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
                >
                  <MousePointer className="h-4 w-4" />
                  Select
                </button>
                <button
                  type="button"
                  onClick={() => addNewROI('rectangle')}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${drawingMode === 'rectangle' ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
                >
                  <Square className="h-4 w-4" />
                  Rectangle
                </button>
                <button
                  type="button"
                  onClick={() => addNewROI('polygon')}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${drawingMode === 'polygon' ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : ''}`}
                >
                  <Hexagon className="h-4 w-4" />
                  Polygon
                </button>
                <button
                  type="button"
                  onClick={clearAllROIs}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] text-rose-300`}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>

              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-zinc-400 mt-2">
                {viewMode === 'training'
                  ? `Active ROIs: ${rois.length}`
                  : isInferenceOriginalViewActive
                    ? inference.hasRuntimeInferenceRois
                      ? `Inference output is limited to ${activeViewerROI?.label || inference.activeInferenceRoiLabel || `${rois.length} ROI${rois.length === 1 ? '' : 's'}`}`
                      : rois.length > 0
                        ? `Full-frame inference with ${rois.length} ROI overlay${rois.length === 1 ? '' : 's'}`
                        : 'Full-frame inference. Draw an ROI on the original feed to add overlays.'
                    : 'Switch to Original view to draw or adjust ROI overlays.'}
              </div>
              {drawingMode === 'polygon' && isDrawing && (
                <button
                  type="button"
                  onClick={finishPolygon}
                  className={`${buttonPrimary} mt-3 !h-11 w-full text-[9px]`}
                >
                  <Check className="h-3.5 w-3.5" />
                  Finish Polygon
                </button>
              )}


            </div>

          </div>
        );

      case 'inference':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/5 p-1">
              {(['live', 'batch'] as const).map((tab) => {
                const active = activeInferenceTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveInferenceTab(tab)}
                    className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${active
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/30 p-3">

              <div className=" grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void inference.toggleRealtimeInference();
                  }}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                >
                  <Radio className="h-4 w-4" />
                  {inference.isRealtime ? 'Live On' : 'Realtime'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void inference.processFrameWithRetry();
                  }}
                  disabled={!backendConnected}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${!backendConnected ? 'opacity-60' : ''}`}
                >
                  <Activity className="h-4 w-4" />
                  Process Frame
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (videoFile) {
                      void inference.processVideoOnBackend(videoFile, false);
                    }
                  }}
                  disabled={!backendConnected || !videoFile}
                  className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${!backendConnected || !videoFile ? 'opacity-60' : ''}`}
                >
                  <CloudUpload className="h-4 w-4" />
                  Process Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void inference.startInferenceOnUploadedVideo();
                  }}
                  disabled={!backendConnected || !(inference.uploadedVideoInfo || inference.backendVideoProcessing.jobId)}
                  className={`${buttonPrimary} !h-12 !justify-start w-full px-3 text-[10px] ${!backendConnected || !(inference.uploadedVideoInfo || inference.backendVideoProcessing.jobId) ? 'opacity-60' : ''}`}
                >
                  <Play className="h-4 w-4" />
                  Start Video
                </button>
              </div>
            </div>

            {inference.hasRuntimeInferenceRois && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-[11px] text-blue-200">
                Drawn ROI filtering is active for {inference.activeInferenceRoiLabel || 'the selected region'}.
                Uploaded-video and single-frame inference will only show anomaly output inside the drawn ROI area.
              </div>
            )}

            <div className="rounded-2xl border border-white/5 bg-white/5 p-3 text-[11px] text-zinc-400">
              <div className="flex items-center justify-between gap-3">
                <span className="uppercase tracking-widest text-zinc-500">Model</span>
                <span className="truncate text-right text-zinc-200">
                  {inference.selectedModelInfo?.display_name || inference.selectedModelInfo?.name || 'None'}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Mode</div>
                  <div className="mt-1 font-semibold text-zinc-200 capitalize">
                    {activeInferenceTab}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Status</div>
                  <div className="mt-1 font-semibold text-zinc-200">
                    {inference.isProcessing ? 'Processing' : 'Idle'}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Realtime</div>
                  <div className="mt-1 font-semibold text-zinc-200">
                    {inference.isRealtime ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                  <div className="uppercase tracking-widest text-zinc-500">Batch</div>
                  <div className="mt-1 font-semibold text-zinc-200">
                    {inference.batchFiles.length} file{inference.batchFiles.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
            </div>

            {activeInferenceTab === 'batch' ? (
              <div className="space-y-3 rounded-2xl border border-white/5 bg-black/30 p-3">
                <input
                  ref={mobileBatchFileInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={inference.handleBatchFileUpload}
                />

                <div className="flex items-center justify-between gap-3">
                  <span className={ds.text.label + ' text-zinc-500'}>Batch Files</span>
                  <span className="font-mono text-[10px] text-blue-400">
                    {inference.batchFiles.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => mobileBatchFileInputRef.current?.click()}
                    className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
                  >
                    <Upload className="h-4 w-4" />
                    Choose Files
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void inference.processBatch();
                    }}
                    disabled={!backendConnected || inference.batchFiles.length === 0 || inference.isBatchProcessing}
                    className={`${buttonPrimary} !h-12 !justify-start w-full px-3 text-[10px] ${!backendConnected || inference.batchFiles.length === 0 || inference.isBatchProcessing ? 'opacity-60' : ''}`}
                  >
                    <Zap className="h-4 w-4" />
                    Run Batch
                  </button>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-[11px] text-zinc-400">
                  {inference.isBatchProcessing
                    ? `Processing ${Math.round(inference.batchProcessingProgress)}%`
                    : 'Pick files here, then run batch inference from the same sheet.'}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-[11px] text-zinc-400">
                Live mode is ready for single-frame or uploaded video inference. Use the model sheets below when you need to change models.
              </div>
            )}
          </div>
        );

      case 'model':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-black/30 p-3">


              <div className="space-y-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                    Select Model
                  </label>
                  <div className="w-full relative" ref={dropdownRef}>

                    {/* Trigger */}
                    <button
                      onClick={() => setOpen(!open)}
                      disabled={inference.models.length === 0 || inference.modelLoading}
                      className="w-full text-left rounded-xl border border-white/10 
                   bg-neutral-950 px-3 py-2.5 text-xs text-white 
                   flex items-center justify-between
                   disabled:opacity-60"
                    >
                      <span className="whitespace-normal break-words pr-2">
                        {selectedModel ? getLabel(selectedModel) : 'Select a model...'}
                      </span>
                      <span className="text-zinc-400">▾</span>
                    </button>

                    {/* Dropdown */}
                    {open && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 
                        bg-neutral-900 shadow-lg">

                        <div className="max-h-60 overflow-y-auto">
                          {inference.models.length === 0 && (
                            <div className="px-3 py-2 text-xs text-zinc-500">
                              No models available
                            </div>
                          )}

                          {inference.models.map((model) => (
                            <div
                              key={model.id}
                              onClick={() => {
                                inference.setSelectedModel(model.id);
                                setOpen(false);
                              }}
                              className={`px-3 py-2 text-xs cursor-pointer
                  whitespace-normal break-words
                  hover:bg-white/10
                  ${inference.selectedModel === model.id ? 'bg-blue-500/20' : ''}
                `}
                            >
                              {getLabel(model)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-1 text-[10px] text-zinc-500">
                      {inference.models.length} trained model
                      {inference.models.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                </div>

                {inference.selectedModelInfo && (
                  <div className="space-y-2 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-3">
                    <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400">
                      <span className="uppercase tracking-widest text-zinc-500">Training</span>
                      <span className="text-right text-zinc-200">
                        {(Array.isArray(inference.selectedModelInfo.training_options) &&
                          inference.selectedModelInfo.training_options.length > 0
                          ? inference.selectedModelInfo.training_options
                          : inference.selectedModelInfo.model_types || []
                        )
                          .map((type) =>
                            typeof type === 'string' && type.length > 0
                              ? `${type.charAt(0).toUpperCase()}${type.slice(1)}`
                              : ''
                          )
                          .filter(Boolean)
                          .join(' / ') || 'None'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400">
                      <span className="uppercase tracking-widest text-zinc-500">Model ID</span>
                      <span className="truncate text-right text-zinc-200">{inference.selectedModelInfo.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400">
                      <span className="uppercase tracking-widest text-zinc-500">ROIs</span>
                      <span className="text-right text-zinc-200">
                        {inference.selectedModelInfo.rois_trained?.length || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  void inference.loadModels();
                }}
                disabled={inference.modelLoading}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${inference.modelLoading ? 'opacity-60' : ''}`}
              >
                <RefreshCw className={`h-4 w-4 ${inference.modelLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  if (inference.selectedModel) {
                    void inference.loadSpecificModel(inference.selectedModel);
                  }
                }}
                disabled={!inference.selectedModel || inference.modelLoading}
                className={`${buttonPrimary} !h-12 !justify-start w-full px-3 text-[10px] ${!inference.selectedModel || inference.modelLoading ? 'opacity-60' : ''}`}
              >
                <Brain className="h-4 w-4" />
                Load Model
              </button>
              <button
                type="button"
                onClick={() => {
                  if (inference.selectedModel) {
                    void inference.unloadModel(inference.selectedModel);
                  }
                }}
                disabled={!inference.selectedModel || !inference.isModelLoaded}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px] ${!inference.selectedModel || !inference.isModelLoaded ? 'opacity-60' : ''}`}
              >
                <PowerOff className="h-4 w-4" />
                Unload
              </button>
              <button
                type="button"
                onClick={() => setMobileActivePanelMenu(null)}
                className={`${buttonSecondary} !h-12 !justify-start w-full px-3 text-[10px]`}
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
        );

      case 'terminal':
        return (
          <div className="space-y-3">
            <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-2xl border border-neutral-700 bg-black/40 p-3 font-mono text-[9px] custom-scrollbar">
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

            <button
              type="button"
              onClick={() => setTerminalLogs([])}
              className={`${buttonSecondary} h-11 w-full text-[9px]`}
            >
              Clear Logs
            </button>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="border-l-2 border-blue-500 pl-2 text-[10px] font-bold uppercase tracking-widest text-zinc-200">
                Workflow
              </h4>
              <ol className="space-y-2.5 text-[11px] leading-relaxed text-zinc-400">
                <li>
                  <span className="font-bold text-zinc-100">01.</span> Setup your input source from
                  the bottom rail
                </li>
                <li>
                  <span className="font-bold text-zinc-100">02.</span> Draw ROIs using the target
                  tools panel
                </li>
                <li>
                  <span className="font-bold text-zinc-100">03.</span> Select recording settings and
                  duration
                </li>
                <li>
                  <span className="font-bold text-zinc-100">04.</span> Run recording and launch the
                  training session
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-3 text-[10px] italic leading-normal text-zinc-500">
              Tip: You can keep the side panel open while you work through the mobile rail.
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-[11px] text-zinc-400">
            Use the toolbar below to open tools, projects, models and recording settings.
          </div>
        );
    }
  };

  return (
    <main className={`min-h-screen md:h-screen ${ds.colors.bg} ${ds.colors.textPrimary} flex flex-col overflow-x-hidden overflow-y-auto md:overflow-hidden selection:bg-blue-500/30 w-full max-w-full`}>
      <Header />
      <Toaster position="top-right" />
      {/* QR Code Modal */}
      {showQRCode && remoteCameraSession && (
        <div className="fixed inset-0 bg-black/80 z-[500] flex items-center justify-center p-4">
          <div className={`${panelCard} max-w-sm w-full max-h-[90vh] p-4`}>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold flex items-center">
                <QrCode className="w-4 h-4 mr-2 text-blue-400" />
                Connect Mobile Camera
              </h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-1 hover:bg-neutral-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-neutral-300 mb-3">
                Scan this QR code with your phone camera to connect
              </p>

              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeCanvas
                    value={`${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`}
                    size={110}   // 🔥 Reduced from 200
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-xs text-neutral-400 mb-2">
                Session ID: {remoteCameraSession.sessionId}
              </div>

              <div className="text-xs">
                <div className={`inline-block px-2 py-1 rounded-full ${remoteCameraStatus === 'connected'
                  ? 'bg-blue-600'
                  : remoteCameraStatus === 'connecting'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                  }`}>
                  {remoteCameraStatus === 'connected'
                    ? 'Connected'
                    : remoteCameraStatus === 'connecting'
                      ? 'Waiting...'
                      : 'Disconnected'}
                </div>
              </div>
            </div>

            <div className="space-y-3 ">
              <div className="text-xs text-neutral-300">
                <strong>Instructions:</strong>
                <ol className="list-decimal pl-4 mt-2 space-y-2">
                  <li>Open your phone camera app</li>
                  <li>Point it at the QR code above</li>
                  <li>Tap the notification/link that appears</li>
                  <li>Allow camera permissions on your phone</li>
                  <li>Tap &quot;Start Remote Camera&quot; on your phone</li>
                </ol>
              </div>

              <div className="flex gap-2 pb-4">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`;
                    navigator.clipboard.writeText(url);
                    addTerminalLog('✓ Mobile URL copied to clipboard');
                  }}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium"
                >
                  Copy Link
                </button>

                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-xs font-medium"
                >
                  Close
                </button>

              </div>

              {remoteStoragePath && (
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-[11px] text-neutral-300">
                  Stored video: <span className="font-mono text-neutral-200">{remoteStoragePath}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main workspace (grid + footer) fills remaining height */}
      <div className="flex-1 flex flex-col min-h-0 pb-[4.75rem] md:pb-0 w-full max-w-full">
        {/* Workspace Grid */}
        <div className="flex-1 flex flex-col md:flex-row gap-1.5 md:gap-4 p-1.5 md:p-3 min-h-0 overflow-x-hidden overflow-y-auto lg:overflow-hidden w-full max-w-full">
          {/* Left Column - Canvas & Tools (Span 8) */}
          <div className="flex-1 flex flex-col gap-1.5 md:gap-3 min-h-0">
            {/* Top Toolbar / Mode Switcher Section (Desktop only) */}
            <div className={`hidden md:flex items-center justify-between p-1.5 ${ds.colors.surfaceBlur} border ${ds.colors.borderSubtle} ${ds.radius.md} relative z-[200]`}>
              <div className="flex items-center gap-2  text-[10px] font-bold tracking-widest text-zinc-400 ">
                {/* Status Dot */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${inputSource === "oak"
                      ? isOakStreaming
                        ? "bg-green-500"
                        : "bg-red-500"
                      : inputSource === "camera"
                        ? currentCameraStream
                          ? "bg-green-500"
                          : "bg-red-500"
                        : inputSource === "remote"
                          ? remoteCameraStatus === "connected"
                            ? "bg-green-500"
                            : remoteCameraStatus === "connecting"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : isPlaying
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                  />
                </div>

                {/* Label */}
                <span className="uppercase">
                  {inputSource === "upload"
                    ? "Upload Video"
                    : inputSource === "camera"
                      ? "Live Camera"
                      : inputSource === "oak"
                        ? "OAK Camera"
                        : inputSource === "remote"
                          ? "Remote Camera"
                          : "Upload Video"}
                  {backendExtractionMode && " (Backend Processing)"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-neutral-500 flex items-center">
                      {inputSource === "upload" && videoFile ? videoFile.name : null}
                    </span>

                  </div>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-2 pr-1">
                {/* Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                {backendConnected && (
                  <button
                    onClick={() => {
                      handleInputSourceChange("upload");
                      fileInputRef.current?.click();
                    }}
                    className={`${toolbarIconButton} ${openDropdown === 'inputSource' ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''}`}
                    title="Upload Video"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}

                {backendConnected && (
                  <div className="flex items-center gap-1.5 ml-1">
                    {/* Live Camera*/}
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
                      className={`${toolbarIconButton} ${inputSource === 'camera' ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''}`}
                      title="Live Camera"
                    >
                      <Camera className="w-4 h-4" />

                    </button>
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

                    {/* Neuron Camera */}
                    <button
                      onClick={async () => {
                        handleInputSourceChange('oak');
                        await startOakCamera();
                      }}
                      className={`${toolbarIconButton} ${inputSource === 'oak' ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''}`}
                      title="Neuron Camera"
                    >
                      <Cpu className="w-4 h-4" />
                    </button>

                    {/* Remote Streaming  */}
                    <button
                      onClick={() => {
                        handleInputSourceChange('remote');
                        startRemoteCameraSession();
                      }}
                      className={`${toolbarIconButton} ${inputSource === 'remote' ? 'text-emerald-400! border-emerald-500/30! bg-emerald-500/10' : ''}`}
                      title="Remote Stream"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STOP BUTTONS */}
                {(currentCameraStream || isOakStreaming || remoteCameraActive) && (
                  <button
                    onClick={() => {
                      stopCamera()
                      stopOakCamera()
                      stopRemoteCamera()
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
                    title="Stop Input"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>
                  </button>
                )}


                <button
                  disabled={viewMode === 'inference' && inferenceViewerMode === 'processed'}
                  onClick={() => {
                    if (viewMode !== 'inference' || inferenceViewerMode !== 'processed') {
                      setRoiToolsVisible((v) => !v);
                      setDrawingMode('select');
                    }
                  }}
                  className={`${toolbarIconButton} ${roiToolsVisible ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''} ${viewMode === "inference" && inferenceViewerMode === "processed"
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : ""}`}
                  title="ROI Tools">
                  <Target className="w-4 h-4" />
                </button>

                <button
                  onClick={() => togglePanel("terminal")}
                  className={`${toolbarIconButton} ${showTerminal ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''}`}
                  title="Terminal"
                >
                  <Terminal className="w-4 h-4" />
                </button>

                <button
                  onClick={() => togglePanel('instructions')}
                  className={`${toolbarIconButton} ${showInstructions ? 'text-blue-400! border-blue-500/30! bg-blue-500/10' : ''}`}
                  title="Instructions"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {viewMode === 'inference' && (
                  <button
                    onClick={() => {
                      void openFullscreenPopup();
                    }}
                    className={toolbarIconButton}
                    title="Expand inference output"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


            {/* Mobile Toolbox */}
            <MobileToolbox
              backendConnected={backendConnected}
              inputSource={inputSource}
              onStop={() => {
                stopCamera();
                stopOakCamera();
                stopRemoteCamera();
              }}
              showStopButton={!!(currentCameraStream || isOakStreaming || remoteCameraActive)}
              viewMode={viewMode}
              mobileActivePanelMenu={mobileActivePanelMenu}
              onOpenPanelMenu={toggleMobilePanelMenu}
            />

            {/* Main Canvas Area */}
            <div className={`relative h-[50vh] min-h-[280px] md:h-[400px] lg:flex-1 lg:h-auto lg:min-h-0 ${ds.radius.lg} overflow-hidden bg-black border ${ds.colors.borderSubtle} ${ds.shadow.strong}`}>
              {/* Canvas Header */}
              {viewMode === 'training' && (
                <div className="absolute top-0 left-0 w-full p-1.5 md:p-4 flex justify-between items-center z-10 pointer-events-none">
                  <div className="flex gap-2 pointer-events-auto">
                    <div className="px-2 py-0.5  border rounded-lg border-white/20 text-[10px] text-zinc-400 ">{videoDimensions.width}x{videoDimensions.height}</div>
                    {/* <div className="px-2 py-1 bg-black/80 border border-white/20 text-xs font-paragraph text-white">{backendExtractionMode && 'Backend Mode'}</div> */}
                  </div>

                </div>
              )}

              <TrainingTypeModal
                open={viewMode === 'training' && isOpen}
                pendingROI={pendingROI}
                trainingTypes={trainingTypes}
                onTrainingTypesChange={setTrainingTypes}
                selectedTrainingModel={selectedTrainingModel}
                onConfirm={(roi) => {
                  commitROI(roi);
                  addTerminalLog(
                    roi.type === 'rectangle'
                      ? `✓ Created ROI: ${roi.label} (${roi.type}) | Training: ${roi.training.join(', ')}`
                      : `✓ Created Polygon ROI: ${roi.label} with ${roi.points.length} points | Training: ${roi.training.join(', ')}`
                  );

                  setIsOpen(false);
                  setPendingROI(null);
                  setTrainingTypes(initialTrainingTypes);
                }}
                onCancel={() => {
                  addTerminalLog(`⚠ ROI creation canceled`);
                  setIsOpen(false);
                  setPendingROI(null);
                  setTrainingTypes(initialTrainingTypes);
                }}
              />

              {showUpload && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  {/* Simple modal container */}
                  <div className={`relative ${panelCard} p-6 max-w-sm w-full`}>
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
              <div
                ref={containerRef}
                className="w-full h-full bg-gradient-to-b from-neutral-900/80 to-black/80 relative overflow-hidden ">

                {/* Backend extraction mode overlay */}
                {/* {backendExtractionMode && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                      <div className={`text-center p-4 ${panelCard} mx-4`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
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
                        <p className="text-xs text-amber-900 mb-3">
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
                )} */}
                {/* --- NEW UX CONSOLIDATED UI IN VIDEO CONTAINER --- */}

                {/* 1. Workflow Stepper (Training Mode) */}
                {/* {viewMode === 'training' && showStepper && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#16181D]/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-2xl shadow-lg">
                    <div className={`flex items-center gap-1.5 ${inputSource ? 'text-blue-400' : 'text-neutral-500'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${inputSource ? 'bg-blue-500/20' : 'bg-white/5'}`}>1</div>
                      <span className="text-xs font-medium">Source</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${rois.length > 0 ? 'text-indigo-400' : (inputSource ? 'text-white' : 'text-neutral-500')}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rois.length > 0 ? 'bg-indigo-500/20' : (inputSource ? 'bg-white/10' : 'bg-white/5')}`}>2</div>
                      <span className="text-xs font-medium">Draw ROI</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${rois.length > 0 ? 'text-white' : 'text-neutral-500'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rois.length > 0 ? 'bg-white/10' : 'bg-white/5'}`}>3</div>
                      <span className="text-xs font-medium">Train</span>
                    </div>
                    <button onClick={() => setShowStepper(false)} className="ml-2 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )} */}

                {/* 2. ROI Tool Palette – visible only when ROI icon clicked (Training Mode) */}
                {!isMobile && roiToolsVisible && isCanvasInteractive && (
                  <ROIToolsPalette
                    visible={true}
                    drawingMode={drawingMode}
                    isDrawing={isDrawing}
                    polygonPointsLength={currentROI?.points.length || 0}
                    onSelectMode={() => { setDrawingMode('select'); setCurrentROI(null); setIsDrawing(false); }}
                    onRectangleMode={() => addNewROI('rectangle')}
                    onPolygonMode={() => addNewROI('polygon')}
                    onClearAll={clearAllROIs}
                    onFinishPolygon={finishPolygon}
                  />
                )}

                {/* Video sources Placeholder */}
                {(!videoUrl && inputSource === 'upload') && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative mb-6 flex flex-col items-center gap-4 p-6 rounded-2xl backdrop-blur-xl"
                    >
                      {/* Glow background */}


                      {/* Upload icon circle */}
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center bg-blue-500/5">
                        <Upload className="w-5 h-5 text-blue-400 opacity-70" />
                      </div>

                      {/* Helper text */}
                      <p className=" text-zinc-400  text-[10px] font-bold tracking-widest uppercase text-center max-w-xs">
                        Upload a video stream to start.
                      </p>


                    </motion.div>

                    <div className="absolute bottom-38 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-blue-500/30" /> MP4</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-blue-500/30" /> MOV </span>
                    </div>
                  </div>
                )}

                {inputSource === 'oak' && isOakStreaming && (
                  <img
                    ref={oakStreamRef}
                    src={streamUrl}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    alt="OAK Camera Stream"
                    onLoad={handleOakStreamLoad}
                    crossOrigin="anonymous"
                  />
                )}

                {inputSource === 'upload' && playbackMode === 'video' && !backendExtractionMode && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    autoPlay
                    muted
                    loop
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleVideoLoad}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    playsInline
                  />
                )}

                {inputSource === 'camera' && (
                  <div className="absolute inset-0 overflow-hidden">
                    <video
                      key={currentCameraStream ? currentCameraStream.id : 'camera-stream'}
                      ref={(node) => {
                        videoRef.current = node;
                        if (!node || !currentCameraStream) return;
                        if (node.srcObject !== currentCameraStream) {
                          node.srcObject = currentCameraStream;
                        }
                        node.muted = true;
                        node.autoplay = true;
                        node.playsInline = true;
                        void node.play().catch(err => {
                          addTerminalLog(`âŒ Playback error: ${err.message}`);
                        });
                      }}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                      autoPlay
                      muted
                      playsInline
                      onPlay={() => {
                        // For MediaStreams, dimensions become available when video plays
                        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                          const width = videoRef.current.videoWidth;
                          const height = videoRef.current.videoHeight;
                          setVideoDimensions({ width, height });
                          updateCanvasDimensions();
                          addTerminalLog(`✓ Camera playing: ${width}x${height}`);
                        }
                      }}
                      onLoadedMetadata={handleVideoLoad}
                      onClick={(e) => {
                        if (videoRef.current?.paused) {
                          videoRef.current.play().catch(err => {
                            addTerminalLog(`❌ Playback error: ${err.message}`);
                          });
                        }
                      }}
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

                {inputSource === 'remote' && (
                  <div className="absolute inset-0">
                    <video
                      ref={remoteVideoRef}
                      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                      autoPlay
                      muted
                      playsInline
                      onLoadedMetadata={() => {
                        if (remoteVideoRef.current && remoteVideoRef.current.videoWidth > 0 && remoteVideoRef.current.videoHeight > 0) {
                          setVideoDimensions({
                            width: remoteVideoRef.current.videoWidth,
                            height: remoteVideoRef.current.videoHeight,
                          });
                          setTimeout(() => drawCanvas(), 100);
                        }
                      }}
                    />
                    {!remoteCameraFrame && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-center text-sm text-neutral-200">
                        <div>
                          <div className="font-semibold">Waiting for mobile camera</div>
                          <div className="mt-2 text-xs text-neutral-400">
                            Start Remote Camera on your phone to begin streaming.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'inference' && (
                  <div className="absolute inset-0 z-30 pointer-events-none">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
                      <div className="space-y-2 pointer-events-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-md">
                          <Target className="h-3.5 w-3.5 text-blue-300" />
                          {activeViewerROI
                            ? `${activeViewerROI.label}`
                            : rois.length > 0
                              ? `Full Frame (${rois.length} ROI${rois.length === 1 ? '' : 's'})`
                              : 'Full Frame'}
                        </div>
                        {/* {roiToolsVisible && inferenceViewerMode === 'processed' && (
                          <div className="max-w-sm rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-[11px] text-sky-100 backdrop-blur-md">
                            Choose Rectangle or Polygon to switch to Original and draw the ROI. Inference will run on that cropped area.
                          </div>
                        )} */}
                        {inference.inferenceWarning && (
                          <div className="max-w-sm rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200 backdrop-blur-md">
                            {inference.inferenceWarning}
                          </div>
                        )}
                        {inference.downloadError && inference.showDownloadPopup === false && (
                          <div className="max-w-sm rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200 backdrop-blur-md">
                            {inference.downloadError}
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-auto inline-flex rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur-md">
                        {(['processed', 'original'] as const).map((mode) => {
                          const active = inferenceViewerMode === mode;
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => {
                                setInferenceViewerMode(mode);
                                // 👇 control ROI palette visibility
                              }}
                              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase  transition-colors ${active ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
                                }`}
                            >
                              {mode === 'processed' ? 'Processed' : 'Original'}
                            </button>
                          );
                        })}
                      </div>

                    </div>

                    <div
                      className={`absolute inset-0 bg-black transition-opacity duration-300 ${inferenceViewerMode === 'processed' ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    />

                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${inferenceViewerMode === 'processed' ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
                    >
                      {showPersistedProcessedVideo ? (
                        <>
                          <video
                            key={inference.processedVideoUrl}
                            ref={processedInferenceVideoRef}
                            src={inference.processedVideoUrl}
                            className="h-full w-full object-contain bg-black"
                            autoPlay
                            muted={false}
                            controls
                            playsInline
                            preload="auto"
                            crossOrigin="anonymous"
                            onLoadedMetadata={() => {
                              // Clear previous errors on successful load
                              videoErrorCountRef.current = 0;
                              void processedInferenceVideoRef.current?.play().catch((err) => {
                                addTerminalLog(`⚠️ Autoplay blocked: ${err.message}`);
                              });
                            }}
                            onCanPlay={() => {
                              // Silent success - don't spam logs
                              videoErrorCountRef.current = 0;
                            }}
                            onError={(e: any) => {
                              const videoElement = e.currentTarget as HTMLVideoElement;
                              const errorCode = videoElement.error?.code;
                              const errorMessages: Record<number, string> = {
                                1: 'MEDIA_ERR_ABORTED - Playback aborted',
                                2: 'MEDIA_ERR_NETWORK - Network error',
                                3: 'MEDIA_ERR_DECODE - Decoding error',
                                4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported',
                              };
                              const errorMsg = errorMessages[errorCode || 0] || `Unknown error (${errorCode})`;

                              // Prevent infinite error loop - only log once per 3 errors
                              videoErrorCountRef.current += 1;
                              if (videoErrorCountRef.current % 3 === 1) {
                                // Don't pass the event object to console to avoid Promise serialization errors
                                console.error('Video error code:', errorCode);
                                addTerminalLog(`❌ Video error: ${errorMsg}`);
                              }

                              // Attempt to reload the video (max 2 attempts)
                              if (
                                videoReloadAttemptsRef.current < 2 &&
                                processedInferenceVideoRef.current &&
                                inference.processedVideoUrl
                              ) {
                                videoReloadAttemptsRef.current += 1;
                                const attempt = videoReloadAttemptsRef.current;
                                if (attempt === 1) {
                                  addTerminalLog(`⏳ Reload attempt ${attempt}/2...`);
                                  processedInferenceVideoRef.current.src = '';
                                  setTimeout(() => {
                                    if (processedInferenceVideoRef.current) {
                                      processedInferenceVideoRef.current.src = inference.processedVideoUrl;
                                    }
                                  }, 800);
                                } else if (attempt === 2) {
                                  addTerminalLog(`⏳ Final reload with preload reset...`);
                                  processedInferenceVideoRef.current.preload = 'none';
                                  processedInferenceVideoRef.current.src = '';
                                  setTimeout(() => {
                                    if (processedInferenceVideoRef.current) {
                                      processedInferenceVideoRef.current.preload = 'auto';
                                      processedInferenceVideoRef.current.src = inference.processedVideoUrl;
                                    }
                                  }, 1000);
                                }
                              } else if (videoReloadAttemptsRef.current >= 2) {
                                // Mark video as unsupported after retries exhausted and fall back to image frame
                                if (videoErrorCountRef.current % 10 === 1) {
                                  addTerminalLog('⚠️ Video reload attempts exhausted. Falling back to latest processed frame.');
                                }
                                setProcessedVideoUnsupported(true);
                              }
                            }}
                            onLoadStart={() => {
                              // Reduced logging to avoid spam
                              if (videoReloadAttemptsRef.current === 0) {
                                addTerminalLog('⏳ Video loading...');
                              }
                            }}
                            onProgress={() => {
                              const video = processedInferenceVideoRef.current;
                              if (video && video.buffered.length > 0) {
                                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                                const duration = video.duration;
                                // Only log buffering at major milestones (25%, 50%, 75%, 100%)
                                if (duration && bufferedEnd < duration) {
                                  const percent = Math.floor((bufferedEnd / duration) * 100);
                                  if (percent % 25 === 0 && percent > 0) {
                                    addTerminalLog(`📦 Buffered: ${percent}%`);
                                  }
                                }
                              }
                            }}
                          />
                          {/* Fallback text if video fails */}
                          {!inference.processedVideoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                              <div className="text-center">
                                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                                <div className="text-sm text-red-300">Video URL unavailable</div>
                                <button
                                  onClick={() => {
                                    const jobId = inference.backendVideoProcessing.jobId;
                                    if (jobId) {
                                      void inference.fetchProcessedVideoFromBackend?.(jobId);
                                    }
                                  }}
                                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                >
                                  Retry
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : showProcessedPreviewFrame ? (
                        <img
                          src={inference.processedFrame}
                          className="h-full w-full object-contain bg-black"
                          alt="AI Inference Output"
                          onError={() => {
                            addTerminalLog('❌ Failed to load preview frame');
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black">
                          <div className="text-center p-4">
                            <Brain className="mx-auto mb-2 h-12 w-12 text-neutral-600" />
                            <div className="text-neutral-500 font-medium">AI Inference Output</div>
                            {inference.backendVideoProcessing.isProcessing ? (
                              <div className="mt-1 text-xs text-neutral-600">
                                Processing: {inference.backendVideoProcessing.currentFrame}/{inference.backendVideoProcessing.totalFrames}
                              </div>
                            ) : inference.backendVideoProcessing.status === 'completed' || inference.backendVideoProcessing.status === 'paused' ? (
                              <div className="mt-1 text-xs text-neutral-600">
                                Click "Processed" tab above to view the stopped video
                              </div>
                            ) : (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs text-neutral-500">Processed frames will appear here</div>
                                <div className="text-xs text-neutral-600">Start inference to see results</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Canvas for ROI drawing - always mounted to preserve drawing context */}
                <canvas
                  ref={canvasRef}
                  onClick={isCanvasInteractive ? handleCanvasClick : undefined}
                  onTouchStart={isCanvasInteractive ? handleCanvasTouch : undefined}
                  onTouchMove={isCanvasInteractive ? handleCanvasTouchMove : undefined}
                  onMouseMove={isCanvasInteractive ? handleCanvasMouseMove : undefined}
                  onMouseLeave={() => {
                    if (isDrawing && currentROI && currentROI.type === 'rectangle') {
                      setIsDrawing(false);
                    }
                    if (!tooltipHoveredRef.current && hoveredROI) {
                      scheduleTooltipHide();
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (isDrawing && currentROI && currentROI.type === 'polygon') {
                      finishPolygon();
                    }
                  }}
                  className={`absolute inset-0 z-10 h-full w-full transition-opacity ${shouldShowCanvasOverlay ? 'opacity-100' : 'opacity-0'} ${isCanvasInteractive ? 'pointer-events-auto' : 'pointer-events-none'} ${drawingMode === 'select' ? 'cursor-pointer' : 'cursor-crosshair'
                    }`}
                />

                {/* Drawing Instructions */}
                {isCanvasInteractive && drawingMode !== 'select' && (
                  <div className={`absolute px-3 py-1.5 text-[10px] text-neutral-400 font-mono tracking-wider pointer-events-auto bg-black/60 backdrop-blur-md rounded-lg border border-white/5 shadow-xl ${viewMode === 'inference' ? 'bottom-8 right-3' : 'top-2 right-2'}`}> {drawingMode === 'rectangle'
                    ? 'Click and drag to draw rectangle'
                    : 'Click to add Polygon points'}
                  </div>
                )}

                {/* 3. Consolidated Status Bar (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2  pointer-events-none">
                  <div className="flex items-center gap-3">
                    {/* Recording status */}
                    {isRecording && (
                      <div className="flex items-center mb-10 gap-2 px-3 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-500 rounded-full backdrop-blur-md pointer-events-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold tracking-wider">REC {remainingTime}s</span>
                      </div>
                    )}

                    {/* Backend Extraction Mode Badge */}
                    <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                      {backendExtractionMode && (
                        <div className="flex items-center mb-10 gap-1.5 px-1 py-1 bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          <CloudUpload className="w-3 h-3" />  Backend Processing
                        </div>
                      )}

                      {/* Camera Status */}
                      {inputSource === 'camera' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${currentCameraStream ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                          <VideoIcon className="w-3 h-3" /> ON
                        </div>
                      )}
                      {/* Remote Camera Status */}
                      {inputSource === 'remote' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${remoteCameraStatus === 'connected' ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-amber-600/20 border-amber-600/30 text-amber-300'}`}>
                          <Smartphone className="w-3 h-3" /> {remoteCameraStatus}
                        </div>
                      )}
                      {/* OAK Camera Status */}
                      {inputSource === 'oak' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${isOakStreaming ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                          <Camera className="w-3 h-3" /> OAK-D
                        </div>
                      )}

                    </div>
                  </div>

                  {/* <div className="flex items-center gap-3">
                  
                    {viewMode === 'inference' && (
                      <div className={`flex items-center mb-10 gap-2 px-3 py-1 rounded-lg text-xs font-bold tracking-wider border pointer-events-auto ${inference.isProcessing ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                        <Activity className={`w-3.5 h-3.5 ${inference.isProcessing ? 'animate-pulse' : ''}`} />
                        {inference.isProcessing ? 'Inferencing' : 'Model Idle'}
                      </div>
                    )}

                    {viewMode === 'inference' && visibleInferenceAnomalyCount > 0 && (
                      <div className="flex  items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg font-bold text-xs pointer-events-auto">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {visibleInferenceAnomalyCount} Anomalies
                      </div>
                    )}



                  </div> */}

                </div>

                {/* ROI Hover Details Overlay */}
                <AnimatePresence>
                  {showLegacyHoverOverlay && hoveredROI && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute z-30 bg-[#16181D]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl pointer-events-auto"
                      style={{
                        left: (rois.find(r => r.id === hoveredROI)?.points[0].x || 0) * scale + offset.x + 0,
                        top: (rois.find(r => r.id === hoveredROI)?.points[0].y || 0) * scale + offset.y + 0,
                      }}
                    >
                      {(() => {
                        const roi = rois.find(r => r.id === hoveredROI);
                        if (!roi) return null;
                        return (
                          <div className="space-y-3 min-w-43.75">
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={roi.label}
                                onChange={(e) => updateROI(roi.id, { label: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-blue-500 w-full"
                              />
                              <button
                                onClick={() => deleteROI(roi.id)}
                                className="p-1.5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Training Types</p>
                              <div className="flex flex-wrap gap-1">
                                {['anomaly', 'sequential', 'motion'].map(type => (
                                  <button
                                    key={type}
                                    onClick={() => {
                                      const newTraining = roi.training.includes(type as TrainingType)
                                        ? roi.training.filter(t => t !== type)
                                        : [...roi.training, type as TrainingType];
                                      updateROI(roi.id, { training: newTraining });
                                    }}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${roi.training.includes(type as TrainingType)
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white/5 text-neutral-500 hover:bg-white/10'
                                      }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-neutral-500">
                                {roi.points.length} Points {roi.type}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {typeof window !== 'undefined' && createPortal(
                  <AnimatePresence>
                    {viewMode === 'training' && hoveredROIData && (
                      <motion.div
                        ref={tooltipRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onAnimationComplete={updateTooltipPosition}
                        onMouseEnter={() => {
                          tooltipHoveredRef.current = true;
                          clearTooltipHideTimeout();
                        }}
                        onMouseLeave={() => {
                          tooltipHoveredRef.current = false;
                          scheduleTooltipHide();
                        }}
                        className="fixed z-120 bg-[#16181D]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl pointer-events-auto"
                        style={{
                          left: `${tooltipPosition.left}px`,
                          top: `${tooltipPosition.top}px`,
                          visibility: tooltipPosition.visible ? 'visible' : 'hidden'
                        } as any}
                      >
                        <div className="space-y-3 min-w-[175px]">
                          <div className="flex items-center justify-between gap-1">
                            <input
                              type="text"
                              value={hoveredROIData.label}
                              onChange={(e) => updateROI(hoveredROIData.id, { label: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-blue-500 w-full"
                            />
                            <button
                              onClick={() => deleteROI(hoveredROIData.id)}
                              className="p-1.5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Training Types</p>
                            <div className="flex flex-wrap gap-1">
                              {['anomaly', 'sequential', 'motion'].map(type => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    const newTraining = hoveredROIData.training.includes(type as TrainingType)
                                      ? hoveredROIData.training.filter(t => t !== type)
                                      : [...hoveredROIData.training, type as TrainingType];
                                    updateROI(hoveredROIData.id, { training: newTraining });
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${hoveredROIData.training.includes(type as TrainingType)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-neutral-500 hover:bg-white/10'
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-neutral-500">
                              {hoveredROIData.points.length} Points | {hoveredROIData.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}

              </div>


              {/* Training Playback Controls Bottom Strip */}
              {viewMode === 'training' && (
                <div className="hidden lg:block absolute bottom-[calc(6rem+env(safe-area-inset-bottom))] left-0 w-full z-[120] bg-gradient-to-t from-black via-black/80 to-transparent px-2.5 pt-1.5 pb-1.5 pointer-events-auto transition-all lg:bottom-0 lg:px-4 lg:pt-2 lg:pb-2">
                  <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between w-full">

                    {/* Left Controls */}
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      {inputSource === 'upload' && !backendExtractionMode && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                              }
                            }}
                            className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                            title="Restart"
                          >
                            <SkipBack className="w-3 h-3" />
                          </button>
                          <button
                            onClick={togglePlay}
                            className="flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-blue-400"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.min(
                                  videoRef.current.duration,
                                  videoRef.current.currentTime + 5
                                );
                              }
                            }}
                            className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            <SkipForward className="w-3 h-3" />
                          </button>
                          <div className="flex min-w-0 items-center gap-2 flex-1 max-w-4xl">

                            <div className="relative flex items-center h-full min-w-0 flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={isDragging ? draggedProgress : (duration > 0 ? (currentTime / duration) * 100 : 0)}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  setDraggedProgress(value);
                                  if (videoRef.current && duration > 0) {
                                    const newTime = (value / 100) * duration;
                                    videoRef.current.currentTime = newTime;
                                  }
                                }}
                                onMouseDown={() => {
                                  setIsDragging(true);
                                  if (videoRef.current) {
                                    isPausedBeforeScrub.current = videoRef.current.paused;
                                    videoRef.current.pause();
                                  }
                                }}
                                onMouseUp={() => {
                                  setIsDragging(false);
                                  if (videoRef.current && !isPausedBeforeScrub.current) {
                                    void videoRef.current.play().catch(() => {
                                      // Autoplay might be blocked
                                    });
                                  }
                                }}
                                onTouchStart={() => {
                                  setIsDragging(true);
                                  if (videoRef.current) {
                                    isPausedBeforeScrub.current = videoRef.current.paused;
                                    videoRef.current.pause();
                                  }
                                }}
                                onTouchEnd={() => {
                                  setIsDragging(false);
                                  if (videoRef.current && !isPausedBeforeScrub.current) {
                                    void videoRef.current.play().catch(() => {
                                      // Autoplay might be blocked
                                    });
                                  }
                                }}
                                className="slider w-full h-1 bg-white/20 rounded-full appearance-none outline-none transition-all hover:h-1.5"
                                style={{ accentColor: '#3b82f6' }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                              -{formatTime(Math.max(0, duration - (isDragging ? (draggedProgress / 100) * duration : currentTime)))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>


                    {/* Right Controls (Recording + AI Training) */}
                    <div className="grid grid-cols-2 gap-1.5 md:flex md:items-center shrink-0">
                      <button
                        onClick={toggleRecording}
                        disabled={
                          !inputSource ||
                          (inputSource === 'camera' && !currentCameraStream) ||
                          (inputSource === 'oak' && !isOakStreaming) ||
                          (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                        }
                        className={`flex w-full items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all md:w-auto md:px-3 md:py-1.5 md:text-[10px] ${isRecording
                          ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:bg-rose-500/30'
                          : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-rose-400 animate-pulse' : 'bg-white'
                            }`}
                        />
                        {isRecording ? `Stop REC (${remainingTime}s)` : 'Start Recording'}
                      </button>

                      {isCapturingTrainingFrames ? (
                        <button
                          type="button"
                          onClick={() => {
                            stopTraining();
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-md border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all md:w-auto md:px-3 md:py-1.5 md:text-[10px] bg-red-600/80 border-red-500/40 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]`}
                        >
                          <Square className="w-3.5 h-3.5" />
                          Stop Training
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const hasSourceReady = videoFile || videoUrl || currentCameraStream || isOakStreaming || remoteCameraActive || backendExtractionMode;
                            if (!hasSourceReady) {
                              showToast("Please select a video or start camera first", "warning");
                              return;
                            }
                            setShowConfirm(true);
                          }}
                          disabled={!backendConnected}
                          className={`flex w-full items-center justify-center gap-2 rounded-md border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all md:w-auto md:px-3 md:py-1.5 md:text-[10px] ${!backendConnected
                            ? 'bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed'
                            : 'bg-zinc-800/80 border-white/10 text-zinc-100 hover:bg-zinc-700/80'
                            }`}
                        >
                          <Brain className="w-3.5 h-3.5" />
                          Start Training
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {viewMode !== 'training' && (
                <div className="hidden lg:block absolute bottom-[calc(6rem+env(safe-area-inset-bottom))] left-0 w-full z-[120] bg-gradient-to-t from-black via-black/80 to-transparent px-2.5 pt-1.5 pb-1.5 pointer-events-auto transition-all lg:bottom-0 lg:px-4 lg:pt-2 lg:pb-2">
                  <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-end w-full">
                    <span className="text-[10px] md:text-xs text-neutral-400 shrink-0">
                      Threshold:
                    </span>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={inference.advancedSettings.threshold}
                      onChange={(e) =>
                        inference.setAdvancedSettings(prev => ({
                          ...prev,
                          threshold: parseFloat(e.target.value),
                        }))
                      }
                      className="slider w-full rounded-full h-1 bg-neutral-700 appearance-none cursor-pointer md:w-[12.5rem]"
                    />

                    <span className="text-[10px] md:text-xs font-mono text-white shrink-0">
                      {inference.advancedSettings.threshold.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Playback Controls Bar (Inference) */}

            <div className="mt-2 space-y-2 lg:hidden">
              <BackendExtractionCard
                viewMode={viewMode}
                backendExtractionMode={backendExtractionMode}
                extractionStatus={extractionStatus}
                extractionProgress={extractionProgress}
                extractedFramesCount={extractedFramesCount}
                videoFile={videoFile}
                extractionJobId={extractionJobId}
                uploadVideoToBackend={uploadVideoToBackend}
                cancelBackendExtraction={cancelBackendExtraction}
              />

              {viewMode === 'training' ? (
                <div className="rounded-2xl border border-neutral-800/70 bg-neutral-950/95 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all">
                  <div className="flex flex-col gap-2">
                    {inputSource === 'upload' && !backendExtractionMode && (
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                            }
                          }}
                          className="rounded-full p-1 text-neutral-400 transition-all hover:bg-white/5 hover:text-white"
                          title="Restart"
                        >
                          <SkipBack className="h-3 w-3" />
                        </button>

                        <button
                          onClick={togglePlay}
                          className="flex items-center justify-center rounded-full p-2 text-white transition-all hover:bg-white/10 hover:text-blue-400"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 fill-current" />
                          ) : (
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = Math.min(
                                videoRef.current.duration,
                                videoRef.current.currentTime + 5
                              );
                            }
                          }}
                          className="rounded-full p-1 text-neutral-400 transition-all hover:bg-white/5 hover:text-white"
                        >
                          <SkipForward className="h-3 w-3" />
                        </button>

                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={isDragging ? draggedProgress : (duration > 0 ? (currentTime / duration) * 100 : 0)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setDraggedProgress(value);
                              if (videoRef.current && duration > 0) {
                                const newTime = (value / 100) * duration;
                                videoRef.current.currentTime = newTime;
                              }
                            }}
                            onMouseDown={() => {
                              setIsDragging(true);
                              if (videoRef.current) {
                                isPausedBeforeScrub.current = videoRef.current.paused;
                                videoRef.current.pause();
                              }
                            }}
                            onMouseUp={() => {
                              setIsDragging(false);
                              if (videoRef.current && !isPausedBeforeScrub.current) {
                                void videoRef.current.play().catch(() => {
                                  // Autoplay might be blocked
                                });
                              }
                            }}
                            onTouchStart={() => {
                              setIsDragging(true);
                              if (videoRef.current) {
                                isPausedBeforeScrub.current = videoRef.current.paused;
                                videoRef.current.pause();
                              }
                            }}
                            onTouchEnd={() => {
                              setIsDragging(false);
                              if (videoRef.current && !isPausedBeforeScrub.current) {
                                void videoRef.current.play().catch(() => {
                                  // Autoplay might be blocked
                                });
                              }
                            }}
                            className="slider h-1 w-full appearance-none rounded-full bg-white/20 outline-none transition-all hover:h-1.5"
                            style={{ accentColor: '#3b82f6' }}
                          />
                          <span className="whitespace-nowrap text-[10px] font-mono text-neutral-400">
                            -{formatTime(Math.max(0, duration - (isDragging ? (draggedProgress / 100) * duration : currentTime)))}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={toggleRecording}
                        disabled={
                          !inputSource ||
                          (inputSource === 'camera' && !currentCameraStream) ||
                          (inputSource === 'oak' && !isOakStreaming) ||
                          (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                        }
                        className={`flex w-full items-center justify-center gap-2 rounded-md px-2.5 py-2 text-[9px] font-bold uppercase tracking-widest transition-all ${isRecording
                          ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:bg-rose-500/30'
                          : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
                          }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${isRecording ? 'bg-rose-400 animate-pulse' : 'bg-white'}`} />
                        {isRecording ? `Stop REC (${remainingTime}s)` : 'Start Recording'}
                      </button>

                      <button
                        onClick={() => setShowConfirm(true)}
                        disabled={!backendConnected || isCapturingTrainingFrames}
                        className={`flex w-full items-center justify-center gap-2 rounded-md border px-2.5 py-2 text-[9px] font-bold uppercase tracking-widest transition-all ${!backendConnected || isCapturingTrainingFrames
                          ? 'cursor-not-allowed border-white/5 bg-zinc-900/40 text-zinc-600'
                          : 'border-white/10 bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80'
                          }`}
                      >
                        <Brain className="h-3.5 w-3.5" />
                        {isCapturingTrainingFrames ? 'Capturing' : 'Start Training'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-800/70 bg-neutral-950/95 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                      Threshold
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={inference.advancedSettings.threshold}
                      onChange={(e) =>
                        inference.setAdvancedSettings((prev) => ({
                          ...prev,
                          threshold: parseFloat(e.target.value),
                        }))
                      }
                      className="slider h-1 w-full appearance-none rounded-full bg-neutral-700 cursor-pointer"
                    />
                    <span className="shrink-0 text-[10px] font-mono text-white">
                      {inference.advancedSettings.threshold.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>


            {/* Subtle Confirmation Popup */}
            {showConfirm && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-4">
                <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                    Confirm Session
                  </div>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full px-2 py-1 text-[10px] bg-neutral-800 border border-neutral-700 rounded-md text-white outline-none focus:border-blue-500 mb-2"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-md text-[10px] hover:bg-neutral-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmTraining}
                      className="px-2 py-1 bg-blue-600 text-white rounded-md text-[10px] hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Controls & Panels (Hidden on mobile) */}
          <div className="hidden md:flex w-full md:w-72 lg:w-80 md:shrink-0 flex-col gap-4 min-h-0">
            <AnimatePresence mode="wait">
              {/* ================= NORMAL CONTROLS (TRAINING) ================= */}
              {activePanel === null && viewMode === "training" && (
                <motion.div
                  key="controls-training"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col gap-3 min-h-0 h-full overflow-y-auto  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {/* Configuration Card */}
                  <div className={panelCard}>
                    <div className="p-3 flex flex-col h-full ">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-3">
                        <h3 className={ds.text.label + " text-zinc-500"}>Model </h3>
                        <Activity className="w-3.5 h-3.5 text-zinc-600" />
                      </div>

                      <div className="flex-1  pr-1 space-y-2">
                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, anomaly: !prev.anomaly }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.anomaly ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.anomaly ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Bug className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Anomaly</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.anomaly ? "✓" : "○"}
                          </span>
                        </button>

                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, sequential: !prev.sequential }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.sequential ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.sequential ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Workflow className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Sequential</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.sequential ? "✓" : "○"}
                          </span>
                        </button>

                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, motion: !prev.motion }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.motion ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.motion ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Crosshair className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Motion</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.motion ? "✓" : "○"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recording settings Card */}
                  <div className={panelCard}>
                    <div className="p-3 flex flex-col h-full ">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                        <h3 className={ds.text.label + " text-zinc-500"}>Recording</h3>
                        <Settings2 className="w-3.5 h-3.5 text-zinc-600" />
                      </div>

                      <div className="flex-1  space-y-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                            <span>Frame Rate</span>
                            <span className="font-mono text-blue-500">{frameRate} FPS</span>
                          </div>
                          <input type="range" min="1" max="60" value={frameRate} onChange={(e) => setFrameRate(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                            <span>Duration</span>
                            <span className="font-mono text-blue-500">{recordingDuration}S</span>
                          </div>
                          <input type="range" min="5" max="60" value={recordingDuration} onChange={(e) => setRecordingDuration(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500" />
                        </div>

                        {isRecording && (
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> REC PHASE</span>
                              <span className="text-[9px] font-mono text-zinc-500">{captureCount} FRS</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-blue-600 transition-all" style={{ width: `${((recordingDuration - remainingTime) / recordingDuration) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className={panelCard + " h-15 shrink-0 mb-1"}>
                    <div className="p-3 flex flex-row gap-2 h-full items-center justify-between">

                      <button onClick={checkDatasets} className={buttonSecondary + " w-full text-[9px]! uppercase tracking-widest h-10"}>
                        <Database className="w-3 h-3" /> Check Dataset
                      </button>
                      <button onClick={testCapture} className={buttonSecondary + " w-full text-[9px]! uppercase tracking-widest opacity-50 cursor-not-allowed h-10"}>
                        <Clock className="w-3 h-3" /> Test Capture
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= INFERENCE PANEL ================= */}
              {activePanel === null && viewMode === "inference" && (
                <motion.div
                  key="controls-inference"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-h-0"
                >
                  <InferenceModelDropdown
                    open={openDropdown === 'inferenceModel'}
                    onToggle={() => toggleDropdown('inferenceModel')}
                    onClose={closeDropdowns}
                    models={inference.models}
                    selectedModel={inference.selectedModel}
                    selectedModelType={inference.selectedModelType}
                    onSelectModel={(modelId) => {
                      inference.setSelectedModel(modelId);
                      closeDropdowns();
                    }}
                    onSelectModelType={(modelType) => inference.setSelectedModelType(modelType)}
                    selectedModelInfo={inference.selectedModelInfo}
                    selectedModelAvailableTypes={inference.selectedModelAvailableTypes}
                    getModelTypeLabel={inference.getModelTypeLabel}
                    isModelLoaded={inference.isModelLoaded}
                    modelLoading={inference.modelLoading}
                    onRefreshModels={inference.loadModels}
                    onLoadModel={() => {
                      if (inference.selectedModel) {
                        void inference.loadSpecificModel(inference.selectedModel);
                      }
                      closeDropdowns();
                    }}
                    onUnloadModel={() => {
                      if (inference.selectedModel) void inference.unloadModel(inference.selectedModel);
                      closeDropdowns();
                    }}
                    onOpenDownload={(modelId, modelInfo) => {
                      void inference.downloadModel(modelId, modelInfo);
                    }}
                    onStartDownload={() => {
                      void inference.startModelDownload();
                    }}
                    showDownloadPopup={inference.showDownloadPopup}
                    onCloseDownloadPopup={() => {
                      inference.setShowDownloadPopup(false);
                    }}
                    selectedModelForDownload={inference.selectedModelForDownload}
                    isDownloading={inference.isDownloading}
                    downloadProgress={inference.downloadProgress}
                    downloadError={inference.downloadError}
                    downloadDebugInfo={inference.downloadDebugInfo}
                    addTerminalLog={addTerminalLog}
                  />
                  <InferenceControls
                    activeTab={activeInferenceTab}
                    onActiveTabChange={setActiveInferenceTab}
                    inputSource={inputSource}
                    videoFile={videoFile}
                    isRealtime={inference.isRealtime}
                    setIsRealtime={(value) => inference.setIsRealtime(value)}
                    selectedModel={inference.selectedModel}
                    selectedModelInfo={inference.selectedModelInfo}
                    selectedModelAvailableTypes={inference.selectedModelAvailableTypes}
                    isOakStreaming={isOakStreaming}
                    modelLoading={inference.modelLoading}
                    connectionError={inference.connectionError}
                    isProcessing={inference.isProcessing}
                    isStoppingBackendVideo={inference.isStoppingBackendVideo}
                    inferenceWarning={inference.inferenceWarning}
                    backendVideoStatus={inference.backendVideoProcessing.status}
                    uploadedVideoInfo={inference.uploadedVideoInfo}
                    activeInferenceRoiLabel={inference.activeInferenceRoiLabel}
                    hasRuntimeInferenceRois={inference.hasRuntimeInferenceRois}
                    hasClientSideOnlyInferenceRoi={inference.hasClientSideOnlyInferenceRoi}
                    predictions={inference.predictions}
                    inferenceStats={inference.inferenceStats}
                    onToggleRealtimeInference={() => {
                      void inference.toggleRealtimeInference();
                    }}
                    onProcessSingleFrame={() => {
                      void inference.processFrameWithRetry();
                    }}
                    onUploadVideoForBackend={() => {
                      if (videoFile) {
                        void inference.processVideoOnBackend(videoFile, false);
                      }
                    }}
                    onStartUploadedVideoInference={() => {
                      void inference.startInferenceOnUploadedVideo();
                    }}
                    onCancelBackendVideo={() => {
                      void inference.cancelBackendVideoProcessing();
                    }}
                    batchFiles={inference.batchFiles}
                    isBatchProcessing={inference.isBatchProcessing}
                    onBatchFilesSelected={inference.handleBatchFileUpload}
                    onProcessBatch={() => {
                      void inference.processBatch();
                    }}
                  />
                </motion.div>
              )}

              {/* ================= TERMINAL PANEL ================= */}
              {activePanel === "terminal" && (
                <motion.div
                  key="panel-terminal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex flex-col flex-1 min-h-0 ${ds.colors.surfaceBlur} border ${ds.colors.borderStrong} ${ds.radius.md} ${ds.shadow.strong} overflow-hidden`}
                >
                  <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" />
                      <span className={ds.text.label + " text-zinc-300"}>Live Output</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setTerminalLogs([])} className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setActivePanel(null)} className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div ref={terminalRef} className="flex-1 p-4 font-mono text-[9px] overflow-y-auto space-y-1.5 bg-black/40 custom-scrollbar">
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

                  <div className="px-3 py-2 border-t border-white/5 bg-black/20 flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Buffer: {terminalLogs.length}/500</span>
                  </div>
                </motion.div>
              )}

              {/* ================= INSTRUCTIONS PANEL ================= */}
              {activePanel === 'instructions' && (
                <motion.div
                  key="panel-instructions"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex flex-col flex-1 min-h-0 ${ds.colors.surfaceBlur} border ${ds.colors.borderStrong} ${ds.radius.md} ${ds.shadow.strong} overflow-hidden font-paragraph`}
                >
                  <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                      <span className={ds.text.label + " text-zinc-300"}>Guide</span>
                    </div>
                    <button onClick={() => setActivePanel(null)} className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest border-l-2 border-blue-500 pl-2">Workflow</h4>
                      <ol className="space-y-2.5 text-[11px] text-zinc-400 leading-relaxed">
                        <li><span className="text-zinc-100 font-bold">01.</span> Setup your input source from the top toolbar</li>
                        <li><span className="text-zinc-100 font-bold">02.</span> Draw ROIs using the target tools palette</li>
                        <li><span className="text-zinc-100 font-bold">03.</span> Select training modes and recording duration</li>
                        <li><span className="text-zinc-100 font-bold">04.</span> Run recording and deploy training session</li>
                      </ol>
                    </div>
                    <div className="p-3 bg-white/2 border border-white/5 rounded-lg text-[10px] text-zinc-500 leading-normal italic">
                      Tip: You can use overlapping ROIs for complex detection tasks.
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {viewMode === 'inference' && !['camera', 'oak', 'remote'].includes(inputSource) && (
          <BackendVideoProcessingPanel
            processingState={inference.backendVideoProcessing}
            displayedFrameNumber={
              typeof displayedProcessedFrameNumber === 'number' ? displayedProcessedFrameNumber : null
            }
            liveFrameNumber={liveProcessedFrameNumber}
            isViewingLiveFrame={inference.isFollowingLiveFrame}
            bufferedFrameCount={inference.bufferedProcessedFrameCount}
            isStopping={inference.isStoppingBackendVideo}
            processedVideoUrl={inference.processedVideoUrl}
            onCancelProcessing={() => {
              void inference.stopBackendVideoProcessing();
            }}
            onDismissError={inference.dismissBackendVideoError}
            onPreviousFrame={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              const baseFrame =
                typeof displayedProcessedFrameNumber === 'number'
                  ? displayedProcessedFrameNumber
                  : liveProcessedFrameNumber;
              if (!jobId || typeof baseFrame !== 'number') return;
              void inference.viewProcessedFrame(jobId, Math.max(0, baseFrame - 1));
            }}
            onNextFrame={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              const baseFrame =
                typeof displayedProcessedFrameNumber === 'number'
                  ? displayedProcessedFrameNumber
                  : liveProcessedFrameNumber;
              if (!jobId || typeof baseFrame !== 'number') return;
              void inference.viewProcessedFrame(
                jobId,
                Math.min(liveProcessedFrameNumber, baseFrame + 1)
              );
            }}
            onGoLive={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              if (!jobId) return;
              void inference.goLiveToLatestProcessedFrame(jobId);
            }}
            onPlayProcessedVideo={async () => {
              try {
                const jobId = inference.backendVideoProcessing.jobId;

                // If we previously marked the processed video unsupported, fall back to latest image frame
                if (processedVideoUnsupported) {
                  addTerminalLog('⚠️ Processed video unsupported — showing latest processed frame instead');
                  if (jobId && inference.fetchLatestProcessedFrame) await inference.fetchLatestProcessedFrame(jobId);
                  setInferenceViewerMode('processed');
                  await openFullscreenPopup();
                  return;
                }

                // If a processed video URL isn't available yet, try fetching it from backend
                if (!inference.processedVideoUrl) {
                  if (jobId && inference.fetchProcessedVideoFromBackend) {
                    addTerminalLog('📥 Fetching processed video before play...');
                    const url = await inference.fetchProcessedVideoFromBackend(jobId);
                    if (!url) {
                      // fallback: fetch latest processed frame (still shows image)
                      addTerminalLog('⚠️ Processed video unavailable, loading latest frame instead');
                      if (inference.fetchLatestProcessedFrame) await inference.fetchLatestProcessedFrame(jobId);
                      setInferenceViewerMode('processed');
                      await openFullscreenPopup();
                      return;
                    }
                  } else if (jobId && inference.fetchLatestProcessedFrame) {
                    addTerminalLog('⚠️ No processed video URL; loading latest frame');
                    await inference.fetchLatestProcessedFrame(jobId);
                    setInferenceViewerMode('processed');
                    await openFullscreenPopup();
                    return;
                  }
                }

                // Finally, open processed viewer and attempt to play
                playProcessedInferenceVideo();
                await openFullscreenPopup();
              } catch (err) {
                addTerminalLog(`❌ Failed to prepare processed video: ${err}`);
              }
            }}
            onDownloadVideo={inference.downloadProcessedVideo}
          />
        )}

        {showFullscreenPopup && (
          <div className="fixed inset-0 z-350 flex flex-col bg-black/95">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950/90 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-md">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center shrink-0">
                  <Brain className="mr-2 h-5 w-5 text-purple-400" />
                  <h2 className="text-sm sm:text-lg font-bold text-white">Inference Fullscreen</h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-400 hidden sm:flex items-center">
                  <span
                    className={`rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 ${popupCurrentFrame === 'original' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                      }`}
                  >
                    {popupCurrentFrame === 'original'
                      ? 'Original Feed'
                      : showPersistedProcessedVideo
                        ? 'Processed Video'
                        : 'Processed Frame'}
                  </span>
                  <span className="mx-2 text-neutral-600">|</span>
                  <span>
                    Press <kbd className="ml-1 rounded bg-neutral-800 px-2 py-0.5">K</kbd> to swap
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto">
                {popupCurrentFrame === 'processed' ? (
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-neutral-900/80 p-1">
                    <button
                      onClick={showPreviousProcessedPopupFrame}
                      disabled={popupPreviousDisabled}
                      className="rounded-lg px-2.5 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <div className="min-w-[88px] px-2 text-center text-sm text-neutral-300">
                      {displayedProcessedFrameNumber}/{totalProcessedFramesForDisplay}
                    </div>
                    <button
                      onClick={showNextProcessedPopupFrame}
                      disabled={popupNextDisabled}
                      className="rounded-lg px-2.5 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-30"
                    >
                      Next
                    </button>
                    <button
                      onClick={showLiveProcessedPopupFrame}
                      disabled={popupLiveDisabled}
                      className={`rounded-lg px-3 py-1.5 text-sm transition ${inference.isFollowingLiveFrame
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                        } disabled:opacity-30`}
                    >
                      Live
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLiveView(!isLiveView)}
                    className={`flex items-center rounded-lg px-3 py-1.5 text-sm ${isLiveView ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-800 hover:bg-neutral-700'
                      }`}
                  >
                    {isLiveView ? (
                      <>
                        <div className="mr-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        <span>Live ON</span>
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Live OFF</span>
                      </>
                    )}
                  </button>
                )}
                {/* <button
                  onClick={() => setIsLiveView(!isLiveView)}
                  className={`flex items-center rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm shrink-0 ${isLiveView ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                >
                  {isLiveView ? (
                    <>
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      <span>Live</span>
                    </>
                  )}
                </button> */}

                <button
                  onClick={refreshPopupFrame}
                  className="flex items-center rounded-lg bg-blue-600 px-2 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-blue-700 shrink-0"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={downloadPopupFrame}
                  className="flex items-center rounded-lg bg-green-600 px-2 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                  disabled={
                    popupCurrentFrame === 'original'
                      ? !popupOriginalFrame
                      : !(showPersistedProcessedVideo || popupProcessedFrame)
                  }
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {popupCurrentFrame === 'processed' && showPersistedProcessedVideo
                      ? 'Download Video'
                      : 'Download'}
                  </span>
                </button>

                <button
                  onClick={closeFullscreenPopup}
                  className="flex items-center rounded-lg bg-red-600 px-2 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-red-700 shrink-0"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-black">
              <div className="absolute left-4 top-4 z-20">
                <div className="rounded-lg bg-black/70 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                  {popupCurrentFrame === 'original'
                    ? 'Original Feed'
                    : showPersistedProcessedVideo
                      ? 'Processed Video'
                      : 'Processed Frame'}
                  {isLiveView && (
                    <span className="ml-2 text-green-400">
                      {showPersistedProcessedVideo && popupCurrentFrame === 'processed'
                        ? 'VIDEO READY'
                        : 'LIVE'}
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute right-4 top-4 z-20 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-sm text-neutral-200">
                    {showPersistedProcessedVideo && popupCurrentFrame === 'processed'
                      ? 'Processed video playback'
                      : 'Live updates active'}
                  </span>
                </div>
              </div>

              <div className="flex h-full w-full items-center justify-center p-2 sm:p-4 md:p-8">
                {popupCurrentFrame === 'original' ? (
                  popupOriginalFrame ? (
                    <img
                      ref={fullscreenImageRef}
                      src={popupOriginalFrame}
                      className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                      alt="Original frame"
                    />
                  ) : (
                    <div className="rounded-xl bg-neutral-900/60 p-8 text-center">
                      <Video className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                      <div className="mb-2 text-lg text-neutral-300">No original frame available</div>
                      <div className="text-sm text-neutral-500">
                        Make sure the source feed is playing before opening fullscreen.
                      </div>
                    </div>
                  )
                ) : showPersistedProcessedVideo && inference.processedVideoUrl ? (
                  <video
                    key={inference.processedVideoUrl}
                    ref={fullscreenVideoRef}
                    src={inference.processedVideoUrl}
                    className="max-h-full max-w-full rounded-lg bg-black object-contain shadow-2xl"
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                      setLastFrameUpdateTime(Date.now());
                      void fullscreenVideoRef.current?.play().catch(() => undefined);
                    }}
                    onTimeUpdate={() => {
                      setLastFrameUpdateTime(Date.now());
                    }}
                    onError={() => {
                      addTerminalLog('Failed to load fullscreen processed video');
                    }}
                  />
                ) : popupProcessedFrame ? (
                  <img
                    ref={fullscreenImageRef}
                    src={popupProcessedFrame}
                    className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                    alt="Processed frame"
                  />
                ) : (
                  <div className="rounded-xl bg-neutral-900/60 p-8 text-center">
                    <Brain className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                    <div className="mb-2 text-lg text-neutral-300">No processed output available</div>
                    <div className="text-sm text-neutral-500">
                      Run inference or refresh the latest processed result.
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPopupCurrentFrame('original')}
                className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-all ${popupCurrentFrame === 'original'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                  }`}
                title="Show original"
              >
                <Eye className="h-5 w-5" />
              </button>

              <button
                onClick={() => setPopupCurrentFrame('processed')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-all ${popupCurrentFrame === 'processed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                  }`}
                title="Show processed"
              >
                <Brain className="h-5 w-5" />
              </button>

              {inference.backendVideoProcessing.isProcessing && (
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2">
                  <div className="text-sm">
                    Frame: {inference.backendVideoProcessing.currentFrame}/
                    {inference.backendVideoProcessing.totalFrames}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {inference.backendVideoProcessing.progress.toFixed(1)}% complete
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-2">
                <div className="text-xs text-neutral-400">
                  Last update:{' '}
                  {lastFrameUpdateTime ? new Date(lastFrameUpdateTime).toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800 bg-neutral-950/90 px-3 sm:px-6 py-2 sm:py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-neutral-400">Current:</span>
                    <span className="ml-1 sm:ml-2 font-medium">
                      {popupCurrentFrame === 'original'
                        ? 'Original'
                        : showPersistedProcessedVideo
                          ? 'Processed Video'
                          : 'Processed Frame'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Live:</span>
                    <span className={`ml-1 sm:ml-2 font-medium ${isLiveView ? 'text-green-400' : 'text-red-400'}`}>
                      {isLiveView ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-neutral-400">Model:</span>
                    <span className="ml-2 font-medium">
                      {inference.selectedModelInfo?.display_name || 'None'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-neutral-400">Frames:</span>
                    <span className="ml-2 font-medium">{inference.inferenceStats.totalFrames}</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-neutral-400">Anomalies:</span>
                    <span className="ml-2 font-medium text-red-400">
                      {inference.inferenceStats.totalAnomalies}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${popupCurrentFrame === 'original' ? 'bg-blue-500' : 'bg-neutral-700'
                        }`}
                    />
                    <span className="text-xs text-neutral-400">Original</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${popupCurrentFrame === 'processed' ? 'bg-purple-500' : 'bg-neutral-700'
                        }`}
                    />
                    <span className="text-xs text-neutral-400">Processed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Footer - Hidden on mobile */}
        <div className="hidden md:block">
          {viewMode === "training" ? (
            <TrainingFooter
              roisCount={rois.length}
              frameRate={frameRate}
              sessionName={sessionName}
              recordingDuration={recordingDuration}
              captureCount={captureCount}
              backendExtractionMode={backendExtractionMode}
              extractionStatus={extractionStatus}
              inputSource={inputSource}
              remoteCameraStatus={remoteCameraStatus}
              drawingMode={drawingMode}
              showTerminal={showTerminal}
            />
          ) : (
            <InferenceFooter
              selectedModelInfo={inference.selectedModelInfo}
              inferenceStats={inference.inferenceStats}
              isProcessing={inference.isProcessing}
              activeTab={activeInferenceTab}
              inputSource={inputSource}
              isOakStreaming={isOakStreaming}
              availableCameras={availableCameras}
              connectionError={inference.connectionError}
              loadedModelInfo={inference.loadedModelInfo}
            />
          )}
        </div>
      </div>

      {/* Mobile Side Panel Menu - Settings/Controls/Terminal/Instructions */}
      <MobileSidePanelMenu
        isOpen={mobileActivePanelMenu !== null}
        onClose={() => setMobileActivePanelMenu(null)}
        panelTitle={mobilePanelTitle}
      >
        {false && (
          <>
            {/* Training Controls Content */}
            {mobileActivePanelMenu === 'controls' && viewMode === 'training' && (
              <div className="space-y-4">
                {/* Model Selection */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-neutral-800 pb-2">
                    Training Models
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/40 border border-neutral-700 cursor-pointer hover:bg-neutral-700/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={trainingTypes.anomaly}
                        onChange={() => setTrainingTypes(prev => ({ ...prev, anomaly: !prev.anomaly }))}
                        className="w-4 h-4 rounded-md"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Anomaly Detection</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/40 border border-neutral-700 cursor-pointer hover:bg-neutral-700/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={trainingTypes.sequential}
                        onChange={() => setTrainingTypes(prev => ({ ...prev, sequential: !prev.sequential }))}
                        className="w-4 h-4 rounded-md"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Sequential Analysis</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/40 border border-neutral-700 cursor-pointer hover:bg-neutral-700/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={trainingTypes.motion}
                        onChange={() => setTrainingTypes(prev => ({ ...prev, motion: !prev.motion }))}
                        className="w-4 h-4 rounded-md"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Motion Tracking</span>
                    </label>
                  </div>
                </div>

                {/* Recording Settings */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-neutral-800 pb-2">
                    Recording Settings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Frame Rate</span>
                        <span className="text-[10px] font-bold text-blue-400">{frameRate} FPS</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={frameRate}
                        onChange={(e) => setFrameRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-700 rounded-full cursor-pointer accent-blue-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Duration</span>
                        <span className="text-[10px] font-bold text-blue-400">{recordingDuration}s</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={recordingDuration}
                        onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-700 rounded-full cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inference Controls Content */}
            {mobileActivePanelMenu === 'inference' && viewMode === 'inference' && (
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-400">Inference settings are available in the full app interface. Use the model dropdown from the bottom toolbar to switch models.</p>
              </div>
            )}

            {/* Terminal Content */}
            {mobileActivePanelMenu === 'terminal' && (
              <div className="space-y-3">
                <div className="max-h-96 p-3 bg-black/40 border border-neutral-700 rounded-lg font-mono text-[9px] overflow-y-auto custom-scrollbar space-y-1.5">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setTerminalLogs([])}
                    className="flex-1 px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-700/50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Instructions Content */}
            {mobileActivePanelMenu === 'instructions' && (
              <div className="space-y-4 font-paragraph">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest border-l-2 border-blue-500 pl-2">Workflow</h4>
                  <ol className="space-y-2.5 text-[11px] text-zinc-400 leading-relaxed">
                    <li><span className="text-zinc-100 font-bold">01.</span> Setup your input source from the top toolbar</li>
                    <li><span className="text-zinc-100 font-bold">02.</span> Draw ROIs using the target tools palette</li>
                    <li><span className="text-zinc-100 font-bold">03.</span> Select training modes and recording duration</li>
                    <li><span className="text-zinc-100 font-bold">04.</span> Run recording and deploy training session</li>
                  </ol>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-lg text-[10px] text-zinc-500 leading-normal italic">
                  Tip: You can use overlapping ROIs for complex detection tasks.
                </div>
              </div>
            )}
          </>
        )}
        {renderMobilePanelContent()}
      </MobileSidePanelMenu>
    </main >
  );
}
