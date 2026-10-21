import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const root = 'public/assets/characters/spiderman/design/';
const assets = readdirSync(root).filter(f => f.endsWith('.svg'));
assert.equal(assets.length, 29);
for (const file of assets) {
  const svg = readFileSync(root + file, 'utf8');
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'), file);
  assert.ok(svg.includes('viewBox="' + (file === 'portrait.svg' ? '17 0 30 30' : '0 0 64 96') + '"'), file);
  assert.ok(!svg.includes('NaN') && !svg.includes('undefined'), file);
  assert.ok(svg.includes('#df354b') && svg.includes('#2855a0'), file);
}
assert.notEqual(readFileSync(root+'down-1.svg','utf8'), readFileSync(root+'down-2.svg','utf8'));
assert.ok(!readFileSync(root+'up-0.svg','utf8').includes('#f5f6e9'), 'Back view must not have lenses');
assert.ok(readFileSync(root+'down-0.svg','utf8').includes('#f5f6e9'), 'Front view must have lenses');
console.log('PASS: 29 SVG assets, common view boxes/palette, distinct walking frames, front/back lens orientation. No browser rendering asserted.');
