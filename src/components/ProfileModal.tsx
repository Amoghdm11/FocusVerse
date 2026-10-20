import React, { useState, useEffect } from 'react';
import { X, User, Flame, Award, Clock, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  streakCount,
}) => {
  const [callsign, setCallsign] = useState(() => {
    return localStorage.getItem('focusverse_callsign') || 'Explorer_99';
  });
  const [totalSessions, setTotalSessions] = useState(() => {
    return parseInt(localStorage.getItem('focusverse_total_sessions') || '1', 10);
  });
  const [totalMinutes, setTotalMinutes] = useState(() => {
    return parseInt(localStorage.getItem('focusverse_total_minutes') || '25', 10);
  });

  const handleSaveCallsign = (val: string) => {
    setCallsign(val);
    localStorage.setItem('focusverse_callsign', val);
  };

  const handleResetTelemetry = () => {
    if (confirm('Reset FocusVerse local session telemetry to initial state?')) {
      audioEngine.playClick();
      setTotalSessions(1);
      setTotalMinutes(25);
      localStorage.setItem('focusverse_total_sessions', '1');
      localStorage.setItem('focusverse_total_minutes', '25');
      localStorage.setItem('focusverse_streak', '1');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0E0B1C] border-2 border-arcade-cyan shadow-[0_0_30px_rgba(0,245,212,0.3)] p-5 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2A2354]">
          <div className="flex items-center gap-2">
            <User size={16} className="text-arcade-cyan" />
            <h2 id="profile-title" className="font-pixel text-xs text-arcade-cyan uppercase tracking-wider">
              COMMAND TELEMETRY // PROFILE
            </h2>
          </div>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close profile"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-mono text-xs">
          {/* Callsign Input */}
          <div className="p-3 bg-void-darkest border border-white/10 space-y-1.5">
            <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
              EXPLORER CALLSIGN:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-arcade-cyan font-bold">&gt;</span>
              <input
                type="text"
                value={callsign}
                onChange={(e) => handleSaveCallsign(e.target.value)}
                maxLength={20}
                className="w-full bg-black/50 border border-white/20 px-2 py-1 text-white font-mono text-xs outline-none focus:border-arcade-cyan"
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-void-darkest border border-arcade-gold/40">
              <Flame size={16} className="text-amber-400 mx-auto mb-1 animate-bounce" />
              <div className="font-pixel text-sm text-arcade-gold">{streakCount} DAYS</div>
              <div className="text-[9px] text-gray-400 mt-0.5">CURRENT STREAK</div>
            </div>

            <div className="p-2.5 bg-void-darkest border border-arcade-cyan/40">
              <Award size={16} className="text-arcade-cyan mx-auto mb-1" />
              <div className="font-pixel text-sm text-arcade-cyan">{totalSessions}</div>
              <div className="text-[9px] text-gray-400 mt-0.5">SESSIONS</div>
            </div>

            <div className="p-2.5 bg-void-darkest border border-arcade-pink/40">
              <Clock size={16} className="text-arcade-pink mx-auto mb-1" />
              <div className="font-pixel text-sm text-arcade-pink">{totalMinutes}m</div>
              <div className="text-[9px] text-gray-400 mt-0.5">FOCUS TIME</div>
            </div>
          </div>

          {/* Reset Telemetry */}
          <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500">
            <button
              onClick={handleResetTelemetry}
              className="hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={11} />
              <span>Reset Local Telemetry</span>
            </button>
            <span>STORAGE: LOCAL PERSISTENCE</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#2A2354] flex justify-end">
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="pixel-btn px-4 py-1.5 text-arcade-cyan font-pixel text-[9px]"
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
