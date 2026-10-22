import { CONTENT_LANGUAGES, DEFAULT_CONTENT_LANGUAGE } from "$lib/i18n/content-language";

import type { ContentLanguage } from "$lib/types/content-language";
import type { VideoDetail } from "$lib/types/video";

export type TabLang = ContentLanguage;

export function buildTabLanguages(
    contentLanguages: ContentLanguage[] = [],
    video: VideoDetail
): TabLang[] {
    const list: TabLang[] =
        contentLanguages.length > 0 ? [...contentLanguages] : [DEFAULT_CONTENT_LANGUAGE];

    for (const tr of video.translations ?? []) {
        const language = CONTENT_LANGUAGES.find((l) => l.locale === tr.languageCode);
        if (language && !list.some((l) => l.locale === language.locale)) list.push(language);
    }
    return list;
}

export function resolveActiveContent(
    video: VideoDetail,
    activeLocale: string
): { title: string; description: string; isFallback: boolean } {
    if (activeLocale === DEFAULT_CONTENT_LANGUAGE.locale) {
        return {
            title: video.title || "",
            description: video.description || "",
            isFallback: false
        };
    }

    const translation = video.translations?.find((tr) => tr.languageCode === activeLocale);

    if (translation) {
        return {
            title: translation.title || "",
            description: translation.description || "",
            isFallback: false
        };
    }

    return {
        title: video.title || "",
        description: video.description || "",
        isFallback: true
    };
}
