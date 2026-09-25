import { sendEmail as sendMailgunEmail } from '$lib/email.js';
import { getLocaleFromRequest } from '$lib/i18n/server.js';

/**
 * SvelteKit server hooks
 */

/**
 * Handle hook to set locale for each request
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
    const lang = getLocaleFromRequest(event.request);
    event.locals.lang = lang;

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang)
    });
}

/**
 * Send weekly event updates to event subscribers
 * @param {App.Platform['env']} env - Environment variables
 * @returns {Promise<void>}
 */
async function sendWeeklyEventUpdates(env) {
    try {
        // Type the subscriber query result
        /** @type {import('@cloudflare/workers-types').D1Result<{ email: string }>} */
        const subscribers = await env.DB
            .prepare('SELECT email FROM subscribers WHERE type = ? AND active = true')
            .bind('events')
            .all();

        console.log(`Sending weekly updates to ${subscribers.results.length} event subscribers`);

        for (const subscriber of subscribers.results) {
            try {
                await sendMailgunEmail({
                    from: env.CONTACT_EMAIL,
                    to: subscriber.email,
                    subject: '🎪 This Week\'s Events!',
                    text: 'Check out what\'s happening this week in our events calendar.',
                    html: `
                        <h1>🎪 This Week's Events</h1>
                        <p>Here's what's happening this week:</p>
                        <ul>
                            <li>📅 Monday: Community Meetup</li>
                            <li>🎨 Wednesday: Design Workshop</li>
                            <li>🍕 Friday: Pizza & Code Night</li>
                        </ul>
                        <p>See you there!</p>
                        <hr>
                        <small><a href="https://yoursite.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Unsubscribe</a></small>
                    `
                }, env);
            } catch (/** @type {unknown} */ error) {
                const err = /** @type {Error} */ (error);
                console.error('Failed to send weekly update to:', subscriber.email, err.message);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Failed to send weekly event updates:', error);
    }
}

/**
 * Send newsletter to newsletter subscribers
 * @param {App.Platform['env']} env - Environment variables
 * @param {string} subject - Newsletter subject
 * @param {string} content - Newsletter content
 * @returns {Promise<void>}
 */
async function sendNewsletter(env, subject, content) {
    try {
        /** @type {import('@cloudflare/workers-types').D1Result<{ email: string }>} */
        const subscribers = await env.DB
            .prepare('SELECT email FROM subscribers WHERE type = ? AND active = true')
            .bind('newsletter')
            .all();

        console.log(`Sending newsletter to ${subscribers.results.length} subscribers`);

        for (const subscriber of subscribers.results) {
            try {
                await sendMailgunEmail({
                    from: env.CONTACT_EMAIL,
                    to: subscriber.email,
                    subject: subject,
                    text: content,
                    html: `
                        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                            ${content}
                            <hr style="margin: 2rem 0;">
                            <small>
                                <a href="https://yoursite.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">
                                    Unsubscribe
                                </a>
                            </small>
                        </div>
                    `
                }, env);
            } catch (/** @type {unknown} */ error) {
                const err = /** @type {Error} */ (error);
                console.error('Failed to send newsletter to:', subscriber.email, err.message);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Failed to send newsletter:', error);
    }
}

export { sendWeeklyEventUpdates, sendNewsletter };
