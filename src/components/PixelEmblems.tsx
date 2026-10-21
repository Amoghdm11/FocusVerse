import { SpiderEmblem, SPIDER_PALETTE } from './SpiderManDesign';
import React from 'react';
import { PixelSpriteType, CharacterPalette } from '../types/character';

interface PixelEmblemProps {
  type: PixelSpriteType;
  palette: CharacterPalette;
  className?: string;
  size?: number;
}

export const PixelEmblem: React.FC<PixelEmblemProps> = ({
  type,
  palette,
  className = '',
  size = 48,
}) => {
  const p1 = palette.borderPrimary;
  const p2 = palette.accentGold;
  const p3 = palette.accentSecondary;

  const renderIcon = () => {
    switch (type) {
      case 'spider-emblem':
        return <svg viewBox="-10 -11 20 24" width={size} height={size} aria-label="Spider emblem"><rect x="-10" y="-11" width="20" height="24" rx="3" fill={SPIDER_PALETTE.red}/><SpiderEmblem/></svg>;

      case 'bat-sonar':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Bat Wings & Ears */}
            <rect x="10" y="7" width="1" height="3" fill={p2} />
            <rect x="13" y="7" width="1" height="3" fill={p2} />
            <rect x="11" y="9" width="2" height="7" fill={p1} />
            <rect x="7" y="10" width="4" height="4" fill={p1} />
            <rect x="13" y="10" width="4" height="4" fill={p1} />
            <rect x="3" y="7" width="4" height="3" fill={p3} />
            <rect x="17" y="7" width="4" height="3" fill={p3} />
            <rect x="1" y="10" width="3" height="5" fill={p3} />
            <rect x="20" y="10" width="3" height="5" fill={p3} />
            {/* Sonar waves */}
            <rect x="8" y="3" width="8" height="1" fill={p3} opacity="0.6" />
            <rect x="5" y="1" width="14" height="1" fill={p3} opacity="0.4" />
          </svg>
        );

      case 'arc-reactor':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Triangular Core & Coils */}
            <rect x="7" y="4" width="10" height="2" fill={p1} />
            <rect x="4" y="7" width="2" height="10" fill={p1} />
            <rect x="18" y="7" width="2" height="10" fill={p1} />
            <rect x="7" y="18" width="10" height="2" fill={p1} />
            <rect x="9" y="9" width="6" height="6" fill={p3} />
            <rect x="11" y="11" width="2" height="2" fill="#FFFFFF" />
            <rect x="11" y="6" width="2" height="2" fill={p2} />
            <rect x="6" y="11" width="2" height="2" fill={p2} />
            <rect x="16" y="11" width="2" height="2" fill={p2} />
            <rect x="11" y="16" width="2" height="2" fill={p2} />
          </svg>
        );

      case 'neon-spider':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Electric Neon spray silhouette */}
            <rect x="10" y="6" width="4" height="4" fill={p1} />
            <rect x="8" y="10" width="8" height="6" fill={p2} />
            <rect x="10" y="16" width="4" height="4" fill={p1} />
            <rect x="4" y="6" width="4" height="2" fill={p3} />
            <rect x="2" y="8" width="2" height="6" fill={p3} />
            <rect x="16" y="6" width="4" height="2" fill={p3} />
            <rect x="20" y="8" width="2" height="6" fill={p3} />
            <rect x="4" y="16" width="3" height="5" fill={p1} />
            <rect x="17" y="16" width="3" height="5" fill={p1} />
          </svg>
        );

      case 'ballet-drum':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Drum Rim & Sticks */}
            <rect x="5" y="8" width="14" height="2" fill={p2} />
            <rect x="5" y="10" width="14" height="7" fill={p1} />
            <rect x="7" y="10" width="2" height="7" fill={p3} />
            <rect x="11" y="10" width="2" height="7" fill={p3} />
            <rect x="15" y="10" width="2" height="7" fill={p3} />
            <rect x="5" y="17" width="14" height="2" fill={p2} />
            <rect x="3" y="3" width="2" height="6" fill={p3} />
            <rect x="19" y="3" width="2" height="6" fill={p3} />
          </svg>
        );

      case 'sakura-scroll':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Ninja Scroll & Petals */}
            <rect x="4" y="6" width="16" height="12" fill={p1} />
            <rect x="6" y="8" width="12" height="8" fill={p2} />
            <rect x="10" y="10" width="4" height="4" fill={p3} />
            <rect x="2" y="5" width="2" height="14" fill={p2} />
            <rect x="20" y="5" width="2" height="14" fill={p2} />
            <rect x="9" y="2" width="2" height="2" fill="#FFB703" />
            <rect x="15" y="20" width="2" height="2" fill="#FFB703" />
          </svg>
        );

      case 'infinity-eye':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Six Eyes / Infinity Symbol */}
            <rect x="4" y="8" width="6" height="8" fill={p1} />
            <rect x="6" y="10" width="2" height="4" fill="#0B0914" />
            <rect x="14" y="8" width="6" height="8" fill={p1} />
            <rect x="16" y="10" width="2" height="4" fill="#0B0914" />
            <rect x="10" y="10" width="4" height="4" fill={p2} />
            <rect x="11" y="11" width="2" height="2" fill={p3} />
            <rect x="2" y="11" width="2" height="2" fill={p3} />
            <rect x="20" y="11" width="2" height="2" fill={p3} />
          </svg>
        );

      case 'blade-crest':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Scout Wings & Crossed Blades */}
            <rect x="4" y="4" width="2" height="14" fill={p3} />
            <rect x="18" y="4" width="2" height="14" fill={p3} />
            <rect x="3" y="17" width="4" height="3" fill={p1} />
            <rect x="17" y="17" width="4" height="3" fill={p1} />
            <rect x="8" y="8" width="8" height="2" fill={p2} />
            <rect x="10" y="10" width="4" height="8" fill={p1} />
            <rect x="11" y="6" width="2" height="2" fill={p2} />
          </svg>
        );

      case 'terminal-l':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Gothic L / Terminal Prompt */}
            <rect x="5" y="5" width="4" height="14" fill={p2} />
            <rect x="5" y="15" width="14" height="4" fill={p2} />
            <rect x="15" y="9" width="4" height="4" fill={p3} />
            <rect x="11" y="9" width="2" height="2" fill={p1} />
          </svg>
        );

      case 'ice-snowflake':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Hexagonal Pixel Snowflake */}
            <rect x="11" y="2" width="2" height="20" fill={p1} />
            <rect x="2" y="11" width="20" height="2" fill={p1} />
            <rect x="6" y="6" width="2" height="2" fill={p3} />
            <rect x="16" y="6" width="2" height="2" fill={p3} />
            <rect x="6" y="16" width="2" height="2" fill={p3} />
            <rect x="16" y="16" width="2" height="2" fill={p3} />
            <rect x="10" y="10" width="4" height="4" fill={p2} />
          </svg>
        );

      case 'sky-lantern':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Glowing Festival Lantern */}
            <rect x="7" y="4" width="10" height="13" fill={p1} />
            <rect x="9" y="6" width="6" height="9" fill={p2} />
            <rect x="11" y="8" width="2" height="5" fill="#FFFFFF" />
            <rect x="8" y="17" width="8" height="2" fill={p3} />
            <rect x="10" y="19" width="4" height="2" fill={p2} />
          </svg>
        );

      case 'ocean-spiral':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Heart of Te Fiti Spiral */}
            <rect x="6" y="6" width="12" height="2" fill={p1} />
            <rect x="16" y="8" width="2" height="10" fill={p1} />
            <rect x="6" y="16" width="10" height="2" fill={p1} />
            <rect x="6" y="10" width="2" height="6" fill={p1} />
            <rect x="10" y="10" width="4" height="2" fill={p2} />
            <rect x="12" y="12" width="2" height="2" fill={p3} />
          </svg>
        );

      case 'magic-candle':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Floating Candle with Flame */}
            <rect x="11" y="3" width="2" height="3" fill="#FFE082" />
            <rect x="10" y="4" width="4" height="2" fill={p2} />
            <rect x="11" y="6" width="2" height="2" fill="#FF5722" />
            <rect x="9" y="8" width="6" height="12" fill={p1} />
            <rect x="8" y="20" width="8" height="2" fill={p3} />
          </svg>
        );

      case 'gothic-raven':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Gothic Raven Profile */}
            <rect x="7" y="6" width="6" height="6" fill={p2} />
            <rect x="13" y="8" width="5" height="2" fill={p3} />
            <rect x="9" y="8" width="2" height="2" fill="#FFFFFF" />
            <rect x="6" y="12" width="10" height="6" fill={p1} />
            <rect x="8" y="18" width="2" height="4" fill={p3} />
            <rect x="12" y="18" width="2" height="4" fill={p3} />
          </svg>
        );

      case 'baseline-blade':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Cyber Origami / Blaster badge */}
            <rect x="4" y="10" width="16" height="4" fill={p1} />
            <rect x="14" y="6" width="4" height="4" fill={p2} />
            <rect x="6" y="14" width="4" height="5" fill={p3} />
            <rect x="18" y="11" width="3" height="2" fill={p2} />
          </svg>
        );

      case 'matrix-code':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Phosphor Katakana Matrix glyph */}
            <rect x="4" y="4" width="2" height="4" fill={p1} />
            <rect x="8" y="4" width="10" height="2" fill={p1} />
            <rect x="12" y="6" width="2" height="12" fill={p2} />
            <rect x="7" y="12" width="12" height="2" fill={p1} />
            <rect x="5" y="18" width="6" height="2" fill={p3} />
            <rect x="15" y="18" width="6" height="2" fill={p3} />
          </svg>
        );

      case 'lofi-coffee':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Steaming Mug */}
            <rect x="9" y="3" width="2" height="2" fill={p3} />
            <rect x="13" y="2" width="2" height="3" fill={p3} />
            <rect x="6" y="7" width="10" height="12" fill={p1} />
            <rect x="16" y="9" width="3" height="7" fill={p2} />
            <rect x="16" y="11" width="2" height="3" fill="#0B0914" />
            <rect x="5" y="19" width="12" height="2" fill={p2} />
          </svg>
        );

      case 'midnight-lamp':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Architect Desk Lamp */}
            <rect x="6" y="4" width="7" height="4" fill={p1} />
            <rect x="13" y="5" width="5" height="6" fill={p2} />
            <rect x="8" y="8" width="2" height="7" fill={p3} />
            <rect x="10" y="15" width="2" height="4" fill={p3} />
            <rect x="6" y="19" width="10" height="2" fill={p1} />
          </svg>
        );

      case 'pixel-cat':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Pixel Cat Silhouette */}
            <rect x="6" y="5" width="3" height="3" fill={p1} />
            <rect x="15" y="5" width="3" height="3" fill={p1} />
            <rect x="8" y="7" width="8" height="6" fill={p1} />
            <rect x="9" y="9" width="2" height="2" fill={p2} />
            <rect x="13" y="9" width="2" height="2" fill={p2} />
            <rect x="7" y="13" width="10" height="7" fill={p2} />
            <rect x="17" y="11" width="2" height="8" fill={p3} />
          </svg>
        );

      case 'pixel-dog':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            {/* Loyal Dog Silhouette */}
            <rect x="5" y="6" width="3" height="4" fill={p3} />
            <rect x="7" y="5" width="8" height="6" fill={p1} />
            <rect x="15" y="7" width="4" height="3" fill={p2} />
            <rect x="9" y="7" width="2" height="2" fill="#000000" />
            <rect x="7" y="11" width="11" height="8" fill={p1} />
            <rect x="4" y="10" width="3" height="3" fill={p3} />
            <rect x="8" y="19" width="2" height="3" fill={p2} />
            <rect x="15" y="19" width="2" height="3" fill={p2} />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
            <rect x="6" y="6" width="12" height="12" fill={p2} />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderIcon()}
    </div>
  );
};
