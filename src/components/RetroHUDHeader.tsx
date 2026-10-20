import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, Settings, User } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { SettingsModal } from './SettingsModal';
import { ProfileModal } from './ProfileModal';

interface RetroHUDHeaderProps {
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  crtOverlay: boolean;
  onToggleCrtOverlay: () => void;
  parallaxEnabled: boolean;
  onToggleParallax: () => void;
}

export const RetroHUDHeader: React.FC<RetroHUDHeaderProps> = ({
  archetypeMode,
  onToggleArchetypeMode,
  crtOverlay,
  onToggleCrtOverlay,
  parallaxEnabled,
  onToggleParallax,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [callsign, setCallsign] = useState(() => {
    return localStorage.getItem('focusverse_callsign') || 'Explorer_99';
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('focusverse_streak') || '1', 10);
  });

  const [masterVolume, setMasterVolume] = useState(() => {
    return audioEngine.getState().ambienceVolume || 0.5;
  });

  // Re-read callsign if modal saved it
  useEffect(() => {
    if (!isProfileOpen) {
      setCallsign(localStorage.getItem('focusverse_callsign') || 'Explorer_99');
      setStreak(parseInt(localStorage.getItem('focusverse_streak') || '1', 10));
    }
  }, [isProfileOpen]);

  return (
    <>
      <header className="w-full px-4 pt-3 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 bg-[#0D0B1E]/85 backdrop-blur-md border border-white/15 text-[11px] font-mono select-none shadow-md">
          {/* ========================================================= */}
          {/* TOP-LEFT: BRAND ICON, SYSTEM STATUS & VERSION             */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-2.5 h-2.5 bg-arcade-gold rotate-45 shrink-0" />
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] sm:text-[11px] text-white tracking-wider">
                FOCUS<span className="text-arcade-gold">VERSE</span>
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-[10px] text-gray-400 hidden sm:inline font-mono">
                v2.6 KERNEL
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 border border-green-500/30 text-[9px] text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              <span className="font-bold">SYSTEM ONLINE</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER: RESTRAINED TELEMETRY READOUTS (DESKTOP)           */}
          {/* ========================================================= */}
          <div className="hidden lg:flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-gray-600">//</span> KERNEL:
              <strong className="text-arcade-gold">READY</strong>
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center gap-1">
              <span className="text-gray-600">//</span> WORLDS:
              <strong className="text-arcade-cyan">20 ONLINE</strong>
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center gap-1">
              <span className="text-gray-600">//</span> SYNC:
              <strong className="text-green-400">100%</strong>
            </span>
          </div>

          {/* ========================================================= */}
          {/* TOP-RIGHT: PROFILE PILL, STREAK BADGE & SETTINGS          */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2">
            {/* Focus Streak Badge */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-void-darkest border border-amber-500/40 text-[10px] text-amber-300 hover:border-arcade-gold hover:text-white transition-all shadow-sm"
              title="View your streak telemetry"
            >
              <Flame size={12} className="text-amber-400 animate-pulse" />
              <span className="font-bold">{streak}-DAY STREAK</span>
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-void-darkest border border-arcade-cyan/50 text-[10px] text-arcade-cyan hover:border-white hover:text-white transition-all shadow-sm"
              title="Open Explorer Profile & Statistics"
            >
              <User size={12} className="text-arcade-cyan" />
              <span className="font-bold max-w-[100px] truncate">
                {callsign}
              </span>
            </button>

            {/* Settings Control */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsSettingsOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-1 border border-white/20 bg-void-darkest text-[10px] text-gray-300 hover:border-arcade-gold hover:text-arcade-gold transition-all"
              title="Open System Audio & Display Settings"
              aria-label="Settings configuration"
            >
              <Settings size={12} className="text-arcade-gold" />
              <span className="hidden sm:inline font-mono">CONFIG</span>
            </button>

            {/* Quick Safe Mode Toggle Pill */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleArchetypeMode();
              }}
              className={`px-2 py-1 border text-[10px] hidden sm:flex items-center gap-1 transition-all ${
                archetypeMode
                  ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
              title="Toggle Copyright-Safe RPG Archetype Names"
            >
              <ShieldCheck size={12} />
              <span>{archetypeMode ? 'SAFE: ON' : 'SAFE: OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        archetypeMode={archetypeMode}
        onToggleArchetypeMode={onToggleArchetypeMode}
        crtOverlay={crtOverlay}
        onToggleCrtOverlay={onToggleCrtOverlay}
        parallaxEnabled={parallaxEnabled}
        onToggleParallax={onToggleParallax}
        masterVolume={masterVolume}
        onVolumeChange={(val) => setMasterVolume(val)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        streakCount={streak}
      />
    </>
  );
};

export default RetroHUDHeader;
