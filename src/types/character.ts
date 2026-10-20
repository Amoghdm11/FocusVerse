export type CharacterCategory = 
  | 'Superheroes' 
  | 'Anime' 
  | 'Animated & Fantasy' 
  | 'Sci-Fi' 
  | 'Cozy & Everyday';

export type EnvironmentFXType =
  | 'pixel-rain'
  | 'bat-sonar'
  | 'hud-nodes'
  | 'neon-sparks'
  | 'watercolor-glitch'
  | 'sakura-8bit'
  | 'infinity-grid'
  | 'dust-shafts'
  | 'crt-scanlines'
  | 'snow-crystals'
  | 'pixel-lanterns'
  | 'ocean-waves'
  | 'candle-sparks'
  | 'gothic-bats'
  | 'cyber-downpour'
  | 'matrix-rain'
  | 'lofi-rain'
  | 'city-windows'
  | 'sunbeam-pollen'
  | 'hearth-embers';

export type PixelSpriteType =
  | 'spider-emblem'
  | 'bat-sonar'
  | 'arc-reactor'
  | 'neon-spider'
  | 'ballet-drum'
  | 'sakura-scroll'
  | 'infinity-eye'
  | 'blade-crest'
  | 'terminal-l'
  | 'ice-snowflake'
  | 'sky-lantern'
  | 'ocean-spiral'
  | 'magic-candle'
  | 'gothic-raven'
  | 'baseline-blade'
  | 'matrix-code'
  | 'lofi-coffee'
  | 'midnight-lamp'
  | 'pixel-cat'
  | 'pixel-dog';

export interface CharacterPalette {
  bgVoid: string;
  borderPrimary: string;
  accentGold: string;
  accentSecondary: string;
  stripeColors: [string, string, string]; // Retro 3-color sunset victory band
}

export interface Character {
  id: string;
  index: string; // e.g., "01/20"
  name: string;
  archetypeName: string; // Copyright-Safe Mode name (Pixel-RPG Archetype)
  category: CharacterCategory;
  universe: string;
  tagline: string;
  quote: string;
  palette: CharacterPalette;
  pixelSpriteType: PixelSpriteType;
  environmentFX: EnvironmentFXType;
  codeSnippet: string[]; // 6 lines of character-themed Rust code
  synthNotes: number[]; // Frequencies for procedural chiptune arpeggios
  ambienceProfile: 'rain' | 'fire' | 'space' | 'matrix' | 'purr' | 'wind' | 'lofi' | 'sonar';
  genderOrSpirit: 'girl' | 'boy' | 'neutral';
}
