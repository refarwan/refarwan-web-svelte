export interface NotFoundTranslation {
	heading: string;
	subtext: string;
	backHome: string;
	contactUs: string;
}

const NOT_FOUND_TRANSLATIONS: Record<string, NotFoundTranslation> = {
	en: {
		heading: 'Page Not Found',
		subtext: "Sorry, the page you are looking for doesn't exist or has been moved.",
		backHome: 'Back to Home',
		contactUs: 'Contact Us'
	},
	id: {
		heading: 'Halaman Tidak Ditemukan',
		subtext: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
		backHome: 'Kembali ke Beranda',
		contactUs: 'Hubungi Kami'
	},
	ja: {
		heading: 'ページが見つかりません',
		subtext: '申し訳ありません。お探しのページは存在しないか、移動された可能性があります。',
		backHome: 'ホームに戻る',
		contactUs: 'お問い合わせ'
	}
};

export function getNotFoundTranslation(lang?: string): NotFoundTranslation {
	if (!lang) return NOT_FOUND_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return NOT_FOUND_TRANSLATIONS[code] ?? NOT_FOUND_TRANSLATIONS.en;
}
