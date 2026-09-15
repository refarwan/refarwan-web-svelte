import { authFetch } from '$lib/server/api-auth';

import type { RequestHandler } from './$types';

/**
 * Streams the browser's multipart video upload straight through to the Hono
 * API without buffering it in SvelteKit, so the client's XHR upload-progress
 * events reflect the real transfer instead of an instant server-side buffer.
 */
export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	const contentType = request.headers.get('content-type') ?? '';

	const res = await authFetch(cookies, fetch, '/video', {
		method: 'POST',
		headers: { 'content-type': contentType },
		body: request.body,
		duplex: 'half'
	} as RequestInit);

	return new Response(res.body, {
		status: res.status,
		headers: { 'content-type': 'application/json' }
	});
};
