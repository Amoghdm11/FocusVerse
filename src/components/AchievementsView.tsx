import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  Flame, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  Lock, 
  Sparkles,
  Crown,
  Tag
} from 'lucide-react';
import { rpgStore } from '../utils/rpgStore';
import { UserRPGProfile, Achievement, DailyQuest } from '../types/rpg';
import { audioEngine } from '../utils/audioEngine';

export const AchievementsView: React.FC = () => {
  const [profile, setProfile] = useState<UserRPGProfile>(rpgStore.getProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(rpgStore.getAchievements());
  const [quests, setQuests] = useState<DailyQuest[]>(rpgStore.getDailyQuests());

  const xpPercent = Math.min(100, Math.round((profile.currentXp / profile.nextLevelXp) * 100));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const titlesList = [
    'Apprentice Hacker',
    'Focus Adept',
    'Flow State Ninja',
    'Cyber Knight',
    'Master of Recall',
    'Algorithmic Sage',
    'Grand Grandmaster',
  ];

  const handleSelectTitle = (title: string) => {
    audioEngine.playClick();
    const updated = { ...profile, selectedTitle: title };
    rpgStore.saveProfile(updated);
    setProfile(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-gold flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            🏆
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              RPG PROGRESSION, QUESTS &amp; ACHIEVEMENTS
            </h1>
            <p className="text-[10px] text-gray-400">
              Level up your study companion, complete daily bounties, and collect arcade honors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-void-card border border-arcade-gold text-arcade-gold font-pixel text-xs">
            RANK: {profile.selectedTitle}
          </div>
        </div>
      </div>

      {/* Top Banner: Hero Rank & XP Telemetry */}
      <div className="bg-void-card pixel-border border-arcade-gold p-6 shadow-pixel">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Level Emblem (4 cols) */}
          <div className="md:col-span-4 flex items-center gap-4 border-r border-arcade-border/60 pr-4">
            <div className="w-20 h-20 bg-void border-2 border-arcade-gold flex flex-col items-center justify-center shadow-pixel relative">
              <span className="font-pixel text-[10px] text-arcade-gold">LVL</span>
              <span className="font-silkscreen text-3xl text-white font-bold">{profile.level}</span>
              <div className="absolute -bottom-2 -right-2 text-xl">⭐</div>
            </div>
            <div>
              <div className="font-silkscreen text-sm text-white">
                {profile.selectedTitle}
              </div>
              <div className="text-[10px] text-arcade-cyan mt-1">
                Streak: {profile.streakDays} Days active
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Unlocked Achievements: {unlockedCount} / {achievements.length}
              </div>
            </div>
          </div>

          {/* XP Gauge & Level Up Info (8 cols) */}
          <div className="md:col-span-8 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-silkscreen text-arcade-gold">
                LEVEL {profile.level} &gt; LEVEL {profile.level + 1}
              </span>
              <span className="text-gray-300 font-pixel text-[10px]">
                {profile.currentXp} / {profile.nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>
            <div className="w-full h-4 bg-void border-2 border-arcade-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-arcade-gold via-yellow-400 to-amber-300 transition-all duration-500 shadow-pixel-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Earn XP by finishing focus sessions (+2 XP/min), clearing tasks (+20-50 XP), reviewing flashcards (+15 XP), and meeting daily goals (+100 XP).
            </p>
          </div>
        </div>
      </div>

      {/* Quests & Collectibles Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Daily & Weekly Quests Board (7 cols) */}
        <div className="lg:col-span-7 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
            <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
              ACTIVE DAILY QUESTS ({quests.filter((q) => q.completed).length}/{quests.length} COMPLETED)
            </span>
            <span className="font-pixel text-[9px] text-arcade-gold">RESET: MIDNIGHT</span>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => {
              const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
              return (
                <div
                  key={quest.id}
                  className={`p-3 bg-void border transition-all ${
                    quest.completed
                      ? 'border-green-500/70 bg-green-950/20'
                      : 'border-arcade-border hover:border-arcade-cyan'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-bold text-xs ${quest.completed ? 'line-through text-gray-400' : 'text-gray-100'}`}>
                        {quest.title}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{quest.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-pixel text-[9px] text-arcade-gold block">
                        +{quest.xpReward} XP
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {quest.progress} / {quest.target}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-void-darkest border border-arcade-border mt-2 overflow-hidden">
                    <div
                      className={`h-full ${quest.completed ? 'bg-green-400' : 'bg-arcade-cyan'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collectibles & Scholar Titles (5 cols) */}
        <div className="lg:col-span-5 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
            <span className="font-silkscreen text-xs text-arcade-gold uppercase">
              SCHOLAR TITLES &amp; BADGES
            </span>
            <span className="text-[9px] text-gray-400">Customizable</span>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-gray-400">Select active honor title:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {titlesList.map((title, i) => {
                const isSelected = profile.selectedTitle === title;
                const isUnlocked = profile.level >= i + 1;

                return (
                  <button
                    key={title}
                    disabled={!isUnlocked}
                    onClick={() => handleSelectTitle(title)}
                    className={`p-2 border text-[10px] text-left flex items-center justify-between ${
                      isSelected
                        ? 'border-arcade-gold bg-amber-950/60 text-arcade-gold font-bold shadow-pixel-sm'
                        : isUnlocked
                        ? 'border-arcade-border bg-void text-gray-300 hover:border-gray-500'
                        : 'border-arcade-border/40 bg-void-darkest text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="truncate">{title}</span>
                    {!isUnlocked ? <Lock size={10} /> : isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Gallery Grid */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
          <span className="font-silkscreen text-xs text-white uppercase">
            HALL OF ACHIEVEMENTS ({unlockedCount} / {achievements.length} UNLOCKED)
          </span>
          <span className="text-[9px] text-arcade-gold font-pixel">100% PERSISTENT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 border flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'border-arcade-gold bg-void shadow-pixel-sm'
                  : 'border-arcade-border/60 bg-void-darkest opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 border flex items-center justify-center text-xl shrink-0 ${
                  ach.unlocked
                    ? 'border-arcade-gold bg-amber-950/40'
                    : 'border-arcade-border bg-void text-gray-600'
                }`}
              >
                {ach.unlocked ? ach.icon : <Lock size={16} />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-silkscreen text-xs ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {ach.title}
                  </h4>
                  <span className="font-pixel text-[9px] text-arcade-gold">
                    +{ach.xp} XP
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{ach.description}</p>
                <div className="text-[8px] text-gray-500 mt-1">
                  Req: {ach.requirement}
                  {ach.unlockedAt && ` • Unlocked ${new Date(ach.unlockedAt).toLocaleDateString()}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
