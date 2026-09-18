<script lang="ts">
    import { UploadCloud as UploadCloudIcon } from "lucide-svelte/icons";

    interface Props {
        isDragging: boolean;
        uploading: boolean;
        dropOrBrowseText: string;
        supportedFormatsText: string;
        browseFilesText: string;
        onDrop: (e: DragEvent) => void;
        onDragOver: (e: DragEvent) => void;
        onDragLeave: () => void;
        onFileInputChange: (e: Event) => void;
    }

    let {
        isDragging,
        uploading,
        dropOrBrowseText,
        supportedFormatsText,
        browseFilesText,
        onDrop,
        onDragOver,
        onDragLeave,
        onFileInputChange
    }: Props = $props();
</script>

<label
    ondrop={onDrop}
    ondragover={onDragOver}
    ondragleave={onDragLeave}
    class={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
        isDragging
            ? "border-theme-500 bg-theme-50/50"
            : "border-gray-200 bg-gray-50/60 hover:border-theme-400 hover:bg-theme-50/30"
    }`}
>
    <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onchange={onFileInputChange}
        class="hidden"
        disabled={uploading}
    />
    <div
        class="flex h-12 w-12 items-center justify-center rounded-full bg-theme-100 text-theme-600"
    >
        <UploadCloudIcon class="h-6 w-6" />
    </div>
    <div class="space-y-1">
        <p class="text-sm font-medium text-gray-900">
            {dropOrBrowseText}
        </p>
        <p class="text-xs text-gray-500">
            {supportedFormatsText}
        </p>
    </div>
    <span
        class="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
    >
        {browseFilesText}
    </span>
</label>
