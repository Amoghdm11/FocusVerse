import React, { useEffect, useRef } from 'react';

export interface PixelTransitionOverlayProps {
  isActive: boolean;
  onHalfway?: () => void;
  onComplete: () => void;
  durationMs?: number; // total duration (default 1200ms)
}

export const PixelTransitionOverlay: React.FC<PixelTransitionOverlayProps> = ({
  isActive,
  onHalfway,
  onComplete,
  durationMs = 1200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const hasTriggeredHalfwayRef = useRef<boolean>(false);
  const hasCompletedRef = useRef<boolean>(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onHalfwayRef = useRef(onHalfway);
  onHalfwayRef.current = onHalfway;

  useEffect(() => {
    if (!isActive) return;

    hasCompletedRef.current = false;
    hasTriggeredHalfwayRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const tileSize = 28; // chunky retro pixel block size
    const cols = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);

    // Generate ordered distance/wave delay for each tile (diagonal wave from center)
    const maxDist = Math.hypot(cols, rows);
    const tileDelays: number[][] = [];
    for (let r = 0; r < rows; r++) {
      tileDelays[r] = [];
      for (let c = 0; c < cols; c++) {
        // Wave pattern: diagonal + slight random jitter for authentic mosaic dissolve
        const dist = Math.hypot(c - cols / 2, r - rows / 2);
        const jitter = ((c * 17 + r * 31) % 7) * 0.05;
        tileDelays[r][c] = (dist / maxDist) * 0.75 + jitter;
      }
    }

    const startTime = performance.now();

    const finish = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (ctx) ctx.clearRect(0, 0, width, height);
      onCompleteRef.current?.();
    };

    // Safety timeout in case requestAnimationFrame is throttled in headless environments
    const safetyTimeout = setTimeout(finish, durationMs + 200);

    const render = (now: number) => {
      if (hasCompletedRef.current) return;

      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      ctx.clearRect(0, 0, width, height);

      // Phase 1 (0 -> 0.5): Wiping IN (tiles grow from 0 to full size)
      // Phase 2 (0.5 -> 1.0): Wiping OUT (tiles shrink from full size to 0, revealing new scene)
      const isWipingIn = progress < 0.5;
      const phaseProgress = isWipingIn ? progress * 2 : (progress - 0.5) * 2;

      // Trigger halfway callback at the peak of coverage (when screen is 100% blacked out)
      if (progress >= 0.5 && !hasTriggeredHalfwayRef.current) {
        hasTriggeredHalfwayRef.current = true;
        if (onHalfwayRef.current) onHalfwayRef.current();
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const delay = tileDelays[r][c];
          let scale = 0;

          if (isWipingIn) {
            // Tiles grow
            const localP = Math.max(0, Math.min(1, (phaseProgress - delay * 0.5) / 0.5));
            scale = Math.min(1, localP * 1.1);
          } else {
            // Tiles shrink away
            const localP = Math.max(0, Math.min(1, (phaseProgress - delay * 0.4) / 0.6));
            scale = Math.max(0, 1 - localP);
          }

          if (scale > 0.01) {
            const size = tileSize * scale;
            const x = c * tileSize + (tileSize - size) / 2;
            const y = r * tileSize + (tileSize - size) / 2;

            // Palette variation: deep void with gold & cyan edge highlights
            const isEdge = scale > 0.3 && scale < 0.85;
            if (isEdge && (c + r) % 3 === 0) {
              ctx.fillStyle = '#F5C242'; // golden sparkle block
            } else if (isEdge && (c + r) % 2 === 0) {
              ctx.fillStyle = '#5CE1E6'; // cyan sparkle block
            } else if ((c + r) % 2 === 0) {
              ctx.fillStyle = '#0E0B1C'; // deep arcade void
            } else {
              ctx.fillStyle = '#181432'; // twilight indigo block
            }

            ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(size), Math.ceil(size));
            
            // 1px black retro border around each block
            if (scale > 0.4) {
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 1;
              ctx.strokeRect(Math.floor(x), Math.floor(y), Math.ceil(size), Math.ceil(size));
            }
          }
        }
      }

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        finish();
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      clearTimeout(safetyTimeout);
    };
  }, [isActive, durationMs]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
