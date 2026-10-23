import { authorizedHttp } from "../../../api/authorized-http";
import { clearFrontendCache } from "../../../api/clear-frontend-cache";
import { popup } from "../../../stores/popup.svelte";
import { axiosErrorMessage } from "../../../utils/axios-error-message";
import { useUnsavedChangesGuard } from "../../../utils/unsaved-changes-guard.svelte";
import { defaultTranslation, reorderItem } from "./landing-page-form-helpers";

import type { DataResponse } from "$lib/types/api-response";
import type {
    AdminLandingPageData,
    FeaturedProjectSummary,
    LandingPageTranslationForm,
    UpdateLandingPagePayload
} from "$lib/types/landing-page";
import type { CommonTranslationObjects } from "../../../i18n/common/types";
import type { LandingPageTranslationObjects } from "../../../i18n/landing-page/types";

export class LandingPageFormState {
    loading = $state(true);
    loadError = $state("");
    submitting = $state(false);

    featuredProjectIds = $state<string[]>([]);
    skills = $state<string[]>([]);
    heroPhotoUrl = $state<string | null>(null);
    heroPhotoFile = $state<File | null>(null);
    heroPhotoCleared = $state(false);

    featuredProjects = $state<FeaturedProjectSummary[]>([]);
    translations = $state<Record<string, LandingPageTranslationForm>>({});

    activeLocale = $state("en-US");

    private snapshot = $state("");
    private getT: () => LandingPageTranslationObjects;
    private getCommonT: () => CommonTranslationObjects;
    private getInitialLocale: () => string;

    constructor(
        getT: () => LandingPageTranslationObjects,
        getCommonT: () => CommonTranslationObjects,
        getInitialLocale: () => string = () => "en-US"
    ) {
        this.getT = getT;
        this.getCommonT = getCommonT;
        this.getInitialLocale = getInitialLocale;
        this.activeLocale = getInitialLocale();

        void this.load();
        useUnsavedChangesGuard(
            () => this.isDirty,
            () => this.getCommonT().unsavedMessage
        );
    }

    get isDirty(): boolean {
        if (!this.snapshot) return false;
        if (this.heroPhotoFile !== null || this.heroPhotoCleared) return true;
        const current = JSON.stringify({
            ids: this.featuredProjectIds,
            skills: this.skills,
            translations: this.translations
        });
        return current !== this.snapshot;
    }

    get activeTranslation(): LandingPageTranslationForm {
        if (!this.translations[this.activeLocale]) {
            this.translations[this.activeLocale] = defaultTranslation();
        }
        return this.translations[this.activeLocale];
    }

    load = async () => {
        this.loading = true;
        this.loadError = "";
        try {
            const res =
                await authorizedHttp.get<DataResponse<AdminLandingPageData>>("/landing-page");
            const data = res.data.data;

            this.featuredProjectIds = data.featuredProjectIds || [];
            this.skills = data.skills || [];
            this.heroPhotoUrl = data.heroPhotoUrl || null;
            this.heroPhotoFile = null;
            this.heroPhotoCleared = false;
            this.featuredProjects = data.featuredProjects || [];
            this.translations = data.translations || {};

            this.snapshot = JSON.stringify({
                ids: this.featuredProjectIds,
                skills: this.skills,
                translations: this.translations
            });
        } catch (err) {
            this.loadError = axiosErrorMessage(err, this.getT().loadFailed);
        } finally {
            this.loading = false;
        }
    };

    setHeroPhoto = (file: File | undefined) => {
        if (!file) return;
        this.heroPhotoFile = file;
        this.heroPhotoCleared = false;
        this.heroPhotoUrl = URL.createObjectURL(file);
    };

    clearHeroPhoto = () => {
        this.heroPhotoFile = null;
        this.heroPhotoCleared = true;
        this.heroPhotoUrl = null;
    };

    addSkill = (icon: string) => {
        if (!this.skills.includes(icon)) this.skills = [...this.skills, icon];
    };

    removeSkill = (icon: string) => {
        this.skills = this.skills.filter((s) => s !== icon);
    };

    toggleFeaturedProject = (project: FeaturedProjectSummary) => {
        const idx = this.featuredProjectIds.indexOf(project.id);
        if (idx >= 0) {
            this.featuredProjectIds = this.featuredProjectIds.filter((id) => id !== project.id);
            this.featuredProjects = this.featuredProjects.filter((p) => p.id !== project.id);
        } else {
            this.featuredProjectIds = [...this.featuredProjectIds, project.id];
            this.featuredProjects = [...this.featuredProjects, project];
        }
    };

    removeFeaturedProject = (id: string) => {
        this.featuredProjectIds = this.featuredProjectIds.filter((pid) => pid !== id);
        this.featuredProjects = this.featuredProjects.filter((p) => p.id !== id);
    };

    moveUpFeaturedProject = (index: number) => {
        if (index <= 0) return;
        this.featuredProjectIds = reorderItem(this.featuredProjectIds, index, index - 1);
        this.featuredProjects = reorderItem(this.featuredProjects, index, index - 1);
    };

    moveDownFeaturedProject = (index: number) => {
        if (index >= this.featuredProjectIds.length - 1) return;
        this.featuredProjectIds = reorderItem(this.featuredProjectIds, index, index + 1);
        this.featuredProjects = reorderItem(this.featuredProjects, index, index + 1);
    };

    handleSubmit = async (e?: SubmitEvent) => {
        e?.preventDefault();
        if (this.submitting) return;

        this.submitting = true;
        try {
            if (this.heroPhotoFile) {
                const fd = new FormData();
                fd.append("photo", this.heroPhotoFile);
                const res = await authorizedHttp.post<DataResponse<{ photoUrl: string }>>(
                    "/landing-page/photo",
                    fd
                );
                this.heroPhotoUrl = res.data.data.photoUrl;
                this.heroPhotoFile = null;
                this.heroPhotoCleared = false;
            } else if (this.heroPhotoCleared) {
                await authorizedHttp.delete("/landing-page/photo");
                this.heroPhotoUrl = null;
                this.heroPhotoCleared = false;
            }

            const defaultLocale = this.getInitialLocale();
            const defaultTrans =
                this.translations[defaultLocale] ??
                this.translations["en-US"] ??
                Object.values(this.translations)[0];

            const normalizedTranslations: Record<string, (typeof this.translations)[string]> = {};

            for (const [locale, t] of Object.entries(this.translations)) {
                normalizedTranslations[locale] = {
                    metaTitle: t.metaTitle?.trim() || defaultTrans?.metaTitle || "",
                    metaDescription:
                        t.metaDescription?.trim() || defaultTrans?.metaDescription || "",
                    heroRole: t.heroRole?.trim() || defaultTrans?.heroRole || "",
                    heroDescription:
                        t.heroDescription?.trim() || defaultTrans?.heroDescription || "",
                    heroViewProjects:
                        t.heroViewProjects?.trim() || defaultTrans?.heroViewProjects || "",
                    aboutTitle: t.aboutTitle?.trim() || defaultTrans?.aboutTitle || "",
                    aboutBio1: t.aboutBio1?.trim() || defaultTrans?.aboutBio1 || "",
                    aboutBio2: t.aboutBio2?.trim() || defaultTrans?.aboutBio2 || "",
                    aboutExperienceTitle:
                        t.aboutExperienceTitle?.trim() || defaultTrans?.aboutExperienceTitle || "",
                    aboutExperiences:
                        t.aboutExperiences && t.aboutExperiences.length > 0
                            ? t.aboutExperiences
                            : (defaultTrans?.aboutExperiences ?? []),
                    skillsTitle: t.skillsTitle?.trim() || defaultTrans?.skillsTitle || "",
                    skillsDescription:
                        t.skillsDescription?.trim() || defaultTrans?.skillsDescription || "",
                    projectsTitle: t.projectsTitle?.trim() || defaultTrans?.projectsTitle || "",
                    projectsSubtitle:
                        t.projectsSubtitle?.trim() || defaultTrans?.projectsSubtitle || "",
                    projectsVisitText:
                        t.projectsVisitText?.trim() || defaultTrans?.projectsVisitText || "",
                    ctaTitle: t.ctaTitle?.trim() || defaultTrans?.ctaTitle || "",
                    ctaDescription: t.ctaDescription?.trim() || defaultTrans?.ctaDescription || "",
                    ctaButton: t.ctaButton?.trim() || defaultTrans?.ctaButton || ""
                };
            }

            const payload: UpdateLandingPagePayload = {
                featuredProjectIds: this.featuredProjectIds,
                skills: this.skills,
                translations: normalizedTranslations
            };

            await authorizedHttp.put("/landing-page", payload);
            await clearFrontendCache("landing-page");

            this.snapshot = JSON.stringify({
                ids: this.featuredProjectIds,
                skills: this.skills,
                translations: this.translations
            });

            popup.success({ message: this.getT().saved });
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, this.getT().saveFailed) });
        } finally {
            this.submitting = false;
        }
    };
}
