// src/routes/contact/+server.js
import { json, error } from '@sveltejs/kit';

const RATE_LIMIT_KEY = 'contact-form';
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

export const POST = async ({ request, getClientAddress, platform }) => {
  // Rate limiting with KV
  const ip = getClientAddress();
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const kv = platform?.env?.CONTACT_KV; 
  
  if (kv) {
    const key = `${RATE_LIMIT_KEY}:${ip}`;
    let counter = await kv.get(key, { type: 'json' }) || { count: 0, reset: now };
    
    if (counter.reset < windowStart) {
      counter = { count: 0, reset: now };
    }
    
    if (counter.count >= MAX_REQUESTS) {
      throw error(429, `Rate limited. Try again in ${(WINDOW_MS - (now - counter.reset)) / 1000 | 0}s`);
    }
    
    counter.count += 1;
    counter.reset = now;
    await kv.put(key, JSON.stringify(counter), { expirationTtl: 120 });
  }

  // Spam filter
  const formData = await request.formData();
  const subject = formData.get('subject')?.toString() || '';
  
  if (/^[a-zA-Z]{10,}$/.test(subject) || subject.length < 3) {
    throw error(403, 'Spam detected');
  }

  // TODO: Add your Mailgun integration here
  console.log('Legit form from', ip, 'Subject:', subject);
  
  return json({ success: true, subject, message: 'Form processed successfully' });
};

