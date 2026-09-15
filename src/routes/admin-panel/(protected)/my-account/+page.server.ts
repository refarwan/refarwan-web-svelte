import { fail } from '@sveltejs/kit';

import { getAdminTranslation } from '$lib/i18n/admin';
import { getAdminLang } from '$lib/server/admin-lang';
import { getApiData } from '$lib/server/api';
import { authFetch, parseApiError } from '$lib/server/api-auth';

import type { Actions, PageServerLoad } from './$types';

import type { AreaItem, DataResponse } from '$lib/types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const { account, adminLang } = await parent();

	const [provinces, allRegencies] = await Promise.all([
		getApiData<DataResponse<AreaItem[]>>('area/provinces', fetch),
		getApiData<DataResponse<AreaItem[]>>('area/all-regencies', fetch)
	]);

	const [regencies, districts, villages] = await Promise.all([
		account?.province
			? getApiData<DataResponse<AreaItem[]>>(`area/regencies/${account.province.code}`, fetch)
			: undefined,
		account?.regency
			? getApiData<DataResponse<AreaItem[]>>(`area/districts/${account.regency.code}`, fetch)
			: undefined,
		account?.district
			? getApiData<DataResponse<AreaItem[]>>(`area/villages/${account.district.code}`, fetch)
			: undefined
	]);

	return {
		t: getAdminTranslation(adminLang).account,
		provinces: provinces?.data ?? [],
		allRegencies: allRegencies?.data ?? [],
		initialRegencies: regencies?.data ?? [],
		initialDistricts: districts?.data ?? [],
		initialVillages: villages?.data ?? []
	};
};

const TEXT_FIELDS = [
	'username',
	'email',
	'fullname',
	'birthday',
	'address',
	'birthplaceCode',
	'provinceCode',
	'regencyCode',
	'districtCode',
	'villageCode'
];

// Hono rejects an empty optional phoneNumber/gender (minLength/picklist checks), so
// those fields are only forwarded when they hold a real value.
const buildAccountFormData = (input: FormData): FormData => {
	const output = new FormData();

	for (const key of TEXT_FIELDS) {
		const value = input.get(key);
		if (value !== null) output.set(key, value);
	}

	const phoneNumber = input.get('phoneNumber');
	if (typeof phoneNumber === 'string' && phoneNumber.trim()) {
		output.set('phoneNumber', phoneNumber);
	}

	const gender = input.get('gender');
	if (gender === 'male' || gender === 'female') output.set('gender', gender);

	if (input.get('deleteProfilePicture') === 'true') {
		output.set('deleteProfilePicture', 'true');
	}

	const profilePicture = input.get('profilePicture');
	if (profilePicture instanceof File && profilePicture.size > 0) {
		output.set('profilePicture', profilePicture);
	}

	return output;
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const raw = await request.formData();
		const body = buildAccountFormData(raw);

		const res = await authFetch(cookies, fetch, '/account/me', { method: 'PATCH', body });

		const lang = getAdminLang(cookies);
		const t = getAdminTranslation(lang).account;

		if (!res.ok) {
			const { message, fieldErrors } = await parseApiError(res, 'Update failed');
			return fail(res.status, { error: message, fieldErrors });
		}

		return { success: true, message: t.updated };
	}
};
