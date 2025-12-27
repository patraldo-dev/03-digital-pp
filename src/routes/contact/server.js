// src/routes/contact/+server.js
import { json, error } from '@sveltejs/kit';

export async function POST({ request, getClientAddress }) {
  const formData = await request.formData();
  const subject = formData.get('subject')?.toString() || '';
  
  // Spam block: gibberish subjects
  if (/^[a-zA-Z]{10,}$/.test(subject) || subject.length < 3) {
    throw error(403, 'Spam detected');
  }
  
  // Add your Mailgun code here...
  console.log('Legit form:', subject);
  
  return json({ success: true });
}

