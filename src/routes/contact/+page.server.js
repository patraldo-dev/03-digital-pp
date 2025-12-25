// src/routes/contact/+page.server.js
import { getTranslations } from '$lib/i18n/server.js';

export async function load({ request }) {
    const i18n = await getTranslations(request);
    return {
        lang: i18n.lang,
        t: i18n.t
    };
}
