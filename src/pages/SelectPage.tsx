import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Dices, Search, Star, Sparkles, Filter } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character, CharacterCategory } from '../types/character';
import { CharacterVoxelStage } from '../components/CharacterVoxelStage';
import { CharacterCarousel } from '../components/CharacterCarousel';
import { CharacterInfoPanel } from '../components/CharacterInfoPanel';
import { Footer } from '../components/Footer';
import { audioEngine } from '../utils/audioEngine';

export type SpiritFilterType = 'ALL' | 'girl' | 'boy' | 'neutral';

interface SelectPageProps {
  onSelectCharacter: (character: Character) => void;
  onBackToHome: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialCharacter?: Character;
  initialSpirit?: SpiritFilterType;
  onPreviewCharacterChange?: (character: Character) => void;
}

export const SelectPage: React.FC<SelectPageProps> = ({
  onSelectCharacter,
  onBackToHome,
  archetypeMode,
  onToggleArchetypeMode,
  initialCharacter,
  initialSpirit = 'ALL',
  onPreviewCharacterChange,
}) => {
  const [selectedSpirit, setSelectedSpirit] = useState<SpiritFilterType>(initialSpirit);

  // Selected character in the dressing room (defaults to initialCharacter or saved character)
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(() => {
    if (initialCharacter) return initialCharacter;
    try {
      const savedId = localStorage.getItem('focusverse_selected_char');
      if (savedId) {
        const found = CHARACTERS.find((c) => c.id === savedId);
        if (found) return found;
      }
    } catch (_) {}
    return CHARACTERS[0];
  });

  // Keep spirit filter synced if parent initialSpirit changes
  useEffect(() => {
    if (initialSpirit) {
      setSelectedSpirit(initialSpirit);
    }
  }, [initialSpirit]);

  // Keep selected character synced if parent initialCharacter changes
  useEffect(() => {
    if (initialCharacter && initialCharacter.id !== selectedCharacter.id) {
      setSelectedCharacter(initialCharacter);
    }
  }, [initialCharacter]);

  const handleSelectCompanion = (char: Character) => {
    setSelectedCharacter(char);
    if (onPreviewCharacterChange) {
      onPreviewCharacterChange(char);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('focusverse_favorites');
      return saved ? JSON.parse(saved) : ['peter-parker', 'naruto-uzumaki', 'neo'];
    } catch (_) {
      return [];
    }
  });

  // Save favorites in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focusverse_favorites', JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    audioEngine.playClick();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const categories = [
    'ALL',
    'SUPERHEROES',
    'ANIME',
    'ANIMATED & FANTASY',
    'SCI-FI',
    'COZY & EVERYDAY',
    '★ FAVORITES',
  ];

  // Filter roster for the carousel
  const filteredCharacters = CHARACTERS.filter((char) => {
    // 1. Spirit / Gender Filter
    if (selectedSpirit === 'girl' && char.genderOrSpirit !== 'girl') return false;
    if (selectedSpirit === 'boy' && char.genderOrSpirit !== 'boy') return false;
    if (selectedSpirit === 'neutral' && char.genderOrSpirit !== 'neutral') return false;

    // 2. Category Filter
    if (selectedCategory === '★ FAVORITES') {
      if (!favorites.includes(char.id)) return false;
    } else if (selectedCategory !== 'ALL') {
      if (char.category.toUpperCase() !== selectedCategory) return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = char.name.toLowerCase().includes(q);
      const matchArchetype = char.archetypeName.toLowerCase().includes(q);
      const matchUniverse = char.universe.toLowerCase().includes(q);
      const matchTag = char.tagline.toLowerCase().includes(q);
      if (!matchName && !matchArchetype && !matchUniverse && !matchTag) return false;
    }

    return true;
  });

  // Auto-switch to first matching companion if current selection is excluded by filter
  useEffect(() => {
    if (filteredCharacters.length > 0 && !filteredCharacters.some((c) => c.id === selectedCharacter.id)) {
      handleSelectCompanion(filteredCharacters[0]);
    }
  }, [selectedSpirit, selectedCategory]);

  // Pick a random companion (Minecraft PE style)
  const pickRandomCompanion = () => {
    audioEngine.playClick();
    const available = filteredCharacters.length > 0 ? filteredCharacters : CHARACTERS;
    const randomIndex = Math.floor(Math.random() * available.length);
    handleSelectCompanion(available[randomIndex]);
  };

  return (
    <div className="min-h-screen pb-4 pt-3 px-2 sm:px-6 w-full max-w-7xl mx-auto flex flex-col justify-between gap-3 select-none overflow-x-hidden">
      {/* --- TOP TACTICAL HUD BAR --- */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-void-darkest border-2 border-arcade-border text-xs font-mono shadow-pixel">
        {/* Left: Back Button & Roster Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onBackToHome();
            }}
            className="pixel-btn px-2.5 py-1 text-gray-300 hover:text-arcade-gold flex items-center gap-1.5"
            title="Return to Home View"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">[ ◀ RETURN HOME ]</span>
            <span className="sm:hidden">HOME</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="w-2 h-2 bg-arcade-gold animate-ping" />
            <span className="font-pixel text-[10px] text-arcade-gold">
              DRESSING ROOM
            </span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="hidden md:inline">
              SELECT COMPANION: <strong className="text-white">{selectedCharacter.index}</strong>
            </span>
          </div>
        </div>

        {/* Right: Quick Secondary Controls */}
        <div className="flex items-center gap-2">
          {/* Random Companion Button */}
          <button
            onClick={pickRandomCompanion}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan hover:text-white flex items-center gap-1.5"
            title="Choose a random companion"
          >
            <Dices size={14} />
            <span className="hidden sm:inline">RANDOM</span>
          </button>

          {/* Safe Mode Switch */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleArchetypeMode();
            }}
            className={`px-2 py-1 border text-[10px] flex items-center gap-1.5 transition-all ${
              archetypeMode
                ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
            title="Toggle Copyright-Safe RPG Archetypes"
          >
            <ShieldCheck size={12} />
            <span className="hidden sm:inline">SAFE MODE: {archetypeMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* --- DUAL SPIRIT & CATEGORY FILTER BAR --- */}
      <div className="flex flex-col gap-2 bg-void-card pixel-border border-arcade-border p-2.5 shadow-pixel">
        {/* Row 1: Spirit / Gender Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-arcade-border/50 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase mr-1 flex items-center gap-1">
              <Filter size={11} className="text-arcade-gold" />
              SPIRIT:
            </span>
            {(
              [
                { id: 'ALL' as const, label: '[ ALL SPIRITS ]' },
                { id: 'girl' as const, label: '[ ♀ GIRL SPIRITS ]' },
                { id: 'boy' as const, label: '[ ♂ BOY SPIRITS ]' },
                { id: 'neutral' as const, label: '[ 🐾 PETS ]' },
              ]
            ).map((s) => {
              const isActive = selectedSpirit === s.id;
              let activeClass = 'border-arcade-gold bg-arcade-gold text-black shadow-pixel-sm font-bold';
              if (s.id === 'girl') {
                activeClass = 'border-[#E07A5F] bg-[#E07A5F] text-black shadow-pixel-sm font-bold';
              } else if (s.id === 'boy') {
                activeClass = 'border-arcade-cyan bg-arcade-cyan text-black shadow-pixel-sm font-bold';
              } else if (s.id === 'neutral') {
                activeClass = 'border-amber-400 bg-amber-400 text-black shadow-pixel-sm font-bold';
              }

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    audioEngine.playClick();
                    setSelectedSpirit(s.id);
                  }}
                  className={`px-2.5 py-1 text-[9px] sm:text-[10px] font-pixel border transition-all ${
                    isActive
                      ? activeClass
                      : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-arcade-gold'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-gray-400">
            SHOWING: <strong className="text-arcade-gold">{filteredCharacters.length}</strong> / 20 COMPANIONS
          </div>
        </div>

        {/* Row 2: Universe Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 pt-0.5">
          <div className="flex flex-wrap gap-1 text-[9px] sm:text-[10px] font-mono">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    audioEngine.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2 py-0.5 border uppercase font-bold transition-all ${
                    isActive
                      ? 'border-arcade-gold bg-arcade-gold/20 text-arcade-gold border-arcade-gold shadow-pixel-sm'
                      : 'border-arcade-border/80 bg-void-darkest text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-1.5 bg-void-darkest border border-arcade-border px-2 py-1 text-xs font-mono w-full md:w-56 shrink-0">
            <Search size={12} className="text-arcade-gold shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="> filter_companion..."
              className="bg-transparent text-gray-200 placeholder-gray-600 outline-none w-full text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* --- MAIN IMMERSIVE STAGE: 3D CHARACTER PREVIEW + COMPACT INFO PANEL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 my-1">
        {/* Area A: Large Central 3D Character Preview (7 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
          <CharacterVoxelStage
            character={selectedCharacter}
            archetypeMode={archetypeMode}
          />
        </div>

        {/* Area C: Compact Character Information & Action Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <CharacterInfoPanel
            character={selectedCharacter}
            onEnterWorkspace={onSelectCharacter}
            isFavorite={favorites.includes(selectedCharacter.id)}
            onToggleFavorite={toggleFavorite}
            archetypeMode={archetypeMode}
          />
        </div>
      </div>

      {/* --- AREA B: CHARACTER SELECTION CAROUSEL STRIP (Minecraft PE Style) --- */}
      <div className="w-full mt-1 mb-2">
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-4 bg-void-darkest border border-arcade-border text-xs font-mono text-gray-500">
            // No companions match the current filter or search parameters.
          </div>
        ) : (
          <CharacterCarousel
            characters={filteredCharacters}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={handleSelectCompanion}
            favorites={favorites}
            archetypeMode={archetypeMode}
          />
        )}
      </div>

      {/* Global Credits Footer */}
      <Footer />
    </div>
  );
};

