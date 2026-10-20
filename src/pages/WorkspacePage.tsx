import React, { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, Minimize2, ShieldCheck, Sliders, Sparkles, Volume2, VolumeX, Music, Eye } from 'lucide-react';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { EnvironmentFX } from '../components/EnvironmentFX';
import { PixelEmblem } from '../components/PixelEmblems';
import { TimerWidget } from '../components/TimerWidget';
import { TodoWidget } from '../components/TodoWidget';
import { NotesWidget } from '../components/NotesWidget';
import { MusicCenter } from '../components/MusicCenter';
import { UserFocusAction } from '../components/AudioCodeFooter';
import { audioEngine } from '../utils/audioEngine';
import { Footer } from '../components/Footer';
import { RPGTask } from '../types/rpg';

interface WorkspacePageProps {
  character: Character;
  onSelectAnotherCharacter: (char: Character) => void;
  onBackToRoster: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialTask?: RPGTask | null;
  hideHeader?: boolean;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  character,
  onSelectAnotherCharacter,
  onBackToRoster,
  archetypeMode,
  onToggleArchetypeMode,
  initialTask,
  hideHeader = false,
}) => {
  const [zenMode, setZenMode] = useState(false);
  const [dimmerOpacity, setDimmerOpacity] = useState(0.65);
  const [showDimmerSlider, setShowDimmerSlider] = useState(false);
  const [currentAction, setCurrentAction] = useState<UserFocusAction>('IDLE');
  const [timerModeReadout, setTimerModeReadout] = useState('POMODORO');

  // Audio Mute State
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioEngine.setSynthNotes(character.synthNotes);
  }, [character]);

  const toggleMute = () => {
    audioEngine.playClick();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const toggleZenMode = () => {
    audioEngine.playClick();
    setZenMode(!zenMode);
  };

  return (
    <div className="relative min-h-screen text-gray-200 flex flex-col justify-between selection:bg-arcade-gold selection:text-black">
      {/* Background Atmosphere Layer (Custom Canvas Particles + Dimmer Overlay) */}
      <EnvironmentFX
        type={character.environmentFX}
        palette={character.palette}
        dimmerOpacity={dimmerOpacity}
      />

      {/* --- TOP HUD BAR --- */}
      {!hideHeader && (
        <header className="relative z-30 px-3 py-2 bg-void-darkest/95 border-b-2 border-arcade-border shadow-[0_2px_12px_rgba(0,0,0,0.6)] backdrop-blur-sm select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Back to Roster + Character Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                audioEngine.playClick();
                onBackToRoster();
              }}
              className="pixel-btn px-2.5 py-1 text-gray-300 hover:text-arcade-gold flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">[ ◀ ROSTER ]</span>
              <span className="sm:hidden">ROSTER</span>
            </button>

            {/* Character Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-void-card border border-arcade-border">
              <PixelEmblem
                type={character.pixelSpriteType}
                palette={character.palette}
                size={22}
              />
              <span className="font-pixel text-[10px] text-arcade-gold">
                {character.index}
              </span>
              <span className="font-silkscreen text-[11px] text-white uppercase hidden md:inline">
                {archetypeMode ? character.archetypeName : character.name}
              </span>
            </div>

            {/* Quick Companion Selector */}
            <select
              value={character.id}
              onChange={(e) => {
                const found = CHARACTERS.find((c) => c.id === e.target.value);
                if (found) {
                  audioEngine.playClick();
                  onSelectAnotherCharacter(found);
                }
              }}
              className="bg-void-card border border-arcade-border text-arcade-cyan text-[10px] px-1.5 py-1 outline-none cursor-pointer"
            >
              {CHARACTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.index} {archetypeMode ? c.archetypeName : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Center: Tactical Quote Ticker (Hidden in Zen Mode) */}
          {!zenMode && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-gray-400 max-w-sm truncate">
              <span className="text-arcade-gold">&gt;</span>
              <span className="italic truncate">{character.quote}</span>
            </div>
          )}

          {/* Right: Controls (Audio Pill, Zen Mode, Dimmer, Safe Mode) */}
          <div className="flex items-center gap-2">
            {/* Audio Quick Mute Button */}
            <button
              onClick={toggleMute}
              className={`px-2 py-1 border text-[10px] font-mono flex items-center gap-1.5 transition-all ${
                isMuted
                  ? 'border-red-500 bg-red-950 text-red-400'
                  : 'border-arcade-border text-gray-300 hover:text-white hover:border-arcade-cyan'
              }`}
              title="Toggle Audio Mute"
            >
              {isMuted ? (
                <VolumeX size={13} className="text-red-400" />
              ) : (
                <Volume2 size={13} className="text-arcade-cyan" />
              )}
              <span>{isMuted ? 'SOUND: MUTED' : 'SOUND: ON'}</span>
            </button>

            {/* Background Dimmer Slider Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowDimmerSlider(!showDimmerSlider)}
                className={`p-1 border text-[10px] flex items-center gap-1 ${
                  showDimmerSlider
                    ? 'border-arcade-gold text-arcade-gold bg-amber-950/40'
                    : 'border-arcade-border text-gray-400 hover:text-white'
                }`}
                title="Adjust Background Dimmer"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">DIM: {Math.round(dimmerOpacity * 100)}%</span>
              </button>

              {showDimmerSlider && (
                <div className="absolute right-0 top-full mt-1 p-2 bg-void-darkest border border-arcade-border shadow-pixel z-50 w-44">
                  <div className="text-[9px] text-gray-400 mb-1 flex justify-between">
                    <span>BG DIMMER</span>
                    <span className="text-arcade-gold">{Math.round(dimmerOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.95"
                    step="0.05"
                    value={dimmerOpacity}
                    onChange={(e) => setDimmerOpacity(parseFloat(e.target.value))}
                    className="w-full accent-arcade-gold cursor-pointer h-1.5 bg-void"
                  />
                </div>
              )}
            </div>

            {/* Zen Mode Button */}
            <button
              onClick={toggleZenMode}
              className={`px-2 py-1 border text-[10px] font-silkscreen flex items-center gap-1 transition-all ${
                zenMode
                  ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan font-bold'
                  : 'border-arcade-border text-gray-300 hover:text-white hover:border-arcade-gold'
              }`}
              title="Zen Mode: minimize visual distraction"
            >
              {zenMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span>{zenMode ? 'EXIT ZEN' : 'ZEN MODE'}</span>
            </button>

            {/* Safe Mode Switch */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleArchetypeMode();
              }}
              className={`p-1 border text-[10px] flex items-center gap-1 ${
                archetypeMode
                  ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan'
                  : 'border-arcade-border text-gray-500 hover:text-white'
              }`}
              title="Toggle Copyright-Safe RPG Archetype Names"
            >
              <ShieldCheck size={14} />
            </button>
          </div>
        </div>
      </header>
      )}

      {/* --- MAIN WORKSPACE BODY --- */}
      <main className="relative z-10 flex-1 px-4 py-6 max-w-7xl mx-auto w-full pb-12">
        {/* Workspace Dialog Narrative Box */}
        {!zenMode && (
          <div className="flex flex-col items-center mb-6">
            <div className="inline-block relative px-5 py-2 bg-void-card pixel-border border-arcade-border shadow-pixel text-center">
              <span className="font-pixel text-[10px] sm:text-xs text-arcade-gold uppercase tracking-wider">
                &gt; {character.universe} // {character.tagline}
              </span>
            </div>
          </div>
        )}

        {/* 3-Column Interactive Layout */}
        <div className={`grid grid-cols-1 ${zenMode ? 'max-w-xl mx-auto' : 'lg:grid-cols-12'} gap-5 items-start`}>
          {/* Left Column: Multi-Mode Timer & Focus Song Melody (5 Cols or Full in Zen) */}
          <div className={`${zenMode ? 'w-full' : 'lg:col-span-5'} space-y-4`}>
            <TimerWidget
              character={character}
              onActionChange={(action) => setCurrentAction(action)}
              onModeChange={(mode) => setTimerModeReadout(mode)}
              initialTask={initialTask}
            />
          </div>

          {/* Center & Right Columns: Todo List, Scratchpad & Music Center (7 Cols, Hidden in Zen) */}
          {!zenMode && (
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* To-Do List Widget */}
                <div>
                  <TodoWidget
                    onTaskAction={() => setCurrentAction('TASK_ACTION')}
                    accentColor={character.palette.accentGold}
                  />
                </div>

                {/* Quick Notes Scratchpad Widget */}
                <div>
                  <NotesWidget accentColor={character.palette.accentSecondary} />
                </div>
              </div>

              {/* Dedicated Large MUSIC & AMBIENCE CENTER */}
              <MusicCenter initialAmbienceProfile={character.ambienceProfile} />
            </div>
          )}
        </div>
      </main>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};
