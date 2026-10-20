import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  blinkSpeed: number;
  blinkPhase: number;
  depth: number;
  color: string;
  hasSpike?: boolean;
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
  headColor: string;
  tailColor: string;
}

interface Aircraft {
  x: number;
  y: number;
  speed: number;
  size: number;
  direction: 1 | -1; // 1 = right, -1 = left
  depth: number; // 0.2 to 0.8
  beaconPhase: number;
  type: 'shuttle' | 'cruiser' | 'speedster';
  trailColor: string;
}

interface WindowBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  isLit: boolean;
  toggleTimer: number;
}

interface BeaconLight {
  x: number;
  y: number;
  color: string;
  pulseSpeed: number;
  phase: number;
}

interface ConstellationStar {
  x: number;
  y: number;
}

interface Constellation {
  stars: ConstellationStar[];
  lines: [number, number][]; // index pairs
}

export const HomeAmbientBackground: React.FC<{ enableParallax?: boolean }> = ({
  enableParallax = true,
}) => {
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
      if (!enableParallax) return;
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

    // 1. STARFIELD (320+ multi-colored stars with varied depth)
    let stars: Star[] = [];
    const starColors = ['#FFFFFF', '#FDE047', '#67E8F9', '#C084FC', '#F472B6', '#E0E7FF'];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 4800); // Dense, rich starfield (~300-380 stars)
      for (let i = 0; i < count; i++) {
        const depth = Math.random() * 0.8 + 0.2;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const isBright = Math.random() < 0.08;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.82), // concentrated across upper sky
          radius: isBright ? Math.random() * 1.5 + 1.2 : Math.random() * 0.9 + 0.35,
          baseAlpha: isBright ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.25,
          blinkSpeed: Math.random() * 0.035 + 0.008,
          blinkPhase: Math.random() * Math.PI * 2,
          depth,
          color,
          hasSpike: isBright && Math.random() < 0.65,
        });
      }
    };

    // 2. RETRO PIXEL CONSTELLATIONS
    let constellations: Constellation[] = [];
    const initConstellations = () => {
      const scaleX = width / 1440;
      const scaleY = height / 900;
      const baseY = height * 0.28;

      const c1Stars = [
        { x: 180 * scaleX, y: baseY - 70 * scaleY },
        { x: 230 * scaleX, y: baseY - 40 * scaleY },
        { x: 280 * scaleX, y: baseY - 60 * scaleY },
        { x: 250 * scaleX, y: baseY - 100 * scaleY },
        { x: 320 * scaleX, y: baseY - 80 * scaleY },
      ];
      const c1Lines: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [2, 4],
      ];

      const c2Stars = [
        { x: width - 360 * scaleX, y: baseY - 90 * scaleY },
        { x: width - 310 * scaleX, y: baseY - 50 * scaleY },
        { x: width - 260 * scaleX, y: baseY - 70 * scaleY },
        { x: width - 220 * scaleX, y: baseY - 30 * scaleY },
        { x: width - 170 * scaleX, y: baseY - 60 * scaleY },
      ];
      const c2Lines: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ];

      const c3Stars = [
        { x: width * 0.48, y: baseY - 120 * scaleY },
        { x: width * 0.52, y: baseY - 95 * scaleY },
        { x: width * 0.56, y: baseY - 130 * scaleY },
      ];
      const c3Lines: [number, number][] = [
        [0, 1],
        [1, 2],
      ];

      constellations = [
        { stars: c1Stars, lines: c1Lines },
        { stars: c2Stars, lines: c2Lines },
        { stars: c3Stars, lines: c3Lines },
      ];
    };

    // 3. FLOATING COSMIC PARTICLES (Gold, Rose, Cyan, Amber)
    let orbs: Orb[] = [];
    const orbPalettes = [
      { color: '#F5C242', glow: 'rgba(245, 194, 66, 0.45)' }, // Gold
      { color: '#00F5D4', glow: 'rgba(0, 245, 212, 0.4)' }, // Cyan
      { color: '#FF758F', glow: 'rgba(255, 117, 143, 0.35)' }, // Rose
      { color: '#C084FC', glow: 'rgba(192, 132, 252, 0.35)' }, // Violet
      { color: '#F2CC8F', glow: 'rgba(242, 204, 143, 0.4)' }, // Amber-gold
    ];

    const initOrbs = () => {
      orbs = [];
      const count = 32;
      for (let i = 0; i < count; i++) {
        const pal = orbPalettes[i % orbPalettes.length];
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.0 + 1.8,
          color: pal.color,
          glowColor: pal.glow,
          baseAlpha: Math.random() * 0.4 + 0.25,
          vy: -(Math.random() * 0.35 + 0.12),
          sineSpeed: Math.random() * 0.02 + 0.007,
          sineAmp: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // 4. SHOOTING STARS / METEORS (every 4-7s)
    let shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + Math.random() * 2500 + 1500;

    const spawnShootingStar = () => {
      const angle = (Math.random() * 14 + 32) * (Math.PI / 180); // ~32-46 deg diagonal
      const startX = Math.random() * (width * 0.75);
      const startY = Math.random() * (height * 0.32);
      const isCyan = Math.random() < 0.45;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 110 + 80,
        speed: Math.random() * 7 + 11,
        angle,
        alpha: 1.0,
        decay: Math.random() * 0.018 + 0.012,
        thickness: Math.random() * 1.6 + 1.2,
        headColor: '#FFFFFF',
        tailColor: isCyan ? '#00F5D4' : '#F5C242',
      });
      nextShootingStarTime = Date.now() + Math.random() * 3500 + 4000;
    };

    // 5. DISTANT FUTURISTIC SCI-FI AIRCRAFT (3-4 small craft traversing sky)
    let aircraftList: Aircraft[] = [];
    const initAircraft = () => {
      aircraftList = [
        {
          x: width * 0.15,
          y: height * 0.18,
          speed: 0.42,
          size: 14,
          direction: 1,
          depth: 0.3,
          beaconPhase: 0,
          type: 'shuttle',
          trailColor: 'rgba(0, 245, 212, 0.45)',
        },
        {
          x: width * 0.85,
          y: height * 0.28,
          speed: -0.35,
          size: 11,
          direction: -1,
          depth: 0.5,
          beaconPhase: 2.1,
          type: 'speedster',
          trailColor: 'rgba(245, 194, 66, 0.4)',
        },
        {
          x: width * 0.45,
          y: height * 0.38,
          speed: 0.28,
          size: 18,
          direction: 1,
          depth: 0.2,
          beaconPhase: 4.2,
          type: 'cruiser',
          trailColor: 'rgba(192, 132, 252, 0.45)',
        },
      ];
    };

    // 6. DETAILED SKYLINE WINDOWS & ANTENNA BEACONS
    let windowBlocks: WindowBlock[] = [];
    let beaconLights: BeaconLight[] = [];

    const initSkylineDetails = () => {
      windowBlocks = [];
      beaconLights = [];
      const horizonY = height - 42;
      const windowColors = ['#F5C242', '#00F5D4', '#FFD166', '#E07A5F', '#FFFFFF', '#A855F7', '#38BDF8'];

      // Generate cluster windows on the buildings
      // Buildings are taller at the sides: left (0 - 380px) and right (width-420px - width)
      // and stepped in the center
      const buildingWidths = [
        // Left flank tall cluster
        { x: 10, w: 50, h: 260 },
        { x: 55, w: 42, h: 320 },
        { x: 95, w: 60, h: 380 },
        { x: 150, w: 45, h: 290 },
        { x: 190, w: 55, h: 240 },
        { x: 240, w: 48, h: 200 },
        { x: 285, w: 50, h: 170 },
        { x: 330, w: 55, h: 140 },
        // Mid low bridge
        { x: 380, w: 65, h: 95 },
        { x: 440, w: 75, h: 80 },
        { x: width * 0.5 - 90, w: 85, h: 75 },
        { x: width * 0.5 - 10, w: 80, h: 85 },
        { x: width * 0.5 + 65, w: 75, h: 90 },
        { x: width - 490, w: 60, h: 110 },
        { x: width - 435, w: 55, h: 145 },
        // Right flank tall cluster
        { x: width - 385, w: 52, h: 180 },
        { x: width - 335, w: 58, h: 220 },
        { x: width - 280, w: 50, h: 270 },
        { x: width - 235, w: 65, h: 350 },
        { x: width - 175, w: 52, h: 390 },
        { x: width - 125, w: 60, h: 310 },
        { x: width - 70, w: 65, h: 250 },
      ];

      buildingWidths.forEach((b) => {
        const topY = horizonY - b.h;
        // Add antenna on select tall buildings
        if (b.h > 210) {
          beaconLights.push({
            x: b.x + b.w / 2,
            y: topY - 14,
            color: b.h > 300 ? '#EF233C' : '#00F5D4',
            pulseSpeed: 0.05 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2,
          });
        }

        // Fill building with pixel windows
        const rows = Math.floor((b.h - 25) / 10);
        const cols = Math.floor((b.w - 12) / 9);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (Math.random() < 0.62) {
              windowBlocks.push({
                x: b.x + 7 + c * 9,
                y: topY + 16 + r * 10,
                w: 3.5,
                h: 4,
                color: windowColors[Math.floor(Math.random() * windowColors.length)],
                isLit: Math.random() < 0.85,
                toggleTimer: Math.random() * 400 + 100,
              });
            }
          }
        }
      });
    };

    const initElements = () => {
      initStars();
      initConstellations();
      initOrbs();
      initAircraft();
      initSkylineDetails();
    };

    initElements();

    // MAIN ANIMATION LOOP
    let time = 0;
    const render = () => {
      time += 0.02;

      // Smooth mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // LAYER 1: DEEP COSMIC SKY & MULTI-CHROMATIC NEBULA CLOUDS
      // =========================================================================
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#060410');
      skyGrad.addColorStop(0.35, '#0E0922');
      skyGrad.addColorStop(0.65, '#1A0E33');
      skyGrad.addColorStop(0.88, '#100A22');
      skyGrad.addColorStop(1, '#070512');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      const nebulaPulse = Math.sin(time * 0.45) * 0.15 + 0.85;

      // 1A. Violet & Cosmic Magenta Nebula (Upper-Left to Center)
      const magentaNebula = ctx.createRadialGradient(
        width * 0.32 + Math.cos(time * 0.25) * 45,
        height * 0.42 + Math.sin(time * 0.35) * 35,
        15,
        width * 0.32,
        height * 0.42,
        width * 0.52
      );
      magentaNebula.addColorStop(0, `rgba(131, 24, 67, ${0.38 * nebulaPulse})`);
      magentaNebula.addColorStop(0.4, `rgba(88, 28, 135, ${0.28 * nebulaPulse})`);
      magentaNebula.addColorStop(0.75, `rgba(30, 18, 55, ${0.12 * nebulaPulse})`);
      magentaNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = magentaNebula;
      ctx.fillRect(0, 0, width, height);

      // 1B. Electric Cyan / Celestial Blue Nebula (Upper-Right)
      const cyanNebula = ctx.createRadialGradient(
        width * 0.76 + Math.sin(time * 0.28) * 55,
        height * 0.32 + Math.cos(time * 0.32) * 35,
        15,
        width * 0.76,
        height * 0.32,
        width * 0.48
      );
      cyanNebula.addColorStop(0, `rgba(14, 116, 144, ${0.35 * nebulaPulse})`);
      cyanNebula.addColorStop(0.45, `rgba(30, 58, 138, ${0.22 * nebulaPulse})`);
      cyanNebula.addColorStop(0.8, `rgba(15, 23, 42, ${0.1 * nebulaPulse})`);
      cyanNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cyanNebula;
      ctx.fillRect(0, 0, width, height);

      // 1C. Warm Amber Stardust Wash (Mid Horizon)
      const amberNebula = ctx.createRadialGradient(
        width * 0.5,
        height * 0.78,
        25,
        width * 0.5,
        height * 0.78,
        width * 0.65
      );
      amberNebula.addColorStop(0, `rgba(180, 83, 9, ${0.24 * nebulaPulse})`);
      amberNebula.addColorStop(0.55, `rgba(69, 26, 3, ${0.12 * nebulaPulse})`);
      amberNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = amberNebula;
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // LAYER 2: RETRO CONSTELLATIONS & ORBITAL GUIDES
      // =========================================================================
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;

      constellations.forEach((c) => {
        c.lines.forEach(([i1, i2]) => {
          const s1 = c.stars[i1];
          const s2 = c.stars[i2];
          if (!s1 || !s2) return;
          const px1 = s1.x - mouseX * 0.04 * 20;
          const py1 = s1.y - mouseY * 0.04 * 20;
          const px2 = s2.x - mouseX * 0.04 * 20;
          const py2 = s2.y - mouseY * 0.04 * 20;

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        });

        // Small cross-dots on constellation vertices
        c.stars.forEach((s) => {
          const px = s.x - mouseX * 0.04 * 20;
          const py = s.y - mouseY * 0.04 * 20;
          ctx.fillStyle = '#A5B4FC';
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        });
      });
      ctx.setLineDash([]);

      // =========================================================================
      // LAYER 3: MULTI-DEPTH TWINKLING STARFIELD
      // =========================================================================
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const px = s.x - mouseX * s.depth * 24;
        const py = s.y - mouseY * s.depth * 24;

        const alphaPulse = Math.sin(time * s.blinkSpeed * 60 + s.blinkPhase);
        const currentAlpha = Math.max(0.12, Math.min(1.0, s.baseAlpha + alphaPulse * 0.38));

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point cross diffraction spike on bright foreground stars
        if (s.hasSpike && currentAlpha > 0.6) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          const spikeLen = s.radius * 2.8;
          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      // =========================================================================
      // LAYER 4: SHOOTING STARS / METEORS
      // =========================================================================
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
        starGrad.addColorStop(0.6, ss.tailColor);
        starGrad.addColorStop(1, ss.headColor);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = ss.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        ctx.fillStyle = ss.headColor;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.thickness * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // LAYER 5: DISTANT FUTURISTIC SCI-FI AIRCRAFT
      // =========================================================================
      aircraftList.forEach((craft) => {
        craft.x += craft.speed;
        craft.beaconPhase += 0.08;

        // Wrap around viewport edges
        if (craft.direction === 1 && craft.x > width + 60) {
          craft.x = -60;
          craft.y = height * (0.15 + Math.random() * 0.35);
        } else if (craft.direction === -1 && craft.x < -60) {
          craft.x = width + 60;
          craft.y = height * (0.15 + Math.random() * 0.35);
        }

        const craftX = craft.x - mouseX * craft.depth * 18;
        const craftY = craft.y - mouseY * craft.depth * 18;
        const s = craft.size;
        const dir = craft.direction;

        // Faint glowing ion thruster / engine trail
        const trailLen = s * 3.5;
        const trailGrad = ctx.createLinearGradient(
          craftX - dir * trailLen,
          craftY,
          craftX,
          craftY
        );
        trailGrad.addColorStop(0, 'rgba(0, 245, 212, 0)');
        trailGrad.addColorStop(1, craft.trailColor);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(craftX - dir * trailLen, craftY);
        ctx.lineTo(craftX, craftY);
        ctx.stroke();

        // Pixel-art shuttle body silhouette
        ctx.fillStyle = '#080512';
        ctx.beginPath();
        if (dir === 1) {
          ctx.moveTo(craftX + s, craftY); // nose tip
          ctx.lineTo(craftX - s * 0.5, craftY - s * 0.35); // top wing
          ctx.lineTo(craftX - s * 0.8, craftY); // engine rear
          ctx.lineTo(craftX - s * 0.5, craftY + s * 0.35); // bottom wing
        } else {
          ctx.moveTo(craftX - s, craftY); // nose tip left
          ctx.lineTo(craftX + s * 0.5, craftY - s * 0.35);
          ctx.lineTo(craftX + s * 0.8, craftY);
          ctx.lineTo(craftX + s * 0.5, craftY + s * 0.35);
        }
        ctx.closePath();
        ctx.fill();

        // Hull neon trim
        ctx.strokeStyle = '#382458';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Blinking Navigation Wingtip Beacon Light
        const beaconLit = Math.sin(craft.beaconPhase) > 0.2;
        if (beaconLit) {
          ctx.fillStyle = craft.type === 'speedster' ? '#F5C242' : '#EF233C';
          ctx.fillRect(craftX, craftY - s * 0.35 - 1, 2, 2);
          ctx.fillRect(craftX, craftY + s * 0.35, 2, 2);
        }
      });

      // =========================================================================
      // LAYER 6: DISTANT ANGULAR MOUNTAIN SILHOUETTES (BOTTOM LEFT & RIGHT)
      // =========================================================================
      const horizonY = height - 42;

      // 6A. FAR MOUNTAIN RANGES (Muted Indigo/Violet #140E2A)
      ctx.fillStyle = '#140E2A';
      ctx.beginPath();
      ctx.moveTo(0, height);
      // Left far mountains
      ctx.lineTo(0, horizonY - 170);
      ctx.lineTo(width * 0.08, horizonY - 210);
      ctx.lineTo(width * 0.16, horizonY - 160);
      ctx.lineTo(width * 0.25, horizonY - 190);
      ctx.lineTo(width * 0.35, horizonY - 110);
      ctx.lineTo(width * 0.44, horizonY - 45);
      // Center low saddle
      ctx.lineTo(width * 0.56, horizonY - 45);
      // Right far mountains
      ctx.lineTo(width * 0.65, horizonY - 120);
      ctx.lineTo(width * 0.74, horizonY - 180);
      ctx.lineTo(width * 0.84, horizonY - 150);
      ctx.lineTo(width * 0.92, horizonY - 225);
      ctx.lineTo(width, horizonY - 180);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Atmospheric Rim Light Glow on Far Mountain Ridges
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 6B. NEAR MOUNTAIN RANGES (Dark Charcoal Silhouette #0A0718)
      ctx.fillStyle = '#0A0718';
      ctx.beginPath();
      ctx.moveTo(0, height);
      // Left near mountain peaks
      ctx.lineTo(0, horizonY - 120);
      ctx.lineTo(width * 0.06, horizonY - 150);
      ctx.lineTo(width * 0.13, horizonY - 110);
      ctx.lineTo(width * 0.21, horizonY - 135);
      ctx.lineTo(width * 0.30, horizonY - 70);
      ctx.lineTo(width * 0.40, horizonY - 20);
      // Center low valley
      ctx.lineTo(width * 0.60, horizonY - 20);
      // Right near mountain peaks
      ctx.lineTo(width * 0.70, horizonY - 80);
      ctx.lineTo(width * 0.79, horizonY - 145);
      ctx.lineTo(width * 0.88, horizonY - 115);
      ctx.lineTo(width * 0.95, horizonY - 165);
      ctx.lineTo(width, horizonY - 130);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // =========================================================================
      // LAYER 7: TALLER MULTI-TIERED FUTURISTIC PIXEL SKYLINE
      // =========================================================================

      // 7A. DENSE MIDGROUND SKYSCRAPERS (Stepped silhouetted towers)
      // Left and right flanks rise 220px-390px, center remains modest ~80px
      const midBuildings = [
        // Left Flank
        { x: 0, w: 45, h: 250 },
        { x: 40, w: 50, h: 320 },
        { x: 85, w: 58, h: 375 },
        { x: 140, w: 42, h: 280 },
        { x: 180, w: 54, h: 235 },
        { x: 230, w: 46, h: 195 },
        { x: 272, w: 48, h: 165 },
        { x: 315, w: 52, h: 135 },
        { x: 362, w: 56, h: 95 },
        // Center Low Bridge (Under hero text & cards)
        { x: 415, w: 68, h: 80 },
        { x: width * 0.48 - 85, w: 75, h: 70 },
        { x: width * 0.48 - 15, w: 70, h: 80 },
        { x: width * 0.48 + 50, w: 75, h: 85 },
        { x: width - 480, w: 58, h: 105 },
        { x: width - 425, w: 54, h: 140 },
        // Right Flank
        { x: width - 375, w: 50, h: 180 },
        { x: width - 328, w: 56, h: 215 },
        { x: width - 275, w: 48, h: 265 },
        { x: width - 230, w: 62, h: 345 },
        { x: width - 172, w: 54, h: 390 },
        { x: width - 120, w: 58, h: 300 },
        { x: width - 65, w: 70, h: 240 },
      ];

      // Draw building block silhouettes
      ctx.fillStyle = '#060410';
      midBuildings.forEach((b) => {
        const bx = b.x - mouseX * 0.08 * 14;
        const by = horizonY - b.h;
        ctx.fillRect(bx, by, b.w, b.h + 50);

        // Tower stepped rooftop crowns & spires
        if (b.h > 200) {
          ctx.fillRect(bx + b.w * 0.2, by - 8, b.w * 0.6, 8);
          // Thin antenna mast
          ctx.fillRect(bx + b.w * 0.48, by - 24, 2, 16);
        }

        // Crisp neon architectural top rim
        ctx.fillStyle = '#2A1F45';
        ctx.fillRect(bx, by, b.w, 2);
        ctx.fillStyle = '#060410';
      });

      // 7B. FLICKERING NEON WINDOWS (Yellow, Cyan, Amber, Violet, Rose)
      windowBlocks.forEach((wb) => {
        wb.toggleTimer -= 1;
        if (wb.toggleTimer <= 0) {
          wb.isLit = !wb.isLit;
          wb.toggleTimer = Math.random() * 500 + 150;
        }

        if (wb.isLit) {
          const wx = wb.x - mouseX * 0.08 * 14;
          ctx.fillStyle = wb.color;
          ctx.globalAlpha = 0.85;
          ctx.fillRect(wx, wb.y, wb.w, wb.h);
          ctx.globalAlpha = 1.0;
        }
      });

      // 7C. HOLOGRAPHIC NEON BILLBOARDS ON SELECT SKYSCRAPERS
      const drawBillboard = (bx: number, by: number, text: string, color: string) => {
        const px = bx - mouseX * 0.08 * 14;
        ctx.fillStyle = 'rgba(10, 8, 22, 0.9)';
        ctx.fillRect(px, by, 36, 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(px, by, 36, 12);

        ctx.font = '7px "Silkscreen", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, px + 18, by + 9);
      };

      drawBillboard(100, horizonY - 330, '20W', '#F5C242');
      drawBillboard(width - 215, horizonY - 310, 'FLOW', '#00F5D4');
      drawBillboard(width - 105, horizonY - 260, 'SYNC', '#EC4899');

      // 7D. ROOFTOP AVIATION BEACON LIGHTS (Pulsing Red & Cyan)
      beaconLights.forEach((beacon) => {
        const pulse = Math.sin(time * beacon.pulseSpeed * 40 + beacon.phase);
        if (pulse > 0.2) {
          const bx = beacon.x - mouseX * 0.08 * 14;
          ctx.fillStyle = beacon.color;
          ctx.fillRect(bx - 1.5, beacon.y - 1.5, 3, 3);

          // Subtle flare
          ctx.strokeStyle = beacon.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(bx - 4, beacon.y);
          ctx.lineTo(bx + 4, beacon.y);
          ctx.stroke();
        }
      });

      // =========================================================================
      // LAYER 8: FLOATING WARM BOKEH / FIREFLY PARTICLES
      // =========================================================================
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.y += o.vy;
        o.phase += o.sineSpeed;
        const currentX = o.x + Math.sin(o.phase) * o.sineAmp * 16 - mouseX * 12;

        if (o.y < -20) {
          o.y = height + 20;
          o.x = Math.random() * width;
        }

        const pulse = Math.sin(o.phase * 1.6) * 0.25 + 0.75;
        const alpha = o.baseAlpha * pulse;

        // Radial glow halo
        const glow = ctx.createRadialGradient(
          currentX,
          o.y,
          0,
          currentX,
          o.y,
          o.radius * 3.6
        );
        glow.addColorStop(0, o.glowColor);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(currentX, o.y, o.radius * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // Solid core
        ctx.fillStyle = o.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(currentX, o.y, o.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // =========================================================================
      // LAYER 9: HORIZON HAZE & FOOTER MASK
      // =========================================================================
      const groundGrad = ctx.createLinearGradient(0, height - 60, 0, height);
      groundGrad.addColorStop(0, 'rgba(7, 5, 16, 0)');
      groundGrad.addColorStop(0.7, 'rgba(7, 5, 16, 0.85)');
      groundGrad.addColorStop(1, '#070512');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, height - 60, width, 60);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableParallax]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default HomeAmbientBackground;
