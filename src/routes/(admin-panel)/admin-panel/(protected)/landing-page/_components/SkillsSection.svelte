<script lang="ts">
    import TechIconsInput from "../../_components/TechIconsInput.svelte";

    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        skillsTitle: string;
        skillsDescription: string;
        skills: string[];
        onAddSkill: (icon: string) => void;
        onRemoveSkill: (icon: string) => void;
        t: LandingPageAdminTranslation;
    }

    let {
        skillsTitle = $bindable(),
        skillsDescription = $bindable(),
        skills,
        onAddSkill,
        onRemoveSkill,
        t
    }: Props = $props();

    const techIconsT = $derived({
        techIconsLabel: t.techIconsLabel,
        techIconsHelper: t.techIconsHelper,
        techIconsSearchPlaceholder: t.techIconsSearchPlaceholder,
        techIconsNoResults: t.techIconsNoResults,
        techIconsSearching: t.techIconsSearching
    });
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.skillsSection}</h2>
    <p class="text-[13px] text-gray-500">
        Title and introductory description for programming skills section.
    </p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div>
            <label for="skills-title" class="block text-[13px] font-medium text-gray-700">
                {t.skillsTitle}
            </label>
            <input
                id="skills-title"
                name="skillsTitle"
                type="text"
                bind:value={skillsTitle}
                placeholder={t.skillsTitlePlaceholder}
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label for="skills-description" class="block text-[13px] font-medium text-gray-700">
                {t.skillsDescription}
            </label>
            <textarea
                id="skills-description"
                name="skillsDescription"
                rows="2"
                bind:value={skillsDescription}
                placeholder={t.skillsDescriptionPlaceholder}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>

        <div class="pt-2">
            <TechIconsInput
                t={techIconsT}
                icons={skills}
                onAdd={onAddSkill}
                onRemove={onRemoveSkill}
            />
        </div>
    </div>
</section>
