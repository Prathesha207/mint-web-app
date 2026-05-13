'use client';

import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileSidePanelMenuProps {
  isOpen: boolean;
  onClose: () => void;
  panelTitle: string;
  children: React.ReactNode;
}

export default function MobileSidePanelMenu({
  isOpen,
  onClose,
  panelTitle,
  children,
}: MobileSidePanelMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[230] bg-black/40 backdrop-blur-[2px] md:hidden"
          />

          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              bottom: 'calc(4.25rem + env(safe-area-inset-bottom))',
              // Allow menu to grow naturally but cap at viewport height
              maxHeight: 'calc(100dvh - 5.25rem)',
            }}
            className="fixed left-1.5 right-1.5 z-[240] rounded-[1.25rem] border border-neutral-700/60 
             bg-neutral-950/96 shadow-[0_28px_80px_rgba(0,0,0,0.55)] overflow-y-auto"
          >

            <div className="sticky top-0 z-10 border-b border-neutral-700/40 bg-neutral-950/90 backdrop-blur-xl">
              <div className="flex justify-center pt-1">
                <div className="h-1 w-12 rounded-full bg-neutral-700" />
              </div>

              <div className="flex items-center justify-between px-2.5 py-1.5">
                <div className="min-w-0">
                  <h2 className="truncate text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                    {panelTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-neutral-800 bg-neutral-900/70 p-2 text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="overflow-y-auto px-2.5 py-2 custom-scrollbar"
              style={{ maxHeight: 'calc(100% - 46px)' }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
