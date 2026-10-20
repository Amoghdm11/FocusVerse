import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Dices, Search, Filter, ShieldCheck, Music, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { PixelCharacterSprite } from './PixelCharacterSprite';
import { PixelFaceAvatar } from './PixelFaceAvatar';
import { PixelTransitionOverlay } from './PixelTransitionOverlay';
import { audioEngine } from '../utils/audioEngine';

export type IntroStep =
  | 'INTRO_WELCOME'
  | 'INTRO_EXPLAIN'
  | 'INTRO_PROMPT_SPIRIT'
  | 'CHOOSE_CHARACTER'
  | 'NAME_ENTRY'
  | 'NAME_CONFIRM'
  | 'TRANSITIONING';

interface PokemonIntroSelectProps {
  onSelectCharacter: (character: Character, playerName: string) => void;
  onBackToHome: () => void;
  archetypeMode: boolean;
  onToggleArchetypeMode: () => void;
  initialCharacter?: Character;
  initialSpirit?: 'boy' | 'girl' | 'ALL' | 'neutral';
  onPreviewCharacterChange?: (character: Character) => void;
}

export const PokemonIntroSelect: React.FC<PokemonIntroSelectProps> = ({
  onSelectCharacter,
  onBackToHome,
  archetypeMode,
  onToggleArchetypeMode,
  initialCharacter,
  initialSpirit = 'boy',
  onPreviewCharacterChange,
}) => {
  // Current intro step
  const [step, setStep] = useState<IntroStep>('INTRO_WELCOME');

  // Player Name State (persisted in localStorage)
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('focusverse_player_name') || '';
    } catch (_) {
      return '';
    }
  });
  const [nameError, setNameError] = useState<string>('');

  // Character selection
  const [chosenGender, setChosenGender] = useState<'boy' | 'girl'>(() => {
    if (initialSpirit === 'girl') return 'girl';
    if (initialSpirit === 'boy') return 'boy';
    if (initialCharacter && initialCharacter.genderOrSpirit === 'girl') return 'girl';
    return 'boy';
  });

  const [spiritToggle, setSpiritToggle] = useState<'gender-only' | 'pets-only' | 'both'>('gender-only');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRosterDrawer, setShowRosterDrawer] = useState(false);

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

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('focusverse_favorites');
      return saved ? JSON.parse(saved) : ['peter-parker', 'naruto-uzumaki', 'neo'];
    } catch (_) {
      return [];
    }
  });

  const toggleFavorite = (id: string) => {
    audioEngine.playClick();
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem('focusverse_favorites', JSON.stringify(next));
    } catch (_) {}
  };

  // Transition state
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [isSpriteShrinking, setIsSpriteShrinking] = useState(false);
  const [isPlayingAudioSample, setIsPlayingAudioSample] = useState(false);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  // Filtered companions
  const filteredCharacters = CHARACTERS.filter((char) => {
    if (chosenGender === 'boy') {
      if (spiritToggle === 'gender-only' && char.genderOrSpirit !== 'boy') return false;
      if (spiritToggle === 'pets-only' && char.genderOrSpirit !== 'neutral') return false;
      if (spiritToggle === 'both' && char.genderOrSpirit !== 'boy' && char.genderOrSpirit !== 'neutral') return false;
    } else {
      if (spiritToggle === 'gender-only' && char.genderOrSpirit !== 'girl') return false;
      if (spiritToggle === 'pets-only' && char.genderOrSpirit !== 'neutral') return false;
      if (spiritToggle === 'both' && char.genderOrSpirit !== 'girl' && char.genderOrSpirit !== 'neutral') return false;
    }

    if (selectedCategory === '★') {
      if (!favorites.includes(char.id)) return false;
    } else if (selectedCategory !== 'ALL') {
      const catMap: Record<string, string> = {
        HEROES: 'Superheroes',
        ANIME: 'Anime',
        FANTASY: 'Animated & Fantasy',
        'SCI-FI': 'Sci-Fi',
        COZY: 'Cozy & Everyday',
      };
      const targetCat = catMap[selectedCategory] || selectedCategory;
      if (char.category.toLowerCase() !== targetCat.toLowerCase()) return false;
    }

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

  // Current dialogue line based on step
  const getFullDialogueText = () => {
    switch (step) {
      case 'INTRO_WELCOME':
        return 'Hello there! Welcome to the world of FOCUSVERSE!';
      case 'INTRO_EXPLAIN':
        return 'My name is PROFESSOR FOCUS! Around here, I research the mysteries of flow state and mental clarity.';
      case 'INTRO_PROMPT_SPIRIT':
        return 'In this vast cosmos, infinite distractions test your resolve. To conquer them, you will bond with a COMPANION SPIRIT!';
      case 'CHOOSE_CHARACTER':
        return `Tell me... Which companion spirit resonates with your focus journey?`;
      case 'NAME_ENTRY':
        return `An inspiring choice! Now tell me... What is your name, traveler?`;
      case 'NAME_CONFIRM':
        return `So, your name is ${playerName || 'TRAINER'}?`;
      case 'TRANSITIONING':
        return `${playerName || 'TRAINER'}! Your journey into deep focus begins now. Let's enter the FocusVerse!`;
      default:
        return '';
    }
  };

  // Run typewriter effect whenever step changes
  useEffect(() => {
    const fullText = getFullDialogueText();
    setDisplayedText('');
    setIsTypingComplete(false);

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    let charIdx = 0;
    typingTimerRef.current = window.setInterval(() => {
      charIdx++;
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx));
        // Soft retro typewriter audio pulse every 3 characters
        if (charIdx % 3 === 0) {
          audioEngine.playClick();
        }
      } else {
        setIsTypingComplete(true);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 22);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [step, selectedCharacter.id]);

  // Click on dialogue box to accelerate or advance
  const handleDialogueClick = () => {
    if (!isTypingComplete) {
      // Complete text immediately
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(getFullDialogueText());
      setIsTypingComplete(true);
      audioEngine.playClick();
      return;
    }

    // Advance dialogue
    if (step === 'INTRO_WELCOME') {
      audioEngine.playClick();
      setStep('INTRO_EXPLAIN');
    } else if (step === 'INTRO_EXPLAIN') {
      audioEngine.playClick();
      setStep('INTRO_PROMPT_SPIRIT');
    } else if (step === 'INTRO_PROMPT_SPIRIT') {
      audioEngine.playClick();
      setStep('CHOOSE_CHARACTER');
    }
  };

  // Keyboard navigation for dialogue and character switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in name or search input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === ' ' || e.key === 'Enter') {
        if (['INTRO_WELCOME', 'INTRO_EXPLAIN', 'INTRO_PROMPT_SPIRIT'].includes(step)) {
          e.preventDefault();
          handleDialogueClick();
        }
      } else if (step === 'CHOOSE_CHARACTER') {
        const currentIndex = filteredCharacters.findIndex((c) => c.id === selectedCharacter.id);
        if (currentIndex === -1) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = filteredCharacters[(currentIndex + 1) % filteredCharacters.length];
          handleSelectCompanion(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = filteredCharacters[(currentIndex - 1 + filteredCharacters.length) % filteredCharacters.length];
          handleSelectCompanion(prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isTypingComplete, filteredCharacters, selectedCharacter]);

  const handleSelectCompanion = (char: Character) => {
    audioEngine.playClick();
    setSelectedCharacter(char);
    if (onPreviewCharacterChange) {
      onPreviewCharacterChange(char);
    }
  };

  const handleCycleCompanion = (direction: 'prev' | 'next') => {
    const list = filteredCharacters.length > 0 ? filteredCharacters : CHARACTERS;
    const curIdx = list.findIndex((c) => c.id === selectedCharacter.id);
    const newIdx = direction === 'next'
      ? (curIdx + 1) % list.length
      : (curIdx - 1 + list.length) % list.length;
    handleSelectCompanion(list[newIdx]);
  };

  const handlePickRandom = () => {
    const list = filteredCharacters.length > 0 ? filteredCharacters : CHARACTERS;
    const randomChar = list[Math.floor(Math.random() * list.length)];
    handleSelectCompanion(randomChar);
  };

  const handleConfirmCharacter = () => {
    audioEngine.playClick();
    audioEngine.playTaskComplete();
    setStep('NAME_ENTRY');
  };

  const handleSubmitName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) {
      setNameError('Please enter a name to continue!');
      audioEngine.playClick();
      return;
    }
    setNameError('');
    audioEngine.playClick();
    setStep('NAME_CONFIRM');
  };

  const handleFinalConfirmation = () => {
    if (isTransitionActive) return; // Prevent duplicate transitions
    audioEngine.playClick();

    // Persist to localStorage
    const finalName = playerName.trim() || 'TRAINER';
    try {
      localStorage.setItem('focusverse_player_name', finalName);
      localStorage.setItem('focusverse_selected_char', selectedCharacter.id);
    } catch (_) {}

    // Trigger Step D: Pokémon Gen 3 Pixel Transition
    setStep('TRANSITIONING');
    setIsSpriteShrinking(true);
    audioEngine.playVictoryJingle(selectedCharacter.synthNotes);

    // After brief character shrinkage, start pixel mosaic dissolve wipe
    setTimeout(() => {
      setIsTransitionActive(true);
    }, 450);
  };

  const handleTransitionComplete = () => {
    const finalName = playerName.trim() || 'TRAINER';
    onSelectCharacter(selectedCharacter, finalName);
  };

  const sampleAudio = () => {
    audioEngine.playClick();
    setIsPlayingAudioSample(true);
    audioEngine.playVictoryJingle(selectedCharacter.synthNotes);
    setTimeout(() => setIsPlayingAudioSample(false), 1200);
  };

  // Safe mode companion title
  const displayedCharName = archetypeMode
    ? selectedCharacter.archetypeName.split('/')[0].trim()
    : selectedCharacter.name.split('(')[0].trim();

  return (
    <div
      data-testid="pokemon-intro-container"
      data-step={step}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#090714] text-gray-200 flex flex-col justify-between font-mono"
    >
      {/* --- BACKGROUND RETRO ENVIRONMENT (Pokémon Gen 3 Lab & Aurora Glow) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle retro isometric grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#2F2654_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        {/* Top ambient spotlight */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${selectedCharacter.palette.accentSecondary}22 0%, transparent 65%)`,
          }}
        />
        {/* CRT Scanline effect */}
        <div className="absolute inset-0 crt-overlay opacity-30" />
      </div>

      {/* ========================================================================= */}
      {/* TOP HUD BAR: Title, Return Home, Safe Mode & Roster Drawer Toggle          */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-[#0E0B1C]/90 border-b-2 border-[#3E356B] shadow-[0_2px_12px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onBackToHome();
            }}
            className="pixel-btn px-2.5 py-1 text-gray-300 hover:text-arcade-gold flex items-center gap-1.5 text-xs font-mono"
            title="Return to Home Screen"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">[ ◀ RETURN HOME ]</span>
            <span className="sm:hidden">HOME</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-pixel text-arcade-gold">
            <span className="w-2 h-2 bg-arcade-gold animate-ping" />
            <span className="hidden md:inline">POKÉMON GEN 3 // COMPANION CEREMONY</span>
            <span className="md:hidden">CEREMONY</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Safe Mode Switch */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleArchetypeMode();
            }}
            className={`px-2 py-1 border text-[10px] font-mono flex items-center gap-1.5 transition-all ${
              archetypeMode
                ? 'border-arcade-cyan bg-cyan-950/60 text-arcade-cyan'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
            title="Toggle Copyright-Safe RPG Archetype Names"
          >
            <ShieldCheck size={12} />
            <span className="hidden sm:inline">SAFE MODE: {archetypeMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Roster Drawer Toggle in Character Phase */}
          {step === 'CHOOSE_CHARACTER' && (
            <button
              onClick={() => {
                audioEngine.playClick();
                setShowRosterDrawer(!showRosterDrawer);
              }}
              className={`pixel-btn px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5 ${
                showRosterDrawer ? 'border-arcade-gold text-arcade-gold bg-amber-950/50' : 'text-gray-300'
              }`}
            >
              <Filter size={12} />
              <span>ROSTER ({filteredCharacters.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CENTER STAGE: PROFESSOR BUST OR 2D PIXEL CHARACTER ON BATTLE PLATFORM     */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* --- SCENE A: PROFESSOR INTRODUCTION SCENE --- */}
        {['INTRO_WELCOME', 'INTRO_EXPLAIN', 'INTRO_PROMPT_SPIRIT'].includes(step) && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
            {/* Glowing Retro Platform for Professor */}
            <div className="relative flex flex-col items-center">
              {/* Circular floor shadow & pedestal */}
              <div
                className="w-48 sm:w-64 h-14 rounded-[50%] border-2 border-arcade-cyan/70 bg-[#0E0B1C]"
                style={{
                  boxShadow: '0 0 24px rgba(92,225,230,0.35), inset 0 0 12px rgba(92,225,230,0.2)',
                }}
              >
                <div className="w-3/4 h-3/4 mx-auto mt-1 rounded-[50%] border border-dashed border-arcade-cyan/40" />
              </div>

              {/* Professor Sprite with gentle idle breathing */}
              <div className="absolute -top-24 sm:-top-28 animate-gba-idle-bob">
                <img
                  src="/avatars/professor-focus.png"
                  alt="Professor Focus"
                  width={140}
                  height={140}
                  className="w-32 sm:w-36 h-32 sm:h-36 object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Professor Nameplate */}
            <div className="pokemon-gen3-nameplate px-4 py-1.5 mt-8 inline-block select-none">
              <span className="font-pixel text-xs text-arcade-gold tracking-widest uppercase">
                PROF. FOCUS // MENTOR
              </span>
            </div>
          </div>
        )}

        {/* --- SCENE B: 2D PIXEL CHARACTER SHOWCASE ON BATTLE PLATFORM --- */}
        {['CHOOSE_CHARACTER', 'NAME_ENTRY', 'NAME_CONFIRM', 'TRANSITIONING'].includes(step) && (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center animate-fadeIn relative">
            {/* Character Showcase Container */}
            <div className="relative flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px]">
              {/* Previous / Next Switcher Arrows flanking the platform */}
              {step === 'CHOOSE_CHARACTER' && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-6 pointer-events-none z-20">
                  <button
                    onClick={() => handleCycleCompanion('prev')}
                    className="pixel-btn p-2 sm:p-3 text-arcade-gold pointer-events-auto hover:scale-110 transition-transform shadow-pixel"
                    title="Previous Character (←)"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => handleCycleCompanion('next')}
                    className="pixel-btn p-2 sm:p-3 text-arcade-gold pointer-events-auto hover:scale-110 transition-transform shadow-pixel"
                    title="Next Character (→)"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              )}

              {/* Prominent 2D Character Sprite on Retro Circular Battle Platform */}
              <div className="relative z-10 flex flex-col items-center">
                <PixelCharacterSprite
                  characterId={selectedCharacter.id}
                  size={window.innerWidth < 640 ? 120 : 160}
                  showPlatform={true}
                  platformColor={selectedCharacter.palette.borderPrimary}
                  platformGlow={selectedCharacter.palette.borderPrimary}
                  statusAura={true}
                  isShrinking={isSpriteShrinking}
                  title={selectedCharacter.name}
                />
              </div>

              {/* Character Details Pill Banner */}
              <div className="mt-3 flex flex-col items-center text-center space-y-1 z-10">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 border text-[9px] font-bold uppercase font-mono"
                    style={{
                      borderColor: selectedCharacter.palette.borderPrimary,
                      color: selectedCharacter.palette.borderPrimary,
                      backgroundColor: `${selectedCharacter.palette.borderPrimary}18`,
                    }}
                  >
                    {selectedCharacter.category}
                  </span>
                  <span className="font-pixel text-[10px] text-arcade-gold">{selectedCharacter.index}</span>
                  <button
                    onClick={() => toggleFavorite(selectedCharacter.id)}
                    className="text-arcade-gold hover:scale-110 transition-transform text-xs"
                    title="Save to Favorites"
                  >
                    {favorites.includes(selectedCharacter.id) ? '★' : '☆'}
                  </button>
                </div>

                <h2 className="font-pixel text-sm sm:text-base text-white uppercase drop-shadow-[0_2px_8px_rgba(245,194,66,0.35)]">
                  {displayedCharName}
                </h2>

                <div className="text-[10px] font-mono text-gray-400 max-w-sm truncate">
                  &gt; {selectedCharacter.universe}
                </div>

                {/* Personality Quote */}
                <div className="italic text-[11px] font-mono text-arcade-gold max-w-md line-clamp-1 px-4 mt-0.5">
                  {selectedCharacter.quote}
                </div>
              </div>
            </div>

            {/* Quick Action in Character Selection */}
            {step === 'CHOOSE_CHARACTER' && (
              <div className="mt-3 flex items-center gap-3 z-10">
                <button
                  onClick={sampleAudio}
                  className={`pixel-btn px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 ${
                    isPlayingAudioSample ? 'border-arcade-cyan text-arcade-cyan animate-pulse' : 'text-gray-300'
                  }`}
                  title="Preview Companion Synth Chiptune"
                >
                  <Music size={13} />
                  <span>{isPlayingAudioSample ? 'PLAYING...' : 'SAMPLE SYNTH'}</span>
                </button>

                <button
                  onClick={handleConfirmCharacter}
                  className="pixel-btn-primary px-6 py-2 font-pixel text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(245,194,66,0.5)] hover:scale-105 transition-all"
                >
                  <Check size={14} />
                  <span>[ CHOOSE {displayedCharName} ▶ ]</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- ROSTER DRAWER (Overlaid Drawer to quickly pick any of the 20 characters) --- */}
        {step === 'CHOOSE_CHARACTER' && showRosterDrawer && (
          <div className="fixed inset-x-2 sm:inset-x-8 bottom-32 top-16 z-30 bg-[#0E0B1C]/95 border-2 border-arcade-gold backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.85)] p-3 flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A234E]">
              <div className="flex items-center gap-2 text-xs font-pixel text-arcade-gold">
                <span>SELECT FROM ROSTER</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-300 font-mono text-[11px]">{filteredCharacters.length} AVAILABLE</span>
              </div>
              <button
                onClick={() => setShowRosterDrawer(false)}
                className="pixel-btn px-2 py-0.5 text-xs text-gray-400 hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[10px] font-mono">
              <div className="flex items-center gap-1 flex-wrap">
                {/* Gender Pills */}
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setSpiritToggle('gender-only');
                  }}
                  className={`px-2 py-0.5 border ${
                    spiritToggle === 'gender-only' ? 'border-arcade-cyan bg-arcade-cyan text-black font-bold' : 'border-arcade-border text-gray-400'
                  }`}
                >
                  {chosenGender === 'boy' ? '♂ BOYS' : '♀ GIRLS'}
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setSpiritToggle('pets-only');
                  }}
                  className={`px-2 py-0.5 border ${
                    spiritToggle === 'pets-only' ? 'border-amber-400 bg-amber-400 text-black font-bold' : 'border-arcade-border text-gray-400'
                  }`}
                >
                  🐾 PETS
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setSpiritToggle('both');
                  }}
                  className={`px-2 py-0.5 border ${
                    spiritToggle === 'both' ? 'border-arcade-gold bg-arcade-gold text-black font-bold' : 'border-arcade-border text-gray-400'
                  }`}
                >
                  ALL
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1">
                {['ALL', 'HEROES', 'ANIME', 'FANTASY', 'SCI-FI', 'COZY', '★'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      audioEngine.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-1.5 py-0.5 border uppercase ${
                      selectedCategory === cat ? 'border-arcade-gold bg-arcade-gold/20 text-arcade-gold font-bold' : 'border-arcade-border text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Random button */}
              <button
                onClick={handlePickRandom}
                className="pixel-btn px-2 py-0.5 text-[10px] text-arcade-cyan flex items-center gap-1"
                title="Random selection"
              >
                <Dices size={12} />
                <span>RANDOM</span>
              </button>
            </div>

            {/* Grid of characters */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 pr-1">
              {filteredCharacters.map((char) => {
                const isSelected = char.id === selectedCharacter.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      handleSelectCompanion(char);
                      setShowRosterDrawer(false);
                    }}
                    className={`p-2 flex flex-col items-center text-center border transition-all ${
                      isSelected
                        ? 'border-arcade-gold bg-amber-950/60 shadow-pixel'
                        : 'border-arcade-border/70 bg-void-darkest hover:border-arcade-gold/50'
                    }`}
                  >
                    <PixelFaceAvatar characterId={char.id} size={48} className="w-12 h-12 mb-1" />
                    <span className="font-pixel text-[10px] text-white truncate w-full">
                      {archetypeMode ? char.archetypeName.split('/')[0] : char.name.split('(')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">{char.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BOTTOM POKÉMON GEN 3 DIALOGUE & INTERACTION BOX                           */}
      {/* Authentic retro styling with typewriter text, name entry & confirmation   */}
      {/* ========================================================================= */}
      <footer className="relative z-20 px-3 sm:px-6 pb-4 max-w-4xl mx-auto w-full">
        {/* Gen 3 Retro Dialogue Box */}
        <div
          onClick={handleDialogueClick}
          className="pokemon-gen3-box relative p-4 sm:p-5 select-none transition-all cursor-pointer hover:border-arcade-gold/70"
        >
          {/* Speaker Name Tag (Professor or Player) */}
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-[#090714] border border-arcade-gold text-[10px] font-pixel text-arcade-gold uppercase shadow-pixel-sm">
            {step === 'NAME_ENTRY' ? 'PLAYER REGISTRATION' : 'PROFESSOR FOCUS'}
          </div>

          {/* Dialogue Text Content with Typewriter */}
          <div className="min-h-[52px] sm:min-h-[60px] flex items-center">
            <p className="font-pixel text-xs sm:text-sm text-[#F0E8FF] leading-relaxed tracking-wide">
              {displayedText}
              {!isTypingComplete && <span className="pixel-cursor ml-1 text-arcade-gold">█</span>}
            </p>
          </div>

          {/* --- PHASE B: NAME ENTRY INTERACTION IN DIALOGUE BOX --- */}
          {step === 'NAME_ENTRY' && (
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col space-y-2 animate-fadeIn">
              <form onSubmit={handleSubmitName} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-pixel text-arcade-gold">&gt;</span>
                <input
                  type="text"
                  maxLength={16}
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="ENTER NAME..."
                  autoFocus
                  className="flex-1 min-w-[180px] bg-[#090714] border-2 border-arcade-gold px-3 py-1.5 font-pixel text-xs sm:text-sm text-arcade-gold uppercase outline-none focus:shadow-[0_0_12px_rgba(245,194,66,0.6)]"
                />
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-2 font-pixel text-xs uppercase flex items-center gap-1.5"
                >
                  <span>[ CONFIRM ▶ ]</span>
                </button>
              </form>

              {/* Name Quick Suggestions & Error message */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span>SUGGESTIONS:</span>
                  {['TRAINER', 'SCHOLAR', 'RED', 'MAY', 'PILOT'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        audioEngine.playClick();
                        setPlayerName(sug);
                        if (nameError) setNameError('');
                      }}
                      className="px-1.5 py-0.5 border border-arcade-border text-gray-300 hover:border-arcade-gold hover:text-white"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
                {nameError && <span className="text-red-400 font-bold">{nameError}</span>}
              </div>
            </div>
          )}

          {/* --- PHASE C: NAME CONFIRMATION OPTIONS IN DIALOGUE BOX --- */}
          {step === 'NAME_CONFIRM' && (
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-end gap-3 animate-fadeIn">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setStep('NAME_ENTRY');
                }}
                className="pixel-btn px-4 py-2 font-pixel text-[11px] text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <span>[ ◀ NO, CHANGE NAME ]</span>
              </button>

              <button
                onClick={handleFinalConfirmation}
                className="pixel-btn-primary px-6 py-2 font-pixel text-[11px] uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,194,66,0.6)] hover:scale-105 transition-transform"
              >
                <Check size={14} />
                <span>[ YES, THAT'S ME! ▶ ]</span>
              </button>
            </div>
          )}

          {/* Dialogue Advance Bouncing Triangle Indicator (▼) in Intro steps */}
          {['INTRO_WELCOME', 'INTRO_EXPLAIN', 'INTRO_PROMPT_SPIRIT'].includes(step) && isTypingComplete && (
            <div className="absolute right-4 bottom-3 flex items-center gap-1 text-[10px] font-pixel text-arcade-gold animate-gba-arrow-bounce">
              <span>▼</span>
            </div>
          )}
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* PHASE D: FULL-SCREEN CANVAS PIXEL MOSAIC DISSOLVE TRANSITION OVERLAY      */}
      {/* ========================================================================= */}
      <PixelTransitionOverlay
        isActive={isTransitionActive}
        onComplete={handleTransitionComplete}
        durationMs={1100}
      />
    </div>
  );
};
