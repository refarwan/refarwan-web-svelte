import type { ContentLocale } from "$lib/types/content-language";

export type ErrorTranslationObjects = {
    heading: string;
    subtext: string;
    tryAgain: string;
    backHome: string;
    contactUs: string;
    defaultMessage: string;
};

export type ErrorTranslations = Record<ContentLocale, ErrorTranslationObjects>;
