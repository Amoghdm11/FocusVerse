export type TimerType = 'POMODORO' | 'STOPWATCH' | 'COUNTDOWN';
export type PomoPhase = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export type RPGTutorArchetype = 
  | 'STRICT_MENTOR' 
  | 'FRIENDLY_COMPANION' 
  | 'CHILL_COMPANION' 
  | 'COMPETITIVE_COACH' 
  | 'WISE_MENTOR';

export interface UserRPGProfile {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  longestStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  unlockedBadges: string[];
  unlockedTitles: string[];
  selectedTitle: string;
}

export interface StudySessionRecord {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  plannedMinutes: number;
  timerType: TimerType;
  subject: string;
  taskId?: string;
  taskTitle?: string;
  tutorId: string;
  distractionCount: number;
  completed: boolean;
  notes?: string;
}

export interface RPGSubtask {
  id: string;
  text: string;
  completed: boolean;
}

export type TaskPriority = 'HIGH' | 'MED' | 'LOW';

export interface RPGTask {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: TaskPriority;
  estimatedMinutes: number;
  actualMinutes: number;
  sessionsCount: number;
  deadline?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  subtasks: RPGSubtask[];
  notes: string;
  recurring: 'NONE' | 'DAILY' | 'WEEKLY';
}

export interface StudyPlannerBlock {
  id: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  timeSlot: string; // e.g., "09:00 - 10:00"
  subject: string;
  targetMinutes: number;
  completed: boolean;
}

export interface MultiNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueDate: number; // epoch ms
  lastReviewed?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  description: string;
  createdAt: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  type: 'SESSIONS' | 'MINUTES' | 'TASKS' | 'FLASHCARDS';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: number;
  requirement: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  accomplishments: string;
  difficulties: string;
  prioritiesTomorrow: string;
  rating: number; // 1-5
  updatedAt: number;
}

export interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  status: 'FOCUSING' | 'BREAK' | 'IDLE';
  minutesToday: number;
  currentTask?: string;
}

export interface StudyRoom {
  id: string;
  code: string;
  name: string;
  subject: string;
  host: string;
  activeSprintMinutes: number;
  sharedGoal: string;
  participants: StudyRoomParticipant[];
  recentCheers: string[];
}

export interface StudyEnvironment {
  id: string;
  name: string;
  description: string;
  fxType: string;
  ambience: string;
  tagline: string;
  icon: string;
}

export interface CustomTutorProfile {
  id: string;
  name: string;
  archetype: RPGTutorArchetype;
  description: string;
  tagline: string;
  quote: string;
  avatar: string;
  preferredDuration: number;
  preferredEnvironment: string;
  dialogueTone: 'strict' | 'friendly' | 'chill' | 'competitive' | 'wise';
  isCustom: boolean;
}

export interface AppSettings {
  theme: 'cyberpunk' | 'night' | 'neon' | 'retro-amber';
  soundEffects: boolean;
  ambienceVol: number;
  synthVol: number;
  sfxVol: number;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
  dailyGoalMinutes: number;
  timerPresets: {
    focus: number;
    shortBreak: number;
    longBreak: number;
    sessionsBeforeLong: number;
  };
}
