<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        selectedFile: File;
        previewUrl: string | null;
        uploading: boolean;
        closeModalTitle: string;
        onClear: () => void;
    }

    let { selectedFile, previewUrl, uploading, closeModalTitle, onClear }: Props = $props();

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };
</script>

<div class="space-y-3">
    <div
        class="relative flex max-h-64 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-900/5 p-2"
    >
        {#if previewUrl}
            <img
                src={previewUrl}
                alt="Upload Preview"
                class="max-h-60 max-w-full rounded-lg object-contain"
            />
        {/if}
        <button
            type="button"
            onclick={onClear}
            disabled={uploading}
            class="absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
            title={closeModalTitle}
        >
            <Icon icon="lucide:x" class="h-4 w-4" />
        </button>
    </div>

    <div
        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2 text-xs text-gray-600"
    >
        <div class="flex items-center gap-2 truncate">
            <Icon icon="lucide:image" class="h-4 w-4 shrink-0 text-gray-400" />
            <span class="truncate font-medium text-gray-800">{selectedFile.name}</span>
        </div>
        <span class="shrink-0 text-gray-500">{formatFileSize(selectedFile.size)}</span>
    </div>
</div>
