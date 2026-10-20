import { 
  UserRPGProfile, 
  StudySessionRecord, 
  RPGTask, 
  StudyPlannerBlock, 
  MultiNote, 
  Flashcard, 
  FlashcardDeck, 
  DailyQuest, 
  Achievement, 
  DailyReflection, 
  AppSettings, 
  CustomTutorProfile,
  StudyRoom,
  TutorAffinityRecord,
  TutorChallenge,
  SubjectTutorAssignment,
  StudySquad,
  FocusPreset,
  TutorPerformanceStat,
  TutorCosmeticUnlock
} from '../types/rpg';
import { CORE_TUTOR_PROFILES } from '../data/tutorArchetypes';
import { 
  TUTOR_ECOSYSTEM_PROFILES, 
  DEFAULT_STUDY_SQUADS, 
  DEFAULT_FOCUS_PRESETS, 
  TUTOR_COSMETIC_UNLOCKS 
} from '../data/tutorProfiles';
import { CHARACTERS } from '../data/characters';

// Helper for formatted today's date YYYY-MM-DD
export const getTodayDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'cyberpunk',
  soundEffects: true,
  ambienceVol: 0.4,
  synthVol: 0.3,
  sfxVol: 0.5,
  notificationsEnabled: true,
  reducedMotion: false,
  dailyGoalMinutes: 100,
  timerPresets: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLong: 4,
  },
  tutorDialogueFrequency: 'ALL',
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_focus',
    title: 'First Focus Session',
    description: 'Complete your first focused study session.',
    icon: '⚡',
    xp: 50,
    unlocked: false,
    requirement: 'Complete 1 focus session',
  },
  {
    id: 'session_5',
    title: 'Sustained Flow',
    description: 'Complete 5 focus sessions across your journey.',
    icon: '🔥',
    xp: 120,
    unlocked: false,
    requirement: 'Complete 5 sessions',
  },
  {
    id: 'session_20',
    title: 'Neural Master',
    description: 'Complete 20 focus sessions with zero distractions.',
    icon: '🧠',
    xp: 300,
    unlocked: false,
    requirement: 'Complete 20 sessions',
  },
  {
    id: 'first_task',
    title: 'Mission Cleared',
    description: 'Complete your first study task item.',
    icon: '⚔️',
    xp: 40,
    unlocked: false,
    requirement: 'Check off 1 task',
  },
  {
    id: 'task_10',
    title: 'Task Executioner',
    description: 'Eliminate 10 study tasks from your protocol.',
    icon: '🛡️',
    xp: 150,
    unlocked: false,
    requirement: 'Complete 10 tasks',
  },
  {
    id: 'daily_goal',
    title: 'Goal Overclock',
    description: 'Reach 100% of your daily study goal.',
    icon: '🏆',
    xp: 100,
    unlocked: false,
    requirement: 'Hit 100% daily focus goal',
  },
  {
    id: 'streak_3',
    title: 'Triple Ignition',
    description: 'Maintain a 3-day active study streak.',
    icon: '🌟',
    xp: 120,
    unlocked: false,
    requirement: '3-day study streak',
  },
  {
    id: 'streak_7',
    title: 'Week of Iron Will',
    description: 'Log focused study time for 7 days in a row.',
    icon: '👑',
    xp: 350,
    unlocked: false,
    requirement: '7-day study streak',
  },
  {
    id: 'recall_master',
    title: 'Active Recall Initiate',
    description: 'Review your first flashcard deck session.',
    icon: '🃏',
    xp: 60,
    unlocked: false,
    requirement: 'Review a flashcard deck',
  },
];

class RPGStore {
  // --- USER PROFILE & XP ---

  public getProfile(): UserRPGProfile {
    try {
      const data = localStorage.getItem('focusverse_rpg_profile');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return {
      level: 1,
      currentXp: 0,
      nextLevelXp: 120,
      streakDays: 1,
      longestStreakDays: 1,
      lastActiveDate: getTodayDateString(),
      unlockedBadges: ['NOVICE_SCHOLAR'],
      unlockedTitles: ['Apprentice Hacker', 'Focus Adept'],
      selectedTitle: 'Apprentice Hacker',
    };
  }

  public saveProfile(profile: UserRPGProfile) {
    try {
      localStorage.setItem('focusverse_rpg_profile', JSON.stringify(profile));
    } catch (_) {}
  }

  public awardXp(amount: number, reason: string): { profile: UserRPGProfile; leveledUp: boolean; newLevel: number } {
    const profile = this.getProfile();
    let { level, currentXp, nextLevelXp } = profile;
    let leveledUp = false;

    currentXp += amount;

    // Check if leveled up (can level up multiple times if huge XP)
    while (currentXp >= nextLevelXp) {
      currentXp -= nextLevelXp;
      level += 1;
      nextLevelXp = level * 120;
      leveledUp = true;
    }

    profile.level = level;
    profile.currentXp = currentXp;
    profile.nextLevelXp = nextLevelXp;

    this.saveProfile(profile);

    // Dispatch custom event for UI banners
    window.dispatchEvent(
      new CustomEvent('focusverse_xp_awarded', {
        detail: { amount, reason, leveledUp, level },
      })
    );

    return { profile, leveledUp, newLevel: level };
  }

  // --- SESSIONS ---

  public getSessions(): StudySessionRecord[] {
    try {
      const data = localStorage.getItem('focusverse_sessions');
      if (data) return JSON.parse(data);
    } catch (_) {}
    return [];
  }

  public saveSessions(sessions: StudySessionRecord[]) {
    try {
      localStorage.setItem('focusverse_sessions', JSON.stringify(sessions));
    } catch (_) {}
  }

  public addSession(session: Omit<StudySessionRecord, 'id' | 'timestamp' | 'date'>): StudySessionRecord {
    const sessions = this.getSessions();
    const today = getTodayDateString();
    const record: StudySessionRecord = {
      ...session,
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: today,
    };

    sessions.unshift(record);
    this.saveSessions(sessions);

    // Update streak
    this.updateStreak();

    // Award XP: 2 XP per focused minute + 20 bonus for completion
    const xpEarned = session.durationMinutes * 2 + (session.completed ? 20 : 0);
    this.awardXp(xpEarned, `Completed ${session.durationMinutes}m focus session`);

    // Check Achievements & Quests
    this.checkSessionAchievements(sessions);
    this.advanceQuestProgress('SESSIONS', 1);
    this.advanceQuestProgress('MINUTES', session.durationMinutes);

    // Record Tutor Affinity & Advance Tutor Challenges
    if (session.tutorId) {
      this.recordTutorFocusMinutes(session.tutorId, session.durationMinutes, session.completed, session.distractionCount || 0);
      this.advanceTutorChallenge('FOCUS_MINUTES', session.durationMinutes, session.tutorId);
      if (session.completed) {
        this.advanceTutorChallenge('SESSIONS_COUNT', 1, session.tutorId);
      }
      if (session.distractionCount === 0) {
        this.advanceTutorChallenge('ZERO_DISTRACTIONS', 1, session.tutorId);
      }
    }

    return record;
  }

  public getTodayMins(): number {
    const today = getTodayDateString();
    const sessions = this.getSessions();
    return sessions
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }

  public getWeeklyMinutes(): { day: string; mins: number }[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { day: string; mins: number }[] = [];
    const sessions = this.getSessions();

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = getTodayDateString(d);
      const dayName = days[d.getDay()];

      const dayMins = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      result.push({ day: dayName, mins: dayMins });
    }

    return result;
  }

  // --- STREAK LOGIC ---

  public updateStreak() {
    const profile = this.getProfile();
    const today = getTodayDateString();
    const lastActive = profile.lastActiveDate;

    if (lastActive === today) {
      // Already active today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getTodayDateString(yesterday);

    if (lastActive === yesterdayStr) {
      // Continued streak!
      profile.streakDays += 1;
      if (profile.streakDays > profile.longestStreakDays) {
        profile.longestStreakDays = profile.streakDays;
      }
    } else {
      // Streak reset or new start
      profile.streakDays = 1;
    }

    profile.lastActiveDate = today;
    this.saveProfile(profile);

    // Check streak achievements
    if (profile.streakDays >= 3) this.unlockAchievement('streak_3');
    if (profile.streakDays >= 7) this.unlockAchievement('streak_7');
  }

  // --- TASKS ---

  public getTasks(): RPGTask[] {
    try {
      const data = localStorage.getItem('focusverse_tasks_v2');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return [
      {
        id: '1',
        title: 'Calibrate neural focus frequency',
        description: 'Complete high-priority algorithm analysis',
        subject: 'Computer Science',
        priority: 'HIGH',
        estimatedMinutes: 45,
        actualMinutes: 0,
        sessionsCount: 0,
        deadline: getTodayDateString(),
        completed: false,
        createdAt: Date.now() - 3600000,
        subtasks: [
          { id: '1a', text: 'Outline data structures', completed: true },
          { id: '1b', text: 'Implement memory layout tests', completed: false },
        ],
        notes: 'Targeting zero-allocation buffers',
        recurring: 'NONE',
      },
      {
        id: '2',
        title: 'Review Discrete Mathematics proofs',
        description: 'Practice induction and graph theory exercises',
        subject: 'Mathematics',
        priority: 'MED',
        estimatedMinutes: 30,
        actualMinutes: 0,
        sessionsCount: 0,
        deadline: getTodayDateString(),
        completed: false,
        createdAt: Date.now() - 1800000,
        subtasks: [],
        notes: 'Chapter 4 problems 1-8',
        recurring: 'NONE',
      },
    ];
  }

  public saveTasks(tasks: RPGTask[]) {
    try {
      localStorage.setItem('focusverse_tasks_v2', JSON.stringify(tasks));
    } catch (_) {}
  }

  public addTask(task: Omit<RPGTask, 'id' | 'createdAt' | 'actualMinutes' | 'sessionsCount'>): RPGTask {
    const tasks = this.getTasks();
    const newTask: RPGTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
      actualMinutes: 0,
      sessionsCount: 0,
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<RPGTask>) {
    const tasks = this.getTasks().map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.saveTasks(tasks);
  }

  public toggleTaskComplete(id: string): boolean {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;

    const willBeCompleted = !task.completed;
    task.completed = willBeCompleted;
    this.saveTasks(tasks);

    if (willBeCompleted) {
      const xp = task.priority === 'HIGH' ? 50 : task.priority === 'MED' ? 35 : 20;
      this.awardXp(xp, `Completed task: ${task.title}`);
      this.advanceQuestProgress('TASKS', 1);

      this.unlockAchievement('first_task');
      const completedCount = tasks.filter((t) => t.completed).length;
      if (completedCount >= 10) this.unlockAchievement('task_10');

      // Advance tutor challenges
      this.advanceTutorChallenge('TASKS_COMPLETED', 1);
    }

    return willBeCompleted;
  }

  public deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(tasks);
  }

  // --- STUDY PLANNER ---

  public getPlannerBlocks(): StudyPlannerBlock[] {
    try {
      const data = localStorage.getItem('focusverse_planner_blocks');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return [
      { id: 'p1', dayOfWeek: 1, timeSlot: '09:00 - 10:00', subject: 'Computer Science', targetMinutes: 50, completed: false },
      { id: 'p2', dayOfWeek: 1, timeSlot: '14:00 - 15:00', subject: 'Mathematics', targetMinutes: 45, completed: false },
      { id: 'p3', dayOfWeek: 2, timeSlot: '10:00 - 11:30', subject: 'Algorithms', targetMinutes: 60, completed: false },
      { id: 'p4', dayOfWeek: 3, timeSlot: '09:00 - 10:30', subject: 'Physics', targetMinutes: 50, completed: false },
      { id: 'p5', dayOfWeek: 4, timeSlot: '13:00 - 14:00', subject: 'Deep Reading', targetMinutes: 45, completed: false },
      { id: 'p6', dayOfWeek: 5, timeSlot: '11:00 - 12:00', subject: 'Weekly Review', targetMinutes: 40, completed: false },
    ];
  }

  public savePlannerBlocks(blocks: StudyPlannerBlock[]) {
    try {
      localStorage.setItem('focusverse_planner_blocks', JSON.stringify(blocks));
    } catch (_) {}
  }

  // --- MULTI-NOTES ---

  public getNotes(): MultiNote[] {
    try {
      const data = localStorage.getItem('focusverse_multinotes');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return [
      {
        id: 'n1',
        title: 'System Architecture Notes',
        content: '# CORE PRINCIPLES\n- Separate state persistence from view logic\n- Accurate timestamp subtraction for drift-free countdowns\n- SuperMemo SM-2 algorithm for spaced repetition intervals',
        subject: 'Engineering',
        tags: ['Architecture', 'Notes'],
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 4000000,
        pinned: true,
      },
      {
        id: 'n2',
        title: 'Formula Cheat Sheet',
        content: 'Feynman Technique:\n1. Choose a concept\n2. Teach it to a child\n3. Identify gaps in explanation\n4. Review and simplify',
        subject: 'Productivity',
        tags: ['Methodology'],
        createdAt: Date.now() - 43200000,
        updatedAt: Date.now() - 1000000,
        pinned: false,
      },
    ];
  }

  public saveNotes(notes: MultiNote[]) {
    try {
      localStorage.setItem('focusverse_multinotes', JSON.stringify(notes));
    } catch (_) {}
  }

  public addNote(note: Omit<MultiNote, 'id' | 'createdAt' | 'updatedAt'>): MultiNote {
    const notes = this.getNotes();
    const newNote: MultiNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.unshift(newNote);
    this.saveNotes(notes);
    return newNote;
  }

  public updateNote(id: string, updates: Partial<MultiNote>) {
    const notes = this.getNotes().map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    this.saveNotes(notes);
  }

  public deleteNote(id: string) {
    const notes = this.getNotes().filter((n) => n.id !== id);
    this.saveNotes(notes);
  }

  // --- FLASHCARDS & SPACED REPETITION ---

  public getDecks(): FlashcardDeck[] {
    try {
      const data = localStorage.getItem('focusverse_decks');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return [
      {
        id: 'deck-cs',
        title: 'Data Structures & Algorithms',
        subject: 'Computer Science',
        description: 'Time complexities, invariants, and graph algorithms',
        createdAt: Date.now() - 86400000,
      },
      {
        id: 'deck-chem',
        title: 'Organic Chemistry Reactions',
        subject: 'Chemistry',
        description: 'Mechanisms, stereochemistry, and synthesis paths',
        createdAt: Date.now() - 43200000,
      },
    ];
  }

  public saveDecks(decks: FlashcardDeck[]) {
    try {
      localStorage.setItem('focusverse_decks', JSON.stringify(decks));
    } catch (_) {}
  }

  public getFlashcards(): Flashcard[] {
    try {
      const data = localStorage.getItem('focusverse_cards');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return [
      {
        id: 'c1',
        deckId: 'deck-cs',
        question: 'What is the average and worst-case time complexity of QuickSort?',
        answer: 'Average: O(n log n). Worst-case: O(n²) when pivot selection is poor (e.g. sorted array without random pivot).',
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        dueDate: Date.now() - 1000,
      },
      {
        id: 'c2',
        deckId: 'deck-cs',
        question: 'What is the difference between a Process and a Thread?',
        answer: 'A Process has its own virtual memory space and system resources. Threads share the memory space of their parent process.',
        repetitions: 2,
        intervalDays: 3,
        easeFactor: 2.6,
        dueDate: Date.now() + 86400000,
      },
      {
        id: 'c3',
        deckId: 'deck-chem',
        question: 'What is an SN2 reaction mechanism characterized by?',
        answer: 'Bimolecular nucleophilic substitution. One-step concerted mechanism with backside attack and complete inversion of configuration.',
        repetitions: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        dueDate: Date.now() - 5000,
      },
    ];
  }

  public saveFlashcards(cards: Flashcard[]) {
    try {
      localStorage.setItem('focusverse_cards', JSON.stringify(cards));
    } catch (_) {}
  }

  /**
   * SuperMemo SM-2 Spaced Repetition Algorithm
   * Rating: 1 = Difficult, 2 = Uncertain/Good, 3 = Easy
   */
  public reviewCard(cardId: string, rating: 1 | 2 | 3): Flashcard {
    const cards = this.getFlashcards();
    const card = cards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');

    let { repetitions, intervalDays, easeFactor } = card;

    if (rating === 1) {
      // Failed / Difficult
      repetitions = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === 2) {
      // Good
      if (repetitions === 0) intervalDays = 1;
      else if (repetitions === 1) intervalDays = 3;
      else intervalDays = Math.round(intervalDays * easeFactor);
      repetitions += 1;
    } else {
      // Easy
      if (repetitions === 0) intervalDays = 2;
      else if (repetitions === 1) intervalDays = 5;
      else intervalDays = Math.round(intervalDays * easeFactor * 1.3);
      repetitions += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
    }

    const updated: Flashcard = {
      ...card,
      repetitions,
      intervalDays,
      easeFactor,
      dueDate: Date.now() + intervalDays * 86400000,
      lastReviewed: Date.now(),
    };

    const newCards = cards.map((c) => (c.id === cardId ? updated : c));
    this.saveFlashcards(newCards);

    // Award XP
    this.awardXp(15, 'Reviewed flashcard');
    this.advanceQuestProgress('FLASHCARDS', 1);
    this.unlockAchievement('recall_master');

    // Advance tutor challenges
    this.advanceTutorChallenge('FLASHCARDS_REVIEWED', 1);

    return updated;
  }

  // --- DAILY & WEEKLY QUESTS ---

  public getDailyQuests(): DailyQuest[] {
    const today = getTodayDateString();
    try {
      const stored = localStorage.getItem('focusverse_quests_date');
      const data = localStorage.getItem('focusverse_quests');
      if (stored === today && data) {
        return JSON.parse(data);
      }
    } catch (_) {}

    const newQuests: DailyQuest[] = [
      {
        id: 'q1',
        title: 'Sprint Protocol',
        description: 'Complete 2 focus sessions today',
        target: 2,
        progress: 0,
        xpReward: 60,
        completed: false,
        type: 'SESSIONS',
      },
      {
        id: 'q2',
        title: 'Deep Immersion',
        description: 'Accumulate 45 minutes of total focus time',
        target: 45,
        progress: 0,
        xpReward: 80,
        completed: false,
        type: 'MINUTES',
      },
      {
        id: 'q3',
        title: 'Task Cleared',
        description: 'Check off at least 2 study tasks',
        target: 2,
        progress: 0,
        xpReward: 50,
        completed: false,
        type: 'TASKS',
      },
      {
        id: 'q4',
        title: 'Synaptic Recall',
        description: 'Review 3 flashcards',
        target: 3,
        progress: 0,
        xpReward: 40,
        completed: false,
        type: 'FLASHCARDS',
      },
    ];

    try {
      localStorage.setItem('focusverse_quests_date', today);
      localStorage.setItem('focusverse_quests', JSON.stringify(newQuests));
    } catch (_) {}

    return newQuests;
  }

  public saveDailyQuests(quests: DailyQuest[]) {
    try {
      localStorage.setItem('focusverse_quests', JSON.stringify(quests));
    } catch (_) {}
  }

  public advanceQuestProgress(type: DailyQuest['type'], delta: number) {
    const quests = this.getDailyQuests();
    let updated = false;

    for (const q of quests) {
      if (q.type === type && !q.completed) {
        q.progress += delta;
        if (q.progress >= q.target) {
          q.progress = q.target;
          q.completed = true;
          this.awardXp(q.xpReward, `Completed Quest: ${q.title}`);
        }
        updated = true;
      }
    }

    if (updated) {
      this.saveDailyQuests(quests);
    }
  }

  // --- ACHIEVEMENTS ---

  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem('focusverse_achievements');
      if (data) {
        const stored: Achievement[] = JSON.parse(data);
        // Merge missing achievements from initial list
        const storedIds = new Set(stored.map((a) => a.id));
        const merged = [...stored];
        for (const init of INITIAL_ACHIEVEMENTS) {
          if (!storedIds.has(init.id)) merged.push(init);
        }
        return merged;
      }
    } catch (_) {}
    return INITIAL_ACHIEVEMENTS;
  }

  public saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem('focusverse_achievements', JSON.stringify(achievements));
    } catch (_) {}
  }

  public unlockAchievement(id: string): boolean {
    const list = this.getAchievements();
    const item = list.find((a) => a.id === id);
    if (!item || item.unlocked) return false;

    item.unlocked = true;
    item.unlockedAt = Date.now();
    this.saveAchievements(list);

    this.awardXp(item.xp, `Achievement Unlocked: ${item.title}`);

    // Trigger custom event for banner
    window.dispatchEvent(
      new CustomEvent('focusverse_achievement_unlocked', {
        detail: { achievement: item },
      })
    );

    return true;
  }

  private checkSessionAchievements(sessions: StudySessionRecord[]) {
    if (sessions.length >= 1) this.unlockAchievement('first_focus');
    if (sessions.length >= 5) this.unlockAchievement('session_5');
    if (sessions.length >= 20) this.unlockAchievement('session_20');

    // Check daily goal
    const settings = this.getSettings();
    const todayMins = this.getTodayMins();
    if (todayMins >= settings.dailyGoalMinutes) {
      this.unlockAchievement('daily_goal');
    }
  }

  // --- DAILY REFLECTIONS ---

  public getReflections(): DailyReflection[] {
    try {
      const data = localStorage.getItem('focusverse_reflections');
      if (data) return JSON.parse(data);
    } catch (_) {}
    return [];
  }

  public saveReflection(reflection: Omit<DailyReflection, 'updatedAt'>) {
    const list = this.getReflections();
    const filtered = list.filter((r) => r.date !== reflection.date);
    const updated: DailyReflection = {
      ...reflection,
      updatedAt: Date.now(),
    };
    filtered.unshift(updated);
    try {
      localStorage.setItem('focusverse_reflections', JSON.stringify(filtered));
    } catch (_) {}
    this.awardXp(30, 'Completed daily reflection');
  }

  // --- SETTINGS ---

  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem('focusverse_app_settings');
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (_) {}
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem('focusverse_app_settings', JSON.stringify(settings));
    } catch (_) {}
    // Trigger theme update if needed
    window.dispatchEvent(new CustomEvent('focusverse_settings_changed', { detail: settings }));
  }

  // --- CUSTOM TUTORS ---

  public getCustomTutors(): CustomTutorProfile[] {
    try {
      const data = localStorage.getItem('focusverse_custom_tutors');
      if (data) return JSON.parse(data);
    } catch (_) {}
    return [];
  }

  public addCustomTutor(tutor: Omit<CustomTutorProfile, 'id' | 'isCustom'>): CustomTutorProfile {
    const list = this.getCustomTutors();
    const newTutor: CustomTutorProfile = {
      ...tutor,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    list.push(newTutor);
    try {
      localStorage.setItem('focusverse_custom_tutors', JSON.stringify(list));
    } catch (_) {}
    this.awardXp(50, `Created custom tutor: ${newTutor.name}`);
    return newTutor;
  }

  public getAllTutors(): CustomTutorProfile[] {
    return [...CORE_TUTOR_PROFILES, ...this.getCustomTutors()];
  }

  // --- STUDY ROOMS ---

  public getStudyRoom(): StudyRoom {
    try {
      const data = localStorage.getItem('focusverse_study_room');
      if (data) return JSON.parse(data);
    } catch (_) {}

    return {
      id: 'room-alpha',
      code: 'RETRO-77',
      name: 'Late Night Cyberpunk Study Room',
      subject: 'All Subjects Welcome',
      host: 'NeonScholar_99',
      activeSprintMinutes: 25,
      sharedGoal: 'Clear 2 Pomodoro sprints before midnight!',
      participants: [
        { id: 'p1', name: 'You (Player 1)', avatar: '👾', status: 'FOCUSING', minutesToday: this.getTodayMins() },
        { id: 'p2', name: 'Sora_Flow', avatar: '🎧', status: 'FOCUSING', minutesToday: 75, currentTask: 'Reading chapter 8' },
        { id: 'p3', name: 'PixelKitten', avatar: '🐱', status: 'BREAK', minutesToday: 50, currentTask: 'Refueling tea' },
        { id: 'p4', name: 'Cipher_9', avatar: '💻', status: 'FOCUSING', minutesToday: 110, currentTask: 'Debugging kernel' },
      ],
      recentCheers: [
        'Sora_Flow sent high-five! ✋',
        'PixelKitten sent hot coffee! ☕',
        'Cipher_9 leveled up to Lvl 4! ⭐',
      ],
    };
  }

  public sendCheer(cheer: string) {
    const room = this.getStudyRoom();
    room.recentCheers.unshift(cheer);
    if (room.recentCheers.length > 8) room.recentCheers.pop();
    try {
      localStorage.setItem('focusverse_study_room', JSON.stringify(room));
    } catch (_) {}
  }

  // ========================================================
  // --- 20-TUTOR ECOSYSTEM PROGRESSION & AFFINITY ---
  // ========================================================

  public getAllTutorAffinities(): Record<string, TutorAffinityRecord> {
    try {
      const data = localStorage.getItem('focusverse_tutor_affinities');
      if (data) return JSON.parse(data);
    } catch (_) {}

    // Initialize all 20 tutors at Level 1 (New Acquaintance)
    const initial: Record<string, TutorAffinityRecord> = {};
    for (const char of CHARACTERS) {
      initial[char.id] = {
        tutorId: char.id,
        sessionsCompleted: 0,
        totalMinutesFocused: 0,
        tasksCompletedWithTutor: 0,
        distractionsLogged: 0,
        challengesCompleted: [],
        affinityLevel: 1,
        affinityXp: 0,
        nextLevelAffinityXp: 50,
        unlockedCosmetics: [],
        lastStudiedDate: '',
      };
    }
    this.saveTutorAffinities(initial);
    return initial;
  }

  public getTutorAffinity(tutorId: string): TutorAffinityRecord {
    const affinities = this.getAllTutorAffinities();
    if (!affinities[tutorId]) {
      affinities[tutorId] = {
        tutorId,
        sessionsCompleted: 0,
        totalMinutesFocused: 0,
        tasksCompletedWithTutor: 0,
        distractionsLogged: 0,
        challengesCompleted: [],
        affinityLevel: 1,
        affinityXp: 0,
        nextLevelAffinityXp: 50,
        unlockedCosmetics: [],
        lastStudiedDate: '',
      };
      this.saveTutorAffinities(affinities);
    }
    return affinities[tutorId];
  }

  public saveTutorAffinities(affinities: Record<string, TutorAffinityRecord>) {
    try {
      localStorage.setItem('focusverse_tutor_affinities', JSON.stringify(affinities));
    } catch (_) {}
  }

  public recordTutorFocusMinutes(
    tutorId: string,
    minutes: number,
    completed: boolean,
    distractions: number = 0
  ): { affinity: TutorAffinityRecord; leveledUp: boolean; newLevel: number } {
    const affinities = this.getAllTutorAffinities();
    const record = affinities[tutorId] || {
      tutorId,
      sessionsCompleted: 0,
      totalMinutesFocused: 0,
      tasksCompletedWithTutor: 0,
      distractionsLogged: 0,
      challengesCompleted: [],
      affinityLevel: 1,
      affinityXp: 0,
      nextLevelAffinityXp: 50,
      unlockedCosmetics: [],
      lastStudiedDate: '',
    };

    record.totalMinutesFocused += minutes;
    record.distractionsLogged += distractions;
    record.lastStudiedDate = getTodayDateString();
    if (completed) {
      record.sessionsCompleted += 1;
    }

    // Award Affinity XP: 1 XP per 2 minutes + 10 XP bonus for completion
    const xpGain = Math.round(minutes * 0.5) + (completed ? 10 : 0);
    record.affinityXp += xpGain;

    let leveledUp = false;
    let currentLvl = record.affinityLevel;

    // Thresholds: Level 1 (0), Level 2 (50), Level 3 (150), Level 4 (300), Level 5 (500)
    const levelThresholds = [0, 50, 150, 300, 500, 999999];
    while (currentLvl < 5 && record.affinityXp >= levelThresholds[currentLvl]) {
      currentLvl += 1;
      leveledUp = true;
    }

    record.affinityLevel = currentLvl;
    record.nextLevelAffinityXp = levelThresholds[currentLvl] || 999999;

    affinities[tutorId] = record;
    this.saveTutorAffinities(affinities);

    if (leveledUp) {
      window.dispatchEvent(
        new CustomEvent('focusverse_tutor_affinity_up', {
          detail: { tutorId, newLevel: currentLvl },
        })
      );
    }

    return { affinity: record, leveledUp, newLevel: currentLvl };
  }

  // --- TUTOR CHALLENGES ---
  public getTutorChallenges(tutorId?: string): TutorChallenge[] {
    try {
      const data = localStorage.getItem('focusverse_tutor_challenges');
      if (data) {
        const parsed: TutorChallenge[] = JSON.parse(data);
        return tutorId ? parsed.filter((c) => c.tutorId === tutorId) : parsed;
      }
    } catch (_) {}

    // Initialize all challenges from TUTOR_ECOSYSTEM_PROFILES
    const initial: TutorChallenge[] = [];
    for (const id in TUTOR_ECOSYSTEM_PROFILES) {
      const p = TUTOR_ECOSYSTEM_PROFILES[id];
      if (p.challenges) {
        initial.push(...p.challenges);
      }
    }
    this.saveTutorChallenges(initial);
    return tutorId ? initial.filter((c) => c.tutorId === tutorId) : initial;
  }

  public saveTutorChallenges(challenges: TutorChallenge[]) {
    try {
      localStorage.setItem('focusverse_tutor_challenges', JSON.stringify(challenges));
    } catch (_) {}
  }

  public advanceTutorChallenge(
    type: TutorChallenge['type'],
    amount: number,
    tutorId?: string
  ): { completedChallenges: TutorChallenge[] } {
    const all = this.getTutorChallenges();
    const completedList: TutorChallenge[] = [];

    const updated = all.map((c) => {
      // If challenge already completed, do not re-claim
      if (c.completed) return c;

      // Filter by tutor if specified
      if (tutorId && c.tutorId !== tutorId) return c;

      if (c.type === type) {
        const nextProgress = c.progress + amount;
        if (nextProgress >= c.target) {
          const completedChal: TutorChallenge = { ...c, progress: c.target, completed: true };
          completedList.push(completedChal);

          // Award general profile XP
          this.awardXp(c.xpReward, `Cleared Challenge: ${c.title}`);

          // Award Affinity XP
          const affinities = this.getAllTutorAffinities();
          if (affinities[c.tutorId]) {
            affinities[c.tutorId].affinityXp += c.affinityReward;
            if (!affinities[c.tutorId].challengesCompleted.includes(c.id)) {
              affinities[c.tutorId].challengesCompleted.push(c.id);
            }
            this.saveTutorAffinities(affinities);
          }

          return completedChal;
        }
        return { ...c, progress: nextProgress };
      }
      return c;
    });

    this.saveTutorChallenges(updated);
    return { completedChallenges: completedList };
  }

  // --- SUBJECT TO TUTOR ASSIGNMENTS ---
  public getSubjectAssignments(): SubjectTutorAssignment[] {
    try {
      const data = localStorage.getItem('focusverse_subject_tutors');
      if (data) return JSON.parse(data);
    } catch (_) {}

    const defaults: SubjectTutorAssignment[] = [
      { id: 'sub-math', subject: 'Mathematics', tutorId: 'peter-parker', assignedAt: Date.now() },
      { id: 'sub-prog', subject: 'Programming', tutorId: 'neo', assignedAt: Date.now() },
      { id: 'sub-exam', subject: 'Exam Prep', tutorId: 'hermione-granger', assignedAt: Date.now() },
      { id: 'sub-strat', subject: 'Planning & Strategy', tutorId: 'bruce-wayne', assignedAt: Date.now() },
      { id: 'sub-lit', subject: 'Literature & Writing', tutorId: 'wednesday-addams', assignedAt: Date.now() },
      { id: 'sub-cozy', subject: 'General Study', tutorId: 'cozy-study-girl', assignedAt: Date.now() },
    ];
    this.saveSubjectAssignments(defaults);
    return defaults;
  }

  public saveSubjectAssignments(assignments: SubjectTutorAssignment[]) {
    try {
      localStorage.setItem('focusverse_subject_tutors', JSON.stringify(assignments));
    } catch (_) {}
  }

  public assignTutorToSubject(subject: string, tutorId: string) {
    const list = this.getSubjectAssignments();
    const existing = list.find((s) => s.subject.toLowerCase() === subject.toLowerCase());
    if (existing) {
      existing.tutorId = tutorId;
      existing.assignedAt = Date.now();
    } else {
      list.push({
        id: `sub-${Date.now()}`,
        subject,
        tutorId,
        assignedAt: Date.now(),
      });
    }
    this.saveSubjectAssignments(list);
  }

  public getTutorForSubject(subject: string): string | null {
    if (!subject) return null;
    const list = this.getSubjectAssignments();
    const found = list.find((s) =>
      s.subject.toLowerCase().includes(subject.toLowerCase()) ||
      subject.toLowerCase().includes(s.subject.toLowerCase())
    );
    return found ? found.tutorId : null;
  }

  // --- STUDY SQUADS (CRUD) ---
  public getStudySquads(): StudySquad[] {
    try {
      const data = localStorage.getItem('focusverse_study_squads');
      if (data) return JSON.parse(data);
    } catch (_) {}
    this.saveStudySquads(DEFAULT_STUDY_SQUADS);
    return DEFAULT_STUDY_SQUADS;
  }

  public saveStudySquads(squads: StudySquad[]) {
    try {
      localStorage.setItem('focusverse_study_squads', JSON.stringify(squads));
    } catch (_) {}
  }

  public addStudySquad(squad: Omit<StudySquad, 'id' | 'createdAt'>): StudySquad {
    const squads = this.getStudySquads();
    const newSquad: StudySquad = {
      ...squad,
      id: `squad-${Date.now()}`,
      createdAt: Date.now(),
    };
    squads.push(newSquad);
    this.saveStudySquads(squads);
    return newSquad;
  }

  public updateStudySquad(id: string, updates: Partial<StudySquad>) {
    const squads = this.getStudySquads().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveStudySquads(squads);
  }

  public deleteStudySquad(id: string) {
    const squads = this.getStudySquads().filter((s) => s.id !== id);
    this.saveStudySquads(squads);
  }

  public getActiveSquad(): StudySquad | null {
    try {
      const id = localStorage.getItem('focusverse_active_squad');
      if (id) {
        const found = this.getStudySquads().find((s) => s.id === id);
        if (found) return found;
      }
    } catch (_) {}
    return this.getStudySquads()[0] || null;
  }

  public setActiveSquad(squadId: string | null) {
    try {
      if (squadId) localStorage.setItem('focusverse_active_squad', squadId);
      else localStorage.removeItem('focusverse_active_squad');
    } catch (_) {}
  }

  // --- FOCUS PRESETS (CRUD) ---
  public getFocusPresets(): FocusPreset[] {
    try {
      const data = localStorage.getItem('focusverse_focus_presets');
      if (data) return JSON.parse(data);
    } catch (_) {}
    this.saveFocusPresets(DEFAULT_FOCUS_PRESETS);
    return DEFAULT_FOCUS_PRESETS;
  }

  public saveFocusPresets(presets: FocusPreset[]) {
    try {
      localStorage.setItem('focusverse_focus_presets', JSON.stringify(presets));
    } catch (_) {}
  }

  public addFocusPreset(preset: Omit<FocusPreset, 'id' | 'createdAt'>): FocusPreset {
    const presets = this.getFocusPresets();
    const newPreset: FocusPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      createdAt: Date.now(),
    };
    presets.push(newPreset);
    this.saveFocusPresets(presets);
    return newPreset;
  }

  public updateFocusPreset(id: string, updates: Partial<FocusPreset>) {
    const presets = this.getFocusPresets().map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.saveFocusPresets(presets);
  }

  public deleteFocusPreset(id: string) {
    const presets = this.getFocusPresets().filter((p) => p.id !== id);
    this.saveFocusPresets(presets);
  }

  public toggleFavoritePreset(id: string) {
    const presets = this.getFocusPresets().map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    this.saveFocusPresets(presets);
  }

  // --- TUTOR PERFORMANCE ANALYTICS (REAL SESSION DATA) ---
  public getTutorAnalytics(filters?: {
    dateRange?: 'ALL' | '7D' | '30D';
    subject?: string;
    tutorId?: string;
  }): TutorPerformanceStat[] {
    const sessions = this.getSessions();
    const now = Date.now();

    // Filter by date range
    let filtered = sessions;
    if (filters?.dateRange === '7D') {
      const cutoff = now - 7 * 86400000;
      filtered = filtered.filter((s) => s.timestamp >= cutoff);
    } else if (filters?.dateRange === '30D') {
      const cutoff = now - 30 * 86400000;
      filtered = filtered.filter((s) => s.timestamp >= cutoff);
    }

    // Filter by subject
    if (filters?.subject && filters.subject !== 'ALL') {
      filtered = filtered.filter((s) => s.subject.toLowerCase() === filters.subject!.toLowerCase());
    }

    // Group by tutor
    const statsMap: Record<string, {
      totalMins: number;
      totalSessions: number;
      completedSessions: number;
      distractions: number;
      subjects: Record<string, number>;
    }> = {};

    for (const s of filtered) {
      const tid = s.tutorId || 'unknown';
      if (!statsMap[tid]) {
        statsMap[tid] = {
          totalMins: 0,
          totalSessions: 0,
          completedSessions: 0,
          distractions: 0,
          subjects: {},
        };
      }
      statsMap[tid].totalMins += s.durationMinutes;
      statsMap[tid].totalSessions += 1;
      if (s.completed) statsMap[tid].completedSessions += 1;
      statsMap[tid].distractions += s.distractionCount || 0;
      statsMap[tid].subjects[s.subject] = (statsMap[tid].subjects[s.subject] || 0) + s.durationMinutes;
    }

    // Map to array of stats for each of the 20 characters
    const results: TutorPerformanceStat[] = [];
    for (const char of CHARACTERS) {
      if (filters?.tutorId && filters.tutorId !== 'ALL' && char.id !== filters.tutorId) {
        continue;
      }

      const st = statsMap[char.id] || statsMap[char.name] || {
        totalMins: 0,
        totalSessions: 0,
        completedSessions: 0,
        distractions: 0,
        subjects: {},
      };

      let topSub = 'None';
      let maxSubMins = 0;
      for (const sub in st.subjects) {
        if (st.subjects[sub] > maxSubMins) {
          maxSubMins = st.subjects[sub];
          topSub = sub;
        }
      }

      const avgMins = st.totalSessions > 0 ? Math.round(st.totalMins / st.totalSessions) : 0;
      const compRate = st.totalSessions > 0 ? Math.round((st.completedSessions / st.totalSessions) * 100) : 0;

      results.push({
        tutorId: char.id,
        tutorName: char.name,
        totalMinutes: st.totalMins,
        totalSessions: st.totalSessions,
        averageSessionMinutes: avgMins,
        tasksCompleted: st.completedSessions,
        distractionsLogged: st.distractions,
        completionRate: compRate,
        mostStudiedSubject: topSub,
      });
    }

    return results.sort((a, b) => b.totalMinutes - a.totalMinutes);
  }

  // --- TUTOR COSMETICS ---
  public getTutorCosmetics(tutorId?: string): TutorCosmeticUnlock[] {
    const affinities = this.getAllTutorAffinities();
    return TUTOR_COSMETIC_UNLOCKS.map((c) => {
      const aff = affinities[c.tutorId];
      const isUnlocked = aff && aff.affinityLevel >= c.requiredAffinityLevel;
      return { ...c, unlocked: Boolean(isUnlocked) };
    }).filter((c) => !tutorId || c.tutorId === tutorId);
  }

  public getActiveEquippedCosmetics(): { nameplate?: string; profileFrame?: string } {
    try {
      const data = localStorage.getItem('focusverse_equipped_cosmetics');
      if (data) return JSON.parse(data);
    } catch (_) {}
    return { nameplate: '', profileFrame: '' };
  }

  public equipCosmetic(cosmeticId: string, type: 'nameplate' | 'profileFrame') {
    const current = this.getActiveEquippedCosmetics();
    current[type] = cosmeticId;
    try {
      localStorage.setItem('focusverse_equipped_cosmetics', JSON.stringify(current));
    } catch (_) {}
  }

  // --- EXPORT & RESET DATA ---

  public exportData(): string {
    const allData = {
      profile: this.getProfile(),
      sessions: this.getSessions(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      planner: this.getPlannerBlocks(),
      decks: this.getDecks(),
      flashcards: this.getFlashcards(),
      achievements: this.getAchievements(),
      reflections: this.getReflections(),
      settings: this.getSettings(),
      customTutors: this.getCustomTutors(),
      tutorAffinities: this.getAllTutorAffinities(),
      tutorChallenges: this.getTutorChallenges(),
      subjectAssignments: this.getSubjectAssignments(),
      studySquads: this.getStudySquads(),
      focusPresets: this.getFocusPresets(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(allData, null, 2);
  }

  public clearAllData() {
    const keys = [
      'focusverse_rpg_profile',
      'focusverse_sessions',
      'focusverse_tasks_v2',
      'focusverse_planner_blocks',
      'focusverse_multinotes',
      'focusverse_decks',
      'focusverse_cards',
      'focusverse_quests_date',
      'focusverse_quests',
      'focusverse_achievements',
      'focusverse_reflections',
      'focusverse_app_settings',
      'focusverse_custom_tutors',
      'focusverse_study_room',
      'focusverse_tutor_affinities',
      'focusverse_tutor_challenges',
      'focusverse_subject_tutors',
      'focusverse_study_squads',
      'focusverse_active_squad',
      'focusverse_focus_presets',
      'focusverse_equipped_cosmetics',
    ];
    for (const k of keys) {
      localStorage.removeItem(k);
    }
  }
}

export const rpgStore = new RPGStore();
