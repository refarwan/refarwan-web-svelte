import type { ContentLocale } from "$lib/types/content-language";

export type FooterTranslationObjects = {
    bio: string;
    socialTitle: string;
    copyright: string;
    location: string;
};

export type FooterTranslations = Record<ContentLocale, FooterTranslationObjects>;
