import puppeteer from 'puppeteer-core';
import {readFileSync,writeFileSync} from 'node:fs';
const dir='docs/sanctuaries/restoration/all';
const {ids}=JSON.parse(readFileSync(`${dir}/checks.json`));
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 for(const mode of ['1','mobile']) for(let batch=0;batch<ids.length;batch+=6){
  const page=await browser.newPage();await page.setViewport({width:mode==='mobile'?1200:1600,height:1100});
  await page.setContent(`<body style="margin:0;padding:12px;background:#080510;display:grid;grid-template-columns:repeat(${mode==='mobile'?3:2},1fr);gap:12px">${ids.slice(batch,batch+6).map(id=>`<img style="width:100%" src="data:image/png;base64,${readFileSync(`${dir}/${id}-${mode}.png`).toString('base64')}"/>`).join('')}</body>`);
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await page.screenshot({path:`${dir}/review-${mode}-${batch/6+1}.jpg`,type:'jpeg',quality:88,fullPage:true});await page.close();
 }
 writeFileSync(`${dir}/index.html`,`<!doctype html><meta charset="utf-8"><title>FocusVerse sanctuary visual review</title><style>body{background:#080510;color:#ddd;font:14px monospace;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:20px}img{width:100%}a{color:#5ce1e6}section{border:1px solid #3e356b;padding:12px}</style><h1>FocusVerse — all sanctuary screenshots</h1><p>Actual Chrome rendering at 1440px and 390px. Both activities captured for each restored character.</p><main>${ids.map(id=>`<section><h2>${id}</h2><a href="${id}-0.png"><img src="${id}-0.png"></a><p><a href="${id}-1.png">Second activity</a> · <a href="${id}-mobile.png">Mobile</a></p></section>`).join('')}</main>`);
} finally{await browser.close();}
