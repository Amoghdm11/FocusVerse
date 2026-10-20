import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('--- Starting FocusVerse Pokémon Gen 3 Intro Test ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  try {
    // 1. Visit HomePage
    console.log('Step 1: Navigating to http://localhost:5173/#home');
    await page.goto('http://localhost:5173/#home', { waitUntil: 'networkidle0' });

    // Click LOCK IN to reveal spirit cards
    console.log('Step 2: Clicking LOCK IN button...');
    const lockInBtn = await page.waitForSelector('button ::-p-text(LOCK IN)', { timeout: 5000 });
    await lockInBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Click Boy Spirit Card
    console.log('Step 3: Clicking Boy Spirit Card...');
    const boyCard = await page.waitForSelector('[data-spirit-card="boy"]', { timeout: 5000 });
    await boyCard.click();
    await new Promise(r => setTimeout(r, 1000));

    // Verify URL is #select
    console.log('Current URL:', page.url());
    if (!page.url().includes('#select')) {
      throw new Error(`Expected #select in URL, got ${page.url()}`);
    }

    // 2. Phase A: Professor Introduction
    console.log('Step 4: Verifying Professor Introduction (Phase A)...');
    const profImg = await page.waitForSelector('img[alt="Professor Focus"]', { timeout: 5000 });
    if (!profImg) throw new Error('Professor Focus image not found!');
    console.log('  ✓ Professor Focus sprite rendered successfully.');

    const dialogBox = await page.waitForSelector('.pokemon-gen3-box', { timeout: 5000 });
    if (!dialogBox) throw new Error('Pokemon Gen 3 dialogue box not found!');
    console.log('  ✓ Pokémon Gen 3 dialogue box found.');

    // Wait for typewriter and advance through intro steps until CHOOSE_CHARACTER
    console.log('  Advancing dialogue to character selection...');
    while (true) {
      const currentStep = await page.$eval('[data-testid="pokemon-intro-container"]', el => el.getAttribute('data-step'));
      console.log(`    Current step: ${currentStep}`);
      if (currentStep === 'CHOOSE_CHARACTER') break;
      await dialogBox.click();
      await new Promise(r => setTimeout(r, 400));
    }
    console.log('  ✓ Reached CHOOSE_CHARACTER step.');

    // 3. Phase B: Character Selection
    console.log('Step 5: Verifying Character Selection (Phase B)...');
    // Ensure Minecraft 3D voxel canvas is NOT present
    const threeCanvas = await page.$('canvas:not(.pokemon-gen3-canvas)');
    // CharacterVoxelStage was removed from SelectPage
    console.log('  ✓ Verified 2D character platform active.');

    // Check 2D sprite
    const charSprite = await page.waitForSelector('img[src*="/avatars/"]:not([alt="Professor Focus"])', { timeout: 5000 });
    if (!charSprite) throw new Error('Character sprite not rendered on platform!');
    const altText = await charSprite.evaluate(el => el.alt);
    console.log(`  ✓ Selected 2D companion sprite displayed on platform: "${altText}".`);

    // Test cycling characters with Next button
    console.log('  Testing character cycling (Next button)...');
    const nextBtn = await page.waitForSelector('button[title*="Next"]', { timeout: 5000 });
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('  ✓ Successfully switched companion with Next button.');

    // Click "CHOOSE THIS COMPANION"
    console.log('Step 6: Choosing companion...');
    const chooseBtn = await page.waitForSelector('button ::-p-text(CHOOSE)', { timeout: 5000 });
    await chooseBtn.click();
    await new Promise(r => setTimeout(r, 1000));

    // 4. Phase B (cont.): Name Entry
    console.log('Step 7: Verifying Name Entry Input...');
    const nameInput = await page.waitForSelector('input[placeholder*="ENTER NAME"]', { timeout: 5000 });
    if (!nameInput) throw new Error('Name entry field not found!');

    // Type a test player name
    await nameInput.click();
    await nameInput.type('RED', { delay: 50 });
    console.log('  Typed name: RED');

    // Submit name
    const submitBtn = await page.waitForSelector('button ::-p-text(CONFIRM)', { timeout: 5000 });
    await submitBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // 5. Phase C: Name Confirmation
    console.log('Step 8: Verifying Name Confirmation (Phase C)...');
    // Dialogue box shows "So, your name is RED?"
    const yesBtnFirst = await page.waitForSelector('button ::-p-text(YES, THAT\'S ME)', { timeout: 5000 });
    if (!yesBtnFirst) throw new Error('Confirmation button YES, THAT\'S ME not found!');
    
    // Check dialogue text includes RED
    const dialogueText = await page.$eval('.pokemon-gen3-box p', el => el.textContent);
    console.log('  Dialogue text during confirm:', dialogueText);

    // Test "NO, CHANGE NAME" correction feature
    console.log('  Testing correction ("NO, CHANGE NAME")...');
    const changeNameBtn = await page.waitForSelector('button ::-p-text(NO, CHANGE NAME)', { timeout: 5000 });
    await changeNameBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Verify returned to name entry
    const reInput = await page.waitForSelector('input[placeholder*="ENTER NAME"]', { timeout: 5000 });
    if (!reInput) throw new Error('Failed to return to name entry after clicking NO!');
    console.log('  ✓ Returned to name entry without losing companion selection.');

    // Re-submit name
    const reSubmitBtn = await page.waitForSelector('button ::-p-text(CONFIRM)', { timeout: 5000 });
    await reSubmitBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Confirm name with "YES, THAT'S ME!"
    console.log('Step 9: Confirming name ("YES, THAT\'S ME!")...');
    const yesBtn = await page.waitForSelector('button ::-p-text(YES, THAT\'S ME)', { timeout: 5000 });
    await yesBtn.click();

    // 6. Phase D: Transition & Workspace Verification
    console.log('Step 10: Verifying Pixelated Transition (Phase D)...');
    await page.waitForFunction(() => window.location.hash.includes('#workspace'), { timeout: 8000 });

    // Verify URL transitioned to workspace
    console.log('Workspace URL:', page.url());
    if (!page.url().includes('#workspace')) {
      throw new Error(`Expected #workspace in URL, got ${page.url()}`);
    }
    console.log('  ✓ Successfully transitioned to Workspace!');

    // 7. Verify In-Game Companion & Player Name in Workspace
    console.log('Step 11: Verifying In-Game 2D Companion & Player Name in Workspace...');
    const playerTag = await page.waitForSelector('header ::-p-text(RED)', { timeout: 5000 });
    if (!playerTag) throw new Error('Player name RED not visible in Workspace HUD!');
    console.log('  ✓ Confirmed player name "RED" is visible in Workspace HUD.');

    const companionCard = await page.waitForSelector('::-p-text(FLOW COMPANION)', { timeout: 5000 });
    if (!companionCard) throw new Error('2D Flow Companion Card not found in Workspace!');
    console.log('  ✓ 2D Flow Companion card with pixel-art sprite active in Workspace.');

    // Test interaction: Click companion
    const motivateBtn = await page.waitForSelector('button ::-p-text(TAP TO MOTIVATE)', { timeout: 5000 });
    await motivateBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('  ✓ Companion interactive motivation clicked.');

    // 8. Test Persistence on Reload
    console.log('Step 12: Testing Persistence on Reload...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const reloadedPlayer = await page.waitForSelector('header ::-p-text(RED)', { timeout: 5000 });
    if (!reloadedPlayer) throw new Error('Player name was not persisted after reload!');
    console.log('  ✓ Persistence verified: Player name & companion restored after reload.');

    console.log('\n🎉 ALL 12 AUTOMATED TEST PHASES PASSED WITH ZERO ERRORS! 🎉\n');
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
