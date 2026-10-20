import React from 'react';
import { X, Volume2, VolumeX, Monitor, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  crtOverlay: boolean;
  onToggleCrtOverlay: () => void;
  parallaxEnabled: boolean;
  onToggleParallax: () => void;
  masterVolume: number;
  onVolumeChange: (vol: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  archetypeMode,
  onToggleArchetypeMode,
  crtOverlay,
  onToggleCrtOverlay,
  parallaxEnabled,
  onToggleParallax,
  masterVolume,
  onVolumeChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0E0B1C] border-2 border-arcade-gold shadow-[0_0_30px_rgba(245,194,66,0.3)] p-5 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2A2354]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-arcade-gold animate-ping" />
            <h2 id="settings-title" className="font-pixel text-xs text-arcade-gold uppercase tracking-wider">
              SYSTEM SETTINGS // CONFIG
            </h2>
          </div>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-4 font-mono text-xs">
          {/* 1. Master Audio Volume Slider */}
          <div className="p-3 bg-void-darkest border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-bold flex items-center gap-2">
                {masterVolume > 0 ? <Volume2 size={14} className="text-arcade-gold" /> : <VolumeX size={14} className="text-gray-500" />}
                MASTER AUDIO VOLUME
              </span>
              <span className="text-arcade-gold font-bold">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onVolumeChange(val);
                audioEngine.setAmbienceVolume(val);
                audioEngine.setSynthVolume(val);
              }}
              className="w-full accent-[#F5C242] cursor-pointer"
            />
          </div>

          {/* 2. CRT Scanline Overlay */}
          <div className="flex items-center justify-between p-3 bg-void-darkest border border-white/10">
            <div className="flex items-center gap-2 text-gray-300">
              <Monitor size={14} className="text-arcade-cyan" />
              <div>
                <div className="font-bold">CRT SCANLINE FILTER</div>
                <div className="text-[10px] text-gray-500">Retro arcade monitor scanlines</div>
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleCrtOverlay();
              }}
              className={`px-3 py-1 text-[10px] font-pixel border transition-all ${
                crtOverlay
                  ? 'border-arcade-cyan bg-cyan-950/80 text-arcade-cyan shadow-pixel-sm'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
            >
              {crtOverlay ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* 3. Starfield Parallax Effect */}
          <div className="flex items-center justify-between p-3 bg-void-darkest border border-white/10">
            <div className="flex items-center gap-2 text-gray-300">
              <Sparkles size={14} className="text-arcade-pink" />
              <div>
                <div className="font-bold">COSMIC PARALLAX</div>
                <div className="text-[10px] text-gray-500">Cursor mouse tracking depth</div>
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleParallax();
              }}
              className={`px-3 py-1 text-[10px] font-pixel border transition-all ${
                parallaxEnabled
                  ? 'border-arcade-pink bg-pink-950/80 text-arcade-pink shadow-pixel-sm'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
            >
              {parallaxEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* 4. Copyright-Safe Mode (Archetypes) */}
          <div className="flex items-center justify-between p-3 bg-void-darkest border border-white/10">
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck size={14} className="text-green-400" />
              <div>
                <div className="font-bold">SAFE MODE (ARCHETYPES)</div>
                <div className="text-[10px] text-gray-500">Original RPG labels vs canon names</div>
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleArchetypeMode();
              }}
              className={`px-3 py-1 text-[10px] font-pixel border transition-all ${
                archetypeMode
                  ? 'border-green-400 bg-green-950/80 text-green-400 shadow-pixel-sm'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
            >
              {archetypeMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#2A2354] flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>FOCUSVERSE KERNEL v2.6</span>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="pixel-btn-primary px-4 py-1.5 text-black font-pixel text-[9px]"
          >
            [ DONE ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
