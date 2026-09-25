import { sendWeeklyEventUpdates } from './hooks.server.js';

/**
 * Handle scheduled events (cron triggers)
 * This function is called by Cloudflare Workers when cron triggers fire
 * @param {ScheduledEvent} event - The scheduled event
 * @param {Object} env - Environment variables
 * @param {ExecutionContext} ctx - Execution context
 */
export async function scheduled(event, env, ctx) {
	console.log('Scheduled event triggered:', event.cron);
	
	// Wait for the email sending to complete
	ctx.waitUntil(sendWeeklyEventUpdates(env));
}
