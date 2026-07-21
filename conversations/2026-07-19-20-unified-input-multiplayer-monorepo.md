# Session Archive: Unified Input, Multiplayer Overhaul, Flying Monkeys, Monorepo Port

**Dates:** 2026-07-19 — 2026-07-20
**Projects:** ca-patrouch (patrouch.ca), dev-ambientx/WebXR (monorepo)
**Duration:** ~10 hours across two days (yesterday's session was cut off at 5 hours)

---

## Day 1 (2026-07-19) — Input Unification, Meshopt, and the TDZ Rabbit Hole

### The morning: Flowerbed interop review

Started by comparing our ECS implementation against Project Flowerbed's key concepts using the web reader. The comparison revealed two high-impact divergences:

1. **Unified desktop/VR code path** — our locomotion code branched on `world.session` everywhere. Flowerbed's approach: map keyboard/mouse to the same controller API so gameplay code never branches.
2. **Controller input abstraction** — manual `_triggerPrev` edge detection scattered across three systems. Flowerbed has a clean `ControllerInterface` with edge detection built in.

### InputAdapter + unified LocomotionSystem

Built `src/lib/portals-ecs/input-adapter.js` — an `InlineGamepad` class that mirrors IWSDK's `StatefulGamepad` API (`getButtonDown`, `getAxesEnteringState`, etc.) backed by keyboard/mouse/touch. The `InputAdapter` switches between real XR gamepads and inline gamepads automatically. The refactored `locomotion-system.js` went from 603 → 524 lines, eliminating the duplicated inline/XR paths.

Key learning: we can't use the "pure" Flowerbed approach (auto-grant IWER session on desktop) because IWER is dev-only. Production desktop visitors have no headset. The adapter abstracts over both real gamepads AND keyboard/mouse — the only session branch left is the rig target (`world.player` vs `world.camera`).

### MeshoptDecoder wiring

Wired `MeshoptDecoder` into all 5 GLTFLoader sites (GlbPreview, environments, oz-world, grab-demo, network-system). This was the prerequisite for the compression pipeline — without the decoder at every load site, compressed GLBs would silently fail to render.

### Client-side GLB compression

Added meshopt compression to the admin upload UI in 02-ca-patrouch. Chose meshopt over Draco because **Draco corrupts morph targets** — essential for animated Monster Mash exports. The admin uploads a 16MB animated GLB, the browser compresses it to ~1.6MB before sending to R2. Zero Worker bundle bloat.

### The TDZ rabbit hole

The grab-demo kept failing with `Cannot access 'z' before initialization`. Spent significant time chasing this:

1. **First hypothesis:** vendor circular dependency (elics ↔ @iwsdk/core). Tried `manualChunks` in Vite config to split vendor chunks. Didn't help — ES module live bindings cross chunk boundaries.
2. **Actual root cause:** a **variable shadowing bug** in our own code. `const glow = BEHAVIOR_GLOWS[behavior]` (the color, outer scope) was shadowed by `const glow = new THREE.Mesh(..., { color: glow })` (the mesh, inner scope). The inner `const glow` was hoisted to the top of the for-block, so `color: glow` read the uninitialized inner binding. Classic TDZ. Fixed by renaming the inner const to `halo`.

**Lesson:** when the bundler says "Cannot access X before initialization," read the minified chunk to find the actual variable. The minified name tells you nothing; the surrounding code tells you everything.

### More grab-demo bugs (all from the same dynamic-import refactor)

The dynamic-import refactor (moving THREE/IWSDK/elics inside boot functions) left several call sites that relied on module-level THREE:

1. `createTextSprite('Waiting...')` — missing the `THREE` arg. `THREE.CanvasTexture` threw "is not a constructor."
2. `CollectionSystem.raycaster` and `.pointer` — declared null, never initialized. Every click hit the early-return guard silently.
3. **isTouch false-positive** — `navigator.maxTouchPoints > 0` returns true on touchscreen Chromebooks in laptop mode, rendering the look-zone/thumbstick overlays over the whole screen and intercepting all mouse clicks.

Each was a one-line fix, but finding them required reading the actual deployed chunks (minified) and tracing the exact failure point.

### The "no valid parent entity" warning

Thousands of console warnings: `Entity 11 is being parented under active level root by default because it doesn't have a valid parent entity.`

Traced to `@iwsdk/core/dist/transform/transform.js:198`. Two bugs causing it:
1. **Double-parenting** — collectible groups were `scene.add(group)`'d BEFORE `world.createTransformEntity(group)`. The transform system and the manual add conflicted.
2. **Dangling Transform** — collected entities had their Object3D removed but their ECS entity (with Transform component) left alive. TransformSystem kept re-evaluating the stale entity every frame.

Fixed: removed the manual `scene.add`, called `entity.destroy()` on collection completion.

### Mobile thumbstick

Added a visible thumbstick + look-zone to grab-demo's page for mobile play. Floating thumbstick (base follows first touch). Later reverted to a fixed-position stick because the floating version intercepted taps near GLBs.

---

## Day 2 (2026-07-20) — Multiplayer Overhaul, Flying Monkeys, Monorepo Port

### Grab-demo multiplayer: the invite-link model was wrong

Discovered the invite-link flow was fundamentally broken:
- The `PortalRoom` DO (in booty-chat-worker) only relays `pose`/`profile`/`rtc_*` — it silently drops `join`/`collect`/`score` messages
- grab-demo's WS protocol was completely misaligned with the DO's actual protocol
- Default `?room=demo` put all roomless visitors in the same room (accidental auto-pairing)

### New GrabDemoRoom Durable Object in 02-ca-patrouch

Built a purpose-built DO for grab-demo. Key challenges:
- **The SvelteKit + DO export problem:** adapter-cloudflare generates `_worker.js`, but Cloudflare requires DO classes to be exported from it. The `sveltekit-cloudflare-durable-objects` vite plugin failed (closeBundle fires before the adapter writes the file). Switched to the CLI approach: `vite build && sveltekit-cloudflare-do --do ...`
- **The migration deploy problem:** Cloudflare Pages auto-build runs `npm run build` but does NOT run `wrangler deploy`, so DO migrations don't apply. Required a one-time manual `wrangler deploy` (the "exceptional reason" to the git_autopush rule).
- **The promote loop:** the DO promoted solo players (score 0, alone) every 90s, causing infinite redirects. Fixed with a guard: promotion requires 2+ players AND score > 0.
- **Level-keyed rooms fragmented players:** phone on level-1 and desktop on level-2 were in different DO instances. Collapsed to a single shared room.

### Room model evolution

Went through several iterations of the room model before settling:
1. Level-keyed rooms (fragmented) →
2. Fixed-size matchmaking (too structured) →
3. Shared room with soft cap + auto-split (complex) →
4. **Shared room per game** (simplest, matches portal realms)

User vision: "X people chasing the aliens at the parade" — drop-in shared sessions, not private duels. Timer-based rounds with winners-promote/losers-stay. Later refined to the pool-hall model (winner keeps the table) as a future variant.

### Behavior-specific departure effects

Built `DepartureEffects` — each behavior type has a signature collection animation:
- **passive → pop** (squash-and-stretch to zero)
- **evade → deflate** (Z collapses first, balloon-like)
- **attack → scatter** (meshes fragment + drift apart)
- **hide → dissolve** (scale up + opacity to zero)

Plus a shared sparkle burst (12 colored particles) for all departures.

**User feedback on vocabulary:** "can we use terms like transforms, morphs, disappears, disintegrates, dissolves — and other less morbid words such as death?" Renamed everything: DeathEffects → DepartureEffects, `_shatter` → `_scatter`, `_fade` → `_dissolve`. The actual effects are unchanged — only the vocabulary.

### Oz multiplayer + flying monkeys

Ported the grab-demo multiplayer pattern to Oz:
- **OzRoom DO** — presence, shared munchkin/monkey collection, monkey-wave broadcasting
- **OzMonkey component + MonkeySystem** — flying monkeys swoop in sine arcs, chase the nearest player, hit on proximity (global cooldown prevents multi-monkey point hemorrhage)
- **Click-to-collect raycaster** — monkeys defeated by clicking; triggers the scatter departure effect
- Tuned monkey behavior after user feedback ("too fast and bouncing at me"): halved chase speed, gentler arcs, global 3s hit cooldown, -1 penalty (was -2)

### The WebXR monorepo port

Moved Oz from `ca-patrouch/02-ca-patrouch` to `dev-ambientx/WebXR/apps/oz/` — a standalone app in the pnpm monorepo. Key adaptations:
- `World.create(...)` → `bootXr()` from `@webxr/engine`
- `import('./departure-effects.js')` → `import('@webxr/engine')`
- elics imported via `@iwsdk/core` re-export (not as direct dep)
- Thin `XrStage` + `Hud` page shell (replaces custom HUD/touch overlays)
- elics imported via `@iwsdk/core` re-export (not as direct dep)
- First app in the monorepo to use Durable Objects (no precedent existed)

### Shared asset service

Created `packages/asset-service/` (`@webxr/assets`) — one D1 + one R2 for all games. Each app's API routes are 2-line wrappers that call shared handlers. Models filtered by `game_name` column.

Migrated from per-app `oz-assets` to shared `webxr-assets`:
- D1: `webxr-assets` (one database, `asset_library` table)
- R2: `webxr-assets` (one bucket)
- Query: `?game=oz` returns Oz models; `?game=parade` returns Parade models

### Compression in practice

Compressed `AGR-munchkin-2.glb` (animated, 16.68 MB → 11.57 MB, 30.6% smaller). The static munchkin-1 (1.4 MB) only compressed 5.4% — meshopt shines on high-poly models, not already-lean Monster Mash exports.

**Decision on shared GameRoom DO:** deferred. Build `BaseGameRoom` when the second game's DO exists (Parade). Premature to extract from a single implementation.

### Player avatar decision

Decided: split local (hands/held prop per game) vs remote (simplified head/torso + name). No full hand skeleton sync. Different games use different props: Oz=basket/wand, Galaga=blaster, Parade=baton.

---

## Commits (02-ca-patrouch)

- `99557f4` — Unify desktop/XR input via InputAdapter; fix oz-world TDZ; meshopt GLB compression
- `c332a78` — (reverted) Split vendor chunks for TDZ
- `806ede3` — Fix recurring grab-demo TDZ: const-name shadowing
- `897bef0` — Fix grab-demo: createTextSprite missing THREE arg
- `1ed8a0c` — Fix grab-demo click-to-collect: initialize raycaster + pointer vector
- `d17e4b4` — Fix per-frame "no valid parent entity" warning
- `10c8263` — Fix multiplayer: one shared room, phone tap-to-collect, friendly names
- `7eb68b9` — Rename death→departure vocabulary
- `8ce2ca2` — Extract DepartureEffects to shared module
- `08f6e11` — Oz step 2: OzRoom DO + WS route + wrangler v2 migration
- `85aaaf3` — Oz step 3: multiplayer presence + shared munchkin collection
- `e76ec7a` — Oz step 4: flying monkeys (OzMonkey + MonkeySystem)
- `8a27af5` — Oz step 5: click-to-collect raycaster for monkeys
- `6771eb2` — Oz step 6: full page rewrite

## Commits (ambientx-webxr monorepo)

- `5d6b3ad` — Add apps/oz — multiplayer munchkin garden
- `17230a9` — Fix wrangler.jsonc: use real D1 ID
- `1b86ef8` — Remove remote:true from D1/R2 bindings
- `ce2374f` — Shared asset service: packages/asset-service + migrate Oz
- `ad9b996` — Add gltf-transform deps to @webxr/assets + munchkin-2 upload

---

## Key learnings

1. **Read the minified chunk** when debugging bundler errors. The error message is useless; the code around the throw site tells you everything.
2. **Durable Object migrations need `wrangler deploy`** — Cloudflare Pages auto-build doesn't apply them. This is a one-time cost per DO class.
3. **The SvelteKit + DO export problem** is solved by the CLI approach (post-build), not the vite plugin (fires too early).
4. **Meshopt preserves morph targets; Draco doesn't.** For animated models, always meshopt.
5. **Console filters hide bugs.** A "Sin problemas" filter hid 7 boot log messages, making it look like the boot wasn't running.
6. **`navigator.maxTouchPoints > 0` is true on touchscreen Chromebooks** in laptop mode. Detect actual touch usage, not capability.
7. **Variable shadowing causes TDZ** that looks like a bundler bug. `const x = new X({ prop: x })` — the inner x shadows the outer, and `prop: x` reads the uninitialized inner binding.
8. **One shared D1+R2 for all games** is better than per-app databases. The asset service is identical across games; game rooms are not (yet — extract the base class when there are two).
