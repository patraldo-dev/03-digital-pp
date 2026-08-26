// src/lib/email.js
/**
 * Send an email using Mailgun API
 * @param {Object} emailData - Email data
 * @param {string} emailData.from - Sender email address
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject line
 * @param {string} emailData.text - Plain text content
 * @param {string} [emailData.html] - HTML content (optional)
 * @param {App.Platform['env']} env - Cloudflare environment
 * @returns {Promise<Object>} Mailgun API response
 * @throws {Error} If configuration is missing or API call fails
 */
export async function sendEmail(emailData, env) {
    const { from, to, subject, text, html } = emailData;
    
    const apiKey = env.MAILGUN_API_KEY;
    const domain = env.MAILGUN_DOMAIN;

    if (!apiKey || !domain) {
        console.error('Missing MAILGUN_API_KEY or MAILGUN_DOMAIN in env');
        throw new Error('Missing MAILGUN_API_KEY or MAILGUN_DOMAIN in env');
    }

    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', text);
    if (html) {
        formData.append('html', html);
    }

    try {
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
            throw new Error(`Mailgun API Error: ${errorText}`);
        }

        const result = await response.json();
        console.log('Mailgun Success:', result.id);
        return result;

    } catch (error) {
        console.error('Network Error sending email:', error);
        throw new Error('Network Error sending email');
    }
}
