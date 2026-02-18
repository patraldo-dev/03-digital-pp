import { getTranslations } from '$lib/i18n/index.js';

export async function load({ request }) {
    const { lang, t } = await getTranslations(request);
    
    return {
        lang,
        t
    };
}
