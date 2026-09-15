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
	zh: {
		heading: '页面未找到',
		subtext: '抱歉，您访问的页面不存在或已被移动。',
		backHome: '返回首页',
		contactUs: '联系我们'
	},
	ja: {
		heading: 'ページが見つかりません',
		subtext: '申し訳ありません。お探しのページは存在しないか、移動された可能性があります。',
		backHome: 'ホームに戻る',
		contactUs: 'お問い合わせ'
	},
	ko: {
		heading: '페이지를 찾을 수 없습니다',
		subtext: '죄송합니다. 찾으시는 페이지가 존재하지 않거나 이동되었습니다.',
		backHome: '홈으로 돌아가기',
		contactUs: '문의하기'
	},
	es: {
		heading: 'Página No Encontrada',
		subtext: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
		backHome: 'Volver al Inicio',
		contactUs: 'Contáctanos'
	},
	fr: {
		heading: 'Page Non Trouvée',
		subtext: "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
		backHome: "Retour à l'accueil",
		contactUs: 'Contactez-nous'
	},
	de: {
		heading: 'Seite Nicht Gefunden',
		subtext: 'Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.',
		backHome: 'Zurück zur Startseite',
		contactUs: 'Kontaktieren Sie uns'
	}
};

export function getNotFoundTranslation(lang?: string): NotFoundTranslation {
	if (!lang) return NOT_FOUND_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return NOT_FOUND_TRANSLATIONS[code] ?? NOT_FOUND_TRANSLATIONS.en;
}
