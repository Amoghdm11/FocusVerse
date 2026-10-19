import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Sparkles, Terminal, Volume2, ShieldCheck, Compass, Music, Flame } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character } from '../types/character';
import { CosmicGlobe } from '../components/CosmicGlobe';
import { PixelEmblem } from '../components/PixelEmblems';
import { audioEngine } from '../utils/audioEngine';

interface HomePageProps {
  onSelectCompanion: () => void;
  onLaunchQuickSession: (character: Character) => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCompanion,
  onLaunchQuickSession,
  archetypeMode,
  onToggleArchetypeMode,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const featuredCharacters = CHARACTERS.slice(0, 8); // Top 8 featured companions
  const activeChar = featuredCharacters[carouselIndex];

  const handleNext = () => {
    audioEngine.playClick();
    setCarouselIndex((prev) => (prev + 1) % featuredCharacters.length);
  };

  const handlePrev = () => {
    audioEngine.playClick();
    setCarouselIndex((prev) => (prev - 1 + featuredCharacters.length) % featuredCharacters.length);
  };

  const playDemoNote = (freq: number) => {
    audioEngine.playVictoryJingle([freq]);
  };

  return (
    <div className="relative min-h-screen pb-32 pt-6 px-4 max-w-6xl mx-auto flex flex-col gap-10">
      {/* Top Copyright-Safe Mode & Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-void-darkest border border-arcade-border text-[11px] font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 animate-ping" />
          <span className="text-arcade-gold font-bold">FOCUSVERSE KERNEL v2.6</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">STATUS: [ONLINE &amp; CALIBRATED]</span>
        </div>

        <button
          onClick={() => {
            audioEngine.playClick();
            onToggleArchetypeMode();
          }}
          className={`px-2 py-0.5 border text-[10px] flex items-center gap-1.5 transition-all ${
            archetypeMode
              ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan'
              : 'border-arcade-border text-gray-400 hover:text-white'
          }`}
          title="Toggle Copyright-Safe RPG Archetype Names"
        >
          <ShieldCheck size={12} />
          <span>SAFE MODE: {archetypeMode ? 'ON (ORIGINAL ARCHETYPES)' : 'OFF (CANON)'}</span>
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="flex flex-col items-center text-center">
        {/* 1. Signature Centered Dialog Banner Header */}
        <div className="inline-block relative px-5 py-2.5 bg-void-card pixel-border border-arcade-border mb-4 shadow-pixel">
          <div className="font-pixel text-[11px] sm:text-xs text-arcade-gold tracking-wider uppercase">
            &gt; &quot;8.2 billion people. 20 worlds to find your focus.&quot;
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-void-card border-r-2 border-b-2 border-arcade-border rotate-45" />
        </div>

        {/* Title & Monospace Metadata */}
        <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase mb-2 mt-2 drop-shadow-[0_4px_12px_rgba(245,194,66,0.3)]">
          FOCUS<span className="text-arcade-gold">VERSE</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-2xl mb-6">
          The Pixel-Arcade &amp; Live-Code Character Productivity Platform.
          Inspired by Synergy&apos;26 and cosmic retro-futuristic code visualizers.
        </p>

        {/* 2. Interactive Pixel Globe / Node Visualizer with LO/HI guides */}
        <div className="my-2">
          <CosmicGlobe onNodeClick={() => onSelectCompanion()} />
        </div>

        {/* 3. Segmented Synergy-Style Live Counter Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full max-w-3xl mt-6 select-none">
          <div className="bg-void-darkest pixel-border border-arcade-border p-3 text-center">
            <div className="font-pixel text-xl sm:text-2xl text-arcade-gold">20</div>
            <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              WORLDS ROSTER
            </div>
          </div>
          <div className="bg-void-darkest pixel-border border-arcade-border p-3 text-center">
            <div className="font-pixel text-xl sm:text-2xl text-arcade-cyan">4</div>
            <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              FLOW TOOLS
            </div>
          </div>
          <div className="bg-void-darkest pixel-border border-arcade-border p-3 text-center">
            <div className="font-pixel text-xl sm:text-2xl text-arcade-pink">100%</div>
            <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              SYNTH CHIPTUNE
            </div>
          </div>
          <div className="bg-void-darkest pixel-border border-arcade-border p-3 text-center">
            <div className="font-pixel text-xl sm:text-2xl text-green-400">0</div>
            <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              DISTRACTIONS
            </div>
          </div>
        </div>

        {/* 4. Primary & Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={() => {
              audioEngine.playClick();
              onSelectCompanion();
            }}
            className="pixel-btn-primary px-6 py-3 font-silkscreen text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-pixel"
          >
            <span>CHOOSE YOUR COMPANION ▶</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onLaunchQuickSession(CHARACTERS[0]); // Peter Parker as default quick launch
            }}
            className="pixel-btn px-5 py-3 font-silkscreen text-xs sm:text-sm text-arcade-gold hover:text-white uppercase flex items-center gap-2"
          >
            <Play size={14} fill="currentColor" />
            <span>LAUNCH QUICK SESSION ▶</span>
          </button>
        </div>
      </section>

      {/* --- INTERACTIVE CAROUSEL / PREVIEW DECK --- */}
      <section className="bg-void-card pixel-border border-arcade-border p-5 shadow-pixel">
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-arcade-border gap-2 select-none">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-arcade-gold" />
            <h2 className="font-silkscreen text-sm text-arcade-gold uppercase tracking-wider">
              FEATURED COMPANION CARTRIDGE
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">
              CARTRIDGE {activeChar.index}
            </span>
            <div className="flex gap-1">
              <button
                onClick={handlePrev}
                className="pixel-btn p-1.5 text-gray-300 hover:text-arcade-gold"
                title="Previous Cartridge"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="pixel-btn p-1.5 text-gray-300 hover:text-arcade-gold"
                title="Next Cartridge"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Cartridge Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: Pixel Emblem & Identity */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-void-darkest border-2 border-arcade-border shadow-pixel">
            <PixelEmblem
              type={activeChar.pixelSpriteType}
              palette={activeChar.palette}
              size={80}
              className="my-3"
            />
            <span className="px-2 py-0.5 border text-[9px] font-mono uppercase tracking-wider mb-2"
              style={{ borderColor: activeChar.palette.borderPrimary, color: activeChar.palette.borderPrimary }}
            >
              {activeChar.category}
            </span>
            <div className="font-silkscreen text-xs text-arcade-cyan text-center">
              FX: {activeChar.environmentFX.toUpperCase()}
            </div>
          </div>

          {/* Right: Narrative & Action */}
          <div className="md:col-span-8 flex flex-col justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                {activeChar.universe}
              </div>
              <h3 className="font-pixel text-lg sm:text-xl text-white uppercase mt-1 mb-2">
                {archetypeMode ? activeChar.archetypeName : activeChar.name}
              </h3>
              <p className="text-xs font-mono text-arcade-gold italic mb-3">
                {activeChar.quote}
              </p>
              <div className="text-xs font-mono text-gray-300 bg-void p-2.5 border border-arcade-border/80">
                &gt; {activeChar.tagline}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onLaunchQuickSession(activeChar);
                }}
                className="pixel-btn-primary px-4 py-2 font-silkscreen text-xs uppercase flex items-center gap-2"
              >
                <span>ENTER WORKSPACE ▶</span>
              </button>

              <button
                onClick={() => audioEngine.playVictoryJingle(activeChar.synthNotes)}
                className="pixel-btn px-3 py-2 text-xs font-mono text-arcade-cyan flex items-center gap-1.5"
                title="Preview soundscape chord"
              >
                <Music size={14} />
                <span>SAMPLE CHORD</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE CODE EXPLAINER SECTION --- */}
      <section className="bg-void-card pixel-border border-arcade-border p-5 shadow-pixel">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-arcade-border select-none">
          <Terminal size={18} className="text-arcade-cyan" />
          <h2 className="font-silkscreen text-sm text-arcade-cyan uppercase tracking-wider">
            THE FOCUS LOOP ARCHITECTURE // src/focus_loop.rs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Code Box */}
          <div className="bg-void-darkest border border-arcade-border p-3 font-mono text-xs text-gray-300">
            <div className="text-[10px] text-gray-500 mb-2">// Invariant: Each sprint constructs your melody</div>
            <pre className="text-arcade-gold leading-relaxed">
{`while session.active {
    let focus = mind.lock_in(25.mins);
    if focus.completed() {
        sound_engine.synthesize_note();
        workspace.record_victory_stripe();
    }
}`}
            </pre>
          </div>

          {/* Interactive Note Visualizer Explanation */}
          <div className="space-y-3 font-mono text-xs">
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-arcade-gold">&quot;Every focus block adds a note. Together they&apos;re a song only you have.&quot;</strong>
            </p>
            <p className="text-gray-400 text-[11px]">
              Tap the note steps below to hear the native Web Audio frequencies synthesized during deep focus sessions:
            </p>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: 'C4 (261Hz)', freq: 261.63 },
                { label: 'E4 (329Hz)', freq: 329.63 },
                { label: 'G4 (392Hz)', freq: 392.00 },
                { label: 'C5 (523Hz)', freq: 523.25 },
              ].map((n) => (
                <button
                  key={n.label}
                  onClick={() => playDemoNote(n.freq)}
                  className="pixel-btn py-2 text-center text-[10px] text-arcade-cyan hover:text-arcade-gold"
                >
                  ♪ {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
