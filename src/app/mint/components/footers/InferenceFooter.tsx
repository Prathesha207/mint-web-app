'use client';

import { Activity, AlertTriangle, Brain, Camera, Cpu as CpuIcon2, Video, WifiOff, Zap } from 'lucide-react';
import type { InferenceInputSource, InferenceModel, InferenceStats, LoadedModel } from '@/hooks/useInference';

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
    <div className="w-full backdrop-blur-xl border-t border-neutral-800/50 px-4 py-3 text-xs flex-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Brain className="w-3 h-3 mr-1 text-indigo-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Model:</span>
            <span className="text-[10px] font-mono text-neutral-300">{selectedModelInfo?.display_name || 'None'}</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-3 h-3 mr-1 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Frames:</span>
            <span className="text-[10px] font-mono text-neutral-300">{inferenceStats.totalFrames}</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-3 h-3 mr-1 text-yellow-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Avg Time:</span>
            <span className="text-[10px] font-mono text-neutral-300">{inferenceStats.avgTime.toFixed(1)}ms</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Anomalies:</span>
            <span className="text-[10px] font-mono text-neutral-300">{inferenceStats.totalAnomalies}</span>

          </div>
          <div className="flex items-center">
            <Video className="w-3 h-3 mr-1 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Mode:</span>
            <span className="text-[10px] font-mono text-neutral-300">{activeTab === 'live' ? (isProcessing ? 'Live Processing' : 'Live View') : 'Batch'}</span>
          </div>
          {inputSource === 'oak' && (
            <div className="flex items-center">
              <CpuIcon2 className="w-3 h-3 mr-1 text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Neuron:</span>
              <span className="text-[10px] font-mono text-neutral-300">{isOakStreaming ? 'ON' : 'OFF'}</span>
            </div>
          )}
          {inputSource === 'camera' && (
            <div className="flex items-center">
              <Camera className="w-3 h-3 mr-1 text-blue-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Cameras:</span>
              <span className="text-[10px] font-mono text-neutral-300">{availableCameras.length}</span>
            </div>
          )}
          {connectionError && (
            <div className="flex items-center text-red-400">
              <WifiOff className="w-3 h-3 mr-1" />
              <span className="text-[10px] font-mono text-neutral-300">Connection Issue</span>
            </div>
          )}
        </div>

        <div className="text-[10px] font-mono uppercase tracking-wider">
          Status:{' '}
          <span className={`font-medium ${isProcessing ? 'text-blue-400' : 'text-yellow-400'}`}>
            {isProcessing ? 'PROCESSING' : 'IDLE'}
          </span>
          {loadedModelInfo?.is_dummy && <span className="ml-2 text-yellow-400">(DUMMY MODE)</span>}
        </div>
      </div>
    </div>
  );
}
