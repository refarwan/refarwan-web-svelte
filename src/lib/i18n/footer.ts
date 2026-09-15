export interface FooterTranslation {
	bio: string;
	socialTitle: string;
	copyright: string;
	location: string;
}

export const FOOTER_TRANSLATIONS: Record<string, FooterTranslation> = {
	en: {
		bio: 'A fullstack web developer based in Bantul, Special Region of Yogyakarta.',
		socialTitle: 'Social Media',
		copyright: '© 2025. Created by Aan Refarwan. Built with Precision.',
		location: 'Yogyakarta, Indonesia'
	},
	id: {
		bio: 'Seorang fullstack web developer yang berbasis di Bantul, Daerah Istimewa Yogyakarta.',
		socialTitle: 'Media Sosial',
		copyright: '© 2025. Dibuat oleh Aan Refarwan. Dibangun dengan Presisi.',
		location: 'Yogyakarta, Indonesia'
	},
	zh: {
		bio: '现居日惹特区班图尔的全栈 Web 开发者。',
		socialTitle: '社交媒体',
		copyright: '© 2025. 由 Aan Refarwan 创建。精工细作。',
		location: '印度尼西亚日惹'
	},
	ja: {
		bio: 'ジョグジャカルタ特別州バントゥルを拠点とするフルスタックWeb開発者。',
		socialTitle: 'ソーシャルメディア',
		copyright: '© 2025. Aan Refarwan 作成。精密な設計。',
		location: 'インドネシア、ジョグジャカルタ'
	},
	ko: {
		bio: '족자카르타 특별주 반툴에 기반을 둔 풀스택 웹 개발자입니다.',
		socialTitle: '소셜 미디어',
		copyright: '© 2025. Aan Refarwan 제작. 정밀함으로 구축되었습니다.',
		location: '인도네시아 족자카르타'
	},
	es: {
		bio: 'Un desarrollador web fullstack con sede en Bantul, Región Especial de Yogyakarta.',
		socialTitle: 'Redes Sociales',
		copyright: '© 2025. Creado por Aan Refarwan. Construido con precisión.',
		location: 'Yogyakarta, Indonesia'
	},
	fr: {
		bio: 'Un développeur web fullstack basé à Bantul, région spéciale de Yogyakarta.',
		socialTitle: 'Réseaux Sociaux',
		copyright: '© 2025. Créé par Aan Refarwan. Conçu avec précision.',
		location: 'Yogyakarta, Indonésie'
	},
	de: {
		bio: 'Ein Fullstack-Webentwickler aus Bantul, Sonderregion Yogyakarta.',
		socialTitle: 'Soziale Medien',
		copyright: '© 2025. Erstellt von Aan Refarwan. Mit Präzision gebaut.',
		location: 'Yogyakarta, Indonesien'
	}
};

export function getFooterTranslation(lang?: string): FooterTranslation {
	if (!lang) return FOOTER_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return FOOTER_TRANSLATIONS[code] || FOOTER_TRANSLATIONS.en;
}
