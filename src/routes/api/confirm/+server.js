// src/routes/api/confirm/+server.js

import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';

/**
 * GET /api/confirm - Confirm email subscription
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, platform, request }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const { MAILGUN_FROM_EMAIL, DB } = platform.env;
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'Missing confirmation token' }, { status: 400 });
    }

    try {
        // Find subscriber by token
        const subscriberResult = await DB
            .prepare(`
                SELECT email, type, token_expires_at, lang
                FROM subscribers 
                WHERE confirmation_token = ? AND active = false
            `)
            .bind(token)
            .first();

        if (!subscriberResult) {
            return json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const subscriber = /** @type {{ email: string; type: string; token_expires_at: string; lang: string }} */ (subscriberResult);

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(String(subscriber.token_expires_at));
        if (expiresAt < now) {
            return json({ error: 'Token expired' }, { status: 400 });
        }

        // Confirm the subscription
        await DB
            .prepare(`
                UPDATE subscribers 
                SET active = true, confirmation_token = NULL, confirmed_at = CURRENT_TIMESTAMP
                WHERE email = ?
            `)
            .bind(subscriber.email)
            .run();

        // Get translations for the welcome email
        const lang = subscriber.lang || 'en';
        const translations = await import(`$lib/i18n/locales/${lang}.json`);
        /** @type {Record<string, string>} */
        const t = translations.default || translations;

        // Send welcome email
        const emailHtml = `
            <h1>${t.welcome_title || 'Welcome!'}</h1>
            <p>${t.welcome_body || 'Thank you for confirming your subscription.'}</p>
            <p>${t.welcome_footer || 'You will now receive updates from us.'}</p>
            <hr>
            <small><a href="https://yoursite.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">${t.unsubscribe || 'Unsubscribe'}</a></small>
        `;

        await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: subscriber.email,
            subject: t.welcome_subject || 'Welcome to our newsletter!',
            text: `${t.welcome_title || 'Welcome!'}\n\n${t.welcome_body || 'Thank you for confirming your subscription.'}`,
            html: emailHtml
        }, platform.env);

        return json({ 
            success: true, 
            message: 'Email confirmed successfully!',
            email: subscriber.email
        });

    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Confirmation error:', err);
        return json({ error: err.message || 'Failed to confirm email' }, { status: 500 });
    }
}
