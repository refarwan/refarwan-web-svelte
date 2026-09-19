<script lang="ts">
    import { resolve } from "$app/paths";
    import { untrack } from "svelte";
    import FormSubmitActions from "$lib/components/admin/FormSubmitActions.svelte";
    import LanguageTabs from "$lib/components/admin/LanguageTabs.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import VideoSideSettings from "../../../upload/_components/VideoSideSettings.svelte";
    import VideoEditMetadataForm from "./_components/VideoEditMetadataForm.svelte";
    import { useVideoEdit } from "./use-video-edit.svelte";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(t.editPageTitle);
    });

    const videoEdit = useVideoEdit(() => t);

    const categoryOptions = $derived(
        videoEdit.categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state(untrack(() => data.contentLanguages[0]?.code ?? "en"));
    let titles = $state<Record<string, string>>({});
    let descriptions = $state<Record<string, string>>({});
    let categoryId = $state("");
    let status = $state("draft");

    let thumbnailMode = $state<"upload" | "video">("upload");
    let thumbnailFile = $state<File | null>(null);
    let thumbnailPreviewUrl = $state("");

    let videoPreviewUrl = $state("");
    let videoDuration = $state(0);
    let videoCurrentTime = $state(0);

    let tags = $state<string[]>(["Tutorial", "Review", "Coding", "Vlog"]);
    let tagInput = $state("");

    let isReady = $state(false);
    $effect(() => {
        const video = videoEdit.video;
        if (!video || isReady) return;

        const seedTitles: Record<string, string> = { en: video.title ?? "" };
        const seedDescriptions: Record<string, string> = { en: video.description ?? "" };
        for (const translation of video.translations) {
            const matchedLang = data.contentLanguages.find(
                (l) => l.locale === translation.languageCode || l.code === translation.languageCode
            );
            const key = matchedLang ? matchedLang.code : translation.languageCode;
            seedTitles[key] = translation.title;
            seedDescriptions[key] = translation.description;
        }

        titles = seedTitles;
        descriptions = seedDescriptions;
        categoryId = video.categoryId ?? "";
        status = video.status;
        thumbnailPreviewUrl =
            video.thumbnail?.medium || video.thumbnail?.large || video.thumbnail?.small || "";
        videoPreviewUrl = video.p720 || video.p360 || video.p1080 || "";
        videoDuration = video.duration || 0;
        isReady = true;
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
        thumbnailFile = file;
        thumbnailPreviewUrl = URL.createObjectURL(file);
    };

    const clearThumbnail = () => {
        thumbnailFile = null;
        thumbnailPreviewUrl = "";
    };

    const onAddTag = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== ",") return;
        event.preventDefault();
        const trimmed = tagInput.trim().replace(/^,+|,+$/g, "");
        if (trimmed && !tags.includes(trimmed)) {
            tags = [...tags, trimmed];
            tagInput = "";
        }
    };

    const removeTag = (tag: string) => {
        tags = tags.filter((existing) => existing !== tag);
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

    const submit = async () => {
        if (!primaryTitle.trim()) {
            popup.error({ message: t.titleRequired });
            return;
        }

        const formData = new FormData();
        formData.append("title", primaryTitle);
        if (primaryDescription) {
            formData.append("description", primaryDescription);
        }
        if (categoryId) {
            formData.append("categoryId", categoryId);
        }
        formData.append("status", status);
        if (translationsPayload !== "[]") {
            formData.append("translations", translationsPayload);
        }
        if (thumbnailMode === "upload" && thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        } else if (thumbnailMode === "video") {
            formData.append("thumbnailPosition", String(Math.round(videoCurrentTime)));
        }

        await videoEdit.update(formData);
    };
</script>

<div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {#if data.contentLanguages.length > 1}
            <LanguageTabs
                languages={data.contentLanguages}
                activeCode={activeLangCode}
                onSelect={(code) => (activeLangCode = code)}
            />
        {/if}
    </div>

    {#if videoEdit.loading || !isReady}
        <div class="flex h-64 items-center justify-center">
            <div
                class="h-8 w-8 animate-spin rounded-full border-4 border-theme-600 border-t-transparent"
            ></div>
        </div>
    {:else if videoEdit.video}
        <div class="flex flex-col items-start gap-6 lg:flex-row">
            <VideoEditMetadataForm
                {t}
                video={videoEdit.video}
                title={titles[activeLangCode] ?? ""}
                onTitleChange={(value) => (titles = { ...titles, [activeLangCode]: value })}
                {categoryId}
                onCategoryChange={(value) => (categoryId = value)}
                {categoryOptions}
                description={descriptions[activeLangCode] ?? ""}
                onDescriptionChange={(value) =>
                    (descriptions = { ...descriptions, [activeLangCode]: value })}
            />

            <VideoSideSettings
                {t}
                {thumbnailMode}
                onThumbnailModeChange={(mode) => (thumbnailMode = mode)}
                {thumbnailPreviewUrl}
                onThumbnailSelect={handleThumbnailFile}
                onThumbnailClear={clearThumbnail}
                {videoPreviewUrl}
                {videoDuration}
                {videoCurrentTime}
                onVideoTimeChange={(time) => (videoCurrentTime = time)}
                onVideoLoadedMetadata={(duration) => (videoDuration = duration)}
                {status}
                onStatusChange={(value) => (status = value)}
                {tags}
                {tagInput}
                onTagInputChange={(value) => (tagInput = value)}
                {onAddTag}
                onRemoveTag={removeTag}
            />
        </div>

        <FormSubmitActions
            {t}
            cancelLabel={commonT.cancel}
            cancelHref={resolve("/admin-panel/watch/videos")}
            {status}
            submitting={videoEdit.submitting}
            loadingLabel={t.uploadingLabel}
            onSubmit={submit}
        />
    {/if}
</div>
