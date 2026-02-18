import { sendEmail as sendMailgunEmail } from '$lib/email.js';
import { getLocaleFromRequest } from '$lib/i18n/server.js';

/**
 * SvelteKit server hooks
 */

/**
 * Handle hook to set locale for each request
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
    const lang = getLocaleFromRequest(event.request);
    event.locals.lang = lang;
    
    const response = await resolve(event);
    return response;
}

/**
 * Send weekly event updates to event subscribers
 * @param {Object} env - Environment variables
 * @returns {Promise<void>}
 */
async function sendWeeklyEventUpdates(env) {
	try {
		// Fetch all active event subscribers
		const subscribers = await env.DB
			.prepare('SELECT email FROM subscribers WHERE type = ? AND active = true')
			.bind('events')
			.all();

		console.log(`Sending weekly updates to ${subscribers.results.length} event subscribers`);

		// Send email to each subscriber
		for (const subscriber of subscribers.results) {
			const emailSent = await sendMailgunEmail({
				to: subscriber.email,
				subject: '🎪 This Week\'s Events!',
				text: 'Check out what\'s happening this week in our events calendar.',
				html: `
					<h1>🎪 This Week's Events</h1>
					<p>Here's what's happening this week:</p>
					<ul>
						<li>📅 Monday: Community Meetup</li>
						<li>🎨 Wednesday: Design Workshop</li>
						<li>🍕 Friday: Pizza & Code Night</li>
					</ul>
					<p>See you there!</p>
					<hr>
					<small><a href="https://yoursite.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Unsubscribe</a></small>
				`
			}, env);

			if (!emailSent) {
				console.error('Failed to send weekly update to:', subscriber.email);
			}

			// Small delay to avoid rate limiting
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	} catch (error) {
		console.error('Failed to send weekly event updates:', error);
	}
}

/**
 * Send newsletter to newsletter subscribers
 * @param {Object} env - Environment variables
 * @param {string} subject - Newsletter subject
 * @param {string} content - Newsletter content
 * @returns {Promise<void>}
 */
async function sendNewsletter(env, subject, content) {
	try {
		const subscribers = await env.DB
			.prepare('SELECT email FROM subscribers WHERE type = ? AND active = true')
			.bind('newsletter')
			.all();

		console.log(`Sending newsletter to ${subscribers.results.length} subscribers`);

		for (const subscriber of subscribers.results) {
			const emailSent = await sendMailgunEmail({
				to: subscriber.email,
				subject: subject,
				text: content,
				html: `
					<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
						${content}
						<hr style="margin: 2rem 0;">
						<small>
							<a href="https://yoursite.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">
								Unsubscribe
							</a>
						</small>
					</div>
				`
			}, env);

			if (!emailSent) {
				console.error('Failed to send newsletter to:', subscriber.email);
			}

			await new Promise(resolve => setTimeout(resolve, 100));
		}
	} catch (error) {
		console.error('Failed to send newsletter:', error);
	}
}

// Export the functions so they can be used in the scheduled handler
export { sendWeeklyEventUpdates, sendNewsletter };
