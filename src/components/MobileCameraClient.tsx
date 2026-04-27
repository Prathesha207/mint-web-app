'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Camera, Loader2, Smartphone, Square, Wifi, WifiOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type StreamStatus =
  | 'idle'
  | 'starting'
  | 'waiting'
  | 'connected'
  | 'streaming'
  | 'stopped'
  | 'error';

type CameraStats = {
  width: number;
  height: number;
  framesSent: number;
};

const getBackendHttpBase = (rawValue: string) => {
  const normalized = rawValue.trim().replace(/\/$/, '');
  if (!normalized) {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:8000';
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  return `${protocol}//${normalized}`;
};

export default function MobileCameraClient() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const frameTimerRef = useRef<number | null>(null);
  const manuallyStoppedRef = useRef(false);

  const [fps, setFps] = useState(20);
  const [quality, setQuality] = useState(0.8);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CameraStats>({
    width: 0,
    height: 0,
    framesSent: 0,
  });
  const sessionId = searchParams.get('session') || '';
  const resolvedStatusMessage =
    statusMessage ||
    (sessionId
      ? `Ready to connect to session ${sessionId}.`
      : 'Open this page from the mint QR code so the phone knows which session to join.');

  const backendHttpBase = useMemo(
    () => getBackendHttpBase(process.env.NEXT_PUBLIC_BACKEND_URL || 'losses-harris-homework-roll.trycloudflare.com'),
    []
  );

  const backendWsBase = useMemo(() => {
    const parsed = new URL(backendHttpBase);
    return `${parsed.protocol === 'https:' ? 'wss:' : 'ws:'}//${parsed.host}`;
  }, [backendHttpBase]);

  const isStreaming = status === 'streaming';
  const isBusy = status === 'starting' || status === 'waiting' || status === 'connected';

  const stopFrameLoop = () => {
    if (frameTimerRef.current !== null) {
      // Handle both setInterval and requestAnimationFrame
      cancelAnimationFrame(frameTimerRef.current as unknown as number);
      window.clearInterval(frameTimerRef.current);
      frameTimerRef.current = null;
    }
  };

  const releaseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  };

  const closeSocket = () => {
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {
        // ignored
      }
      socketRef.current = null;
    }
  };

  const cleanupTransport = () => {
    stopFrameLoop();
    closeSocket();
    releaseCamera();
  };

  const stopCamera = (notifyServer = true) => {
    manuallyStoppedRef.current = true;

    if (notifyServer && socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify({ type: 'stop' }));
      } catch {
        // ignored
      }
    }

    cleanupTransport();
    setStatus('stopped');
    setStatusMessage('Remote camera stopped.');
  };

  const startFrameLoop = () => {
    stopFrameLoop();

    let lastFrameTime = 0;
    const frameInterval = Math.max(16, Math.round(1000 / Math.max(fps, 1))); // ms between frames

    const sendFrame = async () => {
      const now = Date.now();

      // Only send frame if enough time has passed (respect FPS target)
      if (now - lastFrameTime < frameInterval) {
        frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
        return;
      }

      const socket = socketRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN || !video || !canvas) {
        frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
        return;
      }

      if (video.videoWidth <= 0 || video.videoHeight <= 0) {
        frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
        return;
      }

      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use toBlob for better performance than toDataURL (async encoding)
        canvas.toBlob(
          (blob) => {
            if (!blob || !socket || socket.readyState !== WebSocket.OPEN) return;

            const reader = new FileReader();
            reader.onload = () => {
              try {
                const base64 = (reader.result as string).split(',')[1];
                socket.send(
                  JSON.stringify({
                    type: 'frame',
                    frame: base64,
                    width: canvas.width,
                    height: canvas.height,
                    fps,
                    timestamp: now,
                  })
                );

                setStats((prev) => ({
                  width: canvas.width,
                  height: canvas.height,
                  framesSent: prev.framesSent + 1,
                }));
              } catch (sendError) {
                console.error('Frame send failed:', sendError);
              }
            };
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );

        lastFrameTime = now;
      } catch (streamError) {
        console.error('Remote frame capture failed:', streamError);
      }

      frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
    };

    frameTimerRef.current = window.requestAnimationFrame(() => sendFrame());
  };

  const startRemoteCamera = async () => {
    if (!sessionId) {
      setError('No remote session was provided. Open this page from the mint workspace QR code.');
      setStatus('error');
      return;
    }

    manuallyStoppedRef.current = false;
    setError(null);
    setStatus('starting');
    setStatusMessage('Requesting mobile camera access...');
    setStats({ width: 0, height: 0, framesSent: 0 });

    try {
      cleanupTransport();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: Math.max(fps, 15) },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus('waiting');
      setStatusMessage('Opening secure stream to the mint workspace...');

      const wsUrl = new URL(`/api/remote-camera/ws/${encodeURIComponent(sessionId)}/mobile`, backendWsBase);
      const socket = new WebSocket(wsUrl.toString());
      socketRef.current = socket;

      socket.onopen = () => {
        setStatus('connected');
        setStatusMessage('Mobile camera connected. Starting live stream...');
        socket.send(
          JSON.stringify({
            type: 'hello',
            device_info: navigator.userAgent,
          })
        );
        startFrameLoop();
        setStatus('streaming');
        setStatusMessage('Streaming live video to the mint workspace.');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            setError(typeof data.message === 'string' ? data.message : 'Remote streaming error');
            setStatus('error');
            setStatusMessage('The backend rejected the mobile stream.');
            stopFrameLoop();
            return;
          }

          if (data.type === 'connected' && typeof data.message === 'string') {
            setStatusMessage(data.message);
          }
        } catch (parseError) {
          console.error('Remote mobile message parse error:', parseError);
        }
      };

      socket.onerror = () => {
        setError('The mobile stream could not reach the backend WebSocket.');
        setStatus('error');
        setStatusMessage('Backend connection error.');
        stopFrameLoop();
      };

      socket.onclose = () => {
        socketRef.current = null;
        stopFrameLoop();

        if (manuallyStoppedRef.current) {
          return;
        }

        releaseCamera();
        setStatus('error');
        setStatusMessage('The backend connection closed.');
        setError('Remote camera disconnected. Re-open the session from the mint page and try again.');
      };
    } catch (cameraError: unknown) {
      console.error('Mobile camera start failed:', cameraError);
      releaseCamera();
      closeSocket();
      stopFrameLoop();

      const normalizedError =
        cameraError instanceof Error
          ? cameraError
          : new Error(typeof cameraError === 'string' ? cameraError : 'Unable to start the mobile camera.');
      const message =
        normalizedError.name === 'NotAllowedError'
          ? 'Camera permission was denied.'
          : normalizedError.name === 'NotFoundError'
            ? 'No usable camera was found on this device.'
            : normalizedError.name === 'NotReadableError'
              ? 'The camera is already in use by another app.'
              : normalizedError.message || 'Unable to start the mobile camera.';

      setError(message);
      setStatus('error');
      setStatusMessage('Unable to start remote camera streaming.');
    }
  };

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    startFrameLoop();
    return () => stopFrameLoop();
  }, [fps, quality, isStreaming]);

  useEffect(() => {
    return () => {
      manuallyStoppedRef.current = true;
      cleanupTransport();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_35%),linear-gradient(180deg,#050816_0%,#0b1120_100%)] px-4 py-6 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Remote Mobile Camera</h1>
                {/* <p className="text-sm text-slate-300">
                  Stream the original phone camera feed directly into the mint training and inference workspace.
                </p> */}
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isStreaming
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700 bg-slate-900/80 text-slate-300'
                }`}
            >
              {isStreaming ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {isStreaming ? 'Live' : 'Idle'}
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 shadow-[0_24px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Session</p>
                <p className="mt-1 font-mono text-sm text-slate-100">{sessionId || 'Missing session ID'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
                <p className="mt-1 text-sm text-slate-200">{resolvedStatusMessage}</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-inner">
              <div className="aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-contain"
                />
                {!isStreaming && !isBusy && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80 text-center">
                    <Camera className="h-14 w-14 text-slate-500" />
                    <div>
                      <p className="text-base font-medium text-slate-200">Camera preview will appear here</p>
                      <p className="text-sm text-slate-400">Tap Start Remote Camera when you are ready.</p>
                    </div>
                  </div>
                )}
                {isBusy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-100">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Preparing mobile stream...
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Resolution</p>
                  <p className="text-sm font-medium text-slate-100">
                    {stats.width > 0 && stats.height > 0 ? `${stats.width} × ${stats.height}` : 'Waiting for camera'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Frames Sent</p>
                  <p className="text-sm font-medium text-slate-100">{stats.framesSent}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Target FPS</p>
                  <p className="text-sm font-medium text-slate-100">{fps}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200" htmlFor="remote-fps">
                    Frame Rate
                  </label>
                  <span className="text-sm text-blue-300">{fps} FPS</span>
                </div>
                <input
                  id="remote-fps"
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={fps}
                  onChange={(event) => setFps(Number(event.target.value))}
                  disabled={isStreaming}
                  className="mt-4 w-full accent-blue-500"
                />

                <div className="mt-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200" htmlFor="remote-quality">
                    JPEG Quality
                  </label>
                  <span className="text-sm text-emerald-300">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  id="remote-quality"
                  type="range"
                  min="0.4"
                  max="0.95"
                  step="0.05"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  disabled={isStreaming}
                  className="mt-4 w-full accent-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/65 p-4">
                <button
                  type="button"
                  onClick={() => void startRemoteCamera()}
                  disabled={!sessionId || isStreaming || isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  Start Remote Camera
                </button>
                <button
                  type="button"
                  onClick={() => stopCamera()}
                  disabled={!isStreaming && !isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Square className="h-4 w-4" />
                  Stop Camera
                </button>

              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-300" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
