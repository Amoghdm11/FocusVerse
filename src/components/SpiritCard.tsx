import React, { useState } from 'react';
import { Sparkles, Music, Headphones, Laptop, Moon, Coffee, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SpiritCardProps {
  type: 'girl' | 'boy';
  onClick: () => void;
}

export const SpiritCard: React.FC<SpiritCardProps> = ({ type, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isGirl = type === 'girl';

  const handleClick = () => {
    audioEngine.playClick();
    if (isGirl) {
      audioEngine.playVictoryJingle([261.63, 329.63, 392.00, 523.25]); // Warm Lo-Fi major chord
    } else {
      audioEngine.playVictoryJingle([220.00, 261.63, 349.23, 440.00]); // Nocturne cyan chord
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative aspect-[9/16] w-full rounded-none border-2 cursor-pointer select-none overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 transition-all duration-300 transform hover:-translate-y-1.5 ${
        isGirl
          ? 'bg-gradient-to-b from-[#1C1216] via-[#24171E] to-[#120B0F] border-[#D47A5B] hover:border-arcade-gold hover:shadow-[0_0_24px_rgba(242,204,143,0.4)]'
          : 'bg-gradient-to-b from-[#0B111E] via-[#10192C] to-[#060912] border-[#2A9D8F] hover:border-arcade-cyan hover:shadow-[0_0_24px_rgba(0,245,212,0.4)]'
      }`}
    >
      {/* Background Animated Ambience Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        {isGirl ? (
          // Falling Autumn Leaves / Warm Rain for Cozy Girl
          <div className="w-full h-full relative">
            <span className="absolute top-2 left-3 w-1 h-1 bg-[#F2CC8F] rounded-full animate-ping opacity-60" />
            <span className="absolute top-12 right-4 w-1.5 h-1.5 bg-[#E07A5F] rounded-none rotate-45 animate-pulse" />
            <span className="absolute top-24 left-6 w-1 h-2 bg-[#81B29A] opacity-50" />
            <span className="absolute bottom-16 right-5 w-1 h-1 bg-[#F2CC8F] animate-ping" />
            {/* Fairy Lights string across top */}
            <div className="absolute top-0 left-0 right-0 flex justify-around px-2 pt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#F2CC8F] shadow-[0_0_8px_#F2CC8F] animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Cyber Stars / Tokyo Skyscraper Grid for Late-Night Boy
          <div className="w-full h-full relative">
            <span className="absolute top-3 right-5 w-1 h-1 bg-arcade-cyan rounded-full animate-ping opacity-70" />
            <span className="absolute top-14 left-4 w-1.5 h-1.5 bg-[#7209B7] rounded-none rotate-45 animate-pulse" />
            <span className="absolute top-20 right-8 w-1 h-1 bg-white opacity-60" />
            <span className="absolute bottom-20 left-4 w-1 h-2 bg-arcade-cyan opacity-40" />
            {/* Midnight City Windows Grid */}
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

      {/* --- TOP BADGE & TELEMETRY --- */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className={`px-2 py-0.5 border text-[9px] font-mono tracking-wider uppercase font-bold flex items-center gap-1 ${
            isGirl
              ? 'border-[#E07A5F] bg-[#3B1F27]/70 text-[#F2CC8F]'
              : 'border-[#2A9D8F] bg-[#112F38]/70 text-arcade-cyan'
          }`}
        >
          {isGirl ? (
            <>
              <Coffee size={10} className="text-[#E07A5F]" />
              <span>COZY SPIRIT</span>
            </>
          ) : (
            <>
              <Moon size={10} className="text-arcade-cyan" />
              <span>NIGHT SPIRIT</span>
            </>
          )}
        </div>

        <span
          className={`text-[9px] font-mono ${
            isGirl ? 'text-[#F2CC8F]/80' : 'text-arcade-cyan/80'
          }`}
        >
          {isGirl ? '♀ FEMALE' : '♂ MALE'}
        </span>
      </div>

      {/* --- CENTER: ARTICULATED PIXEL-ART / VOXEL ILLUSTRATION --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-1">
        {isGirl ? (
          // Cozy Study Girl Artwork (SVG Crisp Pixel Art)
          <div className="relative flex flex-col items-center">
            {/* Warm desk lamp glow */}
            <div className="absolute -top-3 w-28 h-28 bg-[#F2CC8F]/15 rounded-full blur-xl pointer-events-none" />

            <svg
              viewBox="0 0 100 120"
              className="w-24 sm:w-28 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{ shapeRendering: 'crispEdges' }}
            >
              {/* Rain Attic Window Frame */}
              <rect x="15" y="10" width="70" height="50" fill="#120B0F" stroke="#3D262F" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="60" stroke="#3D262F" strokeWidth="1.5" />
              <line x1="15" y1="35" x2="85" y2="35" stroke="#3D262F" strokeWidth="1.5" />
              {/* Falling rain streaks */}
              <line x1="25" y1="15" x2="22" y2="28" stroke="#81B29A" strokeWidth="1" opacity="0.6" />
              <line x1="40" y1="20" x2="37" y2="33" stroke="#81B29A" strokeWidth="1" opacity="0.4" />
              <line x1="65" y1="18" x2="62" y2="30" stroke="#81B29A" strokeWidth="1" opacity="0.5" />
              <line x1="75" y1="38" x2="72" y2="52" stroke="#81B29A" strokeWidth="1" opacity="0.6" />

              {/* Study Desk */}
              <rect x="8" y="85" width="84" height="24" fill="#2E1B1B" stroke="#4A2A2A" strokeWidth="2" />

              {/* Cozy Steaming Mug */}
              <rect x="18" y="76" width="10" height="12" fill="#E07A5F" />
              <rect x="28" y="79" width="3" height="6" fill="#D47A5B" />
              {/* Steam waves */}
              <path d="M21 72 Q23 68 20 64" stroke="#F2CC8F" strokeWidth="1" fill="none" opacity="0.7" />
              <path d="M25 73 Q27 69 24 65" stroke="#F2CC8F" strokeWidth="1" fill="none" opacity="0.5" />

              {/* Girl Hair (Warm Chestnut) */}
              <rect x="36" y="32" width="28" height="30" fill="#4A2810" />
              <rect x="32" y="38" width="8" height="26" fill="#3D1F0C" />
              <rect x="60" y="38" width="8" height="26" fill="#3D1F0C" />

              {/* Cute Head & Face */}
              <rect x="40" y="36" width="20" height="20" fill="#FAD2B8" />
              {/* Eyes */}
              <rect x="44" y="44" width="3" height="3" fill="#2E1B1B" />
              <rect x="53" y="44" width="3" height="3" fill="#2E1B1B" />
              {/* Cheeks */}
              <rect x="42" y="48" width="3" height="2" fill="#FF8BA7" opacity="0.7" />
              <rect x="55" y="48" width="3" height="2" fill="#FF8BA7" opacity="0.7" />

              {/* Mint Green Headphones */}
              <path d="M35 44 C35 30 65 30 65 44" stroke="#81B29A" strokeWidth="3" fill="none" />
              <rect x="32" y="40" width="5" height="10" fill="#588157" />
              <rect x="63" y="40" width="5" height="10" fill="#588157" />

              {/* Terracotta Oversized Sweater */}
              <rect x="32" y="56" width="36" height="30" fill="#E07A5F" />
              <rect x="38" y="56" width="24" height="6" fill="#D47A5B" />
              <rect x="26" y="60" width="8" height="22" fill="#E07A5F" />
              <rect x="66" y="60" width="8" height="22" fill="#E07A5F" />

              {/* Notebook & Pen on desk */}
              <rect x="40" y="80" width="24" height="12" fill="#F4F1DE" />
              <line x1="42" y1="83" x2="62" y2="83" stroke="#81B29A" strokeWidth="0.8" />
              <line x1="42" y1="86" x2="62" y2="86" stroke="#81B29A" strokeWidth="0.8" />
              <line x1="42" y1="89" x2="58" y2="89" stroke="#81B29A" strokeWidth="0.8" />
              <line x1="66" y1="78" x2="72" y2="86" stroke="#F2CC8F" strokeWidth="1.5" />
            </svg>

            {/* Subtle floating icon */}
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#F2CC8F] font-mono">
              <Headphones size={12} className="text-[#81B29A]" />
              <span>Lo-Fi Beats • Attic Rain</span>
            </div>
          </div>
        ) : (
          // Late-Night Study Boy Artwork (SVG Crisp Pixel Art)
          <div className="relative flex flex-col items-center">
            {/* Cool monitor cyan glow */}
            <div className="absolute -top-3 w-28 h-28 bg-arcade-cyan/15 rounded-full blur-xl pointer-events-none" />

            <svg
              viewBox="0 0 100 120"
              className="w-24 sm:w-28 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{ shapeRendering: 'crispEdges' }}
            >
              {/* Tokyo Window & Skyline */}
              <rect x="15" y="10" width="70" height="50" fill="#060912" stroke="#1A263D" strokeWidth="2" />
              {/* Skyscraper Silhouettes */}
              <rect x="20" y="24" width="14" height="36" fill="#0C1424" />
              <rect x="38" y="18" width="16" height="42" fill="#111B30" />
              <rect x="58" y="28" width="22" height="32" fill="#0D1627" />
              {/* City Windows */}
              <rect x="23" y="28" width="2" height="2" fill="#FFD166" />
              <rect x="28" y="34" width="2" height="2" fill="#00F5D4" />
              <rect x="42" y="22" width="2" height="2" fill="#00F5D4" />
              <rect x="48" y="26" width="2" height="2" fill="#FFD166" />
              <rect x="44" y="36" width="2" height="2" fill="#FFD166" />
              <rect x="63" y="32" width="2" height="2" fill="#00F5D4" />
              <rect x="70" y="38" width="2" height="2" fill="#FFD166" />

              {/* Study Desk */}
              <rect x="8" y="85" width="84" height="24" fill="#131C2D" stroke="#23334E" strokeWidth="2" />

              {/* Glowing Laptop / Monitor */}
              <rect x="16" y="66" width="24" height="18" fill="#090E1A" stroke="#00F5D4" strokeWidth="1.5" />
              <rect x="18" y="68" width="20" height="14" fill="#041E24" />
              {/* Code lines */}
              <line x1="20" y1="71" x2="34" y2="71" stroke="#00F5D4" strokeWidth="1" />
              <line x1="20" y1="74" x2="36" y2="74" stroke="#9D4EDD" strokeWidth="1" />
              <line x1="20" y1="77" x2="30" y2="77" stroke="#FFD166" strokeWidth="1" />
              {/* Laptop base */}
              <rect x="14" y="84" width="28" height="3" fill="#23334E" />

              {/* Desk Lamp Casting Yellow Light */}
              <path d="M78 85 L78 60 L68 56" stroke="#F4A261" strokeWidth="2" fill="none" />
              <polygon points="68,54 62,60 72,62" fill="#E76F51" />
              {/* Light cone */}
              <polygon points="62,60 50,85 75,85" fill="#FFE3A8" opacity="0.15" />

              {/* Boy Head & Dark Hoodie */}
              <rect x="44" y="36" width="24" height="26" fill="#1E2838" />
              <rect x="48" y="40" width="16" height="18" fill="#F5D0B5" />
              {/* Hair */}
              <rect x="46" y="34" width="20" height="8" fill="#111822" />
              {/* Glasses reflecting terminal */}
              <rect x="50" y="44" width="5" height="4" fill="none" stroke="#00F5D4" strokeWidth="1" />
              <rect x="57" y="44" width="5" height="4" fill="none" stroke="#00F5D4" strokeWidth="1" />
              <line x1="55" y1="46" x2="57" y2="46" stroke="#00F5D4" strokeWidth="1" />

              {/* Midnight Navy Hoodie Torso */}
              <rect x="40" y="58" width="32" height="28" fill="#1A2536" />
              <rect x="48" y="58" width="16" height="6" fill="#141E2D" />
              <rect x="34" y="62" width="8" height="24" fill="#1A2536" />
              <rect x="70" y="62" width="8" height="24" fill="#1A2536" />
            </svg>

            {/* Subtle floating icon */}
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-arcade-cyan font-mono">
              <Laptop size={12} className="text-arcade-gold" />
              <span>3:45 AM Neon • Terminal Debug</span>
            </div>
          </div>
        )}
      </div>

      {/* --- BOTTOM LABELS & INTERACTIVE CTA BUTTON --- */}
      <div className="relative z-10 space-y-2 pt-2 border-t border-white/10">
        <div>
          <h3
            className={`font-silkscreen text-[11px] sm:text-xs uppercase tracking-wider font-bold truncate ${
              isGirl
                ? 'text-[#F2CC8F] group-hover:text-arcade-gold'
                : 'text-white group-hover:text-arcade-cyan'
            }`}
          >
            {isGirl ? 'COZY STUDY GIRL' : 'LATE-NIGHT STUDY BOY'}
          </h3>
          <p className="font-mono text-[9px] text-gray-400 truncate">
            {isGirl ? 'Rainy Attic Desk • Lo-Fi Beats' : 'Tokyo Dormitory • 3:45 AM Neon'}
          </p>
        </div>

        {/* Tactical Button Tag */}
        <div
          className={`w-full py-2 px-1 text-center font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider transition-all duration-200 border shadow-pixel-sm ${
            isGirl
              ? 'border-[#E07A5F] bg-[#E07A5F]/20 text-[#F2CC8F] group-hover:bg-[#E07A5F] group-hover:text-black group-hover:border-arcade-gold'
              : 'border-[#2A9D8F] bg-[#2A9D8F]/20 text-arcade-cyan group-hover:bg-arcade-cyan group-hover:text-black group-hover:border-white'
          }`}
        >
          <span>{isGirl ? '[ FEMALE / COZY SPIRIT ▶ ]' : '[ MALE / NIGHT SPIRIT ▶ ]'}</span>
        </div>
      </div>
    </div>
  );
};

export default SpiritCard;
