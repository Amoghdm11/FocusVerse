// Offline, deterministic SVG exports of the actual React rig and room.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SpiderStudyRoom } from '../src/components/SpiderStudyRoom';
import { SeatedSpiderMan, StudyPose } from '../src/components/SeatedSpiderMan';
(globalThis as any).document = { hidden: false };
const css = readFileSync('src/components/SpiderStudyRoom.css', 'utf8');
const root = 'public/assets/characters/spiderman/study-rig';
mkdirSync(root, { recursive: true });
for (const pose of ['idle','repairing','designing','typing','reading','writing','thinking','complete'] as StudyPose[]) {
  writeFileSync(`${root}/${pose}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="400 245 256 350" width="256" height="350"><style>${css}*{animation:none!important}</style>${renderToStaticMarkup(<><SeatedSpiderMan pose={pose}/><SeatedSpiderMan pose={pose} layer="hands"/></>)}</svg>`);
}
let scene = renderToStaticMarkup(<SpiderStudyRoom action="FOCUSING" completion={0} onMusic={()=>{}} onNotes={()=>{}} onTasks={()=>{}}/>);
const sceneStart = scene.indexOf('<svg viewBox="0 0 1000 660"');
if (sceneStart < 0) throw new Error('Room SVG missing');
scene = scene.slice(sceneStart, scene.indexOf('</svg>', sceneStart) + 6).replace('<svg ', '<svg class="workshop-repairing lamp-on" xmlns="http://www.w3.org/2000/svg" width="1000" height="660" ');
scene = scene.replace('assets/room/queens-night.jpg', 'data:image/jpeg;base64,' + readFileSync('public/assets/room/queens-night.jpg').toString('base64'));
scene = scene.replace('</svg>', `<style>${css}*{animation:none!important}.desk-light{opacity:1}</style></svg>`);
writeFileSync('docs/study-room/room-preview.svg', scene);
console.log('Exported eight transparent SVG poses and the actual room SVG. These are offline renders, not browser screenshots.');
