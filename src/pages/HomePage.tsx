import React, { useState } from 'react';
import { Play, Sparkles, ShieldCheck, Lock, ChevronLeft } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character } from '../types/character';
import { CosmicGlobe } from '../components/CosmicGlobe';
import { SpiritCard } from '../components/SpiritCard';
import { Footer } from '../components/Footer';
import { HomeAmbientBackground } from '../components/HomeAmbientBackground';
import { audioEngine } from '../utils/audioEngine';

interface HomePageProps {
  onSelectCompanion: () => void;
  onLaunchQuickSession: (character: Character) => void;
  onSelectSpirit?: (spirit: 'girl' | 'boy') => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCompanion,
  onLaunchQuickSession,
  onSelectSpirit,
  archetypeMode,
  onToggleArchetypeMode,
}) => {
  const [isLockedIn, setIsLockedIn] = useState(false);

  const handleSpiritChoice = (spirit: 'girl' | 'boy') => {
    if (onSelectSpirit) {
      onSelectSpirit(spirit);
    } else {
      onSelectCompanion();
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 flex flex-col justify-between selection:bg-arcade-gold selection:text-black overflow-x-hidden">
      {/* --- LIVING ANIMATED BACKGROUND (Twilight Aurora, Canvas Starfield & Floating Orbs) --- */}
      <HomeAmbientBackground />

      {/* Top Copyright-Safe Mode & Kernel Status Banner */}
      <div className="w-full px-4 pt-3 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#0D0B1E]/80 backdrop-blur-md border border-white/15 text-[11px] font-mono select-none shadow-sm">
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
      </div>

      {/* --- BALANCED 2-COLUMN SPLIT CONTAINER --- */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex-1 flex items-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: BRAND, GLOBE & TELEMETRY (lg:col-span-7)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Top Narrative Dialog Banner */}
            <div className="inline-block relative px-4 py-2 bg-[#121026]/80 backdrop-blur-md pixel-border border border-arcade-gold/40 shadow-pixel">
              <div className="font-pixel text-[10px] sm:text-xs text-arcade-gold tracking-wider uppercase">
                &gt; &quot;8.2 billion people. 20 worlds to find your focus.&quot;
              </div>
            </div>

            {/* Main Brand Title (Cleanly Breathing Above Globe - Description Removed) */}
            <div>
              <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(245,194,66,0.35)]">
                FOCUS<span className="text-arcade-gold">VERSE</span>
              </h1>
            </div>

            {/* Rotating Pixel Globe / Node Visualizer */}
            <div className="w-full flex justify-center lg:justify-start">
              <CosmicGlobe onNodeClick={() => onSelectCompanion()} />
            </div>

            {/* Segmented Synergy-Style Live Counter Blocks (Glassmorphic) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl select-none">
              <div className="bg-[#121026]/75 backdrop-blur-md pixel-border border border-white/15 p-3 text-center shadow-pixel transition-all hover:border-arcade-gold hover:shadow-[0_0_15px_rgba(245,194,66,0.2)]">
                <div className="font-pixel text-lg sm:text-xl text-arcade-gold">20</div>
                <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                  WORLDS ROSTER
                </div>
              </div>
              <div className="bg-[#121026]/75 backdrop-blur-md pixel-border border border-white/15 p-3 text-center shadow-pixel transition-all hover:border-arcade-cyan hover:shadow-[0_0_15px_rgba(92,225,230,0.2)]">
                <div className="font-pixel text-lg sm:text-xl text-arcade-cyan">4</div>
                <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                  FLOW TOOLS
                </div>
              </div>
              <div className="bg-[#121026]/75 backdrop-blur-md pixel-border border border-white/15 p-3 text-center shadow-pixel transition-all hover:border-arcade-pink hover:shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                <div className="font-pixel text-lg sm:text-xl text-arcade-pink">100%</div>
                <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                  SYNTH CHIPTUNE
                </div>
              </div>
              <div className="bg-[#121026]/75 backdrop-blur-md pixel-border border border-white/15 p-3 text-center shadow-pixel transition-all hover:border-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                <div className="font-pixel text-lg sm:text-xl text-green-400">0</div>
                <div className="font-silkscreen text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                  DISTRACTIONS
                </div>
              </div>
            </div>

            {/* Primary Action Button (Single Clean Button - "View All" Removed) */}
            <div className="flex items-center justify-center lg:justify-start pt-1 w-full max-w-xl">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onLaunchQuickSession(CHARACTERS[0]); // Peter Parker default quick launch
                }}
                className="pixel-btn-primary w-full sm:w-auto px-8 py-3.5 font-silkscreen text-xs sm:text-sm uppercase flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(245,194,66,0.35)] hover:scale-105 transition-all"
              >
                <Play size={14} fill="currentColor" />
                <span>► LAUNCH QUICK SESSION ►</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: INTERACTIVE "LOCK IN" GATEWAY (lg:col-span-5) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md">
              {!isLockedIn ? (
                /* --- INITIAL STATE: HIGH-IMPACT ARCADE "LOCK IN" BUTTON --- */
                <div className="bg-[#121026]/75 backdrop-blur-md pixel-border border-2 border-white/15 p-6 sm:p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center min-h-[440px] transition-all duration-300 hover:border-arcade-gold/50">
                  {/* Subtle retro grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#3E356B_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                  {/* Top telemetry stamp */}
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">
                    FOCUS GATEWAY // SEC_01
                  </div>

                  {/* Glowing Icon Frame */}
                  <div className="w-16 h-16 mb-5 border-2 border-arcade-gold flex items-center justify-center bg-amber-950/40 shadow-[0_0_25px_rgba(245,194,66,0.35)]">
                    <Lock className="w-8 h-8 text-arcade-gold animate-pulse" />
                  </div>

                  <h3 className="font-silkscreen text-sm sm:text-base text-arcade-gold uppercase tracking-wider mb-2">
                    READY TO ENTER FLOW STATE?
                  </h3>

                  <p className="font-mono text-xs text-gray-400 max-w-xs mb-8 leading-relaxed">
                    Choose your companion spirit to calibrate soundscapes, drift-free timers, and workspace particles.
                  </p>

                  {/* Glowing Golden CTA Button */}
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      audioEngine.playVictoryJingle([261.63, 329.63, 392.00, 523.25]);
                      setIsLockedIn(true);
                    }}
                    className="pixel-btn-primary px-8 py-4 font-pixel text-xs sm:text-sm text-black tracking-widest uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(245,194,66,0.6)] hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles size={16} className="text-black" />
                    <span>[ 🔒 LOCK IN ► ]</span>
                  </button>

                  <div className="text-[10px] font-mono text-gray-500 mt-6">
                    &gt; TAP TO REVEAL COMPANION SPIRITS
                  </div>
                </div>
              ) : (
                /* --- REVEALED STATE: ULTRA-MINIMALIST 9:16 COMPANION CARDS --- */
                <div className="bg-[#121026]/85 backdrop-blur-md pixel-border border-2 border-arcade-gold/70 p-4 sm:p-5 shadow-[0_0_40px_rgba(245,194,66,0.18)] relative transition-all duration-300 animate-fadeIn">
                  {/* Revealed Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 select-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-arcade-gold animate-ping" />
                      <h2 className="font-pixel text-[11px] sm:text-xs text-arcade-gold uppercase tracking-wider">
                        CHOOSE A COMPANION
                      </h2>
                    </div>

                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        setIsLockedIn(false);
                      }}
                      className="pixel-btn px-2.5 py-1 text-[10px] font-mono text-gray-300 hover:text-white hover:border-arcade-gold flex items-center gap-1 transition-all"
                      title="Collapse to Lock In button"
                    >
                      <ChevronLeft size={12} />
                      <span>[ ◀ BACK ]</span>
                    </button>
                  </div>

                  {/* The Two Adjacent 9:16 Portrait Cards (Ultra-Clean, Seamlessly Interactive) */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Card 1: Study Girl Spirit */}
                    <SpiritCard
                      type="girl"
                      onClick={() => handleSpiritChoice('girl')}
                    />

                    {/* Card 2: Study Boy Spirit */}
                    <SpiritCard
                      type="boy"
                      onClick={() => handleSpiritChoice('boy')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
