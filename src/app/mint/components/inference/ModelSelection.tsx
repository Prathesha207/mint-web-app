'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Code, Copy, Download, Loader2, Paperclip, RefreshCw, X } from 'lucide-react';
import {
  DownloadDebugInfo,
  InferenceModel,
  InferenceModelType,
} from '../../hooks/useInference';
type InferenceModelOption = InferenceModel;

interface InferenceModelDropdownProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  models: InferenceModelOption[];
  selectedModel: string;
  selectedModelType: InferenceModelType | '';
  onSelectModel: (modelId: string) => void;
  onSelectModelType: (modelType: InferenceModelType) => void;
  selectedModelInfo: InferenceModelOption | undefined;
  selectedModelAvailableTypes: InferenceModelType[];
  getModelTypeLabel: (type: InferenceModelType | '' | null | undefined) => string;
  isModelLoaded: boolean;
  modelLoading: boolean;
  onRefreshModels: () => void;
  onLoadModel: () => void;
  onUnloadModel: () => void;
  onOpenDownload: (modelId: string, modelInfo?: InferenceModelOption) => void;
  onStartDownload: () => void;
  showDownloadPopup: boolean;
  onCloseDownloadPopup: () => void;
  selectedModelForDownload: InferenceModelOption | null;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string;
  downloadDebugInfo: DownloadDebugInfo | null;
  addTerminalLog?: (message: string) => void;
}

export default function InferenceModelDropdown({
  models,
  selectedModel,
  onSelectModel,
  selectedModelInfo,
  selectedModelAvailableTypes,
  getModelTypeLabel,
  isModelLoaded,
  modelLoading,
  onRefreshModels,
  onLoadModel,
  onUnloadModel,
  onOpenDownload,
  onStartDownload,
  showDownloadPopup,
  onCloseDownloadPopup,
  selectedModelForDownload,
  isDownloading,
  downloadProgress,
  downloadError,
  downloadDebugInfo,
  addTerminalLog,
}: InferenceModelDropdownProps) {
  const getDisplayTrainingTypes = (model?: InferenceModelOption | null) => {
    if (!model) return [];

    const rawTypes =
      Array.isArray(model.training_options) && model.training_options.length > 0
        ? model.training_options
        : model.model_types || [];

    return [...new Set(rawTypes)]
      .filter((type): type is string => typeof type === 'string' && type.length > 0)
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1));
  };

  const selectedModelTrainingLabels = getDisplayTrainingTypes(selectedModelInfo);
  const selectedModelTypeLabel = selectedModelTrainingLabels.join(' / ') || 'None';
  const codeSnippet = `import cv2
import dime_v2

detector = dime_v2.create_detector(
    model_path="models",
    threshold=0.5,
)

frame = cv2.imread("test.png")
result = detector.process_frame(frame)

print(f"Anomaly score: {result['anomaly_score']:.3f}")
print(f"Processing time: {result['processing_time_ms']:.1f}ms")

coords = [list(map(int, a["bbox"])) for a in result["anomaly_areas"]]
print("Coordinates:", coords)

detector.cleanup()`;

  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex shrink-0 flex-col gap-3"
    >
      <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            <div className="flex items-center gap-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Models
              </h3>
              {/* <span className="text-[9px] text-zinc-600">•</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {selectedModel ? selectedModelTypeLabel : 'None'}
              </span> */}
            </div>
          </div>

          <button
            onClick={onRefreshModels}
            disabled={modelLoading}
            className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-zinc-400 transition-all hover:bg-white/10 disabled:opacity-60"
          >
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {modelLoading ? 'Syncing...' : 'Sync'}
            </span>
            <RefreshCw className={`h-3 w-3 ${modelLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className=" space-y-3">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Select Model
            </label>

            <div className="space-y-2">
              <select
                value={selectedModel}
                onChange={(event) => onSelectModel(event.target.value)}
                disabled={models.length === 0 || modelLoading}
                className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-xs text-white outline-none transition-all focus:border-blue-500/50 disabled:opacity-60"
              >
                <option value="">Select a model...</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {(model.display_name || model.name || model.id) +
                      ` [${getDisplayTrainingTypes(model).join(' + ') || 'Unknown'}]`}
                  </option>
                ))}
              </select>

              <div className="text-[10px] text-zinc-500">
                {models.length} trained model{models.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>

          {selectedModelInfo && (
            <div className="space-y-3 rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
              <div className="space-y-1">

                <div className="text-[10px] text-zinc-500">ID: {selectedModelInfo.id}</div>
                <div className="flex flex-wrap gap-3 text-[10px] text-zinc-500">

                  <span>Training: {selectedModelTypeLabel}</span>
                  <span>ROIs: {selectedModelInfo.rois_trained?.length || 0}</span>
                </div>
                {/* <div className="text-[10px] text-zinc-500">
                  Inference:{' '}
                  <span className="text-zinc-300">
                    {selectedModelAvailableTypes.map(getModelTypeLabel).join(' / ') || 'None'}
                  </span>
                </div> */}
              </div>
              {/* 
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${isModelLoaded ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'
                      }`}
                  />
                  <span>{isModelLoaded ? 'Engine Ready' : 'Engine Idle'}</span>
                </div>

              </div> */}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={onLoadModel}
              disabled={!selectedModel || modelLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              {modelLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
              Load Model
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenDownload(selectedModel, selectedModelInfo)}
                disabled={!selectedModelInfo}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/5 bg-zinc-800 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 transition-all hover:bg-zinc-700 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                onClick={onUnloadModel}
                disabled={!selectedModel || !isModelLoaded}
                className="rounded-lg border border-white/5 bg-black/30 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all hover:bg-black/50 hover:text-zinc-200 disabled:opacity-50"
              >
                Unload
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDownloadPopup && selectedModelForDownload && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
              onClick={onCloseDownloadPopup}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-4"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
                <div className="flex items-start justify-between border-b border-white/5 px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-white">Download Model</div>
                    <div className="mt-1 text-xs text-zinc-400">Export trained model</div>
                  </div>
                  <button
                    onClick={onCloseDownloadPopup}
                    className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                  <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-zinc-400">
                    <div className="flex items-center justify-between gap-3">
                      <span className="uppercase tracking-[0.18em] text-zinc-500">Model</span>
                      <span className="text-right text-zinc-200">
                        {selectedModelForDownload.display_name || selectedModelForDownload.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="uppercase tracking-[0.18em] text-zinc-500">Download Library</span>
                      <span className="text-right text-zinc-300">dime_v2 runtime (.whl)</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="uppercase tracking-[0.18em] text-zinc-500">Type</span>
                      <span className="text-right text-zinc-300">
                        {downloadDebugInfo?.modelType
                          ? getModelTypeLabel(downloadDebugInfo.modelType)
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="uppercase tracking-[0.18em] text-zinc-500">Session</span>
                      <span className="max-w-[12rem] truncate text-right text-zinc-300">
                        {downloadDebugInfo?.sessionId || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {downloadError && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                      {downloadError}
                    </div>
                  )}

                  {downloadDebugInfo && (
                    <div className="text-[10px] text-zinc-500">
                      Available types: {downloadDebugInfo.availableTypes.map(getModelTypeLabel).join(', ') || 'None'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      onClick={onStartDownload}
                      disabled={isDownloading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
                    >
                      {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      {isDownloading ? 'Downloading...' : 'Download Model'}
                    </button>

                    <a
                      href="/dime_v2-2.2.0-py3-none-any.whl"
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Library
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(codeSnippet);
                        addTerminalLog?.('Code copied to clipboard');
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </button>
                  </div>

                  {isDownloading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        <span>Downloading...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${downloadProgress}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      <Code className="h-3.5 w-3.5 text-blue-400" />
                      Usage Snippet
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] leading-relaxed text-green-300">
                      {codeSnippet}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 px-5 py-4">
                  <button
                    onClick={onCloseDownloadPopup}
                    disabled={isDownloading}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onStartDownload}
                    disabled={isDownloading}
                    className="inline-flex min-w-[108px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
                  >
                    {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
