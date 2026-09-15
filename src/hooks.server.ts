import { error } from '@sveltejs/kit';

import { getActiveContentLangs } from '$lib/server/settings';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const contentLanguages = await getActiveContentLangs(event.fetch);
	const localeParam = event.params.lang;

	const active = localeParam
		? contentLanguages.find((lang) => lang.locale === localeParam)
		: contentLanguages.find((lang) => lang.code === 'en');

	if (!active) {
		error(404, 'Not found');
	}

	event.locals.lang = active.code;
	event.locals.locale = active.locale;
	event.locals.contentLanguages = contentLanguages;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', active.locale)
	});
};
