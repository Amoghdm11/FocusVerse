> Historical representative review. The subsequent [full-roster restoration](../all/README.md) now covers all 20 active characters.

# Representative sanctuary review — 2026-10-21

## Scope and reference

This pass refines Tony only. `SpiderStudyRoom.tsx`, `SpiderStudyRoom.css`, and `SeatedSpiderMan.tsx` remain unchanged from the committed reference. Existing timer fixes, avatar work, notes persistence, and feature callbacks have not been reverted. The other sanctuary paths still exist and are **not approved by this review**; no more characters were implemented.

The workspace already contained a previous restoration and screenshots. `tony-previous.png` preserves that starting point. It correctly reused the room chrome and furniture layering, but its flat ocean polygons and simplified armor did not have the same visual depth as Peter's skyline and sprite. The older realistic version is preserved in `../tony-before.png`.

## Exact causes

- `src/data/sanctuaryArt.json` routes the generic sanctuary renderer to independently generated room bitmaps under `public/assets/sanctuaries/illustrated/`. Tony's old bitmap uses reflective, realistic metal and cinematic lighting inconsistent with the original room.
- `IllustratedSanctuaryStage.tsx` draws the complete room before both character layers. Furniture cannot occlude the actor. Its separate image actors also ignore the selected hand-action frames and animate through whole-image scaling.
- `SanctuaryActor.tsx` supplies the missing Tony bitmap actor with a simple standing figure that does not match seated furniture or complete Iron Man armor.
- `CharacterSanctuary.css` changes the interface to Georgia headings, rounded panels, floating plus markers and a separate toolbar. These are not the original FocusVerse room controls.
- `WorkspacePage.tsx` retains its existing Tony-specific `StarkWorkshop` route, bypassing those assets and CSS for the representative. No global stylesheet or original room layout was changed in this pass.

## Corrections in this pass

- Replaced the flat vector coastline inside Tony's existing window clip with `public/assets/room/malibu-night.jpg`. The new image uses `queens-night.jpg` as the style reference, matching its indigo night palette, amber windows, illustrated cloud edges and layered scenery. Window frames and all interior objects remain independent vector layers.
- Refined the seated armor with shaded helmet planes, segmented chest and forearm plates, and articulated finger detail. Uniform scene scale and the body → workbench → hands drawing order remain intact. The helmet, chest reactor, red/gold armor and planted boots remain recognizable at mobile size.
- Retained the existing real console/music, engineering notebook/notes, task board/tasks and lamp callbacks. Both existing Tony activities remain available with reduced-motion support.
- Removed `build-sanctuaries.mjs` from the automatic prebuild hook. That hook regenerated every sanctuary during unrelated builds. The script and all source assets remain available for deliberate future work.
- Added `npm run test:sanctuary-restoration` for the existing browser verification suite, with a full-workspace screenshot and room-chrome comparison.

## Verification

Executed Chrome/Puppeteer against the running Vite application at 1440px and 390px. Visually inspected freshly captured `tony-after-1440.png`, `tony-after-390.png`, and `spider-after.png` against the original Peter screenshot. The representative now matches the reference's room rendering approach, palette treatment, outlines, character scale and retro interface. The setting remains a coastal armor workshop. This is a visual judgment, not a claim of pixel-identical artwork.

Browser checks cover actual music/notes/tasks dialogs, keyboard activation, shared notes persistence across Tony/Peter, lamp switching, both activities, animated hands, reduced motion, viewport overflow, matching header colors, and runtime errors. TypeScript and Vite production bundling pass. Vite still reports the existing large JavaScript chunk warning. Other characters and external music playback are outside this verification.

## Generated asset provenance

Built-in imagegen tool; reference: `public/assets/room/queens-night.jpg`. Final asset: `public/assets/room/malibu-night.jpg` (1000px wide JPEG). Only the generated exterior was resized/encoded; no character or UI was flattened into it.

Prompt:

> Create a new environment background asset for the SAME 2D illustrated game as the reference. Reference is STYLE ONLY. Match exactly its night-blue palette, restrained warm amber lights, crisp illustrated outlines, finely stippled/pixel-inspired painted shading, layered atmospheric depth, and quiet comic-book game scenery. New subject: Malibu Pacific coastline seen from a cliffside workshop at night. Wide landscape 3:2. Dark rocky coastal bluff and a few low coastal houses with warm windows in lower left foreground; curving shoreline receding to the right with tiny warm lights, softly illustrated surf, deep blue ocean occupying middle right, distant headlands, clouded indigo sky with a small moon in upper right. Horizon near upper third. Carefully composed natural detail comparable to the reference city. Exterior scenery ONLY, no window frame, no room, no characters, no text. Not photorealistic, no glossy 3D, no flat vector mountains. This will be placed behind the workshop's separate illustrated window mullions. Save the generated asset for project use.
