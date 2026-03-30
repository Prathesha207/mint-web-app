'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Zap, Upload, Smartphone, AlertCircle, Wifi, Settings, Battery, Sparkles, QrCode, Monitor, WifiOff, CheckCircle, RotateCcw, Shield, Target, Square, Hexagon, MousePointer, Brain, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Define NetworkInformation interface for TypeScript
interface NetworkInformation {
  downlink: number;
  effectiveType: string;
  rtt: number;
  saveData: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

interface ROI {
  id: string;
  type: 'rectangle' | 'polygon';
  points: { x: number; y: number }[];
  label: string;
  color: string;
}
export default function MobileCameraPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('Ready to connect');
  const [frameInterval, setFrameInterval] = useState<NodeJS.Timeout | null>(null);
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState(0.7);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [cameraStats, setCameraStats] = useState({ width: 0, height: 0, framesSent: 0 });
  const [showDebug, setShowDebug] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const searchParams = useSearchParams();

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'games-measure-gap-rows.trycloudflare.com';

  useEffect(() => {
    const session = searchParams.get('session');
    if (session) {
      setSessionId(session);
      setStatus(`Session: ${session}`);
    }

    // Auto-detect network quality - Fixed with proper type checking
    detectConnectionQuality();

    return () => {
      stopStreaming();
    };
  }, [searchParams]);

  const detectConnectionQuality = () => {
    // Check if running in browser and if connection API exists
    if (typeof navigator !== 'undefined' && 'connection' in navigator && navigator.connection) {
      const connection = navigator.connection;
      if (connection.downlink < 1) {
        setConnectionQuality('poor');
      } else if (connection.downlink < 3) {
        setConnectionQuality('fair');
      } else {
        setConnectionQuality('good');
      }
    }
  };

  const checkCameraPermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        setCameraError('📷 No camera found');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error checking camera:', err);
      setCameraError('🔒 Cannot access camera');
      return false;
    }
  };

  const ensureCameraReleased = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  };

  const startCamera = async () => {
    try {
      setError(null);
      setCameraError(null);

      await ensureCameraReleased();

      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        setStatus('🔒 Camera permission needed');
        return;
      }

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await new Promise((resolve, reject) => {
          const video = videoRef.current!;

          const onLoaded = () => {
            video.play().then(resolve).catch(reject);
          };

          const onError = () => {
            reject(new Error('Video element error'));
          };

          video.onloadedmetadata = onLoaded;
          video.onerror = onError;

          setTimeout(() => {
            if (!video.readyState) {
              reject(new Error('Camera timeout'));
            }
          }, 5000);
        });

        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        setCameraStats(prev => ({
          ...prev,
          width: settings.width || 0,
          height: settings.height || 0
        }));
      }

      setIsStreaming(true);
      setStatus('🎥 Camera ready - Tap Connect');

    } catch (error: any) {
      console.error('Error accessing camera:', error);

      await ensureCameraReleased();

      if (error.name === 'NotAllowedError') {
        setError('Permission denied. Allow camera access in browser settings.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera available on this device.');
      } else if (error.name === 'NotReadableError') {
        setError('Camera is busy. Close other camera apps.');
      } else {
        setError(`Camera error: ${error.message}`);
      }

      setIsStreaming(false);
    }
  };

  const connectToSession = async () => {
    if (!sessionId) {
      setError('Missing session ID');
      return;
    }

    setIsConnecting(true);
    setStatus('🔗 Connecting...');

    try {
      const testResponse = await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/test/${sessionId}`);

      if (!testResponse.ok) {
        throw new Error(`Connection failed (${testResponse.status})`);
      }

      await testResponse.json();

      setConnected(true);
      setIsConnecting(false);
      setStatus('✅ Connected - Streaming');

      startFrameStreaming();

    } catch (error: any) {
      console.error('Connection error:', error);
      setError(`Connection failed: ${error.message}`);
      setStatus('❌ Connection failed');
      setIsConnecting(false);
    }
  };

  const startFrameStreaming = () => {
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return;

      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL('image/jpeg', quality);
        const base64Data = base64Image.split(',')[1];

        await fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/frame/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frame: base64Data,
            width: canvas.width,
            height: canvas.height,
            timestamp: Date.now(),
            fps: fps
          }),
        });

        setCameraStats(prev => ({
          ...prev,
          framesSent: prev.framesSent + 1
        }));

      } catch (error) {
        console.log('Frame send error (continuing)', error);
      }
    }, 1000 / fps);

    setFrameInterval(interval);
  };

  const stopStreaming = () => {
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }

    ensureCameraReleased();

    setIsStreaming(false);
    setConnected(false);
    setIsConnecting(false);
    setStatus('⏹️ Streaming stopped');
    setCameraStats(prev => ({ ...prev, framesSent: 0 }));

    if (sessionId) {
      fetch(`https://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/stop/${sessionId}`, {
        method: 'POST'
      }).catch(() => { });
    }
  };

  const hardResetCamera = async () => {
    stopStreaming();
    setError(null);
    setCameraError(null);
    setStatus('🔄 Reset complete - Ready');
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const copySessionId = () => {
    if (!sessionId) return;

    navigator.clipboard.writeText(sessionId);
    setStatus('📋 Session ID copied!');
    setTimeout(() => {
      if (connected) setStatus('✅ Connected - Streaming');
      else if (isStreaming) setStatus('🎥 Camera ready - Tap Connect');
      else setStatus('Ready to connect');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 pb-20">
      {/* Header with Glass Effect */}
      <header className="mb-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <Camera className="w-10 h-10 text-blue-400 relative z-10" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                VisionStream Pro
              </h1>
              <p className="text-gray-400 text-sm">Stream mobile camera to AI training system</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${connected ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-300 animate-pulse' : 'bg-yellow-300'}`}></div>
              {connected ? 'LIVE' : 'OFFLINE'}
            </div>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Toggle debug"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="backdrop-blur-lg bg-gradient-to-br from-blue-900/20 to-blue-900/5 rounded-2xl p-5 border border-blue-500/20">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <QrCode className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Session ID</p>
                <button
                  onClick={copySessionId}
                  className="font-mono text-sm hover:text-blue-300 transition-colors text-left truncate max-w-[150px]"
                  title={sessionId || 'No session'}
                >
                  {sessionId || 'No session'}
                </button>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-br from-purple-900/20 to-purple-900/5 rounded-2xl p-5 border border-purple-500/20">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wifi className="w-5 h-5 text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Connection</p>
                <p className="text-lg font-semibold">
                  {connectionQuality === 'good' ? 'Excellent' : connectionQuality === 'fair' ? 'Fair' : 'Poor'}
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-br from-green-900/20 to-green-900/5 rounded-2xl p-5 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-lg font-semibold truncate max-w-[150px]">{status}</p>
              </div>
              {connected && (
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full"></div>
                  <div className="relative animate-pulse">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Camera Preview with Glass Frame */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
          <div className="relative backdrop-blur-lg bg-black/30 rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
            {isStreaming ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-black/50">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-2xl opacity-20 rounded-full"></div>
                  <Camera className="w-24 h-24 text-gray-600 relative" />
                </div>
                <p className="text-gray-400 mb-2">Camera preview will appear here</p>
                <p className="text-sm text-gray-500">Tap "Start Camera" to begin</p>
              </div>
            )}

            {/* Camera Overlay Stats */}
            {isStreaming && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="backdrop-blur-md bg-black/40 rounded-xl p-3">
                  <div className="text-xs text-gray-300">
                    {cameraStats.width}x{cameraStats.height} @ {fps}fps
                  </div>
                  <div className="text-xs text-gray-400">
                    Frames: {cameraStats.framesSent}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-2 rounded-full ${connected ? 'bg-gradient-to-t from-green-400 to-emerald-500' : 'bg-gray-600'}`}
                      style={{
                        height: connected ? `${Math.random() * 16 + 16}px` : '16px',
                        animation: connected ? `pulse ${0.5 + i * 0.2}s infinite` : 'none'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls Floating */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-4">
              {!isStreaming ? (
                <button
                  onClick={startCamera}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full font-medium flex items-center shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </button>
              ) : !connected ? (
                <button
                  onClick={connectToSession}
                  disabled={isConnecting}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full font-medium flex items-center shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Connect & Stream
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={stopStreaming}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full font-medium flex items-center shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                >
                  <X className="w-5 h-5 mr-2" />
                  Stop Streaming
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-400" />
              Stream Settings
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Frame Rate</span>
                  <span className="font-bold text-cyan-300">{fps} FPS</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-blue-500"
                  disabled={connected}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Quality</span>
                  <span className="font-bold text-green-300">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-500"
                  disabled={connected}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={hardResetCamera}
                  className="py-3 bg-gradient-to-r from-purple-900/30 to-purple-900/10 hover:from-purple-800/40 hover:to-purple-800/20 rounded-xl font-medium flex items-center justify-center border border-purple-500/20 transition-all"
                  disabled={!isStreaming && !connected}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="py-3 bg-gradient-to-r from-gray-800/30 to-gray-800/10 hover:from-gray-700/40 hover:to-gray-700/20 rounded-xl font-medium flex items-center justify-center border border-gray-600/20 transition-all"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload
                </button>
              </div>
            </div>
          </div>

          {/* Connection Panel */}
          <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-green-400" />
              Connection Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/30 to-gray-800/10 rounded-xl border border-gray-600/20">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${connected ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    {connected ? <CheckCircle className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Backend Server</p>
                    <p className="text-sm text-gray-400 truncate max-w-[200px]">https://{NEXT_PUBLIC_BACKEND_URL}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${connected ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-900/20 to-blue-900/5 rounded-xl border border-blue-500/20">
                  <p className="text-sm text-gray-400">Data Sent</p>
                  <p className="text-xl font-bold">{cameraStats.framesSent} frames</p>
                </div>

                <div className="p-3 bg-gradient-to-r from-purple-900/20 to-purple-900/5 rounded-xl border border-purple-500/20">
                  <p className="text-sm text-gray-400">Stream Quality</p>
                  <p className="text-xl font-bold">{Math.round(quality * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(error || cameraError) && (
          <div className="backdrop-blur-lg bg-gradient-to-r from-red-900/20 to-red-900/5 rounded-2xl p-5 border border-red-500/20 animate-pulse">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-300">Attention Required</h3>
                <p className="text-red-200 mt-1">{error || cameraError}</p>
                {error?.includes('permission') && (
                  <button
                    onClick={() => navigator.mediaDevices.getUserMedia({ video: true })
                      .then(stream => stream.getTracks().forEach(t => t.stop()))
                      .catch(() => { })}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-sm transition-all"
                  >
                    Request Permission
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Debug Info (Collapsible) */}
        {showDebug && (
          <div className="backdrop-blur-lg bg-black/30 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-gray-400" />
                Debug Information
              </h2>
              <button
                onClick={() => setShowDebug(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-gray-400">Platform</p>
                <p className="truncate">{typeof navigator !== 'undefined' ? navigator.platform : 'Server'}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-gray-400">Browser</p>
                <p className="truncate">{typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 30) + '...' : 'Server'}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-gray-400">Secure</p>
                <p className={typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'text-green-400' : 'text-yellow-400'}>
                  {typeof window !== 'undefined' ? (window.location.protocol === 'https:' ? 'HTTPS ✅' : 'HTTP ⚠️') : 'Server'}
                </p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-gray-400">Resolution</p>
                <p>{cameraStats.width}x{cameraStats.height || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Guide */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-gray-900/30 to-gray-900/10 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Quick Start Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <div>
                  <p className="font-medium">Start Camera</p>
                  <p className="text-sm text-gray-400">Allow camera access when prompted</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <div>
                  <p className="font-medium">Connect to Session</p>
                  <p className="text-sm text-gray-400">Link with your computer session</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <div>
                  <p className="font-medium">Adjust Settings</p>
                  <p className="text-sm text-gray-400">Optimize FPS & quality for your network</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <div>
                  <p className="font-medium">Position Camera</p>
                  <p className="text-sm text-gray-400">Point at your subject and start training</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl border border-cyan-500/20">
            <p className="text-sm text-gray-300">
              💡 <strong>Pro Tip:</strong> Use good lighting and stable connection for best results.
              Lower quality for poor networks, increase FPS for fast-moving subjects.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
        </div>
        <p className="text-gray-500 text-sm">VisionStream Pro • v2.0 • Secure Real-time Streaming</p>
        <p className="text-gray-600 text-xs mt-1">Connected to: https://{NEXT_PUBLIC_BACKEND_URL}</p>
      </footer>

      <canvas ref={canvasRef} className="hidden" />

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          border: none;
        }
        
        input[type="range"] {
          background: transparent;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: #374151;
          border-radius: 0.5rem;
          height: 8px;
        }
        
        input[type="range"]::-moz-range-track {
          background: #374151;
          border-radius: 0.5rem;
          height: 8px;
        }
      `}</style>
    </div>
  );
}