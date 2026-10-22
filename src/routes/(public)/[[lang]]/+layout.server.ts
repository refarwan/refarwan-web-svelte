import { DEFAULT_CONTENT_LANGUAGE } from "$lib/i18n/content-language";
import { getActiveContentLangs } from "$lib/server/settings.js";

import type { ContentLocale } from "$lib/types/content-language";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, fetch }) => {
    const contentLanguages = await getActiveContentLangs(fetch);

    const defaultLang = (
        contentLanguages.find((l) => l.default) ??
        contentLanguages[0] ??
        DEFAULT_CONTENT_LANGUAGE
    ).locale;

    const currentLang: ContentLocale = (
        contentLanguages.find((l) => l.locale === params.lang) ??
        contentLanguages.find((l) => l.default) ??
        DEFAULT_CONTENT_LANGUAGE
    ).locale;

    return { contentLanguages, currentLang, defaultLang };
};
