<script lang="ts">
    import { resolve } from "$app/paths";

    import LanguageTabs from "$lib/components/admin/LanguageTabs.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";

    import VideoEditMetadataForm from "./_components/VideoEditMetadataForm.svelte";
    import VideoEditSideSettings from "./_components/VideoEditSideSettings.svelte";
    import { useVideoEdit } from "./use-video-edit.svelte";

    let { data } = $props();
    const t = $derived(data.t);

    $effect(() => {
        pageTitleStore.set(t.editPageTitle);
    });

    const videoEdit = useVideoEdit(() => t);

    const categoryOptions = $derived(
        videoEdit.categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state("en");
    let titles = $state<Record<string, string>>({});
    let descriptions = $state<Record<string, string>>({});
    let categoryId = $state("");
    let status = $state("draft");
    let thumbnailPreviewUrl = $state("");

    let seeded = false;
    $effect(() => {
        const video = videoEdit.video;
        if (!video || seeded) return;
        seeded = true;

        const seedTitles: Record<string, string> = { en: video.title ?? "" };
        const seedDescriptions: Record<string, string> = { en: video.description ?? "" };
        for (const translation of video.translations) {
            seedTitles[translation.languageCode] = translation.title;
            seedDescriptions[translation.languageCode] = translation.description;
        }

        titles = seedTitles;
        descriptions = seedDescriptions;
        categoryId = video.categoryId ?? "";
        status = video.status;
        thumbnailPreviewUrl = video.thumbnail?.medium ?? "";
    });

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
</script>

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

    {#if videoEdit.loading}
        <div class="flex justify-center py-12">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-theme-600"
            ></div>
        </div>
    {:else if videoEdit.video}
        <form onsubmit={videoEdit.handleSubmit} enctype="multipart/form-data">
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
                    href={resolve("/admin-panel/watch/videos")}
                    class={`rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 ${videoEdit.submitting ? "pointer-events-none opacity-50" : ""}`}
                >
                    {t.cancel}
                </a>
                <button
                    type="submit"
                    disabled={videoEdit.submitting}
                    class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
                >
                    {videoEdit.submitting ? t.uploadingLabel : t.submitPublish}
                </button>
            </div>
        </form>
    {/if}
</div>
