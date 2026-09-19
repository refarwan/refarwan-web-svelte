<script lang="ts">
    import Icon from "@iconify/svelte";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";
    import UploadImageDropzone from "./UploadImageDropzone.svelte";
    import UploadImagePreview from "./UploadImagePreview.svelte";

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

<div class="w-[92vw] max-w-130 overflow-hidden rounded-xl border border-gray-100 bg-white md:w-130">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">{t.uploadModalTitle}</h3>
        <button
            type="button"
            onclick={onClose}
            disabled={uploading}
            class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            title={t.closeModal}
        >
            <Icon icon="lucide:x" class="h-5 w-5" />
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
                <UploadImageDropzone
                    {isDragging}
                    {uploading}
                    dropOrBrowseText={t.dropOrBrowse}
                    supportedFormatsText={t.supportedFormats}
                    browseFilesText={t.browseFiles}
                    {onDrop}
                    {onDragOver}
                    {onDragLeave}
                    {onFileInputChange}
                />
            {:else}
                <UploadImagePreview
                    {selectedFile}
                    {previewUrl}
                    {uploading}
                    closeModalTitle={t.closeModal}
                    onClear={clearSelection}
                />
            {/if}
        </div>

        <div class="border-t border-gray-100"></div>

        <div class="flex items-center justify-end gap-3 px-6 py-4">
            <button
                type="button"
                disabled={uploading}
                onclick={onClose}
                class="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={!selectedFile || uploading}
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-theme-700 disabled:opacity-50"
            >
                {#if uploading}
                    <Icon icon="lucide:loader-circle" class="h-4 w-4 animate-spin" />
                    <span>{t.uploading}</span>
                {:else}
                    <span>{t.uploadModalTitle}</span>
                {/if}
            </button>
        </div>
    </form>
</div>
