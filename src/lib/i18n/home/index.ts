import { en } from './en';
import { id } from './id';
import { ja } from './ja';

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
	ja
};

export function getHomeTranslation(lang?: string): HomeTranslation {
	if (!lang) return HOME_TRANSLATIONS.en;
	const code = lang.toLowerCase();
	return HOME_TRANSLATIONS[code] || HOME_TRANSLATIONS.en;
}
