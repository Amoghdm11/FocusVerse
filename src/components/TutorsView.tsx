import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Plus, 
  Check, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ChevronRight,
  Shield,
  Layers,
  Search,
  X,
  Star,
  CheckCircle2
} from 'lucide-react';
import { CustomTutorProfile, RPGTutorArchetype, StudyEnvironment } from '../types/rpg';
import { TUTOR_ARCHETYPES, CORE_TUTOR_PROFILES, STUDY_ENVIRONMENTS } from '../data/tutorArchetypes';
import { rpgStore } from '../utils/rpgStore';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { audioEngine } from '../utils/audioEngine';

interface TutorsViewProps {
  activeCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  onOpen3DStage: () => void;
  onStartFocusSession?: (char: Character) => void;
}

export const TutorsView: React.FC<TutorsViewProps> = ({
  activeCharacter,
  onSelectCharacter,
  onOpen3DStage,
  onStartFocusSession,
}) => {
  const [activeArchetypeTab, setActiveArchetypeTab] = useState<RPGTutorArchetype>('STRICT_MENTOR');
  const [customTutors, setCustomTutors] = useState<CustomTutorProfile[]>(rpgStore.getCustomTutors());
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>('bedroom');

  // SELECT TUTOR Modal State
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterCategory, setRosterCategory] = useState<string>('ALL');

  // Custom Tutor Builder Modal (Accessible as secondary action)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customArchetype, setCustomArchetype] = useState<RPGTutorArchetype>('FRIENDLY_COMPANION');
  const [customAvatar, setCustomAvatar] = useState('🦉');
  const [customTagline, setCustomTagline] = useState('Midnight Library • Calm Study • Deep Focus');
  const [customQuote, setCustomQuote] = useState('Step by step, the summit is reached.');
  const [customDuration, setCustomDuration] = useState(30);

  const activeArchetypeMeta = TUTOR_ARCHETYPES[activeArchetypeTab];

  const handleCreateCustomTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    audioEngine.playVictoryJingle();
    const created = rpgStore.addCustomTutor({
      name: customName.trim(),
      archetype: customArchetype,
      description: 'Personalized user-crafted study companion',
      tagline: customTagline.trim(),
      quote: customQuote.trim(),
      avatar: customAvatar,
      preferredDuration: Number(customDuration) || 25,
      preferredEnvironment: selectedEnvironmentId,
      dialogueTone: 'friendly',
    });

    setCustomTutors(rpgStore.getCustomTutors());
    setShowCreateModal(false);
    setCustomName('');

    // Automatically select the newly created tutor
    handleSelectCoreTutor(created);
  };

  const handleSelectCoreTutor = (profile: CustomTutorProfile) => {
    audioEngine.playClick();
    const mappedChar: Character = {
      id: profile.id,
      index: '00/CORE',
      name: profile.name,
      archetypeName: TUTOR_ARCHETYPES[profile.archetype].title,
      category: 'Cozy & Everyday',
      universe: profile.tagline,
      tagline: profile.tagline,
      quote: profile.quote,
      palette: {
        bgVoid: '#0E0914',
        borderPrimary: '#F5C242',
        accentGold: '#F5C242',
        accentSecondary: '#5CE1E6',
        stripeColors: ['#F5C242', '#5CE1E6', '#FF007F'],
      },
      pixelSpriteType: 'pixel-cat',
      environmentFX: 'pixel-rain',
      codeSnippet: ['// Study companion calibrated'],
      synthNotes: [261.63, 329.63, 392.00, 523.25],
      ambienceProfile: 'rain',
      genderOrSpirit: 'girl',
    };

    onSelectCharacter(mappedChar);
    try {
      localStorage.setItem('focusverse_selected_char', mappedChar.id);
    } catch (_) {}
    setShowSelectModal(false);
  };

  const handleSelectCanonCharacter = (char: Character) => {
    audioEngine.playClick();
    onSelectCharacter(char);
    try {
      localStorage.setItem('focusverse_selected_char', char.id);
    } catch (_) {}
    setShowSelectModal(false);
  };

  const isCurrentActive = (name: string, id: string) => {
    return activeCharacter.id === id || activeCharacter.name.includes(name);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-gold flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            👥
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              TUTOR COMPANIONS &amp; STUDY ENVIRONMENTS
            </h1>
            <p className="text-[10px] text-gray-400">
              Active Tutor: <span className="text-arcade-gold font-bold">{activeCharacter.name}</span> // Browse &amp; select your preferred study companion
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* UPGRADED PRIMARY BUTTON: SELECT TUTOR */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowSelectModal(true);
            }}
            className="pixel-btn-primary px-3.5 py-1.5 text-xs font-pixel flex items-center gap-1.5 uppercase shadow-[0_0_15px_rgba(245,194,66,0.3)]"
          >
            <Check size={14} />
            <span>SELECT TUTOR</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpen3DStage();
            }}
            className="pixel-btn px-3 py-1.5 text-xs text-arcade-cyan hover:text-white flex items-center gap-1.5"
            title="Open 3D Voxel Dressing Room for 20 Characters"
          >
            <Layers size={13} />
            <span>3D ROSTER (20)</span>
          </button>

          {/* Secondary Action: Craft Custom Companion */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowCreateModal(true);
            }}
            className="pixel-btn px-2.5 py-1.5 text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
            title="Craft a personalized custom tutor"
          >
            <Plus size={12} />
            <span className="hidden sm:inline">CUSTOM</span>
          </button>
        </div>
      </div>

      {/* --- CURRENT ACTIVE TUTOR SPOTLIGHT BANNER --- */}
      <div className="bg-void-card pixel-border border-arcade-gold p-4 shadow-pixel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-void border-2 border-arcade-gold flex items-center justify-center text-2xl shadow-pixel-sm shrink-0">
            {activeCharacter.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] text-arcade-gold uppercase">CURRENTLY ACTIVE COMPANION</span>
              <span className="px-1.5 py-0.5 bg-green-950/80 border border-green-500 text-green-300 font-pixel text-[8px]">
                ● ACTIVE
              </span>
            </div>
            <h2 className="font-silkscreen text-base text-white mt-0.5">{activeCharacter.name}</h2>
            <p className="text-[10px] text-gray-400 italic">&ldquo;{activeCharacter.quote}&rdquo;</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowSelectModal(true);
            }}
            className="pixel-btn px-3 py-1.5 text-xs text-arcade-gold hover:text-white flex items-center gap-1"
          >
            <span>CHANGE COMPANION</span>
            <ChevronRight size={13} />
          </button>
          {onStartFocusSession && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onStartFocusSession(activeCharacter);
              }}
              className="pixel-btn-primary px-3 py-1.5 text-xs font-pixel flex items-center gap-1 uppercase"
              title="Launch Study Timer with this companion"
            >
              <span>START STUDY ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* --- SECTION 1: 5 CORE TUTOR ARCHETYPES --- */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
          <span className="font-silkscreen text-xs text-arcade-gold uppercase">
            5 CORE TUTOR ARCHETYPES
          </span>
          <span className="text-[9px] text-gray-400 font-pixel">DISTINCT PERSONALITIES</span>
        </div>

        {/* Archetype selector buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(TUTOR_ARCHETYPES) as RPGTutorArchetype[]).map((archKey) => {
            const meta = TUTOR_ARCHETYPES[archKey];
            const isSelected = activeArchetypeTab === archKey;
            return (
              <button
                key={archKey}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveArchetypeTab(archKey);
                }}
                className={`p-2.5 border text-left transition-all ${
                  isSelected
                    ? 'border-arcade-gold bg-amber-950/60 text-arcade-gold font-bold shadow-pixel-sm'
                    : 'border-arcade-border bg-void text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-silkscreen text-[11px] truncate">{meta.title}</div>
                <div className="text-[8px] text-gray-400 font-pixel mt-1 truncate">{meta.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Archetype Deep Dive */}
        {activeArchetypeMeta && (
          <div className="p-4 bg-void border border-arcade-border grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <div className="md:col-span-5 space-y-2 border-r border-arcade-border/50 pr-4">
              <div className="font-silkscreen text-sm text-white">{activeArchetypeMeta.title}</div>
              <p className="text-gray-300 text-xs leading-relaxed">
                {activeArchetypeMeta.description}
              </p>
              <div className="text-[10px] text-arcade-cyan pt-2">
                • Recommended Duration: <span className="font-bold">{activeArchetypeMeta.recommendedDuration} minutes</span>
              </div>

              {/* Matching Core Tutor Profile Card with Visual Active Indicator */}
              {CORE_TUTOR_PROFILES.find((p) => p.archetype === activeArchetypeTab) && (
                <div className="mt-4 pt-3 border-t border-arcade-border/60">
                  <div className="text-[9px] text-gray-500 font-pixel mb-1.5">REPRESENTATIVE TUTOR:</div>
                  {(() => {
                    const profile = CORE_TUTOR_PROFILES.find((p) => p.archetype === activeArchetypeTab)!;
                    const isActive = isCurrentActive(profile.name, profile.id);

                    return (
                      <div className={`p-2.5 border flex items-center justify-between gap-3 transition-all ${
                        isActive
                          ? 'border-arcade-gold bg-amber-950/40 shadow-pixel-sm'
                          : 'border-arcade-border bg-void-card'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{profile.avatar}</span>
                          <div>
                            <div className="font-bold text-xs text-white">{profile.name}</div>
                            <div className="text-[9px] text-gray-400">{profile.tagline}</div>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="px-2.5 py-1 bg-green-950/80 border border-green-500 text-green-300 font-pixel text-[8px]">
                            ✓ SELECTED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectCoreTutor(profile)}
                            className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black uppercase"
                          >
                            SELECT
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Contextual Dialogue Preview (7 cols) */}
            <div className="md:col-span-7 space-y-2">
              <div className="font-silkscreen text-xs text-arcade-gold mb-2">
                CONTEXTUAL DIALOGUE SAMPLES
              </div>

              <div className="space-y-2">
                <div className="p-2 bg-void-card border border-arcade-border/60">
                  <span className="text-[9px] text-arcade-cyan font-pixel block mb-0.5">ON SESSION START:</span>
                  <p className="italic text-gray-200 text-xs">
                    &ldquo;{activeArchetypeMeta.dialogue.onStart[0]}&rdquo;
                  </p>
                </div>

                <div className="p-2 bg-void-card border border-arcade-border/60">
                  <span className="text-[9px] text-arcade-pink font-pixel block mb-0.5">ON BREAK TIME:</span>
                  <p className="italic text-gray-200 text-xs">
                    &ldquo;{activeArchetypeMeta.dialogue.onBreak[0]}&rdquo;
                  </p>
                </div>

                <div className="p-2 bg-void-card border border-arcade-border/60">
                  <span className="text-[9px] text-green-400 font-pixel block mb-0.5">ON TASK COMPLETED:</span>
                  <p className="italic text-gray-200 text-xs">
                    &ldquo;{activeArchetypeMeta.dialogue.onTaskComplete[0]}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- SECTION 2: 8 IMMERSIVE STUDY ENVIRONMENTS --- */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
          <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
            8 RETRO STUDY ENVIRONMENTS
          </span>
          <span className="text-[9px] text-gray-400 font-pixel">ACOUSTIC &amp; VISUAL SPACES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {STUDY_ENVIRONMENTS.map((env) => {
            const isSelected = selectedEnvironmentId === env.id;
            return (
              <div
                key={env.id}
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedEnvironmentId(env.id);
                  audioEngine.setAmbienceProfile(env.ambience);
                }}
                className={`p-3 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-arcade-cyan bg-cyan-950/40 text-arcade-cyan shadow-pixel-sm font-bold'
                    : 'border-arcade-border bg-void text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{env.icon}</span>
                  {isSelected && <span className="text-[9px] text-arcade-cyan font-pixel">ACTIVE</span>}
                </div>
                <div className="font-silkscreen text-xs text-white">{env.name}</div>
                <p className="text-[9px] text-gray-400 mt-1 leading-snug">{env.description}</p>
                <div className="text-[8px] text-arcade-gold font-pixel mt-2">
                  AUDIO: {env.ambience.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 3: USER CUSTOM COMPANIONS (IF ANY) --- */}
      {customTutors.length > 0 && (
        <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
          <span className="font-silkscreen text-xs text-arcade-gold uppercase">
            YOUR CRAFTED COMPANIONS ({customTutors.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {customTutors.map((ct) => {
              const isActive = isCurrentActive(ct.name, ct.id);
              return (
                <div key={ct.id} className="p-3 bg-void border border-arcade-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ct.avatar}</span>
                      <span className="font-bold text-xs text-white">{ct.name}</span>
                    </div>
                    {isActive ? (
                      <span className="px-2 py-0.5 bg-green-950 border border-green-500 text-green-300 font-pixel text-[8px]">
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelectCoreTutor(ct)}
                        className="pixel-btn px-2 py-0.5 text-[9px] text-arcade-gold"
                      >
                        SELECT
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 italic">&ldquo;{ct.quote}&rdquo;</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TUTOR SELECTION MODAL (POPULATED WITH ALL PRESETS) --- */}
      {/* ======================================================== */}
      {showSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-4xl w-full shadow-pixel max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-arcade-border">
              <div className="flex items-center gap-2">
                <span className="text-arcade-gold font-pixel text-xs">👥</span>
                <h3 className="font-silkscreen text-sm text-arcade-gold uppercase">
                  CHOOSE YOUR STUDY COMPANION
                </h3>
              </div>
              <button
                onClick={() => setShowSelectModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-arcade-border/50 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tutors by name, world, or archetype..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              <select
                value={rosterCategory}
                onChange={(e) => setRosterCategory(e.target.value)}
                className="bg-void border border-arcade-border px-2 py-1.5 text-gray-300 text-xs outline-none"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="CORE">5 Core Archetypes</option>
                <option value="Superheroes">Superheroes</option>
                <option value="Anime">Anime</option>
                <option value="Animated & Fantasy">Animated &amp; Fantasy</option>
                <option value="Cozy & Everyday">Cozy &amp; Everyday</option>
              </select>
            </div>

            {/* Tutor Cards Grid */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* 1. Core Archetypes Section */}
              {(rosterCategory === 'ALL' || rosterCategory === 'CORE') && (
                <div className="space-y-2">
                  <div className="text-[10px] font-pixel text-arcade-gold uppercase">
                    // 5 CORE RPG ARCHETYPES
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {CORE_TUTOR_PROFILES.filter((p) =>
                      p.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                      p.description.toLowerCase().includes(rosterSearch.toLowerCase())
                    ).map((profile) => {
                      const isActive = isCurrentActive(profile.name, profile.id);
                      return (
                        <div
                          key={profile.id}
                          className={`p-3 border flex flex-col justify-between transition-all ${
                            isActive
                              ? 'border-arcade-gold bg-amber-950/40 shadow-pixel-sm'
                              : 'border-arcade-border bg-void hover:border-gray-500'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-2xl">{profile.avatar}</span>
                              {isActive ? (
                                <span className="px-1.5 py-0.5 bg-green-950 border border-green-500 text-green-300 font-pixel text-[8px]">
                                  ✓ ACTIVE
                                </span>
                              ) : (
                                <span className="text-[8px] text-arcade-cyan font-pixel">
                                  {TUTOR_ARCHETYPES[profile.archetype].title}
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs text-white">{profile.name}</div>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                              {profile.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-arcade-border/50 flex items-center justify-between">
                            <span className="text-[9px] text-gray-500">{profile.preferredDuration}m preset</span>
                            {isActive ? (
                              <span className="text-arcade-gold text-[10px] font-bold">CURRENT</span>
                            ) : (
                              <button
                                onClick={() => handleSelectCoreTutor(profile)}
                                className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black uppercase"
                              >
                                SELECT
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Canon Character Roster (20 Companions) */}
              {(rosterCategory === 'ALL' || rosterCategory !== 'CORE') && (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-pixel text-arcade-cyan uppercase">
                    // 20 CANON WORLDS &amp; HEROES
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {CHARACTERS.filter((c) => {
                      const matchesSearch = c.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                        c.tagline.toLowerCase().includes(rosterSearch.toLowerCase());
                      const matchesCat = rosterCategory === 'ALL' || c.category === rosterCategory;
                      return matchesSearch && matchesCat;
                    }).map((char) => {
                      const isActive = isCurrentActive(char.name, char.id);
                      return (
                        <div
                          key={char.id}
                          className={`p-3 border flex flex-col justify-between transition-all ${
                            isActive
                              ? 'border-arcade-gold bg-amber-950/40 shadow-pixel-sm'
                              : 'border-arcade-border bg-void hover:border-gray-500'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-pixel text-[9px] text-arcade-gold">{char.index}</span>
                              {isActive ? (
                                <span className="px-1.5 py-0.5 bg-green-950 border border-green-500 text-green-300 font-pixel text-[8px]">
                                  ✓ ACTIVE
                                </span>
                              ) : (
                                <span className="text-[8px] text-gray-400 font-pixel truncate max-w-[120px]">
                                  {char.category}
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs text-white truncate">{char.name}</div>
                            <div className="text-[9px] text-arcade-cyan truncate mt-0.5">{char.universe}</div>
                            <p className="text-[10px] text-gray-400 mt-1 italic line-clamp-2">
                              {char.quote}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-arcade-border/50 flex items-center justify-between">
                            <span className="text-[9px] text-gray-500">{char.ambienceProfile.toUpperCase()} AUDIO</span>
                            {isActive ? (
                              <span className="text-arcade-gold text-[10px] font-bold">CURRENT</span>
                            ) : (
                              <button
                                onClick={() => handleSelectCanonCharacter(char)}
                                className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black uppercase"
                              >
                                SELECT
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Secondary Actions */}
            <div className="mt-3 pt-3 border-t border-arcade-border flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[10px] text-gray-400">
                Selected companion will be active on Timer, Dashboard &amp; Audio Engine.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowSelectModal(false);
                    setShowCreateModal(true);
                  }}
                  className="pixel-btn px-3 py-1 text-[10px] text-arcade-gold"
                >
                  + Craft Custom Tutor
                </button>
                <button
                  onClick={() => setShowSelectModal(false)}
                  className="pixel-btn px-3 py-1 text-[10px] text-gray-400 hover:text-white"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE CUSTOM TUTOR MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-md w-full shadow-pixel">
            <h3 className="font-silkscreen text-xs text-arcade-gold mb-3 uppercase">
              CREATE CUSTOM STUDY COMPANION (+50 XP)
            </h3>

            <form onSubmit={handleCreateCustomTutor} className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1">Companion Name *</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Master Thorne, Luna the Owl"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Archetype</label>
                  <select
                    value={customArchetype}
                    onChange={(e) => setCustomArchetype(e.target.value as RPGTutorArchetype)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    <option value="STRICT_MENTOR">Strict Mentor</option>
                    <option value="FRIENDLY_COMPANION">Friendly Companion</option>
                    <option value="CHILL_COMPANION">Chill Companion</option>
                    <option value="COMPETITIVE_COACH">Competitive Coach</option>
                    <option value="WISE_MENTOR">Wise Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Avatar Emoji</label>
                  <input
                    type="text"
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Tagline &amp; Atmosphere</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Midnight Library • Green Tea • Quiet Whispers"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Signature Motto / Quote</label>
                <input
                  type="text"
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  placeholder="e.g. Stay locked in. Mastery is a habit."
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1 text-black font-bold uppercase"
                >
                  SAVE &amp; SELECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
