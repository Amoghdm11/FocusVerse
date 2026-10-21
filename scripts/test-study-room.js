import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

// Start Vite first. Uses actual app state, real DOM clicks and the real audio engine.
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const click = async selector => { await page.waitForSelector(selector, { visible:true }); await page.click(selector); };
const pose = expected => page.waitForSelector(`[data-pose="${expected}"]`);
try {
  mkdirSync('docs/study-room', { recursive:true });
  await page.setViewport({ width:1440, height:1000 });
  await page.evaluateOnNewDocument(() => {
    // Shorten only the companion's long dwell time, never the focus timer.
    const interval = window.setInterval.bind(window);
    window.setInterval = (fn, ms, ...args) => interval(fn, ms === 28000 ? 4000 : ms, ...args);
    const AudioContext = window.AudioContext;
    window.__audioContexts = [];
    window.AudioContext = class extends AudioContext {
      constructor(...args) { super(...args); window.__audioContexts.push(this); }
    };
  });
  await page.goto(`${process.env.BASE_URL || 'http://localhost:5173'}/#timer?char=peter-parker`, { waitUntil:'domcontentloaded' });
  await page.waitForSelector('.spider-study-room');
  await pose('repairing');
  await click('.room-activity-options button::-p-text(Sketch)');
  await pose('designing');
  assert.equal(await page.$eval('.room-activity-options button[aria-pressed=true]', b => b.textContent), 'Sketch');
  await click('.room-activity-options button::-p-text(Code)');
  await pose('typing');
  for (const [label, expected] of [['Tinker','repairing'], ['Sketch','designing'], ['Code','typing'], ['Read','reading'], ['Write','writing'], ['Think','thinking']]) {
    await click(`.room-activity-options button::-p-text(${label})`);
    await pose(expected);
    assert.equal(await page.$$eval('[data-limb]', nodes => nodes.length), 2, 'Exactly two seated legs');
    assert.equal(await page.$$eval('[data-hand]', nodes => nodes.length), 2, 'Exactly two articulated arms');
    await (await page.$('.queens-stage')).screenshot({ path:`docs/study-room/pose-${expected}.png` });
  }
  await click('.room-activity-options button::-p-text(Tinker)');
  await pose('repairing');
  await click('.room-activity-options button::-p-text(Auto)');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const roomBounds = await page.$eval('.queens-stage', node => {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x: x + scrollX, y: y + scrollY, width, height };
  });
  await click('[aria-label="Open computer music player"]');
  await page.waitForSelector('[aria-label="Computer music player"]', { visible:true });
  assert.deepEqual(await page.$eval('.queens-stage', node => {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x: x + scrollX, y: y + scrollY, width, height };
  }), roomBounds, 'Opening music must not shift or resize the room');
  await click('button::-p-text(Play soundscape)');
  await page.waitForFunction(() => window.__audioContexts.some(context => context.state === 'running'));
  await page.select('[aria-label="Room soundscape"]', 'fire');
  await page.$eval('[aria-label="Soundscape volume"]', input => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input, '.2'); input.dispatchEvent(new Event('input',{ bubbles:true })); input.dispatchEvent(new Event('change',{ bubbles:true })); });
  await page.keyboard.press('Escape');
  await page.waitForSelector('[aria-label="Computer music player"]', { hidden:true });
  assert.equal(await page.evaluate(() => window.__audioContexts.some(context => context.state === 'running')), true, 'Closing must preserve room playback');
  await click('[aria-label="Open computer music player"]');
  assert.equal(await page.$eval('[aria-label="Room soundscape"]', input => input.value), 'fire');
  await click('button::-p-text(Pause soundscape)');
  await click('[aria-label="Close music player"]');
  await click('[aria-label="Open notebook"]');
  await page.$eval('[aria-label="Study notes"]', input => { const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; setter.call(input,'Study room persistence test'); input.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.keyboard.press('Escape');
  await click('[aria-label="Open notebook"]');
  assert.equal(await page.$eval('[aria-label="Study notes"]', input => input.value), 'Study room persistence test');
  await page.keyboard.press('Escape');
  await click('.workspace-timer button::-p-text(LOCK IN)');
  await pose('repairing'); await pose('designing'); await pose('typing');
  await click('[aria-label="Open task board"]');
  await click('button[aria-label^="Complete task:"]');
  await pose('complete');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => ['repairing','designing','typing'].includes(document.querySelector('[data-pose]')?.dataset.pose));
  await click('.workspace-timer button::-p-text(PAUSE TIMER)');
  await click('[aria-label="Toggle desk lamp"]');
  assert.equal(await page.$eval('[aria-label="Toggle desk lamp"]', b => b.getAttribute('aria-pressed')), 'false');
  mkdirSync('docs/study-room', { recursive:true });
  await page.screenshot({ path:'docs/study-room/desktop.png', fullPage:true });
  await page.setViewport({ width:390, height:844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await click('[aria-label="Open computer music player"]');
  await page.keyboard.press('Escape');
  await page.screenshot({ path:'docs/study-room/mobile.png', fullPage:true });
  await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'reduce' }]);
  assert.equal(await page.$eval('.spider-working-arm', e => getComputedStyle(e).animationName), 'none');
  await page.reload({ waitUntil:'domcontentloaded' });
  await page.waitForSelector('.spider-study-room');
  await click('[aria-label="Open notebook"]');
  assert.equal(await page.$eval('[aria-label="Study notes"]', e => e.value), 'Study room persistence test');
  assert.deepEqual(errors, []);
  console.log('PASS: room, work poses, task reaction, timer pause, real AudioContext, soundscape selection, notebook persistence, lamp, desktop/mobile overflow, reduced motion.');
  console.log('YouTube network playback, session end and all customized outfits require separate manual verification.');
} finally { await browser.close(); }
