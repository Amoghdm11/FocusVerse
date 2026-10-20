import { TUTOR_ECOSYSTEM_PROFILES } from '../data/tutorProfiles';
import { rpgStore } from './rpgStore';

export type TutorDialogueEventType =
  | 'SESSION_START'
  | 'SESSION_PAUSE'
  | 'SESSION_RESUME'
  | 'BREAK_START'
  | 'BREAK_RETURN'
  | 'TASK_COMPLETE'
  | 'SESSION_COMPLETE'
  | 'SESSION_INTERRUPTED'
  | 'DAILY_GOAL_REACHED'
  | 'FLASHCARD_REVIEW'
  | 'STRUGGLING_TASK'
  | 'PERSONAL_BEST'
  | 'TUTOR_SELECTED'
  | 'GREETING';

export interface ActiveTutorDialogue {
  id: string;
  tutorId: string;
  tutorName: string;
  event: TutorDialogueEventType;
  message: string;
  timestamp: number;
}

type DialogueSubscriber = (dialogue: ActiveTutorDialogue | null) => void;

class TutorDialogueService {
  private currentDialogue: ActiveTutorDialogue | null = null;
  private subscribers: Set<DialogueSubscriber> = new Set();
  private lastTriggerTimes: Record<string, number> = {};
  private lastActiveTutorId: string = 'peter-parker';

  public subscribe(fn: DialogueSubscriber): () => void {
    this.subscribers.add(fn);
    fn(this.currentDialogue);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private notify() {
    for (const fn of this.subscribers) {
      fn(this.currentDialogue);
    }
  }

  public getCurrentDialogue(): ActiveTutorDialogue | null {
    return this.currentDialogue;
  }

  public dismiss() {
    this.currentDialogue = null;
    this.notify();
  }

  /**
   * Trigger contextual dialogue for a real application event
   */
  public triggerEvent(
    event: TutorDialogueEventType,
    tutorId?: string,
    extraContext?: string
  ): ActiveTutorDialogue | null {
    const settings = rpgStore.getSettings();
    const effectiveTutorId = tutorId || this.lastActiveTutorId || 'peter-parker';
    if (tutorId) {
      this.lastActiveTutorId = tutorId;
    }

    // 1. Check if dialogue is muted
    if (settings.tutorDialogueFrequency === 'MUTED') {
      return null;
    }

    // 2. Filter non-essential events if frequency is ESSENTIAL
    if (settings.tutorDialogueFrequency === 'ESSENTIAL') {
      const essentialEvents: TutorDialogueEventType[] = [
        'SESSION_START',
        'SESSION_COMPLETE',
        'DAILY_GOAL_REACHED',
        'PERSONAL_BEST',
      ];
      if (!essentialEvents.includes(event)) {
        return null;
      }
    }

    // 3. Debounce rapid identical events (prevent message spam within 3 seconds)
    const now = Date.now();
    const eventKey = `${effectiveTutorId}_${event}`;
    if (this.lastTriggerTimes[eventKey] && now - this.lastTriggerTimes[eventKey] < 3000) {
      return null;
    }
    this.lastTriggerTimes[eventKey] = now;

    // 4. Retrieve tutor profile
    const profile = TUTOR_ECOSYSTEM_PROFILES[effectiveTutorId] || TUTOR_ECOSYSTEM_PROFILES['peter-parker'];
    const d = profile.dialogue;

    // 5. Select message pool based on event
    let pool: string[] = [];
    switch (event) {
      case 'SESSION_START':
        pool = d.onStart;
        break;
      case 'SESSION_PAUSE':
        pool = d.onPause;
        break;
      case 'SESSION_RESUME':
        pool = d.onResume;
        break;
      case 'BREAK_START':
        pool = d.onBreak;
        break;
      case 'BREAK_RETURN':
        pool = d.onBreakReturn;
        break;
      case 'TASK_COMPLETE':
        pool = d.onTaskComplete;
        break;
      case 'SESSION_COMPLETE':
        pool = d.onSessionComplete;
        break;
      case 'SESSION_INTERRUPTED':
        pool = d.onSessionInterrupted;
        break;
      case 'DAILY_GOAL_REACHED':
        pool = d.onDailyGoalReached;
        break;
      case 'FLASHCARD_REVIEW':
        pool = d.onFlashcardReview;
        break;
      case 'STRUGGLING_TASK':
        pool = d.onStrugglingTask;
        break;
      case 'PERSONAL_BEST':
        pool = d.onPersonalBest;
        break;
      case 'TUTOR_SELECTED':
        pool = d.onTutorSelected;
        break;
      case 'GREETING':
      default:
        pool = d.greetings;
        break;
    }

    if (!pool || pool.length === 0) {
      pool = d.greetings;
    }

    // Check if affinity level unlocks special dialogue
    const affinity = rpgStore.getTutorAffinity(effectiveTutorId);
    if (affinity.affinityLevel >= 3 && d.unlockedDialogue && d.unlockedDialogue.length > 0) {
      // 25% chance to show unlocked intimacy dialogue on greetings or completions
      if ((event === 'GREETING' || event === 'SESSION_COMPLETE') && Math.random() < 0.25) {
        pool = d.unlockedDialogue;
      }
    }

    // Pick non-repeating message
    const chosenText = pool[Math.floor(Math.random() * pool.length)];
    const message = extraContext ? `${chosenText} ${extraContext}` : chosenText;

    const dialogueRecord: ActiveTutorDialogue = {
      id: `diag-${Date.now()}`,
      tutorId: profile.id,
      tutorName: profile.name,
      event,
      message,
      timestamp: now,
    };

    this.currentDialogue = dialogueRecord;
    this.notify();

    // Auto-dismiss after 9 seconds if not interacted
    setTimeout(() => {
      if (this.currentDialogue?.id === dialogueRecord.id) {
        this.dismiss();
      }
    }, 9000);

    return dialogueRecord;
  }
}

export const tutorDialogueService = new TutorDialogueService();
