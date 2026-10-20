import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface CosmicGlobeProps {
  onNodeClick?: (universeName: string) => void;
}

interface NodeData {
  id: string;
  phi: number; // latitude from north pole (0 to PI)
  theta: number; // longitude (0 to 2*PI)
  name: string;
  universe: string;
  color: string;
}

export const CosmicGlobe: React.FC<CosmicGlobeProps> = ({ onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [pitchDegrees, setPitchDegrees] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  // Focus World Nodes pinned on the globe
  const keyNodes: NodeData[] = [
    {
      id: 'queens',
      phi: Math.PI * 0.34, // ~30 deg N
      theta: 4.8, // ~275 deg
      name: 'PETER PARKER',
      universe: 'QUEENS // EARTH-616',
      color: '#EF233C',
    },
    {
      id: 'gotham',
      phi: Math.PI * 0.42,
      theta: 5.2,
      name: 'BATMAN',
      universe: 'GOTHAM // BATCAVE',
      color: '#58A6FF',
    },
    {
      id: 'leaf',
      phi: Math.PI * 0.38,
      theta: 2.3, // Asia/Japan longitude
      name: 'NARUTO',
      universe: 'HIDDEN LEAF // VILLAGE',
      color: '#FACC15',
    },
    {
      id: 'matrix',
      phi: Math.PI * 0.58,
      theta: 0.8,
      name: 'NEO',
      universe: 'MATRIX CORE // ZION',
      color: '#00F5D4',
    },
    {
      id: 'ice',
      phi: Math.PI * 0.18, // Far North
      theta: 0.3,
      name: 'ELSA',
      universe: 'ICE PALACE // NORTH',
      color: '#38BDF8',
    },
    {
      id: 'lofi',
      phi: Math.PI * 0.65,
      theta: 3.4,
      name: 'STUDY GIRL',
      universe: 'LO-FI ATTIC // 3AM',
      color: '#F472B6',
    },
  ];

  // Ref to hold mutable drag state
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yaw: 0.5,
    pitch: 0.12,
    yawVel: 0,
    pitchVel: 0,
    lastMoveTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 380);
    const height = (canvas.height = 340);
    const cx = width / 2;
    const cy = height / 2;
    const radius = 105;

    // =========================================================================
    // 1. GENERATE CONTINENTAL PIXEL MASSES & WIREFRAME GRID
    // =========================================================================
    interface Point3D {
      phi: number;
      theta: number;
      isLand: boolean;
      color: string;
    }

    const points: Point3D[] = [];

    // Helper: Approximate continental bounding boxes (lat/lon in radians)
    // phi: 0 (North Pole) to PI (South Pole)
    // theta: 0 to 2*PI (0 is Prime Meridian / Europe, ~4.8 is Americas, ~2.2 is East Asia)
    const isContinent = (phi: number, theta: number): boolean => {
      // Normalize theta to 0..2*PI
      const t = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

      // North America (phi: 0.25..0.65, theta: 4.0..5.5)
      if (phi > 0.25 && phi < 0.62 && t > 3.9 && t < 5.3) return true;
      // South America (phi: 0.55..0.92, theta: 4.4..5.3)
      if (phi >= 0.55 && phi < 0.92 && t > 4.4 && t < 5.3) return true;
      // Europe & North Africa (phi: 0.28..0.68, theta: 6.0..6.28 || 0.0..0.85)
      if (phi > 0.28 && phi < 0.68 && (t > 5.9 || t < 0.85)) return true;
      // Africa (phi: 0.50..0.88, theta: 6.1..6.28 || 0.0..0.9)
      if (phi >= 0.50 && phi < 0.88 && (t > 6.0 || t < 0.9)) return true;
      // Asia (phi: 0.22..0.65, theta: 0.85..2.6)
      if (phi > 0.22 && phi < 0.65 && t > 0.85 && t < 2.6) return true;
      // Australia / Oceania (phi: 0.70..0.88, theta: 1.8..2.7)
      if (phi > 0.70 && phi < 0.88 && t > 1.8 && t < 2.7) return true;

      return false;
    };

    // Build dense sphere mesh with land/ocean differentiation
    const latBands = 28;
    const lonSteps = 42;

    for (let i = 1; i < latBands; i++) {
      const phi = (Math.PI / latBands) * i;
      for (let j = 0; j < lonSteps; j++) {
        const theta = ((Math.PI * 2) / lonSteps) * j;
        const land = isContinent(phi, theta);

        // Add land points with higher density and gold/cyan coloring
        if (land) {
          points.push({ phi, theta, isLand: true, color: '#F5C242' });
          // Sub-jitter point for dense pixelated landmass look
          points.push({
            phi: phi + (Math.random() * 0.03 - 0.015),
            theta: theta + (Math.random() * 0.05 - 0.025),
            isLand: true,
            color: Math.random() < 0.6 ? '#F5C242' : '#00F5D4',
          });
        } else if (i % 3 === 0 && j % 2 === 0) {
          // Ocean coordinate dots
          points.push({ phi, theta, isLand: false, color: '#2A2354' });
        }
      }
    }

    // Latitude rings for wireframe
    const rings = [0.25, 0.5, 0.75].map((f) => Math.PI * f);

    // =========================================================================
    // 2. RENDER LOOP WITH REAL 3D EULER ROTATION (YAW & PITCH)
    // =========================================================================
    let radarAngle = 0;

    const render = () => {
      const d = dragRef.current;

      // Inertia & Autonomous Rotation Physics
      if (!d.isDragging) {
        // Apply inertia dampening
        if (Math.abs(d.yawVel) > 0.0005) {
          d.yaw += d.yawVel;
          d.yawVel *= 0.93;
        } else {
          // Autonomous gentle rotation
          d.yaw += 0.007;
        }

        if (Math.abs(d.pitchVel) > 0.0005) {
          d.pitch = Math.max(-0.72, Math.min(0.72, d.pitch + d.pitchVel));
          d.pitchVel *= 0.93;
        } else {
          // Gently return pitch to comfortable 0.12 rad perspective
          d.pitch += (0.12 - d.pitch) * 0.02;
        }
      }

      radarAngle += 0.035;

      // Update telemetry display
      setRotationDegrees(Math.floor((((d.yaw * 180) / Math.PI) % 360 + 360) % 360));
      setPitchDegrees(Math.floor((d.pitch * 180) / Math.PI));

      ctx.clearRect(0, 0, width, height);

      // --- ATMOSPHERIC OUTER GLOW HALO ---
      const aura = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.25);
      aura.addColorStop(0, 'rgba(0, 245, 212, 0.12)');
      aura.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Outer Pixel Horizon Ring
      ctx.strokeStyle = '#3E356B';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - radius - 20, cy - radius - 20, (radius + 20) * 2, (radius + 20) * 2);

      // Globe Circular Boundary Frame
      ctx.strokeStyle = '#2A2354';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Projection helper: transforms spherical (phi, theta) -> screen (px, py, z)
      const project = (phi: number, theta: number) => {
        const th = theta + d.yaw;
        const x0 = radius * Math.sin(phi) * Math.cos(th);
        const y0 = radius * Math.cos(phi);
        const z0 = radius * Math.sin(phi) * Math.sin(th);

        // Rotate around X-axis by pitch
        const cosP = Math.cos(d.pitch);
        const sinP = Math.sin(d.pitch);

        const x1 = x0;
        const y1 = y0 * cosP - z0 * sinP;
        const z1 = y0 * sinP + z0 * cosP;

        return {
          x: Math.floor(cx + x1),
          y: Math.floor(cy + y1),
          z: z1,
        };
      };

      // --- WIREFRAME LATITUDE RINGS ---
      ctx.strokeStyle = '#181434';
      ctx.lineWidth = 1;
      rings.forEach((rPhi) => {
        ctx.beginPath();
        let first = true;
        for (let step = 0; step <= 36; step++) {
          const rTheta = (step / 36) * Math.PI * 2;
          const p = project(rPhi, rTheta);
          if (p.z > -10) {
            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
        }
        ctx.stroke();
      });

      // --- RADAR / SCANNING SWEEP PULSE ---
      const scanTheta = radarAngle;
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.45)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      for (let s = 0; s <= 20; s++) {
        const sPhi = (Math.PI / 20) * s;
        const p = project(sPhi, scanTheta);
        if (p.z > 0) {
          if (s === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // --- RENDER 3D CONTINENTAL & GRID POINTS ---
      points.forEach((pt) => {
        const p = project(pt.phi, pt.theta);
        if (p.z > -12) {
          const depthAlpha = Math.max(0.18, (p.z + radius) / (radius * 2));
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = depthAlpha * (pt.isLand ? 0.95 : 0.4);

          const size = pt.isLand ? (depthAlpha > 0.7 ? 2.5 : 2) : 1.5;
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }
      });
      ctx.globalAlpha = 1.0;

      // --- RENDER FOCUS WORLD KEY NODES ---
      keyNodes.forEach((node) => {
        const p = project(node.phi, node.theta);

        // Only draw when visible on front hemisphere
        if (p.z > 15) {
          const depth = (p.z + radius) / (radius * 2);
          const isHovered = hoveredNode?.id === node.id;

          // Outer glowing pulsating beacon diamond
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.9;
          const nodeSize = isHovered ? 7 : 5;
          ctx.fillRect(p.x - nodeSize / 2, p.y - nodeSize / 2, nodeSize, nodeSize);

          // White energetic core
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(p.x - 1, p.y - 1, 2, 2);

          // Pulsing wave ring around active node
          const ringRadius = 6 + (Math.sin(radarAngle * 2 + node.theta) * 2 + 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Tactical Leader Line to HUD Label
          const labelOffsetY = p.y < cy ? -18 : 18;
          const labelOffsetX = p.x < cx ? -45 : 45;

          ctx.strokeStyle = isHovered ? '#F5C242' : '#5CE1E6';
          ctx.setLineDash([2, 3]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (labelOffsetX > 0 ? 16 : -16), p.y + labelOffsetY * 0.7);
          ctx.lineTo(p.x + labelOffsetX, p.y + labelOffsetY * 0.7);
          ctx.stroke();
          ctx.setLineDash([]);

          // Terminal label badge
          ctx.font = '8px "Silkscreen", monospace';
          ctx.fillStyle = isHovered ? '#FFFFFF' : '#F5C242';
          ctx.textAlign = labelOffsetX > 0 ? 'left' : 'right';
          ctx.fillText(
            node.name,
            p.x + labelOffsetX + (labelOffsetX > 0 ? 4 : -4),
            p.y + labelOffsetY * 0.7 + 3
          );
        }
      });

      // --- CENTRAL RETRO TARGET CROSSHAIR ---
      ctx.strokeStyle = '#5CE1E6';
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [hoveredNode]);

  // =========================================================================
  // 3. INTERACTIVE POINTER / TOUCH DRAGGING EVENT HANDLERS
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dragRef.current.isDragging = true;
    dragRef.current.lastX = x;
    dragRef.current.lastY = y;
    dragRef.current.yawVel = 0;
    dragRef.current.pitchVel = 0;
    dragRef.current.lastMoveTime = Date.now();

    setIsInteracting(true);
    audioEngine.playClick();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If dragging, apply smooth yaw & pitch rotation
    if (dragRef.current.isDragging) {
      const dx = x - dragRef.current.lastX;
      const dy = y - dragRef.current.lastY;

      dragRef.current.yaw += dx * 0.009;
      dragRef.current.pitch = Math.max(
        -0.72,
        Math.min(0.72, dragRef.current.pitch + dy * 0.009)
      );

      // Track rotational velocity for release inertia
      dragRef.current.yawVel = dx * 0.009;
      dragRef.current.pitchVel = dy * 0.009;

      dragRef.current.lastX = x;
      dragRef.current.lastY = y;
      dragRef.current.lastMoveTime = Date.now();
    } else {
      // Hover hit-test on key nodes
      const cx = 190;
      const cy = 170;
      const radius = 105;

      const d = dragRef.current;
      const cosP = Math.cos(d.pitch);
      const sinP = Math.sin(d.pitch);

      let found: NodeData | null = null;
      for (const node of keyNodes) {
        const th = node.theta + d.yaw;
        const x0 = radius * Math.sin(node.phi) * Math.cos(th);
        const y0 = radius * Math.cos(node.phi);
        const z0 = radius * Math.sin(node.phi) * Math.sin(th);

        const x1 = x0;
        const y1 = y0 * cosP - z0 * sinP;
        const z1 = y0 * sinP + z0 * cosP;

        if (z1 > 15) {
          const px = cx + x1;
          const py = cy + y1;
          const dist = Math.hypot(x - px, y - py);
          if (dist < 18) {
            found = node;
            break;
          }
        }
      }

      if (found?.id !== hoveredNode?.id) {
        if (found) audioEngine.playClick();
        setHoveredNode(found);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current.isDragging = false;
    setIsInteracting(false);

    // If tapped a node while not dragging far
    if (hoveredNode && onNodeClick) {
      onNodeClick(hoveredNode.universe);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-2 select-none"
    >
      {/* LO / HI Cyan Dashed Measurement Boundary Guides */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between items-center text-[10px] font-mono text-arcade-cyan select-none pointer-events-none">
        <span className="bg-void px-1 border border-arcade-cyan">HI: 0xFF</span>
        <div className="w-[1px] flex-1 border-r border-dashed border-arcade-cyan my-1" />
        <span className="bg-void px-1 border border-arcade-cyan">LO: 0x00</span>
      </div>

      <div className="absolute -right-6 top-0 bottom-0 flex flex-col justify-between items-center text-[10px] font-mono text-arcade-cyan select-none pointer-events-none">
        <span className="bg-void px-1 border border-arcade-cyan">SYNC: 100%</span>
        <div className="w-[1px] flex-1 border-r border-dashed border-arcade-cyan my-1" />
        <span className="bg-void px-1 border border-arcade-cyan">
          ROT: {rotationDegrees}°
        </span>
      </div>

      {/* Target Crosshairs in 4 corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-arcade-gold pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-arcade-gold pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-arcade-gold pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-arcade-gold pointer-events-none" />

      {/* Interactive Canvas Globe */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`block pixel-border bg-[#121026]/75 backdrop-blur-md border border-white/15 shadow-2xl transition-all ${
          isInteracting
            ? 'cursor-grabbing border-arcade-gold shadow-[0_0_20px_rgba(245,194,66,0.35)]'
            : 'cursor-grab hover:border-arcade-cyan/60'
        }`}
        title="Click & Drag to rotate planetary globe • Tap Focus Nodes"
      />

      {/* Interactive Helper Overlay Hint */}
      <div className="absolute top-3 right-4 px-1.5 py-0.5 text-[8px] font-mono bg-[#0D0B1E]/90 border border-arcade-gold/50 text-arcade-gold pointer-events-none">
        {isInteracting ? 'MANUAL NAVIGATION ACTIVE' : 'DRAG TO ROTATE // CLICK NODE'}
      </div>

      {/* Tactical Telemetry Caption with Live Dynamic Degree Readout */}
      <div className="mt-2 flex items-center justify-between w-full max-w-[380px] px-2.5 py-1 text-[10px] font-mono text-gray-400 bg-[#121026]/75 backdrop-blur-md border border-white/15 shadow-sm">
        <span className="text-gray-300">
          PITCH: <strong className="text-arcade-cyan">{pitchDegrees}°</strong>
        </span>
        <span className="text-arcade-gold font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-arcade-gold animate-ping rounded-full inline-block" />
          20 WORLDS ONLINE
        </span>
        <span className="text-arcade-cyan">
          ROT: <strong className="text-white">{rotationDegrees}°</strong>
        </span>
      </div>
    </div>
  );
};

export default CosmicGlobe;
