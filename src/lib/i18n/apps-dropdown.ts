import type { ContentLocale } from "./types";

export interface AppsDropdownTranslation {
    home: string;
    project: string;
    watch: string;
    blog: string;
    appsMenuAriaLabel: string;
    openSearchAriaLabel: string;
}

export const APPS_DROPDOWN_TRANSLATIONS: Record<ContentLocale, AppsDropdownTranslation> = {
    "en-US": {
        home: "Home",
        project: "Projects",
        watch: "Watch",
        blog: "Blog",
        appsMenuAriaLabel: "Open apps menu",
        openSearchAriaLabel: "Open search"
    },
    "id-ID": {
        home: "Beranda",
        project: "Proyek",
        watch: "Watch",
        blog: "Blog",
        appsMenuAriaLabel: "Buka menu aplikasi",
        openSearchAriaLabel: "Buka pencarian"
    },
    "ja-JP": {
        home: "ホーム",
        project: "プロジェクト",
        watch: "動画",
        blog: "ブログ",
        appsMenuAriaLabel: "アプリメニューを開く",
        openSearchAriaLabel: "検索を開く"
    }
};
