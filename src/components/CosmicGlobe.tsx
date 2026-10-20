import React, { useEffect, useRef, useState } from 'react';

interface CosmicGlobeProps {
  onNodeClick?: (universeName: string) => void;
}

export const CosmicGlobe: React.FC<CosmicGlobeProps> = ({ onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
    const radius = 100;

    // Create 3D spherical point cloud for pixel sphere
    const points: { phi: number; theta: number; label?: string }[] = [];
    const latLines = 14;
    const lonPoints = 20;

    for (let i = 0; i < latLines; i++) {
      const phi = (Math.PI / (latLines + 1)) * (i + 1);
      for (let j = 0; j < lonPoints; j++) {
        const theta = ((Math.PI * 2) / lonPoints) * j;
        points.push({ phi, theta });
      }
    }

    // 6 Key Focus Nodes pinned on the globe
    const keyNodes = [
      { phi: Math.PI * 0.35, theta: 0.4, label: 'QUEENS // EARTH-616' },
      { phi: Math.PI * 0.55, theta: 1.8, label: 'GOTHAM // BATCAVE' },
      { phi: Math.PI * 0.45, theta: 3.2, label: 'HIDDEN LEAF // HOKAGE' },
      { phi: Math.PI * 0.65, theta: 4.5, label: 'MATRIX CORE // ZION' },
      { phi: Math.PI * 0.25, theta: 5.4, label: 'ICE PALACE // NORTH' },
      { phi: Math.PI * 0.75, theta: 2.5, label: 'LO-FI ATTIC // 3AM' },
    ];

    let angle = 0;

    const render = () => {
      angle += 0.012;
      setRotationAngle(Math.floor((angle * 57.3) % 360));
      ctx.clearRect(0, 0, width, height);

      // Outer Pixel Horizon Ring
      ctx.strokeStyle = '#3E356B';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - radius - 20, cy - radius - 20, (radius + 20) * 2, (radius + 20) * 2);

      // Equatorial pixel rings
      ctx.strokeStyle = '#1C1738';
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Project spherical points
      points.forEach((pt) => {
        const currTheta = pt.theta + angle;
        const x3d = radius * Math.sin(pt.phi) * Math.cos(currTheta);
        const y3d = radius * Math.cos(pt.phi);
        const z3d = radius * Math.sin(pt.phi) * Math.sin(currTheta);

        // Render only front hemisphere points for crisp pixel arcade look
        if (z3d > -20) {
          const depth = (z3d + radius) / (radius * 2); // 0 to 1
          const px = Math.floor(cx + x3d);
          const py = Math.floor(cy + y3d);

          ctx.fillStyle = depth > 0.6 ? '#F5C242' : '#5CE1E6';
          ctx.globalAlpha = Math.max(0.15, depth * 0.85);
          ctx.fillRect(px, py, 2, 2);
        }
      });

      // Render Key Nodes
      keyNodes.forEach((node) => {
        const currTheta = node.theta + angle;
        const x3d = radius * Math.sin(node.phi) * Math.cos(currTheta);
        const y3d = radius * Math.cos(node.phi);
        const z3d = radius * Math.sin(node.phi) * Math.sin(currTheta);

        if (z3d > 10) {
          const px = Math.floor(cx + x3d);
          const py = Math.floor(cy + y3d);

          // Glowing pixel diamond node
          ctx.fillStyle = '#00F0FF';
          ctx.globalAlpha = 1;
          ctx.fillRect(px - 3, py - 3, 6, 6);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(px - 1, py - 1, 2, 2);

          // Connecting guide line to label
          ctx.strokeStyle = '#5CE1E6';
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + 20, py - 15);
          ctx.lineTo(px + 45, py - 15);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '8px "Silkscreen", monospace';
          ctx.fillStyle = '#F5C242';
          ctx.fillText(node.label.split(' // ')[0], px + 50, py - 12);
        }
      });

      // Central Axis Crosshair
      ctx.strokeStyle = '#5CE1E6';
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
      ctx.stroke();
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      {/* LO / HI Cyan Dashed Measurement Boundary Guides */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between items-center text-[10px] font-mono text-arcade-cyan select-none pointer-events-none">
        <span className="bg-void px-1 border border-arcade-cyan">HI: 0xFF</span>
        <div className="w-[1px] flex-1 border-r border-dashed border-arcade-cyan my-1" />
        <span className="bg-void px-1 border border-arcade-cyan">LO: 0x00</span>
      </div>

      <div className="absolute -right-6 top-0 bottom-0 flex flex-col justify-between items-center text-[10px] font-mono text-arcade-cyan select-none pointer-events-none">
        <span className="bg-void px-1 border border-arcade-cyan">SYNC: 100%</span>
        <div className="w-[1px] flex-1 border-r border-dashed border-arcade-cyan my-1" />
        <span className="bg-void px-1 border border-arcade-cyan">ROT: {rotationAngle}°</span>
      </div>

      {/* Target Crosshairs in 4 corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-arcade-gold pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-arcade-gold pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-arcade-gold pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-arcade-gold pointer-events-none" />

      {/* Canvas Globe */}
      <canvas
        ref={canvasRef}
        className="block pixel-border bg-[#121026]/75 backdrop-blur-md border border-white/15 shadow-2xl hover:border-arcade-cyan/50 transition-colors"
      />

      {/* Tactical Telemetry Caption */}
      <div className="mt-2 flex items-center justify-between w-full max-w-[380px] px-2.5 py-1 text-[10px] font-mono text-gray-400 bg-[#121026]/75 backdrop-blur-md border border-white/15 shadow-sm">
        <span>ORBIT: [GEO-STATIONARY]</span>
        <span className="text-arcade-gold font-bold">20 WORLDS ONLINE</span>
        <span className="text-arcade-cyan">FPS: 60</span>
      </div>
    </div>
  );
};
