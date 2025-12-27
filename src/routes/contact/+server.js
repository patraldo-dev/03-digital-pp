// src/routes/contact/+server.js
import { json, error } from '@sveltejs/kit';
import { MAILGUN_API_KEY } from '$env/static/private';

const RATE_LIMIT_KEY = 'contact-form';
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000;

export const POST = async ({ request, getClientAddress, platform }) => {
  // Rate limiting
  const ip = getClientAddress();
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const kv = platform?.env?.contact_form;
  
  if (kv) {
    const key = `${RATE_LIMIT_KEY}:${ip}`;
    let counter = await kv.get(key, { type: 'json' }) || { count: 0, reset: now };
    if (counter.reset < windowStart) counter = { count: 0, reset: now };
    if (counter.count >= MAX_REQUESTS) {
      throw error(429, `Rate limited. Try again in ${(WINDOW_MS - (now - counter.reset)) / 1000 | 0}s`);
    }
    counter.count += 1;
    counter.reset = now;
    await kv.put(key, JSON.stringify(counter), { expirationTtl: 120 });
  }

  // Parse form
  const formData = await request.formData();
  const subject = formData.get('subject')?.toString() || '';
  const name = formData.get('name')?.toString() || 'Anonymous';
  const email = formData.get('email')?.toString() || '';
  const message = formData.get('message')?.toString() || '';

  // Spam filter
  if (/^[a-zA-Z]{10,}$/.test(subject) || subject.length < 3) {
    throw error(403, 'Spam detected');
  }

  // Send via Mailgun
  const mailgunData = {
    from: `Contact Form <noreply@pinchepoutine.digital>`,
    to: 'contact@pinchepoutine.digital',
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  const response = await fetch('https://api.mailgun.net/v3/pinchepoutine.digital/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa('api:' + MAILGUN_API_KEY)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(mailgunData)
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Mailgun error:', err);
    throw error(500, 'Email failed to send');
  }

  return json({ success: true, message: 'Email sent successfully!' });
};

