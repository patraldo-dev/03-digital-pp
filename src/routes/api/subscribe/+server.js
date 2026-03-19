// src/routes/api/subscribe/+server.js
import { sendEmail } from '$lib/email.js';
import { getTranslations } from '$lib/i18n/server.js';

export async function POST({ request, platform, url }) {
    try {
        const { email, type } = await request.json();
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // Validation
        if (!email || !isValidEmail(email)) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    message: t.subscribe_form_error_empty || 'Please enter a valid email address' 
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!type || !['newsletter', 'events'].includes(type)) {
            return new Response(
                JSON.stringify({ 
                    success: false,
                    message: t.subscribe_error_invalid_type || 'Invalid subscription type' 
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if email already exists
        const existingSubscriber = await platform.env.DB
            .prepare('SELECT * FROM subscribers WHERE email = ? AND type = ?')
            .bind(email, type)
            .first();

        // Generate token and expiration
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const confirmationUrl = `${url.origin}/api/confirm?token=${token}`;

        // Handle different subscription states
        if (existingSubscriber) {
            // Case 1: Already confirmed
            if (existingSubscriber.confirmed) {
                return new Response(
                    JSON.stringify({ 
                        success: false,
                        message: t.subscribe_error_already_subscribed || 'You are already subscribed.',
                        status: 'confirmed'
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Case 2: Pending confirmation - update token
            await platform.env.DB
                .prepare(`
                    UPDATE subscribers 
                    SET confirmation_token = ?, token_expires_at = ?
                    WHERE email = ? AND type = ?
                `)
                .bind(token, expiresAt.toISOString(), email, type)
                .run();
        } else {
            // Case 3: New subscriber - insert record
            await platform.env.DB
                .prepare(`
                    INSERT INTO subscribers (email, type, confirmation_token, token_expires_at, confirmed, created_at)
                    VALUES (?, ?, ?, ?, false, ?)
                `)
                .bind(email, type, token, expiresAt.toISOString(), new Date().toISOString())
                .run();
        }

        // Build email content
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
            from: platform.env.MAILGUN_FROM_EMAIL,
            to: email,
            subject: t.subscribe_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send confirmation email');
            return new Response(
                JSON.stringify({ 
                    success: false,
                    message: t.subscribe_error_email_failed || 'Failed to send confirmation email' 
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ 
                success: true,
                message: t.subscribe_success_message || 'Please check your email to confirm your subscription!',
                status: 'pending'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Subscription error:', error);
        return new Response(
            JSON.stringify({ 
                success: false,
                message: t.subscribe_error_server || 'Failed to process subscription' 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);
}

function generateToken() {
    const tokenArray = new Uint8Array(32);
    crypto.getRandomValues(tokenArray);
    return Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
}
