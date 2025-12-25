// src/routes/api/subscribe/+server.js
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
            return json({
                success: false,
                message: 'Email is required'
            }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                success: false,
                message: 'Invalid email format'
            }, { status: 400 });
        }

        // --- DB LOGIC (Token Generation) ---
        // Check if exists, insert into DB, generate token using crypto or DB logic.
        // I am assuming this logic exists in your file. 
        // For this example, we mock the token:
        const token = "mock-generated-token"; 
        
        const confirmUrl = `https://pinchepoutine.digital/api/confirm?token=${token}&email=${email}`;

        // 1. Load Translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // 2. Build Email Content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                
                <!-- Header -->
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #C94C35; margin: 0;">${t.subscribe_title}</h1>
                </div>

                <!-- Body -->
                <div style="padding: 20px 0;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        ${t.subscribe_body}
                    </p>
                </div>

                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmUrl}" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ${t.subscribe_button}
                    </a>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                    <p>${t.subscribe_footer}</p>
                    <p>${confirmUrl}</p>
                </div>
            </div>
        `;

        const emailText = `
 ${t.subscribe_title}

 ${t.subscribe_body}

 ${t.subscribe_button}: ${confirmUrl}

 ${t.subscribe_footer}
        `;

        // 3. Send Email
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email,
            subject: t.subscribe_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            return json({
                success: false,
                message: 'Failed to send confirmation email'
            }, { status: 500 });
        }

        return json({
            success: true,
            message: 'Please check your email to confirm your subscription.'
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        return json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}
