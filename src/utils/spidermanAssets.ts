import manifest from '../../public/assets/characters/spiderman/manifest/animations.json';
import type { CustomAppearanceState } from './pixelSpriteCompositor';

export const SPIDERMAN_ROOT = `${import.meta.env.BASE_URL}assets/characters/spiderman/`;
export const spidermanManifest = manifest;
export type SpiderManAnimation = keyof typeof manifest.animations;
export const isSpiderManCostume = (appearance: CustomAppearanceState) =>
  appearance.outfit === 'arachnid-suit' && appearance.accessory === 'hero-mask';

let previewPromise: Promise<ImageData> | undefined;
export function loadSpiderManPreview(): Promise<ImageData> {
  if (!previewPromise) {
    previewPromise = new Promise<ImageData>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas unavailable')); return; }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0);
        resolve(ctx.getImageData(0, 0, 64, 96));
      };
      image.onerror = () => reject(new Error('Spider-Man preview failed to load'));
      image.src = spiderDesignUrl();
    }).catch(error => { previewPromise = undefined; throw error; });
  }
  return previewPromise;
}

export function spiderDesignUrl(direction = 'down', frame = 0, studying = false, portrait = false) {
  return SPIDERMAN_ROOT + `design/${portrait ? 'portrait' : `${direction}-${studying ? 'study' : frame}`}.svg`;
}
