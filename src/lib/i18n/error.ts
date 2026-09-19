import type { ContentLocale } from "./types";

export interface ErrorTranslation {
    heading: string;
    subtext: string;
    tryAgain: string;
    backHome: string;
    contactUs: string;
    defaultMessage: string;
}

export const ERROR_TRANSLATION: Record<ContentLocale, ErrorTranslation> = {
    "en-US": {
        heading: "Something Went Wrong",
        subtext:
            "An unexpected error occurred while processing your request. Please try again or return to the homepage.",
        tryAgain: "Try Again",
        backHome: "Back to Home",
        contactUs: "Contact Us",
        defaultMessage: "An unexpected error has occurred."
    },
    "id-ID": {
        heading: "Terjadi Kesalahan",
        subtext:
            "Terjadi kesalahan yang tidak terduga saat memproses permintaan Anda. Silakan coba lagi atau kembali ke beranda.",
        tryAgain: "Coba Lagi",
        backHome: "Kembali ke Beranda",
        contactUs: "Hubungi Kami",
        defaultMessage: "Terjadi kesalahan yang tidak terduga."
    },
    "ja-JP": {
        heading: "問題が発生しました",
        subtext:
            "リクエストの処理中に予期しないエラーが発生しました。もう一度お試しいただくか、ホームページにお戻りください。",
        tryAgain: "再試行",
        backHome: "ホームに戻る",
        contactUs: "お問い合わせ",
        defaultMessage: "予期しないエラーが発生しました。"
    }
};
