import { fail } from '@sveltejs/kit';

import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { authFetch, parseApiError } from '$lib/server/api-auth';
import { getActiveContentLangs } from '$lib/server/settings';

import type { Actions, PageServerLoad } from './$types';

import type { ListResponse, VideoCategoryItem } from '$lib/types';

export const load: PageServerLoad = async ({ parent, url, cookies, fetch }) => {
	const { adminLang } = await parent();

	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const search = url.searchParams.get('search') ?? '';

	const query = new URLSearchParams({ page: String(page), limit: '10' });
	if (search) query.set('search', search);

	const [res, contentLanguages] = await Promise.all([
		authFetch(cookies, fetch, `/video-category?${query.toString()}`),
		getActiveContentLangs(fetch)
	]);

	const list = res.ok ? ((await res.json()) as ListResponse<VideoCategoryItem[]>) : null;

	return {
		t: getAdminTranslation(adminLang).watchCategory,
		common: getAdminTranslation(adminLang).common,
		list,
		page,
		search,
		contentLanguages
	};
};

export const actions: Actions = {
	create: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const t = getAdminTranslation(getAdminLang(cookies)).watchCategory;

		const res = await authFetch(cookies, fetch, '/video-category', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				name: String(raw.get('name') ?? ''),
				slug: String(raw.get('slug') ?? '') || undefined,
				translations: JSON.parse(String(raw.get('translations') ?? '[]'))
			})
		});

		if (!res.ok) {
			const { message, fieldErrors } = await parseApiError(res, t.createFailed);
			return fail(res.status, { error: message, fieldErrors });
		}

		return { success: true, message: t.created };
	},

	update: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const id = String(raw.get('id') ?? '');
		const t = getAdminTranslation(getAdminLang(cookies)).watchCategory;

		const res = await authFetch(cookies, fetch, `/video-category/${id}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				name: String(raw.get('name') ?? ''),
				slug: String(raw.get('slug') ?? '') || undefined,
				translations: JSON.parse(String(raw.get('translations') ?? '[]'))
			})
		});

		if (!res.ok) {
			const { message, fieldErrors } = await parseApiError(res, t.updateFailed);
			return fail(res.status, { error: message, fieldErrors });
		}

		return { success: true, message: t.updated };
	},

	delete: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const id = String(raw.get('id') ?? '');
		const t = getAdminTranslation(getAdminLang(cookies)).watchCategory;

		const res = await authFetch(cookies, fetch, `/video-category/${id}`, { method: 'DELETE' });

		if (!res.ok) {
			const { message } = await parseApiError(res, t.deleteFailed);
			return fail(res.status, { error: message });
		}

		return { success: true, message: t.deleted };
	}
};
