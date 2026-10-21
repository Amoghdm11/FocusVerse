import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const roster=[...readFileSync('src/data/characters.ts','utf8').matchAll(/\bid: '([^']+)'/g)].map(m=>m[1]);
const ids=process.argv[2]?process.argv[2].split(','):roster.filter(id=>id!=='peter-parker');
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/sanctuaries/'))errors.push(`${r.status()} ${r.url()}`)});
await page.evaluateOnNewDocument(()=>{window.__sanctuaryIntervals=new Set();const start=window.setInterval.bind(window),stop=window.clearInterval.bind(window);window.setInterval=(fn,ms,...args)=>{const id=start(fn,ms,...args);if(ms===180)window.__sanctuaryIntervals.add(id);return id;};window.clearInterval=id=>{window.__sanctuaryIntervals.delete(id);return stop(id);};});
mkdirSync('docs/sanctuaries/screenshots',{recursive:true});
try {
 await page.setViewport({width:1440,height:1100});
 for(const id of ids){
  await page.goto(`http://127.0.0.1:5173/?verify=${id}#timer?char=${id}`,{waitUntil:'networkidle0'});
  await page.waitForSelector(`[data-sanctuary="${id}"]`);
  await page.$eval('.sanctuary-stage image',async e=>{const img=new Image();img.src=e.getAttribute('href');await img.decode();if(!img.naturalWidth)throw Error('Missing background');});
  assert.equal(await page.$$eval('[data-actor]',es=>es.length),1);
  assert.equal(await page.evaluate(()=>window.__sanctuaryIntervals.size),1,'One active actor interval');
  for(let i=0;i<2;i++){
   await page.click(`.sanctuary-actions button:nth-child(${i+2})`);
   assert.equal(await page.$eval('[data-sanctuary]',e=>e.dataset.action),String(i));
   if(await page.$('.illustrated-actor')) {
    assert.notEqual(await page.$eval('.illustrated-actor',e=>getComputedStyle(e).animationName),'none','Illustrated idle is active');
   } else {
    const before=await page.$eval('.sanctuary-stage',e=>e.innerHTML);
    await page.waitForFunction(before=>document.querySelector('.sanctuary-stage').innerHTML!==before,{timeout:3000},before);
   }
   await (await page.$('.character-sanctuary')).screenshot({path:`docs/sanctuaries/screenshots/${id}-${i}.png`});
  }
  await page.setViewport({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow');
  await (await page.$('.character-sanctuary')).screenshot({path:`docs/sanctuaries/screenshots/${id}-mobile.png`});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await new Promise(r=>setTimeout(r,200));
  const still=await page.$eval('.sanctuary-stage',e=>e.innerHTML);
  await new Promise(r=>setTimeout(r,400));
  assert.equal(await page.$eval('.sanctuary-stage',e=>e.innerHTML),still,'Reduced motion freezes articulated frames');
  assert.equal(await page.$eval('.sanctuary-ambient',e=>getComputedStyle(e).animationName),'none');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.setViewport({width:1440,height:1100});
  // The actual workspace selector remains outside the keyed scene.
  const selector=await page.$('select');
  if(selector){await page.select('select','peter-parker');await page.waitForSelector('.spider-study-room');assert.equal(await page.evaluate(()=>window.__sanctuaryIntervals.size),0,'Actor interval cleared on leaving');await page.select('select',id);await page.waitForSelector(`[data-sanctuary="${id}"][data-action="0"]`);assert.equal(await page.$eval('.sanctuary-actions button',e=>e.getAttribute('aria-pressed')),'true');}
  console.log(`PASS ${id}: assets, both activity selections and idle motion, mobile, reduced motion, selector roundtrip.`);
 }

 if(!process.argv[2]) {
  const clickText=async text=>page.click(`.workspace-timer button::-p-text(${text})`);
  await page.select('select','bruce-wayne');
  await page.click('.sanctuary-actions button:first-child');
  await page.waitForSelector('[data-action="1"]',{timeout:23000});
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(()=>window.__sanctuaryIntervals.size===0);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(()=>window.__sanctuaryIntervals.size===1);
  await clickText('LOCK IN');
  await new Promise(r=>setTimeout(r,1200));
  for(const id of roster){await page.select('select',id);await page.waitForSelector(id==='peter-parker'?'.spider-study-room':`[data-sanctuary="${id}"]`);assert((await page.$eval('.workspace-timer',e=>e.textContent)).includes('PAUSE TIMER'),'Timer keeps running through switching');}
  await clickText('PAUSE TIMER');
  await clickText('LOCK IN');
  await page.click('[title="Reset timer"]');
  assert((await page.$eval('.workspace-timer',e=>e.textContent)).includes('LOCK IN'));
  await clickText('REST (5M)');
  await page.waitForSelector('.sanctuary-paused');
  assert.equal(await page.evaluate(()=>window.__sanctuaryIntervals.size),0,'Rest stops frame timer');
  await clickText('LOCK IN');await clickText('PAUSE TIMER');
  await page.click('[title="Reset timer"]');
  await page.click('.character-sanctuary nav button::-p-text(Notes)');
  await page.waitForSelector('[aria-label="Study notebook"][open]');
  await page.type('[aria-label="Study notes"]',' Sanctuary regression note.');
  await page.keyboard.press('Escape');
  await page.select('select','elsa');
  await page.click('.character-sanctuary nav button::-p-text(Notes)');
  assert((await page.$eval('[aria-label="Study notes"]',e=>e.value)).includes('Sanctuary regression note.'));
  await page.keyboard.press('Escape');
  await page.click('.character-sanctuary nav button::-p-text(Tasks)');
  await page.waitForSelector('[aria-label="Task board"][open]');
  await page.click('[aria-label^="Complete task:"]');await page.keyboard.press('Escape');
  await page.click('.character-sanctuary nav button::-p-text(Music)');
  await page.waitForSelector('[aria-label="Computer music player"]',{visible:true});
  assert.equal(await page.$eval('[aria-label="Room soundscape"]',e=>e.value),'wind');
  await page.keyboard.press('Escape');
  // The customization still renders, but a costume never changes the sanctuary owner.
  await page.evaluate(()=>{localStorage.setItem('focusverse_custom_appearance',JSON.stringify({gender:'boy',outfit:'arachnid-suit',hairStyle:'anime-spikes',hairColor:'black',skinTone:'fair',accessory:'hero-mask',playerName:'TEST'}));localStorage.setItem('focusverse_appearance_owner','bruce-wayne');});
  await page.goto('http://127.0.0.1:5173/?verify=custom#timer?char=bruce-wayne',{waitUntil:'networkidle0'});
  await page.waitForSelector('[data-sanctuary="bruce-wayne"]');await page.waitForSelector('.sanctuary-player-avatar canvas');
  assert.equal(await page.$('.spider-study-room'),null);
  await clickText('LOCK IN');
  await page.evaluate(()=>{const now=Date.now.bind(Date);window.__restoreNow=now;Date.now=()=>now()+26*60*1000;});
  await page.waitForSelector('.sanctuary-paused');
  await page.evaluate(()=>{Date.now=window.__restoreNow;});
  const contact=await browser.newPage();
  for(const mode of ['0','mobile']) {
   await contact.setViewport({width:mode==='mobile'?1200:1600,height:1000});
   await contact.setContent(`<html><body style="margin:0;padding:16px;background:#101926;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${ids.map(id=>`<img style="width:100%" src="data:image/png;base64,${readFileSync(`docs/sanctuaries/screenshots/${id}-${mode}.png`).toString('base64')}"/>`).join('')}</body></html>`);
   await contact.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
   await contact.screenshot({path:`docs/sanctuaries/contact-${mode}.jpg`,fullPage:true,type:'jpeg',quality:85});
  }
  await contact.close();
  console.log('PASS integration: automatic cycle, hidden-tab cleanup, all-20 switching while focusing, pause/resume/reset/rest, notes persistence, tasks, music profile, saved customization ownership, controlled-clock session completion.');
 }
 assert.deepEqual(errors,[]);
 writeFileSync(`docs/sanctuaries/results-${ids[0]}.json`,JSON.stringify({ids,checks:['assets decode','activity selection and idle animation','390px no overflow','reduced motion','selector roundtrip','no page errors',...(!process.argv[2]?['all-20 focus continuity','automatic cycle','visibility cleanup','pause resume reset rest','notes tasks music','customization ownership','controlled-clock completion']:[])],errors},null,2));
} finally {await browser.close();}
