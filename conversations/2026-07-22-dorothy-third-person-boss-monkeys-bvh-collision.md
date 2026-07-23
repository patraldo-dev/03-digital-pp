# Session Archive: Third-Person Dorothy, Head Honcho Boss, Army Monkey GLBs, BVH Collision, Scoreboard Rebuild

**Date:** 2026-07-22
**Projects:** dev-ambientx/webxr (Ambient X studio), patraldo-dev/ambientx-webxr (GitHub), patraldo-dev/03-digital-pp
**Duration:** ~12 hours, marathon day
**Outcome:** Dorothy is now a visible third-person character with walk animation, the Head Honcho boss monkey has 5 state-driven GLBs, the army has 4 state GLBs, flowers have their own baked animations, BVH capsule collision is wired, and the scoreboard uses the proven grab-demo multiplayer pattern.

---

## Part 1: Empowerment Mechanic Redesign

The day opened with a fundamental gameplay redesign. Dorothy's role changed from passive collector to active protector:

- Walk near flowers → munchkins **emerge** (scale up)
- Touch a munchkin → it becomes **empowered** (permanent emerald aura, no score for empowering itself)
- Monkeys arrive in waves, targeting visible munchkins
- Monkey reaches **un-empowered** munchkin → **kidnap** (carried off, Dorothy -2 pts)
- Monkey reaches **empowered** munchkin → **repelled** (monkey stunned/knocked back, Dorothy +3 pts)
- Dorothy can also shoot monkeys directly for +5 (or +25 for the boss)
- **Win condition:** all 30 munchkins empowered = victory banner + bonus

The emerald aura was initially a full emissive wash on the mesh materials — Patrouch rejected this ("it washes out the original artwork"). Replaced with a billboarded additive-blended pulsing sprite positioned above the munchkin. The original GLB artwork stays completely untouched.

---

## Part 2: Visible Dorothy — Third-Person Camera

"I still think we need a real visible Dorothy that we make walk and that we can see."

Five Dorothy GLBs were uploaded (AGR-D001A series: LegandArm=walk, ArmChop, LegKick, LegKickLong, StaticTilted). The LegandArm clip has the walk cycle baked in (Monster Mash ARAP morph-target style).

**Camera rewrite:** Switched from floating first-person camera to third-person follow. Dorothy is the movement anchor; the camera trails behind at 3.5m distance, 2.5m height. Mouse/touch drag orbits the camera around Dorothy (adjusts yaw/pitch angle, not Dorothy's facing). Dorothy's mesh rotates to face her movement direction with smooth lerp turning.

**Critical regression caught:** The third-person change broke all proximity checks. HideRevealSystem, MonkeySystem (rogue + idle orbit), and WS pose broadcast all used `camera.position` as "the player position." But the camera now trails 3.5m behind Dorothy — so munchkin empower checks (`dist < 1.0`) measured from the camera and never triggered. Fixed by changing all four systems to use `dorothyGroup.position` instead.

---

## Part 3: Head Honcho Boss Monkey

Five GLBs (AGR-Oz-HH series: Swoop, Grab, Flee, Stunned, Defeated), each a single baked animation. The boss:
- 2m tall (normalized in template)
- Initially 3 HP with state-driven mesh swapping
- Patrouch found it "impossible to kill" and "doesn't go away" — reverted to one-shot kill (0 HP = same instant-kill path as regular monkeys)
- 25 points, generous 1.2m hit sphere
- Spawns every 15s (first), then 30-45s

The `swapBossMesh()` function clones the appropriate GLB template on state transitions, replaces the old mesh in the group, and starts a fresh AnimationMixer.

---

## Part 4: Army Monkey GLBs + Mesh Swapping

Four GLBs (AGR-MonkeyArmy: Swoop, Grab, Flee, Stunned). The spawn function uses the Swoop GLB as the initial mesh with proxy sphere+cone fallback. `swapArmyMesh()` swaps meshes on state transitions (swoop→stunned on repel, swoop→flee on kidnap, stunned→swoop on recovery).

---

## Part 5: Flower GLBs + Animations

Three variants (Flower01=3m, Flower02=4.5m, Flower-Tall=6m). Each has a baked morph-target animation clip. 50 flowers spawned, each with its own AnimationMixer and random phase offset so they sway independently. FlowerSwaySystem advances both the GLB mixers and a reduced procedural micro-sway (0.03 rad) layered on top.

---

## Part 6: BVH Collision (three-mesh-bvh)

Copied `grounded-player.js` from the patrouch.ca portal engine into `packages/engine/src/`. Capsule physics: 0.3m radius, 1.6m height, gravity -10, 2 substeps per frame.

**Tuning issue:** Initially registered the full flower GLB mesh as colliders. This blocked Dorothy at head height — she couldn't walk under flower canopies because the wide petals at 1.5m+ intersected her capsule. Fixed by registering only **invisible stem colliders** (0.3m radius cylinder, 1m tall at the base) instead of the full mesh.

---

## Part 7: Scoreboard Rebuild (grab-demo pattern)

The old scoreboard showed `⭐ {score} pts · 👤 {presence}` — a single number that never changed visibly. Patrouch: "No points are visible anywhere."

Studied the grab-demo scoreboard implementation (via agent exploration):
- `updateScore()` builds a sorted array of `{ name, score, isMe }` for all players
- Pushes to `onScoreUpdate({ scores })` — the Svelte page reassigns the whole `$state` object
- Horizontal flex row of glass cards: your card gold, leader green
- Each score change (local or peer) flows through `updateScore()`

Replicated this exact pattern in oz-world.js + +page.svelte. All `onScoreUpdate(score)` calls replaced with `updateScore()`.

---

## Part 8: Audio 4x + Cache Wars

The munchkin audio was replaced with 4x-speed versions. Three rounds of cache-busting:
1. `?v2-4x` query param — only busts browser cache, not Cloudflare edge
2. `?v3-4x` + `Cache-Control: no-cache` — edge still cached from before
3. **New R2 keys** (`-v4x` suffix) — completely new URLs the edge has never seen. This worked.

Key lesson: when replacing files in R2 that already have edge cache, use new keys entirely. Query params don't bust the Cloudflare edge cache.

---

## Part 9: Negative Scale Bug

The MCP revealed all monkeys had negative scale `[-1.08, -1.08, -1.08]`. The despawn shrink code used `obj.scale.multiplyScalar(1 - dt * 0.5)` — when scale passed through zero, it went negative. Negative scale flips meshes inside-out (invisible) and inverts the hit sphere (raycasts miss). This was the root cause of "can't shoot monkeys" — the monkeys were technically alive but unclickable.

Fixed: `setScalar(Math.max(0.01, scale - dt * factor))` — clamps at 0.01, never negative.

---

## Bugs Squashed

- AudioContext autoplay storm (Chrome blocks audio until user gesture; gated with `_audioUnlocked`)
- Negative scale despawn (multiplyScalar past zero → inverted meshes)
- Proximity regression (camera vs Dorothy position after third-person switch)
- Boss glomming onto Dorothy (no repulsion → orbits at 2.5m minimum distance)
- Army monkeys circling in perfect circles (replaced with swooping dive arcs)
- Audio cache staleness (3 rounds of cache busting → new R2 keys)
- Flower heights too low (1.5m → 3/4.5/6m per variant)

---

## Commits (12 pushes)

- `5489652` — Multiplayer OzRoom DO + remote R2/D1 bindings + monkey hitboxes + thumbstick fix + scoreboard panel
- `a14095f` — Empowerment mechanic + monkey shootability fixes
- `0fa01f2` — Third-person Dorothy: visible character mesh + walk animation + trailing camera
- `836db3f` — Audio 4x cache bust (v2)
- `b349dfa` — Aura pulse replaces emissive wash
- `be19fa3` — AudioContext autoplay gate + rogue monkey spawns on production
- `bd2f7ea` — Fix proximity regression: all systems use Dorothy position not camera
- `c5541f5` — Head Honcho boss: 5 GLB states + HP + mesh swapping
- `5d93004` — Army monkey GLBs (Grab+Stunned)
- `691e1a4` — Flower GLBs (3 variants) + complete army templates
- `ad5ba14` — Army monkey mesh swapping on state transitions
- `e05a8fd` — Grab-demo scoreboard pattern + boss one-shot kill + slow army arcs
- Multiple more for collision, recenter, flower animations, audio cache fixes

---

## Outstanding Tasks (for tomorrow)

1. **Click-to-shoot verification** — never confirmed end-to-end that clicking a monkey updates the scoreboard
2. **Army monkey mesh swap verification** — code is wired but never visually confirmed
3. **Collision playtesting** — stem colliders and 0.3m capsule need real gameplay testing
4. **MCP screenshot verification** — couldn't capture screenshots (managed browser kept dying)
