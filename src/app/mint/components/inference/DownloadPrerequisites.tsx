'use client';

import { Download, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DownloadPrerequisitesProps {
  onDownload?: () => void;
  isDownloading?: boolean;
}

export default function DownloadPrerequisites({
  onDownload,
  isDownloading = false,
}: DownloadPrerequisitesProps) {
  const [selections, setSelections] = useState({
    model: false,
    library: false,
  });

  const toggleSelection = (key: 'model' | 'library') => {
    setSelections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isAllSelected = selections.model && selections.library;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Review Selections
          </h2>
          <p className="text-xs text-zinc-400">
            Select the required files to download
          </p>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          {/* Model Checkbox */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => toggleSelection('model')}
            className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 transition-all hover:border-white/10 hover:bg-white/10"
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${selections.model
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-zinc-600 bg-transparent'
                }`}
            >
              {selections.model && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-xs font-medium text-zinc-300">Model</span>
          </motion.button>

          {/* Library Checkbox */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => toggleSelection('library')}
            className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 transition-all hover:border-white/10 hover:bg-white/10"
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${selections.library
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-zinc-600 bg-transparent'
                }`}
            >
              {selections.library && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-xs font-medium text-zinc-300">Library</span>
          </motion.button>
        </div>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: isAllSelected && !isDownloading ? 1.02 : 1 }}
          whileTap={{ scale: isAllSelected && !isDownloading ? 0.98 : 1 }}
          onClick={onDownload}
          disabled={!isAllSelected || isDownloading}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold uppercase tracking-widest transition-all ${isAllSelected && !isDownloading
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Download</span>
        </motion.button>

        {/* Info Text */}
        {!isAllSelected && (
          <p className="text-[10px] text-zinc-500">
            Select both Model and Library to enable download
          </p>
        )}
      </div>
    </motion.div>
  );
}
