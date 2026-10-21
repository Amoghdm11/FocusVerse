> Historical representative review. The subsequent [full-roster restoration](all/README.md) now covers all 20 active characters.

# FocusVerse art restoration — representative scene

Scope: Tony Stark only. Other sanctuary implementations and their assets are retained pending a separate visual review. No blanket reset or asset regeneration was performed.

## Reference and diagnosis

The committed `SpiderStudyRoom.tsx` and `SpiderStudyRoom.css` are still unchanged from c641973. Their rendered room is the reference (`spider-original.png`): angular, outlined furniture; warm gradients; seated character behind the desk with hands in front; 1000 × 660 scene coordinates; dark purple, square borders, Silkscreen headings, cyan/gold accents.

The previous Tony rendering (`tony-before.png`) diverged in specific places:

- `src/data/sanctuaryArt.json` selected `public/assets/sanctuaries/illustrated/tony-stark-room.webp`, a realistic metallic interior with reflections and dense cinematic lighting. Its material treatment does not match Peter's outlined furniture.
- That manifest has no Tony actor. `IllustratedSanctuaryStage.tsx` therefore placed the generic `SanctuaryActor` fallback over the complete bitmap. Both body and hands were drawn after the entire room, so the foreground bench could never occlude the character. The character appeared to stand on the foreground furniture.
- The fallback actor's straight legs, broad helmet, and plain trousers did not match the reference's seated proportions or Iron Man's armor.
- `CharacterSanctuary.css` introduced Georgia headings, rounded borders, blue-gray panels, floating circular plus markers, and an additional object toolbar. These replaced the established compact retro room chrome.
- For bitmap actors elsewhere, `IllustratedSanctuaryStage.tsx` ignores activity frames and uses the same full-image breathing scale. This cannot depict character-specific hand actions and must be addressed before approving those scenes.
- `WorkspacePage.tsx` already contained wider sanctuary routing and changes to tool placement. Those pre-existing changes, saved-avatar display, timer fixes, and notes/task integration were preserved. This restoration adds only a Tony-specific branch and import.

## Representative correction

`StarkWorkshop.tsx` replaces the active Tony rendering with a layered SVG environment. It reuses Peter's existing CSS classes directly. `StarkWorkshop.css` contains only Tony's object regions and focus treatment; it does not override the original theme.

The composition preserves Peter's camera and deliberate proportions: character rig translated to (480,262), uniformly scaled by 3; desktop at y=444–506; feet near y=577. Drawing order is room → chair → body → bench and reactor → articulated arms → lamp lighting → foreground trolley. The environment varies through ocean glazing, a recessed armor bay, engineering shelves, a service cabinet and trolley. Gold/red armor plates, helmet eye slits and a chest reactor replace the generic fallback figure.

Two activities use small wrist movements with fixed shoulders/elbows and planted feet. No whole-sprite stretching is used. Reduced motion, hidden tabs, and breaks freeze the motion. Console, notebook and build board call the existing music/notes/tasks handlers, with the original footer shortcuts retained.

## Actual browser verification

Ran Chrome via Puppeteer against Vite at 1440px and 390px. Visually inspected the original Peter screenshot, old Tony screenshot, corrected desktop and mobile screenshots, and refined the backdrop and armor alcove after the first comparison. The corrected representative matches the reference's interface, room scale, outline treatment, layering and warm task light. Its ocean exterior is simpler than Peter's detailed skyline; no claim is made that the remaining characters pass this review.

`node scripts/test-sanctuary-restoration.mjs` passed:

- Both viewport screenshots and no horizontal overflow.
- Console opens the real music player with Space.
- Notebook opens the real notes dialog with Enter.
- Notes persist between Tony and Peter.
- Task board opens the existing task dialog.
- Lamp toggle and activity selection work.
- Hands animate; reduced motion freezes their geometry.
- Peter's computer and notebook still work.
- No browser runtime errors.

`npx tsc --noEmit` passed. `npx vite build` verifies production bundling without invoking the unrelated asset-generation prebuild hook.

Screenshots: `spider-original.png`, `tony-before.png`, `tony-after-1440.png`, `tony-after-390.png`, `tony-diagnostics.png`, `spider-after.png`. Machine-readable results: `checks.json`.
