import { env } from '$env/dynamic/private';

import { getAdminLang } from './admin-lang';
import { getAccessToken, refreshAccessToken } from './auth';

import type { Cookies } from '@sveltejs/kit';

const apiUrl = (): string => env.API_URL || 'http://localhost:3000';

export interface ApiError {
	message: string;
	fieldErrors?: Record<string, string>;
}

/** Calls a Bearer-protected refarwan-api-hono endpoint, refreshing the session once on 401. */
export const authFetch = async (
	cookies: Cookies,
	fetchFn: typeof fetch,
	path: string,
	init: RequestInit = {}
): Promise<Response> => {
	const token = await getAccessToken(cookies, fetchFn);
	if (!token) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	}

	const headers = new Headers(init.headers);
	headers.set('authorization', `Bearer ${token}`);
	headers.set('accept-language', getAdminLang(cookies));

	let res = await fetchFn(`${apiUrl()}${path}`, { ...init, headers });

	if (res.status === 401) {
		const refreshed = await refreshAccessToken(cookies, fetchFn);
		if (refreshed) {
			headers.set('authorization', `Bearer ${refreshed}`);
			res = await fetchFn(`${apiUrl()}${path}`, { ...init, headers });
		}
	}

	return res;
};

/**
 * Hono returns either `{ message }` for business-logic errors, or a flat
 * `{ field: message }` map for valibot schema-validation failures. Normalize both.
 */
export const parseApiError = async (res: Response, fallback: string): Promise<ApiError> => {
	try {
		const body = (await res.json()) as Record<string, unknown>;
		if (typeof body.message === 'string') {
			return { message: body.message };
		}

		const fieldErrors: Record<string, string> = {};
		for (const [key, value] of Object.entries(body)) {
			if (typeof value === 'string') fieldErrors[key] = value;
		}

		const [firstMessage] = Object.values(fieldErrors);
		return { message: firstMessage ?? fallback, fieldErrors };
	} catch {
		return { message: fallback };
	}
};
