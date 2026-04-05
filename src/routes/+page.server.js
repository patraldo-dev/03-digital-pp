// src/routes/+page.server.js
import { getTranslations } from '$lib/i18n/server.js';

export async function load({ request, fetch }) {
    try {
        // 1. Get I18n data
        const i18n = await getTranslations(request);
        
        // DEBUG: Log to your terminal to verify data is loading
        console.log('Loaded Language:', i18n.lang);
        console.log('Translation Keys:', Object.keys(i18n.t).length);

        return {
            lang: i18n.lang,
            t: i18n.t
        };
    } catch (err) {
        console.error("Critical Error in +page.server.js:", err);
        // Return a fallback so the app doesn't crash
        return {
            lang: 'en',
            t: { hero_title: 'Error loading data', hero_subtitle: 'Check server logs' }
        };
    }
}
