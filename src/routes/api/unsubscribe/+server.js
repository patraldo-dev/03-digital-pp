// src/routes/api/unsubscribe/+server.js

import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, platform }) {
    if (!platform?.env) {
        return json({ error: 'Platform environment not available' }, { status: 500 });
    }

    const { DB, MAILGUN_FROM_EMAIL } = platform.env;
    
    try {
        const data = await request.json();
        const { email } = data;
        
        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }
        
        // Check if email exists
        const existingSubscriber = await DB
            .prepare('SELECT id FROM subscribers WHERE email = ?')
            .bind(email)
            .first();
            
        if (!existingSubscriber) {
            return json({ error: 'Email not found' }, { status: 404 });
        }
        
        // Mark subscriber as inactive
        await DB
            .prepare('UPDATE subscribers SET active = false WHERE email = ?')
            .bind(email)
            .run();
        
        // Send confirmation email
        const emailHtml = `
            <h1>You've Been Unsubscribed</h1>
            <p>You have been successfully unsubscribed from our mailing list.</p>
            <p>If this was a mistake, you can <a href="https://yoursite.com/subscribe">resubscribe</a> at any time.</p>
        `;
        
        await sendEmail({
            from: MAILGUN_FROM_EMAIL,
            to: email,
            subject: 'Unsubscribed successfully',
            text: 'You have been unsubscribed from our mailing list.',
            html: emailHtml
        }, platform.env);
        
        return json({ 
            success: true, 
            message: 'Successfully unsubscribed' 
        });
        
    } catch (/** @type {unknown} */ error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Unsubscribe error:', err);
        return json({ 
            success: false, 
            message: 'Failed to process unsubscription' 
        }, { status: 500 });
    }
}
