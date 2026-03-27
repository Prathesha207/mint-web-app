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
      {/* Floating toggle icon */}
      <div
        className="fixed bottom-10 left-6 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg  cursor-pointer z-[200]"
        onClick={() => setShowCard(!showCard)}
      >
        {statusIcons[extractionStatus]}
      </div>

      {/* Floating card */}
      {showCard && (
        <div className="fixed bottom-20 left-6 w-80 bg-neutral-900 rounded-xl shadow-xl border border-neutral-800 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center text-white">
              {statusIcons[extractionStatus]}
              <span className="ml-2">Backend Video Processing</span>
            </h3>
            <div
              className={`px-2 py-1 rounded text-xs ${statusColors[extractionStatus]}`}
            >
              {extractionStatus.charAt(0).toUpperCase() +
                extractionStatus.slice(1)}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-neutral-300 mb-1">
                Processing: {videoFile?.name || "No file selected"}
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
                  if (
                    videoFile &&
                    extractionStatus !== "processing" &&
                    extractionStatus !== "uploading"
                  ) {
                    uploadVideoToBackend(videoFile);
                  }
                }}
                disabled={
                  !videoFile ||
                  extractionStatus === "processing" ||
                  extractionStatus === "uploading"
                }
                className={`flex-1 py-2 rounded text-sm font-medium ${!videoFile ||
                  extractionStatus === "processing" ||
                  extractionStatus === "uploading"
                  ? "bg-neutral-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {extractionStatus === "processing"
                  ? "Processing..."
                  : extractionStatus === "uploading"
                    ? "Uploading..."
                    : extractionStatus === "completed"
                      ? "Re-process"
                      : "Process on Backend"}
              </button>

              <button
                onClick={cancelBackendExtraction}
                disabled={
                  extractionStatus !== "processing" &&
                  extractionStatus !== "uploading"
                }
                className={`px-3 py-2 rounded text-sm font-medium ${extractionStatus !== "processing" &&
                  extractionStatus !== "uploading"
                  ? "bg-neutral-700 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
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
