import { fail } from '@sveltejs/kit';

import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { authFetch, parseApiError } from '$lib/server/api-auth';

import type { Actions, PageServerLoad } from './$types';

import type { AdminOptionItem, DataResponse, ListResponse, VideoItem } from '$lib/types';

export const load: PageServerLoad = async ({ parent, url, cookies, fetch }) => {
	const { adminLang } = await parent();

	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const search = url.searchParams.get('search') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const categoryIds = url.searchParams.getAll('category');

	const query = new URLSearchParams({ page: String(page), limit: '10' });
	if (search) query.set('search', search);
	if (status) query.set('status', status);
	for (const id of categoryIds) query.append('categoryId', id);

	const [res, categoriesRes] = await Promise.all([
		authFetch(cookies, fetch, `/video?${query.toString()}`),
		authFetch(cookies, fetch, '/video-category/admin-options')
	]);

	const list = res.ok ? ((await res.json()) as ListResponse<VideoItem[]>) : null;
	const categories = categoriesRes.ok
		? ((await categoriesRes.json()) as DataResponse<AdminOptionItem[]>).data
		: [];

	return {
		t: getAdminTranslation(adminLang).watchVideo,
		common: getAdminTranslation(adminLang).common,
		list,
		page,
		search,
		status,
		categoryIds,
		categories
	};
};

export const actions: Actions = {
	archive: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const id = String(raw.get('id') ?? '');
		const t = getAdminTranslation(getAdminLang(cookies)).watchVideo;

		const res = await authFetch(cookies, fetch, `/video/${id}/archive`, { method: 'PATCH' });
		if (!res.ok) {
			const { message } = await parseApiError(res, 'Failed to archive video');
			return fail(res.status, { error: message });
		}

		return { success: true, message: t.archived };
	},

	unarchive: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const id = String(raw.get('id') ?? '');
		const t = getAdminTranslation(getAdminLang(cookies)).watchVideo;

		const res = await authFetch(cookies, fetch, `/video/${id}/unarchive`, { method: 'PATCH' });
		if (!res.ok) {
			const { message } = await parseApiError(res, 'Failed to restore video');
			return fail(res.status, { error: message });
		}

		return { success: true, message: t.unarchived };
	},

	delete: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const id = String(raw.get('id') ?? '');
		const t = getAdminTranslation(getAdminLang(cookies)).watchVideo;

		const res = await authFetch(cookies, fetch, `/video/${id}`, { method: 'DELETE' });
		if (!res.ok) {
			const { message } = await parseApiError(res, 'Failed to delete video');
			return fail(res.status, { error: message });
		}

		return { success: true, message: t.deleted };
	}
};
