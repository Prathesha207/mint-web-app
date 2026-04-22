import { useState } from "react";
import { CloudUpload, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { JSX } from "react/jsx-runtime";

export default function BackendExtractionCard({
  backendExtractionMode,
  viewMode,
  extractionStatus,
  extractionProgress,
  extractedFramesCount,
  videoFile,
  extractionJobId,
  uploadVideoToBackend,
  cancelBackendExtraction,
}: any) {
  const [showCard, setShowCard] = useState(true);

  // Status colors and icons
  const statusColors: Record<string, string> = {
    idle: "bg-yellow-500/20 text-yellow-400",
    uploading: "bg-blue-500/20 text-blue-400",
    processing: "bg-purple-500/20 text-purple-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  const statusIcons: Record<string, JSX.Element> = {
    idle: <AlertTriangle className="w-5 h-5" />,
    uploading: <CloudUpload className="w-5 h-5 animate-pulse" />,
    processing: <RefreshCw className="w-5 h-5 animate-spin" />,
    completed: <Check className="w-5 h-5" />,
    failed: <AlertTriangle className="w-5 h-5" />,
  };

  // ✅ Only show if backend mode is active AND NOT in training view
  if (!backendExtractionMode || viewMode === "inference") return null;

  return (
    <>
      <div className="w-full lg:hidden">
        {showCard && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="flex items-center text-xs font-bold text-white">
                {statusIcons[extractionStatus]}
                <span className="ml-2">Backend Video Processing</span>
              </h3>
              <div className={`rounded px-2 py-1 text-[10px] ${statusColors[extractionStatus]}`}>
                {extractionStatus.charAt(0).toUpperCase() + extractionStatus.slice(1)}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-neutral-300">
                  Processing: {videoFile?.name || 'No file selected'}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-neutral-400">
                  <span>Progress: {extractionProgress.toFixed(1)}%</span>
                  <span>Frames: {extractedFramesCount}</span>
                </div>
              </div>

              {extractionJobId && (
                <div className="text-xs">
                  <div className="mb-1 text-neutral-400">Job ID:</div>
                  <code className="break-all rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                    {extractionJobId}
                  </code>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    if (
                      videoFile &&
                      extractionStatus !== 'processing' &&
                      extractionStatus !== 'uploading'
                    ) {
                      uploadVideoToBackend(videoFile);
                    }
                  }}
                  disabled={
                    !videoFile ||
                    extractionStatus === 'processing' ||
                    extractionStatus === 'uploading'
                  }
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    !videoFile || extractionStatus === 'processing' || extractionStatus === 'uploading'
                      ? 'cursor-not-allowed bg-neutral-700 text-neutral-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {extractionStatus === 'processing'
                    ? 'Processing...'
                    : extractionStatus === 'uploading'
                      ? 'Uploading...'
                      : extractionStatus === 'completed'
                        ? 'Re-process'
                        : 'Process on Backend'}
                </button>

                <button
                  onClick={cancelBackendExtraction}
                  disabled={
                    extractionStatus !== 'processing' &&
                    extractionStatus !== 'uploading'
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    extractionStatus !== 'processing' && extractionStatus !== 'uploading'
                      ? 'cursor-not-allowed bg-neutral-700 text-neutral-400'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="hidden lg:flex fixed bottom-10 left-6 z-[200] h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg"
        onClick={() => setShowCard(!showCard)}
      >
        {statusIcons[extractionStatus]}
      </button>

      {showCard && (
        <div className="hidden lg:block fixed bottom-20 left-6 z-[190] w-80 rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center text-sm font-bold text-white">
              {statusIcons[extractionStatus]}
              <span className="ml-2">Backend Video Processing</span>
            </h3>
            <div className={`rounded px-2 py-1 text-xs ${statusColors[extractionStatus]}`}>
              {extractionStatus.charAt(0).toUpperCase() + extractionStatus.slice(1)}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-1 text-xs text-neutral-300">
                Processing: {videoFile?.name || 'No file selected'}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-neutral-400">
                <span>Progress: {extractionProgress.toFixed(1)}%</span>
                <span>Frames: {extractedFramesCount}</span>
              </div>
            </div>

            {extractionJobId && (
              <div className="text-xs">
                <div className="mb-1 text-neutral-400">Job ID:</div>
                <code className="break-all rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                  {extractionJobId}
                </code>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (
                    videoFile &&
                    extractionStatus !== 'processing' &&
                    extractionStatus !== 'uploading'
                  ) {
                    uploadVideoToBackend(videoFile);
                  }
                }}
                disabled={
                  !videoFile ||
                  extractionStatus === 'processing' ||
                  extractionStatus === 'uploading'
                }
                className={`flex-1 rounded py-2 text-sm font-medium ${
                  !videoFile ||
                  extractionStatus === 'processing' ||
                  extractionStatus === 'uploading'
                    ? 'cursor-not-allowed bg-neutral-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {extractionStatus === 'processing'
                  ? 'Processing...'
                  : extractionStatus === 'uploading'
                    ? 'Uploading...'
                    : extractionStatus === 'completed'
                      ? 'Re-process'
                      : 'Process on Backend'}
              </button>

              <button
                onClick={cancelBackendExtraction}
                disabled={
                  extractionStatus !== 'processing' &&
                  extractionStatus !== 'uploading'
                }
                className={`rounded px-3 py-2 text-sm font-medium ${
                  extractionStatus !== 'processing' &&
                  extractionStatus !== 'uploading'
                    ? 'cursor-not-allowed bg-neutral-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
