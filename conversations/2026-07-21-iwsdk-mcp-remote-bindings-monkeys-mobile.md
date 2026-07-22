# Session Archive: IWSDK MCP Tools, Remote R2/D1 Bindings, Flying Monkeys Return, Mobile Controls

**Date:** 2026-07-21
**Projects:** dev-ambientx/webxr (Ambient X studio), patraldo-dev/ambientx-webxr (GitHub), patraldo-dev/03-digital-pp
**Duration:** ~8 hours
**Outcome:** IWSDK MCP tools confirmed working for XR debugging, remote Cloudflare bindings eliminate asset duplication, flying monkeys restored via local fallback spawner, mobile thumbstick and tap-to-shoot fixed, OzRoom Durable Object ported for production multiplayer.

---

## The Morning Problem: The MCP Tools Keep Dying

The previous session ended with the IWSDK MCP tools confirmed working — 32+ tools for inspecting the emulated XR runtime (scene hierarchy, ECS queries, controller simulation, screenshots). This session opened with them broken. Every call returned "Not connected."

The diagnosis took longer than it should have. The dev server was up (HTTP 200), the WebSocket endpoint at `/__iwer_mcp` existed and accepted connections (proven by a direct Node WebSocket test), but the ZCode MCP bridge process had died when the managed browser was killed during a Chromebook restart.

**Root cause:** The ZCode MCP config pointed at `/home/patrouch/.openclaw/workspace/iwsdk-app/` — an old test project folder. Worse, that folder had `@iwsdk/vite-plugin-dev@0.3.1` which bundled a standalone `mcp-server.js` (the stdio→WS bridge), but the current ambientx project uses `@0.3.2` which dropped that file entirely.

**The fix:** Vendored the 0.3.1 `mcp-server.js` bridge into the ambientx monorepo at `scripts/iwsdk-mcp-bridge.js`, updated `~/.zcode/cli/config.json` to point there with `--port 5173`. The old iwsdk-app reference is gone permanently.

**Lesson:** The IWSDK plugin changed its MCP architecture between 0.3.1 and 0.3.2. Version 0.3.1 shipped a standalone stdio bridge; 0.3.2 expects clients to connect to the WebSocket directly. ZCode speaks stdio/http/sse, not raw WebSocket — so the bridge is load-bearing for this toolchain.

---

## The Scoreboard Bug That Wasn't

The original complaint: "The scoreboard is barely visible and doesn't seem to be working correctly."

The MCP tools (once reconnected) revealed the truth:
- **30 OzMunchkin entities existed and spawned correctly** — `ecs_find_entities` with `withComponents: ["OzMunchkin"]` returned all 30
- The HUD wiring was correct — `onScoreUpdate(score)` at every collect point, `$state` reactivity in Svelte 5
- The CSS had a text-shadow fix but no solid background — it washed out against the bright skybox

The "not working correctly" was three compounding upstream issues, not a scoreboard bug:
1. **D1 had no `asset_library` table** → munchkins fell back to capsule meshes
2. **No GLB models in R2** → the fallback path 404'd
3. **WebSocket timed out** → no monkey waves, no multiplayer score sync

**Fix:** Dark scoreboard panel (solid `rgba(15,8,25,0.82)` background, border, box-shadow). The score now reads clearly against any skybox.

---

## Remote Bindings: The Real Architecture Win

The biggest discovery of the day. The `platformProxy: { remote: true }` in `vite.config.js` was wrong — it's not the right option name. The actual switch is a **per-binding `"remote": true` flag** in `wrangler.jsonc` itself.

Reading wrangler 4.112's source code revealed:
- `getPlatformProxy(options)` checks `options.remoteBindings !== false` (defaults to enabled)
- But each D1/R2 binding must independently declare `"remote": true` to route through the remote proxy
- The `remote: true` in `platformProxy` was an unknown key that got silently ignored

Added `"remote": true` to both the D1 and R2 bindings in wrangler.jsonc. Now dev hits the real Cloudflare resources directly — no local copies of GLBs, audio, or D1 data needed. This scales to monkeys, flowers, and any future assets.

**One bug along the way:** Remote R2 objects have metadata in a format miniflare's Devalue serializer can't handle (`DevalueError: Cannot stringify arbitrary non-POJOs` at `writeHttpMetadata`). Wrapped that call in try/catch — we set Content-Type ourselves anyway.

---

## The Flying Monkeys Return

The monkeys had been missing for weeks. The reason: monkeys only spawned via `monkey_wave` messages from the OzRoom Durable Object, which wasn't running locally (SvelteKit dev mode can't instantiate DOs).

**The fix:** A local fallback monkey-wave spawner that fires when `_wsReady` is false:
- First wave 6 seconds after boot (2-3 monkeys)
- Subsequent waves every 12-20 seconds
- Gold rogue monkey every 30-45 seconds (worth 15 points)
- Uses high monkey IDs (10000+) to avoid clashing with DO-assigned IDs
- Goes silent automatically once the DO connects in production

---

## Mobile Thumbstick: The Invisible Bug

The thumbstick wasn't showing on mobile. The code was correct — TouchControls.svelte properly wrote `{x, y}` to the shared input object, oz-world read it every frame, the animation loop applied it.

The problem was CSS layering. XrStage's `.hud` container has `pointer-events: none` (so the canvas receives mouse events), and only re-enables it for `button` elements. But TouchControls zones are `<div>` elements — they inherited `pointer-events: none` and silently swallowed all touch input into the void.

**Fix:** Added `pointer-events: auto` explicitly to `.zone` in TouchControls.

**Also fixed:** Tapping to shoot monkeys didn't work on mobile (the entire screen is covered by touch zones, no taps reach the canvas). Added tap detection to the look-zone — a quick touch under 8px of movement dispatches an `oz-tap` custom event, which oz-world listens for and routes through the same raycaster as desktop clicks.

---

## Monkeys Hard to Hit

Small sphere bodies (radius 0.26) flying at 3-8m altitude made for tiny click targets. Added an invisible hit sphere at 3x the body radius to each monkey — the standard game-dev pattern for "forgiving hitboxes." Increased raycaster range from 15m to 30m.

---

## The Two-Button Confusion

Two buttons appeared: "Enter the Garden" (starts the game) and "Enter Oz" with a visor icon (enters immersive VR). On desktop with IWER emulation, both showed. Added a `hideEnterVR` prop to XrStage — Oz runs inline, so the single "Enter the Garden" button is the entry point.

---

## OzRoom Durable Object Ported

The multiplayer code was always in oz-world.js — WebSocket, peers, score sync, shared munchkin collection. What was missing was the **server-side DO class**. Copied `OzRoom` from `ca-patrouch/02-ca-patrouch/src/do/oz-room.js` into the oz app, created `src/worker.js` to surface the class for the production worker bundle.

The workerd warning persists in dev (SvelteKit limitation), but production will work — adapter-cloudflare's build picks up `src/worker.js`.

---

## Commits

- `5489652` — Multiplayer OzRoom DO + remote R2/D1 bindings + monkey hitboxes + thumbstick fix + scoreboard panel
- `b4b9325` — Fix HUD score visibility + remove dead score-wiring code (previous session, pushed this session)

---

## What's Left

- **Verify production multiplayer** — the DO should work once Cloudflare deploys; need to test on oz.ambientx.dev with two browser tabs
- **tmux durability** — sessions still die on Chromebook restart; switched to `nohup+disown` as a workaround
- **MCP bridge in dev** — works when connected but dies when the managed browser is killed; needs ZCode restart to reconnect
- **Real flying-monkey GLB** — currently using sphere+cone proxy meshes; placeholder until a proper model is created
