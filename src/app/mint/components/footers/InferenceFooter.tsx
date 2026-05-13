'use client';

import { Activity, AlertTriangle, Brain, Camera, Cpu as CpuIcon2, Video, WifiOff, Zap } from 'lucide-react';
import { InferenceInputSource, InferenceModel, InferenceStats, LoadedModel } from '../../hooks/useInference';


interface InferenceFooterProps {
  selectedModelInfo: InferenceModel | undefined;
  inferenceStats: InferenceStats;
  isProcessing: boolean;
  activeTab: 'live' | 'batch';
  inputSource: InferenceInputSource;
  isOakStreaming: boolean;
  availableCameras: MediaDeviceInfo[];
  connectionError: boolean;
  loadedModelInfo: LoadedModel | undefined;
}

export default function InferenceFooter({
  selectedModelInfo,
  inferenceStats,
  isProcessing,
  activeTab,
  inputSource,
  isOakStreaming,
  availableCameras,
  connectionError,
  loadedModelInfo,
}: InferenceFooterProps) {
  return (
    <div className="w-full backdrop-blur-xl border-t border-neutral-800/50 px-2 sm:px-3 md:px-4 py-2 text-xs flex-none">
      {/* Mobile: All info displayed */}
      <div className="flex md:hidden items-center gap-1.5 whitespace-nowrap overflow-x-auto flex-wrap">
        <div className="flex items-center gap-0.5">
          <Brain className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Model:</span>
          <span className="text-[7px] font-mono text-neutral-300 truncate max-w-16">{selectedModelInfo?.display_name || 'None'}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Activity className="w-2.5 h-2.5 text-blue-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Frames:</span>
          <span className="text-[7px] font-mono text-neutral-300">{inferenceStats.totalFrames}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Time:</span>
          <span className="text-[7px] font-mono text-neutral-300">{inferenceStats.avgTime.toFixed(1)}ms</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <AlertTriangle className="w-2.5 h-2.5 text-red-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Anomalies:</span>
          <span className="text-[7px] font-mono text-neutral-300">{inferenceStats.totalAnomalies}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Video className="w-2.5 h-2.5 text-blue-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Mode:</span>
          <span className="text-[7px] font-mono text-neutral-300">{activeTab === 'live' ? (isProcessing ? 'Live' : 'View') : 'Batch'}</span>
        </div>
        <span className="text-neutral-700">•</span>

        {connectionError && (
          <>
            <div className="flex items-center gap-0.5 text-red-400">
              <WifiOff className="w-2.5 h-2.5 shrink-0" />
              <span className="text-[7px] font-mono">Conn Issue</span>
            </div>
            <span className="text-neutral-700">•</span>
          </>
        )}

        <div className={`flex items-center gap-0.5 ${isProcessing ? 'text-blue-400' : 'text-yellow-400'}`}>
          <span className="text-[7px] font-mono uppercase tracking-wider">Status:</span>
          <span className="text-[7px] font-mono">{isProcessing ? 'PROCESSING' : 'IDLE'}</span>
        </div>

        {inputSource === 'oak' && (
          <>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-0.5">
              <CpuIcon2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              <span className="text-[7px] font-mono uppercase tracking-wider">Neuron:</span>
              <span className="text-[7px] font-mono text-neutral-300">{isOakStreaming ? 'ON' : 'OFF'}</span>
            </div>
          </>
        )}

        {inputSource === 'camera' && (
          <>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-0.5">
              <Camera className="w-2.5 h-2.5 text-blue-400 shrink-0" />
              <span className="text-[7px] font-mono uppercase tracking-wider">Cameras:</span>
              <span className="text-[7px] font-mono text-neutral-300">{availableCameras.length}</span>
            </div>
          </>
        )}

        {loadedModelInfo?.is_dummy && (
          <>
            <span className="text-neutral-700">•</span>
            <span className="text-[7px] text-yellow-400 font-mono">(DUMMY)</span>
          </>
        )}
      </div>

      {/* Tablet & Desktop: Full info with left and right sections */}
      <div className="hidden md:flex items-center justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap overflow-x-auto">
          <div className="flex items-center gap-0.5">
            <Brain className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Model:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{selectedModelInfo?.display_name || 'None'}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Activity className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Frames:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{inferenceStats.totalFrames}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Avg Time:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{inferenceStats.avgTime.toFixed(1)}ms</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Anomalies:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{inferenceStats.totalAnomalies}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Video className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Mode:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{activeTab === 'live' ? (isProcessing ? 'Live Processing' : 'Live View') : 'Batch'}</span>
          </div>

          {inputSource === 'oak' && (
            <>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-0.5">
                <CpuIcon2 className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Neuron:</span>
                <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{isOakStreaming ? 'ON' : 'OFF'}</span>
              </div>
            </>
          )}

          {inputSource === 'camera' && (
            <>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-0.5">
                <Camera className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Cameras:</span>
                <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{availableCameras.length}</span>
              </div>
            </>
          )}

          {loadedModelInfo?.is_dummy && (
            <>
              <span className="text-neutral-700">•</span>
              <span className="text-[9px] md:text-[10px] text-yellow-400 font-mono">(DUMMY MODE)</span>
            </>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {connectionError && (
            <div className="flex items-center gap-0.5 text-red-400">
              <WifiOff className="w-3 h-3 shrink-0" />
              <span className="text-[9px] md:text-[10px] font-mono">Connection Issue</span>
            </div>
          )}

          {connectionError && (
            <span className="text-neutral-700">•</span>
          )}

          <div className={`flex items-center gap-0.5 ${isProcessing ? 'text-blue-400' : 'text-yellow-400'}`}>
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Status:</span>
            <span className="text-[9px] md:text-[10px] font-mono">{isProcessing ? 'PROCESSING' : 'IDLE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
