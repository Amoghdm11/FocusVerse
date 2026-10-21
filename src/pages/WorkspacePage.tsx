import React, { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, Minimize2, ShieldCheck, Volume2, VolumeX, Music, Eye } from 'lucide-react';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { EnvironmentFX } from '../components/EnvironmentFX';
import { PixelEmblem } from '../components/PixelEmblems';
import { CustomAppearanceState } from '../utils/pixelSpriteCompositor';
import { SpiderStudyRoom } from '../components/SpiderStudyRoom';
import { RoomToolPanel } from '../components/RoomToolPanel';
import { isSpiderManCostume } from '../utils/spidermanAssets';
import { StudyEnvironment } from '../components/StudyEnvironment';
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
  const spiderRoom = customAppearance ? isSpiderManCostume(customAppearance) : character.id === 'peter-parker';
  const [roomPanel, setRoomPanel] = useState<'notes' | 'tasks' | null>(null);
  const [musicRequest, setMusicRequest] = useState(0);
  const [taskCompletion, setTaskCompletion] = useState(0);
  useEffect(() => () => { audioEngine.stopAmbience(); audioEngine.stopSynth(); }, []);
  const [zenMode, setZenMode] = useState(false);
  const [dimmerOpacity, setDimmerOpacity] = useState(0.25);
  const [showDimmerSlider, setShowDimmerSlider] = useState(false);
  const [currentAction, setCurrentAction] = useState<UserFocusAction>('IDLE');
  const [timerModeReadout, setTimerModeReadout] = useState('POMODORO');
  const [companionBubble, setCompanionBubble] = useState<string | null>(null);

  // Compact Header Audio Controls
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
      className="focus-workspace relative min-h-screen text-gray-200 flex flex-col justify-between selection:bg-arcade-gold selection:text-black overflow-x-hidden"
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
          <div className="workspace-toolbar mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
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
                    setMusicRequest(n => n + 1);
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
      <main className="workspace-main relative z-20 flex-1 mx-auto w-full p-3 sm:p-4 md:p-6 flex flex-col justify-start">
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
        <div className={`workspace-grid ${spiderRoom ? 'spider-workspace' : ''} ${zenMode ? 'workspace-zen' : ''}`}>
          {/* Left Column: Focus Study Timer + 2D In-Game Focus Companion Stage */}
          <div className={"workspace-timer space-y-4"}>
            <TimerWidget
              character={character}
              onActionChange={(action) => setCurrentAction(action)}
              onModeChange={(mode) => setTimerModeReadout(mode)}
              initialTask={initialTask}
            />

          </div>
          <div className="workspace-scene">
            {spiderRoom ? <SpiderStudyRoom action={currentAction} completion={taskCompletion} onMusic={() => setMusicRequest(n => n + 1)} onNotes={() => setRoomPanel('notes')} onTasks={() => setRoomPanel('tasks')} /> : <StudyEnvironment character={character} appearance={customAppearance} studying={currentAction === 'FOCUSING'} onCompanionClick={handleCompanionClick} />}
            <div className="scene-companion-note"><span className="text-arcade-cyan">{archetypeMode ? character.archetypeName.split('/')[0] : character.name.split('(')[0]}</span><p>{companionBubble || character.quote}</p></div>
            <TutorDialogueBanner activeCharacter={character} inline />
          </div>

          {/* Center & Right Columns: Todo List, Scratchpad & Music Center (7 Cols, Hidden in Zen) */}
          {!zenMode && !spiderRoom && (
            <div className="workspace-tools space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* To-Do List Widget */}
                <div>
                  <TodoWidget
                    onTaskComplete={() => setTaskCompletion(n => n + 1)}
                    accentColor={character.palette.accentGold}
                  />
                </div>

                {/* Quick Notes Scratchpad Widget */}
                <div>
                  <NotesWidget accentColor={character.palette.accentSecondary} />
                </div>
              </div>

              {/* Dedicated Large MUSIC & AMBIENCE CENTER */}

            </div>
          )}
        </div>

        {/* Global Floating Tutor Dialogue Banner */}
        {spiderRoom && <>
          <RoomToolPanel open={roomPanel === 'notes'} title="Study notebook" onClose={() => setRoomPanel(null)}><NotesWidget accentColor={character.palette.accentSecondary}/></RoomToolPanel>
          <RoomToolPanel open={roomPanel === 'tasks'} title="Task board" onClose={() => setRoomPanel(null)}><TodoWidget onTaskComplete={() => setTaskCompletion(n => n + 1)} accentColor={character.palette.accentGold}/></RoomToolPanel>
        </>}
        <MusicCenter initialAmbienceProfile={character.ambienceProfile} openRequest={musicRequest} soundscapeControls={<div className="room-soundscapes" aria-label="Room soundscapes">
          <strong>ROOM SOUNDS</strong>
          <label>Soundscape <select aria-label="Room soundscape" value={activeProfile} onChange={e => handleProfileSelect(e.target.value)}>{['rain','lofi','fire','space','wind','purr','matrix','sonar'].map(p => <option key={p} value={p}>{p}</option>)}</select></label>
          <button onClick={toggleAmbience} aria-pressed={isAmbiencePlaying}>{isAmbiencePlaying ? 'Pause soundscape' : 'Play soundscape'}</button>
          <label>Volume <input aria-label="Soundscape volume" type="range" min="0" max="1" step="0.01" value={ambienceVol} onChange={e => handleAmbienceVol(Number(e.target.value))}/></label>
          <button onClick={toggleSynth} aria-pressed={isSynthPlaying}>{isSynthPlaying ? 'Pause synthesizer' : 'Play synthesizer'}</button>
          <label>Synth volume <input aria-label="Synth volume" type="range" min="0" max="1" step="0.05" value={synthVol} onChange={e => handleSynthVol(Number(e.target.value))}/></label>
          <button onClick={toggleMute} aria-pressed={isMuted}>{isMuted ? 'Unmute room audio' : 'Mute room audio'}</button>
          <span role="status">{isAmbiencePlaying ? `Playing ${activeProfile}` : 'Soundscape paused'}</span>
        </div>} />
      </main>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};
