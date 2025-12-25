// src/lib/i18n/server.js

/**
 * Determines the locale based on the request.
 * Checks for a 'lang' cookie first, then falls back to Accept-Language header.
 * Defaults to 'en'.
 */
function getLocaleFromRequest(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/lang=([^;]+)/);
    const cookieLang = match ? match[1] : null;

    if (cookieLang && ['en', 'fr', 'es'].includes(cookieLang)) {
        return cookieLang;
    }

    const acceptLanguage = request.headers.get('accept-language') || '';
    if (acceptLanguage.startsWith('fr')) return 'fr';
    if (acceptLanguage.startsWith('es')) return 'es';

    return 'en';
}

/**
 * Loads the translations for the current request.
 */
export async function getTranslations(request) {
    const locale = getLocaleFromRequest(request);
    
    // Dynamic import of the JSON file
    const translations = await import(`./locales/${locale}.json`);
    
    return {
        lang: locale,
        t: translations.default // The flattened JSON object
    };
}
