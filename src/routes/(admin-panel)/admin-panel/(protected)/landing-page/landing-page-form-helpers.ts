import type { LandingPageTranslationForm } from "$lib/types/landing-page";

export const defaultTranslation = (): LandingPageTranslationForm => ({
    metaTitle: "",
    metaDescription: "",
    heroRole: "",
    heroDescription: "",
    heroViewProjects: "",
    aboutTitle: "",
    aboutBio1: "",
    aboutBio2: "",
    aboutExperienceTitle: "",
    aboutExperiences: [],
    skillsTitle: "",
    skillsDescription: "",
    projectsTitle: "",
    projectsSubtitle: "",
    projectsVisitText: "",
    ctaTitle: "",
    ctaDescription: "",
    ctaButton: ""
});

export const reorderItem = <T>(list: T[], fromIndex: number, toIndex: number): T[] => {
    if (toIndex < 0 || toIndex >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    return next;
};
