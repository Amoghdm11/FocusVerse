import React, { useState, useEffect } from 'react';
import { CHARACTERS } from './data/characters';
import { Character } from './types/character';
import { HomePage } from './pages/HomePage';
import { SelectPage, SpiritFilterType } from './pages/SelectPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { NavigationHUD, MainNavSection } from './components/NavigationHUD';
import { QuickActionModal } from './components/QuickActionModal';
import { LevelUpModal } from './components/LevelUpModal';
import { TaskPlannerView } from './components/TaskPlannerView';
import { StatsView } from './components/StatsView';
import { NotesAndFlashcardsView } from './components/NotesAndFlashcardsView';
import { AchievementsView } from './components/AchievementsView';
import { StudyRoomsView } from './components/StudyRoomsView';
import { SettingsView } from './components/SettingsView';
import { TutorsView } from './components/TutorsView';
import { RPGTask } from './types/rpg';
import { Footer } from './components/Footer';

export type AppViewMode = 
  | 'HOME' 
  | 'SELECT' 
  | MainNavSection;

export const App: React.FC = () => {
  // Read initial view and character from window.location.hash or localStorage
  const getInitialState = () => {
    const hash = window.location.hash.toLowerCase();
    let initialView: AppViewMode = 'HOME';
    let initialCharId: string = 'peter-parker';

    const match = hash.match(/char=([a-z0-9-]+)/);
    if (match && match[1]) initialCharId = match[1];

    if (hash.includes('#select')) {
      initialView = 'SELECT';
    } else if (hash.includes('#workspace') || hash.includes('#timer')) {
      initialView = 'TIMER';
    } else if (hash.includes('#dashboard')) {
      initialView = 'DASHBOARD';
    } else if (hash.includes('#tutors')) {
      initialView = 'TUTORS';
    } else if (hash.includes('#tasks')) {
      initialView = 'TASKS';
    } else if (hash.includes('#stats')) {
      initialView = 'STATS';
    } else if (hash.includes('#notes')) {
      initialView = 'NOTES';
    } else if (hash.includes('#achievements')) {
      initialView = 'ACHIEVEMENTS';
    } else if (hash.includes('#rooms')) {
      initialView = 'ROOMS';
    } else if (hash.includes('#settings')) {
      initialView = 'SETTINGS';
    } else if (hash.includes('#home') || !hash || hash === '#' || hash === '#/') {
      initialView = 'HOME';
    } else {
      const saved = localStorage.getItem('focusverse_view');
      if (saved) {
        initialView = saved as AppViewMode;
      }
      const savedId = localStorage.getItem('focusverse_selected_char');
      if (savedId) initialCharId = savedId;
    }

    const foundChar = CHARACTERS.find((c) => c.id === initialCharId) || CHARACTERS[0];
    return { initialView, foundChar };
  };

  const { initialView, foundChar } = getInitialState();
  const [view, setView] = useState<AppViewMode>(initialView);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(foundChar);
  const [spiritFilter, setSpiritFilter] = useState<SpiritFilterType>('ALL');
  const [activeTask, setActiveTask] = useState<RPGTask | null>(null);

  // Quick Action Modal state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const [archetypeMode, setArchetypeMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('focusverse_safe_mode') === 'true';
    } catch (_) {
      return false;
    }
  });

  // Sync hash when view or character changes
  useEffect(() => {
    if (view === 'HOME') {
      window.location.hash = 'home';
    } else if (view === 'SELECT') {
      window.location.hash = 'select';
    } else if (view === 'TIMER') {
      window.location.hash = `timer?char=${selectedCharacter.id}`;
    } else {
      window.location.hash = view.toLowerCase();
    }

    try {
      localStorage.setItem('focusverse_view', view);
      localStorage.setItem('focusverse_selected_char', selectedCharacter.id);
      localStorage.setItem('focusverse_safe_mode', archetypeMode.toString());
    } catch (_) {}
  }, [view, selectedCharacter, archetypeMode]);

  // Listen to hash changes (browser back/forward or direct link)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/char=([a-z0-9-]+)/);
      if (match && match[1]) {
        const found = CHARACTERS.find((c) => c.id === match[1]);
        if (found) setSelectedCharacter(found);
      }

      if (hash.includes('#select')) setView('SELECT');
      else if (hash.includes('#workspace') || hash.includes('#timer')) setView('TIMER');
      else if (hash.includes('#dashboard')) setView('DASHBOARD');
      else if (hash.includes('#tutors')) setView('TUTORS');
      else if (hash.includes('#tasks')) setView('TASKS');
      else if (hash.includes('#stats')) setView('STATS');
      else if (hash.includes('#notes')) setView('NOTES');
      else if (hash.includes('#achievements')) setView('ACHIEVEMENTS');
      else if (hash.includes('#rooms')) setView('ROOMS');
      else if (hash.includes('#settings')) setView('SETTINGS');
      else if (hash.includes('#home')) setView('HOME');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLaunchQuickSession = (char: Character) => {
    setSelectedCharacter(char);
    setView('TIMER');
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setView('DASHBOARD');
  };

  const handleSelectSpirit = (spirit: 'girl' | 'boy') => {
    setSpiritFilter(spirit);
    const targetId = spirit === 'girl' ? 'cozy-study-girl' : 'late-night-study-boy';
    const found = CHARACTERS.find((c) => c.id === targetId);
    if (found) {
      setSelectedCharacter(found);
    }
    setView('SELECT');
  };

  const handleOpenRoster = () => {
    setSpiritFilter(selectedCharacter.genderOrSpirit === 'girl' ? 'girl' : 'boy');
    setView('SELECT');
  };

  const handleToggleArchetypeMode = () => {
    setArchetypeMode((prev) => !prev);
  };

  // Check if view is one of the 9 main HUD views
  const isMainHUDView = view !== 'HOME' && view !== 'SELECT';

  return (
    <div className="min-h-screen bg-void text-gray-100 font-mono flex flex-col relative selection:bg-arcade-gold selection:text-black">
      {/* Global Modals: Quick Action (Ctrl+K) & Level Up Fanfare */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onNavigate={(targetView) => setView(targetView as AppViewMode)}
      />
      <LevelUpModal />

      {/* Persistent Navigation HUD across all main 9 views */}
      {isMainHUDView && (
        <NavigationHUD
          currentSection={view as MainNavSection}
          onSelectSection={(sec) => setView(sec)}
          activeCharacter={selectedCharacter}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onGoHome={() => setView('HOME')}
        />
      )}

      {/* --- VIEW ROUTER --- */}
      <div className="flex-1 flex flex-col">
        {view === 'HOME' && (
          <HomePage
            onSelectCompanion={handleOpenRoster}
            onLaunchQuickSession={handleLaunchQuickSession}
            onSelectSpirit={handleSelectSpirit}
            onEnterDashboard={() => setView('DASHBOARD')}
            archetypeMode={archetypeMode}
            onToggleArchetypeMode={handleToggleArchetypeMode}
          />
        )}

        {view === 'SELECT' && (
          <SelectPage
            onSelectCharacter={handleSelectCharacter}
            onBackToHome={() => setView('DASHBOARD')}
            archetypeMode={archetypeMode}
            onToggleArchetypeMode={handleToggleArchetypeMode}
            initialCharacter={selectedCharacter}
            initialSpirit={spiritFilter}
            onPreviewCharacterChange={(char) => setSelectedCharacter(char)}
          />
        )}

        {view === 'DASHBOARD' && (
          <DashboardPage
            character={selectedCharacter}
            onNavigate={(sec) => setView(sec as AppViewMode)}
            onStartSessionWithTask={(task) => {
              setActiveTask(task);
              setView('TIMER');
            }}
          />
        )}

        {view === 'TIMER' && (
          <WorkspacePage
            character={selectedCharacter}
            onSelectAnotherCharacter={(char) => setSelectedCharacter(char)}
            onBackToRoster={() => setView('SELECT')}
            archetypeMode={archetypeMode}
            onToggleArchetypeMode={handleToggleArchetypeMode}
            initialTask={activeTask}
            hideHeader={false}
          />
        )}

        {view === 'TUTORS' && (
          <TutorsView
            activeCharacter={selectedCharacter}
            onSelectCharacter={(char) => {
              setSelectedCharacter(char);
            }}
            onOpen3DStage={() => setView('SELECT')}
            onStartFocusSession={(char) => {
              setSelectedCharacter(char);
              setView('TIMER');
            }}
          />
        )}

        {view === 'TASKS' && (
          <TaskPlannerView
            onStartFocusWithTask={(task) => {
              setActiveTask(task);
              setView('TIMER');
            }}
          />
        )}

        {view === 'STATS' && <StatsView />}

        {view === 'NOTES' && (
          <NotesAndFlashcardsView
            onStartFocusSession={(subject, noteTitle) => {
              setActiveTask({
                id: `task-note-${Date.now()}`,
                title: `Study: ${noteTitle}`,
                description: `Focused review of study note: ${noteTitle}`,
                subject: subject || 'General',
                priority: 'HIGH',
                estimatedMinutes: 25,
                actualMinutes: 0,
                sessionsCount: 0,
                deadline: new Date().toISOString().slice(0, 10),
                completed: false,
                createdAt: Date.now(),
                subtasks: [],
                notes: `Originated from note: ${noteTitle}`,
                recurring: 'NONE',
              });
              setView('TIMER');
            }}
          />
        )}

        {view === 'ACHIEVEMENTS' && <AchievementsView />}

        {view === 'ROOMS' && <StudyRoomsView />}

        {view === 'SETTINGS' && <SettingsView />}
      </div>

      {/* Global Credits Footer on non-workspace views */}
      {view !== 'TIMER' && view !== 'HOME' && <Footer />}
    </div>
  );
};

export default App;
