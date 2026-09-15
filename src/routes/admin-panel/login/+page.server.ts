import { env } from '$env/dynamic/private';

import { fail, redirect } from '@sveltejs/kit';

import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { parseApiError } from '$lib/server/api-auth';
import { getAccessToken, startSession } from '$lib/server/auth';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = await getAccessToken(cookies, fetch);
	if (token) redirect(303, '/admin-panel');

	const lang = getAdminLang(cookies);
	return { t: getAdminTranslation(lang).login };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await request.formData();
		const identifier = String(form.get('identifier') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const lang = getAdminLang(cookies);
		const t = getAdminTranslation(lang).login;

		if (!identifier) return fail(400, { error: t.identifierRequired, identifier });
		if (!password) return fail(400, { error: t.passwordRequired, identifier });

		const apiUrl = env.API_URL || 'http://localhost:3000';
		const res = await fetch(`${apiUrl}/auth/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'accept-language': lang },
			body: JSON.stringify({ identifier, password })
		});

		if (!res.ok) {
			const { message } = await parseApiError(res, 'Login failed');
			return fail(res.status, { error: message, identifier });
		}

		const body = (await res.json()) as { data: { accessToken: string } };
		startSession(cookies, body.data.accessToken, res.headers.get('set-cookie'));

		redirect(303, '/admin-panel');
	}
};
