<script lang="ts">
    import type { ContentLanguage } from "$lib/types/content-language";

    interface Props {
        t: Record<string, string>;
        otherContentLanguages: string[];
        availableLanguages: ContentLanguage[];
        activeLanguages: ContentLanguage[];
        onRemoveLanguage: (locale: string) => void;
        onOpenAddLanguageModal: () => void;
    }

    let {
        t,
        otherContentLanguages,
        availableLanguages,
        activeLanguages,
        onRemoveLanguage,
        onOpenAddLanguageModal
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.languagesTitle}</h2>
    <p class="text-[13px] text-gray-500">{t.languagesDescription}</p>
    <hr class="my-4 border-gray-200" />

    <input
        type="hidden"
        name="otherContentLanguages"
        value={JSON.stringify(otherContentLanguages)}
    />

    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
            <span class="flex items-center gap-2 text-sm text-gray-700">
                <span>🇺🇸</span>
                English
            </span>
            <span class="rounded-full bg-theme-50 px-2.5 py-0.5 text-xs font-medium text-theme-700">
                {t.defaultLanguage}
            </span>
        </div>
        {#each activeLanguages as lang (lang.locale)}
            <div
                class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
            >
                <span class="flex items-center gap-2 text-sm text-gray-700">
                    <span>{lang.flag}</span>
                    {lang.name}
                </span>
                <button
                    type="button"
                    onclick={() => onRemoveLanguage(lang.locale)}
                    class="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                    {t.removeLanguage}
                </button>
            </div>
        {/each}
    </div>

    {#if availableLanguages.length > 0}
        <div class="mt-3">
            <button
                type="button"
                onclick={onOpenAddLanguageModal}
                class="inline-flex cursor-pointer items-center rounded-md border border-theme-600 px-4 py-2 text-[13px] font-medium text-theme-600 transition-colors hover:bg-theme-50"
            >
                {t.addLanguage}
            </button>
        </div>
    {/if}
</section>
