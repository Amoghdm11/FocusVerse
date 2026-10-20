import React, { useState, useEffect } from 'react';
import { CHARACTERS } from './data/characters';
import { Character } from './types/character';
import { HomePage } from './pages/HomePage';
import { SelectPage, SpiritFilterType } from './pages/SelectPage';
import { WorkspacePage } from './pages/WorkspacePage';

type ViewMode = 'HOME' | 'SELECT' | 'WORKSPACE';

export const App: React.FC = () => {
  // Read initial view and character from window.location.hash or localStorage
  const getInitialState = () => {
    const hash = window.location.hash.toLowerCase();
    let initialView: ViewMode = 'HOME';
    let initialCharId: string = 'peter-parker';

    const match = hash.match(/char=([a-z0-9-]+)/);
    if (match && match[1]) initialCharId = match[1];

    if (hash.includes('#select')) {
      initialView = 'SELECT';
    } else if (hash.includes('#workspace')) {
      initialView = 'WORKSPACE';
    } else {
      const saved = localStorage.getItem('focusverse_view');
      if (saved === 'HOME' || saved === 'SELECT' || saved === 'WORKSPACE') {
        initialView = saved as ViewMode;
      }
      const savedId = localStorage.getItem('focusverse_selected_char');
      if (savedId) initialCharId = savedId;
    }

    const foundChar = CHARACTERS.find((c) => c.id === initialCharId) || CHARACTERS[0];
    return { initialView, foundChar };
  };

  const { initialView, foundChar } = getInitialState();
  const [view, setView] = useState<ViewMode>(initialView);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(foundChar);
  const [spiritFilter, setSpiritFilter] = useState<SpiritFilterType>('ALL');

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
    } else if (view === 'WORKSPACE') {
      window.location.hash = `workspace?char=${selectedCharacter.id}`;
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

      if (hash.includes('#select')) {
        setView('SELECT');
      } else if (hash.includes('#workspace')) {
        setView('WORKSPACE');
      } else if (hash.includes('#home')) {
        setView('HOME');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLaunchQuickSession = (char: Character) => {
    setSelectedCharacter(char);
    setView('WORKSPACE');
  };

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setView('WORKSPACE');
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

  return (
    <div className="min-h-screen bg-void text-gray-100 font-mono flex flex-col relative selection:bg-arcade-gold selection:text-black">
      {view === 'HOME' && (
        <HomePage
          onSelectCompanion={handleOpenRoster}
          onLaunchQuickSession={handleLaunchQuickSession}
          onSelectSpirit={handleSelectSpirit}
          archetypeMode={archetypeMode}
          onToggleArchetypeMode={handleToggleArchetypeMode}
        />
      )}

      {view === 'SELECT' && (
        <SelectPage
          onSelectCharacter={handleSelectCharacter}
          onBackToHome={() => setView('HOME')}
          archetypeMode={archetypeMode}
          onToggleArchetypeMode={handleToggleArchetypeMode}
          initialCharacter={selectedCharacter}
          initialSpirit={spiritFilter}
          onPreviewCharacterChange={(char) => setSelectedCharacter(char)}
        />
      )}

      {view === 'WORKSPACE' && (
        <WorkspacePage
          character={selectedCharacter}
          onSelectAnotherCharacter={(char) => setSelectedCharacter(char)}
          onBackToRoster={() => {
            setSpiritFilter(selectedCharacter.genderOrSpirit === 'girl' ? 'girl' : 'boy');
            setView('SELECT');
          }}
          archetypeMode={archetypeMode}
          onToggleArchetypeMode={handleToggleArchetypeMode}
        />
      )}
    </div>
  );
};

export default App;

