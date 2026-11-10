import { getTranslations } from '#lib/i18n/index.js';
import { env } from 'cloudflare:workers';

export async function load({ request }) {
    const { lang, t } = await getTranslations(request);
    
    return {
        lang,
        t,
        // public by design — the SECRET is a wrangler secret, never shipped
        turnstileSiteKey: env?.TURNSTILE_SITE_KEY || ''
    };
}
