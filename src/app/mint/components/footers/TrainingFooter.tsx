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
    <div className="w-full backdrop-blur-xl border-t border-neutral-800/50 px-2 sm:px-3 md:px-4 py-2 text-xs flex-none">
      {/* Mobile: All info displayed */}
      <div className="flex md:hidden items-center gap-1.5 whitespace-nowrap overflow-x-auto flex-wrap">
        <div className="flex items-center gap-0.5">
          <Target className="w-2.5 h-2.5 text-blue-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">ROIs:</span>
          <span className="text-[7px] font-mono text-neutral-300">{roisCount}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Video className="w-2.5 h-2.5 text-blue-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">FPS:</span>
          <span className="text-[7px] font-mono text-neutral-300">{frameRate}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Brain className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Session:</span>
          <span className="text-[7px] font-mono text-neutral-300 ">{sessionName}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Dur:</span>
          <span className="text-[7px] font-mono text-neutral-300">{recordingDuration}s</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <Camera className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
          <span className="text-[7px] font-mono uppercase tracking-wider">Frames:</span>
          <span className="text-[7px] font-mono text-neutral-300">{captureCount}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <span className="text-[7px] font-mono uppercase tracking-wider">Mode:</span>
          <span className="text-[7px] font-mono text-neutral-300 uppercase">{drawingMode}</span>
        </div>
        <span className="text-neutral-700">•</span>

        <div className="flex items-center gap-0.5">
          <span className="text-[7px] font-mono uppercase tracking-wider">Terminal:</span>
          <span className="text-[7px] font-mono text-neutral-300">{showTerminal ? 'ON' : 'OFF'}</span>
        </div>

        {backendExtractionMode && (
          <>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-0.5">
              <CloudUpload className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              <span className="text-[7px] font-mono">Backend:</span>
              <span className="text-[7px] font-mono text-neutral-300">{extractionStatus}</span>
            </div>
          </>
        )}

        {inputSource === 'remote' && (
          <>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-0.5">
              <Smartphone className="w-2.5 h-2.5 text-blue-400 shrink-0" />
              <span className="text-[7px] font-mono">Remote:</span>
              <span className="text-[7px] font-mono text-neutral-300">{remoteCameraStatus}</span>
            </div>
          </>
        )}
      </div>

      {/* Tablet & Desktop: Full info with left and right sections */}
      <div className="hidden md:flex items-center justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap overflow-x-auto">
          <div className="flex items-center gap-0.5">
            <Target className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">ROIs:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{roisCount}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Video className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">FPS:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{frameRate}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Brain className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Session:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{sessionName}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Duration:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{recordingDuration}s</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <Camera className="w-3 h-3 text-yellow-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Frames:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{captureCount}</span>
          </div>
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Mode:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300 uppercase">{drawingMode}</span>
          </div>

          {backendExtractionMode && (
            <>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-0.5">
                <CloudUpload className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-mono">Backend:</span>
                <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{extractionStatus}</span>
              </div>
            </>
          )}

          {inputSource === 'remote' && (
            <>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-0.5">
                <Smartphone className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-mono">Remote:</span>
                <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{remoteCameraStatus}</span>
              </div>
            </>
          )}
          <span className="text-neutral-700">•</span>

          <div className="flex items-center gap-0.5 ">
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider">Terminal:</span>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300">{showTerminal ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        {/* RIGHT SECTION */}

      </div>
    </div>
  );
}
