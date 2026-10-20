import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Dices,
  Check,
  Shield,
  Zap,
  Activity,
  Layers,
  Scissors,
  Palette,
  User,
  Headphones,
  Sliders,
  Play
} from 'lucide-react';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import {
  CustomAppearanceState,
  DEFAULT_BOY_CUSTOM,
  DEFAULT_GIRL_CUSTOM,
  OUTFIT_CATALOG,
  HAIR_STYLES_BOY,
  HAIR_STYLES_GIRL,
  HAIR_COLORS,
  SKIN_TONES,
  ACCESSORIES,
  SuitMetadata,
  OutfitId,
  HairStyleId,
  HairColorId,
  SkinToneId,
  AccessoryId,
  CharacterGender
} from '../utils/pixelSpriteCompositor';
import { FullBodyPixelSprite } from './FullBodyPixelSprite';
import { PixelTransitionOverlay } from './PixelTransitionOverlay';
import { audioEngine } from '../utils/audioEngine';

export type CustomizationTab = 'SUITS' | 'HAIR' | 'COLOR' | 'SKIN' | 'ACCESSORIES' | 'IDENTITY';

export interface SpiderManCustomizationMenuProps {
  initialCharacter?: Character;
  initialGender?: 'boy' | 'girl';
  initialPlayerName?: string;
  onBackToHome: () => void;
  onConfirmAppearance: (
    character: Character,
    appearance: CustomAppearanceState,
    playerName: string
  ) => void;
  archetypeMode?: boolean;
}

export const SpiderManCustomizationMenu: React.FC<SpiderManCustomizationMenuProps> = ({
  initialCharacter,
  initialGender = 'boy',
  initialPlayerName = 'TRAINER',
  onBackToHome,
  onConfirmAppearance,
  archetypeMode = false,
}) => {
  // Load initial appearance state from localStorage or defaults
  const [appearance, setAppearance] = useState<CustomAppearanceState>(() => {
    try {
      const saved = localStorage.getItem('focusverse_custom_appearance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gender) return parsed;
      }
    } catch (_) {}
    return initialGender === 'girl' ? { ...DEFAULT_GIRL_CUSTOM } : { ...DEFAULT_BOY_CUSTOM };
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('focusverse_player_name') || initialPlayerName || 'TRAINER';
  });

  const [activeTab, setActiveTab] = useState<CustomizationTab>('SUITS');
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);
  const [isSpriteShrinking, setIsSpriteShrinking] = useState<boolean>(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Sync gender if initialGender changes
  useEffect(() => {
    if (initialGender && initialGender !== appearance.gender) {
      handleGenderSwitch(initialGender);
    }
  }, [initialGender]);

  // Find current suit metadata
  const currentSuit: SuitMetadata =
    OUTFIT_CATALOG.find((s) => s.id === appearance.outfit) || OUTFIT_CATALOG[0];

  // Map to matching FocusVerse base character
  const matchingBaseCharacter: Character =
    CHARACTERS.find((c) =>
      appearance.gender === 'boy'
        ? c.id === 'late-night-study-boy' || c.genderOrSpirit === 'boy'
        : c.id === 'cozy-study-girl' || c.genderOrSpirit === 'girl'
    ) || CHARACTERS[0];

  // Switch between Boy and Girl base
  const handleGenderSwitch = (newGender: CharacterGender) => {
    audioEngine.playClick();
    const defaults = newGender === 'girl' ? DEFAULT_GIRL_CUSTOM : DEFAULT_BOY_CUSTOM;
    setAppearance((prev) => ({
      ...prev,
      gender: newGender,
      hairStyle: defaults.hairStyle,
      hairColor: prev.hairColor,
      skinTone: prev.skinTone,
      outfit: prev.outfit,
      accessory: prev.accessory,
    }));
  };

  // Option handlers
  const handleSelectOutfit = (outfitId: OutfitId) => {
    audioEngine.playClick();
    setAppearance((prev) => ({ ...prev, outfit: outfitId }));
  };

  const handleSelectHairStyle = (hairId: HairStyleId) => {
    audioEngine.playClick();
    setAppearance((prev) => ({ ...prev, hairStyle: hairId }));
  };

  const handleSelectHairColor = (colorId: HairColorId) => {
    audioEngine.playClick();
    setAppearance((prev) => ({ ...prev, hairColor: colorId }));
  };

  const handleSelectSkinTone = (skinId: SkinToneId) => {
    audioEngine.playClick();
    setAppearance((prev) => ({ ...prev, skinTone: skinId }));
  };

  const handleSelectAccessory = (accId: AccessoryId) => {
    audioEngine.playClick();
    setAppearance((prev) => ({ ...prev, accessory: accId }));
  };

  // Randomize Appearance (Generates cohesive loadout with chiptune sound)
  const handleRandomize = () => {
    audioEngine.playClick();
    audioEngine.playVictoryJingle([329.63, 440.0, 554.37, 659.25]);

    const outfits = OUTFIT_CATALOG.map((s) => s.id);
    const hairList = appearance.gender === 'boy' ? HAIR_STYLES_BOY : HAIR_STYLES_GIRL;
    const colors = HAIR_COLORS.map((c) => c.id);
    const skins = SKIN_TONES.map((s) => s.id);
    const accs = ACCESSORIES.map((a) => a.id);

    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    const randomHair = hairList[Math.floor(Math.random() * hairList.length)].id;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    const randomAcc = accs[Math.floor(Math.random() * accs.length)];

    setAppearance((prev) => ({
      ...prev,
      outfit: randomOutfit,
      hairStyle: randomHair,
      hairColor: randomColor,
      skinTone: randomSkin,
      accessory: randomAcc,
    }));

    setSpeechBubble('Randomized loadout calibrated!');
    setTimeout(() => setSpeechBubble(null), 2500);
  };

  // Reset to default preset
  const handleReset = () => {
    audioEngine.playClick();
    const defaults = appearance.gender === 'girl' ? DEFAULT_GIRL_CUSTOM : DEFAULT_BOY_CUSTOM;
    setAppearance({ ...defaults, playerName });
    setSpeechBubble('Suit specs restored to factory defaults.');
    setTimeout(() => setSpeechBubble(null), 2500);
  };

  // Character sprite click
  const handleSpriteClick = () => {
    audioEngine.playClick();
    audioEngine.playVictoryJingle(matchingBaseCharacter.synthNotes);
    const quotes = [
      'Suit systems nominal. Ready to lock in!',
      'Flow state calibrated. Let’s do this.',
      'Distraction dampers active.',
      'Pomodoro capacitors fully charged!',
    ];
    const picked = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechBubble(picked);
    setTimeout(() => setSpeechBubble(null), 3000);
  };

  // Final Confirmation: Save & Trigger Pixel Transition
  const handleConfirmAndEnter = () => {
    if (isTransitionActive) return; // Guard against double clicks
    audioEngine.playClick();
    audioEngine.playVictoryJingle(matchingBaseCharacter.synthNotes);

    const finalName = playerName.trim() || 'TRAINER';

    // Persist to localStorage
    try {
      const finalAppearance = { ...appearance, playerName: finalName };
      localStorage.setItem('focusverse_player_name', finalName);
      localStorage.setItem('focusverse_custom_appearance', JSON.stringify(finalAppearance));
      localStorage.setItem(
        'focusverse_selected_char',
        appearance.gender === 'boy' ? 'late-night-study-boy' : 'cozy-study-girl'
      );
    } catch (_) {}

    // Trigger shrink and mosaic dissolve wipe
    setIsSpriteShrinking(true);
    setTimeout(() => {
      setIsTransitionActive(true);
    }, 400);
  };

  const handleTransitionComplete = () => {
    const finalName = playerName.trim() || 'TRAINER';
    onConfirmAppearance(matchingBaseCharacter, appearance, finalName);
  };

  const availableHairStyles =
    appearance.gender === 'boy' ? HAIR_STYLES_BOY : HAIR_STYLES_GIRL;

  return (
    <div
      data-testid="spiderman-customization-container"
      className="relative w-screen h-screen overflow-hidden select-none bg-[#090714] text-gray-200 flex flex-col justify-between font-mono"
    >
      {/* --- BACKGROUND SCI-FI VOID & HOLOGRAPHIC GRID --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(92,225,230,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,194,66,0.05)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#261F45_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: SUIT LOCKER HUD & STATUS TELEMETRY                            */}
      {/* ========================================================================= */}
      <header className="relative z-20 px-4 sm:px-6 py-3 border-b-2 border-[#241E3E] bg-[#0E0B1C]/90 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Left: Back button & Mode Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onBackToHome();
            }}
            className="pixel-btn px-2.5 py-1 text-xs text-gray-300 hover:text-arcade-gold flex items-center gap-1.5"
            title="Return to Home screen"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">[ ◀ HOME ]</span>
            <span className="sm:hidden">HOME</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-arcade-cyan animate-ping inline-block" />
            <div>
              <h1 className="font-pixel text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <span>FOCUSVERSE</span>
                <span className="text-arcade-gold">//</span>
                <span className="text-arcade-cyan">SUIT CUSTOMIZATION MATRIX</span>
              </h1>
              <div className="text-[9px] font-mono text-gray-400 hidden md:block">
                INSOMNIAC SUIT PROTOCOL • 16-BIT RETRO 2D SPRITE FABRICATOR
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry telemetry status & Quick action */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#130E29] border border-white/10">
            <span className="text-gray-400">STATUS:</span>
            <span className="text-green-400 font-bold">ONLINE</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">CALIBRATION:</span>
            <span className="text-arcade-cyan font-bold">100%</span>
          </div>

          <button
            onClick={handleRandomize}
            className="pixel-btn px-2.5 py-1 text-xs text-arcade-gold hover:text-white flex items-center gap-1"
            title="Randomize loadout"
          >
            <Dices size={13} />
            <span className="hidden sm:inline">RANDOMIZE</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN 2-PANEL COMPOSITION: LEFT CONTROLS (40%) | RIGHT PREVIEW (60%)       */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden max-w-7xl mx-auto w-full">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CUSTOMIZATION MENU (lg:col-span-5)                         */}
        {/* Inspired by Insomniac's Spider-Man Suit Locker                          */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 flex flex-col border-r-0 lg:border-r-2 border-[#241E3E] bg-[#0E0B1C]/85 backdrop-blur-md overflow-hidden h-full">
          
          {/* 1. TOP CHARACTER SELECTOR: BOY vs GIRL CARDS */}
          <div className="p-3.5 border-b border-[#241E3E] bg-[#120E24]">
            <div className="text-[10px] font-pixel text-arcade-gold uppercase mb-2 flex items-center justify-between">
              <span>1. SELECT CHARACTER BASE</span>
              <span className="text-gray-400 font-mono text-[9px]">GENDER / PROFILE</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* BOY OPTION CARD */}
              <button
                onClick={() => handleGenderSwitch('boy')}
                className={`p-2.5 flex items-center gap-2.5 border transition-all text-left relative ${
                  appearance.gender === 'boy'
                    ? 'border-arcade-cyan bg-cyan-950/40 shadow-[0_0_15px_rgba(92,225,230,0.25)]'
                    : 'border-arcade-border/70 bg-void-darkest hover:border-arcade-cyan/50 text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center font-pixel text-sm border ${
                    appearance.gender === 'boy'
                      ? 'border-arcade-cyan text-arcade-cyan bg-cyan-900/40'
                      : 'border-gray-700 text-gray-500'
                  }`}
                >
                  ♂
                </div>
                <div className="flex-1 truncate">
                  <div
                    className={`font-pixel text-[11px] truncate uppercase ${
                      appearance.gender === 'boy' ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    BOY TRAINER
                  </div>
                  <div className="text-[9px] font-mono text-gray-500 truncate">
                    LATE-NIGHT SCHOLAR
                  </div>
                </div>
                {appearance.gender === 'boy' && (
                  <Check size={14} className="text-arcade-cyan shrink-0" />
                )}
              </button>

              {/* GIRL OPTION CARD */}
              <button
                onClick={() => handleGenderSwitch('girl')}
                className={`p-2.5 flex items-center gap-2.5 border transition-all text-left relative ${
                  appearance.gender === 'girl'
                    ? 'border-arcade-gold bg-amber-950/40 shadow-[0_0_15px_rgba(245,194,66,0.25)]'
                    : 'border-arcade-border/70 bg-void-darkest hover:border-arcade-gold/50 text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center font-pixel text-sm border ${
                    appearance.gender === 'girl'
                      ? 'border-arcade-gold text-arcade-gold bg-amber-900/40'
                      : 'border-gray-700 text-gray-500'
                  }`}
                >
                  ♀
                </div>
                <div className="flex-1 truncate">
                  <div
                    className={`font-pixel text-[11px] truncate uppercase ${
                      appearance.gender === 'girl' ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    GIRL TRAINER
                  </div>
                  <div className="text-[9px] font-mono text-gray-500 truncate">
                    COZY STUDY SPIRIT
                  </div>
                </div>
                {appearance.gender === 'girl' && (
                  <Check size={14} className="text-arcade-gold shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* 2. SPIDER-MAN STYLE CATEGORY NAVIGATION TABS */}
          <div className="flex border-b border-[#241E3E] bg-[#0A0816] text-[10px] font-mono select-none overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('SUITS');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'SUITS'
                  ? 'border-arcade-gold text-arcade-gold font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={12} />
              <span>OUTFITS ({OUTFIT_CATALOG.length})</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('HAIR');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'HAIR'
                  ? 'border-arcade-cyan text-arcade-cyan font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Scissors size={12} />
              <span>HAIRSTYLE</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('COLOR');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'COLOR'
                  ? 'border-arcade-pink text-arcade-pink font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Palette size={12} />
              <span>COLOR</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('SKIN');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'SKIN'
                  ? 'border-amber-400 text-amber-400 font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <User size={12} />
              <span>SKIN</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('ACCESSORIES');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'ACCESSORIES'
                  ? 'border-green-400 text-green-400 font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Zap size={12} />
              <span>GEAR</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                setActiveTab('IDENTITY');
              }}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'IDENTITY'
                  ? 'border-purple-400 text-purple-400 font-bold bg-[#140F2A]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>NAME</span>
            </button>
          </div>

          {/* 3. ACTIVE CATEGORY OPTIONS (SCROLLABLE LIST) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {/* --- TAB A: OUTFITS / SUITS (SPIDER-MAN SUIT LOCKER CARDS) --- */}
            {activeTab === 'SUITS' && (
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5 flex items-center justify-between">
                  <span>SELECT SUIT LOADOUT</span>
                  <span>{OUTFIT_CATALOG.length} SUITS CALIBRATED</span>
                </div>

                {OUTFIT_CATALOG.map((suit) => {
                  const isSelected = appearance.outfit === suit.id;
                  return (
                    <button
                      key={suit.id}
                      onClick={() => handleSelectOutfit(suit.id)}
                      className={`w-full p-3 border transition-all text-left relative overflow-hidden group ${
                        isSelected
                          ? 'border-arcade-gold bg-amber-950/40 shadow-[0_0_20px_rgba(245,194,66,0.3)]'
                          : 'border-arcade-border/70 bg-[#120E24] hover:border-arcade-gold/50'
                      }`}
                    >
                      {/* Top Header: Suit Name & Mod Badge */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-none border shrink-0"
                            style={{ backgroundColor: suit.themeColor, borderColor: suit.accentColor }}
                          />
                          <h3 className="font-pixel text-[11px] text-white uppercase tracking-wide group-hover:text-arcade-gold transition-colors">
                            {suit.name}
                          </h3>
                        </div>

                        {isSelected && (
                          <span className="px-1.5 py-0.5 bg-arcade-gold text-black font-pixel text-[9px] uppercase font-bold shrink-0">
                            EQUIPPED
                          </span>
                        )}
                      </div>

                      {/* Suit Tagline */}
                      <div className="text-[9px] font-mono text-gray-400 mb-2 truncate">
                        &gt; {suit.tagline}
                      </div>

                      {/* Insomniac-style Suit Mod Perk */}
                      <div className="p-1.5 bg-[#090714] border border-white/10 mb-2 flex items-center gap-1.5 text-[9px] font-mono">
                        <Zap size={11} className="text-arcade-gold shrink-0" />
                        <span className="text-gray-400">PERK:</span>
                        <span className="text-arcade-cyan font-bold truncate">{suit.focusMod}</span>
                      </div>

                      {/* Live Stat Meters (Focus, Agility, Resilience) */}
                      <div className="grid grid-cols-3 gap-2 text-[8px] font-mono">
                        <div>
                          <div className="flex justify-between text-gray-400 mb-0.5">
                            <span>FOCUS</span>
                            <span>{suit.stats.focus}%</span>
                          </div>
                          <div className="h-1 bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-arcade-gold transition-all duration-300"
                              style={{ width: `${suit.stats.focus}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-gray-400 mb-0.5">
                            <span>AGILITY</span>
                            <span>{suit.stats.agility}%</span>
                          </div>
                          <div className="h-1 bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-arcade-cyan transition-all duration-300"
                              style={{ width: `${suit.stats.agility}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-gray-400 mb-0.5">
                            <span>SHIELD</span>
                            <span>{suit.stats.resilience}%</span>
                          </div>
                          <div className="h-1 bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-green-400 transition-all duration-300"
                              style={{ width: `${suit.stats.resilience}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* --- TAB B: HAIR STYLE --- */}
            {activeTab === 'HAIR' && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5">
                  HAIRSTYLE FOR {appearance.gender.toUpperCase()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableHairStyles.map((h) => {
                    const isSelected = appearance.hairStyle === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => handleSelectHairStyle(h.id)}
                        className={`p-3 border flex items-center gap-3 transition-all text-left ${
                          isSelected
                            ? 'border-arcade-cyan bg-cyan-950/50 shadow-pixel'
                            : 'border-arcade-border/70 bg-[#120E24] hover:border-arcade-cyan/50 text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{h.previewIcon}</span>
                        <div className="truncate flex-1">
                          <div className="font-pixel text-[10px] text-white uppercase truncate">
                            {h.name}
                          </div>
                          <div className="text-[9px] font-mono text-gray-500">
                            {isSelected ? 'CURRENT CUT' : 'SELECT'}
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-arcade-cyan" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB C: HAIR COLOR --- */}
            {activeTab === 'COLOR' && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5">
                  HAIR DYE & PALETTE
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {HAIR_COLORS.map((hc) => {
                    const isSelected = appearance.hairColor === hc.id;
                    return (
                      <button
                        key={hc.id}
                        onClick={() => handleSelectHairColor(hc.id)}
                        className={`p-2.5 border flex items-center gap-2.5 transition-all text-left ${
                          isSelected
                            ? 'border-arcade-pink bg-pink-950/40 shadow-pixel'
                            : 'border-arcade-border/70 bg-[#120E24] hover:border-arcade-pink/50'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-none border border-white/30 shrink-0 shadow-sm"
                          style={{ backgroundColor: hc.hex }}
                        />
                        <div className="truncate flex-1">
                          <div className="font-pixel text-[10px] text-white uppercase truncate">
                            {hc.name}
                          </div>
                          <div className="text-[8px] font-mono text-gray-500">{hc.hex}</div>
                        </div>
                        {isSelected && <Check size={13} className="text-arcade-pink" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB D: SKIN TONE --- */}
            {activeTab === 'SKIN' && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5">
                  SKIN PIGMENTATION / SYNTH
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {SKIN_TONES.map((st) => {
                    const isSelected = appearance.skinTone === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => handleSelectSkinTone(st.id)}
                        className={`p-2.5 border flex items-center gap-2.5 transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 shadow-pixel'
                            : 'border-arcade-border/70 bg-[#120E24] hover:border-amber-400/50'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-none border border-white/30 shrink-0 shadow-sm"
                          style={{ backgroundColor: st.hex }}
                        />
                        <div className="truncate flex-1">
                          <div className="font-pixel text-[10px] text-white uppercase truncate">
                            {st.name}
                          </div>
                          <div className="text-[8px] font-mono text-gray-500">{st.hex}</div>
                        </div>
                        {isSelected && <Check size={13} className="text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB E: ACCESSORIES & GEAR --- */}
            {activeTab === 'ACCESSORIES' && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5">
                  FOCUS GEAR & MOD ATTACHMENTS
                </div>

                <div className="space-y-2">
                  {ACCESSORIES.map((acc) => {
                    const isSelected = appearance.accessory === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => handleSelectAccessory(acc.id)}
                        className={`w-full p-2.5 border flex items-center gap-3 transition-all text-left ${
                          isSelected
                            ? 'border-green-400 bg-green-950/40 shadow-pixel'
                            : 'border-arcade-border/70 bg-[#120E24] hover:border-green-400/50'
                        }`}
                      >
                        <span className="text-xl shrink-0">{acc.icon}</span>
                        <div className="flex-1 truncate">
                          <div className="font-pixel text-[11px] text-white uppercase truncate">
                            {acc.name}
                          </div>
                          <div className="text-[9px] font-mono text-gray-400 truncate">
                            {acc.description}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 bg-green-400 text-black font-pixel text-[8px] uppercase font-bold shrink-0">
                            ATTACHED
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB F: TRAINER CALLSIGN / NAME --- */}
            {activeTab === 'IDENTITY' && (
              <div className="space-y-3 p-1">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pb-1 border-b border-white/5">
                  TRAINER CALLSIGN REGISTRATION
                </div>

                <div className="p-3 bg-[#120E24] border border-white/10 space-y-2.5">
                  <label className="text-[10px] font-pixel text-arcade-gold block uppercase">
                    CALLSIGN (MAX 16 CHARS):
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="ENTER TRAINER NAME..."
                    className="w-full bg-[#090714] border-2 border-arcade-gold px-3 py-2 font-pixel text-xs text-arcade-gold uppercase outline-none focus:shadow-[0_0_12px_rgba(245,194,66,0.5)]"
                  />

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] font-mono text-gray-400">
                    <span>SUGGESTIONS:</span>
                    {['TRAINER', 'SPIDER', 'SCHOLAR', 'RONIN', 'RED', 'MAY'].map((sug) => (
                      <button
                        key={sug}
                        onClick={() => {
                          audioEngine.playClick();
                          setPlayerName(sug);
                        }}
                        className="px-2 py-0.5 border border-arcade-border text-gray-300 hover:border-arcade-gold hover:text-white"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. BOTTOM ACTION CONTROLS: RESET, RANDOMIZE & CONFIRM */}
          <div className="p-3 border-t-2 border-[#241E3E] bg-[#0A0816] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="pixel-btn px-2.5 py-1.5 text-xs text-gray-400 hover:text-white flex-1 flex items-center justify-center gap-1"
                title="Restore default appearance"
              >
                <RotateCcw size={12} />
                <span>RESET</span>
              </button>

              <button
                onClick={handleRandomize}
                className="pixel-btn px-2.5 py-1.5 text-xs text-arcade-cyan hover:text-white flex-1 flex items-center justify-center gap-1"
                title="Randomize loadout"
              >
                <Dices size={12} />
                <span>RANDOMIZE</span>
              </button>
            </div>

            {/* Prominent Insomniac-style Final CTA */}
            <button
              onClick={handleConfirmAndEnter}
              disabled={isTransitionActive}
              className={`pixel-btn-primary w-full py-3 font-pixel text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,194,66,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all ${
                isTransitionActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Zap size={14} className="text-black" />
              <span>[ ⚡ LOCK IN APPEARANCE & ENTER WORKSPACE ▶ ]</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: FULL-BODY 2D PIXEL CHARACTER PREVIEW (lg:col-span-7)     */}
        {/* The Centerpiece of the entire experience                                */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden">
          
          {/* Top-Right Holographic Suit Telemetry Overlay Badge */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono select-none z-10">
            <div className="px-3 py-1.5 bg-[#120E26]/80 border border-arcade-gold/50 backdrop-blur-md shadow-pixel flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-arcade-gold animate-pulse" />
              <span className="font-pixel text-[10px] text-arcade-gold uppercase">
                {currentSuit.name}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 font-mono text-[9px]">{currentSuit.focusMod}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#0E0B1C]/80 border border-white/10 text-gray-400">
              <span>CALLSIGN:</span>
              <span className="font-pixel text-arcade-cyan uppercase">{playerName || 'TRAINER'}</span>
            </div>
          </div>

          {/* Centerpiece: Full-Body 2D Pixel Sprite with Platform & Quote */}
          <div className="relative flex-1 flex flex-col items-center justify-center w-full my-auto z-10">
            {/* Interactive Dialogue Speech Bubble (if triggered) */}
            {speechBubble && (
              <div className="absolute top-4 px-4 py-2 bg-[#0E0B1C] border-2 border-arcade-gold text-arcade-gold font-pixel text-xs shadow-[0_0_20px_rgba(245,194,66,0.4)] animate-fadeIn max-w-sm text-center z-20">
                &gt; &quot;{speechBubble}&quot;
              </div>
            )}

            {/* The Large, Complete, Full-Body 2D Pixel Sprite */}
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <FullBodyPixelSprite
                appearance={appearance}
                size={430}
                showPlatform={true}
                platformColor={currentSuit.themeColor}
                animated={true}
                isShrinking={isSpriteShrinking}
                onClick={handleSpriteClick}
                title="Click character to preview focus melody & quote"
              />
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-gray-400 pt-3 border-t border-white/5 z-10">
            <div className="flex items-center gap-2">
              <span className="text-arcade-gold font-bold">▶ LIVE 2D PIXEL PIPELINE:</span>
              <span>64×96 NATIVE RESOLUTION</span>
              <span className="text-gray-600">•</span>
              <span className="text-arcade-cyan">LAYERED COMPOSITOR</span>
              <span className="text-gray-600">•</span>
              <span>CRISP NEAREST-NEIGHBOR</span>
            </div>

            <div className="text-gray-500 hidden sm:block">
              &gt; CLICK SPRITE TO AUDIT TELEMETRY MELODY
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FINAL TRANSITION OVERLAY: HTML5 CANVAS PIXEL MOSAIC DISSOLVE WIPE        */}
      {/* Only triggers after the player clicks final confirmation                 */}
      {/* ========================================================================= */}
      <PixelTransitionOverlay
        isActive={isTransitionActive}
        onComplete={handleTransitionComplete}
        durationMs={1100}
      />
    </div>
  );
};

export default SpiderManCustomizationMenu;
