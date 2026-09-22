export interface HeroTranslation {
    role: string;
    description: string;
    viewProjects: string;
    photoUrl?: string | null;
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

export interface SkillItem {
    name: string;
    icon: string;
}

export interface SkillsTranslation {
    title: string;
    description: string;
    items?: SkillItem[];
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
