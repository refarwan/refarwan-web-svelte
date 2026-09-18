<script lang="ts">
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";

    import ThumbnailSelector from "./ThumbnailSelector.svelte";
    import TagsInput from "$lib/components/admin/TagsInput.svelte";

    interface Props {
        t: Record<string, string>;
        thumbnailMode: "upload" | "video";
        onThumbnailModeChange: (mode: "upload" | "video") => void;
        thumbnailPreviewUrl: string;
        onThumbnailSelect: (file: File | undefined) => void;
        onThumbnailClear: () => void;
        videoPreviewUrl: string;
        videoDuration: number;
        videoCurrentTime: number;
        onVideoTimeChange: (time: number) => void;
        onVideoLoadedMetadata: (duration: number) => void;
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
        thumbnailMode,
        onThumbnailModeChange,
        thumbnailPreviewUrl,
        onThumbnailSelect,
        onThumbnailClear,
        videoPreviewUrl,
        videoDuration,
        videoCurrentTime,
        onVideoTimeChange,
        onVideoLoadedMetadata,
        status,
        onStatusChange,
        tags,
        tagInput,
        onTagInputChange,
        onAddTag,
        onRemoveTag
    }: Props = $props();

    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" }
    ];
</script>

<div class="w-full space-y-5 lg:w-75 lg:shrink-0">
    <ThumbnailSelector
        {t}
        mode={thumbnailMode}
        onModeChange={onThumbnailModeChange}
        {thumbnailPreviewUrl}
        {onThumbnailSelect}
        {onThumbnailClear}
        {videoPreviewUrl}
        {videoDuration}
        {videoCurrentTime}
        {onVideoTimeChange}
        {onVideoLoadedMetadata}
    />

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
