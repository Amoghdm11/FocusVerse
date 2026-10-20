import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Home: Lock In -> Boy Card
  const lockInBtn = await page.waitForSelector('button ::-p-text(LOCK IN)');
  await lockInBtn.click();
  await new Promise(r => setTimeout(r, 600));

  const boyCard = await page.waitForSelector('[data-spirit-card="boy"]');
  await boyCard.click();
  await new Promise(r => setTimeout(r, 1500));

  // Click [ 🐾 PETS ] tab
  const petsTab = await page.waitForSelector('button ::-p-text(PETS)');
  await petsTab.click();
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'docs/screenshots/dressing_room_pets_tab.png' });
  console.log('Saved dressing_room_pets_tab.png');

  await browser.close();
}

run().catch(console.error);
