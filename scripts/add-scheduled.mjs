// scripts/add-scheduled.mjs
//
// Post-build step: appends a `scheduled` (cron) handler to the worker
// the SvelteKit cloudflare adapter generates.
//
// Why not a custom wrangler `main` entry? adapter-cloudflare writes
// ITS template to whatever path `main` points at (see
// `worker_dest = wrangler_config.main` in the adapter source), so any
// hand-written entry there gets overwritten on every build. Appending
// to the generated file after the fact is the stable seam.
//
// The handler calls the app's own guarded /api/search/reindex route
// through the worker's fetch handler — the search modules use
// `import.meta.glob`, which only the Vite-built server bundle can
// evaluate, so going through HTTP-in-process is the zero-duplication
// path. Auth uses the same SEARCH_ADMIN_TOKEN secret as the manual
// endpoint.
//
// Idempotent: skips if the marker is already present.

import { readFileSync, writeFileSync } from 'node:fs';

const WORKER = '.svelte-kit/cloudflare/_worker.js';
const MARKER = '// [cron-appended]';

const src = readFileSync(WORKER, 'utf-8');
if (src.includes(MARKER)) {
    console.log('add-scheduled: handler already present, skipping');
    process.exit(0);
}
if (!src.includes('worker_default')) {
    console.error('add-scheduled: generated worker shape changed — no worker_default');
    process.exit(1);
}

const handler = `
${MARKER}
// scheduled(): cron-triggered search index refresh (0 */6 * * *).
// Property assignment on the exported default object — works whether
// the runtime resolves handlers from the default export or named
// exports, and runs at module top level before any invocation.
worker_default.scheduled = async function scheduled(controller, env, ctx) {
    try {
        const res = await worker_default.fetch(
            new Request('https://cron.internal/api/search/reindex', {
                method: 'POST',
                headers: { authorization: 'Bearer ' + (env.SEARCH_ADMIN_TOKEN || '') }
            }),
            env,
            ctx
        );
        console.log('[cron] search reindex: ' + res.status + ' ' + (await res.text()));
    } catch (e) {
        console.error('[cron] search reindex failed:', e && e.message);
    }
};
`;

writeFileSync(WORKER, src + handler);
console.log('add-scheduled: appended scheduled() to', WORKER);
