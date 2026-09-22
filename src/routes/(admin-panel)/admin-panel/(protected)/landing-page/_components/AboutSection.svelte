<script lang="ts">
    import ExperienceListEditor from "./ExperienceListEditor.svelte";

    import type { AboutExperience } from "$lib/types/landing-page";
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        aboutTitle: string;
        aboutExperienceTitle: string;
        aboutBio1: string;
        aboutBio2: string;
        aboutExperiences: AboutExperience[];
        t: LandingPageAdminTranslation;
    }

    let {
        aboutTitle = $bindable(),
        aboutExperienceTitle = $bindable(),
        aboutBio1 = $bindable(),
        aboutBio2 = $bindable(),
        aboutExperiences = $bindable(),
        t
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.aboutSection}</h2>
    <p class="text-[13px] text-gray-500">Biography text and work experience timeline items.</p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="about-title" class="block text-[13px] font-medium text-gray-700">
                    {t.aboutTitle}
                </label>
                <input
                    id="about-title"
                    name="aboutTitle"
                    type="text"
                    bind:value={aboutTitle}
                    placeholder={t.aboutTitlePlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
            <div>
                <label for="about-exp-title" class="block text-[13px] font-medium text-gray-700">
                    {t.experienceTitle}
                </label>
                <input
                    id="about-exp-title"
                    name="aboutExperienceTitle"
                    type="text"
                    bind:value={aboutExperienceTitle}
                    placeholder={t.experienceTitlePlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="about-bio1" class="block text-[13px] font-medium text-gray-700">
                    {t.aboutBio1}
                </label>
                <textarea
                    id="about-bio1"
                    name="aboutBio1"
                    rows="3"
                    bind:value={aboutBio1}
                    placeholder={t.aboutBio1Placeholder}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                ></textarea>
            </div>
            <div>
                <label for="about-bio2" class="block text-[13px] font-medium text-gray-700">
                    {t.aboutBio2}
                </label>
                <textarea
                    id="about-bio2"
                    name="aboutBio2"
                    rows="3"
                    bind:value={aboutBio2}
                    placeholder={t.aboutBio2Placeholder}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                ></textarea>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
            <ExperienceListEditor
                experiences={aboutExperiences}
                onChange={(items) => (aboutExperiences = items)}
                {t}
            />
        </div>
    </div>
</section>
