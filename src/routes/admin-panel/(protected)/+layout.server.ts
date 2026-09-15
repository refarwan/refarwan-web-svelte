import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { authFetch } from '$lib/server/api-auth';
import { requireAccessToken } from '$lib/server/auth';

import type { LayoutServerLoad } from './$types';

import type { AccountItem, DataResponse } from '$lib/types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	await requireAccessToken(cookies, fetch);

	const res = await authFetch(cookies, fetch, '/account/me');
	const account = res.ok ? ((await res.json()) as DataResponse<AccountItem>).data : null;

	const adminLang = getAdminLang(cookies);
	return { account, adminLang, shellT: getAdminTranslation(adminLang).shell };
};
