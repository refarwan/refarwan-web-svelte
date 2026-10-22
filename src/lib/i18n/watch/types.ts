import type { ContentLocale } from "$lib/types/content-language";

export type WatchTranslationObjects = {
    categoriesAll: string;
    searchPlaceholder: string;
    views: string;
    noVideos: string;
    previous: string;
    next: string;
    recommendedVideos: string;
    share: string;
    copied: string;
    noCategory: string;
    videoNotFound: string;
    appsMenuAriaLabel: string;
    openSearchAriaLabel: string;
    closeSearchAriaLabel: string;
    appsHomeLabel: string;
    appsProjectLabel: string;
    appsWatchLabel: string;
    appsBlogLabel: string;
    playOnWatch: string;
    loadMore: string;
    loading: string;
};

export type WatchTranslations = Record<ContentLocale, WatchTranslationObjects>;
