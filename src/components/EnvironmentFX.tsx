import React, { useEffect, useRef } from 'react';
import { EnvironmentFXType, CharacterPalette } from '../types/character';

interface EnvironmentFXProps {
  type: EnvironmentFXType;
  palette: CharacterPalette;
  dimmerOpacity?: number; // 0.2 to 0.95
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life?: number;
  maxLife?: number;
  char?: string;
}

export const EnvironmentFX: React.FC<EnvironmentFXProps> = ({
  type,
  palette,
  dimmerOpacity = 0.65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Background Stars (Cosmic Pixel Starfield)
    const stars: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * (height - 60)),
      vx: 0,
      vy: 0,
      size: Math.random() > 0.8 ? 2 : 1,
      color: Math.random() > 0.6 ? palette.accentGold : '#F0E8FF',
      alpha: 0.2 + Math.random() * 0.8,
    }));

    // Primary Interactive Particles according to type
    const particles: Particle[] = [];
    const count = type === 'matrix-rain' ? 45 : type === 'pixel-rain' || type === 'cyber-downpour' ? 70 : 40;

    for (let i = 0; i < count; i++) {
      particles.push(initParticle(type, width, height, palette, true));
    }

    function initParticle(
      fxType: EnvironmentFXType,
      w: number,
      h: number,
      pal: CharacterPalette,
      randomY: boolean = false
    ): Particle {
      const rx = Math.random() * w;
      const ry = randomY ? Math.random() * h : -10;

      switch (fxType) {
        case 'pixel-rain':
        case 'lofi-rain':
        case 'cyber-downpour':
          return {
            x: rx,
            y: ry,
            vx: -0.5 + Math.random() * 0.3,
            vy: fxType === 'cyber-downpour' ? 8 + Math.random() * 6 : 5 + Math.random() * 4,
            size: 2,
            color: fxType === 'cyber-downpour' ? pal.accentSecondary : pal.borderPrimary,
            alpha: 0.4 + Math.random() * 0.5,
          };

        case 'matrix-rain': {
          const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
          return {
            x: Math.floor(Math.random() * (w / 18)) * 18,
            y: ry,
            vx: 0,
            vy: 3 + Math.random() * 4,
            size: 14,
            color: Math.random() > 0.85 ? '#FFFFFF' : pal.borderPrimary,
            alpha: 0.7 + Math.random() * 0.3,
            char: chars[Math.floor(Math.random() * chars.length)],
          };
        }

        case 'snow-crystals':
          return {
            x: rx,
            y: ry,
            vx: -0.5 + Math.random(),
            vy: 1 + Math.random() * 1.5,
            size: Math.random() > 0.7 ? 3 : 2,
            color: pal.accentSecondary,
            alpha: 0.5 + Math.random() * 0.4,
          };

        case 'pixel-lanterns':
          return {
            x: rx,
            y: randomY ? ry : h + 15,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.6 + Math.random() * 0.8),
            size: 6 + Math.floor(Math.random() * 4) * 2,
            color: pal.accentGold,
            alpha: 0.6 + Math.random() * 0.4,
          };

        case 'hearth-embers':
        case 'candle-sparks':
          return {
            x: rx,
            y: randomY ? ry : h + 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(1.5 + Math.random() * 2),
            size: 2,
            color: Math.random() > 0.5 ? pal.accentGold : pal.borderPrimary,
            alpha: 0.8,
            life: 0,
            maxLife: 60 + Math.random() * 80,
          };

        case 'sakura-8bit':
          return {
            x: rx,
            y: ry,
            vx: 1 + Math.random() * 1.2,
            vy: 1 + Math.random() * 1.5,
            size: 3,
            color: Math.random() > 0.5 ? '#FFB703' : '#FB8500',
            alpha: 0.7,
          };

        case 'sunbeam-pollen':
        case 'dust-shafts':
          return {
            x: rx,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: 2,
            color: pal.accentGold,
            alpha: 0.3 + Math.random() * 0.4,
          };

        default:
          return {
            x: rx,
            y: ry,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: 2,
            color: pal.accentSecondary,
            alpha: 0.5,
          };
      }
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Base Void gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, palette.bgVoid);
      bgGrad.addColorStop(1, '#06030F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Pixel Starfield
      stars.forEach((star) => {
        if (Math.random() > 0.96) {
          star.alpha = 0.2 + Math.random() * 0.8;
        }
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // Special Background Geometry per FX
      if (type === 'bat-sonar') {
        ctx.strokeStyle = palette.accentSecondary;
        ctx.lineWidth = 1;
        const cx = width / 2;
        const cy = height / 2;
        const pulse = (frame % 120) * 4;
        ctx.globalAlpha = Math.max(0, 1 - pulse / 400) * 0.35;
        ctx.beginPath();
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.moveTo(cx - 300, cy); ctx.lineTo(cx + 300, cy);
        ctx.moveTo(cx, cy - 300); ctx.lineTo(cx, cy + 300);
        ctx.stroke();
      } else if (type === 'infinity-grid') {
        ctx.strokeStyle = palette.borderPrimary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        const horizon = height * 0.65;
        // Radial grid lines
        for (let x = -width; x < width * 2; x += 60) {
          ctx.beginPath();
          ctx.moveTo(width / 2, horizon);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        // Horizontal grid lines
        for (let y = horizon; y < height; y += (y - horizon) * 0.35 + 8) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (type === 'hud-nodes') {
        ctx.strokeStyle = palette.accentSecondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.12;
        // Tactical corner brackets
        ctx.strokeRect(30, 30, 120, 120);
        ctx.strokeRect(width - 150, 30, 120, 120);
      }

      // Render Dynamic Particles
      ctx.font = '12px "JetBrains Mono", monospace';

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.life !== undefined && p.maxLife !== undefined) {
          p.life++;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (type === 'matrix-rain' && p.char) {
          ctx.fillText(p.char, p.x, p.y);
          if (Math.random() > 0.92) {
            const chars = '0123456789ABCDEFｦｱｳｴ';
            p.char = chars[Math.floor(Math.random() * chars.length)];
          }
        } else if (type === 'pixel-lanterns') {
          // Pixel lantern box
          ctx.fillRect(p.x, p.y, p.size, p.size * 1.3);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(p.x + 2, p.y + 2, p.size - 4, p.size * 1.3 - 4);
        } else if (type === 'pixel-rain' || type === 'cyber-downpour' || type === 'lofi-rain') {
          // Pixel streak
          ctx.fillRect(p.x, p.y, p.size, p.size * 3.5);
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        // Wrap around boundaries
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20 || (p.life && p.life >= (p.maxLife || 100))) {
          particles[idx] = initParticle(type, width, height, palette, false);
        }
      });

      // Bottom Dark Pixelated Horizon Bar
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#06030F';
      ctx.fillRect(0, height - 32, width, 32);

      // Pixelated Horizon Border line
      ctx.fillStyle = palette.borderPrimary;
      for (let x = 0; x < width; x += 12) {
        ctx.fillRect(x, height - 32, 6, 2);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, palette]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* HTML5 Canvas Particle / Atmosphere Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Adjustable Background Dimmer Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: '#0B0914',
          opacity: dimmerOpacity,
        }}
      />
    </div>
  );
};
