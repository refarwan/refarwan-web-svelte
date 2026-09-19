import { DEFAULT_CONTENT_LANGUAGE } from "$lib/constants/content-language";
import { getActiveContentLangs } from "$lib/server/settings.js";

import type { ContentLocale } from "$lib/i18n/types.js";

export const load = async ({ params, fetch }) => {
    const contentLanguages = await getActiveContentLangs(fetch);

    const currentLang: ContentLocale = (
        contentLanguages.find((l) => l.locale === params.lang) ?? DEFAULT_CONTENT_LANGUAGE
    ).locale;

    return { contentLanguages, currentLang };
};
