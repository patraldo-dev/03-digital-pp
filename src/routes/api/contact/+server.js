// src/routes/api/contact/+server.js - COMPLETE FILE WITH SPAM PROTECTION
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { getTranslations } from '$lib/i18n/server.js';

export async function POST({ request, getClientAddress, platform }) {
    // Access environment variables
    const { 
        MAILGUN_FROM_EMAIL,
        CONTACT_EMAIL,
        MAILGUN_API_KEY,
        MAILGUN_DOMAIN
    } = platform.env;

    // CRITICAL: Validate environment variables
    if (!MAILGUN_FROM_EMAIL || !CONTACT_EMAIL) {
        console.error('Missing required environment variables');
        return json(
            { error: 'Server configuration error. Please try again later.' },
            { status: 500 }
        );
    }

    // === NEW: RATE LIMITING ===
    const RATE_LIMIT_KEY = 'contact-form';
    const MAX_REQUESTS = 5;
    const WINDOW_MS = 60 * 1000;
    const ip = getClientAddress();
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const kv = platform?.env?.contact_form;
    
    if (kv) {
        const key = `${RATE_LIMIT_KEY}:${ip}`;
        let counter = await kv.get(key, { type: 'json' }) || { count: 0, reset: now };
        if (counter.reset < windowStart) counter = { count: 0, reset: now };
        if (counter.count >= MAX_REQUESTS) {
            return json({ error: `Rate limited. Try again in ${(WINDOW_MS - (now - counter.reset)) / 1000 | 0}s` }, { status: 429 });
        }
        counter.count += 1;
        counter.reset = now;
        await kv.put(key, JSON.stringify(counter), { expirationTtl: 120 });
        console.log(`Rate limit: ${counter.count}/5 for ${ip}`);
    }

    try {
        // === NEW: PARSE JSON + SPAM CHECKS ===
        const jsonData = await request.json();
        const honeypot = jsonData.website || '';
        if (honeypot) {
            console.log('Honeypot triggered by bot:', ip);
            return json({ error: 'Bot detected' }, { status: 403 });
        }
        
        const { name, email, subject, message } = jsonData;
        
        // Subject spam filter
        if (/^[a-zA-Z]{10,}$/.test(subject) || subject.length < 3) {
            console.log('Spam subject blocked:', subject, 'from', ip);
            return json({ error: 'Spam detected' }, { status: 403 });
        }

        // 1. Load Translations
        const i18n = await getTranslations(request);
        const t = i18n.t;

        // Basic validation (your existing)
        if (!name || !email || !subject || !message) {
            return json(
                { error: t.contact_error_missing_fields || 'All fields are required' },
                { status: 400 }
            );
        }
        
        // Email validation (your existing)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: t.contact_error_invalid_email || 'Please enter a valid email address' },
                { status: 400 }
            );
        }
        
        // Prepare email content - Translated HTML (your existing)
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

        // Send email using the helper function (your existing)
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
            ip,
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

