import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { SpiderManDesign } from '../src/components/SpiderManDesign';
const root = 'public/assets/characters/spiderman/design';
mkdirSync(root, { recursive: true });
for (const direction of ['down', 'up', 'left', 'right']) {
  for (let frame = 0; frame < 6; frame++) {
    writeFileSync(`${root}/${direction}-${frame}.svg`, renderToStaticMarkup(<SpiderManDesign direction={direction} frame={frame}/>));
  }
  writeFileSync(`${root}/${direction}-study.svg`, renderToStaticMarkup(<SpiderManDesign direction={direction} studying/>));
}
writeFileSync(`${root}/portrait.svg`, renderToStaticMarkup(<SpiderManDesign portrait/>));
console.log('Exported 29 shared-design SVG assets.');
