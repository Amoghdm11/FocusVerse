import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  blinkSpeed: number;
  blinkPhase: number;
  depth: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  baseAlpha: number;
  vy: number;
  sineSpeed: number;
  sineAmp: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  decay: number;
  thickness: number;
}

interface SkylineWindow {
  x: number;
  y: number;
  color: string;
  flickerSpeed: number;
  flickerPhase: number;
}

export const HomeAmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('resize', handleResize);

    // 1. Generate Starfield (130+ multi-sized stars)
    let stars: Star[] = [];
    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 9000); // Responsive density ~130-180
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.85), // Keep mostly in upper sky
          radius: Math.random() < 0.8 ? Math.random() * 0.9 + 0.4 : Math.random() * 1.5 + 1.0,
          baseAlpha: Math.random() * 0.6 + 0.25,
          blinkSpeed: Math.random() * 0.03 + 0.008,
          blinkPhase: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.8 + 0.2, // For parallax
        });
      }
    };

    // 2. Generate Floating Warm Lantern / Firefly Orbs (25 soft glowing orbs)
    let orbs: Orb[] = [];
    const orbColors = [
      { color: '#F5C242', glow: 'rgba(245, 194, 66, 0.4)' }, // Warm gold
      { color: '#E07A5F', glow: 'rgba(224, 122, 95, 0.4)' }, // Sunset amber
      { color: '#00F5D4', glow: 'rgba(0, 245, 212, 0.35)' }, // Soft cyan
      { color: '#F2CC8F', glow: 'rgba(242, 204, 143, 0.35)' }, // Fairy white/gold
      { color: '#FF758F', glow: 'rgba(255, 117, 143, 0.3)' }, // Rose glow
    ];

    const initOrbs = () => {
      orbs = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        const palette = orbColors[i % orbColors.length];
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 2.0,
          color: palette.color,
          glowColor: palette.glow,
          baseAlpha: Math.random() * 0.4 + 0.3,
          vy: -(Math.random() * 0.35 + 0.15), // Slow upward drift
          sineSpeed: Math.random() * 0.02 + 0.008,
          sineAmp: Math.random() * 1.2 + 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // 3. Shooting Stars / Comets (triggered every 5-8s)
    let shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + Math.random() * 3000 + 2000;

    const spawnShootingStar = () => {
      const angle = (Math.random() * 15 + 30) * (Math.PI / 180); // 30-45 degrees diagonal
      shootingStars.push({
        x: Math.random() * (width * 0.7),
        y: Math.random() * (height * 0.35),
        length: Math.random() * 90 + 70,
        speed: Math.random() * 8 + 12,
        angle,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        thickness: Math.random() * 1.5 + 1.2,
      });
      nextShootingStarTime = Date.now() + Math.random() * 3500 + 4500; // 5-8s interval
    };

    // 4. Skyline Windows along bottom horizon
    let windows: SkylineWindow[] = [];
    const initWindows = () => {
      windows = [];
      const horizonY = height - 55;
      const windowCols = [
        '#F5C242',
        '#00F5D4',
        '#FFD166',
        '#E07A5F',
        '#FFFFFF',
        '#81B29A',
      ];
      // Distribute subtle window groups across width
      for (let x = 30; x < width - 30; x += Math.random() * 45 + 25) {
        if (Math.random() > 0.3) {
          const rows = Math.floor(Math.random() * 3) + 1;
          for (let r = 0; r < rows; r++) {
            windows.push({
              x: x + (Math.random() * 6 - 3),
              y: horizonY - r * 6 - 8,
              color: windowCols[Math.floor(Math.random() * windowCols.length)],
              flickerSpeed: Math.random() * 0.04 + 0.01,
              flickerPhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const initElements = () => {
      initStars();
      initOrbs();
      initWindows();
    };

    initElements();

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.02;

      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: TWILIGHT & AURORA GRADIENTS ---
      // Deep twilight base
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#090A18');
      skyGrad.addColorStop(0.45, '#120F2A');
      skyGrad.addColorStop(0.75, '#20132B');
      skyGrad.addColorStop(1, '#0C0A1A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Slow-breathing Aurora / Nebula Wash (Warm rose + amber + teal)
      const auroraBreath = Math.sin(time * 0.5) * 0.15 + 0.85;

      // Center-left warm sunset rose wash
      const roseNebula = ctx.createRadialGradient(
        width * 0.35 + Math.cos(time * 0.3) * 40,
        height * 0.65 + Math.sin(time * 0.4) * 30,
        10,
        width * 0.35,
        height * 0.65,
        width * 0.55
      );
      roseNebula.addColorStop(0, `rgba(74, 30, 58, ${0.45 * auroraBreath})`);
      roseNebula.addColorStop(0.5, `rgba(50, 20, 42, ${0.25 * auroraBreath})`);
      roseNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = roseNebula;
      ctx.fillRect(0, 0, width, height);

      // Right-side bioluminescent teal / deep blue wash
      const tealNebula = ctx.createRadialGradient(
        width * 0.75 + Math.sin(time * 0.3) * 50,
        height * 0.5 + Math.cos(time * 0.4) * 30,
        10,
        width * 0.75,
        height * 0.5,
        width * 0.5
      );
      tealNebula.addColorStop(0, `rgba(16, 42, 62, ${0.4 * auroraBreath})`);
      tealNebula.addColorStop(0.5, `rgba(12, 28, 48, ${0.2 * auroraBreath})`);
      tealNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = tealNebula;
      ctx.fillRect(0, 0, width, height);

      // Lower horizon soft amber glow
      const amberGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.95,
        20,
        width * 0.5,
        height * 0.95,
        width * 0.6
      );
      amberGlow.addColorStop(0, `rgba(90, 45, 30, ${0.35 * auroraBreath})`);
      amberGlow.addColorStop(0.6, 'rgba(30, 15, 25, 0.15)');
      amberGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = amberGlow;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 2: TWINKLING STARS WITH PARALLAX ---
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Apply parallax offset
        const px = s.x - mouseX * s.depth * 18;
        const py = s.y - mouseY * s.depth * 18;

        const alphaPulse = Math.sin(time * s.blinkSpeed * 60 + s.blinkPhase);
        const currentAlpha = Math.max(0.1, s.baseAlpha + alphaPulse * 0.35);

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle sparkle for larger stars
        if (s.radius > 1.2 && currentAlpha > 0.65) {
          ctx.strokeStyle = `rgba(245, 194, 66, ${currentAlpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(px - s.radius * 2.2, py);
          ctx.lineTo(px + s.radius * 2.2, py);
          ctx.moveTo(px, py - s.radius * 2.2);
          ctx.lineTo(px, py + s.radius * 2.2);
          ctx.stroke();
        }
      }

      // --- LAYER 3: SHOOTING STARS ---
      if (Date.now() > nextShootingStarTime) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= ss.decay;

        if (ss.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        starGrad.addColorStop(0.7, `rgba(245, 194, 66, ${ss.alpha * 0.5})`);
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = ss.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Bright star head spark
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.thickness * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- LAYER 4: FLOATING WARM BOKEH / LANTERN ORBS ---
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.y += o.vy;
        o.phase += o.sineSpeed;
        const currentX = o.x + Math.sin(o.phase) * o.sineAmp * 15 - mouseX * 8;

        // Wrap around when moving off-screen
        if (o.y < -20) {
          o.y = height + 20;
          o.x = Math.random() * width;
        }

        const pulse = Math.sin(o.phase * 1.5) * 0.2 + 0.8;
        const alpha = o.baseAlpha * pulse;

        // Soft outer glow halo
        const glow = ctx.createRadialGradient(
          currentX,
          o.y,
          0,
          currentX,
          o.y,
          o.radius * 3.5
        );
        glow.addColorStop(0, o.glowColor);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(currentX, o.y, o.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = o.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(currentX, o.y, o.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // --- LAYER 5: ATMOSPHERIC HORIZON SILHOUETTE & FLICKERING WINDOWS ---
      const horizonY = height - 50;

      // Distant rolling mountain silhouette (dark indigo)
      ctx.fillStyle = '#080714';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, horizonY - 15);

      // Mountain curves
      for (let x = 0; x <= width; x += 100) {
        const my =
          horizonY -
          18 +
          Math.sin(x * 0.005 + 1) * 12 +
          Math.cos(x * 0.012) * 8;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Midground stylized pixel skyline silhouette
      ctx.fillStyle = '#0A0818';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, horizonY);

      // Low urban rooftops / blocks
      for (let x = 0; x <= width; x += 36) {
        const blockH = ((x * 13) % 22) + 12;
        ctx.lineTo(x, horizonY - blockH);
        ctx.lineTo(x + 28, horizonY - blockH);
        ctx.lineTo(x + 28, horizonY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Flickering Skyline Windows
      for (let i = 0; i < windows.length; i++) {
        const w = windows[i];
        const flicker = Math.sin(time * w.flickerSpeed * 40 + w.flickerPhase);
        if (flicker > -0.6) {
          const winAlpha = Math.max(0.2, (flicker + 1) * 0.45);
          ctx.fillStyle = w.color;
          ctx.globalAlpha = winAlpha;
          ctx.fillRect(w.x - mouseX * 4, w.y, 2.5, 2.5);
          ctx.globalAlpha = 1.0;
        }
      }

      // Foreground edge boundary gradient into footer
      const groundGrad = ctx.createLinearGradient(0, height - 40, 0, height);
      groundGrad.addColorStop(0, 'rgba(8, 6, 16, 0)');
      groundGrad.addColorStop(1, 'rgba(8, 6, 16, 0.95)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, height - 40, width, 40);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 60fps Ambient Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default HomeAmbientBackground;
