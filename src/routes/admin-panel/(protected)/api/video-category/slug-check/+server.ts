import { authFetch } from '$lib/server/api-auth';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const res = await authFetch(
		cookies,
		fetch,
		`/video-category/slug-check?${url.searchParams.toString()}`
	);

	return new Response(res.body, {
		status: res.status,
		headers: { 'content-type': 'application/json' }
	});
};
