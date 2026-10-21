# Spider-Man consistency and workspace audit — 2026-10-21

## Scope and evidence

Changes were made in the supplied local workspace. It has no `.git` metadata, so the remote branch was not verified and nothing was committed or pushed. The two referenced attachments were not available in the conversation. The written design requirements guided these changes; visual agreement with the reference sheet is **not verified**.

## Repository checklist

| Surface / component | Implementation result | Verification |
| --- | --- | --- |
| Selection / customization: `SpiderManCustomizationMenu`, `FullBodyPixelSprite` | Full masked classic suit uses generated shared 64×96 design; saved loadout no longer reset on entry | Build only; browser blocked |
| Suit options: `pixelSpriteCompositor` | Unmasked arachnid suit has matching red/blue, black emblem and web lines; other clothing remains available | Source audit only; alternative outfits still use the legacy anatomical compositor |
| Roster and intro portraits: `PixelFaceAvatar`, `PokemonIntroSelect`, `CharacterInfoPanel` | Peter's portrait comes from the shared mask | Generated asset checks; no screenshot verification |
| Generic full-body avatar: `PixelCharacterSprite` | Peter uses the same shared standing design | Build and asset checks |
| Navigation / carousel icons: `PixelEmblems`, `CharacterCarousel` | Classic spider icon reuses shared emblem | Build only |
| Tutors: `TutorsView` | Peter's independent voxel model replaced with keyboard-accessible front/left/back/right design views; other tutors retain 3D | Build only |
| Generic room: `StudyEnvironment`, `SpiderManGameplaySprite` | Directional frames use the shared design and existing timing; same 64×96 frame canvas | Assets checked; walking input unverified |
| Workshop: `SpiderStudyRoom`, `SeatedSpiderMan` | Shared mask, emblem, palette; smaller head; body behind desktop and working arms/hands above it | Offline React SVG export; visual placement unverified |
| Workshop activities | Idle, repair, sketch, type, read, write, think, complete; reduced-motion CSS preserved | Compiled; browser animation checks blocked |
| Transition: `PixelTransitionOverlay` | No independent Spider-Man drawing found; preview uses shared design before transition | Source audit |
| Selection persistence: `App` | Saved character used across routes; appearance associated with its owner so quick-switching does not transfer another character's costume | Build only; reload flow unverified |
| Music: `MusicCenter`, `WorkspacePage` | Computer and header open the existing player; persistent player remains mounted when closed; panel is in document flow; soundscapes, synth, mute preserved | Build and audio data logic tests; live playback unverified |
| Room layout / hotspots | Scene and percentage targets share 1000:660 aspect; smaller mobile target minimum avoids overlapping props; 44px shortcut alternatives remain | CSS/source audit; desktop/mobile clipping unverified |
| Notes / tasks / timer | Existing widgets retained; core data logic passes | Browser controls unverified |

`SpiderManDesign.tsx` is the authored source for mask, emblem, palette, standing/side/back geometry. `npm run build` regenerates 29 static SVGs through `scripts/build-spiderman-design.js`; no server-rendering library is added to the browser bundle. Old PNG packs remain as legacy files, but the migrated runtime entry points no longer load those designs. Their old manifest supplies gameplay timing only.

## Actual checks

- `npm run build`: PASS, including TypeScript and asset regeneration. Vite still warns about a JS chunk larger than 500 kB.
- Core suite bundled with esbuild for Node (the original direct TS invocation cannot resolve extensionless imports): **86 passed, 0 failed**.
- `node scripts/test-spiderman-design.js`: PASS, 29 SVG files, dimensions, palette, directional lenses and distinct walk frames. A first run caught duplicate adjacent stride values; explicit stride steps fixed that failure.
- `node scripts/test-sprite-render.js`: ran successfully, but this file only prints a readiness message and is not a rendering test.
- `node scripts/test-study-room.js`, `node scripts/test-customization-menu.js`, `node scripts/test-pokemon-intro.js`: BLOCKED before any assertions because Chrome could not launch.
- `node scripts/verify-all-views.js`: BLOCKED by its hardcoded Windows Edge executable path on this macOS workspace.
- Vite server: BLOCKED with `listen EPERM` at `127.0.0.1:5173`.
- `scripts/export-study-room.tsx`: exported eight transparent pose SVGs and `docs/study-room/room-preview.svg`. These are offline React markup exports, **not browser screenshots**.

## Remaining acceptance work

Reattach the two references and run the browser suites in an environment that permits localhost and Chrome. Compare front/side/back anatomy, every alternate outfit, seated hand/prop alignment, all activity motions, small viewport overflow, keyboard focus, navigation, timer controls, notes/tasks persistence and actual YouTube/soundscape playback. The shared classic identity is implemented, but alternate-outfit anatomy and selected-appearance propagation into static roster portraits remain legacy behavior and need further alignment before claiming every appearance is unified.
