// src/routes/api/confirm/+server.js
import { json, redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js'; // Correct Import
import { getTranslations } from '$lib/i18n/server.js';

export async function GET({ url, platform, request }) {
    const { 
        MAILGUN_FROM_EMAIL,
        CONTACT_EMAIL 
    } = platform.env;

    // 1. Get parameters from URL (e.g., /confirm?token=xyz&email=user@example.com)
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token || !email) {
        return json({ error: 'Invalid confirmation link' }, { status: 400 });
    }

    // --- DB VALIDATION HERE ---
    // Use your Lucia/D1 logic here to verify the token.
    // Example:
    // const user = await db.query('SELECT * FROM users WHERE token = ?', [token]);
    // if (!user) { return json({ error: 'Invalid token' }, { status: 400 }); }
    // if (user.email !== email) { return json({ error: 'Email mismatch' }, { status: 400 }); }
    
    // For now, we assume validation passed for the sake of the i18n example.
    // -----------------------------------------------------------------

    try {
        // 2. Load Translations (Detects language from cookie/header)
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // 3. Build Welcome Email Content (Translated)
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                
                <!-- Header -->
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #C94C35; margin: 0;">${t.welcome_title}</h1>
                </div>

                <!-- Body -->
                <div style="padding: 20px 0;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        ${t.welcome_body}
                    </p>
                </div>

                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://pinchepoutine.digital" style="background-color: #C94C35; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ${t.welcome_button}
                    </a>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                    <p>${t.welcome_footer}</p>
                </div>
            </div>
        `;

        const emailText = `
 ${t.welcome_title}

 ${t.welcome_body}

 ${t.welcome_footer}
        `;

        // 4. Send Welcome Email
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email, // Send welcome email TO the user, not to CONTACT_EMAIL
            subject: t.welcome_subject,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send welcome email');
            return json({ error: 'Confirmation successful, but welcome email failed.' }, { status: 500 });
        }

        // 5. Redirect user to success page or return JSON
        // return redirect('/confirmation-success'); 
        return json({ success: true, message: 'Email confirmed successfully!' });

    } catch (error) {
        console.error('Confirmation API error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
