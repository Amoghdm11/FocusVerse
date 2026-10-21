import React, { useState } from 'react';
import { spiderDesignUrl } from '../utils/spidermanAssets';
export function SpiderManTurntable() {
  const [direction, setDirection] = useState('down');
  return <div className="h-full flex items-center justify-center gap-6" aria-label="Spider-Man appearance views">
    <img src={spiderDesignUrl(direction)} alt={`Spider-Man ${direction === 'up' ? 'back' : direction === 'down' ? 'front' : direction + ' side'}`} width={128} height={192} style={{imageRendering:'pixelated'}}/>
    <div className="flex flex-col gap-2">{[['down','Front'],['left','Left'],['up','Back'],['right','Right']].map(([view,label]) => <button key={view} onClick={()=>setDirection(view)} aria-pressed={direction === view} className="pixel-btn px-3 py-2 text-xs text-arcade-cyan">{label}</button>)}</div>
  </div>;
}
