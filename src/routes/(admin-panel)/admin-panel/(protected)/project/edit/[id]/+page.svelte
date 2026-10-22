<script lang="ts">
    import { resolve } from "$app/paths";
    import { untrack } from "svelte";
    import FormSubmitActions from "../../../_components/FormSubmitActions.svelte";
    import LanguageTabs from "../../../_components/LanguageTabs.svelte";
    import { pageTitleStore } from "../../../../../stores/page-title.svelte";
    import { popup } from "../../../../../stores/popup.svelte";
    import ProjectMetadataForm from "../../create-project/_components/ProjectMetadataForm.svelte";
    import ProjectSideSettings from "../../create-project/_components/ProjectSideSettings.svelte";
    import { useProjectEdit } from "./use-project-edit.svelte";

    let { data } = $props();
    const t = $derived(data.t);
    const editorT = $derived(data.editorT);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(t.editPageTitle);
    });

    const projectEdit = useProjectEdit(() => t);

    const categoryOptions = $derived(
        projectEdit.categories.map((category) => ({ value: category.id, label: category.name }))
    );

    let activeLangCode = $state(untrack(() => data.contentLanguages[0]?.locale ?? "en-US"));

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

    let isReady = $state(false);

    $effect(() => {
        const project = projectEdit.project;
        if (!project || isReady) return;

        const seedTitles: Record<string, string> = { "en-US": project.title ?? "" };
        const seedShortDescriptions: Record<string, string> = {
            "en-US": project.shortDescription ?? ""
        };
        const seedContents: Record<string, { json: unknown; html: string }> = {
            "en-US": {
                json: project.contentJSON ?? {},
                html: project.contentHTML ?? ""
            }
        };

        for (const translation of project.translations) {
            const matchedLang = data.contentLanguages.find(
                (l) => l.locale === translation.languageCode
            );
            const key = matchedLang ? matchedLang.locale : translation.languageCode;
            seedTitles[key] = translation.title;
            seedShortDescriptions[key] = translation.shortDescription ?? "";
            seedContents[key] = {
                json: translation.contentJSON ?? {},
                html: translation.contentHTML ?? ""
            };
        }

        titles = seedTitles;
        shortDescriptions = seedShortDescriptions;
        contents = seedContents;
        categoryId = project.categoryId ?? "";
        status = project.status;
        thumbnailPreviewUrl =
            project.thumbnail?.medium || project.thumbnail?.large || project.thumbnail?.small || "";
        githubLink = project.githubLink ?? "";
        gitlabLink = project.gitlabLink ?? "";
        demoLink = project.demoLink ?? "";
        techIcons = project.techIcons ? [...project.techIcons] : [];
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

    const addTechIcon = (icon: string) => {
        if (!techIcons.includes(icon)) techIcons = [...techIcons, icon];
    };

    const removeTechIcon = (icon: string) => {
        techIcons = techIcons.filter((existing) => existing !== icon);
    };

    const primaryTitle = $derived(
        titles["en-US"]?.trim() ||
            titles[activeLangCode]?.trim() ||
            Object.values(titles)
                .find((title) => title.trim())
                ?.trim() ||
            ""
    );

    const primaryShortDescription = $derived(
        shortDescriptions["en-US"]?.trim() || shortDescriptions[activeLangCode]?.trim() || ""
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
                        lang.locale !== "en-US" &&
                        (titles[lang.locale]?.trim() || contents[lang.locale]?.html)
                )
                .map((lang) => ({
                    languageCode: lang.locale,
                    title: titles[lang.locale]?.trim() || primaryTitle,
                    shortDescription: shortDescriptions[lang.locale]?.trim() || "",
                    contentJSON: contents[lang.locale]?.json ?? {},
                    contentHTML: contents[lang.locale]?.html ?? ""
                }))
        )
    );

    const submit = async () => {
        if (!primaryTitle.trim()) {
            popup.error({ message: t.titleRequired });
            return;
        }
        if (!thumbnailFile && !thumbnailPreviewUrl) {
            popup.error({ message: t.thumbnailRequired });
            return;
        }

        const formData = new FormData();
        formData.append("title", primaryTitle);
        if (projectEdit.project?.slug) {
            formData.append("slug", projectEdit.project.slug);
        }
        formData.append("shortDescription", primaryShortDescription);
        formData.append("categoryId", categoryId);
        formData.append("status", status);
        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        }
        formData.append("contentJSON", JSON.stringify(primaryContent.json));
        formData.append("contentHTML", primaryContent.html);
        formData.append("githubLink", githubLink.trim());
        formData.append("gitlabLink", gitlabLink.trim());
        formData.append("demoLink", demoLink.trim());
        formData.append("techIcons", JSON.stringify(techIcons));
        formData.append("translations", translationsPayload);

        await projectEdit.update(formData);
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

    {#if projectEdit.loading || !isReady}
        <div class="flex h-64 items-center justify-center">
            <div
                class="h-8 w-8 animate-spin rounded-full border-4 border-theme-600 border-t-transparent"
            ></div>
        </div>
    {:else}
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
            submitting={projectEdit.submitting}
            loadingLabel={t.saving}
            onSubmit={submit}
        />
    {/if}
</div>
