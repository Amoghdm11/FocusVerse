# Sanctuary implementation / evidence

## Audit
React 18 + TypeScript + Vite; SVG scene rendering; Tailwind/global CSS. The canonical roster is `src/data/characters.ts`. Existing PNG portraits live in `public/avatars`. They contain no articulated action frames. Spider-Man has separate gameplay sheets and a hand-authored seated SVG rig. Its room is `SpiderStudyRoom.tsx`; keep this renderer and its artwork intact. Other characters previously shared `StudyEnvironment.tsx` and a whole-image bob.

Workspace owns timer action, audio, notes/tasks and selection callbacks. App owns selected character and customization ownership. Sanctuary state must be keyed by character without remounting TimerWidget. Existing sound profiles stay in Workspace. New artwork will be local, authored SVG with separate foreground rigs, articulated arms and held tools, not runtime generated media.

## Phases
- [x] A: shared renderer, 20-character mapping, Spider-Man regression
- [x] B1: Batman, Tony, Miles, Gwen
- [x] B2: Naruto, Gojo, Levi, L
- [x] B3: Elsa, Rapunzel, Moana, Hermione
- [x] B4: Wednesday, Officer K, Neo
- [x] B5: Study Girl, Study Boy, Cat, Dog
- [x] C: each scene inspected, both actions played, switch roundtrip, mobile, reduced motion
- [x] D: production build and existing feature regression

All five batches were rendered and reviewed before moving to the next batch. Final designs and action descriptions are in `src/data/sanctuaries.ts`; the complete manifest and limitations are in `IMPLEMENTATION.md`.

## Final evidence (2026-10-21)

- Chrome suite: all 19 new scenes; two action screenshots and one 390px mobile screenshot each (57 captures). Each background decoded, both actions changed articulated geometry, reduced motion froze frames, no horizontal mobile overflow, selection roundtrip reset action state, old actor interval count returned to zero. No page exceptions or sanctuary HTTP errors.
- Desktop and mobile contact sheets inspected: `contact-0.jpg`, `contact-mobile.jpg`. Individual images were inspected during each batch. Corrections included Batman’s cowl, Gwen’s stick reach, Tony’s projected armor, Miles’s painting target, Levi’s polishing cloth, L’s perch, Moana’s navigation crate, Elsa’s lectern, Study Boy’s laptop, and pets’ lifted forelegs.
- Full integration: all 20 characters switched while timer remained running; pause, resume, reset, rest, auto activity, simulated hidden-document cleanup, notebook persistence across switching, task completion, music profile switching, saved costume ownership, and controlled-clock session completion passed.
- Spider-Man regression: all six work poses, task reaction, timer pause, real AudioContext, music dialog behavior, notebook persistence, lamp, mobile overflow, reduced motion passed. Existing Spider-Man scene/art source unchanged.
- Existing core suite: 86 passed, 0 failed.
- `npm run build`: passed (TypeScript + Vite); existing >500 kB main chunk warning remains.
- `git diff --check`: passed. No lint script is configured.

## Scope of visual sign-off

Distinct local artwork, theme, alignment, visible actions, switching, and responsive usability were inspected for every character. The new art is a simpler geometric vector style than Spider-Man’s bespoke seated scene. This evidence does not establish equal artistic detail or an hours-long performance soak. Saved custom costumes remain a separate preview rather than driving the canonical animated actor. Live YouTube streams and all outfit combinations were not tested.
