<script lang="ts">
    import { Loader2, UploadCloud } from "lucide-svelte/icons";

    interface Props {
        uploading: boolean;
        uploadError: string;
        onUpload: (e: Event) => void;
    }

    let { uploading, uploadError, onUpload }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center p-4">
    {#if uploadError}
        <div class="mb-4 w-full rounded-lg bg-red-50 p-3 text-xs text-red-600">
            {uploadError}
        </div>
    {/if}
    <label
        class="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-10 hover:border-theme-500 hover:bg-theme-50/30"
    >
        <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onchange={onUpload}
            class="hidden"
            disabled={uploading}
        />
        {#if uploading}
            <Loader2 class="size-10 animate-spin text-theme-600" />
            <p class="text-sm font-medium text-gray-600">Mengupload gambar...</p>
        {:else}
            <div
                class="flex size-12 items-center justify-center rounded-full bg-theme-100 text-theme-600"
            >
                <UploadCloud class="size-6" />
            </div>
            <p class="text-sm font-medium text-gray-800">Klik untuk upload gambar baru</p>
            <p class="text-xs text-gray-400">JPG, PNG, WebP, GIF, AVIF up to 10MB</p>
        {/if}
    </label>
</div>
