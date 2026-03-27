'use client';

import { MousePointer, Square, Hexagon, Trash2, Check } from 'lucide-react';

export interface ROIToolsPaletteProps {
  visible: boolean;
  drawingMode: 'rectangle' | 'polygon' | 'select';
  isDrawing: boolean;
  onSelectMode: () => void;
  onRectangleMode: () => void;
  onPolygonMode: () => void;
  onClearAll: () => void;
  onFinishPolygon: () => void;
}

export default function ROIToolsPalette({
  visible,
  drawingMode,
  isDrawing,
  onSelectMode,
  onRectangleMode,
  onPolygonMode,
  onClearAll,
  onFinishPolygon,
}: ROIToolsPaletteProps) {
  if (!visible) return null;

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none">
      <div className="bg-[#16181D]/90 backdrop-blur-md border border-white/10 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectMode();
          }}
          className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
            drawingMode === 'select'
              ? 'bg-blue-500/20 text-blue-400 shadow-inner'
              : 'text-neutral-400 hover:bg-white/10 hover:text-white'
          }`}
          title="Select ROI"
        >
          <MousePointer className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRectangleMode();
          }}
          className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
            drawingMode === 'rectangle'
              ? 'bg-blue-500/20 text-blue-400 shadow-inner'
              : 'text-neutral-400 hover:bg-white/10 hover:text-white'
          }`}
          title="Rectangle Tool"
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPolygonMode();
          }}
          className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
            drawingMode === 'polygon'
              ? 'bg-blue-500/20 text-blue-400 shadow-inner'
              : 'text-neutral-400 hover:bg-white/10 hover:text-white'
          }`}
          title="Polygon Tool"
        >
          <Hexagon className="w-5 h-5" />
        </button>
        <div className="w-8 h-px bg-white/10 mx-auto my-1" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClearAll();
          }}
          className="p-2.5 rounded-lg flex items-center justify-center text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
          title="Clear All ROIs"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        {drawingMode === 'polygon' && isDrawing && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFinishPolygon();
            }}
            className="p-2.5 mt-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center shadow-lg animate-pulse"
            title="Finish Shape"
          >
            <Check className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
