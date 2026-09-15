export interface HeroTranslation {
	role: string;
	description: string;
	viewProjects: string;
}

export interface AboutExperience {
	role: string;
	company: string;
	period: string;
}

export interface AboutTranslation {
	title: string;
	bio1: string;
	bio2: string;
	experienceTitle: string;
	experiences: AboutExperience[];
}

export interface SkillsTranslation {
	title: string;
	description: string;
}

export interface ProjectItem {
	id: string;
	category: string;
	projectName: string;
	description: string;
	visitWebsite: string;
	imageSrc: string;
	url: string;
}

export interface ProjectsTranslation {
	title: string;
	subtitle: string;
	items: ProjectItem[];
}

export interface CtaTranslation {
	title: string;
	description: string;
	button: string;
}

export interface HomeTranslation {
	metaTitle?: string;
	metaDescription?: string;
	hero: HeroTranslation;
	about: AboutTranslation;
	skills: SkillsTranslation;
	projects: ProjectsTranslation;
	cta: CtaTranslation;
}
