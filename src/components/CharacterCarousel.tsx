import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import { Character } from '../types/character';
import { PixelEmblem } from './PixelEmblems';
import { audioEngine } from '../utils/audioEngine';

interface CharacterCarouselProps {
  characters: Character[];
  selectedCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  favorites: string[];
  archetypeMode?: boolean;
}

export const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  favorites,
  archetypeMode = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll selected character horizontally into the center of the carousel view without moving window
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      const targetLeft = item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  }, [selectedCharacter.id]);

  // Keyboard navigation: ArrowLeft and ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a search input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      const currentIndex = characters.findIndex((c) => c.id === selectedCharacter.id);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % characters.length;
        audioEngine.playClick();
        onSelectCharacter(characters[nextIndex]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
        audioEngine.playClick();
        onSelectCharacter(characters[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [characters, selectedCharacter, onSelectCharacter]);

  const scrollLeft = () => {
    audioEngine.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    audioEngine.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-void-darkest border-2 border-arcade-border p-2 shadow-pixel select-none">
      {/* Header bar of strip */}
      <div className="flex items-center justify-between px-2 pb-1.5 mb-1.5 border-b border-[#241E3E] text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-arcade-gold font-silkscreen uppercase tracking-wider">
            COMPANION ROSTER STRIP
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">
            {characters.findIndex((c) => c.id === selectedCharacter.id) + 1} OF {characters.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={scrollLeft}
            className="pixel-btn p-1 text-gray-300 hover:text-arcade-gold"
            title="Scroll Left (←)"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={scrollRight}
            className="pixel-btn p-1 text-gray-300 hover:text-arcade-gold"
            title="Scroll Right (→)"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Character Strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 scroll-smooth no-scrollbar"
        tabIndex={0}
      >
        {characters.map((char) => {
          const isSelected = char.id === selectedCharacter.id;
          const isFav = favorites.includes(char.id);

          return (
            <button
              key={char.id}
              ref={isSelected ? activeItemRef : null}
              onClick={() => {
                audioEngine.playClick();
                onSelectCharacter(char);
              }}
              className={`shrink-0 w-24 sm:w-28 p-2 flex flex-col items-center justify-between transition-all duration-150 border-2 text-left relative ${
                isSelected
                  ? 'border-arcade-gold bg-[#1E1738] shadow-pixel-gold translate-y-[-2px]'
                  : 'border-arcade-border bg-void-card hover:border-gray-400 hover:bg-[#16122C]'
              }`}
            >
              {/* Selected Arrow / Top Notch indicator */}
              {isSelected && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-arcade-gold rotate-45" />
              )}

              {/* Index & Favorite Icon */}
              <div className="w-full flex items-center justify-between text-[9px] font-mono mb-1">
                <span className={isSelected ? 'text-arcade-gold font-bold' : 'text-gray-500'}>
                  {char.index}
                </span>
                {isFav && <Star size={10} fill="#F5C242" color="#F5C242" />}
              </div>

              {/* Pixel Emblem Icon Preview */}
              <div className="my-1 p-1 flex items-center justify-center">
                <PixelEmblem
                  type={char.pixelSpriteType}
                  palette={char.palette}
                  size={36}
                />
              </div>

              {/* Character Short Label */}
              <div className="w-full text-center mt-1">
                <div className="text-[10px] font-pixel text-white truncate leading-tight">
                  {archetypeMode ? char.archetypeName.split(' / ')[0] : char.name.split(' (')[0]}
                </div>
                <div className="text-[8px] font-mono text-gray-400 uppercase truncate mt-0.5"
                  style={{ color: isSelected ? char.palette.accentSecondary : undefined }}
                >
                  {char.category.slice(0, 8)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
