export interface WatchTranslation {
    pageTitle: string;
    pageDescription: string;
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
}

export const WATCH_TRANSLATIONS: Record<string, WatchTranslation> = {
    en: {
        pageTitle: "Video Tutorials & Tech Talks",
        pageDescription:
            "Watch in-depth coding tutorials, architecture breakdowns, and tech walkthroughs.",
        categoriesAll: "All",
        searchPlaceholder: "Search videos...",
        views: "views",
        noVideos: "No videos found.",
        previous: "Previous",
        next: "Next",
        recommendedVideos: "Recommended Videos",
        share: "Share",
        copied: "Link copied!",
        noCategory: "Uncategorized",
        videoNotFound: "Video Not Found",
        appsMenuAriaLabel: "Open apps menu",
        openSearchAriaLabel: "Open search",
        closeSearchAriaLabel: "Close search",
        appsHomeLabel: "Home",
        appsProjectLabel: "Project",
        appsWatchLabel: "Watch",
        appsBlogLabel: "Blog"
    },
    id: {
        pageTitle: "Video Tutorial & Diskusi Teknis",
        pageDescription:
            "Tonton tutorial pemrograman mendalam, bedah arsitektur sistem, dan ulasan teknologi.",
        categoriesAll: "Semua",
        searchPlaceholder: "Cari video...",
        views: "tayangan",
        noVideos: "Tidak ada video yang ditemukan.",
        previous: "Sebelumnya",
        next: "Selanjutnya",
        recommendedVideos: "Video Rekomendasi",
        share: "Bagikan",
        copied: "Tautan disalin!",
        noCategory: "Tanpa kategori",
        videoNotFound: "Video Tidak Ditemukan",
        appsMenuAriaLabel: "Buka menu aplikasi",
        openSearchAriaLabel: "Buka pencarian",
        closeSearchAriaLabel: "Tutup pencarian",
        appsHomeLabel: "Beranda",
        appsProjectLabel: "Proyek",
        appsWatchLabel: "Watch",
        appsBlogLabel: "Blog"
    },
    ja: {
        pageTitle: "ビデオチュートリアル＆技術トーク",
        pageDescription:
            "詳細なコーディングチュートリアル、アーキテクチャ解説、技術解説を視聴できます。",
        categoriesAll: "すべて",
        searchPlaceholder: "動画を検索...",
        views: "再生回数",
        noVideos: "動画が見つかりません。",
        previous: "前へ",
        next: "次へ",
        recommendedVideos: "おすすめ動画",
        share: "共有",
        copied: "リンクをコピーしました！",
        noCategory: "未分類",
        videoNotFound: "動画が見つかりません",
        appsMenuAriaLabel: "アプリメニューを開く",
        openSearchAriaLabel: "検索を開く",
        closeSearchAriaLabel: "検索を閉じる",
        appsHomeLabel: "ホーム",
        appsProjectLabel: "プロジェクト",
        appsWatchLabel: "Watch",
        appsBlogLabel: "ブログ"
    }
};

export function getWatchTranslation(lang?: string): WatchTranslation {
    if (!lang) return WATCH_TRANSLATIONS.en;
    const code = lang.toLowerCase();
    return WATCH_TRANSLATIONS[code] || WATCH_TRANSLATIONS.en;
}
