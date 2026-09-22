export interface AboutExperience {
    role: string;
    company: string;
    period: string;
}

export interface LandingPageTranslationForm {
    metaTitle?: string;
    metaDescription?: string;
    heroRole: string;
    heroDescription: string;
    heroViewProjects: string;
    aboutTitle: string;
    aboutBio1: string;
    aboutBio2: string;
    aboutExperienceTitle: string;
    aboutExperiences: AboutExperience[];
    skillsTitle: string;
    skillsDescription: string;
    projectsTitle: string;
    projectsSubtitle: string;
    projectsVisitText?: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
}

export interface FeaturedProjectSummary {
    id: string;
    title: string | null;
    slug: string;
    category: string | null;
    thumbnailUrl: string | null;
}

export interface AdminLandingPageData {
    featuredProjectIds: string[];
    skills: string[];
    heroPhotoUrl: string | null;
    featuredProjects: FeaturedProjectSummary[];
    translations: Record<string, LandingPageTranslationForm>;
}

export interface UpdateLandingPagePayload {
    featuredProjectIds: string[];
    skills: string[];
    translations: Record<string, LandingPageTranslationForm>;
}
