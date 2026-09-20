<script lang="ts">
    import DropdownSelect from "../../../_components/DropdownSelect.svelte";
    import TagsInput from "../../../_components/TagsInput.svelte";
    import TechIconsInput from "../../../_components/TechIconsInput.svelte";
    import ThumbnailUploadMode from "../../../_components/ThumbnailUploadMode.svelte";

    interface Props {
        t: Record<string, string>;
        thumbnailPreviewUrl: string;
        onThumbnailSelect: (file: File | undefined) => void;
        onThumbnailClear: () => void;
        status: string;
        onStatusChange: (value: string) => void;
        tags: string[];
        tagInput: string;
        onTagInputChange: (value: string) => void;
        onAddTag: (event: KeyboardEvent) => void;
        onRemoveTag: (tag: string) => void;
        githubLink: string;
        onGithubLinkChange: (value: string) => void;
        gitlabLink: string;
        onGitlabLinkChange: (value: string) => void;
        demoLink: string;
        onDemoLinkChange: (value: string) => void;
        techIcons: string[];
        onAddTechIcon: (icon: string) => void;
        onRemoveTechIcon: (icon: string) => void;
    }

    let {
        t,
        thumbnailPreviewUrl,
        onThumbnailSelect,
        onThumbnailClear,
        status,
        onStatusChange,
        tags,
        tagInput,
        onTagInputChange,
        onAddTag,
        onRemoveTag,
        githubLink,
        onGithubLinkChange,
        gitlabLink,
        onGitlabLinkChange,
        demoLink,
        onDemoLinkChange,
        techIcons,
        onAddTechIcon,
        onRemoveTechIcon
    }: Props = $props();

    const statusOptions = $derived([
        { value: "draft", label: t.statusDraft || "Draft" },
        { value: "published", label: t.statusPublished || "Published" },
        { value: "archived", label: t.statusArchived || "Archived" }
    ]);
</script>

<div class="w-full space-y-5 lg:w-75 lg:shrink-0">
    <div class="space-y-1.5">
        <span class="block text-sm font-medium text-gray-700">{t.thumbnailLabel}</span>
        <ThumbnailUploadMode
            {t}
            previewUrl={thumbnailPreviewUrl}
            onFileSelect={onThumbnailSelect}
            onClear={onThumbnailClear}
        />
    </div>

    <DropdownSelect
        label={t.statusLabel}
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
        placeholder={t.statusPlaceholder}
    />

    <TagsInput
        {t}
        id="project-tags-input"
        {tags}
        {tagInput}
        {onTagInputChange}
        {onAddTag}
        {onRemoveTag}
    />

    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="project-github-link"
            >{t.githubLinkLabel}</label
        >
        <input
            id="project-github-link"
            type="url"
            value={githubLink}
            oninput={(event) => onGithubLinkChange((event.target as HTMLInputElement).value)}
            placeholder={t.githubLinkPlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        />
    </div>

    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="project-gitlab-link"
            >{t.gitlabLinkLabel}</label
        >
        <input
            id="project-gitlab-link"
            type="url"
            value={gitlabLink}
            oninput={(event) => onGitlabLinkChange((event.target as HTMLInputElement).value)}
            placeholder={t.gitlabLinkPlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        />
    </div>

    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="project-demo-link"
            >{t.demoLinkLabel}</label
        >
        <input
            id="project-demo-link"
            type="url"
            value={demoLink}
            oninput={(event) => onDemoLinkChange((event.target as HTMLInputElement).value)}
            placeholder={t.demoLinkPlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        />
    </div>

    <TechIconsInput {t} icons={techIcons} onAdd={onAddTechIcon} onRemove={onRemoveTechIcon} />
</div>
