import type { ContentLocale } from "$lib/types/content-language";

export type HomeNavTranslationObjects = {
    home: string;
    about: string;
    skills: string;
    projects: string;
    video: string;
};

export type HomeNavTranslations = Record<ContentLocale, HomeNavTranslationObjects>;
