import { fail } from '@sveltejs/kit';

import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { authFetch, parseApiError } from '$lib/server/api-auth';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { adminLang } = await parent();
	return { t: getAdminTranslation(adminLang).changePassword };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await request.formData();
		const oldPassword = String(form.get('oldPassword') ?? '');
		const newPassword = String(form.get('newPassword') ?? '');
		const confirmPassword = String(form.get('confirmPassword') ?? '');

		const lang = getAdminLang(cookies);
		const t = getAdminTranslation(lang).changePassword;

		const fieldErrors: Record<string, string> = {};
		if (!oldPassword) fieldErrors.oldPassword = t.oldPasswordRequired;
		if (newPassword.length < 8) fieldErrors.newPassword = t.newPasswordMinLength;
		if (!confirmPassword) fieldErrors.confirmPassword = t.confirmPasswordRequired;
		else if (confirmPassword !== newPassword)
			fieldErrors.confirmPassword = t.confirmPasswordMismatch;

		if (Object.keys(fieldErrors).length > 0) {
			return fail(400, { fieldErrors });
		}

		const res = await authFetch(cookies, fetch, '/auth/change-password', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
		});

		if (!res.ok) {
			const { message } = await parseApiError(res, 'Failed to change password');
			return fail(res.status, { error: message });
		}

		return { success: true, message: t.updated };
	}
};
