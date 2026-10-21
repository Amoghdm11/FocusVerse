import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const roster=[...readFileSync('src/data/characters.ts','utf8').matchAll(/\bid: '([^']+)'/g)].map(m=>m[1]);
const ids=process.argv[2]?.split(',')??roster.filter(id=>!['peter-parker','tony-stark'].includes(id));
const out='docs/sanctuaries/restoration/all';mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.BASE_URL||'http://127.0.0.1:5174';
try {
 await page.setViewport({width:1440,height:1100});
 await page.goto(`${base}/#timer?char=peter-parker`,{waitUntil:'networkidle0'});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 const chrome=await page.$eval('.queens-heading',e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.borderBottomColor,getComputedStyle(e.querySelector('h2')).fontFamily]});
 for(const id of ids){
  await page.select('select',id);await page.waitForSelector(`[data-sanctuary="${id}"]`);
  await page.$eval('.sanctuary-stage image',async e=>{const i=new Image();i.src=e.getAttribute('href');await i.decode();});
  assert.deepEqual(await page.$eval('.queens-heading',e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.borderBottomColor,getComputedStyle(e.querySelector('h2')).fontFamily]}),chrome,`${id}: original chrome`);
  assert.equal(await page.$$eval('[data-actor]',es=>es.length),1);
  for(const feature of ['notes','tasks','music']){
   const selector=`.sanctuary-object[data-feature="${feature}"]`;
   await page.click(selector);
   await page.waitForSelector(feature==='music'?'[aria-label="Computer music player"]':`[aria-label="${feature==='notes'?'Study notebook':'Task board'}"][open]`,{visible:true});
   if(feature==='notes'){
    if(id===ids[0])await page.type('[aria-label="Study notes"]','All sanctuary shared notebook check.');
    else assert((await page.$eval('[aria-label="Study notes"]',e=>e.value)).includes('All sanctuary shared notebook check.'));
   }
   await page.keyboard.press('Escape');
  }
  for(let activity=0;activity<2;activity++){
   await page.click(`.sanctuary-actions button:nth-child(${activity+2})`);
   assert.equal(await page.$eval('[data-sanctuary]',e=>e.dataset.action),String(activity));
   await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur());
   await (await page.$('.character-sanctuary')).screenshot({path:`${out}/${id}-${activity}.png`});
  }
  const still=await page.$eval('.sanctuary-stage',e=>e.innerHTML);await new Promise(r=>setTimeout(r,220));assert.equal(await page.$eval('.sanctuary-stage',e=>e.innerHTML),still,'Reduced motion');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  const before=await page.$eval('.sanctuary-stage',e=>e.innerHTML);await page.waitForFunction(s=>document.querySelector('.sanctuary-stage').innerHTML!==s,{timeout:2500},before);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.setViewport({width:390,height:1000});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile overflow');
  await page.$eval('.sanctuary-object[data-feature="notes"]',e=>e.focus());await page.keyboard.press('Enter');await page.waitForSelector('[aria-label="Study notebook"][open]');await page.keyboard.press('Escape');
  await page.click('.sanctuary-light');assert.equal(await page.$eval('.sanctuary-light',e=>e.getAttribute('aria-pressed')),'false');await page.click('.sanctuary-light');
  await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur());
  await (await page.$('.character-sanctuary')).screenshot({path:`${out}/${id}-mobile.png`});
  await page.setViewport({width:1440,height:1100});
  console.log(`PASS ${id}: desktop/mobile, both actions, real objects, shared notes, keyboard, motion, original chrome`);
 }
 // A live timer survives switching through the entire roster.
 await page.click('.workspace-timer button::-p-text(LOCK IN)');
 for(const id of roster){await page.select('select',id);await page.waitForSelector(id==='peter-parker'?'.spider-study-room':`[data-sanctuary="${id}"]`);assert((await page.$eval('.workspace-timer',e=>e.textContent)).includes('PAUSE TIMER'));}
 await page.click('.workspace-timer button::-p-text(PAUSE TIMER)');
 await page.select('select',ids[0]);await page.click('.workspace-timer button::-p-text(REST (5M))');await page.waitForSelector('.sanctuary-paused');assert(await page.$$eval('.sanctuary-actions button:not(:first-child)',es=>es.every(e=>e.disabled)));
 for(let batch=0;batch<ids.length;batch+=6){
  const contact=await browser.newPage();await contact.setViewport({width:1600,height:1100});
  await contact.setContent(`<body style="margin:0;padding:12px;background:#080510;display:grid;grid-template-columns:1fr 1fr;gap:12px">${ids.slice(batch,batch+6).map(id=>`<img style="width:100%" src="data:image/png;base64,${readFileSync(`${out}/${id}-0.png`).toString('base64')}"/>`).join('')}</body>`);
  await contact.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await contact.screenshot({path:`${out}/comparison-${1+batch/6}.jpg`,type:'jpeg',quality:88,fullPage:true});await contact.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${out}/checks.json`,JSON.stringify({ids,passed:['desktop/mobile screenshots','both activities','real music notes tasks objects','shared notes across roster','keyboard notes','lamp toggle','animated actions','reduced motion','original room chrome','all 20 timer continuity','break pauses activities'],errors},null,2));
} finally {await browser.close();}
