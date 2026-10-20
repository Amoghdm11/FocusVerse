import React from 'react';
import { ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SpiritCardProps {
  type: 'girl' | 'boy';
  onClick: () => void;
}

export const SpiritCard: React.FC<SpiritCardProps> = ({ type, onClick }) => {
  const isGirl = type === 'girl';

  const handleClick = () => {
    audioEngine.playClick();
    if (isGirl) {
      audioEngine.playVictoryJingle([261.63, 329.63, 392.0, 523.25]); // Warm Lo-Fi major chord
    } else {
      audioEngine.playVictoryJingle([220.0, 261.63, 349.23, 440.0]); // Nocturne cyan chord
    }
    onClick();
  };

  return (
    <div
      data-spirit-card={type}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className={`group relative aspect-[9/16] w-full rounded-none border-2 cursor-pointer select-none overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 transition-all duration-300 transform hover:-translate-y-1.5 ${
        isGirl
          ? 'bg-gradient-to-b from-[#26151E]/90 via-[#1D0F18]/90 to-[#0D070C]/95 border-[#E07A5F]/70 hover:border-arcade-gold hover:shadow-[0_0_30px_rgba(242,204,143,0.35)]'
          : 'bg-gradient-to-b from-[#0F172E]/90 via-[#0A1024]/90 to-[#050814]/95 border-[#2A9D8F]/70 hover:border-arcade-cyan hover:shadow-[0_0_30px_rgba(0,245,212,0.35)]'
      } backdrop-blur-md shadow-2xl`}
    >
      {/* 1. RICH INNER CARD ATMOSPHERE (Gradient & Soft Floating Particles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isGirl ? (
          // Warm Sunset Amber / Terracotta / Rose-Gold Atmosphere
          <div className="w-full h-full relative">
            {/* Top ambient radial glow */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-44 h-44 bg-[#F2CC8F]/15 rounded-full blur-2xl" />
            {/* Floating Fairy Lights & Warm Rain Particles */}
            <span className="absolute top-3 left-4 w-1.5 h-1.5 bg-[#F2CC8F] rounded-full animate-ping opacity-75" />
            <span className="absolute top-10 right-4 w-1.5 h-1.5 bg-[#E07A5F] rotate-45 animate-pulse" />
            <span className="absolute top-28 left-5 w-1 h-2 bg-[#81B29A] opacity-60" />
            <span className="absolute bottom-20 right-6 w-1 h-1 bg-[#F2CC8F] animate-ping" />
            <span className="absolute bottom-32 left-8 w-1 h-1.5 bg-[#FF8BA7] opacity-60" />
            {/* Subtle top fairy light string */}
            <div className="absolute top-0 left-0 right-0 flex justify-around px-3 pt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F] shadow-[0_0_10px_#F2CC8F] animate-pulse"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Deep Midnight Sapphire / Indigo / Soft Cyan Atmosphere
          <div className="w-full h-full relative">
            {/* Top ambient radial glow */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-44 h-44 bg-arcade-cyan/15 rounded-full blur-2xl" />
            {/* Twinkling Night-Sky Particles */}
            <span className="absolute top-4 right-5 w-1.5 h-1.5 bg-arcade-cyan rounded-full animate-ping opacity-80" />
            <span className="absolute top-12 left-4 w-1.5 h-1.5 bg-[#9D4EDD] rotate-45 animate-pulse" />
            <span className="absolute top-24 right-8 w-1 h-1 bg-white opacity-70" />
            <span className="absolute bottom-24 left-6 w-1 h-2 bg-arcade-cyan opacity-50" />
            <span className="absolute bottom-36 right-4 w-1 h-1 bg-[#FFD166] animate-ping" />
            {/* Distant Tokyo skyscraper window grid */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-25">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-arcade-gold" />
                <span className="w-1 h-1 bg-arcade-cyan" />
                <span className="w-1 h-1 bg-arcade-gold" />
              </div>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-arcade-cyan" />
                <span className="w-1 h-1 bg-transparent" />
                <span className="w-1 h-1 bg-arcade-cyan" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CENTERED CHARACTER ARTWORK (Upper 75% of card with smooth hover scale) */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-2">
        <div className="w-full flex justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
          {isGirl ? (
            /* Cozy Study Girl Full Pixel Scene */
            <svg
              viewBox="0 0 100 120"
              className="w-full max-w-[160px] sm:max-w-[185px] h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
              style={{ shapeRendering: 'crispEdges' }}
            >
              {/* Rain Attic Window Frame */}
              <rect x="14" y="8" width="72" height="54" fill="#140C12" stroke="#422533" strokeWidth="2" />
              <line x1="50" y1="8" x2="50" y2="62" stroke="#422533" strokeWidth="1.5" />
              <line x1="14" y1="35" x2="86" y2="35" stroke="#422533" strokeWidth="1.5" />
              {/* Falling rain streaks on window */}
              <line x1="24" y1="14" x2="21" y2="28" stroke="#81B29A" strokeWidth="1.2" opacity="0.65" />
              <line x1="38" y1="20" x2="35" y2="34" stroke="#81B29A" strokeWidth="1.2" opacity="0.45" />
              <line x1="66" y1="17" x2="63" y2="31" stroke="#81B29A" strokeWidth="1.2" opacity="0.55" />
              <line x1="76" y1="38" x2="73" y2="54" stroke="#81B29A" strokeWidth="1.2" opacity="0.65" />

              {/* Study Desk */}
              <rect x="6" y="85" width="88" height="26" fill="#301C1D" stroke="#4D2D2E" strokeWidth="2" />

              {/* Steaming Mug */}
              <rect x="16" y="75" width="11" height="13" fill="#E07A5F" />
              <rect x="27" y="78" width="3" height="7" fill="#D47A5B" />
              {/* Steam waves */}
              <path d="M19 71 Q22 66 18 62" stroke="#F2CC8F" strokeWidth="1.2" fill="none" opacity="0.75" />
              <path d="M24 72 Q26 67 23 63" stroke="#F2CC8F" strokeWidth="1.2" fill="none" opacity="0.55" />

              {/* Girl Hair (Warm Chestnut) */}
              <rect x="35" y="30" width="30" height="32" fill="#4A2810" />
              <rect x="30" y="38" width="8" height="28" fill="#3D1F0C" />
              <rect x="62" y="38" width="8" height="28" fill="#3D1F0C" />

              {/* Cute Head & Face */}
              <rect x="39" y="35" width="22" height="22" fill="#FAD2B8" />
              {/* Eyes */}
              <rect x="44" y="43" width="3" height="3" fill="#2E1B1B" />
              <rect x="53" y="43" width="3" height="3" fill="#2E1B1B" />
              {/* Cheeks */}
              <rect x="42" y="47" width="3.5" height="2.5" fill="#FF8BA7" opacity="0.75" />
              <rect x="55" y="47" width="3.5" height="2.5" fill="#FF8BA7" opacity="0.75" />

              {/* Mint Green Headphones */}
              <path d="M33 43 C33 27 67 27 67 43" stroke="#81B29A" strokeWidth="3.5" fill="none" />
              <rect x="30" y="38" width="6" height="11" fill="#588157" />
              <rect x="64" y="38" width="6" height="11" fill="#588157" />

              {/* Terracotta Oversized Sweater */}
              <rect x="31" y="56" width="38" height="32" fill="#E07A5F" />
              <rect x="37" y="56" width="26" height="6" fill="#D47A5B" />
              <rect x="24" y="60" width="9" height="24" fill="#E07A5F" />
              <rect x="67" y="60" width="9" height="24" fill="#E07A5F" />

              {/* Notebook & Pencil on desk */}
              <rect x="38" y="79" width="26" height="13" fill="#F4F1DE" />
              <line x1="41" y1="82" x2="61" y2="82" stroke="#81B29A" strokeWidth="0.9" />
              <line x1="41" y1="85" x2="61" y2="85" stroke="#81B29A" strokeWidth="0.9" />
              <line x1="41" y1="88" x2="57" y2="88" stroke="#81B29A" strokeWidth="0.9" />
              <line x1="67" y1="76" x2="74" y2="86" stroke="#F2CC8F" strokeWidth="1.8" />
            </svg>
          ) : (
            /* Late-Night Study Boy Full Pixel Scene */
            <svg
              viewBox="0 0 100 120"
              className="w-full max-w-[160px] sm:max-w-[185px] h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
              style={{ shapeRendering: 'crispEdges' }}
            >
              {/* Tokyo Window & Skyline */}
              <rect x="14" y="8" width="72" height="54" fill="#060914" stroke="#1C2740" strokeWidth="2" />
              {/* Skyscraper Silhouettes */}
              <rect x="18" y="22" width="15" height="40" fill="#0D1627" />
              <rect x="37" y="16" width="17" height="46" fill="#121D33" />
              <rect x="58" y="26" width="24" height="36" fill="#0F182A" />
              {/* City Window Pixels */}
              <rect x="22" y="27" width="2.5" height="2.5" fill="#FFD166" />
              <rect x="27" y="33" width="2.5" height="2.5" fill="#00F5D4" />
              <rect x="42" y="21" width="2.5" height="2.5" fill="#00F5D4" />
              <rect x="48" y="25" width="2.5" height="2.5" fill="#FFD166" />
              <rect x="44" y="35" width="2.5" height="2.5" fill="#FFD166" />
              <rect x="63" y="31" width="2.5" height="2.5" fill="#00F5D4" />
              <rect x="71" y="37" width="2.5" height="2.5" fill="#FFD166" />

              {/* Study Desk */}
              <rect x="6" y="85" width="88" height="26" fill="#131C2D" stroke="#253550" strokeWidth="2" />

              {/* Glowing Laptop / Terminal Monitor */}
              <rect x="15" y="65" width="26" height="20" fill="#090E1A" stroke="#00F5D4" strokeWidth="1.8" />
              <rect x="17" y="67" width="22" height="16" fill="#041E24" />
              {/* Code lines */}
              <line x1="19" y1="71" x2="35" y2="71" stroke="#00F5D4" strokeWidth="1.2" />
              <line x1="19" y1="74" x2="37" y2="74" stroke="#9D4EDD" strokeWidth="1.2" />
              <line x1="19" y1="77" x2="31" y2="77" stroke="#FFD166" strokeWidth="1.2" />
              {/* Laptop base */}
              <rect x="13" y="84" width="30" height="3" fill="#253550" />

              {/* Desk Lamp Casting Yellow Light */}
              <path d="M80 85 L80 58 L68 54" stroke="#F4A261" strokeWidth="2.2" fill="none" />
              <polygon points="68,52 61,58 72,61" fill="#E76F51" />
              {/* Light cone */}
              <polygon points="61,58 48,85 76,85" fill="#FFE3A8" opacity="0.18" />

              {/* Boy Head & Dark Hoodie */}
              <rect x="43" y="34" width="26" height="28" fill="#1E2838" />
              <rect x="47" y="39" width="18" height="19" fill="#F5D0B5" />
              {/* Hair */}
              <rect x="45" y="32" width="22" height="9" fill="#111822" />
              {/* Glasses reflecting terminal */}
              <rect x="49" y="43" width="5.5" height="4.5" fill="none" stroke="#00F5D4" strokeWidth="1.2" />
              <rect x="57" y="43" width="5.5" height="4.5" fill="none" stroke="#00F5D4" strokeWidth="1.2" />
              <line x1="55" y1="45" x2="57" y2="45" stroke="#00F5D4" strokeWidth="1.2" />

              {/* Midnight Navy Hoodie Torso */}
              <rect x="38" y="57" width="35" height="30" fill="#1A2536" />
              <rect x="47" y="57" width="17" height="7" fill="#141E2D" />
              <rect x="32" y="61" width="9" height="26" fill="#1A2536" />
              <rect x="71" y="61" width="9" height="26" fill="#1A2536" />
            </svg>
          )}
        </div>
      </div>

      {/* 3. CLEAN BOTTOM LABEL (Lower 25% of card: Crisp Non-Truncated Title + Mood Subtitle with Sliding Arrow) */}
      <div className="relative z-10 pt-3 pb-1 border-t border-white/10 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between">
        <div className="space-y-1">
          <h3
            className={`font-silkscreen text-xs sm:text-sm font-bold tracking-wider uppercase ${
              isGirl
                ? 'text-[#F2CC8F] group-hover:text-arcade-gold'
                : 'text-white group-hover:text-arcade-cyan'
            } transition-colors duration-200`}
          >
            {isGirl ? 'STUDY GIRL' : 'STUDY BOY'}
          </h3>
          <p
            className={`font-mono text-[10px] sm:text-[11px] ${
              isGirl ? 'text-[#E07A5F]' : 'text-[#2A9D8F]'
            } flex items-center gap-1 font-medium`}
          >
            <span>{isGirl ? 'Cozy Flow' : 'Night Focus'}</span>
          </p>
        </div>

        {/* Subtle sliding arrow icon */}
        <div
          className={`w-7 h-7 flex items-center justify-center border ${
            isGirl
              ? 'border-[#E07A5F]/60 text-[#F2CC8F] group-hover:border-arcade-gold group-hover:text-arcade-gold group-hover:bg-amber-950/40'
              : 'border-[#2A9D8F]/60 text-arcade-cyan group-hover:border-arcade-cyan group-hover:text-arcade-cyan group-hover:bg-cyan-950/40'
          } transition-all duration-300 shadow-sm`}
        >
          <ArrowRight
            size={13}
            className="transition-transform duration-300 transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  );
};

export default SpiritCard;
