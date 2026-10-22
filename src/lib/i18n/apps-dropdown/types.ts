import type { ContentLocale } from "$lib/types/content-language";

export type AppsDropdownTranslationObjects = {
    home: string;
    project: string;
    watch: string;
    blog: string;
    appsMenuAriaLabel: string;
    openSearchAriaLabel: string;
};

export type AppsDropdownTranslations = Record<ContentLocale, AppsDropdownTranslationObjects>;
