import type { ContentLocale } from "./types";

export interface NavTranslation {
    home: string;
    about: string;
    skills: string;
    projects: string;
    video: string;
}

export const HOME_NAV_TRANSLATIONS: Record<ContentLocale, NavTranslation> = {
    "en-US": {
        home: "Home",
        about: "About",
        skills: "Skills",
        projects: "Projects",
        video: "Video"
    },
    "id-ID": {
        home: "Beranda",
        about: "Tentang",
        skills: "Keahlian",
        projects: "Proyek",
        video: "Video"
    },
    "ja-JP": {
        home: "ホーム",
        about: "私について",
        skills: "スキル",
        projects: "プロジェクト",
        video: "動画"
    }
};
