<script lang="ts">
    import {
        Image as ImageIcon,
        LoaderCircle,
        UploadCloud as UploadCloudIcon,
        X as XIcon
    } from "lucide-svelte/icons";

    import { axiosErrorMessage } from "$lib/utils/axios-error-message";

    import type { AdminTranslation } from "$lib/i18n/admin";

    interface Props {
        onClose: () => void;
        onUpload: (file: File) => Promise<void>;
        t: AdminTranslation["imageLibrary"];
        cancelLabel: string;
    }

    let { onClose, onUpload, t, cancelLabel }: Props = $props();

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

    let selectedFile = $state<File | null>(null);
    let previewUrl = $state<string | null>(null);
    let isDragging = $state(false);
    let uploading = $state(false);
    let errorMessage = $state("");

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleFile = (file: File) => {
        errorMessage = "";
        if (!ALLOWED_TYPES.includes(file.type)) {
            errorMessage = t.invalidFileType;
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            errorMessage = t.fileTooLarge;
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        selectedFile = file;
        previewUrl = URL.createObjectURL(file);
    };

    const onFileInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            handleFile(input.files[0]);
        }
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        isDragging = true;
    };

    const onDragLeave = () => {
        isDragging = false;
    };

    const clearSelection = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        selectedFile = null;
        previewUrl = null;
        errorMessage = "";
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        if (!selectedFile || uploading) return;

        uploading = true;
        errorMessage = "";
        try {
            await onUpload(selectedFile);
            onClose();
        } catch (err) {
            errorMessage = axiosErrorMessage(err, t.uploadFailed);
            uploading = false;
        }
    };
</script>

<div
    class="w-[92vw] max-w-130 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl md:w-130"
>
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">{t.uploadModalTitle}</h3>
        <button
            type="button"
            onclick={onClose}
            disabled={uploading}
            class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            title={t.closeModal}
        >
            <XIcon class="h-5 w-5" />
        </button>
    </div>

    <form onsubmit={handleSubmit} class="w-full">
        <div class="space-y-4 p-6">
            {#if errorMessage}
                <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {errorMessage}
                </div>
            {/if}

            {#if !selectedFile}
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
                            {t.dropOrBrowse}
                        </p>
                        <p class="text-xs text-gray-500">
                            {t.supportedFormats}
                        </p>
                    </div>
                    <span
                        class="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
                    >
                        {t.browseFiles}
                    </span>
                </label>
            {:else}
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
                            onclick={clearSelection}
                            disabled={uploading}
                            class="absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
                            title={t.closeModal}
                        >
                            <XIcon class="h-4 w-4" />
                        </button>
                    </div>

                    <div
                        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-2 text-xs text-gray-600"
                    >
                        <div class="flex items-center gap-2 truncate">
                            <ImageIcon class="h-4 w-4 shrink-0 text-gray-400" />
                            <span class="truncate font-medium text-gray-800"
                                >{selectedFile.name}</span
                            >
                        </div>
                        <span class="shrink-0 text-gray-500"
                            >{formatFileSize(selectedFile.size)}</span
                        >
                    </div>
                </div>
            {/if}
        </div>

        <div class="border-t border-gray-100"></div>

        <div class="flex items-center justify-end gap-3 px-6 py-4">
            <button
                type="button"
                disabled={uploading}
                onclick={onClose}
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={!selectedFile || uploading}
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {#if uploading}
                    <LoaderCircle class="h-4 w-4 animate-spin" />
                    <span>{t.uploading}</span>
                {:else}
                    <span>{t.uploadModalTitle}</span>
                {/if}
            </button>
        </div>
    </form>
</div>
