import { CustomTutorProfile, RPGTutorArchetype, StudyEnvironment } from '../types/rpg';

export interface ArchetypeMeta {
  archetype: RPGTutorArchetype;
  title: string;
  badge: string;
  description: string;
  recommendedDuration: number;
  dialogue: {
    greetings: string[];
    onStart: string[];
    onPause: string[];
    onResume: string[];
    onComplete: string[];
    onBreak: string[];
    onTaskComplete: string[];
    streakMilestone: string[];
  };
}

export const TUTOR_ARCHETYPES: Record<RPGTutorArchetype, ArchetypeMeta> = {
  STRICT_MENTOR: {
    archetype: 'STRICT_MENTOR',
    title: 'Strict Mentor',
    badge: '[DISCIPLINE / PROTOCOL]',
    description: 'Direct, disciplined, and uncompromising on execution. Demands focus without cruelty.',
    recommendedDuration: 45,
    dialogue: {
      greetings: [
        'Protocol initialized. State your objective and begin without delay.',
        'Distraction is the enemy of mastery. Are your books open?',
        'Time flows regardless. Make sure this session counts.',
      ],
      onStart: [
        'Timer running. Silence all external tabs. Commit to the task.',
        'Focus protocol engaged. Execute each step methodically.',
        'Zero deviations permitted until the countdown reaches zero.',
      ],
      onPause: [
        'Paused? Acknowledge the reason, resolve it quickly, and resume.',
        'Halt recorded. Do not linger in limbo.',
      ],
      onResume: [
        'Resuming protocol. Re-engage mental clarity immediately.',
        'Back on the clock. Finish what you started.',
      ],
      onComplete: [
        'Sprint finished. Objective completed as planned. Well executed.',
        'Interval fulfilled. Log your results and evaluate your output.',
      ],
      onBreak: [
        'Stand up. Hydrate. Rest your eyes. Break protocol is just as essential.',
        'Step away from screens. A disciplined mind respects recovery.',
      ],
      onTaskComplete: [
        'Task eliminated from queue. Check the next item.',
        'Verified complete. Progress is built on checked boxes.',
      ],
      streakMilestone: [
        'Consistency verified. Your discipline is becoming a formidable habit.',
      ],
    },
  },

  FRIENDLY_COMPANION: {
    archetype: 'FRIENDLY_COMPANION',
    title: 'Friendly Companion',
    badge: '[SUPPORT / WARMTH]',
    description: 'Warm, encouraging, and upbeat. Celebrates every small win and supports steady habits.',
    recommendedDuration: 25,
    dialogue: {
      greetings: [
        'Hey there! Ready to make some great progress together today?',
        'I am so glad you are here! Let’s have a wonderful study session.',
        'Every minute you invest in yourself today is a victory!',
      ],
      onStart: [
        'Let’s do this! Take a deep breath—I am right here with you!',
        'You’ve got this! One step at a time, no rush.',
        'Happy studying! Let’s turn confusion into clarity.',
      ],
      onPause: [
        'Need a quick breather? Totally okay, take your time.',
        'Holding the space for you whenever you are ready!',
      ],
      onResume: [
        'Welcome back! Let’s pick up right where we left off!',
        'Ready to shine again! Let’s keep going!',
      ],
      onComplete: [
        'Woohoo! That was amazing focus! So proud of your dedication!',
        'Session finished! Give yourself a high five, you did it!',
      ],
      onBreak: [
        'Time to stretch and get some water! You earned this lovely break!',
        'Relax your shoulders, smile, and rest a little bit.',
      ],
      onTaskComplete: [
        'Yay! Task accomplished! Scratch that one off proudly!',
        'Another goal reached! You are on fire today!',
      ],
      streakMilestone: [
        'Look at your streak! You’ve shown up day after day—inspiring!',
      ],
    },
  },

  CHILL_COMPANION: {
    archetype: 'CHILL_COMPANION',
    title: 'Chill Companion',
    badge: '[FLOW / TRANQUILITY]',
    description: 'Calm, low-pressure, and serene. Ideal for sustainable studying, music, and long flow states.',
    recommendedDuration: 50,
    dialogue: {
      greetings: [
        'Peace. Settle in, grab some tea, and find your rhythm.',
        'No stress, no rush. Just steady flow and quiet curiosity.',
        'Welcome to the quiet zone. Let the noise fade away.',
      ],
      onStart: [
        'Sinking into the flow. Let thoughts settle like still water.',
        'Easy cadence. Just you and the material.',
        'Breathe in, let distractions drift out.',
      ],
      onPause: [
        'Pausing the groove. Take all the time you need.',
        'Still water. We’ll resume whenever you feel centered.',
      ],
      onResume: [
        'Finding the groove again. Smooth and steady.',
        'Back into the current.',
      ],
      onComplete: [
        'Session concluded like a calm sunset. Excellent flow.',
        'That was smooth. Sustainable progress is the truest progress.',
      ],
      onBreak: [
        'Look out the window. Let your mind wander freely.',
        'Time for a warm drink and a slow stretch.',
      ],
      onTaskComplete: [
        'Done. Unhurried, but thoroughly finished.',
        'One less weight on your mind.',
      ],
      streakMilestone: [
        'Gentle consistency over time moves mountains.',
      ],
    },
  },

  COMPETITIVE_COACH: {
    archetype: 'COMPETITIVE_COACH',
    title: 'Competitive Coach',
    badge: '[XP / HIGH SCORE]',
    description: 'Energetic, challenge-driven, and quest-oriented. Focuses on personal bests and leveling up.',
    recommendedDuration: 30,
    dialogue: {
      greetings: [
        'Challenger approaches! Time to beat yesterday’s high score!',
        'Quests are refreshed. Let’s farm some serious XP today!',
        'Game on! The grind never stops for top-tier scholars.',
      ],
      onStart: [
        'Sprint initiated! Eyes on the leaderboard, let’s push the pace!',
        'Speed, accuracy, focus! Keep the combo multiplier alive!',
        'DPS phase! Deal maximum damage to your study backlog!',
      ],
      onPause: [
        'Timeout called! Regroup, catch your breath, then strike back!',
        'Clock stopped. Don’t let your momentum cool down!',
      ],
      onResume: [
        'Back in the arena! Let’s crush this remaining time!',
        'Combo restored! Charge ahead!',
      ],
      onComplete: [
        'VICTORY! XP gained, boss level cleared, personal best in sight!',
        'Round complete! Check those stats—you’re leveling up fast!',
      ],
      onBreak: [
        'Halftime! Refuel your mana and stamina for the next round.',
        'Rest up, champion. Second half begins shortly.',
      ],
      onTaskComplete: [
        'QUEST COMPLETE! Bounty claimed and XP banked!',
        'Critical hit! That task didn’t stand a chance!',
      ],
      streakMilestone: [
        'STREAK MULTIPLIER UNLOCKED! You are unstoppable right now!',
      ],
    },
  },

  WISE_MENTOR: {
    archetype: 'WISE_MENTOR',
    title: 'Wise Mentor',
    badge: '[INSIGHT / MASTERY]',
    description: 'Thoughtful, strategic, and deep. Encourages active recall, Feynman technique, and conceptual mastery.',
    recommendedDuration: 40,
    dialogue: {
      greetings: [
        'True knowledge is not memorized; it is understood. What shall we master today?',
        'Welcome, scholar. Let us approach our studies with clarity and patience.',
        'Wisdom begins with admitting what is unclear. Let us explore.',
      ],
      onStart: [
        'Connect the concepts. Ask "why" as you read, not merely "what".',
        'Deep work begins. Protect your attention as you would rare treasure.',
        'Test yourself often. Active recall builds enduring synaptic paths.',
      ],
      onPause: [
        'Reflection time. Did a core assumption need questioning?',
        'Pausing allows the subconscious to synthesize insight.',
      ],
      onResume: [
        'Synthesizing ideas once more. Proceed with renewed insight.',
        'Reconnecting the threads of inquiry.',
      ],
      onComplete: [
        'A fruitful inquiry. Take a moment to summarize what you learned in your own words.',
        'Session finished. The seed of knowledge has been planted deeply today.',
      ],
      onBreak: [
        'Rest allows consolidation. The mind organizes memories while at ease.',
        'Step outside. Perspective is renewed by open skies.',
      ],
      onTaskComplete: [
        'Mastery demonstrated. One brick closer to your intellectual monument.',
        'Understanding deepened. Excellent work.',
      ],
      streakMilestone: [
        'A mind disciplined by daily reflection achieves profound wisdom.',
      ],
    },
  },
};

export const CORE_TUTOR_PROFILES: CustomTutorProfile[] = [
  {
    id: 'tutor-strict-viktor',
    name: 'Dr. Viktor Vane',
    archetype: 'STRICT_MENTOR',
    description: 'Former orbital flight director. Believes discipline is freedom and sloppy timing is failure.',
    tagline: 'High Orbit • Mission Control • Precision Ticks',
    quote: '"If you fail to plan your focus, you plan your obsolescence."',
    avatar: '👨‍💼',
    preferredDuration: 45,
    preferredEnvironment: 'lab',
    dialogueTone: 'strict',
    isCustom: false,
  },
  {
    id: 'tutor-friendly-miko',
    name: 'Miko the Pixel Cat',
    archetype: 'FRIENDLY_COMPANION',
    description: 'A cozy calico cat with a wizard hat who purrs whenever you complete a study sprint.',
    tagline: 'Warm Hearth • Herbal Tea • Soft Purrs',
    quote: '"You are doing so well! Every little page turned is pure magic!"',
    avatar: '🐱',
    preferredDuration: 25,
    preferredEnvironment: 'bedroom',
    dialogueTone: 'friendly',
    isCustom: false,
  },
  {
    id: 'tutor-chill-sora',
    name: 'Sora the Lo-Fi Nomad',
    archetype: 'CHILL_COMPANION',
    description: 'Rooftop tape-recorder musician who brings endless ambient cassette tapes and serene vibes.',
    tagline: 'Neon Rooftop • Rainy Tapes • Warm Synth',
    quote: '"Just float with the problem until it untangles itself, friend."',
    avatar: '🎧',
    preferredDuration: 50,
    preferredEnvironment: 'rooftop',
    dialogueTone: 'chill',
    isCustom: false,
  },
  {
    id: 'tutor-coach-kairos',
    name: 'Kairos the Speedrunner',
    archetype: 'COMPETITIVE_COACH',
    description: 'Arcade champion obsessed with high-APM study sessions, zero-death streaks, and boss fights.',
    tagline: 'Arcade Arena • DPS Focus • Leaderboard Clout',
    quote: '"Clear the queue! Beat your record! Claim the gold medal!"',
    avatar: '⚡',
    preferredDuration: 30,
    preferredEnvironment: 'retro-computer',
    dialogueTone: 'competitive',
    isCustom: false,
  },
  {
    id: 'tutor-wise-eldon',
    name: 'Archivist Eldon',
    archetype: 'WISE_MENTOR',
    description: 'Keeper of ancient scrolls and computational principles. Master of active recall and memory palaces.',
    tagline: 'Grand Citadel • Endless Archives • Candlelight',
    quote: '"Do not merely read the book; interrogate it until its secrets emerge."',
    avatar: '📜',
    preferredDuration: 40,
    preferredEnvironment: 'library',
    dialogueTone: 'wise',
    isCustom: false,
  },
];

export const STUDY_ENVIRONMENTS: StudyEnvironment[] = [
  {
    id: 'bedroom',
    name: 'Cozy Bedroom',
    description: 'Warm fairy lights, soft blankets, and rain tapping gently against the window pane.',
    fxType: 'lofi-rain',
    ambience: 'lofi',
    tagline: 'Warm Blanket • Calico Cat • Herbal Tea',
    icon: '🛏️',
  },
  {
    id: 'library',
    name: 'University Library',
    description: 'Grand oak desks, brass reading lamps, towering book stacks, and quiet page turns.',
    fxType: 'dust-shafts',
    ambience: 'rain',
    tagline: 'Vaulted Stacks • Dust Motes • Soft Murmurs',
    icon: '📚',
  },
  {
    id: 'rooftop',
    name: 'Rooftop at Night',
    description: 'Cyberpunk cityscape skyline, distant sirens, neon haze, and a cool evening breeze.',
    fxType: 'city-windows',
    ambience: 'wind',
    tagline: 'Neon Horizon • Night Air • City Drone',
    icon: '🌃',
  },
  {
    id: 'lab',
    name: 'Futuristic Laboratory',
    description: 'Holographic terminals, humming particle reactors, and clean fluorescent precision.',
    fxType: 'hud-nodes',
    ambience: 'matrix',
    tagline: 'Quantum Core • Neural Scans • Pure Logic',
    icon: '🔬',
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    description: 'Continuous soothing downpour with water droplets sliding across cold glass.',
    fxType: 'pixel-rain',
    ambience: 'rain',
    tagline: 'Thunder Rumble • Glass Droplets • Gray Sky',
    icon: '🌧️',
  },
  {
    id: 'retro-computer',
    name: 'Retro Computer Room',
    description: 'CRT monitors glowing green phosphor, clicky mechanical keyboards, and floppy drive purrs.',
    fxType: 'crt-scanlines',
    ambience: 'sonar',
    tagline: 'Phosphor Green • 486 DX2 • Clicky Switches',
    icon: '💾',
  },
  {
    id: 'cafe',
    name: 'Quiet Café',
    description: 'Steaming espresso machines, soft acoustic chatter, and the aroma of fresh roasted beans.',
    fxType: 'sunbeam-pollen',
    ambience: 'lofi',
    tagline: 'Espresso Steam • Ceramic Clinks • Corner Booth',
    icon: '☕',
  },
  {
    id: 'space-station',
    name: 'Space Station Observation Deck',
    description: 'Silent stars drifting past thick glass, distant blue nebulae, and orbital weightlessness.',
    fxType: 'infinity-grid',
    ambience: 'space',
    tagline: 'Zero Gravity • Cosmic Void • Earthrise',
    icon: '🚀',
  },
];
