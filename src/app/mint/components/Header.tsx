'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudCheck, CloudOff, Menu, Plus, Power, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import type { MobilePanelMenu } from './MobileToolbox';

type ViewMode = 'training' | 'inference';

export type MintUser = {
  id: string;
  name: string;
  email: string;
};

type MintHeaderProps = {
  backendConnected: boolean;
  isLoggedIn: boolean;
  showProfileMenu: boolean;
  showMobileMenu: boolean;
  user: MintUser | null;
  viewMode: ViewMode;
  onToggleProfileMenu: () => void;
  onCloseProfileMenu: () => void;
  onLogout: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onShowMobileMenuChange: (visible: boolean) => void;
  onToggleMobilePanelMenu: (panel: MobilePanelMenu) => void;
};

export default function Header({
  backendConnected,
  isLoggedIn,
  showProfileMenu,
  showMobileMenu,
  user,
  viewMode,
  onToggleProfileMenu,
  onCloseProfileMenu,
  onLogout,
  onViewModeChange,
  onShowMobileMenuChange,
  onToggleMobilePanelMenu,
}: MintHeaderProps) {
  const renderProfileMenu = (includeName = false) => (
    <AnimatePresence>
      {showProfileMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={onCloseProfileMenu} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
          >
            {includeName && (
              <div className="mb-2 px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
                {isLoggedIn ? user?.name : 'Guest'}
              </div>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth"
                  className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={onCloseProfileMenu}
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={onCloseProfileMenu}
                >
                  <Plus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Power className="w-4 h-4" />
                Log Out
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const renderNavigationButton = (mode: ViewMode, mobile = false) => {
    const active = viewMode === mode;

    return (
      <button
        key={mode}
        type="button"
        onClick={() => {
          onViewModeChange(mode);
          onShowMobileMenuChange(false);
        }}
        className={
          mobile
            ? `w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-white/5'}`
            : `relative flex flex-col items-center px-1 py-1 text-xs md:text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${active ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'}`
        }
      >
        <span>{mode}</span>
        {!mobile && (
          <span className="mt-0.5 md:mt-1 h-0.5 w-6 md:w-10 rounded-full bg-transparent">
            {active && (
              <motion.span
                layoutId="mint-header-tab"
                className="block h-full w-full rounded-full bg-blue-500"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
          </span>
        )}
      </button>
    );
  };

  return (
    <header
      className={`shrink-0 min-h-12 md:h-12 bg-[#121212] border-b border-zinc-800/50 flex flex-col md:flex-row items-center justify-between z-50 px-3 sm:px-4 md:px-6 py-2 md:py-0`}
    >
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 shadow-lg shadow-blue-500/10">
            <img src="/1. E only.png" alt="Logo" width={20} height={20} className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-blue-500 uppercase">MINT</span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-zinc-500 uppercase opacity-70">
              Vision Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${backendConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
              title={backendConnected ? 'Backend connected' : 'Backend offline'}
            >
              {backendConnected ? <CloudCheck className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
            </div>
            <div className="relative">
              <button
                onClick={onToggleProfileMenu}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
              </button>
              {renderProfileMenu(true)}
            </div>
          </div>

          <button
            onClick={() => onToggleMobilePanelMenu('menu')}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="hidden md:flex gap-4 md:gap-8">
        {(['training', 'inference'] as const).map((mode) => renderNavigationButton(mode))}
      </nav>

      <div className="hidden md:flex items-center gap-3 md:gap-6">
        <div className="w-px h-3 md:h-4 bg-zinc-800" />
        <div
          className={`flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full border ${backendConnected ? 'bg-green-500/20 border-none text-green-400' : 'bg-red-500/20 border-none text-red-400'
            }`}
          title={backendConnected ? 'Backend connected' : 'Backend offline'}
        >
          {backendConnected ? <CloudCheck className="w-4 md:w-5 h-4 md:h-5" /> : <CloudOff className="w-4 md:w-5 h-4 md:h-5" />}
        </div>

        <div className="relative">
          <button onClick={onToggleProfileMenu} className="flex items-center gap-2 group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-300">{isLoggedIn ? user?.name : 'Guest'}</span>
              <span className="text-[8px] text-blue-500/70 font-mono">v2.0.4</span>
            </div>
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <UserIcon className="w-3.5 md:w-4 h-3.5 md:h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </button>
          {renderProfileMenu()}
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full md:hidden mt-2 pt-2 border-t border-white/10"
          >
            <nav className="flex flex-col gap-1">
              {(['training', 'inference'] as const).map((mode) => renderNavigationButton(mode, true))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
