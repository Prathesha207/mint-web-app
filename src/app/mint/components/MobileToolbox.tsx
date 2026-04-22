'use client';

import React from 'react';
import {
  Camera,
  Cpu,
  HelpCircle,
  PowerOff,
  Terminal,
  Settings,
  Sliders,
  Target,
  Upload,
  Zap,
} from 'lucide-react';

export type MobilePanelMenu =
  | 'controls'
  | 'menu'
  | 'sources'
  | 'tools'
  | 'projects'
  | 'inference'
  | 'model'
  | 'training-model'
  | 'roi'
  | 'recording'
  | 'terminal'
  | 'instructions';

interface MobileToolboxProps {
  backendConnected: boolean;
  inputSource: string;
  onStop: () => void;
  showStopButton: boolean;
  viewMode: 'training' | 'inference';
  mobileActivePanelMenu: MobilePanelMenu | null;
  onOpenPanelMenu: (panelName: MobilePanelMenu) => void;
}

interface ToolTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
}

type ToolOption = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
};

function ToolTile({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  danger = false,
  title,
}: ToolTileProps) {
  const stateStyles = danger
    ? 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
    : active
      ? 'border-blue-500/35 bg-blue-500/12 text-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]'
      : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/90 hover:text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-pressed={active}
      className={[
        'flex shrink-0 h-[3.2rem] w-[3.2rem] min-w-[3.2rem] flex-col items-center justify-center gap-1 rounded-[0.95rem] border px-1 py-1 text-center',
        'text-[0.42rem] font-bold uppercase tracking-[0.12em] leading-tight transition-all duration-200',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45',
        stateStyles,
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="max-w-full leading-tight">{label}</span>
    </button>
  );
}

export default function MobileToolbox({
  backendConnected,
  inputSource,
  onStop,
  showStopButton,
  viewMode,
  mobileActivePanelMenu,
  onOpenPanelMenu,
}: MobileToolboxProps) {
  const openMenu = (panelName: MobilePanelMenu) => onOpenPanelMenu(panelName);
  const isCameraSource = inputSource === 'camera' || inputSource === 'oak' || inputSource === 'remote';
  const isTrainingMode = viewMode === 'training';
  const isInferenceMode = viewMode === 'inference';

  const trainingTiles: ToolOption[] = [
    {
      icon: Upload,
      label: 'Upload',
      active: inputSource === 'upload',
      onClick: () => openMenu('sources'),
      title: 'Upload Video',
    },
    {
      icon: Camera,
      label: 'Camera',
      active: isCameraSource,
      disabled: !backendConnected,
      onClick: () => openMenu('sources'),
      title: backendConnected ? 'Camera Sources' : 'Backend connection required',
    },
    {
      icon: Cpu,
      label: 'Training Model',
      active: mobileActivePanelMenu === 'training-model',
      onClick: () => openMenu('training-model'),
      title: 'Training Model',
    },
    {
      icon: Target,
      label: 'ROIs',
      active: mobileActivePanelMenu === 'roi',
      onClick: () => openMenu('roi'),
      title: 'ROI Tools',
    },
    {
      icon: Settings,
      label: 'Recording',
      active: mobileActivePanelMenu === 'recording',
      onClick: () => openMenu('recording'),
      title: 'Recording Settings',
    },
    {
      icon: Terminal,
      label: 'Terminal',
      active: mobileActivePanelMenu === 'terminal',
      onClick: () => openMenu('terminal'),
      title: 'Terminal',
    },
    {
      icon: HelpCircle,
      label: 'Instruction',
      active: mobileActivePanelMenu === 'instructions',
      onClick: () => openMenu('instructions'),
      title: 'Instruction',
    },
  ];

  const inferenceTiles: ToolOption[] = [
    {
      icon: Camera,
      label: 'Camera Options',
      active: isCameraSource,
      onClick: () => openMenu('sources'),
      title: 'Camera Options',
    },
    {
      icon: Sliders,
      label: 'Model Selection',
      active: mobileActivePanelMenu === 'model',
      onClick: () => openMenu('model'),
      title: 'Model Selection',
    },
    {
      icon: Zap,
      label: 'Inference Control',
      active: mobileActivePanelMenu === 'inference',
      onClick: () => openMenu('inference'),
      title: 'Inference Control',
    },
    {
      icon: Terminal,
      label: 'Terminal',
      active: mobileActivePanelMenu === 'terminal',
      onClick: () => openMenu('terminal'),
      title: 'Terminal',
    },
    {
      icon: HelpCircle,
      label: 'Instruction',
      active: mobileActivePanelMenu === 'instructions',
      onClick: () => openMenu('instructions'),
      title: 'Instruction',
    },
  ];

  const visibleTiles = isTrainingMode ? trainingTiles : inferenceTiles;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-neutral-800 bg-neutral-950/96 shadow-[0_-10px_30px_rgba(0,0,0,0.32)] backdrop-blur-xl md:hidden">
      <div className="overflow-x-auto overscroll-x-contain scroll-smooth scrollbar-hide touch-pan-x">
        <div className="flex min-w-max items-stretch justify-start gap-1 px-2 py-1.5">
          {visibleTiles.map((tile) => (
            <ToolTile
              key={tile.label}
              icon={tile.icon}
              label={tile.label}
              onClick={tile.onClick}
              active={tile.active}
              disabled={tile.disabled}
              title={tile.title}
            />
          ))}

          <ToolTile
            icon={PowerOff}
            label="Stop"
            onClick={onStop}
            danger={showStopButton}
            disabled={!showStopButton}
            title="Stop Input"
          />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
