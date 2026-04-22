import { AnimatePresence, motion } from 'framer-motion';
import { CloudCheck, CloudOff, Link, Menu, Plus, Power, User } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { MobilePanelMenu } from './MobileToolbox';
import { InferenceModel, useInference } from '../hooks/useInference';
const ds = {
  radius: {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-[2.5rem]',
    pill: 'rounded-full',
  },
  colors: {
    bg: 'bg-[#080808]',
    surface: 'bg-zinc-900/40',
    surfaceBlur: 'bg-zinc-900/40 ',
    surfaceSolid: 'bg-[#121212]',
    borderSubtle: 'border-zinc-800/50',
    borderStrong: 'border-zinc-700/50',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-500',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryRing: 'focus-visible:ring-blue-500/80',
    accent: 'bg-indigo-500',
    accentSoft: 'bg-indigo-500/15',
    dangerSoft: 'bg-rose-500/15',
    warningSoft: 'bg-amber-500/15',
    successSoft: 'bg-blue-500/12',
    outline: 'border-zinc-800',
  },
  shadow: {
    soft: 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
    strong: 'shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
  },
  text: {
    label: 'text-[10px] font-bold tracking-[0.2em] uppercase',
    mono: 'font-mono text-[10px]',
  },
};
type ToolbarDropdownId =
  | 'inputSource'
  | 'inferenceModel'
  | 'inferenceControls'
  | 'inferenceAdvanced'
  | 'inferenceStats';
type PanelType = 'terminal' | 'instructions' | null;
export default function Head() {
  const router = useRouter();
  const [backendConnected, setBackendConnected] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'training' | 'inference'>('training');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [roiToolsVisible, setRoiToolsVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<ToolbarDropdownId | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [mobileActivePanelMenu, setMobileActivePanelMenu] = useState<MobilePanelMenu | null>(null);
  const [inferenceViewerMode, setInferenceViewerMode] = useState<'processed' | 'original'>('processed');
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(false);
  const [isLiveView, setIsLiveView] = useState(true);
  const popupRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const closeDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);
  const closeFullscreenPopup = useCallback(() => {
    setShowFullscreenPopup(false);
    setIsLiveView(false);
    if (popupRefreshIntervalRef.current) {
      clearInterval(popupRefreshIntervalRef.current);
      popupRefreshIntervalRef.current = null;
    }
  }, []);
  // const inference = useInference({
  //   backendUrl: NEXT_PUBLIC_BACKEND_URL,
  //   inputSource,
  //   isOakStreaming,
  //   remoteCameraActive,
  //   remoteCameraFrame,
  //   rois,
  //   selectedROI,
  //   videoDimensions,
  //   videoRef,
  //   oakStreamRef,
  //   getVideoFile: () => videoFile,
  //   onInputSourceChange: handleInputSourceChange,
  //   onVideoLoaded: (file, url) => {
  //     setVideoFile(file);
  //     setVideoUrl(url);
  //   },
  //   addTerminalLog,
  // });
  const handleViewModeChange = (mode: 'training' | 'inference') => {
    if (mode === viewMode) {
      return;
    }

    // Auto-close ROI palette if currently open during mode switch
    if (roiToolsVisible) {
      setRoiToolsVisible(false);
    }

    closeDropdowns();
    setActivePanel(null);
    setMobileActivePanelMenu(null);
    setShowMobileMenu(false);
    closeFullscreenPopup();
    // if (mode === 'training') {
    //   void inference.stopInference();
    // } else {
    //   setInferenceViewerMode('processed');
    //   void inference.loadModels();
    //   void inference.fetchLoadedModels();
    // }
    setViewMode(mode);
  };

  const toggleMobilePanelMenu = useCallback((panel: MobilePanelMenu) => {
    const nextMode =
      panel === 'inference' || panel === 'model'
        ? 'inference'
        : panel === 'training-model' ||
          panel === 'roi' ||
          panel === 'recording' ||
          panel === 'projects'
          ? 'training'
          : null;

    if (nextMode && nextMode !== viewMode) {
      handleViewModeChange(nextMode);
      setMobileActivePanelMenu(panel);
      return;
    }

    setMobileActivePanelMenu((prev) => (prev === panel ? null : panel));
  }, [viewMode]);
  return (
    <div className={`shrink-0 min-h-[3.75rem] md:h-12 ${ds.colors.surfaceBlur} border-b ${ds.colors.borderSubtle} flex flex-col md:flex-row items-center justify-between z-50 px-3 sm:px-4 md:px-6 py-2 md:py-0`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 shadow-lg shadow-blue-500/10`}>
            {/* <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-white" /> */}
            <img
              src="/1. E only.png"   // path relative to /public
              alt="Logo"
              width={20}             // adjust to fit
              height={20}
              className="w-4 sm:w-5 h-4 sm:h-5"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-blue-500 uppercase">MINT</span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.25em] text-zinc-500 uppercase opacity-70">Vision Intelligence</span>
          </div>
        </div>

        {/* Mobile Menu Toggle + Status Bar */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Status & User - Always visible on mobile */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${backendConnected
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
                }`}
              title={backendConnected ? 'Backend connected' : 'Backend offline'}
            >
              {backendConnected ? <CloudCheck className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="mb-2 px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
                        {isLoggedIn ? user?.name : 'Guest'}
                      </div>
                      {!isLoggedIn ? (
                        <>
                          <Link
                            href="/auth"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            Sign In
                          </Link>
                          <Link
                            href="/auth"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Plus className="w-4 h-4" />
                            Sign Up
                          </Link>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            localStorage.removeItem("access_token")
                            setUser(null)
                            setIsLoggedIn(false)
                            setShowProfileMenu(false)
                            router.push("/auth")
                          }}
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
            </div>
          </div>

          {/* Menu Toggle */}
          <button
            onClick={() => toggleMobilePanelMenu('menu')}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation - Hidden on mobile, shown on sm and up */}
      <nav className="hidden md:flex gap-4 md:gap-8">
        {(['training', 'inference'] as const).map((mode) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => {
                handleViewModeChange(mode);
                setShowMobileMenu(false);
              }}
              className={`relative flex flex-col items-center px-1 py-1 text-xs md:text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${active ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <span>{mode}</span>
              <span className="mt-0.5 md:mt-1 h-0.5 w-6 md:w-10 rounded-full bg-transparent">
                {active && (
                  <motion.span
                    layoutId="mint-header-tab"
                    className="block h-full w-full rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Section - Status & Profile (Desktop/Tablet only) */}
      <div className="hidden md:flex items-center gap-3 md:gap-6">
        <div className="w-px h-3 md:h-4 bg-zinc-800" />
        <div
          className={`flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full border ${backendConnected
            ? 'bg-green-500/20 border-none text-green-400'
            : 'bg-red-500/20 border-none text-red-400'
            }`}
          title={backendConnected ? 'Backend connected' : 'Backend offline'}
        >
          {backendConnected ? <CloudCheck className="w-4 md:w-5 h-4 md:h-5" /> : <CloudOff className="w-4 md:w-5 h-4 md:h-5" />}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 group"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-300">{isLoggedIn ? user?.name : "Guest"}</span>
              <span className="text-[8px] text-blue-500/70 font-mono">v2.0.4</span>
            </div>
            <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <User className="w-3.5 md:w-4 h-3.5 md:h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Plus className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token")
                        setUser(null)
                        setIsLoggedIn(false)
                        setShowProfileMenu(false)
                        router.push("/auth")
                      }}
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
        </div>
      </div>

      {/* Mobile Menu - Shown on mobile when toggled (NAVIGATION ONLY) */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full md:hidden mt-2 pt-2 border-t border-white/10"
          >
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-1">
              {(['training', 'inference'] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      handleViewModeChange(mode);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-white/5'
                      }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
