# FocusVerse sanctuary implementation

## Architecture and assets

The canonical roster remains unchanged in src/data/characters.ts. SpiderStudyRoom, SeatedSpiderMan, and all Spider-Man artwork are unchanged. The new CharacterSanctuary uses a keyed, reusable SVG renderer with separate background assets, foreground work objects, lighting, articulated actors, and ambient layers. SanctuaryActor rebuilds connected arm segments and moves tools with the wrist; feet remain anchored. Pets have separate paw, head, ear, and tail geometry. Two selectable actions per new character also alternate automatically. Gestures use short frame sequences with holds.

Only the selected background is requested. The 19 deterministic local SVG assets total 1,65,240 bytes before HTTP compression. No image generation or external asset service is required at runtime. npm run build regenerates all assets from the checked-in generator.

## Roster, worlds, and implemented actions

| Character ID | Environment | Action 1 | Action 2 |
|---|---|---|---|
| bruce-wayne | The detective’s vigil — Batcave · Gotham | Sweep Gotham sonar | Calibrate grapnel |
| tony-stark | Midnight engineering — Malibu · R&D bay | Tune arc reactor | Rotate suit hologram |
| miles-morales | Above the borough — Brooklyn · rooftop atelier | Paint a mural stroke | Test venom charge |
| gwen-stacy | Between the beats — Earth-65 · rehearsal loft | Practice snare pattern | Count cymbal accents |
| naruto-uzumaki | The patient shinobi — Hidden Leaf · training veranda | Trace a sealing scroll | Gather a Rasengan |
| gojo-satoru | A moment of infinity — Jujutsu High · barrier chamber | Balance Limitless energy | Adjust the blindfold |
| levi-ackerman | Order before dawn — Scout HQ · stone quarters | Polish an ODM blade | Lift the porcelain tea cup |
| l-lawliet | The quiet deduction — Kanto · task force suite | Trace a case connection | Lift a sugar cube |
| elsa | Crystal clarity — North Mountain · ice observatory | Weave a snow crystal | Lift an ice ribbon |
| rapunzel | Where the light goes — Corona · tower atelier | Paint a golden sun | Raise a paper lantern |
| moana | The wayfinder’s watch — Motunui · starlit outrigger | Sight a guiding star | Turn the navigation paddle |
| hermione-granger | One more chapter — Hogwarts · restricted library | Annotate the grimoire | Levitate a page with her wand |
| wednesday-addams | A study in silence — Nevermore · Ophelia Hall | Type the next chapter | Draw the cello bow |
| officer-k | After the baseline — Los Angeles 2049 · spinner hangar | Scan a memory record | Inspect the wooden horse |
| neo | Beyond the signal — Nebuchadnezzar · operator deck | Decode the operator feed | Bend the spoon |
| cozy-study-girl | Rain, paper, possibility — Rainy attic · quiet afternoon | Write in the journal | Warm her hands around tea |
| late-night-study-boy | The last train home — Tokyo dorm · 03:45 | Debug on the keyboard | Adjust the headphones |
| purring-window-cat | A patch of sunlight — Botanical greenhouse · morning | Wash a paw | Follow the drifting leaf |
| loyal-fireplace-dog | Keeping the hearth — Pine mountain cabin · dusk | Offer a paw | Listen toward the hearth |

## Per-character design and asset manifest

### bruce-wayne

- Asset: public/assets/sanctuaries/bruce-wayne.svg
- Architecture/layers: Limestone cavern, reservoir and suspended command platform.
- Props: Sonar array, evidence board, grapnel cradle.
- Palette (base / material / light): #121e30 / #507085 / #81d8f0.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: scanner, wrench. Held props and individual limbs animate; the whole actor does not bob.

### tony-stark

- Asset: public/assets/sanctuaries/tony-stark.svg
- Architecture/layers: Curved ocean glazing and recessed armor bays.
- Props: Arc reactor, holographic CAD, robot arm.
- Palette (base / material / light): #192c3c / #bf794f / #62eee4.
- Ambient overlay: stars; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: wrench, hologram. Held props and individual limbs animate; the whole actor does not bob.

### miles-morales

- Asset: public/assets/sanctuaries/miles-morales.svg
- Architecture/layers: Water tower, layered skyline and painted parapet.
- Props: Mural, spray cans, boombox, practice panel.
- Palette (base / material / light): #25203e / #d24b86 / #6de2f0.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (530, 300), scale 1, within a 1000 × 660 composition.
- Action tools: spray, spark. Held props and individual limbs animate; the whole actor does not bob.

### gwen-stacy

- Asset: public/assets/sanctuaries/gwen-stacy.svg
- Architecture/layers: Arched warehouse windows and a rehearsal platform.
- Props: Drum kit, cymbals, amplifier, sticks.
- Palette (base / material / light): #34304f / #eb90b2 / #83ded9.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (565, 290), scale 1, within a 1000 × 660 composition.
- Action tools: sticks, cymbal. Held props and individual limbs animate; the whole actor does not bob.

### naruto-uzumaki

- Asset: public/assets/sanctuaries/naruto-uzumaki.svg
- Architecture/layers: Timber veranda, distant village and mountain ridge.
- Props: Seal scroll, kunai rack, paper lantern.
- Palette (base / material / light): #383b39 / #d99750 / #a7cfa1.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: brush, orb. Held props and individual limbs animate; the whole actor does not bob.

### gojo-satoru

- Asset: public/assets/sanctuaries/gojo-satoru.svg
- Architecture/layers: Temple colonnade opening into an infinite star field.
- Props: Barrier rings, talisman stand, blindfold.
- Palette (base / material / light): #1c203c / #8b70ce / #8bdef7.
- Ambient overlay: stars; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: infinity, blindfold. Held props and individual limbs animate; the whole actor does not bob.

### levi-ackerman

- Asset: public/assets/sanctuaries/levi-ackerman.svg
- Architecture/layers: Stone lancets, exposed beams and regiment courtyard.
- Props: ODM blade rack, tea service, folded cloak.
- Palette (base / material / light): #293532 / #8a9272 / #c8c7a0.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: blade, cup. Held props and individual limbs animate; the whole actor does not bob.

### l-lawliet

- Asset: public/assets/sanctuaries/l-lawliet.svg
- Architecture/layers: Rain-streaked high-rise glazing and evidence wall.
- Props: Surveillance CRTs, case files, sugar cube.
- Palette (base / material / light): #222b39 / #768b9c / #d4e6e9.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (565, 310), scale 1, within a 1000 × 660 composition.
- Action tools: pencil, sugar. Held props and individual limbs animate; the whole actor does not bob.

### elsa

- Asset: public/assets/sanctuaries/elsa.svg
- Architecture/layers: Faceted ice arches, mountain horizon and aurora.
- Props: Crystal lectern, snowflake lattice, frozen balustrade.
- Palette (base / material / light): #203a59 / #8dc2dc / #e0f7fa.
- Ambient overlay: snow; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: snow, ribbon. Held props and individual limbs animate; the whole actor does not bob.

### rapunzel

- Asset: public/assets/sanctuaries/rapunzel.svg
- Architecture/layers: Round stone tower, tall arch and lantern valley.
- Props: Sun mural, easel, painting journal, golden hair.
- Palette (base / material / light): #483344 / #c58e61 / #f8d58a.
- Ambient overlay: embers; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: brush, lantern. Held props and individual limbs animate; the whole actor does not bob.

### moana

- Asset: public/assets/sanctuaries/moana.svg
- Architecture/layers: Open ocean, triangular sail and woven canoe deck.
- Props: Star chart, paddle, Heart stone, rope coils.
- Palette (base / material / light): #123e4b / #be9063 / #82e0c8.
- Ambient overlay: stars; local soft light and contact shadows.
- Actor anchor: (565, 310), scale 1, within a 1000 × 660 composition.
- Action tools: compass, paddle. Held props and individual limbs animate; the whole actor does not bob.

### hermione-granger

- Asset: public/assets/sanctuaries/hermione-granger.svg
- Architecture/layers: Gothic library aisles and moonlit rose window.
- Props: Open grimoire, quill, floating candles, levitating page.
- Palette (base / material / light): #342a2e / #a77950 / #efcb88.
- Ambient overlay: embers; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: quill, wand. Held props and individual limbs animate; the whole actor does not bob.

### wednesday-addams

- Asset: public/assets/sanctuaries/wednesday-addams.svg
- Architecture/layers: Gothic circular window and striped vaulted walls.
- Props: Typewriter, cello, manuscript, raven perch.
- Palette (base / material / light): #272633 / #8b8293 / #d6d0e0.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: type, bow. Held props and individual limbs animate; the whole actor does not bob.

### officer-k

- Asset: public/assets/sanctuaries/officer-k.svg
- Architecture/layers: Amber smog skyline, hangar ribs and grounded spinner.
- Props: Baseline reader, scanner, wooden horse.
- Palette (base / material / light): #3c302c / #c58b52 / #81cad2.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: scanner, horse. Held props and individual limbs animate; the whole actor does not bob.

### neo

- Asset: public/assets/sanctuaries/neo.svg
- Architecture/layers: Ribbed ship hull, cable bundles and phosphor terminals.
- Props: Operator keyboard, telephone, bent spoon.
- Palette (base / material / light): #142d29 / #56796b / #9ee3ae.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: type, spoon. Held props and individual limbs animate; the whole actor does not bob.

### cozy-study-girl

- Asset: public/assets/sanctuaries/cozy-study-girl.svg
- Architecture/layers: Sloping attic, rain window and flower boxes.
- Props: Journal, tea, vinyl player, knitted blanket.
- Palette (base / material / light): #41343c / #ca9274 / #dbc79d.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: pencil, cup. Held props and individual limbs animate; the whole actor does not bob.

### late-night-study-boy

- Asset: public/assets/sanctuaries/late-night-study-boy.svg
- Architecture/layers: Compact dorm, elevated railway and neon windows.
- Props: Laptop, keyboard, headphones, mug.
- Palette (base / material / light): #222d45 / #a87958 / #88c7c9.
- Ambient overlay: rain; local soft light and contact shadows.
- Actor anchor: (565, 300), scale 1, within a 1000 × 660 composition.
- Action tools: type, headphones. Held props and individual limbs animate; the whole actor does not bob.

### purring-window-cat

- Asset: public/assets/sanctuaries/purring-window-cat.svg
- Architecture/layers: Glazed greenhouse, layered foliage and stone sill.
- Props: Terracotta pots, hanging planter, cushion, drifting leaf.
- Palette (base / material / light): #354b43 / #baa77b / #f6dfa1.
- Ambient overlay: motes; local soft light and contact shadows.
- Actor anchor: (545, 400), scale 1.2, within a 1000 × 660 composition.
- Action tools: paw, leaf. Held props and individual limbs animate; the whole actor does not bob.

### loyal-fireplace-dog

- Asset: public/assets/sanctuaries/loyal-fireplace-dog.svg
- Architecture/layers: Log cabin, stone chimney and snowy forest window.
- Props: Wool rug, brass kettle, firewood, stone hearth.
- Palette (base / material / light): #423029 / #b88259 / #f7c585.
- Ambient overlay: embers; local soft light and contact shadows.
- Actor anchor: (545, 400), scale 1.2, within a 1000 × 660 composition.
- Action tools: paw, ear. Held props and individual limbs animate; the whole actor does not bob.

## Files changed

- src/data/sanctuaries.ts — roster mapping and visual/action specifications.
- src/components/CharacterSanctuary.tsx — shared layered renderer, activity controller, tool callbacks.
- src/components/SanctuaryActor.tsx — authored actor silhouettes, articulated arm/pet geometry, held tools.
- src/components/CharacterSanctuary.css — responsive scene chrome, ambient movement, reduced motion.
- src/pages/WorkspacePage.tsx — scene switching, shared notebook/task dialogs, saved avatar preview, companion timeout cleanup.
- src/components/TimerWidget.tsx — keep BREAK state when pausing/resetting a rest session.
- scripts/build-sanctuaries.mjs — reproducible artwork generator.
- scripts/test-sanctuaries.mjs — real Chrome visual and integration tests.
- scripts/test-study-room.js — compare document-relative bounds so scrolling is not misreported as room movement.
- package.json — asset build hook and named test commands.
- public/assets/sanctuaries/*.svg — 19 backgrounds listed above.
- docs/sanctuaries/ — checklist, report, test results, desktop/mobile screenshots and contact sheets.
- docs/study-room/*.png — refreshed regression screenshots for the unchanged Spider-Man artwork.

## Verification

See CHECKLIST.md and results-bruce-wayne.json for the final run. The browser suite decodes every background, checks both action geometries change, captures both activities and a mobile view, checks mobile overflow/reduced motion, switches to Spider-Man and back, and verifies the old actor interval is cleared. The full integration path checks automatic activity change, simulated visibility events, all 20 selections during focus, pause/resume/reset/rest, notes across switching, task completion, music profile ownership, and saved costume ownership.

Existing core logic suite: 86 passed, 0 failed (bundled with the installed esbuild into /tmp and run with Node). Production build includes TypeScript checking. The repository has no configured lint command.

## Behavior and limitations

- These are hand-authored geometric SVG illustrations and articulated vector actors. They are simpler than Spider-Man's detailed seated rig. They are not newly painted raster sprite sheets.
- Saved dress-up customization remains visible as the player's preview below the scene; the animated sanctuary companion uses its canonical character design. A Spider-Man costume on another character no longer redirects the environment to Queens.
- Notes/tasks now use the same dialogs across all characters. Music retains the existing player and soundscape engine.
- Animations stop for reduced motion, document visibility events, rest, and unmount. Only one 180 ms actor interval is active; there is no requestAnimationFrame loop in the new renderer.
- Gesture verification covers bounded browser sessions, not an hours-long soak test. Live YouTube streaming and every outfit combination were not verified.
- Vite retains the existing large-main-bundle warning (over 500 kB); there are no missing sanctuary assets.
- No user screenshot was attached in this conversation; the existing Spider-Man renderer and its rendered screenshots supplied the benchmark.
