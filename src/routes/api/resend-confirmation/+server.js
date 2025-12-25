// src/routes/api/resend-confirmation/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js'; // Correct Import
import { getTranslations } from '$lib/i18n/server.js';

export async function POST({ request, platform }) {
    const { 
        MAILGUN_FROM_EMAIL
    } = platform.env;

    try {
        const { email } = await request.json();

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }

        // --- DB LOGIC ---
        // Logic to generate/lookup token for this user
        // const token = await db.generateToken(email);
        const token = "mock-token-xyz"; // Mock
        
        const confirmUrl = `https://pinchepoutine.digital/api/confirm?token=${token}&email=${email}`;

        // 1. Load Translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // 2. Build Email Content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                
                <!-- Header -->
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #C94C35; margin: 0;">${t.resend_title}</h1>
                </div>

                <!-- Body -->
                <div style="padding: 20px 0;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        ${t.resend_body}
                    </p>
                </div>

                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmUrl}" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ${t.resend_button}
                    </a>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                    <p>${t.resend_footer}</p>
                    <p>${confirmUrl}</p>
                </div>
            </div>
        `;

        const emailText = `
 ${t.resend_title}

 ${t.resend_body}

 ${t.resend_button}: ${confirmUrl}

 ${t.resend_footer}
        `;

        // 3. Send Email
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email,
            subject: t.resend_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            return json({ error: 'Failed to send email' }, { status: 500 });
        }

        return json({ success: true, message: 'Confirmation link sent!' });

    } catch (error) {
        console.error('Resend confirmation error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
