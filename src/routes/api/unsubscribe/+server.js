// src/routes/api/unsubscribe/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { getTranslations } from '$lib/i18n/server.js';

/**
 * @typedef {Object} UnsubscribeRequest
 * @property {string} email - User's email address
 */

/**
 * Handle POST requests for email unsubscriptions
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response
 */
export async function POST({ request, platform }) {
    try {
        // Ensure we have platform environment
        if (!platform?.env) {
            return json({ 
                success: false, 
                message: 'Service temporarily unavailable' 
            }, { status: 500 });
        }

        const { 
            MAILGUN_FROM_EMAIL 
        } = platform.env;

        /** @type {UnsubscribeRequest} */
        const { email } = await request.json();

        // 1. Load Translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // 2. Basic validation (using i18n)
        if (!email) {
            return json({
                success: false,
                message: t.unsubscribe_error_required || 'Email is required'
            }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                success: false,
                message: t.unsubscribe_error_invalid || 'Invalid email format'
            }, { status: 400 });
        }

        // Check if email exists in database
        const existingSubscriber = await platform.env.DB
            .prepare('SELECT id FROM subscribers WHERE email = ?')
            .bind(email)
            .first();

        if (!existingSubscriber) {
            return json({
                success: false,
                message: t.unsubscribe_error_not_found || 'Email address not found in our records'
            }, { status: 404 });
        }

        // Mark subscriber as inactive
        const updateResult = await platform.env.DB
            .prepare('UPDATE subscribers SET active = false WHERE email = ?')
            .bind(email)
            .run();

        if (!updateResult.success) {
            throw new Error('Failed to unsubscribe');
        }

        // 3. Send Goodbye Email (Optional, but polite)
        if (MAILGUN_FROM_EMAIL) {
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <h1 style="color: #C94C35; margin: 0;">${t.goodbye_title}</h1>
                    </div>
                    <div style="padding: 20px 0;">
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            ${t.goodbye_body}
                        </p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://pinchepoutine.digital" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            ${t.goodbye_button}
                        </a>
                    </div>
                </div>
            `;

            const emailText = `
 ${t.goodbye_title}

 ${t.goodbye_body}

 ${t.goodbye_button}: https://pinchepoutine.digital
            `;

            // Send asynchronously (fire and forget, so DB commit happens fast)
            sendEmail({
                from: MAILGUN_FROM_EMAIL,
                to: email,
                subject: t.goodbye_subject,
                text: emailText,
                html: emailHtml
            }, platform.env);
        }

        return json({
            success: true,
            message: t.unsubscribe_success || 'You have been successfully unsubscribed.'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return json({
            success: false,
            message: t.unsubscribe_error_server || 'Failed to process unsubscription'
        }, { status: 500 });
    }
}
