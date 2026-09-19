import type { ContentLocale } from "./types";

export interface FooterTranslation {
    bio: string;
    socialTitle: string;
    copyright: string;
    location: string;
}

export const FOOTER_TRANSLATIONS: Record<ContentLocale, FooterTranslation> = {
    "en-US": {
        bio: "A fullstack web developer based in Bantul, Special Region of Yogyakarta.",
        socialTitle: "Social Media",
        copyright: "© 2025. Created by Aan Refarwan. Built with Precision.",
        location: "Yogyakarta, Indonesia"
    },
    "id-ID": {
        bio: "Seorang fullstack web developer yang berbasis di Bantul, Daerah Istimewa Yogyakarta.",
        socialTitle: "Media Sosial",
        copyright: "© 2025. Dibuat oleh Aan Refarwan. Dibangun dengan Presisi.",
        location: "Yogyakarta, Indonesia"
    },
    "ja-JP": {
        bio: "ジョグジャカルタ特別州バントゥルを拠点とするフルスタックWeb開発者。",
        socialTitle: "ソーシャルメディア",
        copyright: "© 2025. Aan Refarwan 作成。精密な設計。",
        location: "インドネシア、ジョグジャカルタ"
    }
};
