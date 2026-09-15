import { CONTENT_LANGUAGES, DEFAULT_THEME_SHADES } from '$lib/constants';

import { getApiData } from './api';

import type { ContentLanguage, DataResponse, PublicSettingsData, ThemeShades } from '$lib/types';

export const getActiveContentLangs = async (
	fetchFn: typeof fetch = fetch
): Promise<ContentLanguage[]> => {
	const res = await getApiData<DataResponse<string[]>>('setting/other-content-languages', fetchFn);

	const otherLocales = new Set(res?.data ?? []);
	const english = CONTENT_LANGUAGES.find((lang) => lang.code === 'en')!;
	const others = CONTENT_LANGUAGES.filter(
		(lang) => lang.code !== 'en' && otherLocales.has(lang.locale)
	);

	return [english, ...others];
};

export const getThemeShades = async (fetchFn: typeof fetch = fetch): Promise<ThemeShades> => {
	const res = await getApiData<DataResponse<ThemeShades>>('setting/theme-shades', fetchFn);
	return res?.data ?? DEFAULT_THEME_SHADES;
};

export const getPublicSettings = async (
	fetchFn: typeof fetch = fetch
): Promise<PublicSettingsData | undefined> => {
	const res = await getApiData<DataResponse<PublicSettingsData>>('setting/public', fetchFn);
	return res?.data;
};
