import type { Cookies } from '@sveltejs/kit';

import type { AdminLang } from '$lib/types/admin-lang';

const ADMIN_LANG_COOKIE = 'admin_lang';

export const getAdminLang = (cookies: Cookies): AdminLang =>
	cookies.get(ADMIN_LANG_COOKIE) === 'id-ID' ? 'id-ID' : 'en-US';

export const setAdminLang = (cookies: Cookies, lang: AdminLang): void => {
	cookies.set(ADMIN_LANG_COOKIE, lang, {
		path: '/',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365
	});
};
