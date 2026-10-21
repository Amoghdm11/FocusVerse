# FocusVerse — Queens After Hours

Implemented in the supplied `FocusVerse-character-selection-ui` folder. This folder is an unpacked working copy without `.git`: `git branch --show-current` fails with “not a git repository.” The target branch, remote and latest upstream revision cannot be verified. No branch was created, no commit or push performed. Existing files were read before edits; originals of the four main touched components/styles were backed up under `/tmp/focusverse-before-room/`. The two referenced screenshots were not attached in this session; the written requirements supplied the visual direction.

## Design refinement — 2026-10-21

The seated companion now uses a 3px coordinate grid with angular silhouettes, stepped mask edges, larger white lenses, blue side panels, web detail and the exact red/blue palette from the selection sprite manifest. It is an articulated SVG pixel rig, not a raster sheet. Shoulder/head animation origins use the local grid coordinates. Repair, sketch, typing, eye-focus and completion animations are distinct; reduced motion and hidden-page pausing remain supported.

The room has a new title hierarchy, status pill, workbench readout, activity selector (Auto / Tinker / Sketch / Code), icon shortcuts, warmer borders and responsive spacing. Manual activities suspend automatic cycling; breaks and completion still take precedence. Automatic activity cycling retains the existing 28-second interval, including before starting the timer.

Validation for this refinement: TypeScript and production build passed (existing large-chunk warning remains); five pose exports and the room export regenerated and XML parsed. Browser suite now covers manual activity selection, but could not run: Chrome launch failed, Vite listen was denied with EPERM, and browser inventory was empty. Live layout, motion and controls remain unverified. The older implementation notes below describe the earlier design and are retained for history.

## Implementation

An original layered SVG scene with an AI-generated skyline, warm desk lighting, articulated seated Spider-Man, a computer, notebook, cork task board, shelves, plant, curtains, headphones and mug. The wide composition uses two columns (timer and room), stacking on smaller screens. Existing other-character rooms remain unchanged. Open `/#timer?char=peter-parker` with no custom appearance, or select the arachnid suit plus hero mask in the existing dressing room.

`SpiderStudyRoom` consumes the existing `TimerWidget` activity and a separate task-completion counter. Writing, typing and reading advance deterministically every 28 seconds only while FOCUSING and visible. IDLE (including pause) uses thinking; BREAK uses relaxed idle. Task completion and entering COMPLETED interrupt with a 2.2-second nod / raised hand, then return to the current timer state. Task operations no longer overwrite timer activity. All new intervals, visibility handlers, and celebration timers clean up. CSS animation handles breathing, wrist movement, page movement, rain, steam and seven dust particles; hidden pages pause those animations. Reduced motion disables animation and transitions.

`SeatedSpiderMan` uses original vector anatomy with shoulder anchors (486,353) and (546,354), elbow anchors (468,397) and (567,395), nested forearm rotations, a head anchor (516,336), and a shared seated torso and legs. Pose transitions last 1.4 seconds. This is a vector rig, not a stretched standing sprite or a raster sprite sheet. The six exported transparent SVG poses are inspection/reference exports; the app animates the source rig. No new PNG character sprites are claimed. The existing raster pack, compositor, selection and customization code were preserved. The fully masked suit conceals hair/skin; other outfits keep their existing customized renderer and room.

Computer clicks request expansion of the single existing `MusicCenter`. The YouTube player stays mounted when its panel closes, preserving its in-memory playback position and selection. Escape/outside click closes the panel; opening focuses Close and Escape/Close restores the computer focus. The existing dock remains available. Soundscape controls call the existing `audioEngine` through WorkspacePage's shared state: real rain/lofi/fire/etc., play/pause, volume and playing status. Audio starts only after user interaction. YouTube playback state uses actual player events; unavailable API playback reports an error and offers procedural soundscapes. External YouTube availability is not guaranteed.

Notebook and task board use the original NotesWidget and TodoWidget, mounted once in native dialogs, preserving their existing localStorage keys. Dialogs support focus containment, Escape and backdrop dismissal. Keyboard-accessible labeled HTML hotspots and a text shortcut row access the room tools. Lamp toggles a radial light layer. Workspace unmount stops ambience and synthesizer resources; MusicCenter retains its original player cleanup. Todo spark animation now cancels on unmount and honors reduced motion.

## Changed files

Modified:
- `src/pages/WorkspacePage.tsx` — room selection, tool dialogs, music request, soundscapes, separate completion signal, audio cleanup.
- `src/components/MusicCenter.tsx` — open request, panel focus/close behavior, soundscape slot, actual playback state and not-ready feedback.
- `src/components/TodoWidget.tsx` — completion callback, accessible completion names, spark cleanup/reduced motion.
- `src/components/NotesWidget.tsx` — accessible textarea name.

Created:
- `src/components/SpiderStudyRoom.tsx`
- `src/components/SeatedSpiderMan.tsx`
- `src/components/SpiderStudyRoom.css`
- `src/components/RoomToolPanel.tsx`
- `public/assets/room/queens-night.jpg` (1000 × 667, approximately 145 KB)
- `public/assets/characters/spiderman/study-rig/{idle,writing,typing,reading,thinking,complete}.svg`
- `scripts/export-study-room.tsx`
- `scripts/test-study-room.js`
- `docs/study-room/README.md`
- `docs/study-room/image-prompt.txt`
- `docs/study-room/room-preview.svg`
- `docs/study-room/focusverse-study-room-assets.zip`

`dist/` was rebuilt by the production build. No dependencies or package scripts were changed. `StudyEnvironment.tsx`, `SpiderManGameplaySprite.tsx`, the existing character pack, and `src/index.css` were not changed.

## Executed checks (2026-10-21)

- PASS: `npm run build` (TypeScript and Vite), rerun after implementation fixes. Vite reports an application JS chunk above 500 KB; no new dependency was added.
- PASS: all 86 existing core-logic assertions via the installed esbuild and Node. Direct `node scripts/test-core-logic.ts` initially failed because the existing source uses extensionless TS imports. Bundling resolves those imports without editing the suite.
- PASS: offline React export produced six complete transparent vector poses and a self-contained scene SVG.
- PASS: exported SVG XML, expected pose classes, image paths and ZIP contents verified.
- EXECUTED but not a behavioral test: `node scripts/test-sprite-render.js` only prints “Testing environment ready for sprite engine”.
- BLOCKED: `node scripts/test-customization-menu.js`, `node scripts/test-pokemon-intro.js`, and the new `node scripts/test-study-room.js` cannot launch Chrome in this environment.
- BLOCKED: `verify-all-views.js`, `verify-64x64-avatars.js`, `verify-pets.js` point to a Windows Edge executable unavailable on this Mac. The pets script logs that error despite exiting zero; this is NOT a pass.
- BLOCKED: Vite dev server cannot listen on 127.0.0.1:5173 (`EPERM`). Browser control also lists no available browsers. Offline Quick Look rasterization is blocked by the sandbox.

Consequently desktop/mobile visual inspection, runtime pose alignment/transitions, click/keyboard behavior, actual audio output, YouTube selection/play/pause/volume/position, session-end behavior, routing/customization persistence and browser-console/memory checks are NOT verified in a running browser. The room preview is an offline SVG render of the real scene, not an in-browser screenshot. The generated skyline was visually inspected. The new browser test is supplied for completion on a machine where the browser and server can run; it is not reported as passing.

## Run locally

```sh
npm run build
npm run dev
# In another terminal, Chrome installed (override CHROME_PATH if needed):
node scripts/test-study-room.js
node scripts/test-customization-menu.js
node scripts/test-pokemon-intro.js
```

The new suite checks scene presence, timer-driven working poses, task reaction, pause, actual AudioContext startup, soundscape selection, panel reopening, notebook persistence, lamp, responsive overflow and reduced motion. It captures `desktop.png` and `mobile.png` when runnable. It shortens only the 28-second companion dwell to four seconds in its isolated test page, not the productivity timer. Manually verify YouTube playback, countdown completion, stopwatch, all outfits and console after running it.

Core suite and vector exports (no added dependencies):

```sh
./node_modules/.bin/esbuild scripts/test-core-logic.ts --bundle --platform=node --format=esm --outfile=/tmp/focusverse-core-tests.mjs
node /tmp/focusverse-core-tests.mjs
./node_modules/.bin/esbuild scripts/export-study-room.tsx --bundle --platform=node --format=cjs --loader:.css=empty --define:import.meta.env.BASE_URL='""' --outfile=/tmp/export-study-room.cjs
node /tmp/export-study-room.cjs
```

## Assets and provenance

The built-in image-generation tool created the skyline. Its full prompt is in `image-prompt.txt`; the generated source was resized and encoded as an opaque JPEG. All interior vector artwork and the seated rig were authored in code. No external reference image was copied. The ZIP contains only these new assets, their source components, export/test scripts and documentation, excluding secrets, environment files, dependencies and repository copies. The preview embeds its skyline and styles and can be opened directly in a browser.
