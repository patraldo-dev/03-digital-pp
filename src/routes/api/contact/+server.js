// src/routes/api/contact/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js'; // Import the function we just fixed above
import { getTranslations } from '$lib/i18n/server.js';

export async function POST({ request, platform }) {
    // Access environment variables
    const { 
        MAILGUN_FROM_EMAIL,
        CONTACT_EMAIL,
        MAILGUN_API_KEY,      // Required for the helper
        MAILGUN_DOMAIN         // Required for the helper
    } = platform.env;

    // CRITICAL: Validate environment variables
    if (!MAILGUN_FROM_EMAIL || !CONTACT_EMAIL) {
        console.error('Missing required environment variables');
        return json(
            { error: 'Server configuration error. Please try again later.' },
            { status: 500 }
        );
    }

    try {
        // 1. Load Translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        const { name, email, subject, message } = await request.json();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return json(
                { error: t.contact_error_missing_fields || 'All fields are required' },
                { status: 400 }
            );
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: t.contact_error_invalid_email || 'Please enter a valid email address' },
                { status: 400 }
            );
        }
        
        // Prepare email content - Translated HTML
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px;">
                    ${t.email_header_title}
                </h2>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>${t.email_label_from}:</strong> ${name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> 
                        <a href="mailto:${email}" style="color: #007cba;">${email}</a>
                    </p>
                    <p style="margin: 10px 0;"><strong>${t.email_label_subject}:</strong> ${subject}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #333;">${t.email_label_message}:</h3>
                    <div style="background: white; padding: 15px; border-left: 4px solid #007cba; margin: 10px 0;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
                    <p>${t.email_footer_text} ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        const emailText = `
 ${t.email_header_title}

 ${t.email_label_from}: ${name}
Email: ${email}
 ${t.email_label_subject}: ${subject}

 ${t.email_label_message}:
 ${message}

 ${t.email_footer_text} ${new Date().toLocaleString()}
        `;

        // Send email using the helper function
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: CONTACT_EMAIL,
            subject: `${t.email_subject_line}: ${subject}`,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send contact form email');
            return json(
                { error: t.contact_error_send_failed || 'Failed to send message. Please try again later.' },
                { status: 500 }
            );
        }

        console.log('Contact form email sent successfully:', {
            name,
            email,
            subject,
            timestamp: new Date().toISOString()
        });
        
        return json({
            message: t.contact_success_message || 'Thank you! Your message has been sent successfully.'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
