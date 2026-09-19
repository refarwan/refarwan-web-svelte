<script lang="ts">
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";
    import TagsInput from "$lib/components/admin/TagsInput.svelte";
    import ThumbnailUploadMode from "$lib/components/admin/ThumbnailUploadMode.svelte";

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
        onRemoveTag
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
        id="article-tags-input"
        {tags}
        {tagInput}
        {onTagInputChange}
        {onAddTag}
        {onRemoveTag}
    />
</div>
