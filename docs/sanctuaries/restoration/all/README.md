# Full-roster FocusVerse art restoration

The active roster contains 20 characters. Peter's original room and Tony's reviewed workshop are preserved. All other 18 characters now use the same layered illustration approach and original room controls. No character remains on the realistic-room/overlaid-bitmap-actor rendering path.

## What changed

`CharacterSanctuary.tsx` now uses the original `SpiderStudyRoom.css` chrome: square dark-purple panels, compact pixel typography, cyan status accents, gold selected controls, existing object hover/focus behavior and existing feature callbacks. `CharacterSanctuary.css` now contains only responsive scene behavior, hit-target adjustments, and ambient motion. Georgia headings, rounded cards, floating plus markers and the extra object toolbar are gone from active sanctuaries.

`SanctuaryActor.tsx` and `SanctuaryCostumeDetails.tsx` retain the editable vector actors and correct their proportions, seated legs, skirt folds, masks, hair, costume landmarks and articulated hands. A single uniform transform places each actor in the same 1000 × 660 scene coordinate space. Body and furniture draw before hands and held tools; no full-sprite stretching is used. Pets have separate anatomy and scale. Standing scenes retain standing poses. Wednesday has a side desk and a separate cello position.

`SanctuaryRoomObjects.tsx` draws the themed music/notes/tasks props and supplies their hit regions from the same coordinate definitions. Objects open the existing MusicCenter, NotesWidget and TodoWidget through WorkspacePage's existing callbacks. Existing evidence/planning boards are reused where present. The original footer shortcuts remain accessible on mobile.

`scripts/build-sanctuaries.mjs` preserves the individual vector architecture and adds matching illustrated exterior layers, quieter wall shading and warm ambient depth. It is an explicit command (`npm run build:sanctuary-rooms`), not a build-time generator. Eight exterior assets were generated with the built-in imagegen tool using Peter's `queens-night.jpg` as the style reference. They live in `public/assets/room/`; exact prompts and paths are recorded in `asset-prompts.json`. No generated character cutouts are used. Prior bitmap assets and the inactive renderer are retained on disk, but are not imported by the active sanctuary component.

## Individual settings and actions

| Character | Setting | Actions |
| --- | --- | --- |
| Batman | Cavern reservoir and command platform | Sonar scan; grapnel calibration |
| Miles Morales | Brooklyn rooftop, mural and water tower | Spray painting; venom charge |
| Gwen Stacy | Arched-window rehearsal loft and drum kit | Snare practice; cymbal accents |
| Naruto | Timber veranda above the Hidden Leaf village | Sealing scroll; Rasengan |
| Gojo | Temple colonnade and barrier garden | Limitless energy; blindfold adjustment |
| Levi | Stone Scout quarters and blade rack | Blade polishing; tea |
| L | Rainy surveillance suite and evidence board | Case notes; sugar cube |
| Elsa | Ice observatory and aurora mountains | Snow crystal; ice ribbon |
| Rapunzel | Tower atelier, easel and lantern valley | Sun painting; paper lantern |
| Moana | Canoe deck, sail and tropical night ocean | Star navigation; paddle |
| Hermione | Gothic library and grimoire | Annotation; page levitation |
| Wednesday | Ophelia Hall, side writing desk and cello | Typewriter; cello bow |
| Officer K | Amber Los Angeles hangar and spinner | Memory scanner; wooden horse |
| Neo | Ribbed operator deck and phosphor terminals | Decoding; spoon bending |
| Cozy study girl | Rainy attic, vinyl player and blankets | Journaling; tea |
| Late-night study boy | Tokyo dorm and elevated railway view | Keyboard work; headphones |
| Cat | Glazed greenhouse and planted window sill | Paw washing; following a leaf |
| Dog | Log cabin, snowy window and stone hearth | Offering a paw; listening |

## Verification and review

Actual Chrome/Puppeteer renders are saved at desktop width 1440 and mobile width 390. Each restored character has two activity screenshots and a mobile screenshot. `index.html` links to all captures; `comparison-1.jpg` through `comparison-3.jpg` show the desktop roster. `review-1-*.jpg` show the second activities; `review-mobile-*.jpg` show mobile layouts. These are screenshots of the running application, not design mockups.

Reviewed both activities and mobile renders for every character against Peter's original room. Corrections from that review included continuous window views, quieter wall lighting, seated costume folds, themed footwear/masks, Moana's deck instead of a generic rug, Wednesday's cello/desk separation, mounted lamps, and distinct Tokyo/Los Angeles exteriors. Visual consistency is a design judgment; the automated checks below verify behavior rather than artistic quality.

Passing checks:

- `node scripts/test-sanctuary-roster.mjs`: all 18 restored scenes; decoded room assets; original header typography/colors; both activities; desktop/mobile rendering without horizontal overflow; real scene-object music/notes/tasks integration; shared notes persistence; keyboard activation; light switching; articulated motion; reduced-motion freezing; all-20 timer continuity; break-state activity suspension; no page runtime errors.
- `node scripts/test-sanctuary-restoration.mjs`: Peter/Tony integration and screenshots, including shared notes and keyboard access.
- `npx tsc --noEmit` and `npx vite build`: type checking and production bundling. Vite retains the existing >500 KB application chunk warning.
- `git diff --exit-code HEAD -- src/components/SpiderStudyRoom.tsx src/components/SpiderStudyRoom.css src/components/SeatedSpiderMan.tsx`: original reference components unchanged.

`npm run test:sanctuaries` runs both browser suites. `node scripts/review-sanctuary-screenshots.mjs` rebuilds the contact sheets from saved captures. External YouTube playback availability is not asserted; opening the existing music library is verified. No unrelated avatar/customization, timer fixes or notes storage changes were reverted.
