// src/routes/contact/+server.js
export async function POST({ request, getClientAddress }) {
  const formData = await request.formData();
  const subject = formData.get('subject')?.toString() || '';
  
  // Block gibberish/random subjects
  if (/^[a-zA-Z]{10,}$/.test(subject) || subject.length < 3) {
    return new Response('Spam detected', { status: 403 });
  }
  
  // Rate limit per IP (use KV or D1)
  // Proceed to Mailgun...
}

