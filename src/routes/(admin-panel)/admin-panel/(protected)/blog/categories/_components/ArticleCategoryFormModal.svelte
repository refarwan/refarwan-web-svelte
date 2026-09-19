<script lang="ts">
    import Icon from "@iconify/svelte";
    import { untrack } from "svelte";
    import LanguageTabs from "../../../_components/LanguageTabs.svelte";
    import { axiosErrorMessage } from "../../../../../utils/axios-error-message";
    import { slugify } from "../../../../../utils/slugify";
    import CategoryNameField from "./CategoryNameField.svelte";
    import SlugField from "./SlugField.svelte";

    import type { ArticleCategoryDetail } from "$lib/types/article-category";
    import type { ContentLanguage } from "$lib/types/content-language";
    import type { BlogCategory } from "../../../../../i18n/blog-category/types";
    import type { CategoryPayload } from "../use-article-category-list.svelte";

    interface Props {
        mode: "create" | "edit";
        category: ArticleCategoryDetail | null;
        contentLanguages: ContentLanguage[];
        onClose: () => void;
        onCheckSlug: (slug: string, currentSlug?: string) => Promise<string>;
        onCreate: (payload: CategoryPayload) => Promise<void>;
        onUpdate: (id: string, payload: CategoryPayload) => Promise<void>;
        t: BlogCategory;
        cancelLabel: string;
    }

    let {
        mode,
        category,
        contentLanguages,
        onClose,
        onCheckSlug,
        onCreate,
        onUpdate,
        t,
        cancelLabel
    }: Props = $props();

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
    let slug = $state(untrack(() => category?.slug ?? ""));
    let isSlugTouched = $state(untrack(() => Boolean(category?.slug)));
    let isCheckingSlug = $state(false);
    let slugTaken = $state(false);
    let suggestedSlug = $state("");
    let submitting = $state(false);
    let formError = $state("");
    let slugCheckTimeout: ReturnType<typeof setTimeout> | undefined;

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
            const availableSlug = await onCheckSlug(clean, category?.slug);
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

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        if (!hasAnyName) {
            formError = t.nameRequired;
            return;
        }
        if (!slug.trim()) {
            formError = t.slugRequired;
            return;
        }
        formError = "";

        const payload: CategoryPayload = {
            name: primaryName,
            slug: slug || undefined,
            translations: JSON.parse(translationsPayload) as CategoryPayload["translations"]
        };

        submitting = true;
        try {
            if (mode === "create") await onCreate(payload);
            else if (category) await onUpdate(category.id, payload);
            onClose();
        } catch (err) {
            formError = axiosErrorMessage(err, mode === "create" ? t.createFailed : t.updateFailed);
            submitting = false;
        }
    };
</script>

<div class="w-[92vw] max-w-120 overflow-hidden rounded-xl border border-gray-100 bg-white md:w-120">
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
            <Icon icon="lucide:x" class="h-5 w-5" />
        </button>
    </div>

    <form onsubmit={onSubmit} class="w-full">
        <div class="space-y-4 p-6">
            {#if formError}
                <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {formError}
                </div>
            {/if}

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
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={submitting || isCheckingSlug}
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {#if submitting}
                    <Icon icon="lucide:loader-circle" class="h-4 w-4 animate-spin" />
                {/if}
                <span>{mode === "create" ? t.saveCategory : t.saveChanges}</span>
            </button>
        </div>
    </form>
</div>
