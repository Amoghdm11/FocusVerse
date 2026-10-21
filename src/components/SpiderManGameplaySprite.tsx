import React, { useEffect, useRef, useState } from 'react';
import { spiderDesignUrl, spidermanManifest, SpiderManAnimation } from '../utils/spidermanAssets';

type Direction = 'up' | 'down' | 'left' | 'right';
const directions: Direction[] = ['up', 'left', 'down', 'right'];
const keys: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

export function SpiderManGameplaySprite({ studying, onClick }: { studying: boolean; onClick?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [failed, setFailed] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 8 });
  const animation: SpiderManAnimation = direction ? `walk-${direction}` : studying ? 'study' : 'idle';
  const atBoundary = direction === 'left' ? position.x <= 0 : direction === 'right' ? position.x >= 32 : direction === 'up' ? position.y <= 0 : direction === 'down' ? position.y >= 16 : false;
  const renderedAnimation = atBoundary ? 'idle' : animation;

  useEffect(() => {
    let cancelled = false;
    let request = 0;
    const frames: HTMLImageElement[] = [];
    const spec = spidermanManifest.animations[renderedAnimation];
    const load = async () => {
      await Promise.all(Array.from({ length: spec.frameCount }, (_, frame) => new Promise<void>((resolve, reject) => {
        const image = new Image();
        frames[frame] = image;
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = spiderDesignUrl(renderedAnimation.startsWith('walk-') ? renderedAnimation.slice(5) : 'down', renderedAnimation.startsWith('walk-') ? frame : 0, renderedAnimation === 'study');
      })));
      if (cancelled) return;
      setFailed(false);
      const start = performance.now();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const total = spec.durationsMs.reduce((a, b) => a + b, 0);
      const draw = (now: number) => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        let elapsed = (now - start) % total;
        let frame = 0;
        while (elapsed >= spec.durationsMs[frame] && frame < spec.frameCount - 1) elapsed -= spec.durationsMs[frame++];
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 64, 96);
        ctx.drawImage(frames[frame], 0, 0, 64, 96);
        canvas.dataset.frame = String(frame);
        if (!reducedMotion) request = requestAnimationFrame(draw);
      };
      request = requestAnimationFrame(draw);
    };
    load().catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; cancelAnimationFrame(request); };
  }, [renderedAnimation]);

  useEffect(() => {
    if (!direction) return;
    const timer = window.setInterval(() => setPosition(p => ({
      x: Math.max(0, Math.min(32, p.x + (direction === 'right' ? 2 : direction === 'left' ? -2 : 0))),
      y: Math.max(0, Math.min(16, p.y + (direction === 'down' ? 2 : direction === 'up' ? -2 : 0))),
    })), 120);
    const stop = () => setDirection(null);
    window.addEventListener('blur', stop);
    return () => { clearInterval(timer); window.removeEventListener('blur', stop); };
  }, [direction]);

  return <div data-testid="spiderman-gameplay" tabIndex={0} role="group" aria-label="Spider-Man companion. Use arrow keys to walk."
    className="rounded focus:outline focus:outline-arcade-cyan"
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDirection(null); }}
    onKeyDown={e => { if (keys[e.key]) { e.preventDefault(); setDirection(keys[e.key]); } }}
    onKeyUp={e => { if (keys[e.key]) { e.preventDefault(); setDirection(null); } }}>
    <div style={{ width: 96, height: 112, position: 'relative' }}>
      {failed ? <img src={spiderDesignUrl()} width={64} height={96} alt="Spider-Man" style={{ imageRendering: 'pixelated' }} /> :
        <canvas ref={canvasRef} width={64} height={96} data-animation={renderedAnimation} aria-label={`Spider-Man ${renderedAnimation}`} onClick={onClick}
          style={{ position: 'absolute', left: position.x, top: position.y, width: 64, height: 96, imageRendering: 'pixelated' }} />}
    </div>
    <div className="flex justify-center gap-1">
      {directions.map(dir => <button key={dir} type="button" aria-label={`Walk ${dir}`} className="text-xs text-arcade-gold border border-arcade-border px-1"
        style={{ touchAction: 'none' }} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDirection(dir); }}
        onPointerUp={() => setDirection(null)} onPointerCancel={() => setDirection(null)} onLostPointerCapture={() => setDirection(null)}
        onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setDirection(dir); } }}
        onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') setDirection(null); }}>
        {{ up: '↑', down: '↓', left: '←', right: '→' }[dir]}
      </button>)}
    </div>
  </div>;
}
