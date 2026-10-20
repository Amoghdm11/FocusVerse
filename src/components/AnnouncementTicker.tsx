import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const ANNOUNCEMENTS = [
  '8.2 BILLION PEOPLE. 20 WORLDS TO FIND YOUR FOCUS.',
  'ANNOUNCEMENT: "ICE PALACE" SOUNDSCAPE CALIBRATED (+2 NEW 8-BIT TRACKS)',
  'TELEMETRY: 20 COMPANION WORLDS ONLINE // ZERO DISTRACTION PROTOCOL ACTIVE',
  'AUDIO RADAR: RAIN, BATCAVE SONAR, MATRIX STREAM & LO-FI AMBIENT READY',
  'PROTOCOL: CHOOSE STUDY BOY OR STUDY GIRL TO CALIBRATE YOUR FLOW SPIRIT',
  'RETRO HUD: MASTER VOLUME, CRT SCANLINES & PARALLAX CONTROLS AVAILABLE',
  'PRODUCTIVITY: 1 DEEP-WORK SESSION MOVES YOU LIGHTYEARS FORWARD',
];

export const AnnouncementTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = ANNOUNCEMENTS[currentIndex];
  const typingTimerRef = useRef<number | null>(null);

  // Typewriter effect on announcement change
  useEffect(() => {
    let charIdx = 0;
    setDisplayedText('');
    setIsTyping(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = window.setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.substring(0, charIdx));
      if (charIdx >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 20);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentIndex, fullText]);

  // Auto-advance announcement every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClick();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClick();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div
      role="region"
      aria-label="System Announcement Ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="inline-flex items-center gap-3 px-3 py-2 bg-[#121026]/90 backdrop-blur-md pixel-border border border-arcade-gold/50 shadow-pixel max-w-full select-none transition-all hover:border-arcade-gold"
    >
      {/* Radio Signal Pulse */}
      <div className="flex items-center gap-1.5 shrink-0 text-arcade-gold">
        <Radio size={13} className="text-arcade-gold animate-pulse" />
        <span className="font-mono text-[9px] text-arcade-cyan font-bold hidden sm:inline">
          LIVE
        </span>
      </div>

      <div className="text-gray-600 hidden sm:inline">|</div>

      {/* Terminal Animated Text Display */}
      <div
        aria-live="polite"
        className="font-pixel text-[10px] sm:text-xs text-arcade-gold tracking-wider uppercase min-h-[16px] flex items-center overflow-hidden"
      >
        <span className="text-arcade-cyan mr-1.5 shrink-0">&gt;</span>
        <span className="truncate">{displayedText}</span>
        <span className="w-1.5 h-3 bg-arcade-gold inline-block ml-1 animate-pulse" />
      </div>

      {/* Manual Controls & Page Index */}
      <div className="flex items-center gap-1 shrink-0 ml-auto pl-2 border-l border-white/10 text-[9px] font-mono">
        <span className="text-gray-400 hidden md:inline">
          [{String(currentIndex + 1).padStart(2, '0')}/{String(ANNOUNCEMENTS.length).padStart(2, '0')}]
        </span>

        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="p-0.5 text-gray-400 hover:text-arcade-gold transition-colors"
          title="Previous announcement"
        >
          <ChevronLeft size={12} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="p-0.5 text-gray-400 hover:text-arcade-gold transition-colors"
          title="Next announcement"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementTicker;
