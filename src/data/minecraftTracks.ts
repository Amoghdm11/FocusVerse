export interface MinecraftTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  category: 
    | 'Peaceful Building'
    | 'Overworld Exploration'
    | 'Rainy Survival'
    | 'Underground Mining'
    | 'Cave Ambience'
    | 'Ocean Exploration'
    | 'Nighttime Survival'
    | 'Calm Creative-Mode'
    | 'Long-Form Study Mix';
  duration: string;
  youtubeId: string;
  youtubeUrl: string;
  description: string;
  proceduralFallbackProfile: string;
  isOfficial: boolean;
}

export const MINECRAFT_STUDY_COLLECTION: MinecraftTrack[] = [
  {
    id: 'mc-sweden',
    title: 'Sweden',
    artist: 'C418',
    album: 'Minecraft - Volume Alpha',
    category: 'Calm Creative-Mode',
    duration: '3:35',
    youtubeId: 'aBkTkxKDduc',
    youtubeUrl: 'https://www.youtube.com/watch?v=aBkTkxKDduc',
    description: 'Nostalgic piano chords echoing across an endless pixel horizon.',
    proceduralFallbackProfile: 'lofi',
    isOfficial: true,
  },
  {
    id: 'mc-subwoofer-lullaby',
    title: 'Subwoofer Lullaby',
    artist: 'C418',
    album: 'Minecraft - Volume Alpha',
    category: 'Peaceful Building',
    duration: '3:28',
    youtubeId: 'ha3KQ8gB83w',
    youtubeUrl: 'https://www.youtube.com/watch?v=ha3KQ8gB83w',
    description: 'Warm electric piano and gentle glockenspiel for quiet creative crafting.',
    proceduralFallbackProfile: 'lofi',
    isOfficial: true,
  },
  {
    id: 'mc-wet-hands',
    title: 'Wet Hands',
    artist: 'C418',
    album: 'Minecraft - Volume Alpha',
    category: 'Ocean Exploration',
    duration: '1:30',
    youtubeId: 'mUYsp5So298',
    youtubeUrl: 'https://www.youtube.com/watch?v=mUYsp5So298',
    description: 'Intimate solo piano evoking calm water shores and gentle block placement.',
    proceduralFallbackProfile: 'sonar',
    isOfficial: true,
  },
  {
    id: 'mc-mice-on-venus',
    title: 'Mice on Venus',
    artist: 'C418',
    album: 'Minecraft - Volume Alpha',
    category: 'Overworld Exploration',
    duration: '4:41',
    youtubeId: 'T5_0iZ_PvhM',
    youtubeUrl: 'https://www.youtube.com/watch?v=T5_0iZ_PvhM',
    description: 'Ethereal acoustic melody rising into shimmering ambient synth pads.',
    proceduralFallbackProfile: 'space',
    isOfficial: true,
  },
  {
    id: 'mc-danny',
    title: 'Danny',
    artist: 'C418',
    album: 'Minecraft - Volume Alpha',
    category: 'Nighttime Survival',
    duration: '4:14',
    youtubeId: 'P4d6L5Q_UqU',
    youtubeUrl: 'https://www.youtube.com/watch?v=P4d6L5Q_UqU',
    description: 'Slow, contemplative nocturnal resonance beneath a starry cubic sky.',
    proceduralFallbackProfile: 'lofi',
    isOfficial: true,
  },
  {
    id: 'mc-cave-ambience',
    title: 'Deepslate Caverns & Low Drones',
    artist: 'FocusVerse Sandbox Audio',
    album: 'Procedural Deepslate Synthesizer',
    category: 'Cave Ambience',
    duration: 'Procedural Loop',
    youtubeId: '3z-q1Z3a52M',
    youtubeUrl: 'https://www.youtube.com/watch?v=3z-q1Z3a52M',
    description: 'Echoing stone drops, low resonant frequencies, and underground mystery.',
    proceduralFallbackProfile: 'sonar',
    isOfficial: false,
  },
  {
    id: 'mc-rainy-survival',
    title: 'Rain over the Wooden Cabin',
    artist: 'FocusVerse Acoustic Lab',
    album: 'Overworld Elements Vol. 1',
    category: 'Rainy Survival',
    duration: 'Procedural Loop',
    youtubeId: '14XlDqH1c24',
    youtubeUrl: 'https://www.youtube.com/watch?v=14XlDqH1c24',
    description: 'Gentle pixel downpour pattering against oak wooden roof blocks.',
    proceduralFallbackProfile: 'rain',
    isOfficial: false,
  },
  {
    id: 'mc-mining-groove',
    title: 'Y-Level -58 Mineral Focus',
    artist: 'FocusVerse 8-Bit Works',
    album: 'Subterranean Beats',
    category: 'Underground Mining',
    duration: 'Continuous Flow',
    youtubeId: 'oWde-M_tU3Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=oWde-M_tU3Q',
    description: 'Steady, hypnotic rhythm designed for uninterrupted deep-work sprints.',
    proceduralFallbackProfile: 'matrix',
    isOfficial: false,
  },
  {
    id: 'mc-longform-mix',
    title: '1-Hour Minecraft Piano & Ambience Study Mix',
    artist: 'Authorized Compilation',
    album: 'Calm Focus Collection',
    category: 'Long-Form Study Mix',
    duration: '60:00',
    youtubeId: '5qap5aO4i9A',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    description: 'Extended peaceful compilation ideal for double Pomodoro study blocks.',
    proceduralFallbackProfile: 'lofi',
    isOfficial: true,
  },
];
