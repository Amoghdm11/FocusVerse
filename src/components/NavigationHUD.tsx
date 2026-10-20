import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  Users, 
  CheckSquare, 
  BarChart2, 
  BookOpen, 
  Award, 
  Flame, 
  Settings, 
  Volume2, 
  VolumeX, 
  Zap, 
  Menu, 
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { rpgStore } from '../utils/rpgStore';
import { UserRPGProfile } from '../types/rpg';
import { Character } from '../types/character';

export type MainNavSection = 
  | 'DASHBOARD' 
  | 'TIMER' 
  | 'TUTORS' 
  | 'TASKS' 
  | 'STATS' 
  | 'NOTES' 
  | 'ACHIEVEMENTS' 
  | 'ROOMS' 
  | 'SETTINGS';

interface NavigationHUDProps {
  currentSection: MainNavSection;
  onSelectSection: (section: MainNavSection) => void;
  activeCharacter: Character;
  onOpenQuickAction: () => void;
  onGoHome?: () => void;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  currentSection,
  onSelectSection,
  activeCharacter,
  onOpenQuickAction,
  onGoHome,
  zenMode = false,
  onToggleZenMode,
}) => {
  const [profile, setProfile] = useState<UserRPGProfile>(rpgStore.getProfile());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync profile when XP is awarded
  useEffect(() => {
    const handleXpUpdate = () => {
      setProfile(rpgStore.getProfile());
    };
    window.addEventListener('focusverse_xp_awarded', handleXpUpdate);
    return () => window.removeEventListener('focusverse_xp_awarded', handleXpUpdate);
  }, []);

  const navItems: { id: MainNavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'TIMER', label: 'Study Timer', icon: <Timer size={14} /> },
    { id: 'TUTORS', label: 'Tutors', icon: <Users size={14} /> },
    { id: 'TASKS', label: 'Tasks & Planner', icon: <CheckSquare size={14} /> },
    { id: 'STATS', label: 'Statistics', icon: <BarChart2 size={14} /> },
    { id: 'NOTES', label: 'Notes & Cards', icon: <BookOpen size={14} /> },
    { id: 'ACHIEVEMENTS', label: 'Achievements', icon: <Award size={14} /> },
    { id: 'ROOMS', label: 'Study Rooms', icon: <Users size={14} /> },
    { id: 'SETTINGS', label: 'Settings', icon: <Settings size={14} /> },
  ];

  const handleNavClick = (section: MainNavSection) => {
    audioEngine.playClick();
    onSelectSection(section);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    audioEngine.playClick();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const xpPercentage = Math.min(100, Math.round((profile.currentXp / profile.nextLevelXp) * 100));

  return (
    <header className="relative z-40 bg-void-darkest/95 border-b-2 border-arcade-border shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md select-none font-mono text-xs">
      {/* Top Telemetry / Status Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-arcade-border/50">
        {/* Left: Brand + Kernel Version */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              if (onGoHome) onGoHome();
              else handleNavClick('DASHBOARD');
            }}
            className="flex items-center gap-2 text-left group"
            title="Return to Starting Front Page (Home)"
          >
            <div className="w-5 h-5 bg-arcade-gold flex items-center justify-center font-pixel text-[10px] text-black font-bold shadow-pixel-sm group-hover:scale-105 transition-transform">
              FV
            </div>
            <div>
              <span className="font-silkscreen text-xs sm:text-sm text-white tracking-wider font-bold">
                FOCUS<span className="text-arcade-gold">VERSE</span>
              </span>
              <span className="hidden md:inline ml-1.5 font-pixel text-[8px] text-arcade-cyan">
                // RETRO RPG
              </span>
            </div>
          </button>

          {/* Current Tutor Quick Badge */}
          <button
            onClick={() => handleNavClick('TUTORS')}
            className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-void-card border border-arcade-border hover:border-arcade-gold text-[10px] text-gray-300"
            title="Switch Tutor Companion"
          >
            <span className="text-arcade-gold font-pixel text-[9px]">TUTOR:</span>
            <span className="text-white font-bold truncate max-w-[120px]">{activeCharacter.name}</span>
          </button>
        </div>

        {/* Center: RPG Level & Streak Status Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level Pill */}
          <button
            onClick={() => handleNavClick('ACHIEVEMENTS')}
            className="flex items-center gap-1.5 px-2 py-1 bg-void-card border border-arcade-gold shadow-pixel-sm hover:bg-amber-950/40 transition-colors"
            title="Click to view Level & RPG Achievements"
          >
            <span className="font-pixel text-[9px] text-arcade-gold">LVL {profile.level}</span>
            <div className="w-12 sm:w-16 bg-void h-2 border border-arcade-border overflow-hidden relative">
              <div
                className="h-full bg-arcade-gold transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <span className="hidden sm:inline text-[9px] text-gray-400">
              {profile.currentXp}/{profile.nextLevelXp}
            </span>
          </button>

          {/* Streak Pill */}
          <div
            className="flex items-center gap-1 px-2 py-1 bg-void-card border border-arcade-border text-arcade-gold"
            title={`${profile.streakDays} day study streak!`}
          >
            <Flame size={13} className="text-orange-400 animate-pulse" />
            <span className="font-pixel text-[9px] text-white">{profile.streakDays}D</span>
          </div>
        </div>

        {/* Right: Home, Quick Action, Audio Toggle, Zen Mode & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Front Page / Home Sanctuary */}
          {onGoHome && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onGoHome();
              }}
              className="px-2 py-1 border border-arcade-border hover:border-arcade-gold text-[10px] text-gray-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
              title="Return to the starting front page"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">FRONT PAGE</span>
            </button>
          )}

          {/* Quick Action Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenQuickAction();
            }}
            className="pixel-btn-primary px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1 uppercase"
            title="Quick Action Command Palette (Ctrl+K)"
          >
            <Zap size={12} />
            <span className="hidden sm:inline">ACTION</span>
          </button>

          {/* Global Sound Mute Button */}
          <button
            onClick={toggleSound}
            className={`p-1.5 border text-[10px] ${
              isMuted
                ? 'border-red-500 bg-red-950 text-red-400'
                : 'border-arcade-border text-gray-300 hover:text-white hover:border-arcade-cyan'
            }`}
            title={isMuted ? 'Unmute All Sounds' : 'Mute All Sounds'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Zen Mode Button (when applicable) */}
          {onToggleZenMode && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleZenMode();
              }}
              className={`p-1.5 border text-[10px] ${
                zenMode
                  ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
              title="Toggle Zen Focus Mode"
            >
              {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border border-arcade-border text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Main Desktop Horizontal Navigation Bar */}
      <nav className="hidden md:flex max-w-7xl mx-auto px-4 py-1.5 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-silkscreen uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-arcade-gold text-black font-bold shadow-pixel-sm translate-y-[-1px]'
                  : 'text-gray-400 hover:text-white hover:bg-void-card border border-transparent hover:border-arcade-border/60'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden p-3 bg-void-darkest border-b-2 border-arcade-border shadow-pixel grid grid-cols-2 gap-2 text-xs">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2 flex items-center gap-2 border text-[10px] font-silkscreen uppercase text-left ${
                  isActive
                    ? 'border-arcade-gold bg-amber-950/50 text-arcade-gold font-bold'
                    : 'border-arcade-border text-gray-300 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
