// src/routes/api/confirm/+server.js
import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { getTranslations } from '$lib/i18n/server.js';

export async function GET({ url, platform, request }) {
    const { MAILGUN_FROM_EMAIL } = platform.env;

    const token = url.searchParams.get('token');

    if (!token) {
        throw redirect(303, '/confirmation-success?error=invalid');
    }

    try {
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // Find subscriber by token
        const subscriber = await platform.env.DB
            .prepare(`
                SELECT id, email, type, token_expires_at, confirmed 
                FROM subscribers 
                WHERE confirmation_token = ?
            `)
            .bind(token)
            .first();

        if (!subscriber) {
            throw redirect(303, '/confirmation-success?error=invalid');
        }

        if (subscriber.confirmed) {
            // Already confirmed
            throw redirect(303, '/confirmation-success?already=true');
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(subscriber.token_expires_at);
        
        if (now > expiresAt) {
            throw redirect(303, '/confirmation-success?error=expired');
        }

        // Confirm the subscription
        await platform.env.DB
            .prepare(`
                UPDATE subscribers 
                SET confirmed = true, confirmed_at = ?, confirmation_token = null, token_expires_at = null
                WHERE id = ?
            `)
            .bind(new Date().toISOString(), subscriber.id)
            .run();

        // Send welcome email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #C94C35; margin: 0;">${t.welcome_title}</h1>
                </div>
                <div style="padding: 20px 0;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        ${t.welcome_body}
                    </p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://pinchepoutine.digital" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ${t.welcome_button}
                    </a>
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                    <p>${t.welcome_footer}</p>
                </div>
            </div>
        `;

        const emailText = `${t.welcome_title}

${t.welcome_body}

${t.welcome_footer}`;

        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: subscriber.email,
            subject: t.welcome_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send welcome email');
        }

        // Redirect to success page
        throw redirect(303, '/confirmation-success');

    } catch (error) {
        if (error.status === 302 || error.status === 303) {
            throw error;
        }
        console.error('Confirmation API error:', error);
        throw redirect(303, '/confirmation-success?error=server');
    }
}
