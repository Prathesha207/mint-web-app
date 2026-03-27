'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ROI, TrainingType } from '../types';

const initialTrainingTypes = {
  anomaly: true,
  sequential: false,
  motion: false,
};

export interface TrainingTypeModalProps {
  open: boolean;
  pendingROI: ROI | null;
  trainingTypes: { anomaly: boolean; sequential: boolean; motion: boolean };
  onTrainingTypesChange: (next: typeof initialTrainingTypes) => void;
  onConfirm: (roi: ROI, training: TrainingType[]) => void;
  onCancel: () => void;
  addTerminalLog?: (msg: string) => void;
}

export default function TrainingTypeModal({
  open,
  pendingROI,
  trainingTypes,
  onTrainingTypesChange,
  onConfirm,
  onCancel,
}: TrainingTypeModalProps) {
  if (!open || !pendingROI) return null;

  const handleConfirm = () => {
    const selectedTrainings: TrainingType[] = Object.entries(trainingTypes)
      .filter(([, value]) => value)
      .map(([key]) => key as TrainingType);
    onConfirm({ ...pendingROI, training: selectedTrainings }, selectedTrainings);
  };

  const content = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative bg-[#16181D]/95 border border-white/10 rounded-xl shadow-2xl w-full max-w-xs p-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Select Training Types
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-1 hover:bg-white/10 rounded-md text-neutral-400 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition cursor-pointer">
              <input
                type="checkbox"
                checked={trainingTypes.anomaly}
                onChange={(e) =>
                  onTrainingTypesChange({ ...trainingTypes, anomaly: e.target.checked })
                }
                className="h-3 w-3 rounded cursor-pointer appearance-none transition-all duration-200 bg-neutral-800 border border-neutral-600 checked:bg-[radial-gradient(circle_at_35%_35%,#60a5fa_0%,#2563eb_60%,#1e3a8a_100%)] checked:border-blue-400"
              />
              <div className="flex-1">
                <div className="text-xs text-white">Anomaly Training</div>
                <div className="text-[10px] text-neutral-500 leading-snug">
                  Detect anomalies in static images
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition cursor-pointer">
              <input
                type="checkbox"
                checked={trainingTypes.sequential}
                onChange={(e) =>
                  onTrainingTypesChange({ ...trainingTypes, sequential: e.target.checked })
                }
                className="h-3 w-3 rounded cursor-pointer appearance-none transition-all duration-200 bg-neutral-800 border border-neutral-600 checked:bg-[radial-gradient(circle_at_35%_35%,#d8b4fe_0%,#a855f7_60%,#6b21a8_100%)] checked:border-purple-400"
              />
              <div className="flex-1">
                <div className="text-xs text-white">Sequential Training</div>
                <div className="text-[10px] text-neutral-500 leading-snug">
                  Analyze temporal patterns
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition cursor-pointer">
              <input
                type="checkbox"
                checked={trainingTypes.motion}
                onChange={(e) =>
                  onTrainingTypesChange({ ...trainingTypes, motion: e.target.checked })
                }
                className="h-3 w-3 rounded cursor-pointer appearance-none transition-all duration-200 bg-neutral-800 border border-neutral-600 checked:bg-[radial-gradient(circle_at_35%_35%,#818cf8_0%,#4f46e5_60%,#312e81_100%)] checked:border-indigo-400"
              />
              <div className="flex-1">
                <div className="text-xs text-white">Motion Tracking</div>
                <div className="text-[10px] text-neutral-500 leading-snug">
                  Track object movement
                </div>
              </div>
            </label>

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window !== 'undefined') {
    return createPortal(content, document.body);
  }
  return null;
}

export { initialTrainingTypes };
