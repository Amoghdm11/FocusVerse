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
  tutorDialogueFrequency: 'ALL' | 'ESSENTIAL' | 'MUTED';
}

// ========================================================
// --- 20-TUTOR COMPREHENSIVE ECOSYSTEM ARCHITECTURE ---
// ========================================================

export type TutorDifficultyPreference = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export interface TutorDialogueSet {
  greetings: string[];
  onStart: string[];
  onPause: string[];
  onResume: string[];
  onBreak: string[];
  onBreakReturn: string[];
  onTaskComplete: string[];
  onSessionComplete: string[];
  onSessionInterrupted: string[];
  onDailyGoalReached: string[];
  onFlashcardReview: string[];
  onStrugglingTask: string[];
  onPersonalBest: string[];
  onTutorSelected: string[];
  unlockedDialogue: string[];
}

export interface TutorChallenge {
  id: string;
  tutorId: string;
  title: string;
  description: string;
  requirement: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  affinityReward: number;
  type: 'FOCUS_MINUTES' | 'SESSIONS_COUNT' | 'ZERO_DISTRACTIONS' | 'TASKS_COMPLETED' | 'FLASHCARDS_REVIEWED' | 'REFLECTION_LOGGED';
}

export interface TutorEcosystemProfile {
  id: string; // matches Character.id
  name: string;
  characterIndex: string; // e.g. "01/20"
  archetype: RPGTutorArchetype;
  communicationStyle: string;
  tone: string;
  encouragementStyle: string;
  preferredStudyMethods: string[];
  suggestedDuration: number;
  suggestedBreak: number;
  primarySpecialty: string;
  secondarySpecialties: string[];
  difficultyPreference: TutorDifficultyPreference;
  shortBio: string;
  dialogue: TutorDialogueSet;
  challenges: TutorChallenge[];
}

export interface TutorAffinityRecord {
  tutorId: string;
  sessionsCompleted: number;
  totalMinutesFocused: number;
  tasksCompletedWithTutor: number;
  distractionsLogged: number;
  challengesCompleted: string[]; // array of challenge IDs
  affinityLevel: number; // Level 1 to 5
  affinityXp: number;
  nextLevelAffinityXp: number;
  unlockedCosmetics: string[];
  lastStudiedDate: string; // YYYY-MM-DD
}

export interface SubjectTutorAssignment {
  id: string;
  subject: string;
  tutorId: string;
  assignedAt: number;
}

export interface StudySquad {
  id: string;
  name: string;
  description: string;
  leadTutorId: string;
  supportTutorIds: string[]; // up to 2 supporting tutors
  purposeSubject?: string;
  preferredTimerDuration?: number;
  preferredBreakDuration?: number;
  environmentId?: string;
  ambienceProfile?: string;
  isDefault?: boolean;
  createdAt: number;
}

export interface FocusPreset {
  id: string;
  name: string;
  description: string;
  tutorId: string;
  squadId?: string;
  subject: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  environmentId: string;
  ambienceProfile: string;
  taskCategory?: string;
  isFavorite?: boolean;
  isDefault?: boolean;
  createdAt: number;
}

export interface TutorPerformanceStat {
  tutorId: string;
  tutorName: string;
  totalMinutes: number;
  totalSessions: number;
  averageSessionMinutes: number;
  tasksCompleted: number;
  distractionsLogged: number;
  completionRate: number; // 0 to 100 percentage
  mostStudiedSubject: string;
}

export interface TutorCosmeticUnlock {
  id: string;
  tutorId: string;
  title: string;
  type: 'NAMEPLATE' | 'PROFILE_FRAME' | 'DASHBOARD_THEME' | 'SPECIAL_DIALOGUE';
  description: string;
  requiredAffinityLevel: number;
  icon: string;
  unlocked: boolean;
}
