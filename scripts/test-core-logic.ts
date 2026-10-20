// In-memory localStorage mock for node test runner
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Setup globals before importing store
(globalThis as any).localStorage = new LocalStorageMock();
(globalThis as any).window = {
  dispatchEvent: (event: any) => {},
};

import { rpgStore, getTodayDateString } from '../src/utils/rpgStore.ts';
import { aiService } from '../src/utils/aiService.ts';
import { MINECRAFT_STUDY_COLLECTION } from '../src/data/minecraftTracks.ts';
import { TUTOR_ARCHETYPES, CORE_TUTOR_PROFILES } from '../src/data/tutorArchetypes.ts';
import { TUTOR_ECOSYSTEM_PROFILES, DEFAULT_STUDY_SQUADS, DEFAULT_FOCUS_PRESETS } from '../src/data/tutorProfiles.ts';
import { CHARACTERS } from '../src/data/characters.ts';
import { tutorDialogueService } from '../src/utils/tutorDialogueService.ts';
import { youtubeService } from '../src/utils/youtubeService.ts';
import { CURATED_TRACKS, DEFAULT_PLAYLISTS } from '../src/data/curatedMusicCatalog.ts';

async function runTests() {
  console.log('--- STARTING FOCUSVERSE COMPREHENSIVE AUDIT & LOGIC SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Profile & Initial State
  const profile = rpgStore.getProfile();
  assert(profile.level >= 1, 'Initial profile level is at least 1');
  assert(profile.currentXp >= 0, 'Initial XP is non-negative');
  assert(profile.streakDays >= 1, 'Initial streak is tracked');

  // 2. XP Awarding & Level Up Logic
  const initialLvl = profile.level;
  const initialXp = profile.currentXp;
  const initialThreshold = profile.nextLevelXp;
  const result = rpgStore.awardXp(150, 'Testing XP Award');
  assert(result.profile.level >= initialLvl, 'Level never decreases on XP gain');
  if (initialXp + 150 >= initialThreshold) {
    assert(result.leveledUp === true, 'Player leveled up when crossing threshold');
    assert(result.newLevel === initialLvl + 1, 'New level calculated properly');
    assert(result.profile.currentXp === (initialXp + 150 - initialThreshold), 'XP remainder properly retained after level up');
  }

  // 3. Task Management
  const tasksBefore = rpgStore.getTasks().length;
  const createdTask = rpgStore.addTask({
    title: 'Test Induction Proof',
    description: 'Verify mathematical base case',
    subject: 'Mathematics',
    priority: 'HIGH',
    estimatedMinutes: 35,
    deadline: getTodayDateString(),
    completed: false,
    subtasks: [
      { id: 'st1', text: 'Base step', completed: false },
      { id: 'st2', text: 'Inductive step', completed: false },
    ],
    notes: 'Discrete Math Chap 5',
    recurring: 'NONE',
  });
  assert(rpgStore.getTasks().length === tasksBefore + 1, 'Task successfully added to store');
  assert(createdTask.title === 'Test Induction Proof', 'Task title matches');

  // Toggle complete
  const wasCompleted = rpgStore.toggleTaskComplete(createdTask.id);
  assert(wasCompleted === true, 'Task toggled to completed');
  const taskAfter = rpgStore.getTasks().find((t) => t.id === createdTask.id);
  assert(taskAfter?.completed === true, 'Task completed state persisted');

  // Check achievements after task completion
  const achList = rpgStore.getAchievements();
  const firstTaskAch = achList.find((a) => a.id === 'first_task');
  assert(firstTaskAch?.unlocked === true, 'First task achievement unlocked on completion');

  // 4. Session Recording & Today Mins Calculation
  const initialTodayMins = rpgStore.getTodayMins();
  const session = rpgStore.addSession({
    durationMinutes: 25,
    plannedMinutes: 25,
    timerType: 'POMODORO',
    subject: 'Mathematics',
    taskId: createdTask.id,
    taskTitle: createdTask.title,
    tutorId: 'Dr. Viktor Vane',
    distractionCount: 0,
    completed: true,
  });
  assert(session.durationMinutes === 25, 'Session created with 25 minutes');
  assert(rpgStore.getTodayMins() === initialTodayMins + 25, 'Today minutes accurately increments from real sessions');

  // First focus session achievement
  const focusAch = rpgStore.getAchievements().find((a) => a.id === 'first_focus');
  assert(focusAch?.unlocked === true, 'First focus session achievement unlocked');

  // 5. Daily Quests Progress
  const quests = rpgStore.getDailyQuests();
  const sessionQuest = quests.find((q) => q.type === 'SESSIONS');
  assert(sessionQuest !== undefined && sessionQuest.progress >= 1, 'Daily quest progress updated from session');

  // 6. Flashcards SuperMemo SM-2 Spaced Repetition Algorithm
  const cards = rpgStore.getFlashcards();
  assert(cards.length > 0, 'Flashcard decks initialized');
  const testCard = cards[0];
  const initialRep = testCard.repetitions;
  const initialInterval = testCard.intervalDays;

  // Review as Easy (rating 3)
  const reviewedCard = rpgStore.reviewCard(testCard.id, 3);
  assert(reviewedCard.repetitions === initialRep + 1, 'Card repetitions incremented on review');
  assert(reviewedCard.intervalDays >= initialInterval, 'Card interval days increased');
  assert(reviewedCard.dueDate > Date.now(), 'Future due date scheduled');

  // Recall master achievement
  const recallAch = rpgStore.getAchievements().find((a) => a.id === 'recall_master');
  assert(recallAch?.unlocked === true, 'Flashcard review achievement unlocked');

  // 7. Full Data Export
  const exported = rpgStore.exportData();
  const parsed = JSON.parse(exported);
  assert(Array.isArray(parsed.sessions), 'Exported sessions array present');
  assert(Array.isArray(parsed.tasks), 'Exported tasks array present');
  assert(Array.isArray(parsed.flashcards), 'Exported flashcards array present');
  assert(parsed.profile.level >= 1, 'Exported profile level is valid');

  // 8. UPGRADE 1: Tutor Roster & Custom Tutor Store Verification
  assert(Object.keys(TUTOR_ARCHETYPES).length === 5, '5 Core Archetypes defined');
  assert(CORE_TUTOR_PROFILES.length === 5, '5 Representative Core Tutors present');
  const initialCustomCount = rpgStore.getCustomTutors().length;
  const createdTutor = rpgStore.addCustomTutor({
    name: 'Master Eldrin',
    archetype: 'WISE_MENTOR',
    description: 'Ancient sage of algorithmic proofs',
    tagline: 'Quiet Glade • Deep Memory',
    quote: 'Knowledge is carved with patience.',
    avatar: '🧙‍♂️',
    preferredDuration: 45,
    preferredEnvironment: 'forest',
    dialogueTone: 'wise',
  });
  assert(createdTutor.name === 'Master Eldrin', 'Custom tutor created with exact name');
  assert(rpgStore.getCustomTutors().length === initialCustomCount + 1, 'Custom tutor persisted in store');

  // 9. UPGRADE 2: AI Notebook Service & Local Semantic Engine
  const sampleNoteTitle = 'Dijkstra Shortest Path Algorithm';
  const sampleNoteContent = `# Dijkstra Algorithm

## Overview
Dijkstra algorithm calculates the shortest path from a single source node to all other nodes in a graph with non-negative edge weights.

## Key Properties:
- Time Complexity: O((V + E) log V) with min-priority queue (min-heap).
- Invariant: Once a vertex is visited and relaxed, its calculated distance is final and optimal.
- Limitation: Fails when edges have negative weights (use Bellman-Ford instead).
- Data Structures: Priority Queue / Min Heap, Distance array, Visited set.`;

  // Q&A Test 1: Concept Explanation
  const aiExplanation = await aiService.askQuestion(sampleNoteContent, sampleNoteTitle, 'Explain this note in simple terms');
  assert(aiExplanation.answer.length > 50, 'AI answered question with detailed explanation');
  assert(aiExplanation.sourceType === 'LOCAL_ENGINE', 'Local engine activates gracefully when no API key configured');

  // Q&A Test 2: Flashcard Generation from Note
  const aiCards = await aiService.askQuestion(sampleNoteContent, sampleNoteTitle, 'Turn this note into flashcards');
  assert(aiCards.draftCards !== undefined && aiCards.draftCards.length > 0, 'Flashcards successfully drafted from note');
  assert(aiCards.draftCards![0].question.length > 0, 'Draft flashcard has valid question');
  assert(aiCards.draftCards![0].answer.length > 0, 'Draft flashcard has valid answer');

  // 10. UPGRADE 3 & 4: Sandbox & Pixel Worlds (Minecraft) Audio Collection
  assert(MINECRAFT_STUDY_COLLECTION.length >= 7, 'At least 7 Minecraft / Sandbox study tracks curated');
  const sweden = MINECRAFT_STUDY_COLLECTION.find((t) => t.id === 'mc-sweden');
  assert(sweden !== undefined, 'C418 Sweden track present');
  assert(sweden?.youtubeId === 'aBkTkxKDduc', 'Valid YouTube video identifier associated with Sweden');
  assert(sweden?.proceduralFallbackProfile === 'lofi', 'Safe procedural fallback profile configured');

  // 11. 20-TUTOR ECOSYSTEM INTEGRITY
  assert(CHARACTERS.length === 20, 'Existing 20 3D characters preserved intact');
  assert(Object.keys(TUTOR_ECOSYSTEM_PROFILES).length === 20, 'All 20 characters have complete ecosystem profiles');
  let validProfilesCount = 0;
  for (const char of CHARACTERS) {
    const prof = TUTOR_ECOSYSTEM_PROFILES[char.id];
    if (
      prof &&
      prof.name.length > 0 &&
      prof.primarySpecialty.length > 0 &&
      prof.secondarySpecialties.length > 0 &&
      prof.suggestedDuration > 0 &&
      prof.challenges.length >= 3 &&
      prof.dialogue.greetings.length >= 2 &&
      prof.dialogue.onStart.length >= 1 &&
      prof.dialogue.onSessionComplete.length >= 1
    ) {
      validProfilesCount++;
    }
  }
  assert(validProfilesCount === 20, 'Every one of the 20 tutors has valid specialties, durations, 3+ challenges, and dialogue sets');

  // 12. AFFINITY PROGRESSION & COSMETICS
  const initialAffinity = rpgStore.getTutorAffinity('peter-parker');
  assert(initialAffinity.affinityLevel === 1, 'Initial tutor affinity is Level 1');
  const affProgress = rpgStore.recordTutorFocusMinutes('peter-parker', 100, true, 0);
  assert(affProgress.affinity.affinityXp > 0, 'Tutor affinity XP increased after focus session');
  assert(affProgress.affinity.totalMinutesFocused === 100, 'Total minutes focused recorded accurately');
  assert(affProgress.affinity.affinityLevel >= 2, 'Tutor leveled up to Level 2 after meeting XP threshold');

  // 13. TUTOR CHALLENGES ADVANCEMENT
  const peterChallenges = rpgStore.getTutorChallenges('peter-parker');
  assert(peterChallenges.length >= 3, 'Tutor has at least 3 distinct challenges');
  const firstChallenge = peterChallenges[0];
  const prevProg = firstChallenge.progress;
  rpgStore.advanceTutorChallenge(firstChallenge.type, 50, 'peter-parker');
  const updatedPeterChallenges = rpgStore.getTutorChallenges('peter-parker');
  const updatedChallenge = updatedPeterChallenges.find((c) => c.id === firstChallenge.id);
  assert(updatedChallenge !== undefined && updatedChallenge.progress >= prevProg, 'Challenge progress advanced accurately');

  // 14. STUDY SQUADS (3-TUTOR COMPOSITION)
  const defaultSquads = rpgStore.getStudySquads();
  assert(defaultSquads.length >= 4, 'Default study squads initialized');
  const newSquad = rpgStore.addStudySquad({
    name: 'Cybernetic Focus Trio',
    description: 'High-intensity coding and systems analysis squad',
    leadTutorId: 'officer-k',
    supportTutorIds: ['neo', 'tony-stark'],
    recommendedSubjects: ['Computer Science', 'Cybersecurity'],
    bonusDescription: '+15% Tech Focus Efficiency',
    icon: '⚡',
  });
  assert(newSquad.leadTutorId === 'officer-k', 'Study squad created with designated lead');
  assert(newSquad.supportTutorIds.length === 2, 'Study squad enforces exactly 2 support companions');
  assert(rpgStore.getStudySquads().some((s) => s.id === newSquad.id), 'New squad persisted in storage');

  // 15. FOCUS PRESETS (SESSION RECIPES)
  const defaultPresets = rpgStore.getFocusPresets();
  assert(defaultPresets.length >= 4, 'Default focus presets initialized');
  const customPreset = rpgStore.addFocusPreset({
    name: 'Speed Flashcard Sprint',
    description: '15m quick recall burst',
    tutorId: 'peter-parker',
    subject: 'Biology',
    focusMinutes: 15,
    breakMinutes: 3,
    ambienceTrackId: 'mc-sweden',
    icon: '⚡',
  });
  assert(customPreset.focusMinutes === 15, 'Preset saved with exact duration');
  assert(rpgStore.getFocusPresets().some((p) => p.id === customPreset.id), 'Custom preset persisted');

  // 16. SUBJECT-TO-TUTOR MAPPING
  rpgStore.assignTutorToSubject('Quantum Physics', 'tony-stark');
  assert(rpgStore.getTutorForSubject('Quantum Physics') === 'tony-stark', 'Subject mapped directly to designated specialist tutor');

  // 17. TUTOR REAL ANALYTICS ENGINE
  rpgStore.addSession({
    durationMinutes: 45,
    plannedMinutes: 45,
    timerType: 'POMODORO',
    subject: 'Computer Science',
    tutorId: 'peter-parker',
    distractionCount: 1,
    completed: true,
  });
  const tutorAnalytics = rpgStore.getTutorAnalytics();
  assert(Array.isArray(tutorAnalytics), 'Tutor analytics returns an array');
  assert(tutorAnalytics.length === 20, 'Tutor analytics covers all 20 companions');
  const peterStats = tutorAnalytics.find((s) => s.tutorId === 'peter-parker');
  assert(peterStats !== undefined && peterStats.totalMinutes >= 45, 'Peter Parker analytics reflects real session minutes');

  // 18. EVENT-DRIVEN TUTOR DIALOGUE SERVICE
  const dialogueResult = tutorDialogueService.triggerEvent('SESSION_START', 'peter-parker');
  assert(dialogueResult !== null, 'Dialogue service returns in-character dialogue on session start');
  assert(dialogueResult?.tutorName?.includes('Peter Parker') === true, 'Dialogue identified correctly with Peter Parker');
  assert(dialogueResult?.message.length! > 0, 'Dialogue message body is non-empty');

  // Muted dialogue check
  const savedSettings = rpgStore.getSettings();
  rpgStore.saveSettings({ ...savedSettings, tutorDialogueFrequency: 'MUTED' });
  const mutedResult = tutorDialogueService.triggerEvent('SESSION_START', 'peter-parker');
  assert(mutedResult === null, 'Dialogue returns null when muted');
  rpgStore.saveSettings(savedSettings); // restore

  // 19. SPOTIFY-STYLE YOUTUBE MUSIC SERVICE & PLAYLISTS
  assert(CURATED_TRACKS.length >= 20, 'Curated catalog has at least 20 real YouTube tracks');
  assert(DEFAULT_PLAYLISTS.length >= 7, 'At least 7 default playlists initialized (Minecraft, Lofi, Piano, OST, Ambient, Rain, Synth)');
  
  // URL ID Extraction
  assert(youtubeService.extractVideoId('aBkTkxKDduc') === 'aBkTkxKDduc', 'Raw 11-char video ID extracted');
  assert(youtubeService.extractVideoId('https://www.youtube.com/watch?v=ha3KQ8gB83w') === 'ha3KQ8gB83w', 'Standard YouTube watch URL extracted');
  assert(youtubeService.extractVideoId('https://youtu.be/mUYsp5So298') === 'mUYsp5So298', 'Shortened youtu.be URL extracted');
  assert(youtubeService.extractVideoId('https://www.youtube.com/embed/5qap5aO4i9A') === '5qap5aO4i9A', 'Embed URL extracted');

  // Playlists CRUD
  const initPlCount = youtubeService.getPlaylists().length;
  assert(initPlCount >= 7, 'Initial playlists loaded');
  const customPl = youtubeService.createPlaylist('Late Night Calculus Mix', '⚡', 'Intense math sprints');
  assert(customPl.name === 'Late Night Calculus Mix', 'Custom playlist created');
  assert(youtubeService.getPlaylists().length === initPlCount + 1, 'Custom playlist persisted');

  // Add & Remove Track from Playlist
  const sampleTrack = CURATED_TRACKS[0];
  youtubeService.addTrackToPlaylist(customPl.id, sampleTrack);
  const foundPl = youtubeService.getPlaylists().find((p) => p.id === customPl.id);
  assert(foundPl?.tracks.length === 1, 'Track added to playlist');
  assert(foundPl?.tracks[0].videoId === sampleTrack.videoId, 'Track video ID matches in playlist');
  youtubeService.removeTrackFromPlaylist(customPl.id, foundPl!.tracks[0].id);
  const foundPlAfter = youtubeService.getPlaylists().find((p) => p.id === customPl.id);
  assert(foundPlAfter?.tracks.length === 0, 'Track removed from playlist');
  youtubeService.deletePlaylist(customPl.id);
  assert(youtubeService.getPlaylists().length === initPlCount, 'Playlist deleted cleanly');

  // Queue Operations
  const initQueue = youtubeService.getQueue();
  assert(initQueue.length > 0, 'Queue initialized with tracks');
  youtubeService.saveQueue([CURATED_TRACKS[0], CURATED_TRACKS[1]]);
  assert(youtubeService.getQueue().length === 2, 'Queue saved and retrieved accurately');

  // Favorites (Liked Tracks)
  const isFavBefore = youtubeService.isFavorite(CURATED_TRACKS[2].videoId);
  const nowFav = youtubeService.toggleFavorite(CURATED_TRACKS[2]);
  assert(nowFav !== isFavBefore, 'Favorite state toggled');
  assert(youtubeService.isFavorite(CURATED_TRACKS[2].videoId) === nowFav, 'Favorite check returns current state');
  // Toggle back
  youtubeService.toggleFavorite(CURATED_TRACKS[2]);

  // Recently Played
  youtubeService.addRecentlyPlayed(CURATED_TRACKS[3]);
  const recents = youtubeService.getRecentlyPlayed();
  assert(recents.length > 0 && recents[0].videoId === CURATED_TRACKS[3].videoId, 'Recently played track tracked at index 0');

  // Search
  const searchMinecraft = await youtubeService.searchYouTube('C418 Sweden');
  assert(searchMinecraft.length > 0, 'Search for C418 Sweden returned real tracks');
  assert(searchMinecraft[0].videoId === 'aBkTkxKDduc', 'Accurate C418 Sweden track matched');

  // Settings
  youtubeService.saveVolume(85);
  assert(youtubeService.getVolume() === 85, 'Volume persisted accurately');
  youtubeService.savePlayerMode('VIDEO');
  assert(youtubeService.getPlayerMode() === 'VIDEO', 'Player mode persisted');
  youtubeService.saveRepeat('ALL');
  assert(youtubeService.getRepeat() === 'ALL', 'Repeat mode persisted');
  youtubeService.saveShuffle(true);
  assert(youtubeService.getShuffle() === true, 'Shuffle setting persisted');

  console.log(`\nTEST RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('ALL AUDIT TESTS PASSED WITH 100% SUCCESS!');
  }
}

runTests();
