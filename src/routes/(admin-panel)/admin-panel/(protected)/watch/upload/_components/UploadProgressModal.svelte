<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        t: Record<string, string>;
        uploadPhase: "uploading" | "processing";
        uploadProgress: number;
        uploadLoaded: number;
        uploadTotal: number;
        fileName: string;
        onCancel: () => void;
    }

    let { t, uploadPhase, uploadProgress, uploadLoaded, uploadTotal, fileName, onCancel }: Props =
        $props();

    const formatBytes = (bytes: number): string => {
        if (!bytes) return "0 MB";
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
</script>

<div class="w-full max-w-md space-y-5 rounded-2xl border border-gray-100 bg-white p-6">
    <div class="flex items-start gap-3.5">
        <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-theme-50 text-theme-600"
        >
            <Icon icon="lucide:cloud-upload" class="size-6 animate-pulse" />
        </div>
        <div class="min-w-0 flex-1">
            <h3 class="text-base font-bold text-gray-900">
                {uploadPhase === "processing"
                    ? t.uploadModalProcessingTitle
                    : t.uploadModalUploadingTitle}
            </h3>
            <p class="mt-0.5 truncate text-xs text-gray-500">{fileName || "video.mp4"}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-gray-600">
                {uploadPhase === "processing" ? t.processingDetailLabel : t.uploadProgressLabel}
            </span>
            <span class="text-base font-bold text-theme-600">{uploadProgress}%</span>
        </div>

        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
                class="h-full rounded-full bg-linear-to-r from-theme-500 to-theme-600 transition-all duration-300 ease-out"
                style={`width: ${uploadProgress}%`}
            ></div>
        </div>

        <div class="flex items-center justify-between text-[11px] text-gray-500">
            {#if uploadPhase === "uploading"}
                <span>{formatBytes(uploadLoaded)} / {formatBytes(uploadTotal)}</span>
                <span class="font-medium text-theme-600">{t.transferringLabel}</span>
            {:else}
                <div class="flex items-center gap-1.5 font-medium text-amber-600">
                    <Icon icon="lucide:loader-circle" class="size-3 animate-spin" />
                    <span>{t.uploadedProcessingLabel}</span>
                </div>
            {/if}
        </div>
    </div>

    <div
        class="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900"
    >
        <p class="text-[11px] font-semibold">⚠️ {t.uploadWarningTitle}</p>
        <p class="mt-0.5 text-[11px] text-amber-800/90">{t.uploadWarningBody}</p>
    </div>

    <div class="flex justify-end pt-1">
        <button
            type="button"
            onclick={onCancel}
            class="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
        >
            {t.cancelUploadButton}
        </button>
    </div>
</div>
