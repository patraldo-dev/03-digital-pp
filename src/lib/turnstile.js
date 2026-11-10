// src/lib/turnstile.js
// Cloudflare Turnstile — spam protection for public forms.
// The sitekey is public by design; it flows: wrangler vars →
// layout server → this store → forms. The SECRET lives as a wrangler
// secret and is used server-side only (siteverify in /api/subscribe).

import { writable } from 'svelte/store';

export const turnstileSiteKey = writable('');

let scriptPromise = null;

/** Load the Turnstile API once, no matter how many forms render. */
export function loadTurnstile() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve(); // form still submits; server verifies
        document.head.appendChild(s);
    });
    return scriptPromise;
}

/**
 * Render a widget into `el`. Resolves with a controller
 * { getToken, reset, remove } or null when Turnstile can't load.
 */
export async function renderWidget(el, siteKey) {
    await loadTurnstile();
    if (!window.turnstile || !siteKey) return null;
    const id = window.turnstile.render(el, {
        sitekey: siteKey,
        theme: 'auto'
    });
    return {
        getToken: () => window.turnstile.getResponse(id),
        reset: () => window.turnstile.reset(id),
        remove: () => window.turnstile.remove(id)
    };
}
