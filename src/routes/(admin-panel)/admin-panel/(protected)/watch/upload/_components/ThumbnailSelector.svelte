<script lang="ts">
    import ThumbnailUploadMode from "$lib/components/admin/ThumbnailUploadMode.svelte";
    import ThumbnailVideoMode from "./ThumbnailVideoMode.svelte";

    interface Props {
        t: Record<string, string>;
        mode: "upload" | "video";
        onModeChange: (mode: "upload" | "video") => void;
        thumbnailPreviewUrl: string;
        onThumbnailSelect: (file: File | undefined) => void;
        onThumbnailClear: () => void;
        videoPreviewUrl: string;
        videoDuration: number;
        videoCurrentTime: number;
        onVideoTimeChange: (time: number) => void;
        onVideoLoadedMetadata: (duration: number) => void;
    }

    let {
        t,
        mode,
        onModeChange,
        thumbnailPreviewUrl,
        onThumbnailSelect,
        onThumbnailClear,
        videoPreviewUrl,
        videoDuration,
        videoCurrentTime,
        onVideoTimeChange,
        onVideoLoadedMetadata
    }: Props = $props();
</script>

<div class="space-y-2">
    <span class="block text-sm font-medium text-gray-900">{t.thumbnailLabel}</span>

    <div class="flex items-center rounded-md bg-gray-200 p-0.5">
        <button
            type="button"
            onclick={() => onModeChange("upload")}
            class={`flex-1 cursor-pointer rounded-[5px] px-3 py-1.5 text-center text-xs font-medium transition-all ${mode === "upload" ? "bg-white text-gray-900 " : "text-gray-500 hover:text-gray-900"}`}
        >
            {t.thumbnailModeUpload}
        </button>
        <button
            type="button"
            onclick={() => onModeChange("video")}
            class={`flex-1 cursor-pointer rounded-[5px] px-3 py-1.5 text-center text-xs font-medium transition-all ${mode === "video" ? "bg-white text-gray-900 " : "text-gray-500 hover:text-gray-900"}`}
        >
            {t.thumbnailModeVideo}
        </button>
    </div>

    {#if mode === "upload"}
        <ThumbnailUploadMode
            {t}
            previewUrl={thumbnailPreviewUrl}
            onFileSelect={onThumbnailSelect}
            onClear={onThumbnailClear}
        />
    {:else}
        <ThumbnailVideoMode
            {t}
            {videoPreviewUrl}
            {videoDuration}
            {videoCurrentTime}
            {onVideoTimeChange}
            onLoadedMetadata={onVideoLoadedMetadata}
        />
    {/if}
</div>
