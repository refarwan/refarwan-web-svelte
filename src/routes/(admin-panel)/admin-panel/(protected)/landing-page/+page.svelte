<script lang="ts">
    import Icon from "@iconify/svelte";
    import LanguageTabs from "../_components/LanguageTabs.svelte";
    import { pageTitleStore } from "../../../stores/page-title.svelte";
    import { popup } from "../../../stores/popup.svelte";
    import AboutSection from "./_components/AboutSection.svelte";
    import CtaSection from "./_components/CtaSection.svelte";
    import FeaturedProjectsEditor from "./_components/FeaturedProjectsEditor.svelte";
    import HeroSection from "./_components/HeroSection.svelte";
    import MetadataSection from "./_components/MetadataSection.svelte";
    import SelectProjectsModal from "./_components/SelectProjectsModal.svelte";
    import SkillsSection from "./_components/SkillsSection.svelte";
    import { LandingPageFormState } from "./use-landing-page-form.svelte";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);
    const contentLanguages = $derived(data.contentLanguages);

    $effect(() => {
        pageTitleStore.set(t.pageTitle);
    });

    const form = new LandingPageFormState(
        () => t,
        () => commonT,
        () => data.contentLanguages[0]?.locale ?? "en-US"
    );

    let activeLangCode = $derived(
        contentLanguages.find((l) => l.locale === form.activeLocale)?.code ?? "en"
    );

    const handleSelectLanguage = (code: string) => {
        const found = contentLanguages.find((l) => l.code === code);
        if (found) {
            form.activeLocale = found.locale;
        }
    };

    let selectProjectsPopupId = $state("");

    const openSelectProjectsModal = () => {
        selectProjectsPopupId = popup.generateId();
        popup.custom({ id: selectProjectsPopupId, component: selectProjectsSnippet });
    };
</script>

<div class="flex flex-col gap-4">
    {#if contentLanguages.length > 1}
        <div class="flex items-center">
            <LanguageTabs
                languages={contentLanguages}
                activeCode={activeLangCode}
                onSelect={handleSelectLanguage}
            />
        </div>
    {/if}

    {#if form.loading}
        <div class="flex flex-col items-center justify-center py-20 text-gray-400">
            <Icon icon="lucide:loader-2" class="h-8 w-8 animate-spin text-theme-600" />
            <p class="mt-2 text-xs font-medium">Loading landing page configuration...</p>
        </div>
    {:else if form.loadError}
        <div class="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p class="font-bold">Error</p>
            <p class="mt-1">{form.loadError}</p>
            <button
                type="button"
                onclick={() => void form.load()}
                class="mt-3 cursor-pointer rounded-md bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
                Retry
            </button>
        </div>
    {:else}
        <form onsubmit={(e) => void form.handleSubmit(e)} class="flex flex-col gap-4">
            <MetadataSection
                bind:metaTitle={form.activeTranslation.metaTitle}
                bind:metaDescription={form.activeTranslation.metaDescription}
                {t}
            />

            <HeroSection
                bind:heroRole={form.activeTranslation.heroRole}
                bind:heroViewProjects={form.activeTranslation.heroViewProjects}
                bind:heroDescription={form.activeTranslation.heroDescription}
                photoUrl={form.heroPhotoUrl}
                onPhotoSelect={(file) => form.setHeroPhoto(file)}
                onPhotoClear={() => form.clearHeroPhoto()}
                {t}
            />

            <AboutSection
                bind:aboutTitle={form.activeTranslation.aboutTitle}
                bind:aboutExperienceTitle={form.activeTranslation.aboutExperienceTitle}
                bind:aboutBio1={form.activeTranslation.aboutBio1}
                bind:aboutBio2={form.activeTranslation.aboutBio2}
                bind:aboutExperiences={form.activeTranslation.aboutExperiences}
                {t}
            />

            <SkillsSection
                bind:skillsTitle={form.activeTranslation.skillsTitle}
                bind:skillsDescription={form.activeTranslation.skillsDescription}
                skills={form.skills}
                onAddSkill={(icon) => form.addSkill(icon)}
                onRemoveSkill={(icon) => form.removeSkill(icon)}
                {t}
            />

            <FeaturedProjectsEditor
                title={form.activeTranslation.projectsTitle}
                subtitle={form.activeTranslation.projectsSubtitle}
                visitText={form.activeTranslation.projectsVisitText || ""}
                featuredProjects={form.featuredProjects}
                onTitleChange={(v) => (form.activeTranslation.projectsTitle = v)}
                onSubtitleChange={(v) => (form.activeTranslation.projectsSubtitle = v)}
                onVisitTextChange={(v) => (form.activeTranslation.projectsVisitText = v)}
                onOpenSelectModal={openSelectProjectsModal}
                onRemoveProject={(id) => form.removeFeaturedProject(id)}
                onMoveUpProject={(idx) => form.moveUpFeaturedProject(idx)}
                onMoveDownProject={(idx) => form.moveDownFeaturedProject(idx)}
                {t}
            />

            <CtaSection
                bind:ctaTitle={form.activeTranslation.ctaTitle}
                bind:ctaButton={form.activeTranslation.ctaButton}
                bind:ctaDescription={form.activeTranslation.ctaDescription}
                {t}
            />

            <div class="flex justify-end">
                <button
                    type="submit"
                    disabled={form.submitting || !form.isDirty}
                    class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {form.submitting ? t.saving : t.save}
                </button>
            </div>
        </form>
    {/if}
</div>

{#snippet selectProjectsSnippet()}
    <SelectProjectsModal
        selectedProjectIds={form.featuredProjectIds}
        onToggleProject={(project) => form.toggleFeaturedProject(project)}
        onClose={() => popup.remove(selectProjectsPopupId)}
        {t}
    />
{/snippet}
