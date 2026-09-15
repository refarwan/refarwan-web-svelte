export interface NavTranslation {
	home: string;
	about: string;
	skills: string;
	projects: string;
	video: string;
}

export const NAV_TRANSLATIONS: Record<string, NavTranslation> = {
	en: { home: 'Home', about: 'About', skills: 'Skills', projects: 'Projects', video: 'Video' },
	id: { home: 'Beranda', about: 'Tentang', skills: 'Keahlian', projects: 'Proyek', video: 'Video' },
	zh: { home: '首页', about: '关于', skills: '技能', projects: '项目', video: '视频' },
	ja: {
		home: 'ホーム',
		about: '私について',
		skills: 'スキル',
		projects: 'プロジェクト',
		video: '動画'
	},
	ko: { home: '홈', about: '소개', skills: '기술', projects: '프로젝트', video: '동영상' },
	es: {
		home: 'Inicio',
		about: 'Sobre Mí',
		skills: 'Habilidades',
		projects: 'Proyectos',
		video: 'Video'
	},
	fr: {
		home: 'Accueil',
		about: 'À Propos',
		skills: 'Compétences',
		projects: 'Projets',
		video: 'Vidéo'
	},
	de: {
		home: 'Startseite',
		about: 'Über Mich',
		skills: 'Kenntnisse',
		projects: 'Projekte',
		video: 'Video'
	}
};

export function getNavTranslation(lang?: string): NavTranslation {
	if (!lang) return NAV_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return NAV_TRANSLATIONS[code] || NAV_TRANSLATIONS.en;
}
