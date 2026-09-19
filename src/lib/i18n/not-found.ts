import type { ContentLocale } from "./types";

export interface NotFoundTranslation {
    heading: string;
    subtext: string;
    backHome: string;
    contactUs: string;
}

export const NOT_FOUND_TRANSLATION: Record<ContentLocale, NotFoundTranslation> = {
    "en-US": {
        heading: "Page Not Found",
        subtext: "Sorry, the page you are looking for doesn't exist or has been moved.",
        backHome: "Back to Home",
        contactUs: "Contact Us"
    },
    "id-ID": {
        heading: "Halaman Tidak Ditemukan",
        subtext: "Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.",
        backHome: "Kembali ke Beranda",
        contactUs: "Hubungi Kami"
    },
    "ja-JP": {
        heading: "ページが見つかりません",
        subtext: "申し訳ありません。お探しのページは存在しないか、移動された可能性があります。",
        backHome: "ホームに戻る",
        contactUs: "お問い合わせ"
    }
};
