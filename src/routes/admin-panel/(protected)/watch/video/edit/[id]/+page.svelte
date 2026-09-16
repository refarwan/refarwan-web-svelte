<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { enhance } from "$app/forms";

    import LanguageTabs from "$lib/components/admin/LanguageTabs.svelte";
    import { popup } from "$lib/stores/popup.svelte";

    import VideoEditMetadataForm from "./_components/VideoEditMetadataForm.svelte";
    import VideoEditSideSettings from "./_components/VideoEditSideSettings.svelte";

    let { data } = $props();
    const t = $derived(data.t);
    const video = data.video;

    const categoryOptions = $derived(
        data.categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state("en");

    const seedTitles = (): Record<string, string> => {
        const titles: Record<string, string> = { en: video.title ?? "" };
        for (const translation of video.translations) {
            titles[translation.languageCode] = translation.title;
        }
        return titles;
    };

    const seedDescriptions = (): Record<string, string> => {
        const descriptions: Record<string, string> = { en: video.description ?? "" };
        for (const translation of video.translations) {
            descriptions[translation.languageCode] = translation.description;
        }
        return descriptions;
    };

    let titles = $state<Record<string, string>>(seedTitles());
    let descriptions = $state<Record<string, string>>(seedDescriptions());
    let categoryId = $state(video.categoryId ?? "");
    let status = $state<string>(video.status);
    let thumbnailPreviewUrl = $state(video.thumbnail?.medium ?? "");

    const handleThumbnailFile = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            popup.error({ message: t.invalidThumbnailType });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            popup.error({ message: t.thumbnailSizeExceeded });
            return;
        }
        thumbnailPreviewUrl = URL.createObjectURL(file);
    };

    const clearThumbnail = () => {
        thumbnailPreviewUrl = "";
    };

    const primaryTitle = $derived(
        titles.en?.trim() ||
            titles[activeLangCode]?.trim() ||
            Object.values(titles)
                .find((title) => title.trim())
                ?.trim() ||
            ""
    );
    const primaryDescription = $derived(
        descriptions.en?.trim() || descriptions[activeLangCode]?.trim() || ""
    );

    const translationsPayload = $derived(
        JSON.stringify(
            data.contentLanguages
                .filter((lang) => lang.code !== "en" && titles[lang.code]?.trim())
                .map((lang) => ({
                    languageCode: lang.locale,
                    title: titles[lang.code].trim(),
                    description: descriptions[lang.code]?.trim() || titles[lang.code].trim()
                }))
        )
    );

    let submitting = $state(false);
</script>

<svelte:head>
    <title>{t.editPageTitle}</title>
</svelte:head>

<div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-semibold text-gray-900">{t.editPageTitle}</h2>

        {#if data.contentLanguages.length > 1}
            <LanguageTabs
                languages={data.contentLanguages}
                activeCode={activeLangCode}
                onSelect={(code) => (activeLangCode = code)}
            />
        {/if}
    </div>

    <form
        method="POST"
        action="?/update"
        enctype="multipart/form-data"
        use:enhance={() => {
            submitting = true;
            return async ({ result, update }) => {
                await update({ reset: false });
                submitting = false;
                if (result.type === "success") {
                    popup.success({ message: t.updated });
                    void goto(resolve("/admin-panel/watch/video"));
                }
            };
        }}
    >
        <input type="hidden" name="title" value={primaryTitle} />
        <input type="hidden" name="description" value={primaryDescription} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="translations" value={translationsPayload} />

        <div class="flex flex-col items-start gap-6 lg:flex-row">
            <VideoEditMetadataForm
                {t}
                title={titles[activeLangCode] ?? ""}
                onTitleChange={(value) => (titles = { ...titles, [activeLangCode]: value })}
                {categoryId}
                onCategoryChange={(value) => (categoryId = value)}
                {categoryOptions}
                description={descriptions[activeLangCode] ?? ""}
                onDescriptionChange={(value) =>
                    (descriptions = { ...descriptions, [activeLangCode]: value })}
            />

            <VideoEditSideSettings
                {t}
                {thumbnailPreviewUrl}
                onThumbnailSelect={handleThumbnailFile}
                onThumbnailClear={clearThumbnail}
                {status}
                onStatusChange={(value) => (status = value)}
            />
        </div>

        <div class="flex items-center justify-end gap-3 pt-6">
            <a
                href={resolve("/admin-panel/watch/video")}
                class={`rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 ${submitting ? "pointer-events-none opacity-50" : ""}`}
            >
                {t.cancel}
            </a>
            <button
                type="submit"
                disabled={submitting}
                class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {submitting ? t.uploadingLabel : t.submitPublish}
            </button>
        </div>
    </form>
</div>
