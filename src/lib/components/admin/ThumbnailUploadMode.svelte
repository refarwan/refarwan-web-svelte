<script lang="ts">
    import { ArrowUpIcon, XIcon } from "lucide-svelte/icons";
    interface Props {
        t: Record<string, string>;
        previewUrl: string;
        onFileSelect: (file: File | undefined) => void;
        onClear: () => void;
        name?: string;
    }

    let { t, previewUrl, onFileSelect, onClear, name }: Props = $props();

    let thumbnailInput: HTMLInputElement | undefined = $state();
    let isDragging = $state(false);

    const onInputChange = (event: Event) => {
        onFileSelect((event.target as HTMLInputElement).files?.[0]);
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragging = false;
        onFileSelect(event.dataTransfer?.files?.[0]);
    };
</script>

<div>
    <input
        bind:this={thumbnailInput}
        {name}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onchange={onInputChange}
        class="hidden"
    />

    {#if previewUrl}
        <div
            class="group relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-950"
        >
            <img src={previewUrl} alt="Thumbnail preview" class="h-full w-full object-contain" />
            <div
                class="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
                <button
                    type="button"
                    onclick={() => thumbnailInput?.click()}
                    class="cursor-pointer rounded-lg bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/30"
                >
                    {t.thumbnailChangeLabel}
                </button>
                <button
                    type="button"
                    onclick={onClear}
                    class="cursor-pointer rounded-lg bg-red-600/80 p-1 text-white transition-colors hover:bg-red-600"
                    title={t.removeFile}
                >
                    <XIcon class="h-4 w-4" />
                </button>
            </div>
        </div>
    {:else}
        <div
            onclick={() => thumbnailInput?.click()}
            ondragover={(event) => {
                event.preventDefault();
                isDragging = true;
            }}
            ondragleave={() => (isDragging = false)}
            ondrop={onDrop}
            role="button"
            tabindex="0"
            onkeydown={(event) => event.key === "Enter" && thumbnailInput?.click()}
            class={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-all ${
                isDragging
                    ? "border-theme-500 bg-theme-50/40 ring-2 ring-theme-500/20"
                    : "border-gray-300 bg-gray-50/60 hover:border-theme-400 hover:bg-gray-50"
            }`}
        >
            <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500"
            >
                <ArrowUpIcon class="stroke-2.5 h-4 w-4" />
            </div>
            <div>
                <p class="text-xs font-medium text-gray-700">{t.thumbnailDropzoneHint}</p>
                <p class="mt-0.5 text-[11px] text-gray-400">{t.thumbnailSizeHint}</p>
            </div>
        </div>
    {/if}
</div>
