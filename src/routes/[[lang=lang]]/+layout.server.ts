import { getPublicSettings, getThemeShades } from '$lib/server/settings';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	const [themeShades, publicSettings] = await Promise.all([
		getThemeShades(fetch),
		getPublicSettings(fetch)
	]);

	return {
		lang: locals.lang,
		locale: locals.locale,
		contentLanguages: locals.contentLanguages,
		themeShades,
		favicon: publicSettings?.appMetadata.favicon
	};
};
