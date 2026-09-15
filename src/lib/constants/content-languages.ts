import type { ContentLanguage } from '$lib/types';

export const CONTENT_LANGUAGES: ContentLanguage[] = [
	{ code: 'en', locale: 'en-US', name: 'English', flag: '🇬🇧' },
	{ code: 'id', locale: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
	{ code: 'zh', locale: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
	{ code: 'ja', locale: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
	{ code: 'ko', locale: 'ko-KR', name: '한국어 (Korean)', flag: '🇰🇷' },
	{ code: 'es', locale: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸' },
	{ code: 'fr', locale: 'fr-FR', name: 'Français (French)', flag: '🇫🇷' },
	{ code: 'de', locale: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪' }
];

export const DEFAULT_CONTENT_LANGUAGE = CONTENT_LANGUAGES[0];
