import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';

export async function POST({ request, platform }) {
    // Access environment variables from platform.env
    const { 
        MAILGUN_FROM_EMAIL,
        CONTACT_EMAIL 
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
        const { name, email, subject, message } = await request.json();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }
        
        // Prepare email content - SIMPLIFIED
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> 
                        <a href="mailto:${email}" style="color: #007cba;">${email}</a>
                    </p>
                    <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #333;">Message:</h3>
                    <div style="background: white; padding: 15px; border-left: 4px solid #007cba; margin: 10px 0;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
                    <p>This message was sent via your website contact form on ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        const emailText = `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleString()}
        `;

        // Use the centralized email function
        const emailSent = await sendEmail({
            from: MAILGUN_FROM_EMAIL,  // This should be something like "contact@pinchepoutine.digital"
            to: CONTACT_EMAIL,         // This should be a valid email like "patrouch@gmail.com"
            subject: `Contact Form: ${subject}`,
            text: emailText,
            html: emailHtml
        }, platform.env);

        if (!emailSent) {
            console.error('Failed to send contact form email');
            return json(
                { error: 'Failed to send message. Please try again later.' },
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
            message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
