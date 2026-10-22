import type { ContentLanguage } from "$lib/types/content-language";

export const CONTENT_LANGUAGES: ContentLanguage[] = [
    { locale: "en-US", name: "English", flag: "🇺🇸" },
    { locale: "id-ID", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { locale: "ja-JP", name: "日本語 (Japanese)", flag: "🇯🇵" }
];

export const DEFAULT_CONTENT_LANGUAGE = CONTENT_LANGUAGES[0];
