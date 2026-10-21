import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const art=JSON.parse(readFileSync('src/data/sanctuaryArt.json','utf8'));
const ids=process.argv[2]?.split(',') || Object.keys(art);
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];const results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/'))errors.push(`${r.status()} ${r.url()}`)});
mkdirSync('docs/sanctuaries/upgrade',{recursive:true});
try {
 await page.setViewport({width:1440,height:1100});
 await page.goto(`http://127.0.0.1:5173/#timer?char=${ids[0]}`,{waitUntil:'networkidle0'});
 for(const id of ids){
  await page.select('select',id);
  await page.waitForSelector(`[data-sanctuary="${id}"] .sanctuary-canvas`);
  await page.$$eval('.sanctuary-stage image',es=>Promise.all(es.map(async e=>{const image=new Image();image.src=e.getAttribute('href');await image.decode();if(!image.naturalWidth)throw Error('Missing art')})));
  for(const width of [1440,390]){
   await page.setViewport({width,height:1100});
   await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
   const bounds=await page.$$eval('.sanctuary-object',es=>es.map(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return {feature:e.dataset.feature,w:r.width,h:r.height,x:(r.x-p.x)/p.width,y:(r.y-p.y)/p.height,right:r.right<=p.right+1,bottom:r.bottom<=p.bottom+1}}));
   assert.equal(bounds.length,3);
   for(const b of bounds){assert(b.w>=44&&b.h>=44,`${id} ${b.feature}: touch target`);assert(b.right&&b.bottom,'Hotspot contained');}
   await page.$eval('.sanctuary-object[data-feature="notes"]',e=>e.focus());
   await page.keyboard.press('Enter');
   await page.waitForSelector('[aria-label="Study notebook"][open]');
   const text=await page.$eval('[aria-label="Study notes"]',e=>e.value);
   if(!results.length&&width===1440)await page.type('[aria-label="Study notes"]',' Sanctuary shared-note verification.');
   else assert(text.includes('Sanctuary shared-note verification.'),'Notes preserved through switching and resize');
   await page.keyboard.press('Escape');
   await page.click('.sanctuary-object[data-feature="tasks"]');
   await page.waitForSelector('[aria-label="Task board"][open]');
   await page.keyboard.press('Escape');
   await page.$eval('.sanctuary-object[data-feature="music"]',e=>e.focus());
   await page.keyboard.press('Space');
   await page.waitForSelector('[aria-label="Computer music player"]',{visible:true});
   await page.keyboard.press('Escape');
   await page.$eval('.sanctuary-object-toolbar button',e=>{if(e.getAttribute('aria-pressed')==='false')e.click()});
   await (await page.$('.character-sanctuary')).screenshot({path:`docs/sanctuaries/upgrade/${id}-${width}.png`});
   if(art[id].actor)assert.equal(await page.$eval('.illustrated-actor',e=>getComputedStyle(e).animationName),'none','Reduced motion');
  }
  results.push({id,illustratedActor:!!art[id].actor,checks:['assets decode','music real player via Space','notes real dialog via Enter','notes persist across characters','tasks real dialog','390px / 1440px bounds and touch targets','no overflow','reduced motion']});
  console.log(`PASS ${id}`);
 }
 assert.deepEqual(errors,[]);
 const contact=await browser.newPage();
 for(const width of [1440,390]){
  await contact.setViewport({width:1600,height:1000});
  await contact.setContent(`<body style="margin:0;padding:12px;background:#0e1520;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${ids.map(id=>`<img style="width:100%" src="data:image/png;base64,${readFileSync(`docs/sanctuaries/upgrade/${id}-${width}.png`).toString('base64')}"/>`).join('')}</body>`);
  await contact.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
  await contact.screenshot({path:`docs/sanctuaries/upgrade/contact-${width}.jpg`,fullPage:true,type:'jpeg',quality:85});
 }
 writeFileSync('docs/sanctuaries/upgrade/interaction-results.json',JSON.stringify({results,errors},null,2));
} finally {await browser.close();}
