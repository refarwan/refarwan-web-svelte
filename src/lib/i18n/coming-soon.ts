export interface ComingSoonTranslation {
    badge: string;
    title: string;
    description: string;
    backHome: string;
    exploreWatch: string;
}

interface ComingSoonPageTranslation {
    badge: string;
    blogTitle: string;
    blogDescription: string;
    projectTitle: string;
    projectDescription: string;
    backHome: string;
    exploreWatch: string;
}

const COMING_SOON_TRANSLATIONS: Record<string, ComingSoonPageTranslation> = {
    en: {
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
    id: {
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
    ja: {
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

export function getComingSoonTranslation(
    lang: string | undefined,
    type: "blog" | "project"
): ComingSoonTranslation {
    const code = lang?.toLowerCase() || "en";
    const t = COMING_SOON_TRANSLATIONS[code] || COMING_SOON_TRANSLATIONS.en;

    return {
        badge: t.badge,
        title: type === "blog" ? t.blogTitle : t.projectTitle,
        description: type === "blog" ? t.blogDescription : t.projectDescription,
        backHome: t.backHome,
        exploreWatch: t.exploreWatch
    };
}
