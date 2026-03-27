'use client';

import { Brain, Camera, Clock, CloudUpload, Smartphone, Target, Video } from 'lucide-react';
import { InferenceInputSource } from '../../hooks/useInference';


interface TrainingFooterProps {
  roisCount: number;
  frameRate: number;
  sessionName: string;
  recordingDuration: number;
  captureCount: number;
  backendExtractionMode: boolean;
  extractionStatus: string;
  inputSource: InferenceInputSource;
  remoteCameraStatus: 'disconnected' | 'connecting' | 'connected';
  drawingMode: 'rectangle' | 'polygon' | 'select';
  showTerminal: boolean;
}

export default function TrainingFooter({
  roisCount,
  frameRate,
  sessionName,
  recordingDuration,
  captureCount,
  backendExtractionMode,
  extractionStatus,
  inputSource,
  remoteCameraStatus,
  drawingMode,
  showTerminal,
}: TrainingFooterProps) {
  return (
    <div className="w-full backdrop-blur-xl border-t border-neutral-800/50 px-4 py-3 text-xs flex-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Target className="w-3 h-3 mr-1 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">ROIs:</span>
            <span className="text-[10px] font-mono text-neutral-300">{roisCount}</span>
          </div>
          <div className="flex items-center">
            <Video className="w-3 h-3 mr-1 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">FPS:</span>
            <span className="text-[10px] font-mono text-neutral-300">{frameRate}</span>
          </div>
          <div className="flex items-center">
            <Brain className="w-3 h-3 mr-1 text-indigo-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Session:</span>
            <span className="text-[10px] font-mono text-neutral-300">{sessionName}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Duration:</span>
            <span className="text-[10px] font-mono text-neutral-300">{recordingDuration}s</span>
          </div>
          <div className="flex items-center">
            <Camera className="w-3 h-3 mr-1 text-yellow-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Frames:</span>
            <span className="text-[10px] font-mono text-neutral-300">{captureCount}</span>
          </div>
          {backendExtractionMode && (
            <div className="flex items-center">
              <CloudUpload className="w-3 h-3 mr-1 text-indigo-400" />
              <span>Backend: {extractionStatus}</span>
            </div>
          )}
          {inputSource === 'remote' && (
            <div className="flex items-center">
              <Smartphone className="w-3 h-3 mr-1 text-blue-400" />
              <span>Remote: {remoteCameraStatus}</span>
            </div>
          )}
        </div>

        <div className="text-neutral-500 flex items-center">
          <span className="text-[10px] font-mono uppercase tracking-wider">Mode:</span>
          <span className="text-[10px] font-mono text-neutral-300 mr-3 uppercase">{drawingMode}</span>

          <span className="text-[10px] font-mono uppercase tracking-wider">Terminal:</span>
          <span className="text-[10px] font-mono text-neutral-300">{showTerminal ? 'ON' : 'OFF'}</span>

          {backendExtractionMode && (
            <span className="text-[10px] font-mono text-neutral-300 ml-6">&bull; Backend Mode</span>
          )}
        </div>
      </div>
    </div>
  );
}
