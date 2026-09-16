<script lang="ts">
    import { LoaderCircle, XIcon } from "lucide-svelte/icons";
    import { enhance } from "$app/forms";

    import { SvelteURLSearchParams } from "svelte/reactivity";

    import CategoryNameField from "./CategoryNameField.svelte";
    import LanguageTabs from "$lib/components/admin/LanguageTabs.svelte";
    import SlugField from "./SlugField.svelte";
    import { slugify } from "$lib/utils/slugify";

    import type { AdminTranslation } from "$lib/i18n/admin";
    import type { ContentLanguage, VideoCategoryDetail } from "$lib/types";

    interface Props {
        mode: "create" | "edit";
        category: VideoCategoryDetail | null;
        contentLanguages: ContentLanguage[];
        onClose: () => void;
        t: AdminTranslation["watchCategory"];
        cancelLabel: string;
    }

    let { mode, category, contentLanguages, onClose, t, cancelLabel }: Props = $props();

    const seedNames = (): Record<string, string> => {
        const names: Record<string, string> = { en: category?.name ?? "" };
        for (const lang of contentLanguages) {
            if (lang.code === "en") continue;
            const translation = category?.translations.find((t) => t.languageCode === lang.locale);
            names[lang.code] = translation?.name ?? "";
        }
        return names;
    };

    let activeLangCode = $state("en");
    let names = $state<Record<string, string>>(seedNames());
    let slug = $state(category?.slug ?? "");
    let isSlugTouched = $state(Boolean(category?.slug));
    let isCheckingSlug = $state(false);
    let slugTaken = $state(false);
    let suggestedSlug = $state("");
    let submitting = $state(false);
    let formError = $state("");
    let formEl: HTMLFormElement | undefined = $state();

    let slugCheckTimeout: ReturnType<typeof setTimeout> | undefined;

    const checkSlug = async (candidate: string): Promise<string> => {
        const params = new SvelteURLSearchParams({ slug: candidate });
        if (category?.slug) params.set("currentSlug", category.slug);

        const res = await fetch(`/admin-panel/api/video-category/slug-check?${params}`);
        if (!res.ok) return candidate;
        const body = (await res.json()) as { data: { slug: string } };
        return body.data.slug;
    };

    const verifySlug = async (targetSlug: string, isAutoFromTitle: boolean): Promise<string> => {
        const clean = slugify(targetSlug);
        if (!clean) {
            slugTaken = false;
            suggestedSlug = "";
            isCheckingSlug = false;
            return clean;
        }

        isCheckingSlug = true;
        try {
            const availableSlug = await checkSlug(clean);
            if (isAutoFromTitle) {
                if (!isSlugTouched) {
                    slug = availableSlug;
                    slugTaken = false;
                    suggestedSlug = "";
                }
            } else if (availableSlug !== clean) {
                slugTaken = true;
                suggestedSlug = availableSlug;
            } else {
                slugTaken = false;
                suggestedSlug = "";
            }
            return availableSlug;
        } catch {
            slugTaken = false;
            return clean;
        } finally {
            isCheckingSlug = false;
        }
    };

    const onNameInput = (value: string) => {
        names[activeLangCode] = value;

        if (activeLangCode === "en" && !isSlugTouched) {
            const clean = slugify(value);
            slug = clean;
            clearTimeout(slugCheckTimeout);
            if (clean) {
                slugCheckTimeout = setTimeout(() => verifySlug(clean, true), 400);
            }
        }
    };

    const onSlugInput = (value: string) => {
        slug = value;
        isSlugTouched = true;
        slugTaken = false;
        suggestedSlug = "";

        clearTimeout(slugCheckTimeout);
        const clean = slugify(value);
        if (clean) {
            slugCheckTimeout = setTimeout(() => verifySlug(clean, false), 500);
        }
    };

    const applySuggestedSlug = () => {
        if (!suggestedSlug) return;
        slug = suggestedSlug;
        slugTaken = false;
        suggestedSlug = "";
    };

    const hasAnyName = $derived(Object.values(names).some((name) => name.trim().length > 0));

    const translationsPayload = $derived(
        JSON.stringify(
            contentLanguages
                .filter((lang) => lang.code !== "en" && names[lang.code]?.trim())
                .map((lang) => ({ languageCode: lang.locale, name: names[lang.code].trim() }))
        )
    );

    const primaryName = $derived(
        names.en?.trim() ||
            Object.values(names)
                .find((name) => name.trim().length > 0)
                ?.trim() ||
            ""
    );

    const isEnglishTab = $derived(activeLangCode.toLowerCase() === "en");

    const onSubmit = (event: SubmitEvent) => {
        if (!hasAnyName) {
            event.preventDefault();
            event.stopImmediatePropagation();
            formError = t.nameRequired;
            return;
        }
        if (!slug.trim()) {
            event.preventDefault();
            event.stopImmediatePropagation();
            formError = t.slugRequired;
            return;
        }
        formError = "";
    };
</script>

<div
    class="w-[92vw] max-w-120 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl md:w-120"
>
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">
            {mode === "create" ? t.addModalTitle : t.editModalTitle}
        </h3>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title={t.closeModal}
        >
            <XIcon class="h-5 w-5" />
        </button>
    </div>

    <form
        method="POST"
        action={mode === "create" ? "?/create" : "?/update"}
        bind:this={formEl}
        onsubmit={onSubmit}
        use:enhance={() => {
            submitting = true;
            return async ({ result, update }) => {
                await update({ reset: false });
                if (result.type === "success") {
                    onClose();
                } else {
                    submitting = false;
                }
            };
        }}
        class="w-full"
    >
        <div class="space-y-4 p-6">
            {#if formError}
                <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {formError}
                </div>
            {/if}

            {#if mode === "edit" && category}
                <input type="hidden" name="id" value={category.id} />
            {/if}
            <input type="hidden" name="name" value={primaryName} />
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="translations" value={translationsPayload} />

            <div class="pb-1">
                <LanguageTabs
                    languages={contentLanguages}
                    activeCode={activeLangCode}
                    onSelect={(code) => (activeLangCode = code)}
                />
            </div>

            <CategoryNameField
                {t}
                {activeLangCode}
                value={names[activeLangCode] ?? ""}
                disabled={submitting}
                onInput={onNameInput}
            />

            <SlugField
                {t}
                {slug}
                disabled={submitting || !isEnglishTab}
                {isEnglishTab}
                {isCheckingSlug}
                isTaken={slugTaken}
                {suggestedSlug}
                onInput={onSlugInput}
                onApplySuggestion={applySuggestedSlug}
            />
        </div>
        <div class="border-t border-gray-100"></div>
        <div class="flex items-center justify-end gap-3 px-6 py-4">
            <button
                type="button"
                disabled={submitting}
                onclick={onClose}
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={submitting || isCheckingSlug}
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-sm font-medium text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {#if submitting}
                    <LoaderCircle class="h-4 w-4 animate-spin" />
                {/if}
                <span>{mode === "create" ? t.saveCategory : t.saveChanges}</span>
            </button>
        </div>
    </form>
</div>
