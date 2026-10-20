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
import { MusicCenter } from '../components/MusicCenter';
import { UserFocusAction } from '../components/AudioCodeFooter';
import { audioEngine } from '../utils/audioEngine';
import { Footer } from '../components/Footer';
import { RPGTask } from '../types/rpg';
import { TutorDialogueBanner } from '../components/TutorDialogueBanner';
import { tutorDialogueService } from '../utils/tutorDialogueService';
import { rpgStore } from '../utils/rpgStore';
import { TUTOR_ECOSYSTEM_PROFILES } from '../data/tutorProfiles';

interface WorkspacePageProps {
  character: Character;
  playerName?: string;
  customAppearance?: CustomAppearanceState | null;
  onSelectAnotherCharacter: (char: Character) => void;
  onBackToRoster: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialTask?: RPGTask | null;
  hideHeader?: boolean;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  character,
  playerName = 'TRAINER',
  customAppearance = null,
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
  const [companionBubble, setCompanionBubble] = useState<string | null>(null);

  // Compact Header Audio Controls
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [ambienceVol, setAmbienceVol] = useState(0.4);
  const [synthVol, setSynthVol] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string>(character.ambienceProfile);
  const [dismissedSubjectSuggestion, setDismissedSubjectSuggestion] = useState(false);

  const suggestedTutorId = initialTask?.subject ? rpgStore.getTutorForSubject(initialTask.subject) : null;
  const showSubjectSuggestion = !dismissedSubjectSuggestion && suggestedTutorId && suggestedTutorId !== character.id;
  const suggestedProfile = suggestedTutorId ? TUTOR_ECOSYSTEM_PROFILES[suggestedTutorId] : null;

  useEffect(() => {
    setActiveProfile(character.ambienceProfile);
    audioEngine.setSynthNotes(character.synthNotes);
    tutorDialogueService.triggerEvent('GREETING', character.id);
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
    <div
      className="relative min-h-screen text-gray-200 flex flex-col justify-between selection:bg-arcade-gold selection:text-black overflow-x-hidden"
      style={{ backgroundColor: '#0B0914' }}
    >
      {/* Dynamic Ambient Background + Particle Dimmer */}
      <EnvironmentFX
        type={character.environmentFX}
        palette={character.palette}
        dimmerOpacity={dimmerOpacity}
      />

      {/* --- TOP HUD BAR --- */}
      {!hideHeader && (
        <header className="relative z-30 px-3 py-2 bg-void-darkest/95 border-b-2 border-arcade-border shadow-[0_2px_12px_rgba(0,0,0,0.6)] backdrop-blur-sm select-none">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Left: Back to Roster + Player Name Badge + Character Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onBackToRoster();
                }}
                className="pixel-btn px-2.5 py-1 text-xs text-arcade-cyan hover:text-white flex items-center gap-1 border border-arcade-border"
                title="Return to Dressing Room"
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

              {/* Active Character Quick-Switch Dropdown */}
              <div className="hidden md:flex items-center gap-2 border-l border-arcade-border/60 pl-2">
                <PixelEmblem
                  type={character.pixelSpriteType}
                  palette={character.palette}
                  size={20}
                />
                <select
                  value={character.id}
                  onChange={(e) => {
                    const next = CHARACTERS.find((c) => c.id === e.target.value);
                    if (next) {
                      audioEngine.playClick();
                      onSelectAnotherCharacter(next);
                    }
                  }}
                  className="bg-void-dark border border-arcade-border px-2 py-0.5 text-xs text-white focus:outline-none focus:border-arcade-gold font-pixel"
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-void-darkest text-white">
                      {archetypeMode ? c.archetypeName.split('/')[0] : c.name.split('(')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Center: Status Readout Banner (Hidden on very small screens) */}
            {!zenMode && (
              <div className="hidden lg:flex items-center gap-3 text-[10px] font-silkscreen text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-none bg-arcade-gold animate-pulse inline-block" />
                  STATUS: <strong className="text-white">{currentAction}</strong>
                </span>
                <span>•</span>
                <span>
                  MODE: <strong className="text-arcade-cyan">{timerModeReadout}</strong>
                </span>
                <span>•</span>
                <span>
                  SANCTUARY: <strong className="text-arcade-pink">{character.universe}</strong>
                </span>
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
                  className={`pixel-btn px-2.5 py-1 text-xs flex items-center gap-1.5 border ${
                    isAmbiencePlaying || isSynthPlaying
                      ? 'border-arcade-gold text-arcade-gold'
                      : 'border-arcade-border text-gray-300'
                  }`}
                  title="Audio Controls (Ambience & Synthesizer)"
                >
                  <Music size={13} className={isAmbiencePlaying || isSynthPlaying ? 'animate-bounce' : ''} />
                  <span className="hidden sm:inline font-pixel text-[9px]">AUDIO</span>
                </button>

                {/* Floating Retro Audio Popover Panel */}
                {showAudioPopover && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-void-darkest border-2 border-arcade-border p-3 shadow-2xl z-50 animate-fadeIn text-xs font-mono">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-arcade-border font-pixel text-[10px] text-arcade-gold">
                      <span>AUDIO CONTROLS</span>
                      <button
                        onClick={toggleMute}
                        className={`p-1 border ${
                          isMuted ? 'border-red-500 text-red-400' : 'border-arcade-border text-gray-300'
                        }`}
                        title="Master Mute"
                      >
                        {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      </button>
                    </div>

                    {/* Ambience Procedural Generator */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-300">Ambience Generator</span>
                        <button
                          onClick={toggleAmbience}
                          className={`px-2 py-0.5 text-[9px] font-pixel border ${
                            isAmbiencePlaying
                              ? 'bg-arcade-gold text-black border-arcade-gold'
                              : 'bg-void border-arcade-border text-gray-400 hover:text-white'
                          }`}
                        >
                          {isAmbiencePlaying ? 'RUNNING' : 'OFF'}
                        </button>
                      </div>

                      <select
                        value={activeProfile}
                        onChange={(e) => handleProfileSelect(e.target.value)}
                        className="w-full bg-void-dark border border-arcade-border px-2 py-1 text-[11px] text-gray-200"
                      >
                        <option value="rain">Cyberpunk Rainfall</option>
                        <option value="lofi">Late Night Lo-Fi Study</option>
                        <option value="space">Deep Cosmic Void</option>
                        <option value="wind">Mountain Temple Wind</option>
                        <option value="matrix">Matrix Code Rain</option>
                        <option value="sonar">Submarine Sonar Ping</option>
                        <option value="fire">Cozy Campfire Crackle</option>
                        <option value="purr">Warm Cat Purr</option>
                      </select>

                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>Vol:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={ambienceVol}
                          onChange={(e) => handleAmbienceVol(parseFloat(e.target.value))}
                          className="w-full accent-arcade-gold h-1 bg-void"
                        />
                      </div>
                    </div>

                    {/* Chiptune Melodic Synthesizer */}
                    <div className="space-y-2 pt-2 border-t border-arcade-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-300">8-Bit Synthesizer</span>
                        <button
                          onClick={toggleSynth}
                          className={`px-2 py-0.5 text-[9px] font-pixel border ${
                            isSynthPlaying
                              ? 'bg-arcade-cyan text-black border-arcade-cyan'
                              : 'bg-void border-arcade-border text-gray-400 hover:text-white'
                          }`}
                        >
                          {isSynthPlaying ? 'RUNNING' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>Vol:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={synthVol}
                          onChange={(e) => handleSynthVol(parseFloat(e.target.value))}
                          className="w-full accent-arcade-cyan h-1 bg-void"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dimmer Slider Toggle */}
              <div className="relative">
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setShowDimmerSlider(!showDimmerSlider);
                  }}
                  className={`pixel-btn px-2 py-1 text-xs border ${
                    showDimmerSlider ? 'border-arcade-gold text-arcade-gold' : 'border-arcade-border text-gray-400'
                  }`}
                  title="Adjust Background Dimmer"
                >
                  <Eye size={13} />
                </button>
                {showDimmerSlider && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-void-darkest border-2 border-arcade-border p-3 shadow-xl z-50 animate-fadeIn text-xs font-mono">
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-pixel text-arcade-gold">
                      <span>BG DIMMER</span>
                      <span>{Math.round(dimmerOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="0.95"
                      step="0.05"
                      value={dimmerOpacity}
                      onChange={(e) => setDimmerOpacity(parseFloat(e.target.value))}
                      className="w-full accent-arcade-gold h-1.5 bg-void"
                    />
                  </div>
                )}
              </div>

              {/* Zen Mode Button */}
              <button
                onClick={toggleZenMode}
                className={`pixel-btn px-2.5 py-1 text-xs flex items-center gap-1 border ${
                  zenMode ? 'border-arcade-gold bg-amber-950/60 text-white' : 'border-arcade-border text-gray-300'
                }`}
                title="Zen Mode: Focus only on the timer and companion"
              >
                {zenMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span className="hidden sm:inline font-pixel text-[9px]">{zenMode ? 'EXIT ZEN' : 'ZEN'}</span>
              </button>

              {/* Safe Mode Toggle (Character Name vs Archetype) */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onToggleArchetypeMode();
                }}
                className={`pixel-btn px-2 py-1 text-xs border ${
                  archetypeMode ? 'border-green-400 text-green-300' : 'border-arcade-border text-gray-500'
                }`}
                title={archetypeMode ? 'Safe / Archetype Mode ACTIVE' : 'Canon Hero Mode Active'}
              >
                <ShieldCheck size={14} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* --- MAIN WORKSPACE BODY --- */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full p-3 sm:p-4 md:p-6 flex flex-col justify-start">
        {/* Zen Mode Notice Banner */}
        {zenMode && (
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-void-darkest border border-arcade-gold/50 text-[10px] font-pixel text-arcade-gold">
              <span className="w-2 h-2 bg-arcade-gold animate-ping inline-block" />
              <span>ZEN FOCUS LOCK-IN ACTIVE // ALL DISTRACTIONS STOWED</span>
              <button onClick={toggleZenMode} className="ml-2 underline text-white hover:text-arcade-gold">
                [EXIT]
              </button>
            </div>
          </div>
        )}

        {/* Subject Specialist Suggestion Notification */}
        {showSubjectSuggestion && suggestedProfile && !zenMode && (
          <div className="mb-4 bg-void-card pixel-border border border-arcade-cyan p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-arcade-gold font-pixel text-[10px]">💡 SUBJECT SPECIALIST:</span>
              <span className="text-gray-300">
                <strong className="text-arcade-cyan">{suggestedProfile.name}</strong> is designated for{' '}
                <strong className="text-white">{initialTask?.subject}</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  const targetChar = CHARACTERS.find((c) => c.id === suggestedTutorId);
                  if (targetChar) {
                    onSelectAnotherCharacter(targetChar);
                    setDismissedSubjectSuggestion(true);
                  }
                }}
                className="pixel-btn px-2.5 py-1 text-[10px] font-pixel text-arcade-cyan border border-arcade-cyan hover:bg-cyan-950/40"
              >
                SWITCH TO {suggestedProfile.name.toUpperCase()}
              </button>
              <button
                onClick={() => setDismissedSubjectSuggestion(true)}
                className="text-gray-500 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 12-Column Responsive Workspace Grid */}
        <div className={`grid grid-cols-1 ${zenMode ? '' : 'lg:grid-cols-12'} gap-4 items-start`}>
          {/* Left Column: Focus Study Timer + 2D In-Game Focus Companion Stage */}
          <div className={`${zenMode ? 'w-full' : 'lg:col-span-5'} space-y-4`}>
            <TimerWidget
              character={character}
              onActionChange={(action) => setCurrentAction(action)}
              onModeChange={(mode) => setTimerModeReadout(mode)}
              initialTask={initialTask}
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

        {/* Global Floating Tutor Dialogue Banner */}
        <TutorDialogueBanner activeCharacter={character} />
      </main>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};
