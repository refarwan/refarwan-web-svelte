<script lang="ts">
    import { resolve } from "$app/paths";
    import { untrack } from "svelte";
    import FormSubmitActions from "../../../../_components/FormSubmitActions.svelte";
    import LanguageTabs from "../../../../_components/LanguageTabs.svelte";
    import { pageTitleStore } from "../../../../../../stores/page-title.svelte";
    import { popup } from "../../../../../../stores/popup.svelte";
    import ArticleMetadataForm from "../../../create-article/_components/ArticleMetadataForm.svelte";
    import ArticleSideSettings from "../../../create-article/_components/ArticleSideSettings.svelte";
    import { useArticleEdit } from "./use-article-edit.svelte";

    let { data } = $props();
    const t = $derived(data.t);
    const editorT = $derived(data.editorT);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(t.editPageTitle);
    });

    const articleEdit = useArticleEdit(() => t);

    const categoryOptions = $derived(
        articleEdit.categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state(untrack(() => data.contentLanguages[0]?.code ?? "en"));
    let titles = $state<Record<string, string>>({});
    let shortDescriptions = $state<Record<string, string>>({});
    let contents = $state<Record<string, { json: unknown; html: string }>>({});
    let categoryId = $state("");
    let status = $state("draft");

    let thumbnailFile = $state<File | null>(null);
    let thumbnailPreviewUrl = $state("");

    let tags = $state<string[]>([]);
    let tagInput = $state("");

    let isReady = $state(false);
    $effect(() => {
        const article = articleEdit.article;
        if (!article || isReady) return;

        const seedTitles: Record<string, string> = { en: article.title ?? "" };
        const seedShortDescriptions: Record<string, string> = {
            en: article.shortDescription ?? ""
        };
        const seedContents: Record<string, { json: unknown; html: string }> = {
            en: {
                json: article.contentJSON ?? {},
                html: article.contentHTML ?? ""
            }
        };

        for (const translation of article.translations) {
            const matchedLang = data.contentLanguages.find(
                (l) => l.locale === translation.languageCode || l.code === translation.languageCode
            );
            const key = matchedLang ? matchedLang.code : translation.languageCode;
            seedTitles[key] = translation.title;
            seedShortDescriptions[key] = translation.shortDescription;
            seedContents[key] = {
                json: translation.contentJSON ?? {},
                html: translation.contentHTML ?? ""
            };
        }

        titles = seedTitles;
        shortDescriptions = seedShortDescriptions;
        contents = seedContents;
        categoryId = article.categoryId ?? "";
        status = article.status;
        thumbnailPreviewUrl =
            article.thumbnail?.medium || article.thumbnail?.large || article.thumbnail?.small || "";
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

    const primaryShortDescription = $derived(
        shortDescriptions.en?.trim() || shortDescriptions[activeLangCode]?.trim() || ""
    );

    const primaryContent = $derived(
        contents.en ||
            contents[activeLangCode] ||
            Object.values(contents)[0] || { json: {}, html: "" }
    );

    const translationsPayload = $derived(
        JSON.stringify(
            data.contentLanguages
                .filter(
                    (lang) =>
                        lang.code !== "en" &&
                        (titles[lang.code]?.trim() || contents[lang.code]?.html)
                )
                .map((lang) => ({
                    languageCode: lang.locale,
                    title: titles[lang.code]?.trim() || primaryTitle,
                    shortDescription: shortDescriptions[lang.code]?.trim() || "",
                    contentJSON: contents[lang.code]?.json ?? {},
                    contentHTML: contents[lang.code]?.html ?? ""
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
        if (primaryShortDescription) {
            formData.append("shortDescription", primaryShortDescription);
        }
        if (categoryId) {
            formData.append("categoryId", categoryId);
        }
        formData.append("status", status);
        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        }
        formData.append("contentJSON", JSON.stringify(primaryContent.json));
        formData.append("contentHTML", primaryContent.html);
        formData.append("translations", translationsPayload);

        await articleEdit.update(formData);
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

    {#if articleEdit.loading || !isReady}
        <div class="flex h-64 items-center justify-center">
            <div
                class="h-8 w-8 animate-spin rounded-full border-4 border-theme-600 border-t-transparent"
            ></div>
        </div>
    {:else}
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
                {activeLangCode}
                content={contents[activeLangCode]?.json}
                onContentChange={(value) => (contents = { ...contents, [activeLangCode]: value })}
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

        <FormSubmitActions
            {t}
            cancelLabel={commonT.cancel}
            cancelHref={resolve("/admin-panel/blog/articles")}
            {status}
            submitting={articleEdit.submitting}
            loadingLabel={t.saving}
            onSubmit={submit}
        />
    {/if}
</div>
