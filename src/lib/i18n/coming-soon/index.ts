import type { ContentLocale } from "../types";

export interface ComingSoonPageTranslation {
    badge: string;
    blogTitle: string;
    blogDescription: string;
    projectTitle: string;
    projectDescription: string;
    backHome: string;
    exploreWatch: string;
}

export const COMING_SOON_TRANSLATIONS: Record<ContentLocale, ComingSoonPageTranslation> = {
    "en-US": {
        badge: "Coming Soon",
        blogTitle: "Articles & Insights Are on the Way",
        blogDescription:
            "We are currently writing in-depth tech articles, coding tutorials, and architecture guides. Stay tuned!",
        projectTitle: "Portfolio Projects Are in the Works",
        projectDescription:
            "A curated showcase of fullstack applications, open-source work, and architecture case studies is coming soon.",
        backHome: "Back to Home",
        exploreWatch: "Watch Videos"
    },
    "id-ID": {
        badge: "Segera Hadir",
        blogTitle: "Artikel & Tulisan Menarik Segera Hadir",
        blogDescription:
            "Kami sedang menyiapkan tulisan mendalam seputar teknologi, tutorial koding, dan arsitektur software. Nantikan segera!",
        projectTitle: "Showcase Proyek Sedang Disiapkan",
        projectDescription:
            "Koleksi aplikasi web fullstack, proyek open-source, dan studi kasus sistem sedang dalam proses perapihan. Segera hadir!",
        backHome: "Kembali ke Beranda",
        exploreWatch: "Tonton Video"
    },
    "ja-JP": {
        badge: "近日公開",
        blogTitle: "技術記事とブログはまもなく公開されます",
        blogDescription:
            "詳細な技術解説、プログラミングチュートリアル、アーキテクチャガイドを執筆中です。今しばらくお待ちください。",
        projectTitle: "プロジェクト一覧は準備中です",
        projectDescription:
            "フルスタックWebアプリケーションやオープンソースプロジェクトのショーケースを準備しています。",
        backHome: "ホームに戻る",
        exploreWatch: "ビデオを見る"
    }
};
