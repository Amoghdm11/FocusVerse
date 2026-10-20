import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  BarChart2,
  Bookmark,
  Award,
  BookOpen,
  Sliders,
  Volume2,
  Play,
  Trash2,
  Copy,
  Edit3,
  Filter,
  ArrowRight,
  Heart,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { 
  RPGTutorArchetype, 
  StudySquad, 
  FocusPreset, 
  SubjectTutorAssignment, 
  TutorEcosystemProfile, 
  TutorAffinityRecord, 
  TutorChallenge, 
  TutorPerformanceStat, 
  TutorCosmeticUnlock,
  CustomTutorProfile 
} from '../types/rpg';
import { 
  TUTOR_ECOSYSTEM_PROFILES, 
  TUTOR_SPECIALTY_CATEGORIES, 
  TUTOR_COSMETIC_UNLOCKS,
  DEFAULT_STUDY_SQUADS,
  DEFAULT_FOCUS_PRESETS
} from '../data/tutorProfiles';
import { TUTOR_ARCHETYPES, CORE_TUTOR_PROFILES, STUDY_ENVIRONMENTS } from '../data/tutorArchetypes';
import { rpgStore } from '../utils/rpgStore';
import { Character } from '../types/character';
import { CHARACTERS } from '../data/characters';
import { audioEngine } from '../utils/audioEngine';
import { tutorDialogueService } from '../utils/tutorDialogueService';
import { FullBodyPixelSprite } from './FullBodyPixelSprite';
import { PixelFaceAvatar } from './PixelFaceAvatar';
import { getAppearanceForCharacter } from '../utils/pixelSpriteCompositor';

export type TutorsTab = 
  | 'ROSTER' 
  | 'SQUADS' 
  | 'PRESETS' 
  | 'SUBJECTS' 
  | 'AFFINITY' 
  | 'ANALYTICS' 
  | 'CORE_BUILDER';

interface TutorsViewProps {
  activeCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  onOpen3DStage: () => void;
  onStartFocusSession?: (char: Character) => void;
  onLaunchPreset?: (preset: FocusPreset) => void;
}

export const TutorsView: React.FC<TutorsViewProps> = ({
  activeCharacter,
  onSelectCharacter,
  onOpen3DStage,
  onStartFocusSession,
  onLaunchPreset,
}) => {
  const [activeTab, setActiveTab] = useState<TutorsTab>('ROSTER');

  // --- TAB 1: 2D ROSTER & PROFILES STATE ---
  const [selectedTutorId, setSelectedTutorId] = useState<string>(activeCharacter.id);
  const [spriteSpeechBubble, setSpriteSpeechBubble] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [sortMode, setSortMode] = useState<'INDEX' | 'NAME' | 'AFFINITY' | 'MINUTES'>('INDEX');

  // Quick Select Modal State (Preserved for header button)
  const [showSelectModal, setShowSelectModal] = useState(false);

  // --- TAB 2: STUDY SQUADS STATE ---
  const [squads, setSquads] = useState<StudySquad[]>(rpgStore.getStudySquads());
  const [activeSquad, setActiveSquadState] = useState<StudySquad | null>(rpgStore.getActiveSquad());
  const [editingSquad, setEditingSquad] = useState<StudySquad | null>(null);
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [squadDesc, setSquadDesc] = useState('');
  const [squadLead, setSquadLead] = useState('bruce-wayne');
  const [squadSupport1, setSquadSupport1] = useState('hermione-granger');
  const [squadSupport2, setSquadSupport2] = useState('gojo-satoru');
  const [squadSubject, setSquadSubject] = useState('Exam Preparation');

  // --- TAB 3: FOCUS PRESETS STATE ---
  const [presets, setPresets] = useState<FocusPreset[]>(rpgStore.getFocusPresets());
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<FocusPreset | null>(null);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');
  const [presetTutorId, setPresetTutorId] = useState('peter-parker');
  const [presetSubject, setPresetSubject] = useState('Mathematics');
  const [presetFocusMins, setPresetFocusMins] = useState(25);
  const [presetBreakMins, setPresetBreakMins] = useState(5);
  const [presetAmbience, setPresetAmbience] = useState('rain');

  // --- TAB 4: SUBJECT ASSIGNMENTS STATE ---
  const [assignments, setAssignments] = useState<SubjectTutorAssignment[]>(rpgStore.getSubjectAssignments());
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectTutor, setNewSubjectTutor] = useState('peter-parker');

  // --- TAB 5: AFFINITY & PROGRESSION STATE ---
  const [affinities, setAffinities] = useState<Record<string, TutorAffinityRecord>>(rpgStore.getAllTutorAffinities());
  const [cosmetics, setCosmetics] = useState<TutorCosmeticUnlock[]>(rpgStore.getTutorCosmetics());
  const [equippedCosmetics, setEquippedCosmetics] = useState(rpgStore.getActiveEquippedCosmetics());

  // --- TAB 6: ANALYTICS STATE ---
  const [analyticsRange, setAnalyticsRange] = useState<'ALL' | '7D' | '30D'>('ALL');
  const [analyticsSubject, setAnalyticsSubject] = useState('ALL');

  // --- TAB 7: CORE ARCHETYPES & CUSTOM BUILDER ---
  const [activeArchetypeTab, setActiveArchetypeTab] = useState<RPGTutorArchetype>('STRICT_MENTOR');
  const [customTutors, setCustomTutors] = useState<CustomTutorProfile[]>(rpgStore.getCustomTutors());
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>('bedroom');
  const [showCreateCustomModal, setShowCreateCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customArchetype, setCustomArchetype] = useState<RPGTutorArchetype>('FRIENDLY_COMPANION');
  const [customAvatar, setCustomAvatar] = useState('🦉');
  const [customTagline, setCustomTagline] = useState('Midnight Library • Calm Study');
  const [customQuote, setCustomQuote] = useState('Step by step, the summit is reached.');
  const [customDuration, setCustomDuration] = useState(30);

  // Sync state on events
  useEffect(() => {
    const handleUpdate = () => {
      setAffinities(rpgStore.getAllTutorAffinities());
      setCosmetics(rpgStore.getTutorCosmetics());
    };
    window.addEventListener('focusverse_tutor_affinity_up', handleUpdate);
    window.addEventListener('focusverse_xp_awarded', handleUpdate);
    return () => {
      window.removeEventListener('focusverse_tutor_affinity_up', handleUpdate);
      window.removeEventListener('focusverse_xp_awarded', handleUpdate);
    };
  }, []);

  // Currently selected tutor object
  const selectedCharacter = useMemo(() => {
    return CHARACTERS.find((c) => c.id === selectedTutorId) || activeCharacter;
  }, [selectedTutorId, activeCharacter]);

  const selectedProfile: TutorEcosystemProfile = useMemo(() => {
    return TUTOR_ECOSYSTEM_PROFILES[selectedCharacter.id] || TUTOR_ECOSYSTEM_PROFILES['peter-parker'];
  }, [selectedCharacter]);

  const selectedAffinity: TutorAffinityRecord = useMemo(() => {
    return affinities[selectedCharacter.id] || rpgStore.getTutorAffinity(selectedCharacter.id);
  }, [affinities, selectedCharacter]);

  const selectedChallenges: TutorChallenge[] = useMemo(() => {
    return rpgStore.getTutorChallenges(selectedCharacter.id);
  }, [selectedCharacter]);

  // Filter & Sort the 20 Characters
  const filteredCharacters = useMemo(() => {
    let result = CHARACTERS.filter((c) => {
      const profile = TUTOR_ECOSYSTEM_PROFILES[c.id];
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.archetypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile && profile.primarySpecialty.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesArchetype = 
        archetypeFilter === 'ALL' || (profile && profile.archetype === archetypeFilter);

      const matchesSpecialty = 
        specialtyFilter === 'ALL' || (profile && (profile.primarySpecialty === specialtyFilter || profile.secondarySpecialties.includes(specialtyFilter)));

      return matchesSearch && matchesArchetype && matchesSpecialty;
    });

    if (sortMode === 'NAME') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'AFFINITY') {
      result = [...result].sort((a, b) => {
        const affA = affinities[a.id]?.affinityLevel || 1;
        const affB = affinities[b.id]?.affinityLevel || 1;
        return affB - affA;
      });
    } else if (sortMode === 'MINUTES') {
      result = [...result].sort((a, b) => {
        const minA = affinities[a.id]?.totalMinutesFocused || 0;
        const minB = affinities[b.id]?.totalMinutesFocused || 0;
        return minB - minA;
      });
    }

    return result;
  }, [searchQuery, archetypeFilter, specialtyFilter, sortMode, affinities]);

  // Handlers
  const handleSelectTutor = (char: Character) => {
    audioEngine.playClick();
    onSelectCharacter(char);
    tutorDialogueService.triggerEvent('TUTOR_SELECTED', char.id);
    setSelectedTutorId(char.id);
    setShowSelectModal(false);
  };

  const handlePreviewDialogue = (eventKey: 'GREETING' | 'SESSION_START' | 'TASK_COMPLETE') => {
    audioEngine.playClick();
    tutorDialogueService.triggerEvent(eventKey, selectedCharacter.id);
  };

  // Squad Handlers
  const handleSaveSquad = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playVictoryJingle();

    if (editingSquad) {
      rpgStore.updateStudySquad(editingSquad.id, {
        name: squadName,
        description: squadDesc,
        leadTutorId: squadLead,
        supportTutorIds: [squadSupport1, squadSupport2].filter((id) => id !== squadLead),
        purposeSubject: squadSubject,
      });
    } else {
      rpgStore.addStudySquad({
        name: squadName || 'New Study Squad',
        description: squadDesc || 'Custom assembled focus squad',
        leadTutorId: squadLead,
        supportTutorIds: [squadSupport1, squadSupport2].filter((id) => id !== squadLead),
        purposeSubject: squadSubject,
        preferredTimerDuration: 35,
        preferredBreakDuration: 7,
      });
    }

    setSquads(rpgStore.getStudySquads());
    setShowSquadModal(false);
    setEditingSquad(null);
  };

  const handleDeleteSquad = (id: string) => {
    if (window.confirm('Delete this study squad?')) {
      audioEngine.playClick();
      rpgStore.deleteStudySquad(id);
      setSquads(rpgStore.getStudySquads());
    }
  };

  const handleLaunchSquadSession = (squad: StudySquad) => {
    audioEngine.playClick();
    rpgStore.setActiveSquad(squad.id);
    setActiveSquadState(squad);
    const leadChar = CHARACTERS.find((c) => c.id === squad.leadTutorId) || CHARACTERS[0];
    onSelectCharacter(leadChar);
    if (onStartFocusSession) {
      onStartFocusSession(leadChar);
    }
  };

  // Preset Handlers
  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playVictoryJingle();

    if (editingPreset) {
      rpgStore.updateFocusPreset(editingPreset.id, {
        name: presetName,
        description: presetDesc,
        tutorId: presetTutorId,
        subject: presetSubject,
        focusMinutes: Number(presetFocusMins) || 25,
        shortBreakMinutes: Number(presetBreakMins) || 5,
        ambienceProfile: presetAmbience,
      });
    } else {
      rpgStore.addFocusPreset({
        name: presetName || 'Custom Preset',
        description: presetDesc || 'Tailored focus preset',
        tutorId: presetTutorId,
        subject: presetSubject,
        focusMinutes: Number(presetFocusMins) || 25,
        shortBreakMinutes: Number(presetBreakMins) || 5,
        longBreakMinutes: 15,
        environmentId: 'bedroom',
        ambienceProfile: presetAmbience,
        isFavorite: false,
      });
    }

    setPresets(rpgStore.getFocusPresets());
    setShowPresetModal(false);
    setEditingPreset(null);
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm('Delete this focus preset?')) {
      audioEngine.playClick();
      rpgStore.deleteFocusPreset(id);
      setPresets(rpgStore.getFocusPresets());
    }
  };

  const handleLaunchPresetSession = (preset: FocusPreset) => {
    audioEngine.playClick();
    const char = CHARACTERS.find((c) => c.id === preset.tutorId) || CHARACTERS[0];
    onSelectCharacter(char);
    if (onLaunchPreset) {
      onLaunchPreset(preset);
    } else if (onStartFocusSession) {
      onStartFocusSession(char);
    }
  };

  // Subject Assignment Handlers
  const handleAssignSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    audioEngine.playClick();
    rpgStore.assignTutorToSubject(newSubjectName.trim(), newSubjectTutor);
    setAssignments(rpgStore.getSubjectAssignments());
    setNewSubjectName('');
  };

  // Cosmetic Equip Handler
  const handleEquipCosmetic = (cosm: TutorCosmeticUnlock) => {
    audioEngine.playVictoryJingle();
    const type = cosm.type === 'NAMEPLATE' ? 'nameplate' : 'profileFrame';
    rpgStore.equipCosmetic(cosm.title, type);
    setEquippedCosmetics(rpgStore.getActiveEquippedCosmetics());
    alert(`Equipped ${cosm.title}!`);
  };

  // Analytics Computation
  const analyticsData = useMemo(() => {
    return rpgStore.getTutorAnalytics({
      dateRange: analyticsRange,
      subject: analyticsSubject,
    });
  }, [analyticsRange, analyticsSubject]);

  // Affinity Level Helper
  const getAffinityBadge = (lvl: number) => {
    switch (lvl) {
      case 5:
        return { title: 'Synergy Legend', color: 'text-amber-400 border-amber-400 bg-amber-950/70', stars: '★★★★★' };
      case 4:
        return { title: 'Master Scholar', color: 'text-purple-400 border-purple-400 bg-purple-950/70', stars: '★★★★☆' };
      case 3:
        return { title: 'Trusted Mentor', color: 'text-arcade-cyan border-arcade-cyan bg-cyan-950/70', stars: '★★★☆☆' };
      case 2:
        return { title: 'Study Partner', color: 'text-green-400 border-green-400 bg-green-950/70', stars: '★★☆☆☆' };
      case 1:
      default:
        return { title: 'New Acquaintance', color: 'text-gray-400 border-gray-500 bg-void-card', stars: '★☆☆☆☆' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* ======================================================== */}
      {/* --- TOP HEADER & PRIMARY WORKFLOW ACTIONS --- */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-arcade-gold flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            👥
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              TUTOR ECOSYSTEM &amp; STUDY COMPANIONS
            </h1>
            <p className="text-[10px] text-gray-400">
              Active Tutor: <span className="text-arcade-gold font-bold">{activeCharacter.name}</span> // 20 Tutors • 2D Sprites • Personalities • Squads • Affinity
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

          {/* Sprite Locker & Roster Stage Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpen3DStage();
            }}
            className="pixel-btn px-3 py-1.5 text-xs text-arcade-cyan hover:text-white flex items-center gap-1.5"
            title="Open Suit Locker & 2D Sprite Customizer"
          >
            <Sparkles size={13} className="text-arcade-cyan" />
            <span>SPRITE ROSTER (20)</span>
          </button>

          {/* Start Focus with Active Companion */}
          {onStartFocusSession && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onStartFocusSession(activeCharacter);
              }}
              className="pixel-btn px-3 py-1.5 text-xs text-arcade-gold hover:text-white flex items-center gap-1.5"
            >
              <Play size={12} fill="currentColor" />
              <span>START STUDY ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* --- CURRENT ACTIVE TUTOR SPOTLIGHT BANNER --- */}
      {/* ======================================================== */}
      <div className="bg-void-card pixel-border border-arcade-gold p-4 shadow-pixel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-void border-2 border-arcade-gold flex items-center justify-center shadow-pixel-sm shrink-0 overflow-hidden">
            <PixelFaceAvatar
              characterId={activeCharacter.id}
              size={44}
              className="w-11 h-11"
              title={activeCharacter.name}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-pixel text-[9px] text-arcade-gold uppercase">CURRENTLY ACTIVE COMPANION</span>
              <span className="px-1.5 py-0.5 bg-green-950/80 border border-green-500 text-green-300 font-pixel text-[8px]">
                ● ACTIVE
              </span>
              {(() => {
                const aff = affinities[activeCharacter.id] || { affinityLevel: 1 };
                const badge = getAffinityBadge(aff.affinityLevel);
                return (
                  <span className={`px-1.5 py-0.5 border font-pixel text-[8px] ${badge.color}`}>
                    {badge.stars} {badge.title.toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <h2 className="font-silkscreen text-base text-white mt-0.5">{activeCharacter.name}</h2>
            <p className="text-[10px] text-gray-400 italic">&ldquo;{activeCharacter.quote}&rdquo;</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePreviewDialogue('GREETING')}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan hover:text-white flex items-center gap-1"
            title="Hear greeting dialogue"
          >
            <MessageSquare size={12} />
            <span>SAY HELLO</span>
          </button>
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
        </div>
      </div>

      {/* ======================================================== */}
      {/* --- ECOSYSTEM NAVIGATION TABS (7 DEDICATED SECTIONS) --- */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 border-b border-arcade-border pb-2 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'ROSTER', label: '2D ROSTER & PROFILES', icon: <Layers size={13} /> },
          { id: 'SQUADS', label: 'STUDY SQUADS (3)', icon: <Users size={13} /> },
          { id: 'PRESETS', label: 'FOCUS PRESETS', icon: <Bookmark size={13} /> },
          { id: 'SUBJECTS', label: 'SUBJECT MAPPING', icon: <Compass size={13} /> },
          { id: 'AFFINITY', label: 'AFFINITY & PROGRESSION', icon: <Heart size={13} /> },
          { id: 'ANALYTICS', label: 'TUTOR ANALYTICS', icon: <BarChart2 size={13} /> },
          { id: 'CORE_BUILDER', label: 'CORE & CUSTOM BUILDER', icon: <Sliders size={13} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              audioEngine.playClick();
              setActiveTab(tab.id as TutorsTab);
            }}
            className={`px-3 py-1.5 font-silkscreen text-[11px] uppercase border flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === tab.id
                ? 'border-arcade-gold bg-amber-950/70 text-arcade-gold font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* --- TAB 1: 3D ROSTER & PROFILES (ALL 20 TUTORS) --- */}
      {/* ======================================================== */}
      {activeTab === 'ROSTER' && (
        <div className="space-y-4">
          {/* Search, Filter & Sort Controls */}
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-2.5 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by tutor name, archetype, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
              />
            </div>

            {/* Archetype Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500">ARCHETYPE:</span>
              <select
                value={archetypeFilter}
                onChange={(e) => setArchetypeFilter(e.target.value)}
                className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
              >
                <option value="ALL">All Archetypes</option>
                <option value="STRICT_MENTOR">Strict Mentor</option>
                <option value="FRIENDLY_COMPANION">Friendly Companion</option>
                <option value="CHILL_COMPANION">Chill Companion</option>
                <option value="COMPETITIVE_COACH">Competitive Coach</option>
                <option value="WISE_MENTOR">Wise Mentor</option>
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500">SPECIALTY:</span>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
              >
                <option value="ALL">All Specialties</option>
                {TUTOR_SPECIALTY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500">SORT:</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
                className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
              >
                <option value="INDEX">Roster Index (01-20)</option>
                <option value="NAME">Name (A-Z)</option>
                <option value="AFFINITY">Affinity Level (High to Low)</option>
                <option value="MINUTES">Most Studied Minutes</option>
              </select>
            </div>
          </div>

          {/* Main 2-Column Layout: Left (20 Cards Grid) | Right (Interactive 3D Stage & Deep Profile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Columns: 20 Tutor Cards Grid */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-arcade-border/50 text-[10px]">
                <span className="font-pixel text-arcade-gold uppercase">
                  AVAILABLE 2D ROSTER ({filteredCharacters.length} OF 20)
                </span>
                <span className="text-gray-400">Click to inspect 2D sprite &amp; loadout</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[750px] overflow-y-auto pr-1">
                {filteredCharacters.map((char) => {
                  const prof = TUTOR_ECOSYSTEM_PROFILES[char.id];
                  const aff = affinities[char.id] || { affinityLevel: 1, totalMinutesFocused: 0 };
                  const badge = getAffinityBadge(aff.affinityLevel);
                  const isCurrent = char.id === activeCharacter.id;
                  const isSelectedForInspect = char.id === selectedCharacter.id;

                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedTutorId(char.id);
                      }}
                      className={`p-3 border cursor-pointer flex flex-col justify-between transition-all ${
                        isSelectedForInspect
                          ? 'border-arcade-gold bg-[#1F1735]/80 shadow-pixel ring-1 ring-arcade-gold'
                          : 'border-arcade-border bg-void hover:border-gray-500'
                      }`}
                    >
                      <div>
                        {/* Top index and active badge */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <PixelFaceAvatar
                              characterId={char.id}
                              size={20}
                              className="w-5 h-5 border border-arcade-border"
                              title={char.name}
                            />
                            <span className="font-pixel text-[9px] text-arcade-gold">{char.index}</span>
                          </div>
                          {isCurrent ? (
                            <span className="px-1.5 py-0.5 bg-green-950 border border-green-500 text-green-300 font-pixel text-[8px]">
                              ✓ ACTIVE
                            </span>
                          ) : (
                            <span className="text-[8px] text-gray-400 font-pixel truncate">
                              {char.category}
                            </span>
                          )}
                        </div>

                        {/* Name & Archetype */}
                        <div className="font-bold text-xs text-white truncate">{char.name}</div>
                        <div className="text-[9px] text-arcade-cyan font-pixel mt-0.5 truncate">
                          {char.archetypeName}
                        </div>

                        {/* Primary Specialty Tag */}
                        {prof && (
                          <div className="mt-2 inline-block px-1.5 py-0.5 bg-void border border-arcade-border text-[9px] text-gray-300">
                            🎯 {prof.primarySpecialty}
                          </div>
                        )}

                        <p className="text-[10px] text-gray-400 mt-1.5 italic line-clamp-2">
                          {char.quote}
                        </p>
                      </div>

                      {/* Card Footer: Affinity level & Action */}
                      <div className="mt-3 pt-2 border-t border-arcade-border/50 flex items-center justify-between">
                        <span className={`text-[8px] font-pixel ${badge.color} px-1 py-0.5 border`}>
                          LVL {aff.affinityLevel} ({aff.totalMinutesFocused}m)
                        </span>

                        {isCurrent ? (
                          <span className="text-arcade-gold font-pixel text-[9px]">SELECTED</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTutor(char);
                            }}
                            className="pixel-btn-primary px-2.5 py-0.5 text-[9px] font-pixel text-black uppercase"
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

            {/* Right 5 Columns: Interactive 2D Sprite Stage & Deep Profile */}
            <div className="lg:col-span-5 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                <div>
                  <span className="font-pixel text-[9px] text-arcade-cyan uppercase">
                    2D SPRITE LOADOUT &amp; PROFILE
                  </span>
                  <h3 className="font-silkscreen text-sm text-white mt-0.5">{selectedCharacter.name}</h3>
                </div>

                {selectedCharacter.id === activeCharacter.id ? (
                  <span className="px-2 py-0.5 bg-green-950 border border-green-500 text-green-300 font-pixel text-[8px]">
                    ✓ CURRENT ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => handleSelectTutor(selectedCharacter)}
                    className="pixel-btn-primary px-3 py-1 text-xs font-pixel text-black uppercase"
                  >
                    MAKE ACTIVE
                  </button>
                )}
              </div>

              {/* Interactive 2D Pixel Sprite Stage on Holographic Pedestal */}
              <div className="relative w-full h-72 bg-[#090714] border-2 border-[#241E3E] overflow-hidden flex flex-col items-center justify-center group select-none shadow-[inset_0_0_24px_rgba(0,0,0,0.85)]">
                {/* Sci-Fi Holographic Void & Grid Background */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <div
                    className="absolute inset-0 opacity-45 transition-colors duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 60%, ${selectedCharacter.palette?.borderPrimary || '#F5C242'}26 0%, transparent 70%)`
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(#261F45_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
                </div>

                {/* Speech Bubble on click / greeting */}
                {spriteSpeechBubble && (
                  <div className="absolute top-3 px-3 py-1.5 bg-[#0E0B1C]/95 border-2 border-arcade-gold text-arcade-gold font-pixel text-[10px] shadow-[0_0_20px_rgba(245,194,66,0.4)] animate-fadeIn max-w-[280px] text-center z-20">
                    &gt; &quot;{spriteSpeechBubble}&quot;
                  </div>
                )}

                {/* 2D Sprite on Holographic Pedestal */}
                <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                  <FullBodyPixelSprite
                    appearance={getAppearanceForCharacter(selectedCharacter)}
                    size={220}
                    showPlatform={true}
                    platformColor={selectedCharacter.palette?.borderPrimary || '#F5C242'}
                    animated={true}
                    onClick={() => {
                      audioEngine.playClick();
                      audioEngine.playVictoryJingle(selectedCharacter.synthNotes);
                      handlePreviewDialogue('GREETING');
                      setSpriteSpeechBubble(`"${selectedCharacter.quote}"`);
                      setTimeout(() => setSpriteSpeechBubble(null), 3500);
                    }}
                    title={`Click ${selectedCharacter.name} for focus melody & quote`}
                  />
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="absolute bottom-2 left-2 bg-black/85 px-2 py-0.5 text-[8px] font-pixel text-arcade-cyan border border-arcade-border/60 flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 bg-arcade-cyan animate-pulse rounded-full" />
                  <span>2D SPRITE // 64×96 NATIVE RESOLUTION</span>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/85 px-2 py-0.5 text-[8px] font-mono text-gray-400 border border-arcade-border/60 z-10 hidden sm:block">
                  CLICK SPRITE FOR MELODY
                </div>
              </div>

              {/* Personality Archetype & Communication Style */}
              <div className="p-3 bg-void border border-arcade-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-arcade-gold font-pixel">ARCHETYPE:</span>
                  <span className="font-bold text-xs text-white">
                    {TUTOR_ARCHETYPES[selectedProfile.archetype]?.title || selectedProfile.archetype}
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 leading-relaxed">
                  <span className="text-gray-500">STYLE:</span> {selectedProfile.communicationStyle}
                </div>
                <div className="text-[10px] text-gray-300 leading-relaxed">
                  <span className="text-gray-500">ENCOURAGEMENT:</span> {selectedProfile.encouragementStyle}
                </div>
              </div>

              {/* Specialties & Suggested Timings */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 bg-void border border-arcade-border">
                  <span className="text-gray-500 block mb-1">PRIMARY SPECIALTY</span>
                  <span className="font-bold text-arcade-cyan">{selectedProfile.primarySpecialty}</span>
                  <div className="text-[9px] text-gray-400 mt-1">
                    Secondary: {selectedProfile.secondarySpecialties.join(', ')}
                  </div>
                </div>

                <div className="p-2.5 bg-void border border-arcade-border">
                  <span className="text-gray-500 block mb-1">RECOMMENDED SESSIONS</span>
                  <span className="font-bold text-arcade-gold">{selectedProfile.suggestedDuration}m Focus</span>
                  <div className="text-[9px] text-gray-400 mt-1">
                    Break: {selectedProfile.suggestedBreak}m • {selectedProfile.difficultyPreference}
                  </div>
                </div>
              </div>

              {/* Dialogue Sampler */}
              <div className="p-3 bg-void border border-arcade-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-pixel">DIALOGUE SAMPLER</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePreviewDialogue('GREETING')}
                      className="px-1.5 py-0.5 border border-arcade-border text-[9px] hover:text-white"
                      title="Sample Greeting"
                    >
                      Hello
                    </button>
                    <button
                      onClick={() => handlePreviewDialogue('SESSION_START')}
                      className="px-1.5 py-0.5 border border-arcade-border text-[9px] hover:text-white"
                      title="Sample Start Sprint"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handlePreviewDialogue('TASK_COMPLETE')}
                      className="px-1.5 py-0.5 border border-arcade-border text-[9px] hover:text-white"
                      title="Sample Task Complete"
                    >
                      Task Checked
                    </button>
                  </div>
                </div>
                <p className="italic text-gray-300 text-[10px] leading-relaxed">
                  &ldquo;{selectedProfile.dialogue.greetings[0]}&rdquo;
                </p>
              </div>

              {/* Tailored Tutor Challenges */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-arcade-gold font-pixel uppercase">
                  TUTOR-SPECIFIC CHALLENGES ({selectedChallenges.length})
                </span>
                <div className="space-y-1.5">
                  {selectedChallenges.map((chal) => (
                    <div
                      key={chal.id}
                      className="p-2 bg-void border border-arcade-border text-[10px] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {chal.completed ? <Check size={11} className="text-green-400" /> : <Target size={11} className="text-arcade-gold" />}
                          <span>{chal.title}</span>
                        </div>
                        <p className="text-[9px] text-gray-400">{chal.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-arcade-gold font-bold">+{chal.xpReward} XP</span>
                        <div className="text-[8px] text-gray-500">
                          {chal.completed ? 'COMPLETED' : `${chal.progress}/${chal.target}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 2: STUDY SQUADS (CONFIGURABLE 3-TUTOR TEAMS) --- */}
      {/* ======================================================== */}
      {activeTab === 'SQUADS' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase">
                STUDY SQUADS (UP TO 3 TUTORS)
              </h3>
              <p className="text-[10px] text-gray-400">
                Assemble a lead tutor with supporting specialists for complex exam cramming, coding, or memory sprints.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingSquad(null);
                setSquadName('');
                setSquadDesc('');
                setSquadLead('bruce-wayne');
                setSquadSupport1('hermione-granger');
                setSquadSupport2('gojo-satoru');
                setSquadSubject('Exam Preparation');
                setShowSquadModal(true);
              }}
              className="pixel-btn-primary px-3 py-1 text-xs font-pixel flex items-center gap-1 text-black uppercase"
            >
              <Plus size={12} />
              <span>NEW SQUAD</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {squads.map((squad) => {
              const leadChar = CHARACTERS.find((c) => c.id === squad.leadTutorId) || CHARACTERS[0];
              const sup1 = CHARACTERS.find((c) => c.id === squad.supportTutorIds[0]);
              const sup2 = CHARACTERS.find((c) => c.id === squad.supportTutorIds[1]);
              const isActiveSquad = activeSquad?.id === squad.id;

              return (
                <div
                  key={squad.id}
                  className={`p-4 border bg-void-card flex flex-col justify-between space-y-3 transition-all ${
                    isActiveSquad ? 'border-arcade-cyan shadow-pixel' : 'border-arcade-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                      <div className="flex items-center gap-2">
                        <span className="font-silkscreen text-xs text-white">{squad.name}</span>
                        {isActiveSquad && (
                          <span className="px-1.5 py-0.5 bg-cyan-950 border border-arcade-cyan text-arcade-cyan font-pixel text-[8px]">
                            ACTIVE SQUAD
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-arcade-gold font-pixel">
                        {squad.purposeSubject || 'General'}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2">{squad.description}</p>

                    {/* Squad Members Avatars */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {/* Lead */}
                      <div className="p-2 bg-void border border-arcade-gold/80 text-center">
                        <span className="text-[8px] font-pixel text-arcade-gold block">LEAD TUTOR</span>
                        <div className="text-xl my-1">{leadChar.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}</div>
                        <div className="font-bold text-[10px] text-white truncate">{leadChar.name}</div>
                      </div>

                      {/* Support 1 */}
                      {sup1 ? (
                        <div className="p-2 bg-void border border-arcade-border text-center">
                          <span className="text-[8px] font-pixel text-arcade-cyan block">SUPPORT 1</span>
                          <div className="text-xl my-1">{sup1.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}</div>
                          <div className="font-bold text-[10px] text-white truncate">{sup1.name}</div>
                        </div>
                      ) : (
                        <div className="p-2 bg-void border border-dashed border-arcade-border text-center text-gray-500 text-[9px] flex items-center justify-center">
                          (Empty)
                        </div>
                      )}

                      {/* Support 2 */}
                      {sup2 ? (
                        <div className="p-2 bg-void border border-arcade-border text-center">
                          <span className="text-[8px] font-pixel text-arcade-cyan block">SUPPORT 2</span>
                          <div className="text-xl my-1">{sup2.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}</div>
                          <div className="font-bold text-[10px] text-white truncate">{sup2.name}</div>
                        </div>
                      ) : (
                        <div className="p-2 bg-void border border-dashed border-arcade-border text-center text-gray-500 text-[9px] flex items-center justify-center">
                          (Empty)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-arcade-border flex items-center justify-between text-xs">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingSquad(squad);
                          setSquadName(squad.name);
                          setSquadDesc(squad.description);
                          setSquadLead(squad.leadTutorId);
                          setSquadSupport1(squad.supportTutorIds[0] || 'hermione-granger');
                          setSquadSupport2(squad.supportTutorIds[1] || 'gojo-satoru');
                          setSquadSubject(squad.purposeSubject || 'General');
                          setShowSquadModal(true);
                        }}
                        className="p-1 border border-arcade-border text-gray-400 hover:text-white"
                        title="Edit squad"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        onClick={() => handleDeleteSquad(squad.id)}
                        className="p-1 border border-arcade-border text-gray-400 hover:text-red-400"
                        title="Delete squad"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleLaunchSquadSession(squad)}
                      className="pixel-btn px-3 py-1 text-arcade-cyan hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>LAUNCH SQUAD SPRINT ➔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 3: FOCUS PRESETS (REUSABLE CONFIGURATIONS) --- */}
      {/* ======================================================== */}
      {activeTab === 'PRESETS' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-silkscreen text-xs text-arcade-gold uppercase">
                REUSABLE FOCUS PRESETS
              </h3>
              <p className="text-[10px] text-gray-400">
                Pre-configured study recipes combining selected tutor, subject, focus duration, break times, and ambience.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingPreset(null);
                setPresetName('');
                setPresetDesc('');
                setPresetTutorId('peter-parker');
                setPresetSubject('Mathematics');
                setPresetFocusMins(25);
                setPresetBreakMins(5);
                setPresetAmbience('rain');
                setShowPresetModal(true);
              }}
              className="pixel-btn-primary px-3 py-1 text-xs font-pixel flex items-center gap-1 text-black uppercase"
            >
              <Plus size={12} />
              <span>NEW PRESET</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => {
              const tutor = CHARACTERS.find((c) => c.id === preset.tutorId) || CHARACTERS[0];
              return (
                <div
                  key={preset.id}
                  className="p-4 border border-arcade-border bg-void-card flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            rpgStore.toggleFavoritePreset(preset.id);
                            setPresets(rpgStore.getFocusPresets());
                          }}
                          className={preset.isFavorite ? 'text-arcade-gold' : 'text-gray-600'}
                          title="Favorite preset"
                        >
                          <Star size={12} fill={preset.isFavorite ? '#F5C242' : 'none'} />
                        </button>
                        <span className="font-silkscreen text-xs text-white">{preset.name}</span>
                      </div>
                      <span className="text-[9px] text-arcade-cyan font-pixel">{preset.subject}</span>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2">{preset.description}</p>

                    {/* Preset Badges */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                      <div className="p-1.5 bg-void border border-arcade-border">
                        <span className="text-[8px] text-gray-500 block">TUTOR</span>
                        <span className="font-bold text-arcade-gold truncate block">{tutor.name}</span>
                      </div>
                      <div className="p-1.5 bg-void border border-arcade-border">
                        <span className="text-[8px] text-gray-500 block">FOCUS</span>
                        <span className="font-bold text-white">{preset.focusMinutes}m</span>
                      </div>
                      <div className="p-1.5 bg-void border border-arcade-border">
                        <span className="text-[8px] text-gray-500 block">BREAK</span>
                        <span className="font-bold text-white">{preset.shortBreakMinutes}m</span>
                      </div>
                      <div className="p-1.5 bg-void border border-arcade-border">
                        <span className="text-[8px] text-gray-500 block">AMBIENCE</span>
                        <span className="font-bold text-arcade-cyan uppercase">{preset.ambienceProfile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-arcade-border flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPreset(preset);
                          setPresetName(preset.name);
                          setPresetDesc(preset.description);
                          setPresetTutorId(preset.tutorId);
                          setPresetSubject(preset.subject);
                          setPresetFocusMins(preset.focusMinutes);
                          setPresetBreakMins(preset.shortBreakMinutes);
                          setPresetAmbience(preset.ambienceProfile);
                          setShowPresetModal(true);
                        }}
                        className="p-1 border border-arcade-border text-gray-400 hover:text-white"
                        title="Edit preset"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="p-1 border border-arcade-border text-gray-400 hover:text-red-400"
                        title="Delete preset"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleLaunchPresetSession(preset)}
                      className="pixel-btn-primary px-3 py-1 text-black font-pixel text-[10px] flex items-center gap-1 uppercase"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>START PRESET SESSION ➔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 4: SUBJECT MAPPING & ASSIGNMENTS --- */}
      {/* ======================================================== */}
      {activeTab === 'SUBJECTS' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase">
                SUBJECT-TO-TUTOR MAPPING
              </h3>
              <p className="text-[10px] text-gray-400">
                Assign specialized tutors to different study domains. When launching a linked task, FocusVerse will recommend your chosen specialist.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Existing Subject Assignments Table (8 cols) */}
            <div className="md:col-span-8 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
              <span className="font-pixel text-[10px] text-arcade-gold uppercase">
                CONFIGURED SUBJECT SPECIALISTS ({assignments.length})
              </span>

              <div className="space-y-2">
                {assignments.map((item) => {
                  const tutor = CHARACTERS.find((c) => c.id === item.tutorId) || CHARACTERS[0];
                  const profile = TUTOR_ECOSYSTEM_PROFILES[tutor.id];

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-void border border-arcade-border flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-silkscreen text-xs text-white">{item.subject}</div>
                        <div className="text-[9px] text-arcade-cyan mt-0.5">
                          Specialty: {profile?.primarySpecialty || 'General'}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tutor.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}</span>
                          <span className="font-bold text-xs text-arcade-gold">{tutor.name}</span>
                        </div>

                        <select
                          value={item.tutorId}
                          onChange={(e) => {
                            rpgStore.assignTutorToSubject(item.subject, e.target.value);
                            setAssignments(rpgStore.getSubjectAssignments());
                          }}
                          className="bg-void-card border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
                        >
                          {CHARACTERS.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New Subject Form (4 cols) */}
            <div className="md:col-span-4 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
              <span className="font-pixel text-[10px] text-arcade-cyan uppercase">
                + MAP NEW SUBJECT
              </span>

              <form onSubmit={handleAssignSubject} className="space-y-3">
                <div>
                  <label className="text-gray-400 block mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures, Japanese, Organic Chem"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-cyan"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Assigned Tutor Specialist</label>
                  <select
                    value={newSubjectTutor}
                    onChange={(e) => setNewSubjectTutor(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    {CHARACTERS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="pixel-btn-primary w-full py-2 font-pixel text-xs text-black uppercase"
                >
                  SAVE ASSIGNMENT
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 5: TUTOR AFFINITY & PROGRESSION --- */}
      {/* ======================================================== */}
      {activeTab === 'AFFINITY' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border">
            <h3 className="font-silkscreen text-xs text-arcade-gold uppercase">
              TUTOR AFFINITY &amp; COSMETIC UNLOCKS
            </h3>
            <p className="text-[10px] text-gray-400">
              Track your dedicated study hours with all 20 tutors. Unlock special dialogue lines and retro nameplates through sustained focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHARACTERS.map((char) => {
              const aff = affinities[char.id] || {
                affinityLevel: 1,
                affinityXp: 0,
                nextLevelAffinityXp: 50,
                totalMinutesFocused: 0,
                sessionsCompleted: 0,
                challengesCompleted: [],
              };
              const badge = getAffinityBadge(aff.affinityLevel);
              const progressPct = Math.min(100, Math.round((aff.affinityXp / aff.nextLevelAffinityXp) * 100));

              return (
                <div
                  key={char.id}
                  className="p-4 bg-void-card border border-arcade-border space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-void border border-arcade-gold flex items-center justify-center text-xl shadow-pixel-sm">
                        {char.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}
                      </div>
                      <div>
                        <div className="font-silkscreen text-xs text-white">{char.name}</div>
                        <span className={`text-[8px] font-pixel px-1.5 py-0.5 border ${badge.color}`}>
                          {badge.stars} {badge.title.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-pixel text-[9px] text-arcade-gold">
                        {aff.totalMinutesFocused} MINS
                      </span>
                      <div className="text-[8px] text-gray-500">
                        {aff.sessionsCompleted} SESSIONS
                      </div>
                    </div>
                  </div>

                  {/* Affinity Level Bar */}
                  <div>
                    <div className="flex justify-between text-[8px] font-pixel text-gray-400 mb-1">
                      <span>AFFINITY PROGRESS</span>
                      <span>{aff.affinityXp} / {aff.nextLevelAffinityXp} XP ({progressPct}%)</span>
                    </div>
                    <div className="w-full bg-void h-2 border border-arcade-border overflow-hidden">
                      <div
                        className="bg-arcade-gold h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Cosmetics Unlocked For This Tutor */}
                  <div className="pt-2 border-t border-arcade-border/50">
                    <span className="text-[8px] font-pixel text-gray-400 block mb-1.5">
                      AFFINITY REWARDS:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cosmetics
                        .filter((c) => c.tutorId === char.id)
                        .map((cosm) => (
                          <div
                            key={cosm.id}
                            className={`px-2 py-1 border text-[9px] flex items-center gap-1 ${
                              cosm.unlocked
                                ? 'border-arcade-cyan bg-cyan-950/40 text-arcade-cyan'
                                : 'border-arcade-border/50 text-gray-600 opacity-60'
                            }`}
                          >
                            <span>{cosm.icon}</span>
                            <span>{cosm.title}</span>
                            {cosm.unlocked && (
                              <button
                                onClick={() => handleEquipCosmetic(cosm)}
                                className="ml-1 text-arcade-gold hover:underline font-bold"
                              >
                                [EQUIP]
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 6: TUTOR ANALYTICS (REAL SESSION METRICS) --- */}
      {/* ======================================================== */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase">
                TUTOR PERFORMANCE &amp; STUDY ANALYTICS
              </h3>
              <p className="text-[10px] text-gray-400">
                Objective analysis derived strictly from your real completed focus records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-500">RANGE:</span>
                <select
                  value={analyticsRange}
                  onChange={(e) => setAnalyticsRange(e.target.value as any)}
                  className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
                >
                  <option value="ALL">All Time</option>
                  <option value="30D">Past 30 Days</option>
                  <option value="7D">Past 7 Days</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-500">SUBJECT:</span>
                <select
                  value={analyticsSubject}
                  onChange={(e) => setAnalyticsSubject(e.target.value)}
                  className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-xs outline-none"
                >
                  <option value="ALL">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Programming">Programming</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="General Study">General Study</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comparative Analytics Table */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
            <span className="font-pixel text-[10px] text-arcade-gold uppercase">
              // TELEMETRY COMPARISON TABLE
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-arcade-border text-[9px] text-gray-500 font-pixel">
                    <th className="py-2 px-2">TUTOR COMPANION</th>
                    <th className="py-2 px-2">TOTAL MINUTES</th>
                    <th className="py-2 px-2">SESSIONS</th>
                    <th className="py-2 px-2">AVG DURATION</th>
                    <th className="py-2 px-2">COMPLETION RATE</th>
                    <th className="py-2 px-2">TOP SUBJECT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-arcade-border/40">
                  {analyticsData.map((stat) => (
                    <tr key={stat.tutorId} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 px-2 font-bold text-white flex items-center gap-2">
                        <span>👾</span>
                        <span>{stat.tutorName}</span>
                      </td>
                      <td className="py-2 px-2 text-arcade-gold font-bold">{stat.totalMinutes}m</td>
                      <td className="py-2 px-2 text-gray-300">{stat.totalSessions}</td>
                      <td className="py-2 px-2 text-gray-300">{stat.averageSessionMinutes}m</td>
                      <td className="py-2 px-2">
                        <span className={`px-1.5 py-0.5 border text-[9px] ${
                          stat.completionRate >= 80 ? 'border-green-500 text-green-300' : 'border-arcade-border text-gray-400'
                        }`}>
                          {stat.completionRate}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-arcade-cyan">{stat.mostStudiedSubject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {analyticsData.every((s) => s.totalMinutes === 0) && (
              <div className="p-8 text-center text-gray-500 border border-dashed border-arcade-border/60">
                <p className="font-silkscreen text-xs text-gray-400 mb-1">NO TELEMETRY RECORDED FOR THIS WINDOW</p>
                <p className="text-[10px]">Complete focus sessions with any tutor to begin populating real comparative performance data.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- TAB 7: 5 CORE ARCHETYPES & CUSTOM BUILDER --- */}
      {/* ======================================================== */}
      {activeTab === 'CORE_BUILDER' && (
        <div className="space-y-5">
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
            {TUTOR_ARCHETYPES[activeArchetypeTab] && (
              <div className="p-4 bg-void border border-arcade-border grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-6 space-y-2 border-r border-arcade-border/50 pr-4">
                  <div className="font-silkscreen text-sm text-white">
                    {TUTOR_ARCHETYPES[activeArchetypeTab].title}
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {TUTOR_ARCHETYPES[activeArchetypeTab].description}
                  </p>
                  <div className="text-[10px] text-arcade-cyan pt-2">
                    • Suggested Session: <span className="font-bold">{TUTOR_ARCHETYPES[activeArchetypeTab].recommendedDuration}m</span>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <span className="text-[9px] text-gray-400 font-pixel uppercase">SAMPLE ARCHETYPE DIALOGUE</span>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="p-2 bg-void-card border border-arcade-border">
                      <span className="text-arcade-gold font-bold">Start: </span>
                      <span className="italic">&ldquo;{TUTOR_ARCHETYPES[activeArchetypeTab].dialogue.onStart[0]}&rdquo;</span>
                    </div>
                    <div className="p-2 bg-void-card border border-arcade-border">
                      <span className="text-arcade-cyan font-bold">Break: </span>
                      <span className="italic">&ldquo;{TUTOR_ARCHETYPES[activeArchetypeTab].dialogue.onBreak[0]}&rdquo;</span>
                    </div>
                    <div className="p-2 bg-void-card border border-arcade-border">
                      <span className="text-green-400 font-bold">Complete: </span>
                      <span className="italic">&ldquo;{TUTOR_ARCHETYPES[activeArchetypeTab].dialogue.onComplete[0]}&rdquo;</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Action: Craft Custom Companion */}
          <div className="p-4 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-silkscreen text-xs text-white">CUSTOM TUTOR BUILDER (+50 XP)</span>
              <p className="text-[10px] text-gray-400">Craft a personalized study companion with custom quote, archetype, and study duration.</p>
            </div>
            <button
              onClick={() => setShowCreateCustomModal(true)}
              className="pixel-btn px-3 py-1.5 text-xs text-arcade-gold hover:text-white flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>CRAFT CUSTOM COMPANION</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 1: SELECT TUTOR MODAL (ALL 20 PRESETS) --- */}
      {/* ======================================================== */}
      {showSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-4xl w-full shadow-pixel max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-arcade-border">
              <div className="flex items-center gap-2">
                <span className="text-arcade-gold font-pixel text-xs">👥</span>
                <h3 className="font-silkscreen text-sm text-arcade-gold uppercase">
                  CHOOSE YOUR STUDY COMPANION
                </h3>
              </div>
              <button
                onClick={() => setShowSelectModal(false)}
                className="pixel-btn px-2 py-0.5 text-[9px] text-gray-400 hover:text-white flex items-center gap-1"
                title="CLOSE"
              >
                <X size={14} />
                <span>CLOSE</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {CHARACTERS.map((char) => {
                  const isActive = char.id === activeCharacter.id;
                  const profile = TUTOR_ECOSYSTEM_PROFILES[char.id];
                  const aff = affinities[char.id] || { affinityLevel: 1 };

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
                            <span className="text-[8px] text-gray-400 font-pixel truncate">
                              LVL {aff.affinityLevel}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-xs text-white truncate">{char.name}</div>
                        <div className="text-[9px] text-arcade-cyan truncate mt-0.5">
                          {profile?.primarySpecialty || char.archetypeName}
                        </div>
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
                            onClick={() => handleSelectTutor(char)}
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

            <div className="mt-3 pt-3 border-t border-arcade-border flex justify-end">
              <button
                onClick={() => setShowSelectModal(false)}
                className="pixel-btn px-4 py-1.5 text-xs text-gray-400 hover:text-white"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 2: SQUAD BUILDER MODAL --- */}
      {/* ======================================================== */}
      {showSquadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-cyan p-5 max-w-lg w-full shadow-pixel">
            <h3 className="font-silkscreen text-xs text-arcade-cyan mb-3 uppercase">
              {editingSquad ? 'EDIT STUDY SQUAD' : 'ASSEMBLE NEW STUDY SQUAD'}
            </h3>

            <form onSubmit={handleSaveSquad} className="space-y-3">
              <div>
                <label className="text-gray-400 block mb-1">Squad Name *</label>
                <input
                  type="text"
                  required
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="e.g. Master Exam Prep, Deep Code Unit"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-cyan"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Purpose / Subject</label>
                <input
                  type="text"
                  value={squadSubject}
                  onChange={(e) => setSquadSubject(e.target.value)}
                  placeholder="e.g. Exam Preparation, Algorithms"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Lead Tutor (Primary Guide)</label>
                <select
                  value={squadLead}
                  onChange={(e) => setSquadLead(e.target.value)}
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Supporting Specialist 1</label>
                  <select
                    value={squadSupport1}
                    onChange={(e) => setSquadSupport1(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    {CHARACTERS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Supporting Specialist 2</label>
                  <select
                    value={squadSupport2}
                    onChange={(e) => setSquadSupport2(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    {CHARACTERS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setShowSquadModal(false)}
                  className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1 text-black font-bold uppercase"
                >
                  SAVE SQUAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 3: PRESET BUILDER MODAL --- */}
      {/* ======================================================== */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-lg w-full shadow-pixel">
            <h3 className="font-silkscreen text-xs text-arcade-gold mb-3 uppercase">
              {editingPreset ? 'EDIT FOCUS PRESET' : 'CREATE NEW FOCUS PRESET'}
            </h3>

            <form onSubmit={handleSavePreset} className="space-y-3">
              <div>
                <label className="text-gray-400 block mb-1">Preset Name *</label>
                <input
                  type="text"
                  required
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g. Rainy Night Math Grind"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Tutor</label>
                  <select
                    value={presetTutorId}
                    onChange={(e) => setPresetTutorId(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    {CHARACTERS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={presetSubject}
                    onChange={(e) => setPresetSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Focus (min)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={presetFocusMins}
                    onChange={(e) => setPresetFocusMins(Number(e.target.value))}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Break (min)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={presetBreakMins}
                    onChange={(e) => setPresetBreakMins(Number(e.target.value))}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Ambience</label>
                  <select
                    value={presetAmbience}
                    onChange={(e) => setPresetAmbience(e.target.value)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none uppercase"
                  >
                    <option value="rain">Rain</option>
                    <option value="lofi">Lo-Fi</option>
                    <option value="space">Space</option>
                    <option value="matrix">Matrix</option>
                    <option value="purr">Purr</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setShowPresetModal(false)}
                  className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1 text-black font-bold uppercase"
                >
                  SAVE PRESET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- MODAL 4: CUSTOM COMPANION BUILDER MODAL --- */}
      {/* ======================================================== */}
      {showCreateCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-md w-full shadow-pixel">
            <h3 className="font-silkscreen text-xs text-arcade-gold mb-3 uppercase">
              CREATE CUSTOM COMPANION (+50 XP)
            </h3>

            <form
              onSubmit={(e) => {
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
                setShowCreateCustomModal(false);
                setCustomName('');
                handleSelectTutor({
                  id: created.id,
                  index: '00/CORE',
                  name: created.name,
                  archetypeName: TUTOR_ARCHETYPES[created.archetype].title,
                  category: 'Cozy & Everyday',
                  universe: created.tagline,
                  tagline: created.tagline,
                  quote: created.quote,
                  palette: {
                    bgVoid: '#0E0914',
                    borderPrimary: '#F5C242',
                    accentGold: '#F5C242',
                    accentSecondary: '#5CE1E6',
                    stripeColors: ['#F5C242', '#5CE1E6', '#FF007F'],
                  },
                  pixelSpriteType: 'pixel-cat',
                  environmentFX: 'pixel-rain',
                  codeSnippet: ['// Custom study companion'],
                  synthNotes: [261.63, 329.63, 392.00, 523.25],
                  ambienceProfile: 'rain',
                  genderOrSpirit: 'girl',
                });
              }}
              className="space-y-3"
            >
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
                  onClick={() => setShowCreateCustomModal(false)}
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
