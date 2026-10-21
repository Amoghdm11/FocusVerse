# FocusVerse Spider-Man Sprite Pack

Original hand-authored raster pixel art, using FireRed/Emerald proportions and simplified shading as technique references. No game pixels copied. The built-in image generator returned an output moderation error and produced no image; these production assets were drawn deterministically with Pillow. No detailed high-resolution version is claimed.

## Assets
- preview/spiderman-64x96.png: complete transparent full-body costume.
- layers/mask.png and suit.png: aligned 64 x 96, nonoverlapping; composite to reconstruct preview exactly.
- frames/: six 32 x 48 RGBA PNGs per animation, 36 total.
- gameplay/: six horizontal 192 x 48 sheets, ordered left to right.
- manifest/animations.json: real relative paths (relative to pack root), timings and anchor (16,45), looping.
- manifest/palette.json: 15-color RGB palette; transparency is binary.
- previews/: solid-background JPEG overview, large preview, six animation contact strips, full contact sheet; six animated GIFs.

Idle: 6 x 240ms. Walk down/up/left/right: 6 x 120ms each. Study: 6 x 180ms. Breathing uses a one-pixel upper-body shift, feet anchored; walking articulates opposing limbs; study uses an open book and writing hand. Gameplay is independently drawn, not a reduced preview. Side views are intentionally compact three-quarter poses; right mirrors left.

## Integration
The existing 64 x 96 compositor accepts this complete costume only for arachnid-suit + hero-mask. Peter Parker defaults to this combination. Hair, skin and gender are concealed by the full mask and suit; choose other gear to return to the existing unmasked procedural character. Other costumes and accessories retain their existing pipeline. Selection, reset, randomize, routes and localStorage remain in the app's existing flow.

Workspace uses the small sprite for this costume. FOCUSING selects study, otherwise idle. Hold directional buttons or arrow keys while the companion is focused for walking; release returns to timer state. Movement is bounded inside the companion stage. Existing timer, tasks, notes and audio are preserved.

Run npm run dev, choose Peter Parker, reset his preset, lock in appearance. Focus the companion to use arrow keys. A standalone review page is at /assets/characters/spiderman/review.html. Integer scaling and image-rendering: pixelated are used.

## Verification in the authoring environment
Production build (TypeScript + Vite) passed. Asset checks passed, including every frame, binary alpha, margins, sheet equality, exact layer reconstruction and ZIP contents. Preview contact sheet visually inspected. The existing customization Puppeteer suite and new sprite integration suite were attempted but Chrome could not launch. Vite dev server could not bind localhost:5173 (EPERM). In-app animation, transition and persistence checks therefore remain unverified; run the browser suites locally. No lint script is configured.

## Rebuild and validate
python3 scripts/build-spiderman-pack.py (requires Pillow)
npm run build
node scripts/test-customization-menu.js
node scripts/test-spiderman-pack.js
python3 scripts/verify-spiderman-assets.py
The pack script writes the actual PNG/JPEG/GIF assets and ZIP. ZIP includes this README and manifest. Asset provenance: hand-authored pixel polygons, not AI-generated output.

Technique references:
https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/52432/page-1/
https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/8330/
