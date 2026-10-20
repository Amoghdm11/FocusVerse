# CHANGELOG // FocusVerse Character Selection Redesign

## [v2.0.0] - Minecraft Bedrock / Pocket Edition Dressing Room Redesign

### Summary of Transition
* **Previous Design (v1.0.0):**
  * A 20-card rectangular grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  * Each character card occupied equal visual weight with small pixel icons, requiring excessive scrolling and lacking a focal companion hero presentation.
* **New Design (v2.0.0):**
  * Inspired by the **Minecraft Pocket Edition / Bedrock Edition Dressing Room**.
  * Replaces the static card-heavy grid with a 3-part layout:
    1. **Large Central 3D Voxel Stage:** An articulated 3D voxel figure on an obsidian rune pedestal with drag-to-rotate interaction, idle animations, dynamic multi-light shading, and zoom controls.
    2. **Horizontal Companion Roster Strip:** A sleek, touch/keyboard/mouse friendly carousel strip positioned along the bottom with automatic smooth centering, active selection highlight, and arrow step buttons.
    3. **Compact Character Information Panel:** A dedicated side panel displaying companion lore, personality quote, acoustic and FX telemetry, audio frequency sample player, and the primary `[ STUDY WITH THIS COMPANION ▶ ]` action button.

### Components Added & Modified
1. **Added `src/components/CharacterVoxelStage.tsx`:**
   * Genuine Three.js 3D WebGL stage.
   * Procedural canvas pixel textures with `THREE.NearestFilter`.
   * Articulated biped rig (head, hair, torso, arms, legs, capes, accessories) and quadruped rig for feline/canine companions.
   * Drag-to-rotate pointer handling with angular inertia and auto-spin mode.
   * Clean resource disposal on unmount to prevent GPU memory leaks.
2. **Added `src/components/CharacterCarousel.tsx`:**
   * Horizontally scrollable strip displaying all 20 character tiles.
   * Auto-scroll centering via `container.scrollTo` preventing unintended window displacement.
   * Arrow key keyboard listeners (`ArrowLeft` / `ArrowRight`).
3. **Added `src/components/CharacterInfoPanel.tsx`:**
   * Dynamic character telemetry, palette color swatches, favorite button, and Web Audio sample trigger.
   * Prominent primary button directly wired to `onSelectCharacter`.
4. **Refactored `src/pages/SelectPage.tsx`:**
   * Removed the 4-column card grid.
   * Integrated the 3D stage, information panel, and bottom carousel strip.
   * Added `[ 🎲 RANDOM ]` companion generator.
   * Preserved full category filtering, search input, and safe mode switching.
5. **Updated `src/App.tsx`:**
   * Enabled bi-directional synchronization between the selected companion on the 3D dressing stage and the persistent bottom live code execution bar (`AudioCodeFooter`).
   * Supported direct hash navigation with companion parameter (e.g. `/#select?char=bruce-wayne`).
