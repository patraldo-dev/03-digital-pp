// src/routes/api/subscribe/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { getTranslations } from '$lib/i18n/server.js';

export async function POST({ request, platform, url }) {
    const { MAILGUN_FROM_EMAIL } = platform.env;

    try {
        const { email, type } = await request.json();

        // Validation
        if (!email || !type) {
            return json({
                success: false,
                message: 'Email and type are required'
            }, { status: 400 });
        }

        if (!['newsletter', 'events'].includes(type)) {
            return json({
                success: false,
                message: 'Invalid subscription type'
            }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                success: false,
                message: 'Invalid email format'
            }, { status: 400 });
        }

        // Load translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // Check if email already exists and is confirmed
        const existingSubscriber = await platform.env.DB
            .prepare('SELECT id, confirmed FROM subscribers WHERE email = ? AND type = ?')
            .bind(email, type)
            .first();

        if (existingSubscriber?.confirmed) {
            return json({
                success: false,
                message: t.subscribe_error_already_subscribed || `Email already subscribed to ${type}`
            }, { status: 409 });
        }

        // Generate confirmation token using Web Crypto API
        const tokenArray = new Uint8Array(32);
        crypto.getRandomValues(tokenArray);
        const confirmationToken = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
        
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // If user exists but not confirmed, update their token
        if (existingSubscriber) {
            await platform.env.DB
                .prepare('UPDATE subscribers SET confirmation_token = ?, token_expires_at = ? WHERE id = ?')
                .bind(confirmationToken, expiresAt.toISOString(), existingSubscriber.id)
                .run();
        } else {
            // Insert new unconfirmed subscriber
            await platform.env.DB
                .prepare(`
                    INSERT INTO subscribers (email, type, confirmation_token, token_expires_at, confirmed, created_at) 
                    VALUES (?, ?, ?, ?, false, ?)
                `)
                .bind(email, type, confirmationToken, expiresAt.toISOString(), new Date().toISOString())
                .run();
        }

        // Create confirmation URL
        const confirmationUrl = `${url.origin}/api/confirm?token=${confirmationToken}`;

        // Load email content with translations
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #C94C35; margin: 0;">${t.subscribe_title}</h1>
                </div>
                <div style="padding: 20px 0;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        ${t.subscribe_body}
                    </p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ${t.subscribe_button}
                    </a>
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                    <p>${t.subscribe_footer}</p>
                </div>
            </div>
        `;

        const emailText = `${t.subscribe_title}

${t.subscribe_body}

${t.subscribe_button}: ${confirmationUrl}

${t.subscribe_footer}`;

        // Send confirmation email
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email,
            subject: t.subscribe_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send confirmation email to:', email);
            return json({
                success: false,
                message: t.subscribe_error_email_failed || 'Failed to send confirmation email'
            }, { status: 500 });
        }

        return json({
            success: true,
            message: t.subscribe_success_message || 'Please check your email to confirm your subscription!'
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return json({
            success: false,
            message: t.subscribe_error_server || 'Failed to process subscription'
        }, { status: 500 });
    }
}
