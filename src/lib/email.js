// src/lib/email.js

/**
 * Sends an email via Mailgun using fetch (Optimized for Cloudflare Workers)
 */
export async function sendEmail(emailData, env) {
    const { from, to, subject, text, html } = emailData;
    
    // 1. Validate Env Variables
    const apiKey = env.MAILGUN_API_KEY;
    const domain = env.MAILGUN_DOMAIN; // e.g., 'mg.pinchepoutine.digital'

    if (!apiKey || !domain) {
        console.error('Missing MAILGUN_API_KEY or MAILGUN_DOMAIN in env');
        return false;
    }

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);
    formData.append('html', html);

    try {
        // 3. Send to Mailgun API
        const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Mailgun API Error:', errorText);
            return false;
        }

        const result = await response.json();
        console.log('Mailgun Success:', result.id);
        return true;

    } catch (error) {
        console.error('Network Error sending email:', error);
        return false;
    }
}
