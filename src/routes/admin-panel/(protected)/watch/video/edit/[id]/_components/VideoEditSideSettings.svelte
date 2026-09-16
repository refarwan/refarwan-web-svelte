<script lang="ts">
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";
    import ThumbnailUploadMode from "$lib/components/admin/ThumbnailUploadMode.svelte";

    interface Props {
        t: Record<string, string>;
        thumbnailPreviewUrl: string;
        onThumbnailSelect: (file: File | undefined) => void;
        onThumbnailClear: () => void;
        status: string;
        onStatusChange: (value: string) => void;
    }

    let {
        t,
        thumbnailPreviewUrl,
        onThumbnailSelect,
        onThumbnailClear,
        status,
        onStatusChange
    }: Props = $props();

    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" }
    ];
</script>

<div class="w-full space-y-5 lg:w-75 lg:shrink-0">
    <div class="space-y-2">
        <span class="block text-sm font-medium text-gray-900">{t.thumbnailLabel}</span>
        <ThumbnailUploadMode
            {t}
            previewUrl={thumbnailPreviewUrl}
            onFileSelect={onThumbnailSelect}
            onClear={onThumbnailClear}
            name="thumbnail"
        />
    </div>

    <DropdownSelect
        label={t.statusLabel}
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
        placeholder={t.statusPlaceholder}
    />
</div>
