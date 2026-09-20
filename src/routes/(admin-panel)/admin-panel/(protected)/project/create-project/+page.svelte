<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { onMount, untrack } from "svelte";
    import FormSubmitActions from "../../_components/FormSubmitActions.svelte";
    import LanguageTabs from "../../_components/LanguageTabs.svelte";
    import { authorizedHttp } from "../../../../api/authorized-http";
    import { pageTitleStore } from "../../../../stores/page-title.svelte";
    import { popup } from "../../../../stores/popup.svelte";
    import { axiosErrorMessage } from "../../../../utils/axios-error-message";
    import ProjectMetadataForm from "./_components/ProjectMetadataForm.svelte";
    import ProjectSideSettings from "./_components/ProjectSideSettings.svelte";

    import type { DataResponse } from "$lib/types/api-response";
    import type { AdminOptionItem } from "$lib/types/project-category";

    let { data } = $props();
    const t = $derived(data.t);
    const editorT = $derived(data.editorT);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT?.projectCreateProject ?? t.createPageTitle);
    });

    let categories = $state<AdminOptionItem[]>([]);
    onMount(() => {
        void (async () => {
            try {
                const res = await authorizedHttp.get<DataResponse<AdminOptionItem[]>>(
                    "/project-category/admin-options"
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

    let githubLink = $state("");
    let gitlabLink = $state("");
    let demoLink = $state("");
    let techIcons = $state<string[]>([]);

    let submitting = $state(false);

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

    const addTechIcon = (icon: string) => {
        if (!techIcons.includes(icon)) techIcons = [...techIcons, icon];
    };

    const removeTechIcon = (icon: string) => {
        techIcons = techIcons.filter((existing) => existing !== icon);
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
        if (!thumbnailFile) {
            popup.error({ message: t.thumbnailRequired });
            return;
        }

        submitting = true;
        try {
            const formData = new FormData();
            formData.append("title", primaryTitle);
            if (primaryShortDescription) {
                formData.append("shortDescription", primaryShortDescription);
            }
            if (categoryId) {
                formData.append("categoryId", categoryId);
            }
            formData.append("status", status);
            formData.append("thumbnail", thumbnailFile);
            formData.append("contentJSON", JSON.stringify(primaryContent.json));
            formData.append("contentHTML", primaryContent.html);
            if (githubLink) formData.append("githubLink", githubLink);
            if (gitlabLink) formData.append("gitlabLink", gitlabLink);
            if (demoLink) formData.append("demoLink", demoLink);
            if (techIcons.length > 0) {
                formData.append("techIcons", JSON.stringify(techIcons));
            }

            const trList = JSON.parse(translationsPayload) as unknown[];
            if (trList.length > 0) {
                formData.append("translations", translationsPayload);
            }

            await authorizedHttp.post("/project", formData);
            popup.success({ message: t.created });
            await goto(resolve("/admin-panel/project"));
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, t.createFailed) });
        } finally {
            submitting = false;
        }
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

    <div class="flex w-full min-w-0 flex-col items-start gap-6 lg:flex-row">
        <ProjectMetadataForm
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

        <ProjectSideSettings
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
            {githubLink}
            onGithubLinkChange={(value) => (githubLink = value)}
            {gitlabLink}
            onGitlabLinkChange={(value) => (gitlabLink = value)}
            {demoLink}
            onDemoLinkChange={(value) => (demoLink = value)}
            {techIcons}
            onAddTechIcon={addTechIcon}
            onRemoveTechIcon={removeTechIcon}
        />
    </div>

    <FormSubmitActions
        {t}
        cancelLabel={commonT.cancel}
        cancelHref={resolve("/admin-panel/project")}
        {status}
        {submitting}
        loadingLabel={t.saving}
        onSubmit={submit}
    />
</div>
