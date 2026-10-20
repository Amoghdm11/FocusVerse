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

  console.log(`\nTEST RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('ALL AUDIT TESTS PASSED WITH 100% SUCCESS!');
  }
}

runTests();
