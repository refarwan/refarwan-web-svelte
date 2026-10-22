import type { ContentLocale } from "$lib/types/content-language";

export type NotFoundTranslationObjects = {
    heading: string;
    subtext: string;
    backHome: string;
    contactUs: string;
};

export type NotFoundTranslations = Record<ContentLocale, NotFoundTranslationObjects>;
