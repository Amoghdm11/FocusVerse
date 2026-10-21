import React, { useEffect, useState } from 'react';
import { SpiderMask, SpiderEmblem, SPIDER_PALETTE } from './SpiderManDesign';

export type StudyPose = 'idle' | 'repairing' | 'designing' | 'typing' | 'reading' | 'thinking' | 'writing' | 'complete';

// One room-space rig: hip (552,460), seat y=478, feet y=571.
// The desktop occludes the bent thighs, never a cropped standing sprite.
export const STUDY_RIG = { x: 480, y: 262, scale: 3, surface: 455 };
type Point = [number, number];
const p = SPIDER_PALETTE;
const wrists: Record<StudyPose, [Point, Point]> = {
  repairing: [[5,62],[-3,63]], designing: [[14,64],[-1,65]],
  writing: [[14,64],[-1,65]], typing: [[5,65],[-6,64]],
  reading: [[25,65],[0,65]], thinking: [[22,28],[-1,64]],
  idle: [[18,65],[0,64]], complete: [[18,65],[0,64]],
};
function Arm({ near, pose, frame }: { near: boolean; pose: StudyPose; frame: number }) {
  const shoulder: Point = near ? [34,34] : [15,34];
  const elbow: Point = near ? [37,54] : [8,54];
  const target = wrists[pose][near ? 0 : 1];
  // Recalculate the forearm from its fixed elbow to the moving wrist. Shoulder,
  // elbow and hand stay connected; tools travel with the grip.
  const phase = [0, .35, 0, -.35][(frame + (near ? 0 : 2)) % 4];
  const writing = near && (pose === 'writing' || pose === 'designing');
  const wrist: Point = [target[0] + (writing ? phase : 0), target[1] +
    (pose === 'typing' || (near && pose === 'repairing') ? phase : 0)];
  const line = (a: Point, b: Point) => `M${a.join(' ')}L${b.join(' ')}`;
  return <g className={near ? 'spider-working-arm' : 'spider-far-hand'} data-hand={near ? 'near' : 'far'}>
    <path d={line(shoulder,elbow) + line(elbow,wrist)} fill="none" stroke={p.ink} strokeWidth="10"/>
    <path d={line(shoulder,elbow)} fill="none" stroke={near ? p.red : p.redDark} strokeWidth="8"/>
    <path d={line(elbow,wrist)} fill="none" stroke={near ? p.blue : p.blueDark} strokeWidth="8"/>
    <path d={`M${elbow[0]+2} ${elbow[1]-3}L${wrist[0]+2} ${wrist[1]-2}`} fill="none" stroke={p.blueLight} strokeWidth="1"/>
    {/* Sleeve-local coordinates keep every web strand on the red fabric. */}
    <g transform={`translate(${shoulder.join(' ')}) rotate(${Math.atan2(elbow[1]-shoulder[1], elbow[0]-shoulder[0])*180/Math.PI-90})`}
      fill="none" stroke={p.web} strokeWidth=".38" strokeLinecap="round">
      <path d={`M-1.5 0V${Math.hypot(elbow[0]-shoulder[0], elbow[1]-shoulder[1])}M1.5 0V${Math.hypot(elbow[0]-shoulder[0], elbow[1]-shoulder[1])}`}/>
      {[3,7,11,15,19].map(y => <path key={y} d={`M-3.8 ${y}Q-2.5 ${y+1.5}-1.5 ${y}Q0 ${y+1.5}1.5 ${y}Q2.5 ${y+1.5}3.8 ${y}`}/>)}
    </g>
    <g className="spider-fingers" transform={`translate(${wrist.join(' ')})`}>
      <path d="M-4-3H3L5-1V3H2V4H-4L-6 2V-1Z" fill={p.red}/>
      <path d="M-4-1H2M-3 1H3M-1-2V3" fill="none" stroke={p.web} strokeWidth=".55"/>
      <path d="M-4-2H1" stroke={p.redLight} strokeWidth=".7"/>
      {(pose === 'writing' || pose === 'designing') && near && <path d="M0-5L3 6" stroke="#ead095" strokeWidth="1"/>}
      {pose === 'repairing' && near && <g><path d="M0-5V5" stroke="#ced7da"/><path d="M0-5V-1" stroke="#e0a45a" strokeWidth="2"/></g>}
    </g>
  </g>;
}
export function SeatedSpiderMan({ pose, layer = 'body' }: { pose: StudyPose; layer?: 'body' | 'hands' }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (layer !== 'hands') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const id = window.setInterval(() => {
      if (!document.hidden && !motion.matches) setFrame(f => (f + 1) % 4);
    }, 240);
    return () => clearInterval(id);
  }, [layer]);
  return <g className={`seated-spider pose-${pose} layer-${layer}`} data-pose={layer === 'body' ? pose : undefined} aria-label={`Spider-Man ${pose}`}>
    <g transform={`translate(${STUDY_RIG.x} ${STUDY_RIG.y}) scale(${STUDY_RIG.scale})`} shapeRendering="geometricPrecision" stroke={p.ink} strokeWidth="1" strokeLinejoin="miter">
      {layer === 'body' ? <>
        <ellipse cx="8" cy="104" rx="25" ry="3" fill="#10182b" opacity=".5" stroke="none"/>
        {/* Far thigh runs forward from the hip, then bends into a planted shin. */}
        <path data-limb="far-leg" d="M24 63H35V72L13 80L19 96L12 99L4 79V74Z" fill={p.blueDark}/>
        <path d="M12 92L19 91L22 100L25 102V105H8L5 103L9 100Z" fill={p.redDark}/>
        {/* Near femur is nearly horizontal; knee is in front of the hip. */}
        <path data-limb="near-leg" d="M17 62H29V71L5 78L2 94H-6L-7 76L-4 72Z" fill={p.blue}/>
        <path d="M17 67L0 75L-2 88" fill="none" stroke={p.blueLight} strokeWidth="2"/>
        <path d="M-6 90H3L2 100L-1 104H-17V101L-9 98Z" fill={p.red}/>
        <path d="M-4 92L-5 100M-8 99H1M-13 102H-2M14 94L16 101M11 101H21" fill="none" stroke={p.web} strokeWidth=".6"/>
        <path d="M-16 104H-1M8 105H25" stroke={p.ink}/>
        <g className="spider-torso">
        <path d="M18 26H28V29H34V32H38V43L36 51V64H32V67H17V64H13V49L12 37V32H15V29H18Z" fill={SPIDER_PALETTE.red}/>
        <path d="M14 40H18V47H21V62H18V65H14ZM32 38H36V45H38V52H35V65H28V60H30V47H32Z" fill={SPIDER_PALETTE.blue}/>
        <path d="M34 47H36V58H33V63H30V60H32V51H34Z" fill={SPIDER_PALETTE.blueDark} stroke="none"/>
        <path d="M16 32H20V30H27V32H31M16 35V38M22 61H27" stroke={SPIDER_PALETTE.redLight} fill="none"/>
        <g fill="none" stroke={p.web} strokeWidth=".38" strokeLinejoin="round">
          <path d="M23.5 31V65M19 31L20.5 38L21 46L22 65M28 31L26.5 38L26 46L25 65M14 33L20.5 38L23.5 42L26.5 38L33 33M14 38L23.5 42L32 38M18 46L23.5 42L30 46"/>
          <path d="M17 33Q18 35 20 34Q23.5 36 27 34Q29 35 31 33M14 37Q17 39 20.5 38Q23.5 40 26.5 38Q29 39 32 37M18 43Q20 45 23.5 44Q27 45 30.5 43M21 49Q22 50.5 23.5 49Q25 50.5 26.5 49M21.5 54Q22.5 55.5 23.5 54Q25 55.5 26 54M22 59Q23 60.5 23.5 59Q24.5 60.5 25.5 59M22 64Q23 65 23.5 64Q24.5 65 25 64"/>
        </g>
        <g transform="translate(23 42) scale(.8)"><SpiderEmblem/></g>
        <g className="spider-head">
          <path d="M19.5 24H26.5V29L25 32H21L19.5 29Z" fill={SPIDER_PALETTE.redDark}/>
          <g transform="translate(23 6)"><SpiderMask/></g>
        </g>
        </g>
      </> : <><Arm pose={pose} frame={frame} near={false}/><Arm pose={pose} frame={frame} near/></>}
    </g>
  </g>;
}
