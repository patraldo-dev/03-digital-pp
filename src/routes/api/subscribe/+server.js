// src/routes/api/subscribe/+server.js

import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);
}

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
        const { email, type = 'newsletter' } = data;
        
        if (!email || !isValidEmail(email)) {
            return json({ error: 'Invalid email address' }, { status: 400 });
        }
        
        // Check if email already exists
        const existingSubscriber = await DB
            .prepare('SELECT * FROM subscribers WHERE email = ? AND type = ?')
            .bind(email, type)
            .first();
            
        if (existingSubscriber) {
            if (existingSubscriber.active) {
                return json({ 
                    success: false, 
                    message: 'Email already subscribed' 
                }, { status: 400 });
            }
            
            // Case: Pending confirmation - update token and resend
            const token = uuidv4();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            
            await DB
                .prepare(`
                    UPDATE subscribers 
                    SET confirmation_token = ?, token_expires_at = ?
                    WHERE email = ? AND type = ?
                `)
                .bind(token, expiresAt.toISOString(), email, type)
                .run();
                
            // Get translations
            const lang = existingSubscriber.lang || 'en';
            const { t } = await import(`$lib/i18n/locales/${lang}.json`);
            
            const emailHtml = `
                <h1>${t.confirm_title || 'Confirm Your Subscription'}</h1>
                <p>${t.confirm_body || 'Please confirm your subscription by clicking the link below:'}</p>
                <p><a href="https://yoursite.com/api/confirm?token=${token}">${t.confirm_button || 'Confirm Subscription'}</a></p>
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
        }
        
        // Case: New subscriber
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const lang = 'en'; // Could detect from request
        
        await DB
            .prepare(`
                INSERT INTO subscribers (email, type, confirmation_token, token_expires_at, active, lang)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .bind(email, type, token, expiresAt.toISOString(), false, lang)
            .run();
            
        const { t } = await import(`$lib/i18n/locales/${lang}.json`);
        
        const emailHtml = `
            <h1>${t.confirm_title || 'Confirm Your Subscription'}</h1>
            <p>${t.confirm_body || 'Please confirm your subscription by clicking the link below:'}</p>
            <p><a href="https://yoursite.com/api/confirm?token=${token}">${t.confirm_button || 'Confirm Subscription'}</a></p>
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
            message: 'Subscription created. Please check your email to confirm.' 
        });
        
    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Subscribe error:', err);
        return json({ 
            success: false, 
            message: 'Failed to process subscription' 
        }, { status: 500 });
    }
}
