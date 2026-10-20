import React, { useState, useEffect } from 'react';
import { Award, Zap, X, Star } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { Achievement } from '../types/rpg';

interface XpEventDetail {
  amount: number;
  reason: string;
  leveledUp: boolean;
  level: number;
}

export const LevelUpModal: React.FC = () => {
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const handleXp = (e: Event) => {
      const customEvent = e as CustomEvent<XpEventDetail>;
      if (customEvent.detail && customEvent.detail.leveledUp) {
        audioEngine.playVictoryJingle();
        setLevelUpData({ level: customEvent.detail.level });
      }
    };

    const handleAchievement = (e: Event) => {
      const customEvent = e as CustomEvent<{ achievement: Achievement }>;
      if (customEvent.detail && customEvent.detail.achievement) {
        audioEngine.playVictoryJingle();
        setUnlockedAchievement(customEvent.detail.achievement);
      }
    };

    window.addEventListener('focusverse_xp_awarded', handleXp);
    window.addEventListener('focusverse_achievement_unlocked', handleAchievement);

    return () => {
      window.removeEventListener('focusverse_xp_awarded', handleXp);
      window.removeEventListener('focusverse_achievement_unlocked', handleAchievement);
    };
  }, []);

  return (
    <>
      {/* Level Up Fanfare Modal */}
      {levelUpData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border-gold p-6 max-w-sm w-full text-center shadow-[0_0_30px_rgba(245,194,66,0.4)] relative">
            <button
              onClick={() => setLevelUpData(null)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="text-4xl mb-2 animate-bounce">⭐</div>
            <h2 className="font-pixel text-sm text-arcade-gold mb-1">LEVEL UP!</h2>
            <div className="text-2xl font-silkscreen text-white my-3">
              LEVEL {levelUpData.level}
            </div>
            <p className="text-xs text-gray-300 font-mono mb-4">
              Your dedication has unlocked greater mental endurance and rank!
            </p>

            <button
              onClick={() => {
                audioEngine.playClick();
                setLevelUpData(null);
              }}
              className="pixel-btn-primary w-full py-2 font-pixel text-[11px] uppercase"
            >
              [ CLAIM REWARD &amp; CONTINUE ]
            </button>
          </div>
        </div>
      )}

      {/* Achievement Unlocked Toast Banner */}
      {unlockedAchievement && (
        <div className="fixed bottom-6 right-6 z-50 bg-void-card pixel-border-cyan p-4 max-w-md flex items-start gap-3 shadow-[0_0_20px_rgba(92,225,230,0.4)] animate-slideUp">
          <div className="text-3xl p-1 bg-void border border-arcade-cyan">
            {unlockedAchievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-arcade-cyan uppercase">
                ACHIEVEMENT UNLOCKED
              </span>
              <button
                onClick={() => setUnlockedAchievement(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            <h4 className="font-silkscreen text-xs text-white mt-0.5">
              {unlockedAchievement.title}
            </h4>
            <p className="text-[10px] text-gray-300 font-mono mt-0.5">
              {unlockedAchievement.description}
            </p>
            <span className="inline-block mt-1 font-pixel text-[9px] text-arcade-gold">
              +{unlockedAchievement.xp} XP
            </span>
          </div>
        </div>
      )}
    </>
  );
};
