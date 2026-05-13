'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Cpu,
  Download,
  Expand,
  FileVideo,
  Maximize2,
  Play,
  RefreshCw,
  X,
} from 'lucide-react';
import type {
  BackendVideoProcessingState,
  UploadedVideoInfo,
} from '../hooks/useInference';
import FloatingProcessingWidget from './inference/FloatingProcessingWidget';

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

  const isLoading = uploadedVideoInfo.isLoading ?? false;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 p-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-full max-w-xs rounded-md border border-neutral-800 bg-neutral-900 shadow-xl"
        >
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center text-xs font-semibold text-white">
                {isLoading ? (
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin text-blue-400" />
                ) : (
                  <FileVideo className="mr-1 h-3 w-3 text-green-400" />
                )}
                {isLoading ? 'Uploading Video' : 'Video Uploaded'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50"
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
                    <div className="mb-0.5 text-neutral-400">{isLoading ? 'Status' : 'Uploaded'}</div>
                    <div className="text-white">{isLoading ? 'Uploading...' : uploadedVideoInfo.uploadedAt}</div>
                  </div>
                </div>

                {isLoading && (
                  <div className="mt-2">
                    <div className="mb-1 h-1 rounded-full bg-neutral-700 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: '30%' }}
                      />
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Please wait...</div>
                  </div>
                )}

                {!isLoading && (
                  <div className="mt-2">
                    <div className="mb-0.5 text-neutral-400">Job ID</div>
                    <div className="rounded bg-neutral-900 p-1.5 text-[11px] font-mono text-neutral-200">
                      {uploadedVideoInfo.jobId}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-neutral-300">
                {isLoading
                  ? 'Uploading your video to the server. This may take a moment...'
                  : 'Video uploaded successfully. Ready for inference.'}
              </div>

              {!isLoading && (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onStartInference}
                    disabled={isStarting || isLoading}
                    className="flex flex-1 items-center justify-center rounded-md bg-green-600 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    {isStarting ? 'Starting...' : 'Start Inference'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isStarting || isLoading}
                    className="rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {!isLoading && (
                <div className="text-center text-[10px] text-neutral-500">
                  Inference runs frame by frame.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface BackendVideoProcessingPanelProps {
  processingState: BackendVideoProcessingState;
  displayedFrameNumber: number | null;
  liveFrameNumber: number;
  isViewingLiveFrame: boolean;
  bufferedFrameCount?: number;
  isStopping?: boolean;
  processedVideoUrl?: string;
  onCancelProcessing: () => void;
  onDismissError: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onGoLive: () => void;
  onPlayProcessedVideo?: () => void;
  onDownloadVideo: () => void;
  className?: string;
}

export function BackendVideoProcessingPanel({
  processingState,
  displayedFrameNumber,
  liveFrameNumber,
  isViewingLiveFrame,
  bufferedFrameCount = 0,
  isStopping = false,
  processedVideoUrl = '',
  onCancelProcessing,
  onDismissError,
  onPreviousFrame,
  onNextFrame,
  onGoLive,
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
  const resolvedLiveFrameNumber =
    liveFrameNumber > 0 ? liveFrameNumber : processingState.currentFrame;
  const resolvedDisplayedFrameNumber =
    typeof displayedFrameNumber === 'number' ? displayedFrameNumber : resolvedLiveFrameNumber;
  const hasBufferedFrames =
    resolvedLiveFrameNumber > 0 ||
    resolvedDisplayedFrameNumber > 0 ||
    bufferedFrameCount > 0 ||
    (typeof displayedFrameNumber === 'number' && displayedFrameNumber === 0);
  const statusLabel = isStopping
    ? 'stopping'
    : processingState.status === 'paused'
      ? 'stopped'
      : processingState.status;
  const previousDisabled =
    isStopping || !hasBufferedFrames || resolvedDisplayedFrameNumber <= 0;
  const nextDisabled =
    isStopping || !hasBufferedFrames || resolvedDisplayedFrameNumber >= resolvedLiveFrameNumber;
  const goLiveDisabled = isStopping || !hasBufferedFrames || isViewingLiveFrame;
  const canShowVideoActions =
    (processingState.status === 'completed' || processingState.status === 'paused' || isStopping) &&
    (Boolean(processedVideoUrl) || processingState.totalFrames > 0);

  const icon =
    isStopping || processingState.status === 'processing' ? (
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
    isStopping
      ? 'bg-amber-600'
      : processingState.status === 'processing'
        ? 'bg-purple-600'
        : processingState.status === 'paused'
          ? 'bg-amber-600'
          : processingState.status === 'completed'
            ? 'bg-green-600'
            : processingState.status === 'error'
              ? 'bg-red-600'
              : 'bg-neutral-700';

  return (
    <FloatingProcessingWidget
      icon={icon}
      color={color}
      className={className}
      isExpanded={isExpanded}
      setCollapsedStatus={setCollapsedStatus}
      processingState={processingState}
    >
      {/* <button
        type="button"
        onClick={() => {
          setCollapsedStatus(isExpanded ? processingState.status : null);
        }}
        className={`fixed bottom-10 left-6 z-200 flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${color}`}
      >
        {icon}
      </button> */}

      {/* {isExpanded && ( */}

      <div className="mb-3 flex items-center justify-between space-x-1">
        <h3 className="flex items-center text-sm font-semibold text-white">
          <Cpu className="mr-2 h-4 w-4 text-purple-400" />
          Backend Processing
          {processingState.status === 'processing' && !isStopping && (
            <span className="ml-2 rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] text-yellow-400">
              LIVE
            </span>
          )}
        </h3>

        {(processingState.status === 'processing' || isStopping) && (
          <button
            type="button"
            onClick={onCancelProcessing}
            disabled={isStopping}
            className="rounded bg-red-600 px-2 py-0.5 text-[10px] transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isStopping ? 'Stopping...' : 'Stop'}
          </button>
        )}
      </div>

      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs text-neutral-40 uppercase">
          <span>
            {processingState.status === 'processing' && !isStopping
              ? `Frame ${processingState.currentFrame}/${processingState.totalFrames}`
              : statusLabel}
          </span>
          <span>{processingState.progress.toFixed(0)}%</span>
        </div>

        <div className="h-1 rounded-full bg-neutral-800">
          <div
            className={`h-1 rounded-full ${processingState.status === 'completed'
              ? 'bg-green-500'
              : processingState.status === 'paused' || isStopping
                ? 'bg-amber-500'
                : processingState.status === 'error'
                  ? 'bg-red-500'
                  : 'bg-linear-to-r from-blue-500 to-purple-500'
              }`}
            style={{ width: `${processingState.progress}%` }}
          />
        </div>
      </div>

      {/* <div className="mb-3 flex justify-between text-xs text-neutral-400">
              <span>Frames: {processingState.totalFrames}</span>
              <span>Anomalies: {processingState.totalAnomalies}</span>
              <span className="uppercase">{statusLabel}</span>
            </div> */}

      {/* <div className="mb-3 truncate text-xs text-neutral-500">
              {processingState.message}
            </div> */}

      {hasBufferedFrames && (

        <div className=" flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-2 py-1.5">
          {/* LEFT CONTROLS */}
          <div className="flex items-center gap-1">

            {/* PREV */}
            <button
              onClick={onPreviousFrame}
              disabled={previousDisabled}
              className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* FRAME COUNTER */}
            <span className="px-2 text-[11px] text-neutral-400">
              {resolvedDisplayedFrameNumber}/{processingState.totalFrames}
            </span>

            {/* NEXT */}
            <button
              onClick={onNextFrame}
              disabled={nextDisabled}
              className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-1.5">

            {/* LIVE */}
            <button
              onClick={onGoLive}
              disabled={goLiveDisabled}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-xs  tracking-wide transition ${isViewingLiveFrame
                ? 'bg-red-600 text-white shadow-md'
                : 'border border-neutral-400 text-neutral-300 hover:bg-white/10'
                }`}
            >
              {/* Pulsing dot */}
              <span
                className={`h-2 w-2 rounded-full ${isViewingLiveFrame ? 'bg-white animate-pulse' : 'bg-neutral-400'
                  }`}
              ></span>
              Live
            </button>


            {canShowVideoActions && (
              <>
                <button
                  onClick={onPlayProcessedVideo}
                  className=" px-1 py-1 rounded-md text-xs font-medium border border-neutral-400  hover:bg-white/10 transition shadow-sm"
                >
                  <Expand className="h-3.5 w-3.5" />

                </button>


                {/* DOWNLOAD */}
                <button
                  onClick={onDownloadVideo}
                  className=" px-1 py-1 rounded-md text-xs font-medium border border-neutral-400  hover:bg-white/10 transition shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </>
            )}

          </div>
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


      {/* )} */}
    </FloatingProcessingWidget>
  );
}
