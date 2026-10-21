import { isSpiderManCostume, loadSpiderManPreview } from '../utils/spidermanAssets';
import React, { useEffect, useRef } from 'react';
import { CustomAppearanceState, PixelSpriteCompositor } from '../utils/pixelSpriteCompositor';

export interface FullBodyPixelSpriteProps {
  appearance: CustomAppearanceState;
  size?: number; // target display height in px (e.g. 420)
  className?: string;
  showPlatform?: boolean;
  platformColor?: string;
  animated?: boolean;
  isShrinking?: boolean;
  onClick?: () => void;
  title?: string;
}

export const FullBodyPixelSprite: React.FC<FullBodyPixelSpriteProps> = ({
  appearance,
  size = 420,
  className = '',
  showPlatform = true,
  platformColor = '#F5C242',
  animated = true,
  isShrinking = false,
  onClick,
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositorRef = useRef<PixelSpriteCompositor>(new PixelSpriteCompositor());

  // Re-composite sprite onto canvas whenever any appearance property changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const compositor = compositorRef.current;
    compositor.composite(appearance);
    compositor.renderToCanvas(canvas);
    let cancelled = false;
    if (isSpiderManCostume(appearance)) {
      loadSpiderManPreview().then(pixels => {
        if (cancelled) return;
        compositor.composite(appearance, pixels);
        compositor.renderToCanvas(canvas);
      }).catch(error => console.warn(error));
    }
    return () => { cancelled = true; };
  }, [
    appearance.gender,
    appearance.outfit,
    appearance.hairStyle,
    appearance.hairColor,
    appearance.skinTone,
    appearance.accessory,
  ]);

  // Width is 64/96 of height (native 64x96 aspect ratio = 2:3)
  const displayHeight = isSpiderManCostume(appearance) ? Math.max(96, Math.floor(size / 96) * 96) : size;
  const displayWidth = Math.round((displayHeight * 64) / 96);

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Sprite Canvas Container with GBA Idle Bob & Exit Shrink Animations */}
      <div
        className={`relative z-10 transition-transform ${
          isShrinking ? 'animate-gba-warp-shrink' : animated ? 'animate-gba-idle-bob' : ''
        }`}
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
      >
        <canvas
          ref={canvasRef}
          width={64}
          height={96}
          className="w-full h-full block"
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Holographic Concentric Pedestal & Ground Shadow */}
      {showPlatform && (
        <div
          className="relative -mt-6 z-0 flex items-center justify-center pointer-events-none"
          style={{ width: displayWidth * 1.35, height: 38 }}
        >
          {/* Deep Void Ambient Shadow */}
          <div
            className="absolute rounded-full bg-black/60 blur-[3px]"
            style={{ width: '85%', height: '55%' }}
          />

          {/* Outer Holographic Energy Ring */}
          <div
            className="absolute rounded-full border border-dashed opacity-60 animate-[spin_18s_linear_infinite]"
            style={{
              width: '94%',
              height: '65%',
              borderColor: platformColor,
            }}
          />

          {/* Middle Glowing Hex / Concentric Ring */}
          <div
            className="absolute rounded-full border-2 opacity-85 shadow-[0_0_15px_rgba(245,194,66,0.35)]"
            style={{
              width: '74%',
              height: '50%',
              borderColor: platformColor,
              backgroundColor: `${platformColor}14`,
            }}
          />

          {/* Center Energy Pulse Node */}
          <div
            className="absolute rounded-full blur-[1px] animate-pulse"
            style={{
              width: '40%',
              height: '30%',
              backgroundColor: `${platformColor}40`,
            }}
          />
        </div>
      )}
    </div>
  );
};
