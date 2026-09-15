import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { ja } from './ja';
import { ko } from './ko';
import { zh } from './zh';

import type { HomeTranslation } from './types';

export type {
	AboutExperience,
	AboutTranslation,
	CtaTranslation,
	HeroTranslation,
	HomeTranslation,
	ProjectItem,
	ProjectsTranslation,
	SkillsTranslation
} from './types';

export const HOME_TRANSLATIONS: Record<string, HomeTranslation> = {
	en,
	id,
	zh,
	ja,
	ko,
	es,
	fr,
	de
};

export function getHomeTranslation(lang?: string): HomeTranslation {
	if (!lang) return HOME_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return HOME_TRANSLATIONS[code] || HOME_TRANSLATIONS.en;
}
