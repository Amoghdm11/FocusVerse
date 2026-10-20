import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, MessageSquare, Sparkles } from 'lucide-react';
import { tutorDialogueService, ActiveTutorDialogue } from '../utils/tutorDialogueService';
import { Character } from '../types/character';
import { audioEngine } from '../utils/audioEngine';
import { rpgStore } from '../utils/rpgStore';

interface TutorDialogueBannerProps {
  activeCharacter: Character;
  className?: string;
  inline?: boolean;
}

export const TutorDialogueBanner: React.FC<TutorDialogueBannerProps> = ({
  activeCharacter,
  className = '',
  inline = false,
}) => {
  const [dialogue, setDialogue] = useState<ActiveTutorDialogue | null>(null);
  const [settings, setSettings] = useState(rpgStore.getSettings());

  useEffect(() => {
    const unsub = tutorDialogueService.subscribe((d) => {
      setDialogue(d);
    });
    return unsub;
  }, []);

  const handleDismiss = () => {
    audioEngine.playClick();
    tutorDialogueService.dismiss();
  };

  const handleToggleMuteDialogue = () => {
    audioEngine.playClick();
    const newFreq: 'ALL' | 'MUTED' | 'ESSENTIAL' = settings.tutorDialogueFrequency === 'MUTED' ? 'ALL' : 'MUTED';
    const updated = { ...settings, tutorDialogueFrequency: newFreq };
    rpgStore.saveSettings(updated);
    setSettings(updated);
    if (newFreq === 'MUTED') {
      tutorDialogueService.dismiss();
    }
  };

  if (!dialogue || settings.tutorDialogueFrequency === 'MUTED') {
    return null;
  }

  return (
    <div
      className={`${
        inline
          ? 'w-full'
          : 'fixed bottom-14 right-4 z-40 max-w-sm sm:max-w-md w-full animate-slideIn'
      } ${className}`}
    >
      <div className="bg-[#120D22]/95 pixel-border border-2 border-arcade-gold p-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.8)] backdrop-blur-md font-mono text-xs text-gray-200 relative select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-arcade-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-arcade-gold animate-ping rounded-full" />
            <span className="font-pixel text-[9px] text-arcade-gold uppercase">
              {dialogue.tutorName || activeCharacter.name}
            </span>
            <span className="text-[8px] text-gray-400 font-pixel">
              // {dialogue.event.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMuteDialogue}
              className="text-gray-400 hover:text-white p-0.5"
              title="Mute tutor dialogue"
            >
              <Volume2 size={12} className="text-arcade-cyan" />
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white p-0.5"
              title="Dismiss message"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Message Body */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 bg-void border border-arcade-gold flex items-center justify-center text-lg shrink-0 shadow-pixel-sm">
            {activeCharacter.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}
          </div>
          <div className="flex-1">
            <p className="text-white text-xs leading-relaxed italic">
              &ldquo;{dialogue.message}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer tip */}
        <div className="mt-2 pt-1 border-t border-arcade-border/30 flex items-center justify-between text-[8px] text-gray-500 font-pixel">
          <span>TUTOR TELEMETRY ACTIVE</span>
          <button
            onClick={handleDismiss}
            className="text-arcade-gold hover:underline"
          >
            DISMISS [X]
          </button>
        </div>
      </div>
    </div>
  );
};
