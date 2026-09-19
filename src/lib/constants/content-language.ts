import type { ContentLanguage } from "$lib/types/content-language";

export const CONTENT_LANGUAGES: ContentLanguage[] = [
    { code: "en", locale: "en-US", name: "English", flag: "🇺🇸" },
    { code: "id", locale: "id-ID", name: "Indonesia", flag: "🇮🇩" },
    { code: "ja", locale: "ja-JP", name: "日本語 (Japanese)", flag: "🇯🇵" }
];

export const DEFAULT_CONTENT_LANGUAGE = CONTENT_LANGUAGES[0];
