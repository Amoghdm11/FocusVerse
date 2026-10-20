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

  // 1. Home page: Click "[ 🔒 LOCK IN ► ]" to reveal the two 9:16 cards
  console.log('Clicking LOCK IN...');
  const lockInBtn = await page.waitForSelector('button ::-p-text(LOCK IN)');
  await lockInBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // 2. Click the 9:16 Boy Card to navigate to dressing room
  console.log('Clicking Boy Spirit Card...');
  const boyCard = await page.waitForSelector('[data-spirit-card="boy"]');
  await boyCard.click();
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Dressing Room with Boy Spirits Roster and Centered 3D Model
  await page.screenshot({ path: 'docs/screenshots/dressing_room_64x64_boy_roster.png' });
  console.log('Saved dressing_room_64x64_boy_roster.png');

  // Click on Peter Parker
  const spiderBtn = await page.waitForSelector('button ::-p-text(Peter Parker)');
  await spiderBtn.click();
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'docs/screenshots/dressing_room_spiderman_centered.png' });
  console.log('Saved dressing_room_spiderman_centered.png');

  // Click Return Home
  const returnHomeBtn = await page.waitForSelector('button ::-p-text(RETURN HOME)');
  await returnHomeBtn.click();
  await new Promise(r => setTimeout(r, 1000));

  // Click LOCK IN again
  console.log('Clicking LOCK IN again...');
  const lockInBtn2 = await page.waitForSelector('button ::-p-text(LOCK IN)');
  await lockInBtn2.click();
  await new Promise(r => setTimeout(r, 600));

  // Click Girl Spirit Card
  console.log('Clicking Girl Spirit Card...');
  const girlCard = await page.waitForSelector('[data-spirit-card="girl"]');
  await girlCard.click();
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 2: Dressing Room with Girl Spirits Roster
  await page.screenshot({ path: 'docs/screenshots/dressing_room_64x64_girl_roster.png' });
  console.log('Saved dressing_room_64x64_girl_roster.png');

  // Click on Rapunzel or Elsa
  const elsaBtn = await page.waitForSelector('button ::-p-text(Elsa)');
  await elsaBtn.click();
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'docs/screenshots/dressing_room_elsa_centered.png' });
  console.log('Saved dressing_room_elsa_centered.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
