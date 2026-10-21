import { spiderDesignUrl } from '../utils/spidermanAssets';
import React, { useState } from 'react';

export interface PixelCharacterSpriteProps {
  characterId: string;
  size?: number; // display size in pixels (default: 128)
  animated?: boolean;
  showPlatform?: boolean;
  platformColor?: string;
  platformGlow?: string;
  className?: string;
  onClick?: () => void;
  statusAura?: boolean;
  isShrinking?: boolean;
  title?: string;
}

export const PixelCharacterSprite: React.FC<PixelCharacterSpriteProps> = ({
  characterId,
  size = 128,
  animated = true,
  showPlatform = false,
  platformColor = '#F5C242',
  platformGlow = 'rgba(245, 194, 66, 0.45)',
  className = '',
  onClick,
  statusAura = false,
  isShrinking = false,
  title = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Fallback to peter-parker if character avatar is missing
  const imgSrc = characterId === 'peter-parker' || hasError ? spiderDesignUrl('down', 0, false, false) : `${import.meta.env.BASE_URL}avatars/${characterId}.png`;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      } ${className}`}
      style={{
        width: size,
        height: showPlatform ? size + 36 : size,
      }}
      title={title || characterId}
    >
      {/* Dynamic Ambient Aura Glow */}
      {statusAura && (
        <div
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            width: size * 0.9,
            height: size * 0.9,
            top: size * 0.05,
            background: `radial-gradient(circle, ${platformGlow} 0%, transparent 70%)`,
            filter: 'blur(8px)',
            zIndex: 1,
          }}
        />
      )}

      {/* Retro Pokémon Gen 3 Circular Battle Platform */}
      {showPlatform && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 4,
            width: size * 0.95,
            height: size * 0.32,
            zIndex: 1,
          }}
        >
          {/* Ground Contact Shadow */}
          <div
            className="w-full h-full rounded-[50%] bg-[#080612]/90 border-2"
            style={{
              borderColor: platformColor,
              boxShadow: `0 0 16px ${platformGlow}, inset 0 0 10px ${platformGlow}`,
              background: `radial-gradient(ellipse at center, ${platformColor}33 0%, #090714ee 80%)`,
            }}
          >
            {/* Inner Concentric Pulse Ring */}
            <div
              className="w-3/4 h-3/4 mx-auto my-auto mt-1 rounded-[50%] border border-dashed opacity-60 animate-pulse"
              style={{ borderColor: platformColor }}
            />
          </div>
        </div>
      )}

      {/* Main 2D Pixel Sprite Graphic */}
      <div
        className={`relative z-10 transition-all ${
          isShrinking
            ? 'animate-gba-warp-shrink'
            : animated
            ? 'animate-gba-idle-bob'
            : ''
        }`}
        style={{
          width: size,
          height: size,
          imageRendering: 'pixelated',
        }}
      >
        <img
          src={imgSrc}
          alt={title || characterId}
          width={size}
          height={size}
          loading="eager"
          decoding="sync"
          onError={() => {
            if (!hasError) setHasError(true);
          }}
          className="w-full h-full object-contain block m-0 p-0 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]"
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
};
