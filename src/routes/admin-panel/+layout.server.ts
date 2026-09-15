import { getThemeShades } from '$lib/server/settings';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const themeShades = await getThemeShades(fetch);
	return { themeShades };
};
