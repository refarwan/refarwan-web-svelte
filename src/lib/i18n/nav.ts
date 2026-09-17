export interface NavTranslation {
    home: string;
    about: string;
    skills: string;
    projects: string;
    video: string;
}

export const NAV_TRANSLATIONS: Record<string, NavTranslation> = {
    en: { home: "Home", about: "About", skills: "Skills", projects: "Projects", video: "Video" },
    id: {
        home: "Beranda",
        about: "Tentang",
        skills: "Keahlian",
        projects: "Proyek",
        video: "Video"
    },
    ja: {
        home: "ホーム",
        about: "私について",
        skills: "スキル",
        projects: "プロジェクト",
        video: "動画"
    }
};

export function getNavTranslation(lang?: string): NavTranslation {
    if (!lang) return NAV_TRANSLATIONS.en;
    const code = lang.toLowerCase();
    return NAV_TRANSLATIONS[code] || NAV_TRANSLATIONS.en;
}
