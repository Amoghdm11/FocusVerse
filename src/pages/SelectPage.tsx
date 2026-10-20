import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Dices, Search, Filter } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character } from '../types/character';
import { CharacterVoxelStage } from '../components/CharacterVoxelStage';
import { CharacterInfoPanel } from '../components/CharacterInfoPanel';
import { PixelFaceAvatar } from '../components/PixelFaceAvatar';
import { Footer } from '../components/Footer';
import { audioEngine } from '../utils/audioEngine';

export type SpiritGenderType = 'boy' | 'girl';
export type SpiritToggleOption = 'gender-only' | 'pets-only' | 'both';
export type SpiritFilterType = 'boy' | 'girl' | 'ALL' | 'neutral';

interface SelectPageProps {
  onSelectCharacter: (character: Character) => void;
  onBackToHome: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialCharacter?: Character;
  initialSpirit?: 'boy' | 'girl' | 'ALL' | 'neutral';
  onPreviewCharacterChange?: (character: Character) => void;
}

export const SelectPage: React.FC<SelectPageProps> = ({
  onSelectCharacter,
  onBackToHome,
  archetypeMode,
  onToggleArchetypeMode,
  initialCharacter,
  initialSpirit = 'boy',
  onPreviewCharacterChange,
}) => {
  // 1. Strict Gender Determination (Locked based on Homepage choice: 'boy' or 'girl')
  const [chosenGender, setChosenGender] = useState<SpiritGenderType>(() => {
    if (initialSpirit === 'girl') return 'girl';
    if (initialSpirit === 'boy') return 'boy';
    if (initialCharacter && initialCharacter.genderOrSpirit === 'girl') return 'girl';
    return 'boy';
  });

  // Keep chosenGender in sync if initialSpirit updates
  useEffect(() => {
    if (initialSpirit === 'girl' || initialSpirit === 'boy') {
      setChosenGender(initialSpirit);
    }
  }, [initialSpirit]);

  // Sub-toggle inside the allowed pool: Default is gender-only
  const [spiritToggle, setSpiritToggle] = useState<SpiritToggleOption>('gender-only');
  const [mobileTab, setMobileTab] = useState<'roster' | 'details'>('roster');

  // Selected companion on dressing stage
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(() => {
    if (initialCharacter) return initialCharacter;
    try {
      const savedId = localStorage.getItem('focusverse_selected_char');
      if (savedId) {
        const found = CHARACTERS.find((c) => c.id === savedId);
        if (found) return found;
      }
    } catch (_) {}
    return CHARACTERS.find((c) => c.genderOrSpirit === chosenGender) || CHARACTERS[0];
  });

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

  // Compact category filter tabs
  const categoryTabs = [
    { id: 'ALL', label: 'ALL' },
    { id: 'HEROES', label: 'HEROES' },
    { id: 'ANIME', label: 'ANIME' },
    { id: 'FANTASY', label: 'FANTASY' },
    { id: 'SCI-FI', label: 'SCI-FI' },
    { id: 'COZY', label: 'COZY' },
    { id: '★', label: '★' },
  ];

  // STRICT FILTERING: Only chosen gender + pets
  const filteredCharacters = CHARACTERS.filter((char) => {
    // 1. Strict Spirit Filter
    if (chosenGender === 'boy') {
      if (spiritToggle === 'gender-only' && char.genderOrSpirit !== 'boy') return false;
      if (spiritToggle === 'pets-only' && char.genderOrSpirit !== 'neutral') return false;
      if (spiritToggle === 'both' && char.genderOrSpirit !== 'boy' && char.genderOrSpirit !== 'neutral') return false;
    } else {
      // chosenGender === 'girl'
      if (spiritToggle === 'gender-only' && char.genderOrSpirit !== 'girl') return false;
      if (spiritToggle === 'pets-only' && char.genderOrSpirit !== 'neutral') return false;
      if (spiritToggle === 'both' && char.genderOrSpirit !== 'girl' && char.genderOrSpirit !== 'neutral') return false;
    }

    // 2. Category Filter
    if (selectedCategory === '★') {
      if (!favorites.includes(char.id)) return false;
    } else if (selectedCategory !== 'ALL') {
      const catMap: Record<string, string> = {
        'HEROES': 'Superheroes',
        'ANIME': 'Anime',
        'FANTASY': 'Animated & Fantasy',
        'SCI-FI': 'Sci-Fi',
        'COZY': 'Cozy & Everyday',
      };
      const targetCat = catMap[selectedCategory] || selectedCategory;
      if (char.category.toLowerCase() !== targetCat.toLowerCase()) return false;
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
  }, [spiritToggle, selectedCategory, chosenGender]);

  // Pick a random companion strictly within the allowed pool
  const pickRandomCompanion = () => {
    audioEngine.playClick();
    const available = filteredCharacters.length > 0 ? filteredCharacters : (
      CHARACTERS.filter((c) => chosenGender === 'boy'
        ? (c.genderOrSpirit === 'boy' || c.genderOrSpirit === 'neutral')
        : (c.genderOrSpirit === 'girl' || c.genderOrSpirit === 'neutral')
      )
    );
    if (available.length === 0) return;
    const randomIndex = Math.floor(Math.random() * available.length);
    handleSelectCompanion(available[randomIndex]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#090714] text-gray-200">
      {/* ========================================================================= */}
      {/* LAYER 0 (z-0): UNBOXED FULL-SCREEN 3D BACKGROUND PLANE                    */}
      {/* Character rig and pedestal stand proudly on the right side (~71% width)   */}
      {/* ========================================================================= */}
      <CharacterVoxelStage
        character={selectedCharacter}
        archetypeMode={archetypeMode}
        fullScreen={true}
      />

      {/* ========================================================================= */}
      {/* LAYER 1 (z-20): TOP FLOATING TACTICAL HUD BAR                             */}
      {/* Stretches full-width across the viewport without max-w constraints       */}
      {/* ========================================================================= */}
      <header className="fixed top-2 left-2 right-2 z-20 flex items-center justify-between gap-2 px-3 py-1.5 backdrop-blur-md bg-[#0E0B1C]/85 border-2 border-[#3E356B] text-xs font-mono shadow-[6px_6px_0px_rgba(0,0,0,0.65)]">
        {/* Left: Return Home & Dressing Room Status */}
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
            <span className="hidden md:inline font-mono">
              ROSTER: <strong className={chosenGender === 'girl' ? 'text-[#E07A5F]' : 'text-arcade-cyan'}>
                {chosenGender === 'girl' ? '♀ GIRL SPIRITS + PETS' : '♂ BOY SPIRITS + PETS'}
              </strong>
            </span>
          </div>
        </div>

        {/* Right: Quick Secondary Controls + Mobile Tab Switcher */}
        <div className="flex items-center gap-2">
          {/* Mobile View Switcher (lg:hidden) */}
          <div className="flex lg:hidden items-center border border-arcade-border bg-void-darkest text-[9px] font-mono p-0.5">
            <button
              onClick={() => setMobileTab('roster')}
              className={`px-1.5 py-0.5 ${mobileTab === 'roster' ? 'bg-arcade-gold text-black font-bold' : 'text-gray-400'}`}
            >
              ROSTER
            </button>
            <button
              onClick={() => setMobileTab('details')}
              className={`px-1.5 py-0.5 ${mobileTab === 'details' ? 'bg-arcade-gold text-black font-bold' : 'text-gray-400'}`}
            >
              DETAILS
            </button>
          </div>

          {/* Random Companion Button */}
          <button
            onClick={pickRandomCompanion}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan hover:text-white flex items-center gap-1.5"
            title="Choose a random companion from active pool"
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

      {/* ========================================================================= */}
      {/* LAYER 2 (z-20): FLOATING POP-UPS ANCHORED FLUSH TO FAR-LEFT EDGE          */}
      {/* 1. Leftmost Roster Pop-Up at left-2 (w-[340px])                           */}
      {/* 2. Details Pop-Up immediately to right at left-[352px] (w-[350px])       */}
      {/* Entire center and right side is free for the 3D plane!                   */}
      {/* ========================================================================= */}
      
      {/* 1. LEFTMOST POP-UP WINDOW: CHARACTER CHOOSING ROSTER */}
      <section
        aria-label="Companion Roster Window"
        className={`fixed left-2 top-14 bottom-11 w-[340px] z-20 flex-col backdrop-blur-md bg-[#0E0B1C]/92 border-2 border-[#3E356B] shadow-[8px_8px_0px_rgba(0,0,0,0.7)] pointer-events-auto p-2.5 ${
          mobileTab === 'roster' ? 'flex' : 'hidden lg:flex'
        }`}
      >
          {/* Top of Leftmost Pop-up: Spirit / Pet Toggle */}
          <div className="pb-2.5 border-b border-[#241E3E] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1">
                <Filter size={11} className="text-arcade-gold" />
                SPIRIT POOL:
              </span>
              <span className="text-[10px] text-gray-400">
                SHOWING: <strong className="text-arcade-gold">{filteredCharacters.length}</strong> COMPANIONS
              </span>
            </div>

            {/* Strict Spirit Toggle Pills (Only chosen gender + pets) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {chosenGender === 'boy' ? (
                <>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('gender-only');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'gender-only'
                        ? 'border-arcade-cyan bg-arcade-cyan text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-arcade-cyan'
                    }`}
                  >
                    [ ♂ BOY SPIRITS ]
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('pets-only');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'pets-only'
                        ? 'border-amber-400 bg-amber-400 text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-amber-400'
                    }`}
                  >
                    [ 🐾 PETS ]
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('both');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'both'
                        ? 'border-arcade-gold bg-arcade-gold text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-arcade-gold'
                    }`}
                  >
                    [ BOY + PETS ]
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('gender-only');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'gender-only'
                        ? 'border-[#E07A5F] bg-[#E07A5F] text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-[#E07A5F]'
                    }`}
                  >
                    [ ♀ GIRL SPIRITS ]
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('pets-only');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'pets-only'
                        ? 'border-amber-400 bg-amber-400 text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-amber-400'
                    }`}
                  >
                    [ 🐾 PETS ]
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSpiritToggle('both');
                    }}
                    className={`px-2 py-1 text-[9px] font-pixel border transition-all ${
                      spiritToggle === 'both'
                        ? 'border-arcade-gold bg-arcade-gold text-black shadow-pixel-sm font-bold'
                        : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white hover:border-arcade-gold'
                    }`}
                  >
                    [ GIRL + PETS ]
                  </button>
                </>
              )}
            </div>

            {/* Category Filter Pills & Search Input */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex flex-wrap gap-1 text-[9px] font-mono">
                {categoryTabs.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-1.5 py-0.5 border uppercase font-bold transition-all ${
                        isActive
                          ? 'border-arcade-gold bg-arcade-gold/20 text-arcade-gold shadow-pixel-sm'
                          : 'border-arcade-border/80 bg-void-darkest text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Compact Search Input */}
              <div className="flex items-center gap-1.5 bg-void-darkest border border-arcade-border px-2 py-1 text-xs font-mono w-full">
                <Search size={11} className="text-arcade-gold shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="> filter_companion..."
                  className="bg-transparent text-gray-200 placeholder-gray-600 outline-none w-full text-[10px]"
                />
              </div>
            </div>
          </div>

          {/* Scrollable Body: 2-Column Vertical Roster Grid */}
          <div className="flex-1 overflow-y-auto pr-1 mt-2.5 space-y-2">
            {filteredCharacters.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-gray-500">
                // No companions match the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredCharacters.map((char) => {
                  const isSelected = char.id === selectedCharacter.id;
                  const isFav = favorites.includes(char.id);

                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        audioEngine.playClick();
                        handleSelectCompanion(char);
                        if (window.innerWidth < 1024) {
                          setMobileTab('details');
                        }
                      }}
                      className={`p-2 flex flex-col items-center text-center transition-all border relative select-none ${
                        isSelected
                          ? 'border-arcade-gold bg-amber-950/40 text-arcade-gold shadow-[0_0_12px_rgba(245,194,66,0.35)]'
                          : 'border-arcade-border/80 bg-void-darkest/90 text-gray-300 hover:border-arcade-gold/60 hover:text-white'
                      }`}
                    >
                      {/* Top Bar inside card: Index and Favorite Star */}
                      <div className="w-full flex items-center justify-between text-[9px] font-mono mb-1 text-gray-500">
                        <span className={isSelected ? 'text-arcade-gold font-bold' : ''}>
                          {char.index}
                        </span>
                        {isFav && <span className="text-arcade-gold">★</span>}
                      </div>

                      {/* 32x32 Pixel Art Character Face (Displayed at 56x56px) */}
                      <div className="my-1">
                        <PixelFaceAvatar
                          characterId={char.id}
                          size={56}
                          className={`border ${
                            isSelected ? 'border-arcade-gold shadow-pixel-sm' : 'border-[#3E356B]'
                          }`}
                          title={char.name}
                        />
                      </div>

                      {/* Character Title */}
                      <div className="w-full mt-1">
                        <div className={`font-pixel text-[9px] leading-tight truncate ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {archetypeMode
                            ? char.archetypeName.split('/')[0].trim()
                            : char.name.split('(')[0].trim()}
                        </div>
                        <div className="text-[8px] font-mono text-gray-500 uppercase truncate mt-0.5">
                          {char.category.split('&')[0].trim()}
                        </div>
                      </div>

                      {/* Active Cursor Marker */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-arcade-gold border border-black animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. CENTER-LEFT FLOATING POP-UP: CHARACTER DESCRIPTION & LAUNCH CARD   */}
        {/* Docked immediately to the right of Roster at left-[352px]            */}
        {/* ===================================================================== */}
        <section
          key={selectedCharacter.id}
          aria-label="Companion Details Window"
          className={`fixed left-2 lg:left-[352px] top-14 bottom-11 w-[calc(100vw-16px)] sm:w-[350px] z-20 flex-col pointer-events-auto overflow-y-auto custom-scrollbar animate-fadeIn shrink-0 ${
            mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <CharacterInfoPanel
            character={selectedCharacter}
            onEnterWorkspace={onSelectCharacter}
            isFavorite={favorites.includes(selectedCharacter.id)}
            onToggleFavorite={toggleFavorite}
            archetypeMode={archetypeMode}
          />
        </section>

      {/* ========================================================================= */}
      {/* LAYER 3 (z-20): GLOBAL CREDITS FOOTER                                     */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
};
