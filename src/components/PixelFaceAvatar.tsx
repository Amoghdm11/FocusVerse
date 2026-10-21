import { spiderDesignUrl } from '../utils/spidermanAssets';
import React, { useState } from 'react';

export interface PixelFaceAvatarProps {
  characterId: string;
  size?: number;
  className?: string;
  title?: string;
}

export const PixelFaceAvatar: React.FC<PixelFaceAvatarProps> = ({
  characterId,
  size = 64,
  className = '',
  title = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Fallback to peter-parker or default avatar if image fails to load
  const imgSrc = characterId === 'peter-parker' || hasError ? spiderDesignUrl('down', 0, false, true) : `${import.meta.env.BASE_URL}avatars/${characterId}.png`;

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden select-none bg-[#0E0B1C] p-0 ${className}`}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
      title={title || characterId}
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
        className="w-full h-full object-cover block m-0 p-0 pointer-events-none"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};
