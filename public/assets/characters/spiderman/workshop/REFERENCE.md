# FocusVerse Spider-Man Sprite Pack

Original pixel-art Spider-Man made for FocusVerse (`charchter-selection-ui` branch). The style follows the Pokémon FireRed/LeafGreen hero sheet you supplied: hard pixel edges, GBA-style tinted outlines (each colour region is outlined in the darkest step of its own colour), light from above and a limited palette. That sheet was used as a style reference only. Nothing was extracted, traced or copied from it, and it is not included in this pack. Every pixel came from the generator in `source/`.

* **Production assets:** transparent PNGs (RGBA, alpha is only 0 or 255, no anti-aliasing).
* **Previews:** JPEGs and GIFs on a solid slate background. They are for viewing only and should not be used as sprites.

## What is inside

| Path | Native size | Purpose |
|---|---|---|
| `sprites/large/spiderman_fullbody.png` | 128 × 192 | Detailed customization-screen sprite. It was drawn at this size, not upscaled. |
| `sprites/large/spiderman_fullbody_64x96.png` | 64 × 96 | The same costume at compositor resolution (identical to idle frame 0) |
| `sprites/gameplay/spiderman_<state>.png` | 384 × 96 | Sprite sheet: 6 frames of 64 × 96, laid out left to right |
| `sprites/gameplay/spiderman_all_states.png` | 384 × 576 | Atlas with 6 rows (idle, walk_down, walk_up, walk_left, walk_right, study) and 6 columns |
| `frames/<state>/spiderman_<state>_00..05.png` | 64 × 96 | Individual frames |
| `sprites/overworld/spiderman_ow_<state>.png` | 96 × 32 | **Compact FireRed-scale overworld** sheet: 6 frames of 16 × 32 (idle, walk_down, walk_up, walk_left, walk_right) |
| `frames/overworld_<state>/` | 16 × 32 | Individual overworld frames |
| `sprites/props/spiderman_study_{desk,laptop,stool}.png` | 64 × 96 | Separate study props on the same canvas and anchor as the study frames |
| `sprites/props/spiderman_study_scene_composited.png` | 384 × 96 | Convenience strip with the props and study frames already composited |
| `layers/64x96/`, `layers/128x192/` | 64 × 96 / 128 × 192 | Customization layers (see below) |
| `variants/black_suit/` | same as above | Black-suit palette variant of the large sprite and all 36 gameplay frames |
| `preview/` | — | `spiderman_preview.jpg`, `animation_contact_sheet.jpg`, `asset_overview.jpg`, one `contact_<state>.jpg` per state, `anim_<state>.gif`, palette reference |
| `manifest/animation_manifest.json` | — | Machine-readable metadata covering paths, sizes, frame order, timing, anchors, palette and layers |
| `source/` | — | Python + Pillow generator used to produce every file (`python3 export.py <outdir>`) |

## Animations (gameplay sprite, 64 × 96 per frame)

The anchor is the bottom centre **(32, 90)**, and the feet rest on row 90 in every state. In the front and back walks the stepping foot moves ±1 px to show depth (row 89 to 91), which is normal for top-down overworld sprites.

| State | Frames | ms / frame | Loop | Description |
|---|---|---|---|---|
| idle | 6 | 150 | yes | Red-style trainer stance (slight 3/4 turn, wide legs, fists). The chest and arms rise 1 px, the head follows a frame later, and the feet stay fixed. |
| walk_down | 6 | 100 | yes | Front view. Alternating stride with a 4 px foot lift, a 1 px bob on the passing frames and opposite arm swing. |
| walk_up | 6 | 100 | yes | Back view with the back emblem. Same timing as walk_down. |
| walk_left | 6 | 100 | yes | Side profile with a contact, down and passing cycle. The far arm and leg are drawn darker. |
| walk_right | 6 | 100 | yes | Built from the same rig as walk_left, but the light still comes from the top-left. It is not a mirrored copy, so the highlight stays on the correct side. |
| study | 6 | 200 | yes | Seated and typing on a laptop, facing left. Alternating finger taps, a 1 px nod and a focused lens squint on frame 4. |

**Slicing:** frame `i` of a strip is the rectangle `x = i*64, y = 0, w = 64, h = 96`. In the atlas, frame `i` of row `r` is at `x = i*64, y = r*96`.

**Selecting a state:** use `idle` while the character stands still and `walk_<dir>` while it moves in that direction. Use `study` while a focus timer runs at the desk; if you draw the props separately, draw them first. When the character stops, reset the frame index to 0.

## Compact overworld sprite (16 × 32 per frame)

This is a separate set placed pixel by pixel at FireRed overworld scale, about a 15 × 24 figure with a big head. It is a redesign rather than a shrunk copy. The anchor is **(8, 29)**. In the front and back walks the stepping foot drops to row 30.

| State | Frames | ms / frame | Description |
|---|---|---|---|
| idle | 6 | 200 | Standing, with a 1 px breathing dip on frames 3–4 |
| walk_down / walk_up | 6 | 120 | Stand, lift, plant with a dip, then the same again on the other foot. The arms swing opposite the legs. |
| walk_right | 6 | 120 | Stand, half stride, full stride with a dip. The near and far legs swap shading. |
| walk_left | 6 | 120 | The walk_right art laid out mirrored |

The overworld set is lit from directly above, like GBA overworld sprites, and the suit is symmetric, so the mirrored walk_left has no wrong-side highlight or broken costume detail. There is no study animation at this scale; use the 64 × 96 study set for that. The figure is 15 px wide in a 16 px frame, so it touches the frame's side edge on purpose. It is not clipped.

## Large customization sprite

* Both full-body sprites use the stance of the GBA FireRed hero's full-body trainer sprite: body turned slightly toward the viewer's left, wide A-stance with the feet angled out, elbows a little away from the body and fists closed. The walk and study frames keep straight front, back and side views.
* `spiderman_fullbody.png` is 128 × 192 and anchored at (64, 186). Show it at **2× (384 px tall)** or 3× (576 px). For the current ~430 px slot, show it at 2× and pad, or accept uneven pixels at 2.25×.
* `spiderman_fullbody_64x96.png` is the 64 × 96 version. At 4.5× (432 px) it matches what `FullBodyPixelSprite size={430}` does today. Pixels will look sharpest at 4× (384 px).

Always use nearest-neighbour scaling:

```css
canvas, img.sprite { image-rendering: pixelated; image-rendering: crisp-edges; }
```

```ts
ctx.imageSmoothingEnabled = false;
```

## Layers (customization system)

Both sizes come in the same layer set. Every layer uses the full canvas, so you composite them at (0, 0) in this order:

1. `01_aura_spider_sense`: optional, maps to accessory `flow-aura` (yellow spider-sense lines)
2. `02_body_base`: the blue under-suit silhouette with its contour
3. `03_suit_details`: red panels, black trim, webbing and chest emblem (outfit `arachnid-suit`)
4. `04_head_mask_base`: the plain red mask silhouette. Spider-Man is masked, so there are no hair layers. Draw this after the body because the head overlaps the neck.
5. `05_mask_details`: eye lenses and mask webbing
6. `06_accessory_headphones`: optional, maps to accessory `headphones`

Compositing layers 2 to 5 reproduces `spiderman_fullbody.png` and idle frame 0 **pixel for pixel**. The export script checks this, and the manifest records it as `recompositesExactly: true`.

Mapping to the eight compositor passes: aura goes to pass 1, the head silhouette replaces pass 2 (back hair), the body base is pass 3, mask details are pass 4, the suit is pass 5, pass 6 (front hair) is not used, headphones are pass 7, and pass 8 (contour) is **already baked in**. If these pixels still go through `applyArcadeContour()`, it adds a second outline 1 px outside the first, so draw the PNGs after that pass or skip it for this character.

The layers match the **front idle pose**. The walking and study frames are complete sprites rather than layered ones, because the accessory overlays would need per-frame redrawing to follow the head.

## Suit variants

* **Classic red and blue (`arachnid-suit`)**: complete, covering the large sprite, every frame, the layers and the props.
* **Black suit**: complete for the large sprite, the 64 × 96 sprite and all 36 gameplay frames. It is a palette variant only and has no separate layers.
* **Not made**: `study-hoodie`, `cyber-ronin`, `stealth-ops`, `retro-arcade` and `scholar-blazer`. The existing compositor keeps drawing those, and this pack does not replace them.

## Integration steps for FocusVerse

What I checked: I read `src/utils/pixelSpriteCompositor.ts` and `src/components/FullBodyPixelSprite.tsx` on `charchter-selection-ui`. They use a 64 × 96 canvas with the feet near y 90, have six outfits and five accessories, and add a contour in pass 8. This pack uses the same canvas, ground row and accessory names. Its proportions follow Red's trainer sprite rather than the compositor's chibi body: Spider-Man is about 5 heads tall, with the head at y 12–29 on the 64 × 96 canvas and y 24–52 on the 128 × 192 one. So if you mix these PNGs with compositor-drawn characters, he will look taller and leaner than they do. **I did not change any repository code.** The remaining work:

1. Copy the pack into the app, for example `public/sprites/spiderman/`.
2. **Customization preview:** when `outfit === 'arachnid-suit'` (or a dedicated Spider-Man character is selected), draw `spiderman_fullbody.png` with `imageRendering: 'pixelated'` in place of the composited buffer. You can also `drawImage` the 64 × 96 layers into the existing canvas after the compositor runs, and pick layers 01 and 06 from `appearance.accessory`.
3. **Workspace / gameplay:** add a small sprite-sheet player that reads `manifest/animation_manifest.json`, then sets `frame = Math.floor(t / frameDurationMs) % frameCount` and calls `ctx.drawImage(sheet, frame*64, 0, 64, 96, x - 32*scale, y - 90*scale, 64*scale, 96*scale)`.
4. Choose the state from your movement or focus state, as described above.
5. Optionally extend `scripts/test-customization-menu.js` (Puppeteer) to screenshot the new sprite.

## Palette

The full list is in `preview/palette_reference.jpg` and under `palette` in the manifest. The suit uses 4-step ramps for red and blue (`R0`–`R3`, `B0`–`B3`), three lens whites, and tinted contours: the red areas use `R3`, the blue areas `B3`, and the lenses, emblem and anything near-black use `K` (`#161020`). The emblem has its own index `E` so that variants can recolor it. The props use wood (`D*`), steel (`G*`) and screen-glow (`C*`) ramps, and the aura uses yellow (`Y*`).
