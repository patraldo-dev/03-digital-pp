# Session Archive: Founding Ambient X — A WebXR Game Studio, Monorepo Architecture, and Oz: Dominion

**Date:** 2026-07-20
**Projects:** ZCodeProject/WebXR → sveltecloudflare/dev-ambientx (the new studio), patraldo-dev/ambientx-webxr (GitHub)
**Duration:** ~11 hours, single marathon day
**Outcome:** A pnpm monorepo with shared engine + UI packages, three game apps on Cloudflare Workers, an Oz game redesigned mid-session from spectator scene to multiplayer defender loop, and a publishable blog pipeline wired into pinchepoutine.digital.

---

## Morning: The Studio Is Born

### The founding question

The day opened not with a task but with a *vision*: two days of WebXR experiments (grab-demo, Oz, portals-ecs) had convinced Patrouch this was the path. The question was how to structure it for the long haul:

> "I want to start developing games to sell on Horizon Meta and maybe on Huawei's HarmonyOS platforms... Let's do them with SvelteKit, no? Web first — not Unity, not Unreal engine."

ZCode grounded the instinct in 2026 reality before responding. Two web searches confirmed the strategic bet: **WebXR PWAs on the Meta Horizon Store now have in-app-payment parity with native Quest titles** (as of late 2025/early 2026). IAP revenue grew +13% YoY, 100+ titles crossed $1M, Horizon+ passed 1M subs. HarmonyOS NEXT, on the other hand, dropped Android app compat and has no confirmed WebXR API — keep as a "future maybe," not a target.

The recommendation: **web-first is the correct bet, not a compromise.**

### Three game ideas, ordered by nausea

Patrouch arrived with three concrete game concepts:
1. **A parade** — spectacle, spectator viewpoint
2. **An opera/theater where the audience throws tomatoes at actors**
3. **Running of the Bulls, reversed** — bulls watch humans run through the city

ZCode proposed a difficulty ramp based on a real VR constraint: **motion sickness and scope creep are the killers.** Spectator experiences are lowest-risk; physics-throwing is medium; camera-navigation-through-scenes is highest. So Parade = game #1.

### The structural decision

Two architecture options, with a real tradeoff:

- **Monorepo, app-per-game** — shared engine package, separate SvelteKit apps. Each game gets its own Horizon Store listing + IAP. More setup, but matches "sell multiple games" goal.
- **Single app, routes per game** — one PWA, one listing. Simpler, harder to sell games individually.

Patrouch chose app-per-game with shared packages. **The engine lives in `packages/engine` so a bug fix is one edit that propagates everywhere via pnpm symlinks.** Each app stays a thin shell (one `+page.svelte`, one manifest, one config) so even full-file regenerations stay cheap.

### Scaffolding the monorepo

Built the whole thing in one pass:
- `packages/engine` — `bootXr()` (World.create + bloom + re-entry guard), `installIWER()`, `reuseOrCreate` (HMR-safe elics components), `GrabSystem`, `InputAdapter`, `ComfortVignette`, `DepartureEffects`
- `packages/ui` — `XrStage.svelte` (canvas host + Enter-VR gate), `TouchControls.svelte`, `Hud.svelte`
- `apps/parade` (full MVP), `apps/tomato-opera` (scaffold), `apps/bulls-reversed` (scaffold)
- Frozen versions matching the proven portals-ecs set: three 0.183, @iwsdk/core 0.3.1, iwer 2.2, SvelteKit 2.22, Svelte 5, Vite 7

**Key discipline:** read the source before lifting. `world-builder.js` was portal-coupled (navigation, narrative, multiplayer), so only its *generic core* was extracted into `bootXr()`. The grab/input/vignette/effects modules lifted verbatim — zero game-specific deps.

### Bugs along the way

Three import errors caught by actually booting the dev server:
1. `sveltekit` exported from `@sveltejs/kit/vite`, not `@sveltejs/vite-plugin-svelte`
2. `iwsdkDev` is a named export, not a default
3. `elics` is a transitive dep of `@iwsdk/core` (npm hoists it; pnpm doesn't — had to declare it explicitly in the engine package)

Disk pressure nearly derailed things — `/home/patrouch` was at 94%. A stray 3.1G `~/.npm` cache (leftover from npm-based projects) was the culprit; cleared it to 86%. Configured pnpm to use the global store going forward.

### First commit (d4973d4)

Initial monorepo pushed to a fresh private GitHub repo under Patrouch's personal account: `xpat/ambientx-webxr`.

---

## Midday: The Hosting Saga (Cloudflare In, Out, Back In)

### "Connect this to Cloudflare Workers"

Patrauch wanted Workers + GitHub integration. ZCode converted all three apps from `adapter-static` to `adapter-cloudflare`, added `wrangler.jsonc` per app, and wired `git_autopush.sh` as the only deploy verb.

### The deploy-rule conflict

Patrauch's standing memory rule: **never run `npm run build` or `wrangler deploy` locally** — push and let the host build. The Cloudflare docs example showed `npm run build && npm run deploy`, which violated it. Resolution: the GitHub-app build pipeline runs on Cloudflare's side; `git_autopush.sh` is all Patrouch ever does locally.

### Domain decision: ambientx.dev

Ten custom domains were on the table. ZCode ranked them and recommended **`ambientx.dev`**:
- "Ambient" is a real immersive-computing term; "X" reads as XR
- `.dev` signals software studio to the tech audience
- Scales: in 5 years with 20 games, "Ambient X" still fits
- Per-game subdomains work cleanly: `parade.ambientx.dev`, `opera.ambientx.dev`, `bulls.ambientx.dev`

### The whiplash

Mid-Cloudflare-setup, Patrouch backtracked: "I'm back to thinking we shouldn't use cloudflare at this point." ZCode reverted to static.

Then a crucial correction: **Patrauch's prior session had established Parade as a multiplayer alien-defense game, not a passive spectator scene.** Once that surfaced, all three games were clearly multiplayer candidates, and static-for-everything was the wrong call. Re-applied Cloudflare. Apologized for the whiplash — the wrong assumption about Parade had driven the revert.

### Repo transfer

GitHub repo moved from `xpat/ambientx-webxr` → **`patraldo-dev/ambientx-webxr`** (Patrouch's org). Local `origin` updated; GitHub auto-redirects the old URL.

---

## Afternoon: Two CI/Build Wins

### The Cloudflare build failure: ERR_PNPM_IGNORED_BUILDS (18322f8)

First push to Cloudflare failed hard:
```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild, sharp, workerd
Failed: error occurred while installing tools or dependencies
```

pnpm 11 blocks native postinstall scripts by default for supply-chain safety. Unlike locally (where pnpm just warns), **Cloudflare treats it as a hard failure.**

ZCode got the config location wrong twice before finding the answer:
1. `.npmrc` with `onlyBuiltDependencies[]=` — old pnpm 9.x format, ignored by 11
2. `pnpm-workspace.yaml` with `onlyBuiltDependencies:` YAML list — also ignored
3. **Correct answer:** `allowBuilds:` map with boolean `true`/`false` values in `pnpm-workspace.yaml`. This is the format pnpm's own `approve-builds` command writes.

The malformed `allowBuilds: { esbuild: "set this to true or false" }` block (placeholder strings an interactive TUI had inserted earlier) was the smoking gun.

### SvelteKit config consolidation (628b1dc)

Patrauch noticed `svelte.config.js` files and asked if they could be dropped. ZCode initially pushed back ("SvelteKit requires it") — **wrong.** The official docs confirm: since SvelteKit 2.62.0, kit config can be passed inline to `sveltekit()` in `vite.config.js`, and `svelte.config.js` is ignored.

Verified the installed version (2.70.1, well past the threshold), migrated all three apps, deleted the separate config files. Key detail from the docs: kit options go at the **top level of `sveltekit({...})`**, not nested under `kit:`.

---

## Late Afternoon: The Oz Game Drops In

Somewhere in here, `apps/oz` appeared (5d6b3ad) — a multiplayer munchkin garden WebXR game, with a Cloudflare Durable Object (`oz-room.js`) hosting shared munchkin/monkey collection, monkey waves, and player presence. The asset service (`packages/asset-service`) was added, Oz migrated to it, and `AGR-munchkin-2.glb` uploaded to R2 with meshopt compression (16.68MB → 11.57MB).

The repo outgrew its original three-game scope. ZCode added a **`prototypes/` lane** so Patrouch could spawn throwaway sparks without the full SvelteKit scaffold — sketchbook vs portfolio.

### The missing munchkin (8a13c60)

Patrauch reported munchkin-2 wasn't appearing on `oz.ambientx.dev`. ZCode's investigation is a small case study in not trusting first instincts:

1. Hypothesized a doubled-`models/` URL bug in the asset service. **Wrong** — verification showed the doubled URL actually returned HTTP 200 (the route is mounted that way); the single-`models/` URL was the one that 404'd.
2. Verified both GLBs served with `content-type: model/gltf-binary` and correct sizes. The library API returned both models with `game_name: "oz"`.
3. **Actual cause: most likely browser cache.** Everything in the data + serving + code path was correct.

Patrauch then asked: can we serve *only* munchkin-2? Filter applied in `oz-world.js` — match by id with a label-substring fallback. The static munchkin-1 stays in the shared library for other games.

---

## Evening: The Oz: Dominion Redesign

### Dorothy, reimagined

The pivotal moment of the day. Patrauch reframed the entire Oz premise:

> "If I'm going to be Dorothy, she's a bad-ass western flying monkey wrangler in this edition of oz:dominion and her first task in the first scene (v1) is to save the munchkins from the flying monkeys."

This is a fundamentally different game from "monkeys attack player." ZCode laid out three mechanical options for what happens when a monkey reaches a munchkin:
1. **Kidnap** — carry it away (player loses the chance to collect)
2. **Scare** — munchkin relocates
3. **Kill** — munchkin destroyed in a burst

Patrauch chose **kidnap**. Strongest fit for "wrangler" identity, clear failure state, comedy beat (monkey laboriously hauling a munchkin skyward).

### Monkey AI retarget (08af338)

Rewrote `MonkeySystem` completely:
- Each monkey acquires a target munchkin (visible, uncollected, unkidnapped), preferring ones no other monkey is targeting
- Chases on XZ + swoops Y lower as it closes in (dive-bomb arc)
- On proximity (<1.2 units): attaches the munchkin, switches to `fleeing`, climbs + drifts away + despawns at altitude
- Removed all player-hit logic (monkeys ignore Dorothy now)
- Garden density up ~2.5×: flowers 20→50, munchkins 12→30

Multiplayer sync: new `kidnap_munchkin` / `munchkin_kidnapped` WS message types, new `kidnappedMunchkinIds` set in the DO (mirrors the existing collectedMunchkinIds pattern), included in roster so late joiners see already-stolen munchkins as gone.

### The rogue gold monkey (b9e92f3)

Patrauch's idea: "Maybe there is one Flying monkey out of the 50 that's a different color and attacks the player?"

A classic rogue-enemy / boss-variant pattern. It solves a real design problem: with monkeys only hunting munchkins, Dorothy could stand still and just shoot. A player-attacker forces movement.

- **Visual:** gold body, green eyes, larger, metallic — readable across the garden. Gold = boss/royal in universal game vocabulary.
- **AI:** chases the player (revives the player-hit mechanic, but only for this one mob)
- **Reward:** 15 points (3× normal)
- **Lifecycle:** max one at a time, 45s cadence, separate id pool (100k+) to avoid collision

### The public-domain note

Mid-design, Patrauch flagged a hard constraint: **nothing can resemble the 1939 MGM movie characters.** L. Frank Baum's 1900 book is public domain; the film designs (fez-wearing winged apes, violin-F-hole wings, ruby slippers) are not. The abstract sphere+cone monkey proxy is already safely generic, and "gold = boss" is universal game vocabulary. ZCode added this to memory as a hard legal constraint.

### Mobile thumbstick (5fcc74b)

Patrauch: "We need the thumbstick on mobile."

Wired `@webxr/ui`'s `TouchControls.svelte` into the Oz page. The page owns one `touchInput` object (`{x, y, lookX, lookY, active}`) and passes the same reference into `bootOzWorld()`. The component mutates the object's fields on touch events; `animate()` reads them every frame alongside the WASD `keys` map.

Design choice worth noting: **analog thumbstick + binary WASD write into the same `moveDir`** before the camera-relative normalize+yaw transform. No duplication of the movement math; both input paths share it. Desktop inert (touch fields stay zero).

---

## Themes Worth Pulling Into the Blog

Three publishable threads emerged:

1. **The Cloudflare + pnpm 11 build-script saga** — concrete CI gotcha with a clear fix. Universal pain point for anyone using pnpm 11 with Cloudflare Workers/Pages.
2. **Oz: Dominion's mechanical flip** — redesigning a game mid-build by changing *what the enemy targets*. A small code change that completely rewires the player's relationship to the game.
3. **The prototypes-vs-apps monorepo decision** — sketchbook vs portfolio. Why a two-lane workspace beats "every spark is a full app" for creative iteration.

---

## Workflow Notes

- Deploy verb all day: `git_autopush.sh` from inside `dev-ambientx/webxr/`. No local builds, no `wrangler deploy`. Cloudflare's GitHub app builds on push.
- Memory file `project_ambientx-dev-studio.md` updated multiple times: local path (which moved twice during the day), GitHub location (after the org transfer), the Oz redesign summary, and the public-domain legal constraint.
- The session had its rough moments — three config-location mistakes on the pnpm build-script approval, a wrong assumption about Parade that caused the Cloudflare revert whiplash, an initially-wrong diagnosis of the munchkin-2 bug. Each was caught by verification rather than assertion.

---

## Commits Shipped This Session

| Hash | Time | Summary |
|---|---|---|
| d4973d4 | 12:45 | Initial commit: WebXR game studio monorepo (Ambient X) |
| 628b1dc | 13:20 | Consolidate SvelteKit config into vite.config.js |
| 18322f8 | 14:11 | Fix Cloudflare build failure: pnpm 11 build-script approval format |
| 5d6b3ad | 15:18 | Add apps/oz — multiplayer munchkin garden |
| 17230a9 | 15:33 | Fix wrangler.jsonc: real D1 ID, remove duplicate bindings |
| 1b86ef8 | 15:38 | Remove remote:true from D1/R2 bindings |
| ce2374f | 18:39 | Shared asset service: packages/asset-service + migrate Oz |
| ad9b996 | 22:04 | Add gltf-transform deps + upload munchkin-2 |
| 8a13c60 | 22:50 | Oz: use only the animated munchkin (agr-munchkin-2) |
| 71e0190 | 22:57 | Oz: winding yellow-brick road via shared getRoadCurveX |
| 08af338 | 23:08 | Oz: Dominion v1 — monkeys kidnap munchkins, Dorothy defends |
| b9e92f3 | 23:18 | Oz: Dominion — rogue gold monkey variant |
| 5fcc74b | 23:28 | Oz: mobile thumbstick + look-drag locomotion |

13 commits in one day. The studio went from a blank directory to a deployed multiplayer WebXR game with mobile controls.
