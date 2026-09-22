<script lang="ts">
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        ctaTitle: string;
        ctaButton: string;
        ctaDescription: string;
        t: LandingPageAdminTranslation;
    }

    let {
        ctaTitle = $bindable(),
        ctaButton = $bindable(),
        ctaDescription = $bindable(),
        t
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.ctaSection}</h2>
    <p class="text-[13px] text-gray-500">Bottom call-to-action banner text and button.</p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="cta-title" class="block text-[13px] font-medium text-gray-700">
                    {t.ctaTitle}
                </label>
                <input
                    id="cta-title"
                    name="ctaTitle"
                    type="text"
                    bind:value={ctaTitle}
                    placeholder={t.ctaTitlePlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
            <div>
                <label for="cta-button" class="block text-[13px] font-medium text-gray-700">
                    {t.ctaButton}
                </label>
                <input
                    id="cta-button"
                    name="ctaButton"
                    type="text"
                    bind:value={ctaButton}
                    placeholder={t.ctaButtonPlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
        </div>

        <div>
            <label for="cta-description" class="block text-[13px] font-medium text-gray-700">
                {t.ctaDescription}
            </label>
            <textarea
                id="cta-description"
                name="ctaDescription"
                rows="2"
                bind:value={ctaDescription}
                placeholder={t.ctaDescriptionPlaceholder}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>
    </div>
</section>
