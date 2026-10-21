// ============================================================================
// FOCUSVERSE 2D FULL-BODY PIXEL SPRITE COMPOSITOR
// Classic Pokémon Gen 3–Inspired Pixel-Art Layered Character Customization Engine
// ============================================================================

import { Character } from '../types/character';

export type CharacterGender = 'boy' | 'girl';

export type HairStyleId =
  // Boy Styles
  | 'anime-spikes'
  | 'study-tousle'
  | 'sleek-undercut'
  | 'cyber-topknot'
  | 'retro-cap'
  // Girl Styles
  | 'cozy-buns'
  | 'cascading-waves'
  | 'cyber-bob'
  | 'high-ponytail'
  | 'messy-scrunchie';

export type HairColorId =
  | 'black'
  | 'chestnut'
  | 'blonde'
  | 'crimson'
  | 'cyan'
  | 'sakura'
  | 'platinum'
  | 'violet';

export type SkinToneId =
  | 'fair'
  | 'warm-tan'
  | 'golden-honey'
  | 'deep-bronze'
  | 'espresso'
  | 'cyber-synth';

export type OutfitId =
  | 'study-hoodie'
  | 'arachnid-suit'
  | 'cyber-ronin'
  | 'stealth-ops'
  | 'retro-arcade'
  | 'scholar-blazer';

export type AccessoryId =
  | 'none'
  | 'headphones'
  | 'cyber-visor'
  | 'hero-mask'
  | 'flow-aura';

export interface CustomAppearanceState {
  gender: CharacterGender;
  outfit: OutfitId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  skinTone: SkinToneId;
  accessory: AccessoryId;
  playerName: string;
}

export interface SuitMetadata {
  id: OutfitId;
  name: string;
  tagline: string;
  focusMod: string;
  stats: {
    focus: number;      // 0 - 100
    agility: number;    // 0 - 100
    resilience: number; // 0 - 100
  };
  themeColor: string;
  accentColor: string;
  description: string;
}

export const OUTFIT_CATALOG: SuitMetadata[] = [
  {
    id: 'study-hoodie',
    name: 'CLASSIC STUDY HOODIE',
    tagline: 'Lofi Comfort // Cozy Deep Focus',
    focusMod: '+25% FLOW RESILIENCE',
    stats: { focus: 92, agility: 75, resilience: 98 },
    themeColor: '#6366F1',
    accentColor: '#F5C242',
    description: 'Ultra-soft oversized fleece hoodie with relaxed cargo sweatpants and chunky retro skate sneakers. Maximizes thermal comfort during long study marathons.',
  },
  {
    id: 'arachnid-suit',
    name: 'ADVANCED ARACHNID SUIT',
    tagline: 'Insomniac Web-Tech // Hyper-Reflex Reflexes',
    focusMod: '+35% HYPER-REFLEX FOCUS',
    stats: { focus: 98, agility: 100, resilience: 90 },
    themeColor: '#DC2626',
    accentColor: '#FFFFFF',
    description: 'High-density composite hero suit inspired by the legendary web-slinger. Features white arachnid chest insignia, flexible rib panels, and carbon-reinforced landing boots.',
  },
  {
    id: 'cyber-ronin',
    name: 'CYBER-RONIN TRENCH',
    tagline: 'Neo-Tokyo Tactical // Distraction Defense',
    focusMod: '+30% NEON MATRIX DEFENSE',
    stats: { focus: 95, agility: 92, resilience: 94 },
    themeColor: '#06B6D4',
    accentColor: '#FACC15',
    description: 'Armored high-collar rain trench with luminous neon cyan telemetry seams, tactical belt holsters, and magnetic boots tuned for high-octane focus.',
  },
  {
    id: 'stealth-ops',
    name: 'STEALTH OPS BODYSUIT',
    tagline: 'Zero-Noise Nano-Weave // Silent Flow',
    focusMod: '+40% ZERO-DISTRACTION CAMO',
    stats: { focus: 100, agility: 96, resilience: 88 },
    themeColor: '#38BDF8',
    accentColor: '#F59E0B',
    description: 'Matte carbon nanosuit with golden energy veins that dampens ambient sound and suppresses notification distractions down to absolute zero.',
  },
  {
    id: 'retro-arcade',
    name: '90s SYNTH WINDBREAKER',
    tagline: 'Arcade Sunset // Chiptune Resonance',
    focusMod: '+20% SYNTHWAVE DOPAMINE',
    stats: { focus: 88, agility: 88, resilience: 95 },
    themeColor: '#D946EF',
    accentColor: '#14B8A6',
    description: 'Bold color-blocked vintage windbreaker featuring neon magenta chevron stripes, purple joggers, and arcade high-tops radiating pure 16-bit energy.',
  },
  {
    id: 'scholar-blazer',
    name: 'ACADEMY FOCUS UNIFORM',
    tagline: 'Imperial Scholar // Pomodoro Protocol',
    focusMod: '+30% POMODORO DISCIPLINE',
    stats: { focus: 96, agility: 80, resilience: 99 },
    themeColor: '#1E293B',
    accentColor: '#EAB308',
    description: 'Impeccably tailored academy jacket with brass buttons, crimson necktie, crisp collared dress shirt, tailored trousers, and polished oxford shoes.',
  },
];

export const HAIR_STYLES_BOY: { id: HairStyleId; name: string; previewIcon: string }[] = [
  { id: 'anime-spikes', name: 'ANIME SPIKES', previewIcon: '⚡' },
  { id: 'study-tousle', name: 'STUDY TOUSLE', previewIcon: '〰' },
  { id: 'sleek-undercut', name: 'SLEEK UNDERCUT', previewIcon: '✂' },
  { id: 'cyber-topknot', name: 'CYBER TOPKNOT', previewIcon: '⚔' },
  { id: 'retro-cap', name: 'RETRO CAP', previewIcon: '🧢' },
];

export const HAIR_STYLES_GIRL: { id: HairStyleId; name: string; previewIcon: string }[] = [
  { id: 'cozy-buns', name: 'COZY TWIN BUNS', previewIcon: '☕' },
  { id: 'cascading-waves', name: 'CASCADING WAVES', previewIcon: '🌊' },
  { id: 'cyber-bob', name: 'CYBER BOB', previewIcon: '💎' },
  { id: 'high-ponytail', name: 'HIGH PONYTAIL', previewIcon: '🏹' },
  { id: 'messy-scrunchie', name: 'MESSY SCRUNCHIE', previewIcon: '🎀' },
];

export const HAIR_COLORS: { id: HairColorId; name: string; hex: string }[] = [
  { id: 'black', name: 'OBSIDIAN BLACK', hex: '#18181B' },
  { id: 'chestnut', name: 'CHESTNUT AUBURN', hex: '#7C2D12' },
  { id: 'blonde', name: 'GOLDEN BLONDE', hex: '#FBBF24' },
  { id: 'crimson', name: 'CRIMSON SCARLET', hex: '#DC2626' },
  { id: 'cyan', name: 'NEON CYAN', hex: '#06B6D4' },
  { id: 'sakura', name: 'SAKURA PINK', hex: '#F472B6' },
  { id: 'platinum', name: 'SILVER PLATINUM', hex: '#E2E8F0' },
  { id: 'violet', name: 'ARCADE VIOLET', hex: '#8B5CF6' },
];

export const SKIN_TONES: { id: SkinToneId; name: string; hex: string }[] = [
  { id: 'fair', name: 'FAIR PEACH', hex: '#FED7AA' },
  { id: 'warm-tan', name: 'WARM TAN', hex: '#F59E0B' },
  { id: 'golden-honey', name: 'GOLDEN HONEY', hex: '#EAB308' },
  { id: 'deep-bronze', name: 'DEEP BRONZE', hex: '#9A3412' },
  { id: 'espresso', name: 'RICH ESPRESSO', hex: '#573322' },
  { id: 'cyber-synth', name: 'CYBER SYNTH', hex: '#E0E7FF' },
];

export const ACCESSORIES: { id: AccessoryId; name: string; description: string; icon: string }[] = [
  { id: 'none', name: 'NONE', description: 'Clean minimalist profile', icon: '✕' },
  { id: 'headphones', name: 'FOCUS PRO HEADPHONES', description: 'RGB monitor cans with noise dampening', icon: '🎧' },
  { id: 'cyber-visor', name: 'CYBER HUD VISOR', description: 'Tactical heads-up display scanlines', icon: '🥽' },
  { id: 'hero-mask', name: 'HERO STEALTH MASK', description: 'Aerosol filter mask with nano mesh', icon: '🎭' },
  { id: 'flow-aura', name: 'FLOW STATE AURA', description: 'Radiant pixel energy particle motes', icon: '✨' },
];

export const DEFAULT_BOY_CUSTOM: CustomAppearanceState = {
  gender: 'boy',
  outfit: 'study-hoodie',
  hairStyle: 'study-tousle',
  hairColor: 'black',
  skinTone: 'fair',
  accessory: 'headphones',
  playerName: 'TRAINER',
};

export const DEFAULT_GIRL_CUSTOM: CustomAppearanceState = {
  gender: 'girl',
  outfit: 'study-hoodie',
  hairStyle: 'cozy-buns',
  hairColor: 'chestnut',
  skinTone: 'fair',
  accessory: 'headphones',
  playerName: 'TRAINER',
};

// ============================================================================
// SPRITE PIXEL COMPOSITOR ENGINE (64x96 Resolution)
// ============================================================================

export class PixelSpriteCompositor {
  readonly width = 64;
  readonly height = 96;
  private buffer: Uint8ClampedArray;

  constructor() {
    this.buffer = new Uint8ClampedArray(this.width * this.height * 4);
  }

  clear() {
    this.buffer.fill(0);
  }

  setPixel(x: number, y: number, colorHex: string, alpha = 255) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    const idx = (y * this.width + x) * 4;
    const [r, g, b] = this.parseHex(colorHex);

    if (alpha >= 255) {
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
      this.buffer[idx + 3] = 255;
    } else {
      const sa = alpha / 255;
      const da = (this.buffer[idx + 3] / 255) * (1 - sa);
      const outA = sa + da;
      if (outA > 0) {
        this.buffer[idx] = Math.round((r * sa + this.buffer[idx] * da) / outA);
        this.buffer[idx + 1] = Math.round((g * sa + this.buffer[idx + 1] * da) / outA);
        this.buffer[idx + 2] = Math.round((b * sa + this.buffer[idx + 2] * da) / outA);
        this.buffer[idx + 3] = Math.round(outA * 255);
      }
    }
  }

  fillRect(x: number, y: number, w: number, h: number, colorHex: string, alpha = 255) {
    const startX = Math.max(0, Math.floor(x));
    const endX = Math.min(this.width, Math.ceil(x + w));
    const startY = Math.max(0, Math.floor(y));
    const endY = Math.min(this.height, Math.ceil(y + h));

    for (let py = startY; py < endY; py++) {
      for (let px = startX; px < endX; px++) {
        this.setPixel(px, py, colorHex, alpha);
      }
    }
  }

  strokeRect(x: number, y: number, w: number, h: number, colorHex: string) {
    this.strokeLine(x, y, x + w - 1, y, colorHex, 1);
    this.strokeLine(x, y + h - 1, x + w - 1, y + h - 1, colorHex, 1);
    this.strokeLine(x, y, x, y + h - 1, colorHex, 1);
    this.strokeLine(x + w - 1, y, x + w - 1, y + h - 1, colorHex, 1);
  }

  fillEllipse(cx: number, cy: number, rx: number, ry: number, colorHex: string) {
    const minX = Math.max(0, Math.floor(cx - rx));
    const maxX = Math.min(this.width - 1, Math.ceil(cx + rx));
    const minY = Math.max(0, Math.floor(cy - ry));
    const maxY = Math.min(this.height - 1, Math.ceil(cy + ry));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1.0) {
          this.setPixel(x, y, colorHex);
        }
      }
    }
  }

  fillPolygon(points: [number, number][], colorHex: string) {
    if (points.length < 3) return;
    let minY = this.height;
    let maxY = 0;
    for (const [, y] of points) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    minY = Math.max(0, Math.floor(minY));
    maxY = Math.min(this.height - 1, Math.ceil(maxY));

    for (let y = minY; y <= maxY; y++) {
      const nodeX: number[] = [];
      let j = points.length - 1;
      for (let i = 0; i < points.length; i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if ((yi < y && yj >= y) || (yj < y && yi >= y)) {
          nodeX.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
        }
        j = i;
      }
      nodeX.sort((a, b) => a - b);
      for (let k = 0; k < nodeX.length; k += 2) {
        if (k + 1 < nodeX.length) {
          const startX = Math.max(0, Math.round(nodeX[k]));
          const endX = Math.min(this.width - 1, Math.round(nodeX[k + 1]));
          for (let x = startX; x <= endX; x++) {
            this.setPixel(x, y, colorHex);
          }
        }
      }
    }
  }

  strokeLine(x0: number, y0: number, x1: number, y1: number, colorHex: string, thickness = 1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let cx = x0;
    let cy = y0;
    while (true) {
      if (thickness === 1) {
        this.setPixel(cx, cy, colorHex);
      } else {
        const rad = Math.floor(thickness / 2);
        this.fillRect(cx - rad, cy - rad, thickness, thickness, colorHex);
      }
      if (cx === x1 && cy === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        cx += sx;
      }
      if (e2 < dx) {
        err += dx;
        cy += sy;
      }
    }
  }

  private parseHex(hex: string): [number, number, number] {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.substring(0, 2), 16) || 0;
    const g = parseInt(h.substring(2, 4), 16) || 0;
    const b = parseInt(h.substring(4, 6), 16) || 0;
    return [r, g, b];
  }

  // Applies an authentic 1px arcade outline contour around all non-transparent pixels
  applyArcadeContour(outlineColor = '#0D0B18') {
    const copy = new Uint8ClampedArray(this.buffer);
    const [or, og, ob] = this.parseHex(outlineColor);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (y * this.width + x) * 4;
        // If current pixel is empty
        if (copy[idx + 3] === 0) {
          // Check 4-way neighbors
          let hasSolidNeighbor = false;
          if (x > 0 && copy[(y * this.width + (x - 1)) * 4 + 3] > 100) hasSolidNeighbor = true;
          else if (x < this.width - 1 && copy[(y * this.width + (x + 1)) * 4 + 3] > 100) hasSolidNeighbor = true;
          else if (y > 0 && copy[((y - 1) * this.width + x) * 4 + 3] > 100) hasSolidNeighbor = true;
          else if (y < this.height - 1 && copy[((y + 1) * this.width + x) * 4 + 3] > 100) hasSolidNeighbor = true;

          if (hasSolidNeighbor) {
            this.buffer[idx] = or;
            this.buffer[idx + 1] = og;
            this.buffer[idx + 2] = ob;
            this.buffer[idx + 3] = 255;
          }
        }
      }
    }
  }

  // ==========================================================================
  // COMPOSITING PASSES
  // ==========================================================================

  composite(state: CustomAppearanceState, costume?: ImageData) {
    if (costume && state.outfit === 'arachnid-suit' && state.accessory === 'hero-mask') {
      this.buffer.set(costume.data);
      return;
    }
    this.clear();

    const skin = this.getSkinPalette(state.skinTone);
    const hair = this.getHairPalette(state.hairColor);

    // 1. Aura / Particle Motives (Layer 0)
    if (state.accessory === 'flow-aura') {
      this.drawFlowAura(state.outfit);
    }

    // 2. Back Hair (Layer 1 - twin buns or long hair behind shoulders)
    this.drawBackHair(state.gender, state.hairStyle, hair);

    // 3. Body Anatomy Base (Layer 2)
    this.drawBodyAnatomy(state.gender, skin);

    // 4. Facial Features (Layer 3)
    this.drawFacialFeatures(state.gender, skin, hair, state.outfit);

    // 5. Outfit / Clothing (Layer 4)
    this.drawOutfit(state.gender, state.outfit);

    // 6. Front Hair & Fringe (Layer 5)
    this.drawFrontHair(state.gender, state.hairStyle, hair);

    // 7. Headwear / Accessory (Layer 6)
    if (state.accessory !== 'none' && state.accessory !== 'flow-aura') {
      this.drawAccessory(state.accessory, state.outfit);
    }

    // 8. 1px Retro Contour Outline Pass (Layer 7)
    this.applyArcadeContour('#0A0816');
  }

  private getSkinPalette(tone: SkinToneId) {
    switch (tone) {
      case 'fair':
        return { base: '#FED7AA', shadow: '#FDBA74', light: '#FFFBEB', contour: '#EA580C' };
      case 'warm-tan':
        return { base: '#F59E0B', shadow: '#D97706', light: '#FEF3C7', contour: '#B45309' };
      case 'golden-honey':
        return { base: '#EAB308', shadow: '#CA8A04', light: '#FEF9C3', contour: '#A16207' };
      case 'deep-bronze':
        return { base: '#9A3412', shadow: '#7C2D12', light: '#C2410C', contour: '#431407' };
      case 'espresso':
        return { base: '#573322', shadow: '#3B2215', light: '#784931', contour: '#26140A' };
      case 'cyber-synth':
        return { base: '#E0E7FF', shadow: '#C7D2FE', light: '#F5F3FF', contour: '#6366F1' };
      default:
        return { base: '#FED7AA', shadow: '#FDBA74', light: '#FFFBEB', contour: '#EA580C' };
    }
  }

  private getHairPalette(color: HairColorId) {
    switch (color) {
      case 'black':
        return { base: '#18181B', shadow: '#09090B', light: '#3F3F46' };
      case 'chestnut':
        return { base: '#7C2D12', shadow: '#451A03', light: '#B45309' };
      case 'blonde':
        return { base: '#FBBF24', shadow: '#D97706', light: '#FEF08A' };
      case 'crimson':
        return { base: '#DC2626', shadow: '#991B1B', light: '#F87171' };
      case 'cyan':
        return { base: '#06B6D4', shadow: '#0E7490', light: '#67E8F9' };
      case 'sakura':
        return { base: '#F472B6', shadow: '#DB2777', light: '#FBCFE8' };
      case 'platinum':
        return { base: '#E2E8F0', shadow: '#94A3B8', light: '#FFFFFF' };
      case 'violet':
        return { base: '#8B5CF6', shadow: '#6D28D9', light: '#C4B5FD' };
      default:
        return { base: '#18181B', shadow: '#09090B', light: '#3F3F46' };
    }
  }

  // --- 1. AURA MOTES ---
  private drawFlowAura(outfit: OutfitId) {
    const auraCol = outfit === 'arachnid-suit' ? '#EF4444' : outfit === 'cyber-ronin' ? '#06B6D4' : '#F5C242';
    const particles = [
      [12, 28, 3], [52, 24, 2], [10, 48, 2], [54, 52, 3],
      [14, 70, 2], [50, 72, 2], [18, 86, 3], [46, 88, 2],
      [22, 14, 2], [42, 12, 3], [32, 6, 2], [8, 38, 2], [56, 40, 2]
    ];
    for (const [px, py, s] of particles) {
      this.fillRect(px, py, s, s, auraCol, 210);
      this.setPixel(px + 1, py + 1, '#FFFFFF', 255);
    }
  }

  // --- 2. BACK HAIR ---
  private drawBackHair(gender: CharacterGender, style: HairStyleId, hair: { base: string; shadow: string; light: string }) {
    if (gender === 'girl') {
      if (style === 'cozy-buns') {
        // Two large buns on upper-left and upper-right of crown
        this.fillEllipse(17, 13, 8, 8, hair.shadow);
        this.fillEllipse(17, 12, 7, 7, hair.base);
        this.fillEllipse(16, 10, 3, 3, hair.light);

        this.fillEllipse(47, 13, 8, 8, hair.shadow);
        this.fillEllipse(47, 12, 7, 7, hair.base);
        this.fillEllipse(46, 10, 3, 3, hair.light);
      } else if (style === 'cascading-waves') {
        // Flowing long hair streaming down shoulders to waist
        this.fillPolygon([[17, 24], [12, 46], [22, 54], [25, 34]], hair.shadow);
        this.fillPolygon([[19, 25], [14, 44], [21, 50], [24, 34]], hair.base);
        this.fillPolygon([[47, 24], [52, 46], [42, 54], [39, 34]], hair.shadow);
        this.fillPolygon([[45, 25], [50, 44], [43, 50], [40, 34]], hair.base);
      } else if (style === 'high-ponytail') {
        // High ponytail flaring to the right
        this.fillPolygon([[36, 12], [52, 18], [55, 34], [44, 26]], hair.shadow);
        this.fillPolygon([[37, 13], [50, 19], [53, 32], [45, 25]], hair.base);
        this.setPixel(46, 18, hair.light);
      }
    } else {
      if (style === 'cyber-topknot') {
        // Samurai high topknot at top center
        this.fillEllipse(32, 9, 5, 6, hair.shadow);
        this.fillEllipse(32, 8, 4, 5, hair.base);
        this.fillRect(30, 11, 4, 3, '#F5C242'); // Gold ribbon
      }
    }
  }

  // --- 3. BODY ANATOMY ---
  private drawBodyAnatomy(gender: CharacterGender, skin: { base: string; shadow: string; light: string; contour: string }) {
    // 3a. Head Base (Y: 13 -> 34)
    this.fillEllipse(32, 24, 13, 11, skin.shadow);
    this.fillEllipse(32, 23, 12, 10, skin.base);

    // Chiseled jaw / soft chin (Y: 30 -> 34)
    const chinW = gender === 'boy' ? 5 : 4;
    this.fillRect(32 - chinW, 30, chinW * 2, 4, skin.shadow);
    this.fillRect(32 - chinW + 1, 30, (chinW - 1) * 2, 3, skin.base);

    // Ears
    this.fillEllipse(18, 25, 2, 4, skin.shadow);
    this.fillEllipse(18, 25, 1, 3, skin.base);
    this.fillEllipse(46, 25, 2, 4, skin.shadow);
    this.fillEllipse(46, 25, 1, 3, skin.base);

    // 3b. Neck (Y: 33 -> 38)
    const neckW = gender === 'boy' ? 4 : 3;
    this.fillRect(32 - neckW, 33, neckW * 2, 6, skin.shadow);
    this.fillRect(32 - neckW + 1, 34, (neckW - 1) * 2, 4, skin.base);

    // 3c. Torso / Shoulder foundation (Y: 38 -> 60)
    const shoulderW = gender === 'boy' ? 17 : 14;
    this.fillPolygon([
      [32 - shoulderW, 39],
      [32 + shoulderW, 39],
      [32 + shoulderW - 2, 58],
      [32 - shoulderW + 2, 58]
    ], skin.shadow);

    // 3d. Arms & Hands (Y: 40 -> 68)
    // Left arm & hand
    this.fillRect(32 - shoulderW - 2, 41, 5, 20, skin.shadow);
    this.fillRect(32 - shoulderW - 1, 41, 4, 19, skin.base);
    this.fillEllipse(32 - shoulderW, 63, 3, 4, skin.base); // hand
    // Right arm & hand
    this.fillRect(32 + shoulderW - 3, 41, 5, 20, skin.shadow);
    this.fillRect(32 + shoulderW - 3, 41, 4, 19, skin.base);
    this.fillEllipse(32 + shoulderW, 63, 3, 4, skin.base); // hand

    // 3e. Legs & Feet foundation (Y: 60 -> 92)
    // Left leg
    this.fillRect(23, 60, 7, 24, skin.shadow);
    this.fillRect(24, 60, 5, 23, skin.base);
    // Right leg
    this.fillRect(34, 60, 7, 24, skin.shadow);
    this.fillRect(35, 60, 5, 23, skin.base);
  }

  // --- 4. FACIAL FEATURES ---
  private drawFacialFeatures(
    gender: CharacterGender,
    skin: { base: string; shadow: string; light: string },
    hair: { base: string; shadow: string; light: string },
    outfit: OutfitId
  ) {
    const irisColor = outfit === 'arachnid-suit' ? '#0284C7' : outfit === 'cyber-ronin' ? '#06B6D4' : '#10B981';

    // Eyebrows
    this.strokeLine(24, 20, 29, 21, hair.base, 1);
    this.strokeLine(40, 21, 35, 20, hair.base, 1);

    // Eyes: Sclera + Iris + Specular Reflection (Classic Gen 3 Anime Eyes)
    // Left eye (X: 24 -> 28, Y: 23 -> 26)
    this.fillRect(24, 23, 5, 4, '#FFFFFF');
    this.fillRect(25, 23, 3, 4, irisColor);
    this.setPixel(26, 24, '#09090B'); // pupil
    this.setPixel(25, 23, '#FFFFFF'); // twinkle

    // Right eye (X: 35 -> 39, Y: 23 -> 26)
    this.fillRect(35, 23, 5, 4, '#FFFFFF');
    this.fillRect(36, 23, 3, 4, irisColor);
    this.setPixel(37, 24, '#09090B'); // pupil
    this.setPixel(36, 23, '#FFFFFF'); // twinkle

    // Subtle lash for girls
    if (gender === 'girl') {
      this.strokeLine(23, 22, 29, 22, '#09090B', 1);
      this.strokeLine(35, 22, 41, 22, '#09090B', 1);
      // Soft blush cheeks
      this.fillRect(22, 27, 3, 2, '#FDA4AF', 180);
      this.fillRect(39, 27, 3, 2, '#FDA4AF', 180);
    }

    // Nose (subtle shadow pixel)
    this.setPixel(32, 27, skin.shadow);

    // Mouth (confident subtle smile)
    this.strokeLine(30, 29, 34, 29, '#9A3412', 1);
    this.setPixel(31, 30, '#F43F5E');
  }

  // --- 5. OUTFITS / SUITS ---
  private drawOutfit(gender: CharacterGender, outfit: OutfitId) {
    switch (outfit) {
      case 'study-hoodie':
        this.drawStudyHoodie(gender);
        break;
      case 'arachnid-suit':
        this.drawArachnidSuit(gender);
        break;
      case 'cyber-ronin':
        this.drawCyberRonin(gender);
        break;
      case 'stealth-ops':
        this.drawStealthOps(gender);
        break;
      case 'retro-arcade':
        this.drawRetroArcade(gender);
        break;
      case 'scholar-blazer':
        this.drawScholarBlazer(gender);
        break;
    }
  }

  // Outfit 1: Classic Study Hoodie
  private drawStudyHoodie(gender: CharacterGender) {
    const hoodieCol = '#2E2856';
    const hoodieShadow = '#1D183B';
    const joggerCol = '#1E293B';
    const sneakerCol = '#F8FAFC';

    // Oversized Hoodie Torso
    this.fillPolygon([[16, 38], [48, 38], [47, 62], [17, 62]], hoodieCol);
    // Kangaroo pocket
    this.fillRect(24, 52, 16, 7, hoodieShadow);
    this.strokeRect(24, 52, 16, 7, '#F5C242');
    // White drawstrings
    this.strokeLine(28, 41, 28, 49, '#FFFFFF', 1);
    this.strokeLine(36, 41, 36, 49, '#FFFFFF', 1);

    // Sleeves
    this.fillRect(13, 40, 6, 19, hoodieCol);
    this.fillRect(13, 57, 6, 3, hoodieShadow); // cuff
    this.fillRect(45, 40, 6, 19, hoodieCol);
    this.fillRect(45, 57, 6, 3, hoodieShadow); // cuff

    // Joggers
    this.fillRect(22, 62, 8, 22, joggerCol);
    this.fillRect(34, 62, 8, 22, joggerCol);
    this.strokeLine(22, 62, 22, 82, '#F5C242', 1); // gold side piping
    this.strokeLine(41, 62, 41, 82, '#F5C242', 1);

    // Sneakers
    this.fillPolygon([[19, 84], [29, 84], [29, 90], [18, 90]], sneakerCol);
    this.fillRect(18, 89, 12, 2, '#D97706'); // gum sole
    this.fillPolygon([[35, 84], [45, 84], [46, 90], [35, 90]], sneakerCol);
    this.fillRect(35, 89, 12, 2, '#D97706');
  }

  // Outfit 2: Advanced Arachnid Suit (Insomniac Spider-Man Inspired)
  private drawArachnidSuit(gender: CharacterGender) {
    const redCol = '#DC2626';
    const redShadow = '#991B1B';
    const navyCol = '#1E3A8A';
    const whiteCol = '#FFFFFF';

    // Red Chest & Shoulder Armor
    this.fillPolygon([[17, 38], [47, 38], [44, 58], [20, 58]], redCol);
    // Navy side ribs
    this.fillPolygon([[17, 44], [23, 44], [22, 58], [19, 58]], navyCol);
    this.fillPolygon([[47, 44], [41, 44], [42, 58], [45, 58]], navyCol);

    // White Spider-Focus Insignia across chest
    // Head / Pedipalps
    this.fillRect(31, 41, 2, 2, whiteCol);
    // Thorax
    this.fillRect(30, 43, 4, 6, whiteCol);
    // Legs radiating
    this.strokeLine(30, 44, 25, 42, whiteCol, 1);
    this.strokeLine(34, 44, 39, 42, whiteCol, 1);
    this.strokeLine(30, 46, 26, 50, whiteCol, 1);
    this.strokeLine(34, 46, 38, 50, whiteCol, 1);

    // Arms: Red shoulders, navy elbows, red gauntlets
    this.fillRect(14, 40, 5, 8, redCol);
    this.fillRect(14, 48, 5, 6, navyCol);
    this.fillRect(14, 54, 5, 8, redCol);
    this.fillRect(45, 40, 5, 8, redCol);
    this.fillRect(45, 48, 5, 6, navyCol);
    this.fillRect(45, 54, 5, 8, redCol);

    // Navy Legs with Red Knee Pads
    this.fillRect(22, 58, 8, 25, navyCol);
    this.fillRect(34, 58, 8, 25, navyCol);
    this.fillRect(23, 69, 6, 5, redCol);
    this.fillRect(35, 69, 6, 5, redCol);

    // Red Arachnid Boots
    this.fillPolygon([[20, 83], [29, 83], [28, 91], [19, 91]], redCol);
    this.fillRect(19, 90, 10, 2, '#09090B');
    this.fillPolygon([[35, 83], [44, 83], [45, 91], [35, 91]], redCol);
    this.fillRect(35, 90, 10, 2, '#09090B');
  }

  // Outfit 3: Cyber-Ronin Trench
  private drawCyberRonin(gender: CharacterGender) {
    const coatCol = '#0F172A';
    const coatShadow = '#020617';
    const neonCyan = '#06B6D4';
    const yellow = '#EAB308';

    // High Tech Coat
    this.fillPolygon([[15, 37], [49, 37], [48, 74], [16, 74]], coatCol);
    // Center opening & inner shirt
    this.fillRect(29, 39, 6, 34, coatShadow);
    this.fillRect(30, 42, 4, 16, '#F8FAFC');

    // Glowing Neon Cyan Trim lines
    this.strokeLine(16, 37, 16, 74, neonCyan, 1);
    this.strokeLine(48, 37, 48, 74, neonCyan, 1);
    this.strokeLine(28, 39, 28, 72, neonCyan, 1);
    this.strokeLine(36, 39, 36, 72, neonCyan, 1);

    // Tactical utility belt
    this.fillRect(20, 56, 24, 3, '#1E293B');
    this.fillRect(26, 56, 3, 3, yellow);
    this.fillRect(35, 56, 3, 3, yellow);

    // Sleeves
    this.fillRect(13, 39, 6, 20, coatCol);
    this.strokeLine(13, 56, 19, 56, neonCyan, 1);
    this.fillRect(45, 39, 6, 20, coatCol);
    this.strokeLine(45, 56, 51, 56, neonCyan, 1);

    // Combat trousers
    this.fillRect(23, 72, 7, 14, '#1E293B');
    this.fillRect(34, 72, 7, 14, '#1E293B');

    // Cyber Magnetic Boots
    this.fillRect(20, 84, 9, 7, coatCol);
    this.fillRect(19, 89, 11, 2, neonCyan); // glowing heel
    this.fillRect(35, 84, 9, 7, coatCol);
    this.fillRect(34, 89, 11, 2, neonCyan);
  }

  // Outfit 4: Stealth Ops Bodysuit
  private drawStealthOps(gender: CharacterGender) {
    const carbonCol = '#1E293B';
    const stealthBlack = '#09090B';
    const gold = '#F59E0B';

    // Nanosuit Torso
    this.fillPolygon([[17, 38], [47, 38], [44, 60], [20, 60]], stealthBlack);
    this.fillRect(25, 41, 14, 17, carbonCol);

    // Golden Energy Conduit Lines
    this.strokeLine(25, 41, 32, 50, gold, 1);
    this.strokeLine(39, 41, 32, 50, gold, 1);
    this.strokeLine(32, 50, 32, 60, gold, 1);

    // Arm vambraces
    this.fillRect(14, 40, 5, 20, stealthBlack);
    this.fillRect(14, 52, 5, 5, gold);
    this.fillRect(45, 40, 5, 20, stealthBlack);
    this.fillRect(45, 52, 5, 5, gold);

    // Leg armor
    this.fillRect(22, 60, 8, 25, stealthBlack);
    this.strokeLine(26, 60, 26, 82, gold, 1);
    this.fillRect(34, 60, 8, 25, stealthBlack);
    this.strokeLine(38, 60, 38, 82, gold, 1);

    // Silent Runners
    this.fillRect(20, 85, 9, 6, carbonCol);
    this.fillRect(19, 90, 10, 1, gold);
    this.fillRect(35, 85, 9, 6, carbonCol);
    this.fillRect(35, 90, 10, 1, gold);
  }

  // Outfit 5: 90s Retro Arcade Windbreaker
  private drawRetroArcade(gender: CharacterGender) {
    const magenta = '#D946EF';
    const teal = '#14B8A6';
    const purple = '#581C87';
    const gold = '#FACC15';

    // Color-blocked Windbreaker
    this.fillRect(17, 38, 30, 23, purple);
    // Diagonal Chevron stripes
    this.fillPolygon([[17, 38], [32, 49], [32, 55], [17, 44]], magenta);
    this.fillPolygon([[47, 38], [32, 49], [32, 55], [47, 44]], teal);
    this.strokeLine(17, 45, 32, 56, gold, 1);
    this.strokeLine(47, 45, 32, 56, gold, 1);

    // Sleeves: Left magenta, Right teal
    this.fillRect(13, 40, 6, 18, magenta);
    this.fillRect(45, 40, 6, 18, teal);

    // Track pants
    this.fillRect(22, 61, 8, 23, '#3B0764');
    this.fillRect(34, 61, 8, 23, '#3B0764');
    this.strokeLine(22, 61, 22, 82, teal, 1);
    this.strokeLine(41, 61, 41, 82, magenta, 1);

    // Arcade High-Tops
    this.fillRect(19, 84, 10, 7, gold);
    this.fillRect(18, 89, 11, 2, purple);
    this.fillRect(35, 84, 10, 7, teal);
    this.fillRect(35, 89, 11, 2, magenta);
  }

  // Outfit 6: Scholar Academy Blazer
  private drawScholarBlazer(gender: CharacterGender) {
    const blazerNavy = '#1E293B';
    const whiteShirt = '#F8FAFC';
    const redTie = '#B91C1C';
    const gold = '#EAB308';
    const charcoal = '#334155';

    // Tailored Blazer Jacket
    this.fillPolygon([[17, 38], [47, 38], [45, 62], [19, 62]], blazerNavy);
    // White collared shirt V-opening
    this.fillPolygon([[28, 38], [36, 38], [32, 49]], whiteShirt);
    // Crimson Tie
    this.fillPolygon([[31, 41], [33, 41], [34, 52], [32, 54], [30, 52]], redTie);
    // Brass crested buttons
    this.setPixel(32, 55, gold);
    this.setPixel(32, 58, gold);

    // Sleeves with gold cuff piping
    this.fillRect(14, 39, 5, 20, blazerNavy);
    this.strokeLine(14, 56, 19, 56, gold, 1);
    this.fillRect(45, 39, 5, 20, blazerNavy);
    this.strokeLine(45, 56, 50, 56, gold, 1);

    // Trousers
    this.fillRect(22, 62, 8, 22, charcoal);
    this.fillRect(34, 62, 8, 22, charcoal);

    // Polished Oxford Shoes
    this.fillPolygon([[19, 84], [29, 84], [28, 90], [18, 90]], '#0F172A');
    this.fillRect(18, 89, 11, 2, '#78350F');
    this.fillPolygon([[35, 84], [45, 84], [46, 90], [35, 90]], '#0F172A');
    this.fillRect(35, 89, 11, 2, '#78350F');
  }

  // --- 6. FRONT HAIR ---
  private drawFrontHair(
    gender: CharacterGender,
    style: HairStyleId,
    hair: { base: string; shadow: string; light: string }
  ) {
    if (gender === 'boy') {
      switch (style) {
        case 'anime-spikes':
          // Bold anime spikes radiating outward
          this.fillEllipse(32, 16, 15, 8, hair.base);
          const spikes = [
            [[16, 20], [8, 10], [22, 14]],
            [[20, 14], [16, 4], [28, 10]],
            [[26, 10], [32, 2], [38, 10]],
            [[36, 10], [48, 4], [44, 14]],
            [[42, 14], [56, 10], [48, 20]],
            [[21, 16], [25, 24], [28, 18]],
            [[28, 18], [32, 25], [36, 18]],
            [[36, 18], [40, 24], [43, 16]],
          ];
          for (const s of spikes) this.fillPolygon(s as [number, number][], hair.base);
          this.strokeLine(26, 10, 32, 3, hair.light, 1);
          break;

        case 'study-tousle':
          // Comfy, textured tousle
          this.fillEllipse(32, 17, 16, 9, hair.base);
          this.fillEllipse(32, 15, 14, 6, hair.light);
          this.fillPolygon([[18, 18], [22, 25], [26, 18]], hair.base);
          this.fillPolygon([[25, 18], [30, 26], [35, 18]], hair.base);
          this.fillPolygon([[34, 18], [39, 25], [44, 18]], hair.base);
          this.fillPolygon([[43, 18], [48, 24], [49, 18]], hair.base);
          break;

        case 'sleek-undercut':
          // Clean parted undercut
          this.fillPolygon([[18, 22], [22, 12], [46, 13], [46, 21]], hair.base);
          this.fillEllipse(33, 15, 13, 6, hair.light);
          this.fillRect(17, 21, 3, 5, hair.shadow); // shaved side
          this.strokeLine(24, 13, 24, 23, hair.shadow, 1);
          break;

        case 'cyber-topknot':
          // Shaved sides with slicked top
          this.fillEllipse(32, 17, 13, 7, hair.base);
          this.fillRect(18, 18, 3, 8, hair.shadow);
          this.fillRect(43, 18, 3, 8, hair.shadow);
          this.fillPolygon([[26, 16], [32, 23], [38, 16]], hair.base);
          break;

        case 'retro-cap':
          // Red/white retro trainer baseball cap
          this.fillEllipse(32, 16, 15, 8, '#DC2626'); // Red crown
          this.fillEllipse(32, 14, 13, 5, '#EF4444');
          this.fillRect(20, 19, 24, 4, '#FFFFFF');    // White band
          this.fillPolygon([[16, 21], [32, 24], [48, 21]], '#09090B'); // Visor
          // Front badge (Poke-inspired focus emblem)
          this.fillEllipse(32, 16, 3, 3, '#FFFFFF');
          this.setPixel(32, 16, '#06B6D4');
          break;

        default:
          this.fillEllipse(32, 17, 15, 8, hair.base);
          break;
      }
    } else {
      // Girl Styles
      switch (style) {
        case 'cozy-buns':
          // Head hair with parted bangs
          this.fillEllipse(32, 17, 16, 9, hair.base);
          this.fillPolygon([[20, 18], [24, 25], [28, 19]], hair.base);
          this.fillPolygon([[27, 18], [32, 26], [37, 18]], hair.base);
          this.fillPolygon([[36, 18], [41, 25], [44, 18]], hair.base);
          // Hair highlights
          this.strokeLine(26, 14, 38, 14, hair.light, 1);
          break;

        case 'cascading-waves':
          // Voluminous top hair and framing side locks
          this.fillEllipse(32, 16, 17, 9, hair.base);
          this.strokeLine(24, 13, 40, 13, hair.light, 1);
          this.fillPolygon([[18, 19], [17, 32], [22, 26]], hair.base);
          this.fillPolygon([[46, 19], [47, 32], [42, 26]], hair.base);
          this.fillPolygon([[26, 17], [30, 24], [34, 18]], hair.base);
          this.fillPolygon([[33, 18], [37, 24], [41, 18]], hair.base);
          break;

        case 'cyber-bob':
          // Sharp angled asymmetric bob
          this.fillEllipse(32, 16, 16, 8, hair.base);
          this.fillPolygon([[16, 17], [15, 31], [22, 22]], hair.base);
          this.fillPolygon([[48, 17], [49, 28], [43, 21]], hair.base);
          this.strokeLine(20, 20, 44, 20, hair.base, 2); // straight bangs
          this.strokeLine(22, 13, 38, 13, hair.light, 1);
          break;

        case 'high-ponytail':
          // Clean swept back hair into ponytail
          this.fillEllipse(32, 16, 15, 8, hair.base);
          this.strokeLine(26, 13, 38, 13, hair.light, 1);
          this.fillPolygon([[22, 18], [26, 24], [29, 18]], hair.base);
          this.fillPolygon([[35, 18], [38, 24], [42, 18]], hair.base);
          this.fillRect(36, 11, 4, 3, '#F5C242'); // Gold scrunchie
          break;

        case 'messy-scrunchie':
          // Top bun with loose wispy tendrils
          this.fillEllipse(32, 16, 16, 8, hair.base);
          this.fillEllipse(32, 10, 6, 6, hair.shadow);
          this.fillEllipse(32, 9, 5, 5, hair.base);
          this.fillRect(30, 12, 4, 3, '#F472B6'); // Pink scrunchie
          // Wisps
          this.strokeLine(18, 22, 16, 29, hair.base, 1);
          this.strokeLine(46, 22, 48, 29, hair.base, 1);
          break;

        default:
          this.fillEllipse(32, 17, 16, 8, hair.base);
          break;
      }
    }
  }

  // --- 7. ACCESSORIES (FRONT) ---
  private drawAccessory(accessory: AccessoryId, outfit: OutfitId) {
    switch (accessory) {
      case 'headphones':
        // Studio Monitor Headphones over ears & headband
        this.strokeLine(17, 19, 47, 19, '#09090B', 3);
        this.strokeLine(18, 18, 46, 18, '#F5C242', 1);
        // Left earcup
        this.fillEllipse(17, 26, 3, 6, '#09090B');
        this.fillEllipse(17, 26, 2, 4, '#F5C242');
        this.setPixel(17, 26, '#06B6D4'); // Pulsing LED
        // Right earcup
        this.fillEllipse(47, 26, 3, 6, '#09090B');
        this.fillEllipse(47, 26, 2, 4, '#F5C242');
        this.setPixel(47, 26, '#06B6D4');
        break;

      case 'cyber-visor':
        // Glowing Neon HUD Visor over eyes
        this.fillRect(22, 23, 20, 4, '#06B6D4', 190);
        this.strokeRect(22, 23, 20, 4, '#67E8F9');
        // Tactical reticle & target glint
        this.setPixel(25, 24, '#FFFFFF');
        this.setPixel(38, 24, '#FFFFFF');
        this.strokeLine(20, 24, 22, 24, '#06B6D4', 1);
        this.strokeLine(42, 24, 44, 24, '#06B6D4', 1);
        break;

      case 'hero-mask':
        // Stealth ninja lower-face mask
        this.fillPolygon([[24, 27], [40, 27], [35, 33], [29, 33]], '#18181B');
        this.strokeLine(24, 27, 40, 27, '#F5C242', 1);
        break;
    }
  }

  // ==========================================================================
  // EXPORT / RENDER METHODS
  // ==========================================================================

  renderToCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(this.width, this.height);
    imgData.data.set(this.buffer);
    ctx.putImageData(imgData, 0, 0);
  }

  renderToDataURL(): string {
    if (typeof document === 'undefined') return '';
    const tempCanvas = document.createElement('canvas');
    this.renderToCanvas(tempCanvas);
    return tempCanvas.toDataURL('image/png');
  }
}

// Global Singleton Instance for quick rendering
export const spriteCompositor = new PixelSpriteCompositor();

/**
 * Maps any FocusVerse Character to a tailored 2D full-body pixel appearance
 */
export function getAppearanceForCharacter(
  char: Character,
  playerName?: string
): CustomAppearanceState {
  const charGender: CharacterGender = char.genderOrSpirit === 'girl' ? 'girl' : 'boy';
  const defaults = charGender === 'girl' ? DEFAULT_GIRL_CUSTOM : DEFAULT_BOY_CUSTOM;

  let outfit: OutfitId = defaults.outfit;
  let hairStyle: HairStyleId = defaults.hairStyle;
  let hairColor: HairColorId = defaults.hairColor;
  let skinTone: SkinToneId = 'fair';
  let accessory: AccessoryId = defaults.accessory;

  switch (char.id) {
    case 'peter-parker':
      outfit = 'arachnid-suit';
      hairStyle = 'study-tousle';
      hairColor = 'chestnut';
      skinTone = 'fair';
      break;

    case 'miles-morales':
      outfit = 'arachnid-suit';
      hairStyle = 'study-tousle';
      hairColor = 'black';
      skinTone = 'espresso';
      accessory = 'headphones';
      break;

    case 'gwen-stacy':
      outfit = 'arachnid-suit';
      hairStyle = 'cyber-bob';
      hairColor = 'platinum';
      skinTone = 'fair';
      accessory = 'headphones';
      break;

    case 'bruce-wayne':
    case 'batman':
      outfit = 'stealth-ops';
      hairStyle = 'sleek-undercut';
      hairColor = 'black';
      skinTone = 'fair';
      accessory = 'hero-mask';
      break;

    case 'tony-stark':
      outfit = 'cyber-ronin';
      hairStyle = 'sleek-undercut';
      hairColor = 'black';
      skinTone = 'fair';
      accessory = 'cyber-visor';
      break;

    case 'gojo-satoru':
      outfit = 'cyber-ronin';
      hairStyle = 'anime-spikes';
      hairColor = 'platinum';
      skinTone = 'fair';
      accessory = 'cyber-visor';
      break;

    case 'levi-ackerman':
      outfit = 'stealth-ops';
      hairStyle = 'sleek-undercut';
      hairColor = 'black';
      skinTone = 'fair';
      break;

    case 'l-lawliet':
      outfit = 'study-hoodie';
      hairStyle = 'anime-spikes';
      hairColor = 'black';
      skinTone = 'fair';
      break;

    case 'naruto-uzumaki':
      outfit = 'retro-arcade';
      hairStyle = 'anime-spikes';
      hairColor = 'blonde';
      skinTone = 'warm-tan';
      break;

    case 'son-goku':
      outfit = 'retro-arcade';
      hairStyle = 'anime-spikes';
      hairColor = 'black';
      skinTone = 'warm-tan';
      break;

    case 'neo':
      outfit = 'stealth-ops';
      hairStyle = 'sleek-undercut';
      hairColor = 'black';
      skinTone = 'fair';
      accessory = 'cyber-visor';
      break;

    case 'officer-k':
      outfit = 'cyber-ronin';
      hairStyle = 'sleek-undercut';
      hairColor = 'chestnut';
      skinTone = 'fair';
      break;

    case 'elsa':
      outfit = 'scholar-blazer';
      hairStyle = 'high-ponytail';
      hairColor = 'platinum';
      skinTone = 'fair';
      break;

    case 'rapunzel':
      outfit = 'scholar-blazer';
      hairStyle = 'cascading-waves';
      hairColor = 'blonde';
      skinTone = 'fair';
      break;

    case 'moana':
      outfit = 'study-hoodie';
      hairStyle = 'cascading-waves';
      hairColor = 'black';
      skinTone = 'warm-tan';
      break;

    case 'hermione-granger':
      outfit = 'scholar-blazer';
      hairStyle = 'cascading-waves';
      hairColor = 'chestnut';
      skinTone = 'fair';
      break;

    case 'wednesday-addams':
      outfit = 'scholar-blazer';
      hairStyle = 'cascading-waves';
      hairColor = 'black';
      skinTone = 'fair';
      break;

    case 'cozy-study-girl':
      outfit = 'study-hoodie';
      hairStyle = 'cozy-buns';
      hairColor = 'chestnut';
      skinTone = 'fair';
      accessory = 'headphones';
      break;

    case 'late-night-study-boy':
      outfit = 'study-hoodie';
      hairStyle = 'study-tousle';
      hairColor = 'black';
      skinTone = 'fair';
      accessory = 'headphones';
      break;

    case 'purring-window-cat':
      outfit = 'study-hoodie';
      hairStyle = 'cozy-buns';
      hairColor = 'chestnut';
      skinTone = 'fair';
      break;

    case 'loyal-fireplace-dog':
      outfit = 'retro-arcade';
      hairStyle = 'study-tousle';
      hairColor = 'chestnut';
      skinTone = 'fair';
      break;

    default:
      if (charGender === 'girl') {
        outfit = 'scholar-blazer';
        hairStyle = 'cascading-waves';
        hairColor = 'chestnut';
      } else {
        outfit = 'study-hoodie';
        hairStyle = 'study-tousle';
        hairColor = 'black';
      }
      break;
  }

  return {
    gender: charGender,
    outfit,
    hairStyle,
    hairColor,
    skinTone,
    accessory,
    playerName: playerName || 'TRAINER',
  };
}
