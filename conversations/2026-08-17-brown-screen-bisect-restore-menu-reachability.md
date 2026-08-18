# Session Archive: Fifteen-Round Brown-Screen Bisect, the Restore, Menu Reachability, and the Full-Height Toast

**Date:** 2026-08-15 → 2026-08-17 (session days)
**Projects:** dev-ambientx/webxr (tomato-opera), patraldo-dev/ambientx-webxr, patraldo-dev/03-digital-pp
**Outcome:** Brown-fill artifact in the opera eliminated — two independent causes isolated (crowd morph-bake `e86e06f`, pinch-zoom kill inside `f2caa47`) via a fifteen-round deploy-checkpoint bisect; final tree = newest real code minus the bake (`8022bcc`). In-world menu made reachable on all screens (camera-anchored panel, tap consumption, ☰ toggle) in `6dc965b`. Mocap toast full-height grey column fixed (`1a5dc1a`). Four blog posts + this archive published.

---

## Part 1: The brown screen and the bisect that found it

After shipping a batch (crowd morph bake + pinch-zoom removal + lighting teardown, `f2caa47`), the opera rendered behind a brown fill. Headless probes rendered clean — the artifact needed a real browser, so the bisect ran through production:

- **Method:** pick commit → `git read-tree -u --reset <sha>^{tree}` (exact-tree restore) → checkpoint commit → `./git_autopush.sh` (auto build+deploy) → poll `/_app/version.json` → user hard-refresh → BROWN / NO BROWNS verdict, always tied to the `[viewdbg] attached — build <id>` boot line.
- **Verdict map:** r0 `2c9a8a8` BAD (regression older than suspected) → r1–r4 GOOD → r5 `48bf4a2` BAD, r6 `5fad38a` BAD, r7 `e86e06f` BAD (**cause A: crowd morph bake**) → parent rerun GOOD → attempted per-seat-geometry fix BAD → bake revert BAD (**second cause exists**) → r8–r13 synthetic chain (old-good base + newest code − bake) all GOOD → r14 split (`f2caa47` tree + bake out + pinch restored) GOOD on build `1787027069062` (**cause B: pinch-kill**) → final restore `8022bcc` GOOD, user-confirmed.
- **Caveat on record:** the bake-revert BAD verdict (`c529a57`) was never build-stamp-verified and may have been stale-cache; moot in practice since both good candidates keep pinch alive.
- **Cache stickiness caught twice:** user verdicts quoting old build ids after fresh deploys — rejected; both times the server provably served the new build (version.json + clean probe). Mid-deploy mixed serving (chunk 404s) handled by wait-and-re-poll.

**What the day produced beyond the fix:** regression proven older than suspicion (r0); exact-tree restore as a trusted primitive; split-round technique (bisect changes inside a commit, not just commits); build-stamp verdict protocol; lighting teardown cleared (still shipped); final tree only a lighting teardown away from the true tip — nothing lost; crowd perf debt documented (36 live animations; accessor-based bake parked).

## Part 2: The restore that "lost features" (it didn't)

Post-restore report: in-world menu unusable — every screen tap toggled the UI; join-stage and seated avatar "missing." Audit: VRM loader, seated rest pose, audience mocap, claim-stage WS call, menu panel with Join Stage — all present and wired. Pure reachability:

1. **Panel placement:** fixed world spot 5.5 m right ≈ 50° off-axis; phone portrait hfov ≈ 24–26° → permanently off-frame.
2. **Tap fall-through:** panel hits that missed buttons fell through to the YouTube-style UI toggle.
3. **Phantom ☰:** code comment promised a DOM toggle that had never been written.

**Fix (`6dc965b`, build `1787029475030`):** flat screens anchor the panel to the camera's right edge each frame — hfov = 2·atan(tan(vfov/2)·aspect), anchor distance clamped [6.6, 10] m (6.6 keeps the 3.5 m panel inside 50° vfov; 10 stays inside raycaster.far = 15); XR keeps the world-anchored theater spot. Any panel hit consumes the tap. ☰ button added to the DOM bar (+ ❓ legend). Hiding the DOM UI forces the panel visible. Headless probe confirmed the panel on-screen at the right edge with buttons (Join showed "Upgrade" — probe session anonymous, tier gating by design).

**User resolution:** avatar appeared — the session had to be signed in (📷 ungated, 🎤 tier-gated premium/vip/beta_tester).

## Part 3: The full-height toast

The 📷 toast rendered as a long grey container on phones. Root cause: base `.mocap-notice` sets `top: 4.5rem`; the `@media (max-width: 768px)` override adds `bottom: 7rem` without clearing `top` — an auto-height absolute element with both insets stretches to span nearly the full screen. Fix (`1a5dc1a`): `top: auto` in the breakpoint + pill styling (border, radius, font-size, color, nowrap) matching the sibling toasts.

## Part 4: Publishing

Four posts added to `src/lib/blog/en/` (en-only, per recent routine):

1. `fifteen-rounds-of-brown-screen-bisect` — the saga, the two causes, what the day confirmed
2. `the-menu-was-always-there` — FOV math, tap consumption, reachability vs existence
3. `the-toast-that-stretched-full-height` — the top+bottom CSS footgun
4. `trust-the-build-stamp-not-the-browser` — cache stickiness and verdict hygiene

## Key commits

| Commit | What |
|--------|------|
| `e86e06f` | Cause A: crowd morph bake (regression) |
| `f2caa47` | Real pre-bisect tip: lighting teardown + pinch kill (cause B) |
| `8022bcc` | Final restore: round-13 tree (newest code − bake) |
| `6dc965b` | Menu reachability: camera-anchored panel, ☰, tap consumption |
| `1a5dc1a` | Mocap toast pill fix (`top: auto` in mobile breakpoint) |

## Parked

- Accessor-based crowd morph bake (`attr.getX/getY/getZ`) or mixer-freeze pose for perf — only after browns stay gone in the wild.
- Bisect checkpoint commits littering main (faa4940…6dc965b); history linear, any tree restorable via `git read-tree -u --reset <sha>^{tree}`.
- "Upgrade" label could also mention "or sign in" for gated-but-anonymous sessions.
