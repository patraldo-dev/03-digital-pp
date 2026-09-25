// src/routes/api/contact/+server.js

import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';

const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 5;

/**
 * @typedef {Object} RateCounter
 * @property {number} count
 * @property {number} reset
 */

/**
 * @param {Request} request
 * @param {KVNamespace} kv
 * @param {number} now
 * @returns {Promise<{ allowed: boolean; message?: string; counter: RateCounter }>}
 */
async function checkRateLimit(request, kv, now) {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const key = `contact:${ip}`;
    const windowStart = now - WINDOW_MS;
    
    /** @type {RateCounter | null} */
    const counterData = await kv.get(key, { type: 'json' });
    let counter = counterData || { count: 0, reset: now };
    
    if (counter.reset < windowStart) {
        counter = { count: 0, reset: now };
    }
    
    if (counter.count >= MAX_REQUESTS) {
        const wait = Math.ceil((WINDOW_MS - (now - counter.reset)) / 1000);
        return {
            allowed: false,
            message: `Rate limited. Try again in ${wait}s`,
            counter
        };
    }
    
    counter.count += 1;
    counter.reset = now;
    await kv.put(key, JSON.stringify(counter), { expirationTtl: 120 });
    console.log(`Rate limit: ${counter.count}/${MAX_REQUESTS} for ${ip}`);
    
    return { allowed: true, counter };
}

/**
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, platform }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const { CONTACT_EMAIL, MAILGUN_FROM_EMAIL, MAILGUN_DOMAIN, CONTACT_KV } = platform.env;
    
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;
        
        // Validate input
        if (!name || !email || !subject || !message) {
            return json({ error: 'All fields are required' }, { status: 400 });
        }
        
        // Rate limit
        const now = Date.now();
        const rateCheck = await checkRateLimit(request, CONTACT_KV, now);
        if (!rateCheck.allowed) {
            return json({ error: rateCheck.message }, { status: 429 });
        }
        
        // Send email
        const emailHtml = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `;
        
        await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: CONTACT_EMAIL,
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
            html: emailHtml
        }, platform.env);
        
        return json({ success: true, message: 'Email sent successfully' });
        
    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Contact form error:', err);
        return json({ error: err.message || 'Failed to send email' }, { status: 500 });
    }
}
