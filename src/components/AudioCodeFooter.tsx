import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Music, Terminal, ChevronUp, ChevronDown, Sliders } from 'lucide-react';
import { Character } from '../types/character';
import { audioEngine } from '../utils/audioEngine';

export type UserFocusAction = 'IDLE' | 'FOCUSING' | 'BREAK' | 'COMPLETED' | 'TASK_ACTION';

interface AudioCodeFooterProps {
  character?: Character | null;
  currentAction: UserFocusAction;
  timerMode?: string;
}

export const AudioCodeFooter: React.FC<AudioCodeFooterProps> = ({
  character,
  currentAction,
  timerMode = 'POMODORO',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [ambienceVol, setAmbienceVol] = useState(0.4);
  const [synthVol, setSynthVol] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string>(character?.ambienceProfile || 'rain');
  const [waveform, setWaveform] = useState<OscillatorType>('triangle');

  useEffect(() => {
    if (character) {
      setActiveProfile(character.ambienceProfile);
      audioEngine.setSynthNotes(character.synthNotes);
      if (isAmbiencePlaying) {
        audioEngine.setAmbienceProfile(character.ambienceProfile);
      }
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

  const handleMute = () => {
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

  const handleProfileChange = (prof: string) => {
    setActiveProfile(prof);
    audioEngine.setAmbienceProfile(prof);
  };

  // Determine which line of Rust code to highlight based on action
  let activeLineIndex = 1;
  if (currentAction === 'FOCUSING') activeLineIndex = 3;
  else if (currentAction === 'BREAK') activeLineIndex = 4;
  else if (currentAction === 'COMPLETED') activeLineIndex = 5;
  else if (currentAction === 'TASK_ACTION') activeLineIndex = 2;

  const defaultSnippet = [
    'pub fn focus_engine_loop(session: &mut FocusSession) -> Result<(), VoidErr> {',
    '    let mut neural_cursor = Cursor::calibrate(Freq::Alpha(10.5));',
    '    while session.is_active() && !session.is_throttled() {',
    '        match session.state { State::Focus => lock_in(), State::Rest => restore() }',
    '        session.accumulate_xp(1); // Tick flow counter',
    '    }',
    '}',
  ];

  const codeLines = character?.codeSnippet || defaultSnippet;
  const fileName = character ? `src/companions/${character.id}.rs` : 'src/focus_engine.rs';

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-void-darkest border-t-2 border-arcade-border shadow-[0_-4px_16px_rgba(0,0,0,0.8)]">
      {/* Header Bar with Toggle & Tactical Readout */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#0E0A1E] border-b border-[#2A234E] text-[11px] font-mono select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-arcade-gold" />
          <span className="text-arcade-gold font-bold uppercase tracking-wider font-mono">
            {fileName}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-arcade-cyan uppercase">ACTION: [{currentAction}]</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">MODE: {timerMode}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMute}
            className={`px-2 py-0.5 border text-[10px] flex items-center gap-1 transition-all ${
              isMuted
                ? 'border-red-500 bg-red-950/60 text-red-300'
                : 'border-arcade-border hover:border-arcade-gold text-gray-300'
            }`}
            title="Mute All Audio"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-arcade-gold"
          >
            {isExpanded ? (
              <>
                <span>COLLAPSE</span>
                <ChevronDown size={14} />
              </>
            ) : (
              <>
                <span>EXPAND HUD</span>
                <ChevronUp size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content: Left Live Code Bar + Right Web Audio Mixer */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 text-xs font-mono max-h-48 overflow-y-auto">
          {/* Left: Live Code Execution Panel */}
          <div className="md:col-span-7 p-2.5 bg-[#080512] border-b md:border-b-0 md:border-r border-[#2A234E] overflow-x-auto">
            <div className="text-[10px] text-gray-500 mb-1 flex items-center justify-between">
              <span>// LIVE RUST FLOW ARCHITECTURE</span>
              <span className="text-arcade-cyan animate-pulse">● EXECUTION LINKED</span>
            </div>
            <div className="space-y-0.5">
              {codeLines.map((line, idx) => {
                const isCurrent = idx === activeLineIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-start px-2 py-0.5 transition-colors ${
                      isCurrent
                        ? 'bg-arcade-gold/15 text-arcade-gold border-l-2 border-arcade-gold font-bold'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className="text-gray-600 select-none w-7 shrink-0 text-right pr-2">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-arcade-cyan select-none mr-1">
                      {isCurrent ? '▶' : ' '}
                    </span>
                    <code className="whitespace-pre font-mono-code">{line}</code>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Native Web Audio Synthesizer & Ambience Generator */}
          <div className="md:col-span-5 p-2.5 bg-[#0C081A] flex flex-col justify-between gap-2">
            {/* Ambience Controls */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-arcade-gold font-silkscreen flex items-center gap-1">
                  <Sliders size={12} /> AMBIENCE GENERATOR
                </span>
                <select
                  value={activeProfile}
                  onChange={(e) => handleProfileChange(e.target.value)}
                  className="bg-void-darkest border border-arcade-border text-arcade-cyan text-[10px] px-1.5 py-0.5 outline-none cursor-pointer"
                >
                  <option value="rain">RAIN (PINK NOISE)</option>
                  <option value="fire">FIRE (HEARTH CRACKLE)</option>
                  <option value="space">SPACE (DEEP SUB-DRONE)</option>
                  <option value="purr">PURR (FELINE 22HZ)</option>
                  <option value="matrix">MATRIX (KATAKANA CHIPS)</option>
                  <option value="sonar">BAT-SONAR (1480HZ ECHO)</option>
                  <option value="lofi">LO-FI (TAPE HISS)</option>
                  <option value="wind">WIND (MOUNTAIN GALE)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAmbience}
                  className={`px-2 py-1 text-[10px] font-bold border flex items-center gap-1 transition-all ${
                    isAmbiencePlaying
                      ? 'border-arcade-gold bg-arcade-gold text-black'
                      : 'border-arcade-border bg-[#140E2A] text-gray-300 hover:border-arcade-gold'
                  }`}
                >
                  {isAmbiencePlaying ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                  <span>{isAmbiencePlaying ? 'HALT' : 'START'}</span>
                </button>

                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">VOL:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambienceVol}
                    onChange={(e) => handleAmbienceVol(parseFloat(e.target.value))}
                    className="w-full accent-arcade-gold cursor-pointer h-1.5 bg-void-darkest"
                  />
                  <span className="text-[10px] text-gray-400 w-7 text-right">
                    {Math.round(ambienceVol * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 8-Bit Chiptune / Ambient Synth */}
            <div className="space-y-1 pt-1.5 border-t border-[#251D42]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-arcade-cyan font-silkscreen flex items-center gap-1">
                  <Music size={12} /> 8-BIT CHIPTUNE SYNTH
                </span>
                <div className="flex gap-1 text-[9px]">
                  {(['triangle', 'square', 'sine'] as OscillatorType[]).map((wave) => (
                    <button
                      key={wave}
                      onClick={() => {
                        setWaveform(wave);
                        audioEngine.setSynthWaveform(wave);
                      }}
                      className={`px-1 border uppercase ${
                        waveform === wave
                          ? 'border-arcade-cyan bg-arcade-cyan/20 text-arcade-cyan'
                          : 'border-arcade-border text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {wave.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSynth}
                  className={`px-2 py-1 text-[10px] font-bold border flex items-center gap-1 transition-all ${
                    isSynthPlaying
                      ? 'border-arcade-cyan bg-arcade-cyan text-black'
                      : 'border-arcade-border bg-[#140E2A] text-gray-300 hover:border-arcade-cyan'
                  }`}
                >
                  {isSynthPlaying ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                  <span>{isSynthPlaying ? 'STOP ARPEGGIO' : 'PLAY ARPEGGIO'}</span>
                </button>

                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">VOL:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={synthVol}
                    onChange={(e) => handleSynthVol(parseFloat(e.target.value))}
                    className="w-full accent-arcade-cyan cursor-pointer h-1.5 bg-void-darkest"
                  />
                  <span className="text-[10px] text-gray-400 w-7 text-right">
                    {Math.round(synthVol * 100)}%
                  </span>
                </div>

                <button
                  onClick={() => audioEngine.playVictoryJingle(character?.synthNotes)}
                  className="px-1.5 py-1 text-[9px] border border-arcade-gold/60 text-arcade-gold hover:bg-arcade-gold hover:text-black transition-colors"
                  title="Test Retro Completion Jingle"
                >
                  JINGLE ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
