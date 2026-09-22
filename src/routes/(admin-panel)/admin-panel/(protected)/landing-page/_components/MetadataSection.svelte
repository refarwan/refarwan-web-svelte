<script lang="ts">
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        metaTitle?: string;
        metaDescription?: string;
        t: LandingPageAdminTranslation;
    }

    let { metaTitle = $bindable(), metaDescription = $bindable(), t }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.metadataSection}</h2>
    <p class="text-[13px] text-gray-500">
        Search engine optimization (SEO) title and description for this language.
    </p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div>
            <label for="meta-title" class="block text-[13px] font-medium text-gray-700">
                {t.metaTitle}
            </label>
            <input
                id="meta-title"
                name="metaTitle"
                type="text"
                bind:value={metaTitle}
                placeholder={t.metaTitlePlaceholder}
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label for="meta-description" class="block text-[13px] font-medium text-gray-700">
                {t.metaDescription}
            </label>
            <textarea
                id="meta-description"
                name="metaDescription"
                rows="2"
                bind:value={metaDescription}
                placeholder={t.metaDescriptionPlaceholder}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>
    </div>
</section>
