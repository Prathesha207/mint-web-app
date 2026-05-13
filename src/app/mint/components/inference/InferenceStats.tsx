'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { InferenceStats } from '../../hooks/useInference';

interface InferenceStatsDropdownProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  stats: InferenceStats;
}

export default function InferenceStatsDropdown({
  open,
  onToggle,
  onClose,
  stats,
}: InferenceStatsDropdownProps) {
  return (
    <div className="relative flex items-center gap-4">
      <button
        onClick={onToggle}
        className={`rounded-none font-heading uppercase tracking-wider text-xs ${open
          ? "text-blue-400"
          : "text-neutral-400 hover:text-white"
          }`}
        title="Inference Statistics"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 bg-[#16181D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <div className="px-3 py-2 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Inference Statistics</span>
              </div>

              <div className="p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Frames</span>
                  <span className="font-mono text-white">{stats.totalFrames}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Avg Time</span>
                  <span className="font-mono text-white">{stats.avgTime.toFixed(1)}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Last Inference</span>
                  <span className="font-mono text-white">{stats.lastInferenceTime.toFixed(1)}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Current Anomalies</span>
                  <span className="font-mono text-red-400">{stats.anomalies}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Total Anomalies</span>
                  <span className="font-mono text-red-400">{stats.totalAnomalies}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
