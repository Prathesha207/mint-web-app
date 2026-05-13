'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Settings2, X, Sliders } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { AdvancedSettings } from '../../hooks/useInference';

interface InferenceSettingsProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: Dispatch<SetStateAction<AdvancedSettings>>;
}

export default function InferenceSettings({
  open,
  onToggle,
  onClose,
  advancedSettings,
  setAdvancedSettings,
}: InferenceSettingsProps) {
  return (
    <div className="relative flex items-center gap-4">
      <button
        onClick={onToggle}
        className={`p-2 rounded-lg transition-all ${open ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}`}
        title="Inference Parameters"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[9990]" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[9999] p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Model Parameters</h3>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Sensitivity Threshold</span>
                    <span className="font-mono text-blue-400 text-[10px]">{advancedSettings.threshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={advancedSettings.threshold}
                    onChange={(e) => setAdvancedSettings((prev) => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Grid Rows</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={advancedSettings.tileRows}
                        onChange={(e) => setAdvancedSettings((prev) => ({ ...prev, tileRows: Number(e.target.value) || 1 }))}
                        className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 w-full transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Grid Columns</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={advancedSettings.tileCols}
                        onChange={(e) => setAdvancedSettings((prev) => ({ ...prev, tileCols: Number(e.target.value) || 1 }))}
                        className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 w-full transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setAdvancedSettings((prev) => ({ ...prev, parallelTiles: !prev.parallelTiles }))}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      advancedSettings.parallelTiles 
                        ? 'bg-blue-600/5 border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/5' 
                        : 'bg-black/20 border-white/5 text-zinc-500 grayscale'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Parallel Compute</span>
                      <span className="text-[8px] opacity-70">Requires multi-core hardware</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${advancedSettings.parallelTiles ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${advancedSettings.parallelTiles ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-950/50 -mx-4 -mb-4 p-3 border-t border-white/5 text-center">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Neural Engine Params v2.1</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
