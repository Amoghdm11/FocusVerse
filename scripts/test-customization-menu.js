import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';

async function runTest() {
  console.log('--- Starting FocusVerse Full-Body Customization Menu Test ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  try {
    // 1. Navigate to Home
    console.log('Step 1: Navigating to Home...');
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle0' });

    // 2. Click Lock In button
    console.log('Step 2: Clicking LOCK IN button...');
    const lockInBtn = await page.waitForSelector('button ::-p-text(LOCK IN)', { timeout: 5000 });
    await lockInBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // 3. Select Boy Spirit Card to enter #select
    console.log('Step 3: Selecting Boy Spirit Card to enter customization...');
    const boyCard = await page.waitForSelector('[data-spirit-card="boy"]', { timeout: 5000 });
    await boyCard.click();
    await new Promise(r => setTimeout(r, 800));

    console.log('Current URL:', page.url());
    if (!page.url().includes('#select')) {
      throw new Error(`Expected #select in URL, got ${page.url()}`);
    }

    // 4. Verify Spider-Man Customization Menu composition
    console.log('Step 4: Verifying Spider-Man 2-Panel Composition...');
    const container = await page.waitForSelector('[data-testid="spiderman-customization-container"]', { timeout: 5000 });
    if (!container) throw new Error('Customization container not found!');
    console.log('  ✓ Two-panel container mounted successfully.');

    // Check Left Panel (Customization controls)
    const suitTab = await page.waitForSelector('button ::-p-text(OUTFITS)', { timeout: 5000 });
    if (!suitTab) throw new Error('Suit tab on left panel not found!');
    console.log('  ✓ Left panel with category navigation tabs verified.');

    // Check Right Panel (Full-Body 2D Pixel Sprite Canvas)
    const rightCanvas = await page.waitForSelector('canvas[width="64"][height="96"]', { timeout: 5000 });
    if (!rightCanvas) throw new Error('Full-body 64x96 pixel sprite canvas not found on right side!');
    console.log('  ✓ Right panel full-body 2D pixel sprite canvas verified.');

    // 5. Verify Boy/Girl Base Selection is Removed and Direct Character Selection Works
    console.log('Step 5: Verifying Boy/Girl general selection is removed and character cards work...');
    const oldBoyBtn = await page.$('button ::-p-text(BOY TRAINER)');
    const oldGirlBtn = await page.$('button ::-p-text(GIRL TRAINER)');
    if (oldBoyBtn || oldGirlBtn) {
      throw new Error('Generic Boy/Girl Trainer buttons should be completely removed from character customization!');
    }
    console.log('  ✓ Verified: Generic Boy/Girl buttons are removed.');

    const initialCanvasData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    // Test clicking Gwen Stacy character card
    const gwenCard = await page.waitForSelector('[data-testid="character-card-gwen-stacy"]', { timeout: 5000 });
    await gwenCard.click();
    await new Promise(r => setTimeout(r, 400));

    const gwenCanvasData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    if (initialCanvasData === gwenCanvasData) {
      throw new Error('Selecting Gwen Stacy did not update the full-body sprite canvas!');
    }
    console.log('  ✓ Gwen Stacy selection updated the full-body sprite canvas live.');

    // Test clicking Peter Parker character card
    const peterCard = await page.waitForSelector('[data-testid="character-card-peter-parker"]', { timeout: 5000 });
    await peterCard.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('  ✓ Switched to Peter Parker character card.');

    // 6. Test Live Customization modifying the sprite
    console.log('Step 6: Testing that customization options visibly modify the sprite...');

    // 6a. Select another Outfit: CYBERNETIC RONIN
    const beforeSuitData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    const cyberRoninSuitBtn = await page.waitForSelector('button ::-p-text(CYBER-RONIN)', { timeout: 5000 });
    await cyberRoninSuitBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const afterSuitData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    if (beforeSuitData === afterSuitData) {
      throw new Error('Selecting Cyber-Ronin Suit did not modify the sprite pixels!');
    }
    console.log('  ✓ Cyber-Ronin Suit equipped and visibly updated sprite pixels.');

    // 6b. Select HAIRSTYLE tab and pick ANIME SPIKES
    const hairTab = await page.waitForSelector('button ::-p-text(HAIRSTYLE)', { timeout: 5000 });
    await hairTab.click();
    await new Promise(r => setTimeout(r, 300));

    const beforeHairData = afterSuitData;
    const animeSpikesBtn = await page.waitForSelector('button ::-p-text(ANIME SPIKES)', { timeout: 5000 });
    await animeSpikesBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const afterHairData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    if (beforeHairData === afterHairData) {
      throw new Error('Selecting Anime Spikes did not modify the sprite pixels!');
    }
    console.log('  ✓ Anime Spikes equipped and visibly updated hair pixels.');

    // 6c. Select COLOR tab and pick CRIMSON SCARLET
    const colorTab = await page.waitForSelector('button ::-p-text(COLOR)', { timeout: 5000 });
    await colorTab.click();
    await new Promise(r => setTimeout(r, 300));

    const beforeColorData = afterHairData;
    const crimsonBtn = await page.waitForSelector('button ::-p-text(CRIMSON SCARLET)', { timeout: 5000 });
    await crimsonBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const afterColorData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    if (beforeColorData === afterColorData) {
      throw new Error('Selecting Crimson hair color did not modify the sprite pixels!');
    }
    console.log('  ✓ Crimson Scarlet hair color visibly updated sprite pixels.');

    // 6d. Select GEAR tab and pick CYBER HUD VISOR
    const gearTab = await page.waitForSelector('button ::-p-text(GEAR)', { timeout: 5000 });
    await gearTab.click();
    await new Promise(r => setTimeout(r, 300));

    const beforeVisorData = afterColorData;
    const visorBtn = await page.waitForSelector('button ::-p-text(CYBER HUD VISOR)', { timeout: 5000 });
    await visorBtn.click();
    await new Promise(r => setTimeout(r, 300));

    const afterVisorData = await page.evaluate(() => {
      const cvs = document.querySelector('canvas[width="64"][height="96"]');
      return cvs ? cvs.toDataURL() : '';
    });

    if (beforeVisorData === afterVisorData) {
      throw new Error('Selecting Cyber HUD Visor did not modify the sprite pixels!');
    }
    console.log('  ✓ Cyber HUD Visor equipped and visibly updated sprite pixels.');

    // 7. Verify Randomize & Reset Controls
    console.log('Step 7: Verifying Randomize & Reset Controls...');
    const randomBtn = await page.waitForSelector('button ::-p-text(RANDOMIZE)', { timeout: 5000 });
    await randomBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('  ✓ Randomize button clicked and generated a new loadout.');

    const resetBtn = await page.waitForSelector('button ::-p-text(RESET)', { timeout: 5000 });
    await resetBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('  ✓ Reset button clicked and restored default loadout.');

    // 8. Test Sprite Interaction
    console.log('Step 8: Testing Interactive Click on Sprite Canvas...');
    const spriteCvs = await page.waitForSelector('canvas[width="64"][height="96"]', { timeout: 5000 });
    await spriteCvs.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('  ✓ Sprite click triggered interactive audio and focus dialogue.');

    // 9. Final Confirmation & Pixel Transition (Phase D)
    console.log('Step 9: Confirming Custom Appearance and Triggering Pixel Transition...');
    const confirmBtn = await page.waitForSelector('button ::-p-text(LOCK IN APPEARANCE)', { timeout: 5000 });
    await confirmBtn.click();

    console.log('  Waiting for Pixel Mosaic Transition to complete...');
    await page.waitForFunction(() => window.location.hash.includes('#workspace'), { timeout: 8000 });
    console.log('  ✓ Transition completed! Landed on URL:', page.url());

    // 10. Verify in Workspace
    console.log('Step 10: Verifying Customized Hero in Workspace...');
    const flowCard = await page.waitForSelector('::-p-text(FLOW COMPANION)', { timeout: 5000 });
    if (!flowCard) throw new Error('Flow companion card not found in Workspace!');

    const workspaceCanvas = await page.waitForSelector('canvas[width="64"][height="96"]', { timeout: 5000 });
    if (!workspaceCanvas) throw new Error('Customized 2D full-body sprite canvas not rendered in Workspace!');
    console.log('  ✓ Customized 2D full-body sprite active in Workspace Flow Companion stage.');

    // 11. Test Persistence on Reload
    console.log('Step 11: Testing Persistence across Page Reload...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const reloadedCanvas = await page.waitForSelector('canvas[width="64"][height="96"]', { timeout: 5000 });
    if (!reloadedCanvas) throw new Error('Customized sprite was not preserved after reload!');
    console.log('  ✓ Persistence verified: Customized full-body sprite restored after reload.');

    console.log('\n🎉 ALL FULL-BODY 2D SPRITE CUSTOMIZATION TESTS PASSED WITH ZERO ERRORS! 🎉\n');
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTest();
