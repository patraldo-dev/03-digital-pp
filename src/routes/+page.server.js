// src/routes/+page.server.js
import { getTranslations } from '$lib/i18n/server.js';

export async function load({ request, fetch }) {
    try {
        // 1. Get I18n data
        const i18n = await getTranslations(request);
        
        // DEBUG: Log to your terminal to verify data is loading
        console.log('Loaded Language:', i18n.lang);
        console.log('Translation Keys:', Object.keys(i18n.t).length);

        // 2. Fetch Recent Posts
        let recentPosts = [];
        try {
            // Keep your existing fetch logic or the mock data below
            recentPosts = [
                { 
                    slug: 'animating-with-ffmpeg', 
                    title: 'Animating Static Drawings', 
                    excerpt: 'Using Wan Video and FFMPEG on Chromebooks for high-quality animations.', 
                    date: new Date().toISOString() 
                }
            ];
        } catch (e) {
            console.error("Error loading posts", e);
        }

        return {
            lang: i18n.lang,
            t: i18n.t, // This must be present
            recentPosts: recentPosts
        };
    } catch (err) {
        console.error("Critical Error in +page.server.js:", err);
        // Return a fallback so the app doesn't crash
        return {
            lang: 'en',
            t: { hero_title: 'Error loading data', hero_subtitle: 'Check server logs' },
            recentPosts: []
        };
    }
}
