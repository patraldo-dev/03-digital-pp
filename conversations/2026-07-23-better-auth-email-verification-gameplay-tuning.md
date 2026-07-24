# Session Archive: Better Auth System, Email Verification, Site App Fixes, Gameplay Tuning

**Date:** 2026-07-23/24
**Projects:** dev-ambientx/webxr (Ambient X studio), patraldo-dev/ambientx-webxr (GitHub), patraldo-dev/03-digital-pp
**Duration:** ~10 hours across two calendar days
**Outcome:** Complete Better Auth system with email verification + password reset + notifications, central accounts.ambientx.dev sign-in hub, site app auth integration fixed, gameplay tuning (Dorothy size, WASD directions, trackpad look, boss defeat, recenter button), audio 4x cache wars resolved.

---

## Part 1: Better Auth — Shared Package + Central Accounts Hub

Created `@webxr/auth` workspace package with Better Auth + Drizzle + D1, incorporating Claude's three critical corrections:

1. **Cookie domain `.ambientx.dev`** — sessions cross all subdomains. Without this, login on oz isn't visible on parade.
2. **All origins trusted** — every game domain + accounts hub + localhost dev ports.
3. **Schema aligned with patrouch.ca** — integer timestamps with `{ mode: 'timestamp' }`, nullable fields, table name `users` (not `user`).

Created `apps/accounts` — central sign-in hub at accounts.ambientx.dev. One login form, one signup form, redirect-back flow via `?redirect=` param. Cookie-scoped to `.ambientx.dev`.

### Build errors conquered (3 rounds)

1. **`usernameClient` import path** — `better-auth/client/plugins` resolved to wrong file in rollup. Fixed by removing client-side usernameClient (server-side only).
2. **`node:fs` / `node:os` in Cloudflare build** — better-auth uses Node.js builtins. Fixed with `ssr.external` in vite.config.js.
3. **SSR parse error in dev** — static `import { createAuth }` broke Vite's import analysis. Fixed with dynamic `await import('@webxr/auth')` in hooks.server.js.
4. **Prerender crash** — `+layout.js` had `prerender = true` which triggered platform.env access during prerender. Disabled (Oz is client-rendered).

### End-to-end verification

Tested on production: signup creates user in D1 with auto-username, signin returns session token, both via `ambientx.dev` (site) and `oz.ambientx.dev` (game).

---

## Part 2: Email Verification + Password Reset (Mailgun)

Ported Mailgun integration from patrouch.ca into `packages/auth/src/mailgun.js`:
- `sendVerificationEmail` — styled HTML email with "Verify Email" button
- `sendResetPasswordEmail` — reset link with token
- From header: `Ambient X <noreply@ambientx.dev>`

Updated `create-auth.js`:
- `sendOnSignUp: true` — verification email sent automatically on signup
- `autoSignInAfterVerification: true` — auto-signin when user clicks email link
- `sendResetPassword` callback sends reset email via Mailgun

Created forgot-password and reset-password pages in accounts app.

### Notifications system

- D1 `notifications` table created in webxr-auth
- `notify(db, { user_id, type, title, body, meta })` helper in `packages/auth/src/notify.js`
- API routes in accounts: `GET /api/notifications`, `POST /api/notifications/mark-read`
- `NotificationBell.svelte` — bell icon with red badge, dropdown panel, 60s polling

---

## Part 3: Site App Fixes

The site app (ambientx.dev) had multiple auth integration issues:

1. **`vite.config.js` backwards** — had `better-auth` in `noExternal` (trying to bundle Node.js code). Fixed to `external` (don't bundle).
2. **Static import in hooks** — same SSR parse error as oz. Fixed with dynamic import.
3. **Unused `authClient` imports** — pulled `better-auth/svelte` into the browser bundle, causing "Cannot resolve better-auth" 500 error. Removed from both `+page.svelte` and `+layout.svelte`.
4. **Dev port mismatch** — hooks referenced localhost:5176, site runs on 5177. Fixed.

---

## Part 4: Gameplay Tuning

### Dorothy falling through floor
The `GroundedPlayer.step()` applied gravity (-10 m/s²) every frame. The thin PlaneGeometry ground mesh couldn't reliably catch the capsule, so Dorothy accelerated downward infinitely. Fixed by removing gravity entirely — Y forced to 0 every frame. BVH used only for XZ stem collision via position rejection.

### WASD direction inverted
Third-person camera reversed the movement axes. W/S were inverted (W went toward camera). Fixed by flipping Z axis. A/D were also swapped — fixed by inverting X axis.

### Trackpad look broken
`onMouseMove` required `e.buttons > 0` which trackpads don't report reliably. Removed the check, uses `lookActive` flag instead. Added `|| 0` fallback for `e.movementX/Y`.

### Dorothy too small
Was 1.6m. Changed to 4.0m. Camera distance raised from 3.5m to 7.0m, height from 2.5m to 5.0m.

### Flower-Tall too short
Was 6m. Changed to 9m (2x Flower02's 4.5m).

### Boss defeat broken
When `bossHP` was set to 0 (one-shot kill), the boss fell through to the regular monkey kill path which didn't call `swapBossMesh('defeated')` or release `liveRogueMonkeyId`. Fixed the one-shot path to handle bosses.

### Recenter button didn't work
`handles.recenter` was never assigned — XrStage doesn't merge return values back into handles. Fixed by assigning `handles.recenter = cleanup.recenter` in `bootWorld`.

---

## Part 5: Audio Cache Wars (Final Resolution)

The 4x munchkin audio wasn't updating despite being in R2. Three issues:
1. `Cache-Control: max-age=3600` — Cloudflare edge cached old audio for an hour
2. Query param cache-busting only affects browser cache, not edge cache
3. R2 key mapping: route strips `audio/` prefix, so keys needed to be `munchkins/...` not `audio/munchkins/...`

**Final fix:** Uploaded with new R2 keys (`-v4x` suffix) that the edge has never seen, bypassing all cache. Changed `Cache-Control` to `no-cache` for future-proofing.

---

## Commits (this session, 15+)

- `e05a8fd` — Grab-demo scoreboard pattern + boss one-shot kill + slow army arcs
- `e5a0335` — Add recenter button + handler
- `9eeda82` — Wire flower GLB animations
- `2ac4a76` — Collision tuning: stem-only colliders + 0.3m capsule
- `df1890d` — BVH collision: grounded-player capsule physics
- `db3456e` — Fix recenter black void + toast + haptic
- `bcb1285` — Graceful BVH fallback
- `885bcfb` — Add three-mesh-bvh to oz deps
- `78ecfbf` — Better Auth: @webxr/auth package + accounts hub + oz integration
- `0beaf3e` — Fix: dynamic import auth client in oz page
- `4be828c` — Email verification + password reset + notifications
- `4d97686` — Fix Dorothy falling through floor
- `4f89574` — Restore ssr.external for better-auth
- `ecb5dfe` — Fix boss defeat: one-shot kill with defeated GLB + rogue lock release
- `eef3194` — Fix recenter button wiring
- `9212e22` — Fix WASD + trackpad look + Dorothy 4m + Flower-Tall 9m
- `d1c10d8` — Fix site app auth integration
- `989d1a6` — Add all dev ports to trusted origins

---

## Outstanding

1. **Click-to-shoot verification** — still not visually confirmed end-to-end (WebGL keeps crashing in headless browser). Logic is sound but unverified.
2. **Army monkey mesh swap verification** — code wired, never visually confirmed.
3. **Collision tuning** — stem colliders need real gameplay testing on production.
4. **BETTER_AUTH_SECRET length warning** — current secret may be too short (<32 chars).
