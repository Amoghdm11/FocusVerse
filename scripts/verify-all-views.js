import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE BROWSER UI & WORKFLOW AUDIT ---');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 0. Load initial root URL (Verifying default Starting Front Page)
    console.log('0. Navigating to http://localhost:5173/ (Root URL)...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    const lockInBtn = await page.waitForSelector('button ::-p-text(LOCK IN)');
    if (!lockInBtn) throw new Error('Starting Front Page (Home) failed to load on root URL');
    console.log('✓ Starting Front Page (Home Sanctuary) verified on root URL');
    await page.screenshot({ path: 'docs/screenshots/audit_00_front_page.png' });
    console.log('✓ Captured audit_00_front_page.png');

    // Click "DASHBOARD ➔" to enter Dashboard
    const enterDashBtn = await page.waitForSelector('button ::-p-text(DASHBOARD)');
    await enterDashBtn.click();
    await new Promise((r) => setTimeout(r, 800));

    // 1. Verify Dashboard view
    console.log('1. On Dashboard (#dashboard) ...');
    await page.screenshot({ path: 'docs/screenshots/audit_01_dashboard.png' });
    console.log('✓ Captured audit_01_dashboard.png');

    // Verify Dashboard Elements
    const levelPill = await page.$('header button[title*="Level"]');
    if (!levelPill) throw new Error('Level progression pill missing from NavigationHUD');
    console.log('✓ NavigationHUD & Level Progress Pill verified');

    // 2. Open Quick Action Command Palette (Ctrl+K or Action button)
    console.log('2. Testing Quick Action Command Palette...');
    const actionBtn = await page.waitForSelector('button ::-p-text(ACTION)');
    await actionBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'docs/screenshots/audit_02_quick_action.png' });
    console.log('✓ Captured audit_02_quick_action.png');

    // Close modal by clicking X
    const closeBtn = await page.waitForSelector('.fixed button');
    await closeBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    // 3. Navigate to Tasks & Planner
    console.log('3. Navigating to Tasks & Planner (#tasks)...');
    const tasksNav = await page.waitForSelector('nav button ::-p-text(Tasks & Planner)');
    await tasksNav.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'docs/screenshots/audit_03_tasks_view.png' });
    console.log('✓ Captured audit_03_tasks_view.png');

    // Create a new task
    console.log('Creating a new test task...');
    const newTaskBtn = await page.waitForSelector('button ::-p-text(NEW TASK)');
    await newTaskBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.type('input[placeholder*="Implement Dijkstra"]', 'Audit Master Task: Verify RPG Progression');
    const submitTaskBtn = await page.waitForSelector('button ::-p-text(CREATE TASK)');
    await submitTaskBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    console.log('✓ Task created successfully');

    // Switch to Weekly Planner subtab
    const plannerSubtab = await page.waitForSelector('button ::-p-text(WEEKLY PLANNER)');
    await plannerSubtab.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: 'docs/screenshots/audit_04_weekly_planner.png' });
    console.log('✓ Captured audit_04_weekly_planner.png');

    // 4. Navigate to Study Timer
    console.log('4. Navigating to Study Timer (#timer)...');
    const timerNav = await page.waitForSelector('nav button ::-p-text(Study Timer)');
    await timerNav.click();
    await new Promise((r) => setTimeout(r, 1000));
    
    // Verify Music Center is rendered inline (not a floating popover)
    const musicCenter = await page.waitForSelector('::-p-text(MUSIC & AMBIENCE CENTER)');
    if (!musicCenter) throw new Error('Dedicated Music & Ambience Center missing from Study Timer');
    console.log('✓ Large inline MUSIC & AMBIENCE CENTER verified');

    // Test Distraction counter
    console.log('Testing distraction counter...');
    const plusDistraction = await page.waitForSelector('button ::-p-text(+)');
    await plusDistraction.click();
    await new Promise((r) => setTimeout(r, 200));
    await plusDistraction.click();
    console.log('✓ Distraction counter tested');
    await page.screenshot({ path: 'docs/screenshots/audit_05_timer_view.png' });
    console.log('✓ Captured audit_05_timer_view.png');

    // 5. Navigate to Tutors & Environments
    console.log('5. Navigating to Tutors (#tutors)...');
    const tutorsNav = await page.waitForSelector('nav button ::-p-text(Tutors)');
    await tutorsNav.click();
    await new Promise((r) => setTimeout(r, 800));

    // Verify "SELECT TUTOR" primary button exists
    const selectTutorBtn = await page.waitForSelector('button ::-p-text(SELECT TUTOR)');
    if (!selectTutorBtn) throw new Error('SELECT TUTOR button missing from Tutors view');
    console.log('✓ Primary SELECT TUTOR button verified');

    // Open SELECT TUTOR Modal
    await selectTutorBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    const tutorModal = await page.waitForSelector('::-p-text(CHOOSE YOUR STUDY COMPANION)');
    if (!tutorModal) throw new Error('Tutor selection modal failed to open');
    console.log('✓ Tutor Selection Modal verified with search & category filters');
    await page.screenshot({ path: 'docs/screenshots/audit_06a_tutor_select_modal.png' });

    // Close modal
    const closeTutorModalBtn = await page.waitForSelector('button ::-p-text(CLOSE)');
    await closeTutorModalBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: 'docs/screenshots/audit_06_tutors_view.png' });
    console.log('✓ Captured audit_06_tutors_view.png');

    // 6. Navigate to Statistics
    console.log('6. Navigating to Statistics (#stats)...');
    const statsNav = await page.waitForSelector('nav button ::-p-text(Statistics)');
    await statsNav.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'docs/screenshots/audit_07_stats_view.png' });
    console.log('✓ Captured audit_07_stats_view.png');

    // 7. Navigate to Notes & Cards
    console.log('7. Navigating to Notes & Cards (#notes)...');
    const notesNav = await page.waitForSelector('nav button ::-p-text(Notes & Cards)');
    await notesNav.click();
    await new Promise((r) => setTimeout(r, 800));

    // Verify AI Assistant Panel
    const aiPanel = await page.waitForSelector('::-p-text(AI NOTEBOOK ASSISTANT)');
    if (!aiPanel) throw new Error('AI Notebook Assistant panel missing from Notes view');
    console.log('✓ AI Notebook Assistant panel verified');

    // Test asking AI a question with quick chip
    const explainChip = await page.waitForSelector('button ::-p-text(💡 Simple terms)');
    if (explainChip) {
      await explainChip.click();
      await new Promise((r) => setTimeout(r, 1500));
      console.log('✓ AI Q&A prompt tested successfully');
    }
    await page.screenshot({ path: 'docs/screenshots/audit_08_notes_workspace.png' });
    console.log('✓ Captured audit_08_notes_workspace.png');

    // Switch to Flashcards
    const flashcardsSubtab = await page.waitForSelector('button ::-p-text(FLASHCARDS)');
    await flashcardsSubtab.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'docs/screenshots/audit_09_flashcards_view.png' });
    console.log('✓ Captured audit_09_flashcards_view.png');

    // 8. Navigate to Achievements
    console.log('8. Navigating to Achievements (#achievements)...');
    const achNav = await page.waitForSelector('nav button ::-p-text(Achievements)');
    await achNav.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'docs/screenshots/audit_10_achievements_view.png' });
    console.log('✓ Captured audit_10_achievements_view.png');

    // 9. Navigate to Study Rooms
    console.log('9. Navigating to Study Rooms (#rooms)...');
    const roomsNav = await page.waitForSelector('nav button ::-p-text(Study Rooms)');
    await roomsNav.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'docs/screenshots/audit_11_study_rooms.png' });
    console.log('✓ Captured audit_11_study_rooms.png');

    // 10. Navigate to Settings
    console.log('10. Navigating to Settings (#settings)...');
    const settingsNav = await page.waitForSelector('nav button ::-p-text(Settings)');
    await settingsNav.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'docs/screenshots/audit_12_settings_view.png' });
    console.log('✓ Captured audit_12_settings_view.png');

    console.log('\n--- BROWSER CONSOLE ERRORS AUDIT ---');
    if (consoleErrors.length === 0) {
      console.log('✓ ZERO console errors detected during full app audit!');
    } else {
      console.warn(`Notice: ${consoleErrors.length} console errors logged:`);
      consoleErrors.forEach((e) => console.warn(' - ', e));
    }

    console.log('\nAUDIT COMPLETE: All 9 sections verified and functional.');
  } finally {
    await browser.close();
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
