'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CameraStreamProps {
  /** Callback when camera stream is successfully started */
  onStreamStart?: (stream: MediaStream) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** CSS class name for custom styling */
  className?: string;
  /** Width of the video container (default: 100%) */
  width?: string | number;
  /** Height of the video container (default: 100%) */
  height?: string | number;
}

export const CameraStream: React.FC<CameraStreamProps> = ({
  onStreamStart,
  onError,
  className = '',
  width = '100%',
  height = '100%',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => {
              console.log('CameraStream: playback started');
            })
            .catch((err) => {
              console.warn('CameraStream: autoplay blocked', err);
            });
        }

        onStreamStart?.(stream);
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message);
        onError?.(error);
        setIsLoading(false);

        // Handle specific error types
        if (error.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          setError('No camera device found. Please connect a camera and try again.');
        } else if (error.name === 'NotReadableError') {
          setError('Camera is already in use by another application.');
        }
      }
    };

    startCamera();

    // Cleanup: stop the stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [onStreamStart, onError]);

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="mb-2">Requesting camera access...</div>
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-white text-center px-4 py-4 bg-red-900/80 rounded-lg max-w-xs">
            <div className="font-semibold mb-2">Camera Access Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraStream;
