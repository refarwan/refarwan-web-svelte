<script lang="ts">
    import { onMount } from "svelte";

    import { resolve } from "$app/paths";

    import LanguageTabs from "$lib/components/admin/LanguageTabs.svelte";
    import { authorizedHttp } from "$lib/api/authorized-http";
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";

    import ArticleMetadataForm from "./_components/ArticleMetadataForm.svelte";
    import ArticleSideSettings from "./_components/ArticleSideSettings.svelte";
    import CreateArticleActions from "./_components/CreateArticleActions.svelte";

    import type { AdminOptionItem, DataResponse } from "$lib/types";

    let { data } = $props();
    const t = $derived(data.t);
    const editorT = $derived(data.editorT);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.blogCreateArticle);
    });

    let categories = $state<AdminOptionItem[]>([]);
    onMount(() => {
        void (async () => {
            try {
                const res = await authorizedHttp.get<DataResponse<AdminOptionItem[]>>(
                    "/article-category/admin-options"
                );
                categories = res.data.data;
            } catch {
                categories = [];
            }
        })();
    });

    const categoryOptions = $derived(
        categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state(data.contentLanguages[0]?.code ?? "en");

    let titles = $state<Record<string, string>>({});
    let shortDescriptions = $state<Record<string, string>>({});
    let categoryId = $state("");
    let status = $state("draft");

    let thumbnailPreviewUrl = $state("");

    let tags = $state<string[]>([]);
    let tagInput = $state("");

    const handleThumbnailFile = (file: File | undefined) => {
        if (!file) return;
        thumbnailPreviewUrl = URL.createObjectURL(file);
    };

    const clearThumbnail = () => {
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

    const submit = (nextStatus: string) => {
        if (!primaryTitle.trim()) {
            popup.error({ message: t.titleRequired });
            return;
        }
        status = nextStatus;
        popup.alert({ message: t.notImplementedYet });
    };
</script>

<div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-lg font-semibold text-gray-900">{t.pageHeading}</h2>
        <LanguageTabs
            languages={data.contentLanguages}
            activeCode={activeLangCode}
            onSelect={(code) => (activeLangCode = code)}
        />
    </div>

    <div class="flex flex-col items-start gap-6 lg:flex-row">
        <ArticleMetadataForm
            {t}
            {editorT}
            title={titles[activeLangCode] ?? ""}
            onTitleChange={(value) => (titles = { ...titles, [activeLangCode]: value })}
            {categoryId}
            onCategoryChange={(value) => (categoryId = value)}
            {categoryOptions}
            shortDescription={shortDescriptions[activeLangCode] ?? ""}
            onShortDescriptionChange={(value) =>
                (shortDescriptions = { ...shortDescriptions, [activeLangCode]: value })}
        />

        <ArticleSideSettings
            {t}
            {thumbnailPreviewUrl}
            onThumbnailSelect={handleThumbnailFile}
            onThumbnailClear={clearThumbnail}
            {status}
            onStatusChange={(value) => (status = value)}
            {tags}
            {tagInput}
            onTagInputChange={(value) => (tagInput = value)}
            {onAddTag}
            onRemoveTag={removeTag}
        />
    </div>

    <CreateArticleActions
        {t}
        cancelLabel={commonT.cancel}
        cancelHref={resolve("/admin-panel/blog/articles")}
        onSaveDraft={() => submit("draft")}
        onPublish={() => submit("published")}
    />
</div>
