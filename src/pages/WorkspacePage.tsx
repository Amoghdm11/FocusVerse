import React, { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, Minimize2, ShieldCheck, Sliders, Sparkles, Volume2, VolumeX, Music, Eye } from 'lucide-react';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { EnvironmentFX } from '../components/EnvironmentFX';
import { PixelEmblem } from '../components/PixelEmblems';
import { PixelCharacterSprite } from '../components/PixelCharacterSprite';
import { FullBodyPixelSprite } from '../components/FullBodyPixelSprite';
import { CustomAppearanceState, OUTFIT_CATALOG } from '../utils/pixelSpriteCompositor';
import { TimerWidget } from '../components/TimerWidget';
import { TodoWidget } from '../components/TodoWidget';
import { NotesWidget } from '../components/NotesWidget';
import { UserFocusAction } from '../components/AudioCodeFooter';
import { audioEngine } from '../utils/audioEngine';
import { Footer } from '../components/Footer';

interface WorkspacePageProps {
  character: Character;
  playerName?: string;
  customAppearance?: CustomAppearanceState | null;
  onSelectAnotherCharacter: (char: Character) => void;
  onBackToRoster: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  character,
  playerName = 'TRAINER',
  customAppearance = null,
  onSelectAnotherCharacter,
  onBackToRoster,
  archetypeMode,
  onToggleArchetypeMode,
}) => {
  const [zenMode, setZenMode] = useState(false);
  const [dimmerOpacity, setDimmerOpacity] = useState(0.65);
  const [showDimmerSlider, setShowDimmerSlider] = useState(false);
  const [currentAction, setCurrentAction] = useState<UserFocusAction>('IDLE');
  const [timerModeReadout, setTimerModeReadout] = useState('POMODORO');
  const [companionBubble, setCompanionBubble] = useState<string | null>(null);

  // Compact Header Audio Controls
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [ambienceVol, setAmbienceVol] = useState(0.4);
  const [synthVol, setSynthVol] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string>(character.ambienceProfile);

  useEffect(() => {
    setActiveProfile(character.ambienceProfile);
    audioEngine.setSynthNotes(character.synthNotes);
    if (isAmbiencePlaying) {
      audioEngine.setAmbienceProfile(character.ambienceProfile);
    }
  }, [character]);

  const toggleAmbience = () => {
    audioEngine.playClick();
    const playing = audioEngine.toggleAmbience(activeProfile);
    setIsAmbiencePlaying(playing);
  };

  const toggleSynth = () => {
    audioEngine.playClick();
    const playing = audioEngine.toggleSynth();
    setIsSynthPlaying(playing);
  };

  const toggleMute = () => {
    audioEngine.playClick();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleAmbienceVol = (v: number) => {
    setAmbienceVol(v);
    audioEngine.setAmbienceVolume(v);
  };

  const handleSynthVol = (v: number) => {
    setSynthVol(v);
    audioEngine.setSynthVolume(v);
  };

  const handleProfileSelect = (prof: string) => {
    setActiveProfile(prof);
    audioEngine.setAmbienceProfile(prof);
  };

  const toggleZenMode = () => {
    audioEngine.playClick();
    setZenMode(!zenMode);
  };

  const handleCompanionClick = () => {
    audioEngine.playClick();
    audioEngine.playVictoryJingle(character.synthNotes);
    setCompanionBubble(character.quote);
    setTimeout(() => setCompanionBubble(null), 3800);
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
      <header className="relative z-30 px-3 py-2 bg-void-darkest/95 border-b-2 border-arcade-border shadow-[0_2px_12px_rgba(0,0,0,0.6)] backdrop-blur-sm select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Back to Roster + Player Name Badge + Character Selector */}
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

            {/* Confirmed Player Name Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#090714] border border-arcade-cyan text-[10px] font-pixel text-arcade-cyan shadow-pixel-sm">
              <span className="text-[11px]">👤</span>
              <span className="truncate max-w-[110px]">{playerName.toUpperCase()}</span>
            </div>

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
            {/* Audio Control Pill & Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setShowAudioPopover(!showAudioPopover);
                }}
                className={`px-2 py-1 border text-[10px] font-mono flex items-center gap-1.5 transition-all ${
                  isAmbiencePlaying || isSynthPlaying
                    ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan shadow-pixel-sm font-bold'
                    : 'border-arcade-border text-gray-300 hover:text-white hover:border-arcade-gold'
                }`}
                title="Toggle Study Sounds & Music"
              >
                {isMuted ? (
                  <VolumeX size={13} className="text-red-400" />
                ) : isAmbiencePlaying || isSynthPlaying ? (
                  <Volume2 size={13} className="text-arcade-cyan animate-pulse" />
                ) : (
                  <Volume2 size={13} className="text-gray-400" />
                )}
                <span>
                  SOUND: {isMuted ? 'MUTED' : (isAmbiencePlaying || isSynthPlaying) ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              {/* Audio Settings Popover */}
              {showAudioPopover && (
                <div className="absolute right-0 top-full mt-1.5 p-3.5 bg-void-darkest border-2 border-arcade-border shadow-[0_4px_20px_rgba(0,0,0,0.9)] z-50 w-72 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-arcade-border">
                    <span className="font-silkscreen text-[11px] text-arcade-gold uppercase">
                      STUDY AUDIO ENGINE
                    </span>
                    <button
                      onClick={toggleMute}
                      className={`px-1.5 py-0.5 border text-[9px] uppercase ${
                        isMuted ? 'border-red-500 bg-red-950 text-red-300' : 'border-arcade-border text-gray-400 hover:text-white'
                      }`}
                    >
                      {isMuted ? 'UNMUTE' : 'MUTE ALL'}
                    </button>
                  </div>

                  {/* 1. Procedural Ambience Generator */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-300 font-bold">AMBIENCE ({activeProfile.toUpperCase()})</span>
                      <button
                        onClick={toggleAmbience}
                        className={`px-2 py-0.5 border text-[9px] uppercase font-bold transition-all ${
                          isAmbiencePlaying
                            ? 'border-green-400 bg-green-950/70 text-green-300'
                            : 'border-arcade-border text-gray-400 hover:text-white'
                        }`}
                      >
                        {isAmbiencePlaying ? 'PAUSE' : 'PLAY'}
                      </button>
                    </div>

                    {/* Ambience Profile Selector */}
                    <div className="grid grid-cols-4 gap-1 text-[8px] pt-1">
                      {['rain', 'fire', 'space', 'lofi', 'matrix', 'purr', 'sonar', 'wind'].map((prof) => (
                        <button
                          key={prof}
                          onClick={() => {
                            audioEngine.playClick();
                            handleProfileSelect(prof);
                          }}
                          className={`py-0.5 border text-center uppercase ${
                            activeProfile === prof
                              ? 'border-arcade-gold bg-amber-950/80 text-arcade-gold font-bold'
                              : 'border-arcade-border/60 text-gray-400 hover:text-white'
                          }`}
                        >
                          {prof}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] text-gray-500">VOL:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ambienceVol}
                        onChange={(e) => handleAmbienceVol(parseFloat(e.target.value))}
                        className="w-full accent-arcade-cyan h-1 bg-void"
                      />
                    </div>
                  </div>

                  {/* 2. Chiptune Synth Melody */}
                  <div className="space-y-1.5 pt-2 border-t border-arcade-border/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-300 font-bold">8-BIT SYNTH MELODY</span>
                      <button
                        onClick={toggleSynth}
                        className={`px-2 py-0.5 border text-[9px] uppercase font-bold transition-all ${
                          isSynthPlaying
                            ? 'border-arcade-pink bg-pink-950/70 text-pink-300'
                            : 'border-arcade-border text-gray-400 hover:text-white'
                        }`}
                      >
                        {isSynthPlaying ? 'STOP' : 'PLAY'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500">VOL:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={synthVol}
                        onChange={(e) => handleSynthVol(parseFloat(e.target.value))}
                        className="w-full accent-arcade-pink h-1 bg-void"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

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
            />

            {/* 2D In-Game Focus Companion Stage Card */}
            <div className="bg-void-darkest border-2 border-arcade-border p-3.5 shadow-pixel relative overflow-hidden select-none">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#241E3E] text-[10px] font-mono">
                <span className="text-arcade-gold font-pixel text-[9px] flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 animate-ping inline-block" />
                  FLOW COMPANION
                </span>
                <span className="text-gray-400 font-mono text-[9px]">
                  SYNC: <strong className="text-arcade-cyan">100%</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* 2D Pixel Sprite with Interactive Bobbing & Platform */}
                <div className="relative shrink-0">
                  {customAppearance ? (
                    <FullBodyPixelSprite
                      appearance={customAppearance}
                      size={96}
                      showPlatform={true}
                      platformColor={character.palette.borderPrimary}
                      animated={true}
                      onClick={handleCompanionClick}
                      title="Click hero for focus melody"
                    />
                  ) : (
                    <PixelCharacterSprite
                      characterId={character.id}
                      size={80}
                      showPlatform={true}
                      platformColor={character.palette.borderPrimary}
                      platformGlow={character.palette.borderPrimary}
                      statusAura={isAmbiencePlaying || isSynthPlaying}
                      animated={true}
                      onClick={handleCompanionClick}
                      title="Click companion for focus quote & melody"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase">
                    <span>{character.index}</span>
                    <span>•</span>
                    <span className="truncate">
                      {customAppearance
                        ? OUTFIT_CATALOG.find((s) => s.id === customAppearance.outfit)?.focusMod || character.universe
                        : character.universe}
                    </span>
                  </div>

                  <h3 className="font-pixel text-xs text-white uppercase truncate mt-0.5 mb-1">
                    {customAppearance
                      ? OUTFIT_CATALOG.find((s) => s.id === customAppearance.outfit)?.name || character.name
                      : archetypeMode
                      ? character.archetypeName.split('/')[0]
                      : character.name.split('(')[0]}
                  </h3>

                  <p className="text-[10px] font-mono text-gray-300 line-clamp-2 italic leading-relaxed">
                    {companionBubble
                      ? `"${companionBubble}"`
                      : customAppearance
                      ? OUTFIT_CATALOG.find((s) => s.id === customAppearance.outfit)?.description || character.quote
                      : character.quote}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-mono">
                    <button
                      onClick={handleCompanionClick}
                      className="pixel-btn px-2 py-0.5 text-arcade-gold text-[9px] flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                      <Sparkles size={10} />
                      <span>TAP TO MOTIVATE</span>
                    </button>
                    <span className="text-arcade-cyan font-pixel text-[8px] truncate">
                      TRAINER: {playerName.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center & Right Columns: Todo List & Scratchpad (7 Cols, Hidden in Zen) */}
          {!zenMode && (
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          )}
        </div>
      </main>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};
