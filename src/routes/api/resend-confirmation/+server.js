// src/routes/api/resend-confirmation/+server.js

import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, platform }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const { DB, MAILGUN_FROM_EMAIL } = platform.env;
    
    try {
        const data = await request.json();
        const { email } = data;
        
        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }
        
        // Find subscriber
        const subscriber = await DB
            .prepare('SELECT * FROM subscribers WHERE email = ?')
            .bind(email)
            .first();
            
        if (!subscriber) {
            return json({ error: 'Email not found' }, { status: 404 });
        }
        
        if (subscriber.active) {
            return json({ error: 'Email already confirmed' }, { status: 400 });
        }
        
        // Generate new token
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        await DB
            .prepare(`
                UPDATE subscribers 
                SET confirmation_token = ?, token_expires_at = ?
                WHERE email = ?
            `)
            .bind(token, expiresAt.toISOString(), email)
            .run();
        
        // Send confirmation email
        const lang = subscriber.lang || 'en';
        const { t } = await import(`$lib/i18n/locales/${lang}.json`);
        
        const emailHtml = `
            <h1>${t.confirm_title || 'Confirm Your Subscription'}</h1>
            <p>${t.confirm_body || 'Please confirm your subscription by clicking the link below:'}</p>
            <p><a href="https://yoursite.com/api/confirm?token=${token}">${t.confirm_button || 'Confirm Subscription'}</a></p>
            <hr>
            <small>This link expires in 24 hours.</small>
        `;
        
        await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email,
            subject: t.confirm_subject || 'Confirm your subscription',
            text: `Please confirm your subscription: https://yoursite.com/api/confirm?token=${token}`,
            html: emailHtml
        }, platform.env);
        
        return json({ 
            success: true, 
            message: 'Confirmation email resent' 
        });
        
    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Resend confirmation error:', err);
        return json({ 
            success: false, 
            message: 'Failed to resend confirmation' 
        }, { status: 500 });
    }
}
