<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        t: Record<string, string>;
        videoFile: File | null;
        onFileSelect: (file: File | undefined) => void;
        onClear: () => void;
    }

    let { t, videoFile, onFileSelect, onClear }: Props = $props();

    let videoInput: HTMLInputElement | undefined = $state();
    let isDragging = $state(false);

    const onInputChange = (event: Event) => {
        onFileSelect((event.target as HTMLInputElement).files?.[0]);
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragging = false;
        onFileSelect(event.dataTransfer?.files?.[0]);
    };

    export const resetInput = (): void => {
        if (videoInput) videoInput.value = "";
    };
</script>

<div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-900" for="video-file-input"
        >{t.videoDropzoneLabel}</label
    >
    <input
        id="video-file-input"
        bind:this={videoInput}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onchange={onInputChange}
        class="hidden"
    />

    {#if videoFile}
        <div
            class="flex items-center justify-between gap-3 rounded-lg border border-theme-200 bg-theme-50/60 p-3.5 sm:p-4"
        >
            <div class="flex min-w-0 flex-1 items-center gap-3">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-theme-600 text-white"
                >
                    <Icon icon="lucide:film" class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="line-clamp-2 text-sm font-medium break-all text-gray-900">
                        {videoFile.name}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                </div>
            </div>
            <button
                type="button"
                onclick={onClear}
                class="shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/80 hover:text-red-600"
                title={t.removeFile}
            >
                <Icon icon="lucide:x" class="h-4 w-4" />
            </button>
        </div>
    {:else}
        <div
            onclick={() => videoInput?.click()}
            ondragover={(event) => {
                event.preventDefault();
                isDragging = true;
            }}
            ondragleave={() => (isDragging = false)}
            ondrop={onDrop}
            role="button"
            tabindex="0"
            onkeydown={(event) => event.key === "Enter" && videoInput?.click()}
            class={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center transition-all ${isDragging ? "border-theme-500 bg-theme-50/40 ring-2 ring-theme-500/20" : "border-gray-300 bg-gray-50/60 hover:border-theme-400 hover:bg-gray-50"}`}
        >
            <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600"
            >
                <Icon icon="lucide:arrow-up" class="stroke-2.5 h-4.5 w-4.5" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-900">{t.videoDropzoneHint}</p>
                <p class="mt-0.5 text-xs text-gray-500">MP4, WebM, MOV (maks. 1GB)</p>
            </div>
        </div>
    {/if}
</div>
