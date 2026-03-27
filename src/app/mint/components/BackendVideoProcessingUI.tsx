'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  Expand,
  FileVideo,
  Play,
  RefreshCw,
  X,
} from 'lucide-react';
import type {
  BackendVideoProcessingState,
  UploadedVideoInfo,
} from '../hooks/useInference';

interface UploadedVideoProcessingModalProps {
  open: boolean;
  uploadedVideoInfo: UploadedVideoInfo | null;
  onClose: () => void;
  onStartInference: () => void;
  isStarting?: boolean;
}

export function UploadedVideoProcessingModal({
  open,
  uploadedVideoInfo,
  onClose,
  onStartInference,
  isStarting = false,
}: UploadedVideoProcessingModalProps) {
  if (!open || !uploadedVideoInfo) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full max-w-xs rounded-md border border-neutral-800 bg-neutral-900 shadow-xl"
        >
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center text-xs font-semibold text-white">
                <FileVideo className="mr-1 h-3 w-3 text-green-400" />
                Video Uploaded
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-md bg-neutral-800/50 p-3">
                <div className="mb-1 text-neutral-400">File Name</div>
                <div className="truncate text-white">{uploadedVideoInfo.fileName}</div>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <div className="mb-0.5 text-neutral-400">Size</div>
                    <div className="text-white">{uploadedVideoInfo.fileSize}</div>
                  </div>
                  <div>
                    <div className="mb-0.5 text-neutral-400">Uploaded</div>
                    <div className="text-white">{uploadedVideoInfo.uploadedAt}</div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="mb-0.5 text-neutral-400">Job ID</div>
                  <div className="rounded bg-neutral-900 p-1.5 text-[11px] font-mono text-neutral-200">
                    {uploadedVideoInfo.jobId}
                  </div>
                </div>
              </div>

              <div className="text-neutral-300">
                Video uploaded successfully. Ready for inference.
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onStartInference}
                  disabled={isStarting}
                  className="flex flex-1 items-center justify-center rounded-md bg-green-600 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                >
                  <Play className="mr-1 h-3 w-3" />
                  {isStarting ? 'Starting...' : 'Start Inference'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isStarting}
                  className="rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>

              <div className="text-center text-[10px] text-neutral-500">
                Inference runs frame by frame.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface BackendVideoProcessingPanelProps {
  processingState: BackendVideoProcessingState;
  processedVideoUrl?: string;
  onCancelProcessing: () => void;
  onDismissError: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onRefreshLatest: () => void;
  onPlayProcessedVideo?: () => void;
  onDownloadVideo: () => void;
  className?: string;
}

export function BackendVideoProcessingPanel({
  processingState,
  processedVideoUrl = '',
  onCancelProcessing,
  onDismissError,
  onPreviousFrame,
  onNextFrame,
  onRefreshLatest,
  onPlayProcessedVideo,
  onDownloadVideo,
  className = '',
}: BackendVideoProcessingPanelProps) {
  const [collapsedStatus, setCollapsedStatus] =
    useState<BackendVideoProcessingState['status'] | null>(null);

  if (
    processingState.status === 'uploaded' ||
    (!processingState.isProcessing && processingState.status === 'idle')
  ) {
    return null;
  }

  const isExpanded =
    processingState.status === 'processing' ||
      processingState.status === 'paused' ||
      processingState.status === 'completed' ||
      processingState.status === 'error'
      ? collapsedStatus !== processingState.status
      : false;
  const previousDisabled = processingState.currentFrame <= 0;
  const nextDisabled =
    processingState.totalFrames > 0 &&
    processingState.currentFrame >= processingState.totalFrames;

  const icon =
    processingState.status === 'processing' ? (
      <RefreshCw className="h-5 w-5 animate-spin text-white" />
    ) : processingState.status === 'paused' ? (
      <CheckCircle className="h-5 w-5 text-white" />
    ) : processingState.status === 'completed' ? (
      <CheckCircle className="h-5 w-5 text-white" />
    ) : processingState.status === 'error' ? (
      <AlertTriangle className="h-5 w-5 text-white" />
    ) : (
      <Cpu className="h-5 w-5 text-white" />
    );

  const color =
    processingState.status === 'processing'
      ? 'bg-purple-600'
      : processingState.status === 'paused'
        ? 'bg-amber-600'
        : processingState.status === 'completed'
          ? 'bg-green-600'
          : processingState.status === 'error'
            ? 'bg-red-600'
            : 'bg-neutral-700';

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCollapsedStatus(isExpanded ? processingState.status : null);
        }}
        className={`fixed bottom-10 left-6 z-[200] flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${color}`}
      >
        {icon}
      </button>

      {isExpanded && (
        <div className={`fixed bottom-20 left-6 z-[200] w-80 ${className}`}>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center text-sm font-semibold text-white">
                <Cpu className="mr-2 h-4 w-4 text-purple-400" />
                Backend Processing
                {processingState.status === 'processing' && (
                  <span className="ml-2 rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] text-yellow-400">
                    LIVE
                  </span>
                )}
              </h3>

              {processingState.status === 'processing' && (
                <button
                  type="button"
                  onClick={onCancelProcessing}
                  className="rounded bg-red-600 px-3 py-1 text-xs transition-colors hover:bg-red-700"
                >
                  Stop
                </button>
              )}
            </div>

            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-neutral-400">
                <span>
                  {processingState.status === 'processing'
                    ? `Frame ${processingState.currentFrame}/${processingState.totalFrames}`
                    : processingState.status}
                </span>
                <span>{processingState.progress.toFixed(0)}%</span>
              </div>

              <div className="h-2 rounded-full bg-neutral-800">
                <div
                  className={`h-2 rounded-full ${processingState.status === 'completed'
                    ? 'bg-green-500'
                    : processingState.status === 'paused'
                      ? 'bg-amber-500'
                      : processingState.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                  style={{ width: `${processingState.progress}%` }}
                />
              </div>
            </div>

            <div className="mb-3 flex justify-between text-xs text-neutral-400">
              <span>Frames: {processingState.totalFrames}</span>
              <span>Anomalies: {processingState.totalAnomalies}</span>
              <span className="uppercase">{processingState.status}</span>
            </div>

            <div className="mb-3 truncate text-xs text-neutral-500">
              {processingState.message}
            </div>

            {processingState.status === 'processing' && (
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={onPreviousFrame}
                  disabled={previousDisabled}
                  className="flex-1 rounded bg-neutral-800 py-1.5 text-xs transition-colors hover:bg-neutral-700 disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={onNextFrame}
                  disabled={nextDisabled}
                  className="flex-1 rounded bg-neutral-800 py-1.5 text-xs transition-colors hover:bg-neutral-700 disabled:opacity-40"
                >
                  Next
                </button>

                <button
                  type="button"
                  onClick={onRefreshLatest}
                  className="rounded bg-blue-600 px-3 text-xs transition-colors hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            )}

            {(processingState.status === 'completed' || processingState.status === 'paused') &&
              processedVideoUrl && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onPlayProcessedVideo}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 py-2 text-xs transition-colors hover:bg-blue-700"
                  >
                    <Expand className="h-3.5 w-3.5" />
                    Expand
                  </button>

                  <button
                    type="button"
                    onClick={onDownloadVideo}
                    className="flex-1 rounded bg-green-600 py-2 text-xs transition-colors hover:bg-green-700"
                  >
                    Download Video
                  </button>
                </div>
              )}

            {processingState.status === 'error' && (
              <button
                type="button"
                onClick={onDismissError}
                className="w-full rounded bg-neutral-700 py-2 text-xs transition-colors hover:bg-neutral-600"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
