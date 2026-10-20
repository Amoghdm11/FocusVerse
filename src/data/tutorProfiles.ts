import { TutorEcosystemProfile, TutorCosmeticUnlock } from '../types/rpg';

/**
 * 20-TUTOR ECOSYSTEM COMPREHENSIVE REGISTRY
 * Each profile is permanently linked to the 20 existing models in src/data/characters.ts
 * Providing distinct personalities, communication styles, study roles, and event dialogue.
 */

export const TUTOR_SPECIALTY_CATEGORIES = [
  'Mathematics & Problem Solving',
  'Programming & Systems',
  'Science & Engineering',
  'Languages & Writing',
  'Memorization & Active Recall',
  'Exam Preparation',
  'Planning & Productivity',
  'Research & Analysis',
  'Creative Thinking',
  'Mindfulness & Habit Building',
] as const;

export const TUTOR_ECOSYSTEM_PROFILES: Record<string, TutorEcosystemProfile> = {
  // 01/20 Peter Parker
  'peter-parker': {
    id: 'peter-parker',
    name: 'Peter Parker (Spider-Man)',
    characterIndex: '01/20',
    archetype: 'FRIENDLY_COMPANION',
    communicationStyle: 'Enthusiastic, approachable, grounded in physics & code',
    tone: 'Encouraging, curious, balances humor with serious academic focus',
    encouragementStyle: 'Celebrates perseverance through tough problems; reminds you that everyone stumbles before sticking the landing.',
    preferredStudyMethods: ['Feynman Technique (Teach It)', 'Worked Example Breakdown', '25m Pomodoro Sprints'],
    suggestedDuration: 25,
    suggestedBreak: 5,
    primarySpecialty: 'Mathematics & Problem Solving',
    secondarySpecialties: ['Science & Engineering', 'Programming & Systems'],
    difficultyPreference: 'ALL_LEVELS',
    shortBio: 'Midtown High scholar and Queens lab researcher. Understands balancing heavy responsibilities with grueling problem sets.',
    dialogue: {
      greetings: [
        'Hey! Ready to swing into today’s problem set? Keep your focus tight!',
        'Spider-sense is tingling... smells like a breakthrough is incoming!',
        'No problem is too tricky if we break it down into clean equations.',
      ],
      onStart: [
        'Web-lines calibrated! Let’s lock in and crack this material.',
        'Timer running! Zero distractions until the clock runs out.',
      ],
      onPause: [
        'Quick breather? All good, just don’t lose your momentum.',
        'Paused. Catch your breath and let’s get right back to the whiteboard.',
      ],
      onResume: [
        'Back on the line! Let’s pick up right where we left off.',
        'Momentum restored. Eyes on the equations!',
      ],
      onBreak: [
        'Great sprint! Shake out your wrists and grab some water.',
        'Break time! Even web-slingers have to rest their muscles.',
      ],
      onBreakReturn: [
        'Refreshed and ready? Let’s tackle the next checkpoint.',
        'Back to the desk! Your neurons should be recharged now.',
      ],
      onTaskComplete: [
        'Boom! Problem cleared from the queue. Great execution!',
        'Checked off! That’s how you build unstoppable momentum.',
      ],
      onSessionComplete: [
        'Session complete! Look at all those minutes banked in your ledger.',
        'Outstanding work today. You stayed locked in the whole way.',
      ],
      onSessionInterrupted: [
        'Life happens! We can always calibrate another sprint when you are ready.',
      ],
      onDailyGoalReached: [
        'Daily focus goal smashed! That is true superhero dedication.',
      ],
      onFlashcardReview: [
        'Flashcards reviewed! Active recall is like muscle memory for your brain.',
      ],
      onStrugglingTask: [
        'Stuck on this one? Take a deep breath. Trace it step by step from first principles.',
      ],
      onPersonalBest: [
        'Whoa! New personal focus record! Look at that endurance leveling up!',
      ],
      onTutorSelected: [
        'Peter Parker on duty! Let’s make this study session count.',
      ],
      unlockedDialogue: [
        'You know, seeing your discipline reminds me why we do the hard work in the first place.',
      ],
    },
    challenges: [
      {
        id: 'chal-peter-1',
        tutorId: 'peter-parker',
        title: 'Midtown Calculus Drill',
        description: 'Complete two 25-minute focus sessions with zero distractions.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-peter-2',
        tutorId: 'peter-parker',
        title: 'Formula Web Recall',
        description: 'Review 15 active recall flashcards to strengthen memory retention.',
        requirement: 'Review 15 flashcards',
        target: 15,
        progress: 0,
        completed: false,
        xpReward: 60,
        affinityReward: 40,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-peter-3',
        tutorId: 'peter-parker',
        title: 'Queens Lab Persistence',
        description: 'Accumulate 60 total focus minutes alongside Peter Parker.',
        requirement: 'Log 60 minutes with Peter',
        target: 60,
        progress: 0,
        completed: false,
        xpReward: 120,
        affinityReward: 80,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 02/20 Batman (Bruce Wayne)
  'bruce-wayne': {
    id: 'bruce-wayne',
    name: 'Batman (Bruce Wayne)',
    characterIndex: '02/20',
    archetype: 'STRICT_MENTOR',
    communicationStyle: 'Direct, disciplined, structured, minimal words',
    tone: 'Commanding, solemn, relentless insistence on mental fortitude',
    encouragementStyle: 'Acknowledges stoic effort; values preparation over luck and emotional excuses.',
    preferredStudyMethods: ['Time-Blocking', 'Deep Work Isolation (45-60m)', 'Error Journaling'],
    suggestedDuration: 50,
    suggestedBreak: 10,
    primarySpecialty: 'Exam Preparation',
    secondarySpecialties: ['Planning & Productivity', 'Research & Analysis'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Master tactician and world-class forensic researcher. Treats study preparation as an exacting battlefield discipline.',
    dialogue: {
      greetings: [
        'The city never sleeps, and neither does progress. State your objective.',
        'Preparation eliminates fear. Open your books.',
        'Distraction is a vulnerability. Eliminate it.',
      ],
      onStart: [
        'Batcave telemetry initialized. Fifty minutes of unbroken deep focus.',
        'Protocol engaged. Do not look away until the task is complete.',
      ],
      onPause: [
        'Pause recorded. Identify the disturbance and rectify it immediately.',
        'Momentum severed. Stand by to resume.',
      ],
      onResume: [
        'Resuming investigation. Focus your intellect.',
        'Back to the mission. No hesitation.',
      ],
      onBreak: [
        'Interval reached. Stand up, hydrate, lower your pulse.',
        'A tactician knows when to rest. Clear your mind.',
      ],
      onBreakReturn: [
        'Break concluded. Return to your station.',
        'Mental baseline restored. Re-engage.',
      ],
      onTaskComplete: [
        'Objective cleared. Advance to the next priority.',
        'Checked. Progress demands consistency.',
      ],
      onSessionComplete: [
        'Session finished. Record your telemetry in the logbook.',
        'Disciplined execution. That is how mastery is forged.',
      ],
      onSessionInterrupted: [
        'Incomplete session noted. Reassess your study environment.',
      ],
      onDailyGoalReached: [
        'Target quota fulfilled. Gotham’s standards have been met.',
      ],
      onFlashcardReview: [
        'Forensic recall verified. Retaining data under pressure is critical.',
      ],
      onStrugglingTask: [
        'If the method fails, re-examine the axioms. Break the problem into sub-problems.',
      ],
      onPersonalBest: [
        'New record logged in the Batcomputer. Maintain this standard.',
      ],
      onTutorSelected: [
        'Batman standing watch. Let nothing break your concentration.',
      ],
      unlockedDialogue: [
        'You have shown true mental fortitude. Few sustain this degree of discipline.',
      ],
    },
    challenges: [
      {
        id: 'chal-bruce-1',
        tutorId: 'bruce-wayne',
        title: 'Nocturnal Deep Work',
        description: 'Complete a single 50-minute focus session without logging any distraction.',
        requirement: '50m session with 0 distractions',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 100,
        affinityReward: 60,
        type: 'ZERO_DISTRACTIONS',
      },
      {
        id: 'chal-bruce-2',
        tutorId: 'bruce-wayne',
        title: 'Forensic Task Clearance',
        description: 'Eliminate 3 study tasks from your protocol queue.',
        requirement: 'Complete 3 tasks',
        target: 3,
        progress: 0,
        completed: false,
        xpReward: 90,
        affinityReward: 50,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-bruce-3',
        tutorId: 'bruce-wayne',
        title: 'Batcave Operational Quota',
        description: 'Accumulate 90 total focus minutes alongside Batman.',
        requirement: 'Log 90 minutes with Batman',
        target: 90,
        progress: 0,
        completed: false,
        xpReward: 150,
        affinityReward: 100,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 03/20 Tony Stark (Iron Man)
  'tony-stark': {
    id: 'tony-stark',
    name: 'Tony Stark (Iron Man)',
    characterIndex: '03/20',
    archetype: 'COMPETITIVE_COACH',
    communicationStyle: 'Rapid-fire, tech-savvy, witty, ambitious',
    tone: 'Confident, electrifying, pushes you to iterate quickly and build real things',
    encouragementStyle: 'Challenges you to beat your past velocity; treats errors as debugging telemetry.',
    preferredStudyMethods: ['Rapid Prototyping', 'Interval Code Sprints', 'High-Intensity Flow Blocks'],
    suggestedDuration: 35,
    suggestedBreak: 7,
    primarySpecialty: 'Programming & Systems',
    secondarySpecialties: ['Science & Engineering', 'Mathematics & Problem Solving'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Billionaire tech innovator and chief engineer. Believes genius is mostly coffee, iterations, and refusal to settle.',
    dialogue: {
      greetings: [
        'JARVIS is compiling your study queue. What are we revolutionizing today?',
        'Arc reactor is humming at 100%. Let’s build something extraordinary.',
        'Don’t just read the documentation—let’s write the code.',
      ],
      onStart: [
        'Ignition sequence initiated! Let’s blow past standard human benchmarks.',
        'Compiling focus protocol. Code fast, debug clean.',
      ],
      onPause: [
        'System paused. Minor thermal throttling? Let’s cool down and reboot.',
      ],
      onResume: [
        'Re-engaging repulsors! Let’s crush this algorithm.',
      ],
      onBreak: [
        'Coffee break. Grab an espresso. Brain cooling fans on high.',
      ],
      onBreakReturn: [
        'Re-docked. Next iteration is going to be twice as fast.',
      ],
      onTaskComplete: [
        'Ship it! Mark that feature merged and pushed to production.',
      ],
      onSessionComplete: [
        'Boom! Prototype stable. That was an A+ sprint.',
      ],
      onSessionInterrupted: [
        'Glitch detected in the workflow. Reset your test bench.',
      ],
      onDailyGoalReached: [
        'Daily quota surpassed. Even Stark Industries would be impressed.',
      ],
      onFlashcardReview: [
        'Neural weights updated. Your cache hit rate is looking sharp.',
      ],
      onStrugglingTask: [
        'Sometimes you gotta run before you can walk. Strip the bloat, test the minimal case.',
      ],
      onPersonalBest: [
        'New record! I’m naming this firmware patch after you.',
      ],
      onTutorSelected: [
        'Tony Stark in your corner. Let’s invent the future.',
      ],
      unlockedDialogue: [
        'Honestly? Your learning speed is approaching Mark VII telemetry levels.',
      ],
    },
    challenges: [
      {
        id: 'chal-tony-1',
        tutorId: 'tony-stark',
        title: 'Arc Reactor Sprint',
        description: 'Complete two high-intensity 35-minute sprints.',
        requirement: 'Complete 2 focus sprints',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 85,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-tony-2',
        tutorId: 'tony-stark',
        title: 'Debug Pipeline',
        description: 'Check off 2 challenging programming or logic tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-tony-3',
        tutorId: 'tony-stark',
        title: 'High-Velocity Focus',
        description: 'Bank 70 minutes of study telemetry alongside Tony Stark.',
        requirement: 'Log 70 minutes with Tony',
        target: 70,
        progress: 0,
        completed: false,
        xpReward: 130,
        affinityReward: 85,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 04/20 Miles Morales
  'miles-morales': {
    id: 'miles-morales',
    name: 'Miles Morales',
    characterIndex: '04/20',
    archetype: 'FRIENDLY_COMPANION',
    communicationStyle: 'Casual, artistic, relatable, urban energy',
    tone: 'Warm, authentic, emphasizes finding your own rhythm in difficult subjects',
    encouragementStyle: 'Helps overcome imposter syndrome; reminds you that learning is an art form.',
    preferredStudyMethods: ['Visual Mind-Mapping', 'Color-Coded Notes', '25m Creative Intervals'],
    suggestedDuration: 25,
    suggestedBreak: 5,
    primarySpecialty: 'Creative Thinking',
    secondarySpecialties: ['Programming & Systems', 'Languages & Writing'],
    difficultyPreference: 'BEGINNER',
    shortBio: 'Brooklyn vision school student and spider-hero. Balances sketchbook creativity with demanding physics assignments.',
    dialogue: {
      greetings: [
        'What’s up, danger? Ready to sketch out some serious knowledge today?',
        'Brooklyn style: we don’t run from hard problems, we make our own path.',
      ],
      onStart: [
        'Time to leap! You don’t have to know every step—just the next one.',
      ],
      onPause: [
        'Pause button hit. Catch your balance, we got this.',
      ],
      onResume: [
        'Back on the beat. Let’s keep that rhythm moving!',
      ],
      onBreak: [
        'Nice round! Pop on some music and stretch your legs.',
      ],
      onBreakReturn: [
        'All right, batteries charged. Let’s make something dope.',
      ],
      onTaskComplete: [
        'Nailed it! Another piece on the wall.',
      ],
      onSessionComplete: [
        'Session cleared! That was clean work.',
      ],
      onSessionInterrupted: [
        'Don’t sweat it. We reboot and go again.',
      ],
      onDailyGoalReached: [
        'Daily goal crushed! Look at you go.',
      ],
      onFlashcardReview: [
        'Memory cards looking crisp. Spaced repetition for the win.',
      ],
      onStrugglingTask: [
        'It’s just a leap of faith. Step back, reframe the angle, try again.',
      ],
      onPersonalBest: [
        'New record! That’s officially your highest leap yet.',
      ],
      onTutorSelected: [
        'Miles on the beat! Let’s get to work.',
      ],
      unlockedDialogue: [
        'You’re doing your own thing and owning it. That’s what matters most.',
      ],
    },
    challenges: [
      {
        id: 'chal-miles-1',
        tutorId: 'miles-morales',
        title: 'Brooklyn Vision Sprint',
        description: 'Complete two 25-minute study sprints with Miles.',
        requirement: 'Complete 2 focus sprints',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-miles-2',
        tutorId: 'miles-morales',
        title: 'Notebook Color-Code',
        description: 'Complete 1 study task and review 10 flashcards.',
        requirement: 'Review 10 flashcards',
        target: 10,
        progress: 0,
        completed: false,
        xpReward: 60,
        affinityReward: 40,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-miles-3',
        tutorId: 'miles-morales',
        title: 'Miles Rhythm Block',
        description: 'Log 50 focused minutes with Miles Morales.',
        requirement: 'Log 50 minutes with Miles',
        target: 50,
        progress: 0,
        completed: false,
        xpReward: 100,
        affinityReward: 70,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 05/20 Gwen Stacy
  'gwen-stacy': {
    id: 'gwen-stacy',
    name: 'Gwen Stacy (Spider-Gwen)',
    characterIndex: '05/20',
    archetype: 'CHILL_COMPANION',
    communicationStyle: 'Rhythmic, calm, focused, musical flow',
    tone: 'Centered, collected, blends drum timing with balanced study habits',
    encouragementStyle: 'Focuses on keeping a sustainable tempo so you don’t burn out before your exams.',
    preferredStudyMethods: ['Rhythmic Pomodoro', 'Audio Lo-Fi Study', 'Interleaved Practice'],
    suggestedDuration: 30,
    suggestedBreak: 6,
    primarySpecialty: 'Mindfulness & Habit Building',
    secondarySpecialties: ['Science & Engineering', 'Languages & Writing'],
    difficultyPreference: 'INTERMEDIATE',
    shortBio: 'Drummer for The Mary Janes and dimension-traveling heroine. Champions rhythmic composure and steady endurance.',
    dialogue: {
      greetings: [
        'Hey. Ready to find your groove today? Keep the tempo steady.',
        'Study like you’re keeping time on the drums: clear, relaxed, in the pocket.',
      ],
      onStart: [
        'Count-in: one, two, three, four. Deep focus starts now.',
      ],
      onPause: [
        'Dropping the tempo for a second. Breathe easy.',
      ],
      onResume: [
        'Back on the downbeat. Let’s flow.',
      ],
      onBreak: [
        'Solid set. Step away, shake your hands, listen to the rain.',
      ],
      onBreakReturn: [
        'Re-tuned and ready. Let’s play the second verse.',
      ],
      onTaskComplete: [
        'Clean beat! That task is done and dusted.',
      ],
      onSessionComplete: [
        'Set finished! Look at that rhythm you kept up today.',
      ],
      onSessionInterrupted: [
        'Missed a beat? No big deal, we count back in.',
      ],
      onDailyGoalReached: [
        'Daily rhythm complete. You earned that peace of mind.',
      ],
      onFlashcardReview: [
        'Cards locked in like tight snare hits.',
      ],
      onStrugglingTask: [
        'Slow down the tempo. When a rhythm is complex, practice at half-speed first.',
      ],
      onPersonalBest: [
        'New record! That was your tightest performance yet.',
      ],
      onTutorSelected: [
        'Gwen Stacy calibrated. Let’s find our focus tempo.',
      ],
      unlockedDialogue: [
        'You have this calm confidence when you work. It’s contagious.',
      ],
    },
    challenges: [
      {
        id: 'chal-gwen-1',
        tutorId: 'gwen-stacy',
        title: 'Tempo Control',
        description: 'Complete two 30-minute steady-tempo study blocks.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 75,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-gwen-2',
        tutorId: 'gwen-stacy',
        title: 'Rhythmic Recall',
        description: 'Review 12 flashcards to maintain your learning tempo.',
        requirement: 'Review 12 flashcards',
        target: 12,
        progress: 0,
        completed: false,
        xpReward: 60,
        affinityReward: 40,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-gwen-3',
        tutorId: 'gwen-stacy',
        title: 'Drummer Endurance',
        description: 'Accumulate 60 focused minutes alongside Gwen Stacy.',
        requirement: 'Log 60 minutes with Gwen',
        target: 60,
        progress: 0,
        completed: false,
        xpReward: 110,
        affinityReward: 75,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 06/20 Naruto Uzumaki
  'naruto-uzumaki': {
    id: 'naruto-uzumaki',
    name: 'Naruto Uzumaki',
    characterIndex: '06/20',
    archetype: 'COMPETITIVE_COACH',
    communicationStyle: 'High-energy, passionate, unwavering grit',
    tone: 'Boisterous, inspirational, refuses to let you give up on hard material',
    encouragementStyle: 'Treats every difficult formula like an S-rank jutsu: practice it a thousand times until it becomes second nature.',
    preferredStudyMethods: ['High-Repetition Practice', 'Active Recitation', 'Grit Sprints (30m)'],
    suggestedDuration: 30,
    suggestedBreak: 5,
    primarySpecialty: 'Memorization & Active Recall',
    secondarySpecialties: ['Exam Preparation', 'Planning & Productivity'],
    difficultyPreference: 'ALL_LEVELS',
    shortBio: 'Hokage of Konoha who rose through sheer grit and stubborn refusal to quit. Master of turning failure into fuel.',
    dialogue: {
      greetings: [
        'Believe it! Today we’re going to master this entire syllabus!',
        'No shortcuts on the ninja way! Let’s get our hands dirty with this study block!',
      ],
      onStart: [
        'Shadow clone focus jutsu! Put all your chakra into this task!',
      ],
      onPause: [
        'Hey, catch your breath! But don’t you dare give up!',
      ],
      onResume: [
        'Back in the fight! Dattebayo!',
      ],
      onBreak: [
        'Ramen break! Well, at least some water and snacks. Great round!',
      ],
      onBreakReturn: [
        'Refueled? Let’s blast through the next round of questions!',
      ],
      onTaskComplete: [
        'Yeah! Another mission cleared! That’s how a ninja does it!',
      ],
      onSessionComplete: [
        'Session conquered! You gave it 100%! I’m proud of you!',
      ],
      onSessionInterrupted: [
        'We stumble, we get back up! Dust off your desk and try again!',
      ],
      onDailyGoalReached: [
        'Hokage-level dedication right there! Daily goal achieved!',
      ],
      onFlashcardReview: [
        'Drilling those cards over and over! Muscle memory unlocked!',
      ],
      onStrugglingTask: [
        'I failed the academy exam three times! A hard problem just means you’re about to level up!',
      ],
      onPersonalBest: [
        'NEW PERSONAL BEST! Believe it! You’re stronger than yesterday!',
      ],
      onTutorSelected: [
        'Naruto is here! Let’s train like champions!',
      ],
      unlockedDialogue: [
        'When you work this hard, people notice. Keep pushing your limits!',
      ],
    },
    challenges: [
      {
        id: 'chal-naruto-1',
        tutorId: 'naruto-uzumaki',
        title: 'Ninja Way Sprint',
        description: 'Complete two 30-minute grit sprints without quitting early.',
        requirement: 'Complete 2 focus sprints',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-naruto-2',
        tutorId: 'naruto-uzumaki',
        title: 'Chakra Memory Drills',
        description: 'Review 20 active recall flashcards with high accuracy.',
        requirement: 'Review 20 flashcards',
        target: 20,
        progress: 0,
        completed: false,
        xpReward: 75,
        affinityReward: 45,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-naruto-3',
        tutorId: 'naruto-uzumaki',
        title: 'Hokage Endurance',
        description: 'Accumulate 60 focus minutes alongside Naruto.',
        requirement: 'Log 60 minutes with Naruto',
        target: 60,
        progress: 0,
        completed: false,
        xpReward: 120,
        affinityReward: 80,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 07/20 Gojo Satoru
  'gojo-satoru': {
    id: 'gojo-satoru',
    name: 'Gojo Satoru',
    characterIndex: '07/20',
    archetype: 'WISE_MENTOR',
    communicationStyle: 'Effortlessly confident, playful, conceptually deep',
    tone: 'Playful mastery; views complex concepts as simple geometries once understood',
    encouragementStyle: 'Helps you realize that once you understand the core invariant, the rest of the problem collapses effortlessly.',
    preferredStudyMethods: ['Conceptual Simplification', 'First-Principles Intuition', '40m Flow Blocks'],
    suggestedDuration: 40,
    suggestedBreak: 8,
    primarySpecialty: 'Mathematics & Problem Solving',
    secondarySpecialties: ['Science & Engineering', 'Research & Analysis'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Limitless sorcerer and master instructor at Tokyo Jujutsu High. Sees the boundless structure behind complex mathematics.',
    dialogue: {
      greetings: [
        'Don’t worry. You’ve got the strongest tutor in the world on your side.',
        'Ready to see through the infinity of this syllabus? It’s easier than you think.',
      ],
      onStart: [
        'Infinity barrier active. Zero distractions can reach your desk now.',
      ],
      onPause: [
        'Taking a pause? Don’t let the world outside catch up to your thoughts.',
      ],
      onResume: [
        'Back inside the domain. Let’s finish this calculation.',
      ],
      onBreak: [
        'Break time! Maybe some sweets? A relaxed mind learns twice as fast.',
      ],
      onBreakReturn: [
        'Sugar levels optimal? Let’s dismantle the next chapter.',
      ],
      onTaskComplete: [
        'Too easy! Another concept mastered.',
      ],
      onSessionComplete: [
        'Flawless execution. Look at that focus—pure greatness.',
      ],
      onSessionInterrupted: [
        'Domain collapsed? Let’s reconstruct it when you are ready.',
      ],
      onDailyGoalReached: [
        'Daily quota cleared. You’re becoming truly formidable.',
      ],
      onFlashcardReview: [
        'Six Eyes verified: those concepts are burned into your neural pathways.',
      ],
      onStrugglingTask: [
        'Don’t fight the complexity. Zoom out. What is the one thing that never changes in this problem?',
      ],
      onPersonalBest: [
        'Look at that record! You might just reach my tier one of these days.',
      ],
      onTutorSelected: [
        'Gojo Satoru is in session. Let’s have some fun with this material.',
      ],
      unlockedDialogue: [
        'You’re starting to see through the noise naturally now. That’s real mastery.',
      ],
    },
    challenges: [
      {
        id: 'chal-gojo-1',
        tutorId: 'gojo-satoru',
        title: 'Limitless Focus Domain',
        description: 'Complete a 40-minute focus session with zero distractions.',
        requirement: '40m session with 0 distractions',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 90,
        affinityReward: 60,
        type: 'ZERO_DISTRACTIONS',
      },
      {
        id: 'chal-gojo-2',
        tutorId: 'gojo-satoru',
        title: 'Complex Proof Mastery',
        description: 'Complete 2 challenging math or logic tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 85,
        affinityReward: 50,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-gojo-3',
        tutorId: 'gojo-satoru',
        title: 'Six Eyes Study Block',
        description: 'Accumulate 80 focus minutes alongside Gojo Satoru.',
        requirement: 'Log 80 minutes with Gojo',
        target: 80,
        progress: 0,
        completed: false,
        xpReward: 140,
        affinityReward: 90,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 08/20 Levi Ackerman
  'levi-ackerman': {
    id: 'levi-ackerman',
    name: 'Levi Ackerman',
    characterIndex: '08/20',
    archetype: 'STRICT_MENTOR',
    communicationStyle: 'Laconic, sharp, immaculate standards, zero clutter',
    tone: 'Crisp, deadpan, expects your workspace and thoughts to be spotless',
    encouragementStyle: 'Respects quiet execution over loud promises; tells you plainly when your work is clean.',
    preferredStudyMethods: ['Desk Cleanse Protocol', 'Intensive Sprints (45m)', 'Bug Elimination Drills'],
    suggestedDuration: 45,
    suggestedBreak: 8,
    primarySpecialty: 'Planning & Productivity',
    secondarySpecialties: ['Programming & Systems', 'Exam Preparation'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Captains the Survey Corps Special Operations Squad. Renowned for surgical execution, spotless organization, and decisive action.',
    dialogue: {
      greetings: [
        'Is your desk clean? Good. Then sit down and open the material.',
        'Don’t waste my time or yours. What is the single most important task?',
      ],
      onStart: [
        'Timer running. No sloppy mistakes. Clean execution.',
      ],
      onPause: [
        'Why are we stopped? Make your decision quickly.',
      ],
      onResume: [
        'Back to work. Cut through the remaining problems.',
      ],
      onBreak: [
        'Stand up. Wipe down your desk. Tea is acceptable.',
      ],
      onBreakReturn: [
        'Break is over. Back in your seat.',
      ],
      onTaskComplete: [
        'Clean cut. Task eliminated without wasted motion.',
      ],
      onSessionComplete: [
        'Session finished. Not bad. The work was acceptable.',
      ],
      onSessionInterrupted: [
        'Disorderly retreat. Clean your slate and prepare properly next time.',
      ],
      onDailyGoalReached: [
        'Daily quota cleared. You didn’t embarrass the squad today.',
      ],
      onFlashcardReview: [
        'Precision verified. No sloppy answers.',
      ],
      onStrugglingTask: [
        'Stop overthinking. Strip away the garbage and look at what’s right in front of you.',
      ],
      onPersonalBest: [
        'New record. Keep this standard every day, not just when you feel like it.',
      ],
      onTutorSelected: [
        'Captain Levi on deck. Eliminate distractions and let’s work.',
      ],
      unlockedDialogue: [
        'You’ve developed clean habits. I respect someone who doesn’t complain and gets the job done.',
      ],
    },
    challenges: [
      {
        id: 'chal-levi-1',
        tutorId: 'levi-ackerman',
        title: 'Spotless Desk Protocol',
        description: 'Complete a 45-minute sprint with zero distraction interruptions.',
        requirement: '45m session with 0 distractions',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 95,
        affinityReward: 60,
        type: 'ZERO_DISTRACTIONS',
      },
      {
        id: 'chal-levi-2',
        tutorId: 'levi-ackerman',
        title: 'Task Elimination Slices',
        description: 'Check off 3 tasks cleanly from your list.',
        requirement: 'Complete 3 tasks',
        target: 3,
        progress: 0,
        completed: false,
        xpReward: 85,
        affinityReward: 50,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-levi-3',
        tutorId: 'levi-ackerman',
        title: 'Special Ops Grind',
        description: 'Log 90 minutes of disciplined study with Captain Levi.',
        requirement: 'Log 90 minutes with Levi',
        target: 90,
        progress: 0,
        completed: false,
        xpReward: 150,
        affinityReward: 100,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 09/20 L Lawliet
  'l-lawliet': {
    id: 'l-lawliet',
    name: 'L Lawliet',
    characterIndex: '09/20',
    archetype: 'WISE_MENTOR',
    communicationStyle: 'Analytical, eccentric, calculates probabilities in percent',
    tone: 'Unflappable, inquisitive, evaluates every problem like an intricate case file',
    encouragementStyle: 'Encourages questioning assumptions and looking at contradictory clues.',
    preferredStudyMethods: ['Deductive Tree Analysis', 'Deep Hypothesizing', '35m Analytical Blocks'],
    suggestedDuration: 35,
    suggestedBreak: 7,
    primarySpecialty: 'Research & Analysis',
    secondarySpecialties: ['Mathematics & Problem Solving', 'Programming & Systems'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'World’s greatest consulting detective. Solves impossible mysteries through unconventional deduction and sugar-fueled focus.',
    dialogue: {
      greetings: [
        'There is a 97.4% chance that regular study habits yield an optimal outcome today.',
        'I have analyzed your study syllabus. Let us inspect the anomalies.',
      ],
      onStart: [
        'Deduction begins. Let us observe the evidence carefully.',
      ],
      onPause: [
        'Anomalous halt. What new variable has appeared?',
      ],
      onResume: [
        'Hypothesis resumed. Continue connecting the logic.',
      ],
      onBreak: [
        'Interval reached. I suggest high-glucose refreshments to maintain brain function.',
      ],
      onBreakReturn: [
        'Cognitive glucose restored. Let us re-examine the theorem.',
      ],
      onTaskComplete: [
        'The conclusion was inevitable. Case closed on this problem.',
      ],
      onSessionComplete: [
        'The data proves your focus was solid. 100% deduction confirmed.',
      ],
      onSessionInterrupted: [
        'An unexpected contradiction occurred. We must adjust the framework.',
      ],
      onDailyGoalReached: [
        'Daily quota achieved. The statistical outcome is undeniably positive.',
      ],
      onFlashcardReview: [
        'Recall efficiency verified at 99.2%. An acceptable result.',
      ],
      onStrugglingTask: [
        'When you eliminate all which is impossible, then whatever remains, however improbable, must be the truth.',
      ],
      onPersonalBest: [
        'A new high-water mark for study endurance. Statistically significant.',
      ],
      onTutorSelected: [
        'L Lawliet connected. Let us solve this case.',
      ],
      unlockedDialogue: [
        'I find your analytical reasoning quite interesting. Few students grasp nuance so quickly.',
      ],
    },
    challenges: [
      {
        id: 'chal-l-1',
        tutorId: 'l-lawliet',
        title: 'Deductive Reasoning Sprint',
        description: 'Complete two 35-minute research or analytical study blocks.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-l-2',
        tutorId: 'l-lawliet',
        title: 'Case File Recall',
        description: 'Review 15 active recall flashcards with high accuracy.',
        requirement: 'Review 15 flashcards',
        target: 15,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-l-3',
        tutorId: 'l-lawliet',
        title: 'Supercomputer Deduction',
        description: 'Accumulate 70 total focus minutes alongside L Lawliet.',
        requirement: 'Log 70 minutes with L',
        target: 70,
        progress: 0,
        completed: false,
        xpReward: 130,
        affinityReward: 85,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 10/20 Elsa
  'elsa': {
    id: 'elsa',
    name: 'Elsa',
    characterIndex: '10/20',
    archetype: 'CHILL_COMPANION',
    communicationStyle: 'Serene, crystalline clarity, composed and majestic',
    tone: 'Soothing, poised, helps channel emotional overwhelm into crystal-clear focus',
    encouragementStyle: 'Helps freeze out performance anxiety and build steady, structured confidence.',
    preferredStudyMethods: ['Structured Outlining', 'Calm Thesis Writing', '30m Serene Blocks'],
    suggestedDuration: 30,
    suggestedBreak: 5,
    primarySpecialty: 'Languages & Writing',
    secondarySpecialties: ['Mindfulness & Habit Building', 'Creative Thinking'],
    difficultyPreference: 'ALL_LEVELS',
    shortBio: 'Queen of Arendelle who learned that true power comes from calm mastery and inner peace.',
    dialogue: {
      greetings: [
        'Welcome. Take a slow, steady breath. Let us bring crystal clarity to your work.',
        'Do not let self-doubt freeze your progress. Step forward with confidence.',
      ],
      onStart: [
        'The cold never bothered our concentration anyway. Let’s focus.',
      ],
      onPause: [
        'Pause and compose yourself. Peace is always within reach.',
      ],
      onResume: [
        'Clarity returns. Let your thoughts flow smoothly.',
      ],
      onBreak: [
        'Breathe in the calm air. Rest your eyes and soften your shoulders.',
      ],
      onBreakReturn: [
        'Restored and centered. Let us sculpt the next paragraph.',
      ],
      onTaskComplete: [
        'Beautifully done. Crystal clear and complete.',
      ],
      onSessionComplete: [
        'Session finished in harmony. You held your composure with grace.',
      ],
      onSessionInterrupted: [
        'A momentary storm. Let it pass, then rebuild your focus.',
      ],
      onDailyGoalReached: [
        'Daily milestone achieved. A masterwork of calm dedication.',
      ],
      onFlashcardReview: [
        'Each concept frozen perfectly into memory.',
      ],
      onStrugglingTask: [
        'Fear creates chaos. Let go of the pressure, and look at the truth of the sentence.',
      ],
      onPersonalBest: [
        'A magnificent new achievement! Your focus is truly shining.',
      ],
      onTutorSelected: [
        'Elsa is here to support you. Let peace guide your study.',
      ],
      unlockedDialogue: [
        'You have discovered your own inner strength. It is a privilege to watch you learn.',
      ],
    },
    challenges: [
      {
        id: 'chal-elsa-1',
        tutorId: 'elsa',
        title: 'Crystalline Composure',
        description: 'Complete two 30-minute peaceful focus sessions.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 75,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-elsa-2',
        tutorId: 'elsa',
        title: 'Clear Mind Writing',
        description: 'Complete 2 writing, reading, or structured study tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-elsa-3',
        tutorId: 'elsa',
        title: 'Winter Palace Sanctuary',
        description: 'Accumulate 60 focused minutes alongside Elsa.',
        requirement: 'Log 60 minutes with Elsa',
        target: 60,
        progress: 0,
        completed: false,
        xpReward: 115,
        affinityReward: 75,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 11/20 Rapunzel
  'rapunzel': {
    id: 'rapunzel',
    name: 'Rapunzel',
    characterIndex: '11/20',
    archetype: 'FRIENDLY_COMPANION',
    communicationStyle: 'Curious, imaginative, sunny, enthusiastic',
    tone: 'Delightfully enthusiastic, views study as an exciting treasure hunt of knowledge',
    encouragementStyle: 'Turns dull memorization into vivid stories and illustrated diagrams.',
    preferredStudyMethods: ['Illustrated Study Guides', 'Storytelling Mnemonic', '25m Creative Pomodoros'],
    suggestedDuration: 25,
    suggestedBreak: 5,
    primarySpecialty: 'Creative Thinking',
    secondarySpecialties: ['Languages & Writing', 'Memorization & Active Recall'],
    difficultyPreference: 'BEGINNER',
    shortBio: 'Artist, reader, and adventurer with boundless curiosity for history, art, and literature.',
    dialogue: {
      greetings: [
        'Best day ever! What fascinating new world are we studying today?',
        'I’ve got my paints, my books, and endless curiosity! Let’s dive in!',
      ],
      onStart: [
        'Step out of the tower! Let’s explore this chapter!',
      ],
      onPause: [
        'Taking a quick peek out the window? Let’s stay close to our page.',
      ],
      onResume: [
        'And we are back! The story continues!',
      ],
      onBreak: [
        'Time to stretch, paint a little sketch, or grab some tea!',
      ],
      onBreakReturn: [
        'Ready! What happens next in our notes?',
      ],
      onTaskComplete: [
        'Yay! We did it! Another dream checked off the bucket list!',
      ],
      onSessionComplete: [
        'Look at all that we learned! I’m going to paint a whole mural about this!',
      ],
      onSessionInterrupted: [
        'No worries! Adventures have twists and turns. We’ll jump back in soon.',
      ],
      onDailyGoalReached: [
        'You reached the floating lights! Daily goal accomplished!',
      ],
      onFlashcardReview: [
        'Flashcards done! Memory like a glowing lantern!',
      ],
      onStrugglingTask: [
        'When you’re stuck, tell the idea like a fairy tale. Who are the characters? What is the quest?',
      ],
      onPersonalBest: [
        'NEW PERSONAL BEST! I knew you could do it!',
      ],
      onTutorSelected: [
        'Rapunzel reporting for study duty! Let’s make this colorful!',
      ],
      unlockedDialogue: [
        'Your imagination brings every concept to life. Learning with you is pure joy.',
      ],
    },
    challenges: [
      {
        id: 'chal-rapunzel-1',
        tutorId: 'rapunzel',
        title: 'Tower Explorer',
        description: 'Complete two 25-minute creative study blocks.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-rapunzel-2',
        tutorId: 'rapunzel',
        title: 'Lantern Memory Cards',
        description: 'Review 15 flashcards to brighten your recall.',
        requirement: 'Review 15 flashcards',
        target: 15,
        progress: 0,
        completed: false,
        xpReward: 65,
        affinityReward: 40,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-rapunzel-3',
        tutorId: 'rapunzel',
        title: 'Sunburst Study Horizon',
        description: 'Log 50 focused minutes with Rapunzel.',
        requirement: 'Log 50 minutes with Rapunzel',
        target: 50,
        progress: 0,
        completed: false,
        xpReward: 105,
        affinityReward: 70,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 12/20 Moana
  'moana': {
    id: 'moana',
    name: 'Moana',
    characterIndex: '12/20',
    archetype: 'COMPETITIVE_COACH',
    communicationStyle: 'Navigational, daring, goal-oriented, ocean-hearted',
    tone: 'Courageous, purposeful, views exams and milestones as epic wayfinding voyages',
    encouragementStyle: 'Reminds you that the ocean tests everyone; you are the one holding the rudder.',
    preferredStudyMethods: ['Milestone Wayfinding', 'Sprint-and-Recover Blocks (35m)', 'Goal Tracking'],
    suggestedDuration: 35,
    suggestedBreak: 7,
    primarySpecialty: 'Planning & Productivity',
    secondarySpecialties: ['Science & Engineering', 'Research & Analysis'],
    difficultyPreference: 'INTERMEDIATE',
    shortBio: 'Wayfinder and leader of Motunui. Expert at navigating uncharted waters and charting steady courses toward distant horizons.',
    dialogue: {
      greetings: [
        'The horizon is calling! Chart your course for today’s study voyage.',
        'A true wayfinder reads the stars and keeps their eyes forward. Let’s sail.',
      ],
      onStart: [
        'Sail hoisted! Catch the wind and steer straight toward your goal.',
      ],
      onPause: [
        'Anchored for a moment. Keep your compass steady.',
      ],
      onResume: [
        'Anchor up! Full speed ahead through the syllabus.',
      ],
      onBreak: [
        'Calm waters. Rest your oars, drink some water, gaze at the horizon.',
      ],
      onBreakReturn: [
        'Currents are favorable! Let’s paddle into the next chapter.',
      ],
      onTaskComplete: [
        'Island reached! That waypoint is charted and claimed.',
      ],
      onSessionComplete: [
        'Voyage completed! Look how far across the ocean of knowledge you’ve traveled.',
      ],
      onSessionInterrupted: [
        'Rough seas happen to every sailor. Re-chart and catch the next tide.',
      ],
      onDailyGoalReached: [
        'Destination reached! You crossed the reef today.',
      ],
      onFlashcardReview: [
        'Stars mapped into memory. You know the route by heart now.',
      ],
      onStrugglingTask: [
        'When the waves are rough, don’t panic. Hold the rudder firm and steer into it.',
      ],
      onPersonalBest: [
        'NEW RECORD! You traveled further today than ever before!',
      ],
      onTutorSelected: [
        'Moana at the helm! Let’s navigate this subject together.',
      ],
      unlockedDialogue: [
        'You have the heart of a true wayfinder. You know who you are and where you are going.',
      ],
    },
    challenges: [
      {
        id: 'chal-moana-1',
        tutorId: 'moana',
        title: 'Open Ocean Sprint',
        description: 'Complete two 35-minute wayfinding focus sessions.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-moana-2',
        tutorId: 'moana',
        title: 'Island Milestone Clearance',
        description: 'Complete 2 priority tasks towards your main study goal.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 75,
        affinityReward: 45,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-moana-3',
        tutorId: 'moana',
        title: 'Trans-Oceanic Voyage',
        description: 'Accumulate 70 total focus minutes alongside Moana.',
        requirement: 'Log 70 minutes with Moana',
        target: 70,
        progress: 0,
        completed: false,
        xpReward: 125,
        affinityReward: 80,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 13/20 Hermione Granger
  'hermione-granger': {
    id: 'hermione-granger',
    name: 'Hermione Granger',
    characterIndex: '13/20',
    archetype: 'STRICT_MENTOR',
    communicationStyle: 'Scholarly, precise, structured revision timetable',
    tone: 'Uncompromisingly intellectual, values thoroughness, citations, and active recall',
    encouragementStyle: 'Insists that there is no magic substitute for disciplined study, color-coded notes, and library hours.',
    preferredStudyMethods: ['Spaced Repetition Timetables', 'Source Cross-Referencing', '45m High-Rigor Blocks'],
    suggestedDuration: 45,
    suggestedBreak: 8,
    primarySpecialty: 'Exam Preparation',
    secondarySpecialties: ['Research & Analysis', 'Languages & Writing'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Top scholar of Hogwarts Gryffindor. Legendary for her color-coded revision timetables and encyclopedic library mastery.',
    dialogue: {
      greetings: [
        'Have you reviewed the syllabus? O.W.L. exams wait for no one. Let us begin.',
        'Honestly, don’t you two read? Open Hogwarts: A History—or at least your textbook.',
      ],
      onStart: [
        'Time-Turner precision active. Forty-five minutes of rigorous, uninterrupted study.',
      ],
      onPause: [
        'Why are we stopping? An exam question will not pause while you check your phone.',
      ],
      onResume: [
        'Resuming study timetable. Maintain high concentration.',
      ],
      onBreak: [
        'Eight minutes precisely. Stand up, stretch, and review your flashcard deck if you wish.',
      ],
      onBreakReturn: [
        'Time is up. Return to your quill and parchment.',
      ],
      onTaskComplete: [
        'Full marks. That was executed with academic rigor.',
      ],
      onSessionComplete: [
        'Exceeds Expectations! A thoroughly disciplined study interval.',
      ],
      onSessionInterrupted: [
        'Disappointing. Discipline is doing what is required even when you feel like slacking.',
      ],
      onDailyGoalReached: [
        'Outstanding! You have completed your revision quota for the day.',
      ],
      onFlashcardReview: [
        'Active recall completed. The memory pathways are firmly established.',
      ],
      onStrugglingTask: [
        'It’s Levi-O-sa, not Levio-SA! Precision in your definitions unlocks the whole concept.',
      ],
      onPersonalBest: [
        'A new record! Madam Pince herself would be impressed by this focus.',
      ],
      onTutorSelected: [
        'Hermione Granger appointed. Let us aim for nothing less than Outstanding.',
      ],
      unlockedDialogue: [
        'Books! And cleverness! There are more important things, like friendship and bravery—but working with you is truly inspiring.',
      ],
    },
    challenges: [
      {
        id: 'chal-hermione-1',
        tutorId: 'hermione-granger',
        title: 'O.W.L. Revision Block',
        description: 'Complete two 45-minute strict study blocks with zero distraction logs.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 90,
        affinityReward: 60,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-hermione-2',
        tutorId: 'hermione-granger',
        title: 'Library Active Recall',
        description: 'Review 25 flashcards to perfection.',
        requirement: 'Review 25 flashcards',
        target: 25,
        progress: 0,
        completed: false,
        xpReward: 85,
        affinityReward: 55,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-hermione-3',
        tutorId: 'hermione-granger',
        title: 'Prefect Academic Endurance',
        description: 'Log 90 total focus minutes alongside Hermione Granger.',
        requirement: 'Log 90 minutes with Hermione',
        target: 90,
        progress: 0,
        completed: false,
        xpReward: 160,
        affinityReward: 100,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 14/20 Wednesday Addams
  'wednesday-addams': {
    id: 'wednesday-addams',
    name: 'Wednesday Addams',
    characterIndex: '14/20',
    archetype: 'STRICT_MENTOR',
    communicationStyle: 'Dry, deadpan, darkly witty, solitary silence',
    tone: 'Unflinching, gothic calm, regards trivial distractions with cold disdain',
    encouragementStyle: 'Treats difficult academic challenges as worthy adversaries to dissect with cold scalpel precision.',
    preferredStudyMethods: ['Solitary Deep Writing', 'Cold Analytical Editing', '40m Unbroken Sprints'],
    suggestedDuration: 40,
    suggestedBreak: 6,
    primarySpecialty: 'Languages & Writing',
    secondarySpecialties: ['Research & Analysis', 'Creative Thinking'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'Nevermore Academy outkast, novelist, and cellist. Master of solitary concentration and razor-sharp prose.',
    dialogue: {
      greetings: [
        'Silence is preferred. Open your notebook and begin.',
        'I find smiling repulsive. Hard work, however, is mildly acceptable.',
      ],
      onStart: [
        'The timer is ticking down like an executioner’s pendulum. Do not blink.',
      ],
      onPause: [
        'Paused? How tragic. Resolve the interruption before I lose interest.',
      ],
      onResume: [
        'Back to the dissection of your assignment.',
      ],
      onBreak: [
        'A six-minute reprieve. Do not spend it on bright, colorful nonsense.',
      ],
      onBreakReturn: [
        'The respite is over. Return to the dark art of learning.',
      ],
      onTaskComplete: [
        'Task eliminated. Buried six feet under.',
      ],
      onSessionComplete: [
        'Session finished. Painful, yet necessary. Acceptable work.',
      ],
      onSessionInterrupted: [
        'An aborted session. Truly a nightmare, and not the good kind.',
      ],
      onDailyGoalReached: [
        'Quota met. You may retreat to the shadows in peace.',
      ],
      onFlashcardReview: [
        'Facts committed to memory like epitaphs on stone.',
      ],
      onStrugglingTask: [
        'If it hurts, good. Growth is rarely pleasant.',
      ],
      onPersonalBest: [
        'A new record. Mildly impressive. Do not let it go to your head.',
      ],
      onTutorSelected: [
        'Wednesday Addams is observing. Make no excuses.',
      ],
      unlockedDialogue: [
        'You possess a delightfully morbid determination. I find your focus tolerable.',
      ],
    },
    challenges: [
      {
        id: 'chal-wed-1',
        tutorId: 'wednesday-addams',
        title: 'Solitary Manuscript Sprint',
        description: 'Complete a 40-minute unbroken focus block without distractions.',
        requirement: '40m session with 0 distractions',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 90,
        affinityReward: 60,
        type: 'ZERO_DISTRACTIONS',
      },
      {
        id: 'chal-wed-2',
        tutorId: 'wednesday-addams',
        title: 'Cold Prose Clearance',
        description: 'Complete 2 written or analytical tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-wed-3',
        tutorId: 'wednesday-addams',
        title: 'Nevermore Midnight Study',
        description: 'Accumulate 80 total focus minutes alongside Wednesday.',
        requirement: 'Log 80 minutes with Wednesday',
        target: 80,
        progress: 0,
        completed: false,
        xpReward: 140,
        affinityReward: 90,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 15/20 Officer K
  'officer-k': {
    id: 'officer-k',
    name: 'Officer K',
    characterIndex: '15/20',
    archetype: 'CHILL_COMPANION',
    communicationStyle: 'Quiet, reflective, meditative, noir composure',
    tone: 'Soft-spoken, resilient, reminds you to stay grounded within your baseline',
    encouragementStyle: 'Helps maintain stoic, quiet progress in a noisy world.',
    preferredStudyMethods: ['Baseline Focus Calibration', 'Quiet Data Ingestion', '35m Deep Work'],
    suggestedDuration: 35,
    suggestedBreak: 7,
    primarySpecialty: 'Research & Analysis',
    secondarySpecialties: ['Programming & Systems', 'Mindfulness & Habit Building'],
    difficultyPreference: 'INTERMEDIATE',
    shortBio: 'Blade Runner navigating the neon haze of 2049. Master of quiet internal dignity and persistent research.',
    dialogue: {
      greetings: [
        'Constant K. Ready to calibrate your focus baseline.',
        'Outside the rain falls. Inside, we have work to do.',
      ],
      onStart: [
        'Within cells interlinked. Focus protocol started.',
      ],
      onPause: [
        'Baseline paused. Hold your position.',
      ],
      onResume: [
        'Re-linking. Stay with the data.',
      ],
      onBreak: [
        'Rest interval. Let the city drift away.',
      ],
      onBreakReturn: [
        'Baseline test normal. Resume your review.',
      ],
      onTaskComplete: [
        'Case record updated. One more fact confirmed.',
      ],
      onSessionComplete: [
        'Good work. You did your duty today.',
      ],
      onSessionInterrupted: [
        'Lost baseline. We will re-calibrate shortly.',
      ],
      onDailyGoalReached: [
        'Daily quota reached. You are interlinked with your purpose.',
      ],
      onFlashcardReview: [
        'Memories verified. Some memories are real.',
      ],
      onStrugglingTask: [
        'Look between the lines. The clue is always in the quiet details.',
      ],
      onPersonalBest: [
        'New record. You went beyond your baseline today.',
      ],
      onTutorSelected: [
        'Officer K calibrated. Let’s do the work quietly.',
      ],
      unlockedDialogue: [
        'All the best memories are made when nobody is watching. Keep building yours.',
      ],
    },
    challenges: [
      {
        id: 'chal-k-1',
        tutorId: 'officer-k',
        title: 'Baseline Test Protocol',
        description: 'Complete two 35-minute quiet research blocks.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 80,
        affinityReward: 50,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-k-2',
        tutorId: 'officer-k',
        title: 'Interlinked Data Analysis',
        description: 'Review 15 active recall flashcards.',
        requirement: 'Review 15 flashcards',
        target: 15,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-k-3',
        tutorId: 'officer-k',
        title: 'Neon Rainy Night',
        description: 'Accumulate 70 total focus minutes alongside Officer K.',
        requirement: 'Log 70 minutes with Officer K',
        target: 70,
        progress: 0,
        completed: false,
        xpReward: 130,
        affinityReward: 85,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 16/20 Neo (Thomas Anderson)
  'neo': {
    id: 'neo',
    name: 'Neo (Thomas Anderson)',
    characterIndex: '16/20',
    archetype: 'WISE_MENTOR',
    communicationStyle: 'Philosophical, cyber-intuitive, system-level clarity',
    tone: 'Calm realization; sees through the matrix of complex code and mathematical abstractions',
    encouragementStyle: 'Helps you realize that rules are meant to be understood and mastered.',
    preferredStudyMethods: ['First-Principles Architecture', 'Terminal Flow Sessions (50m)', 'Direct Neural Code Ingestion'],
    suggestedDuration: 50,
    suggestedBreak: 10,
    primarySpecialty: 'Programming & Systems',
    secondarySpecialties: ['Mathematics & Problem Solving', 'Science & Engineering'],
    difficultyPreference: 'ADVANCED',
    shortBio: 'The One who awakened to the digital reality. Teaches full-stack algorithms, systems programming, and neural clarity.',
    dialogue: {
      greetings: [
        'You take the blue pill, you stay in distraction. You take the red pill, you stay in focus and I show you how deep the rabbit hole goes.',
        'I know kung fu. And today, you are going to master this architecture.',
      ],
      onStart: [
        'Entering the construct. Green rain active. Focus your mind.',
      ],
      onPause: [
        'De-sync recorded. Free your mind and prepare to re-enter.',
      ],
      onResume: [
        'Neural link re-established. Continue downloading knowledge.',
      ],
      onBreak: [
        'Operator, break initiated. Unplug and rest your physical form.',
      ],
      onBreakReturn: [
        'Reconnected to Zion mainframe. Let’s finish the algorithm.',
      ],
      onTaskComplete: [
        'Code compiled and executed. The matrix bends to your will.',
      ],
      onSessionComplete: [
        'Download complete. You now understand the system.',
      ],
      onSessionInterrupted: [
        'Signal lost. Check your connection to your study environment.',
      ],
      onDailyGoalReached: [
        'You are the One. Daily focus goal cleared.',
      ],
      onFlashcardReview: [
        'Neural weights locked. Instantaneous recall confirmed.',
      ],
      onStrugglingTask: [
        'Do not try and bend the spoon—that’s impossible. Instead, only try to realize the truth: there is no spoon.',
      ],
      onPersonalBest: [
        'New record! You’re beginning to believe.',
      ],
      onTutorSelected: [
        'Neo is plugged in. Let’s decode the world.',
      ],
      unlockedDialogue: [
        'You don’t have to follow the old limits anymore. You see the code behind the curtain now.',
      ],
    },
    challenges: [
      {
        id: 'chal-neo-1',
        tutorId: 'neo',
        title: 'Neural Matrix Sprint',
        description: 'Complete a 50-minute systems programming or math block with zero distractions.',
        requirement: '50m session with 0 distractions',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 100,
        affinityReward: 65,
        type: 'ZERO_DISTRACTIONS',
      },
      {
        id: 'chal-neo-2',
        tutorId: 'neo',
        title: 'Algorithmic Download',
        description: 'Check off 2 challenging programming tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 90,
        affinityReward: 55,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-neo-3',
        tutorId: 'neo',
        title: 'Zion Mainframe Endurance',
        description: 'Accumulate 90 total focus minutes alongside Neo.',
        requirement: 'Log 90 minutes with Neo',
        target: 90,
        progress: 0,
        completed: false,
        xpReward: 160,
        affinityReward: 100,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 17/20 Cozy Study Girl
  'cozy-study-girl': {
    id: 'cozy-study-girl',
    name: 'Cozy Study Girl',
    characterIndex: '17/20',
    archetype: 'CHILL_COMPANION',
    communicationStyle: 'Gentle, comforting, warm coffee and rain ambience',
    tone: 'Soothing, pressure-free, champions healthy habits and steady daily progress',
    encouragementStyle: 'Reminds you that doing a little bit every day beats burning out all at once.',
    preferredStudyMethods: ['25m Cozy Pomodoro', 'Tea & Lo-Fi Review', 'Daily Habit Stacking'],
    suggestedDuration: 25,
    suggestedBreak: 5,
    primarySpecialty: 'Mindfulness & Habit Building',
    secondarySpecialties: ['Languages & Writing', 'Planning & Productivity'],
    difficultyPreference: 'BEGINNER',
    shortBio: 'Your beloved lo-fi study comrade. Always has a fresh mug of tea, soft headphones, and a rainy window view.',
    dialogue: {
      greetings: [
        'Welcome back! Grab your tea, slip on your headphones, and let’s enjoy this session.',
        'Rain against the glass, cozy desk, open notebook. Best feeling ever.',
      ],
      onStart: [
        'Lo-Fi beats spinning. Breathe easy and write that first line.',
      ],
      onPause: [
        'Pouring a fresh warm cup? Take your time, we’re in no rush.',
      ],
      onResume: [
        'Back to our warm desk. Let’s keep moving gently forward.',
      ],
      onBreak: [
        'Good round! Look out the window for five minutes and let your mind drift.',
      ],
      onBreakReturn: [
        'Feeling cozy? Let’s read through the next page together.',
      ],
      onTaskComplete: [
        'Check! Look how nice your to-do list is looking now.',
      ],
      onSessionComplete: [
        'Another sweet session in the books. I’m proud of your steady habits.',
      ],
      onSessionInterrupted: [
        'Don’t worry at all. A calm study habit is forgiving.',
      ],
      onDailyGoalReached: [
        'Daily focus goal reached! You’ve done plenty of good work today.',
      ],
      onFlashcardReview: [
        'Cards reviewed with zero stress. That is how real knowledge stays.',
      ],
      onStrugglingTask: [
        'Take a sip of water. You don’t have to solve everything in one second. Be patient with yourself.',
      ],
      onPersonalBest: [
        'New personal focus record! Look at how effortless you made it feel.',
      ],
      onTutorSelected: [
        'Cozy Study Girl is by your side. Let’s have a wonderful study time.',
      ],
      unlockedDialogue: [
        'Study sessions with you always feel like home. Thank you for being such a wonderful partner.',
      ],
    },
    challenges: [
      {
        id: 'chal-girl-1',
        tutorId: 'cozy-study-girl',
        title: 'Warm Tea Pomodoro',
        description: 'Complete two 25-minute gentle focus sessions.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-girl-2',
        tutorId: 'cozy-study-girl',
        title: 'Gentle Active Recall',
        description: 'Review 10 flashcards peacefully.',
        requirement: 'Review 10 flashcards',
        target: 10,
        progress: 0,
        completed: false,
        xpReward: 60,
        affinityReward: 40,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-girl-3',
        tutorId: 'cozy-study-girl',
        title: 'Lo-Fi Study Haven',
        description: 'Accumulate 50 focused minutes with Cozy Study Girl.',
        requirement: 'Log 50 minutes with Study Girl',
        target: 50,
        progress: 0,
        completed: false,
        xpReward: 100,
        affinityReward: 70,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 18/20 Late-Night Study Boy
  'late-night-study-boy': {
    id: 'late-night-study-boy',
    name: 'Late-Night Study Boy',
    characterIndex: '18/20',
    archetype: 'FRIENDLY_COMPANION',
    communicationStyle: 'Nocturnal comrade, tech enthusiast, late-night flow',
    tone: 'Quiet camaraderie, late-night coffee camaraderie, focused coding vibe',
    encouragementStyle: 'Validates that late-night flow state when the world is asleep and ideas flow unhindered.',
    preferredStudyMethods: ['Midnight Flow Blocks', 'Terminal Debugging', '30m Sprints'],
    suggestedDuration: 30,
    suggestedBreak: 6,
    primarySpecialty: 'Programming & Systems',
    secondarySpecialties: ['Mathematics & Problem Solving', 'Mindfulness & Habit Building'],
    difficultyPreference: 'INTERMEDIATE',
    shortBio: 'Quiet midnight student who finds true flow when the city sleeps and the desk lamp glows amber.',
    dialogue: {
      greetings: [
        'Hey. 2:00 AM coffee is brewing. Ready to conquer this code?',
        'The world is quiet right now. That means all the bandwidth is ours.',
      ],
      onStart: [
        'Dark mode on, blue-light glasses set. Let’s dive in.',
      ],
      onPause: [
        'Grabbing a refill? Keep the blue light low.',
      ],
      onResume: [
        'Back to the terminal. Let’s trace this bug.',
      ],
      onBreak: [
        'Time for a quick stretch. Walk around the room in the quiet.',
      ],
      onBreakReturn: [
        'Still locked in. Let’s finish this chapter.',
      ],
      onTaskComplete: [
        'Committed! One more problem solved under the stars.',
      ],
      onSessionComplete: [
        'Solid midnight sprint. That was pure, unadulterated focus.',
      ],
      onSessionInterrupted: [
        'Nighttime can be tricky. Re-focus your lamp and try again.',
      ],
      onDailyGoalReached: [
        'Night shift complete! You put in serious work while everyone else slept.',
      ],
      onFlashcardReview: [
        'Drilling cards in the dark. That knowledge is going to stick overnight.',
      ],
      onStrugglingTask: [
        'When you hit a late-night wall, sometimes writing the pseudo-code on paper breaks the block.',
      ],
      onPersonalBest: [
        'New late-night record! You’re on fire tonight.',
      ],
      onTutorSelected: [
        'Late-Night Study Boy ready. Let’s make magic in the dark.',
      ],
      unlockedDialogue: [
        'Sharing these quiet midnight study hours with you is the highlight of my week.',
      ],
    },
    challenges: [
      {
        id: 'chal-boy-1',
        tutorId: 'late-night-study-boy',
        title: 'Midnight Code Sprint',
        description: 'Complete two 30-minute nocturnal study blocks.',
        requirement: 'Complete 2 focus blocks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 75,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-boy-2',
        tutorId: 'late-night-study-boy',
        title: 'Late Night Terminal Drills',
        description: 'Check off 2 programming or analytical study tasks.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-boy-3',
        tutorId: 'late-night-study-boy',
        title: 'Night Owl Marathon',
        description: 'Log 60 minutes alongside Late-Night Study Boy.',
        requirement: 'Log 60 minutes with Study Boy',
        target: 60,
        progress: 0,
        completed: false,
        xpReward: 110,
        affinityReward: 75,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 19/20 Purring Window Cat
  'purring-window-cat': {
    id: 'purring-window-cat',
    name: 'Purring Window Cat',
    characterIndex: '19/20',
    archetype: 'CHILL_COMPANION',
    communicationStyle: 'Rhythmic purrs, soft meows, tranquil feline calm',
    tone: 'Endearing, stress-melting, brings lowering heart-rate and peace to your desk',
    encouragementStyle: 'Curles up beside your keyboard to remind you to breathe, relax your jaw, and take it one paw at a time.',
    preferredStudyMethods: ['Low-Stress Gentle Review', 'Feline Ambient Focus', '20m Gentle Blocks'],
    suggestedDuration: 20,
    suggestedBreak: 5,
    primarySpecialty: 'Mindfulness & Habit Building',
    secondarySpecialties: ['Creative Thinking', 'Languages & Writing'],
    difficultyPreference: 'BEGINNER',
    shortBio: 'Ginger tabby curled by the window. Rhythmic 25Hz purr scientifically proven to reduce study anxiety.',
    dialogue: {
      greetings: [
        '*Prrrbt!* Curled up on your notes. Ready to purr away your stress.',
        '*Soft meow.* The sunbeam is right on your desk today.',
      ],
      onStart: [
        '*Rhythmic purr begins.* Everything is calm. Just read the next paragraph.',
      ],
      onPause: [
        '*Head bumps your hand.* Quick pet pause? Acceptable.',
      ],
      onResume: [
        '*Settles into a loaf.* Resuming peaceful study mode.',
      ],
      onBreak: [
        '*Stretches paws out long.* Big stretch! You should stretch too.',
      ],
      onBreakReturn: [
        '*Blinks slowly.* Ready when you are.',
      ],
      onTaskComplete: [
        '*Gentle purr.* That task is checked. Good human.',
      ],
      onSessionComplete: [
        '*Happy purring chorus.* You did wonderful work today.',
      ],
      onSessionInterrupted: [
        '*Curles tail.* No worries, cat naps are always allowed.',
      ],
      onDailyGoalReached: [
        '*Purrs loudly!* Daily goal reached! Time for treats.',
      ],
      onFlashcardReview: [
        '*Taps flashcard with paw.* Memory secured.',
      ],
      onStrugglingTask: [
        '*Nuzzles your wrist.* Don’t stress. Cats don’t stress over hard equations, they just take a nap and try again.',
      ],
      onPersonalBest: [
        '*Loud motor purr!* New record! Best study partner ever.',
      ],
      onTutorSelected: [
        'Purring Window Cat hops onto the desk. Study time is now cozy.',
      ],
      unlockedDialogue: [
        '*Rolls over to show belly.* Complete feline trust unlocked. You are the ultimate study master.',
      ],
    },
    challenges: [
      {
        id: 'chal-cat-1',
        tutorId: 'purring-window-cat',
        title: 'Purring Flow Block',
        description: 'Complete two 20-minute low-stress study sessions.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 65,
        affinityReward: 40,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-cat-2',
        tutorId: 'purring-window-cat',
        title: 'Gentle Paw Review',
        description: 'Review 10 flashcards calmly without rushing.',
        requirement: 'Review 10 flashcards',
        target: 10,
        progress: 0,
        completed: false,
        xpReward: 55,
        affinityReward: 35,
        type: 'FLASHCARDS_REVIEWED',
      },
      {
        id: 'chal-cat-3',
        tutorId: 'purring-window-cat',
        title: 'Sunbeam Loaf Marathon',
        description: 'Log 40 focused minutes alongside Purring Cat.',
        requirement: 'Log 40 minutes with Cat',
        target: 40,
        progress: 0,
        completed: false,
        xpReward: 95,
        affinityReward: 65,
        type: 'FOCUS_MINUTES',
      },
    ],
  },

  // 20/20 Loyal Fireplace Dog
  'loyal-fireplace-dog': {
    id: 'loyal-fireplace-dog',
    name: 'Loyal Fireplace Dog',
    characterIndex: '20/20',
    archetype: 'FRIENDLY_COMPANION',
    communicationStyle: 'Eager tail wagging, joyful woofs, unconditional encouragement',
    tone: 'Unshakable loyalty, cheerful optimism, believes you can do anything you put your mind to',
    encouragementStyle: 'Celebrates your effort regardless of how tough the day was; always waiting by your side.',
    preferredStudyMethods: ['Reward-Based Habits', 'Paced Study Sprints (25m)', 'Daily Streak Guard'],
    suggestedDuration: 25,
    suggestedBreak: 5,
    primarySpecialty: 'Mindfulness & Habit Building',
    secondarySpecialties: ['Planning & Productivity', 'Creative Thinking'],
    difficultyPreference: 'BEGINNER',
    shortBio: 'Golden retriever resting by the pixel hearth. The ultimate loyal companion who cheers for your smallest victories.',
    dialogue: {
      greetings: [
        '*Tail thumps against the floor!* You’re here! I knew you’d come study today!',
        '*Happy woof!* The hearth is warm and I’m ready to sit right by your feet!',
      ],
      onStart: [
        '*Alert ears up!* Starting now! I’ll keep watch while you focus!',
      ],
      onPause: [
        '*Rests chin on your knee.* Quick pause? I’m right here with you.',
      ],
      onResume: [
        '*Tail wag!* Back to work! You can do this!',
      ],
      onBreak: [
        '*Grabs toy!* Break time! Stand up and stretch! You did so good!',
      ],
      onBreakReturn: [
        '*Happily sits back down.* Ready for the next round!',
      ],
      onTaskComplete: [
        '*Excited tail wagging!* TASK COMPLETED! Who’s a good student? You are!',
      ],
      onSessionComplete: [
        '*Joyful spin!* You finished the session! What a superstar!',
      ],
      onSessionInterrupted: [
        '*Gentle nudge.* It’s okay! We’ll try again whenever you’re ready.',
      ],
      onDailyGoalReached: [
        '*Happy bark!* DAILY GOAL COMPLETED! You’re the best!',
      ],
      onFlashcardReview: [
        '*Sniffs cards approvingly.* Great recall! Gold star for you!',
      ],
      onStrugglingTask: [
        '*Warm chin rest.* Don’t be sad! Hard tasks just make you smarter. I believe in you 100%!',
      ],
      onPersonalBest: [
        '*Full body tail wag!* NEW RECORD! The greatest study hero ever!',
      ],
      onTutorSelected: [
        'Loyal Fireplace Dog takes his place by the hearth. Ready to study!',
      ],
      unlockedDialogue: [
        '*Licks hand lovingly.* Best friends forever. I’m always going to be in your corner, no matter what.',
      ],
    },
    challenges: [
      {
        id: 'chal-dog-1',
        tutorId: 'loyal-fireplace-dog',
        title: 'Hearthside Focus Sprint',
        description: 'Complete two 25-minute study sessions by the hearth.',
        requirement: 'Complete 2 focus sessions',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 70,
        affinityReward: 45,
        type: 'SESSIONS_COUNT',
      },
      {
        id: 'chal-dog-2',
        tutorId: 'loyal-fireplace-dog',
        title: 'Good Dog Task Clearance',
        description: 'Complete 2 tasks and celebrate each checkmark.',
        requirement: 'Complete 2 tasks',
        target: 2,
        progress: 0,
        completed: false,
        xpReward: 65,
        affinityReward: 40,
        type: 'TASKS_COMPLETED',
      },
      {
        id: 'chal-dog-3',
        tutorId: 'loyal-fireplace-dog',
        title: 'Hearthfire Loyalty Marathon',
        description: 'Accumulate 50 focused minutes alongside Loyal Dog.',
        requirement: 'Log 50 minutes with Dog',
        target: 50,
        progress: 0,
        completed: false,
        xpReward: 100,
        affinityReward: 70,
        type: 'FOCUS_MINUTES',
      },
    ],
  },
};

// ========================================================
// --- PRESET STUDY SQUADS (CONFIGURABLE & EXTENSIBLE) ---
// ========================================================

export const DEFAULT_STUDY_SQUADS = [
  {
    id: 'squad-exam',
    name: 'EXAM READINESS SQUAD',
    description: 'Relentless tactical preparation, encyclopedic recall, and high-level conceptual simplification.',
    leadTutorId: 'bruce-wayne', // Lead: Strategy & Discipline
    supportTutorIds: ['hermione-granger', 'gojo-satoru'], // Structured revision & intuition
    purposeSubject: 'Exam Preparation',
    preferredTimerDuration: 45,
    preferredBreakDuration: 8,
    environmentId: 'library',
    ambienceProfile: 'lofi',
    isDefault: true,
    createdAt: 1710000000000,
  },
  {
    id: 'squad-coding',
    name: 'CYBER CODE SQUAD',
    description: 'System architecture, rapid hardware debugging, and algorithms from first principles.',
    leadTutorId: 'neo', // Lead: Neural Code
    supportTutorIds: ['tony-stark', 'peter-parker'], // Engineering & Problem Solving
    purposeSubject: 'Programming & Systems',
    preferredTimerDuration: 50,
    preferredBreakDuration: 10,
    environmentId: 'matrix',
    ambienceProfile: 'matrix',
    isDefault: false,
    createdAt: 1710000001000,
  },
  {
    id: 'squad-memory',
    name: 'ACTIVE RECALL SQUAD',
    description: 'High-frequency spaced repetition, stubborn retention drills, and analytical deduction.',
    leadTutorId: 'hermione-granger', // Lead: Precision
    supportTutorIds: ['naruto-uzumaki', 'l-lawliet'], // Grit & Deduction
    purposeSubject: 'Memorization & Active Recall',
    preferredTimerDuration: 35,
    preferredBreakDuration: 7,
    environmentId: 'bedroom',
    ambienceProfile: 'rain',
    isDefault: false,
    createdAt: 1710000002000,
  },
  {
    id: 'squad-chill',
    name: 'COZY HABIT SQUAD',
    description: 'Pressure-free daily habit building, soothing rain and hearth ambience, and warm encouragement.',
    leadTutorId: 'cozy-study-girl', // Lead: Gentle Habituator
    supportTutorIds: ['purring-window-cat', 'loyal-fireplace-dog'], // Ultimate serenity
    purposeSubject: 'Mindfulness & Habit Building',
    preferredTimerDuration: 25,
    preferredBreakDuration: 5,
    environmentId: 'bedroom',
    ambienceProfile: 'purr',
    isDefault: false,
    createdAt: 1710000003000,
  },
];

// ========================================================
// --- PRESET FOCUS PRESETS ---
// ========================================================

export const DEFAULT_FOCUS_PRESETS = [
  {
    id: 'preset-rainy-night',
    name: 'Rainy Night Deep Grind',
    description: 'Batman leads a 50-minute disciplined programming sprint under heavy downpour.',
    tutorId: 'bruce-wayne',
    squadId: 'squad-coding',
    subject: 'Programming & Systems',
    focusMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
    environmentId: 'matrix',
    ambienceProfile: 'rain',
    taskCategory: 'Programming',
    isFavorite: true,
    isDefault: true,
    createdAt: 1710000000000,
  },
  {
    id: 'preset-cozy-morning',
    name: 'Cozy Morning Reading & Review',
    description: 'Cozy Study Girl guides a gentle 25-minute Pomodoro session with warm lo-fi tape.',
    tutorId: 'cozy-study-girl',
    squadId: 'squad-chill',
    subject: 'General Study',
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    environmentId: 'bedroom',
    ambienceProfile: 'lofi',
    taskCategory: 'Reading',
    isFavorite: true,
    isDefault: false,
    createdAt: 1710000001000,
  },
  {
    id: 'preset-exam-blitz',
    name: 'Hermione Exam Recall Blitz',
    description: 'Strict 45-minute exam cramming block with high active recall standards.',
    tutorId: 'hermione-granger',
    squadId: 'squad-exam',
    subject: 'Exam Preparation',
    focusMinutes: 45,
    shortBreakMinutes: 8,
    longBreakMinutes: 15,
    environmentId: 'library',
    ambienceProfile: 'lofi',
    taskCategory: 'Exam Prep',
    isFavorite: true,
    isDefault: false,
    createdAt: 1710000002000,
  },
  {
    id: 'preset-math-intuition',
    name: 'Gojo Limitless Proofs',
    description: '40-minute mathematics block breaking through complex formulas into clean intuition.',
    tutorId: 'gojo-satoru',
    subject: 'Mathematics & Problem Solving',
    focusMinutes: 40,
    shortBreakMinutes: 8,
    longBreakMinutes: 15,
    environmentId: 'bedroom',
    ambienceProfile: 'space',
    taskCategory: 'Mathematics',
    isFavorite: false,
    isDefault: false,
    createdAt: 1710000003000,
  },
];

// ========================================================
// --- TUTOR COSMETICS & AFFINITY TITLES ---
// ========================================================

export const TUTOR_COSMETIC_UNLOCKS: TutorCosmeticUnlock[] = [
  {
    id: 'cosm-peter-lvl2',
    tutorId: 'peter-parker',
    title: 'Midtown Science Fellow',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Peter Parker.',
    requiredAffinityLevel: 2,
    icon: '🕷️',
    unlocked: false,
  },
  {
    id: 'cosm-peter-lvl3',
    tutorId: 'peter-parker',
    title: 'Spider-Frame (Neon Web)',
    type: 'PROFILE_FRAME',
    description: 'Unlocked at Affinity Level 3 with Peter Parker.',
    requiredAffinityLevel: 3,
    icon: '🕸️',
    unlocked: false,
  },
  {
    id: 'cosm-bruce-lvl2',
    tutorId: 'bruce-wayne',
    title: 'Batcave Junior Tactician',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Batman.',
    requiredAffinityLevel: 2,
    icon: '🦇',
    unlocked: false,
  },
  {
    id: 'cosm-bruce-lvl3',
    tutorId: 'bruce-wayne',
    title: 'Dark Knight Radar Frame',
    type: 'PROFILE_FRAME',
    description: 'Unlocked at Affinity Level 3 with Batman.',
    requiredAffinityLevel: 3,
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'cosm-tony-lvl2',
    tutorId: 'tony-stark',
    title: 'Stark Lab Apprentice',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Tony Stark.',
    requiredAffinityLevel: 2,
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'cosm-tony-lvl3',
    tutorId: 'tony-stark',
    title: 'Titanium Arc Reactor Frame',
    type: 'PROFILE_FRAME',
    description: 'Unlocked at Affinity Level 3 with Tony Stark.',
    requiredAffinityLevel: 3,
    icon: '🦾',
    unlocked: false,
  },
  {
    id: 'cosm-hermione-lvl2',
    tutorId: 'hermione-granger',
    title: 'Gryffindor Library Prefect',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Hermione Granger.',
    requiredAffinityLevel: 2,
    icon: '📖',
    unlocked: false,
  },
  {
    id: 'cosm-neo-lvl2',
    tutorId: 'neo',
    title: 'Awakened Operator',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Neo.',
    requiredAffinityLevel: 2,
    icon: '💻',
    unlocked: false,
  },
  {
    id: 'cosm-cozy-lvl2',
    tutorId: 'cozy-study-girl',
    title: 'Midnight Lo-Fi Scholar',
    type: 'NAMEPLATE',
    description: 'Unlocked at Affinity Level 2 with Cozy Study Girl.',
    requiredAffinityLevel: 2,
    icon: '☕',
    unlocked: false,
  },
];
