<script lang="ts">
    import { ChevronLeft, ChevronRight, X as XIcon } from "lucide-svelte/icons";

    import type { SlideShowImage } from "./nodes/resizable-slideshow-node";

    interface Props {
        selectedItems: SlideShowImage[];
        onRemove: (index: number) => void;
        onMove: (fromIndex: number, toIndex: number) => void;
        t: Record<string, string>;
    }

    let { selectedItems, onRemove, onMove, t }: Props = $props();
</script>

<div class="border-t border-gray-200 bg-gray-50/70 p-3">
    <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-700">
            {t.selectedSlidesCount} ({selectedItems.length})
        </span>
        <span class="text-[11px] text-gray-500"> Urutan slide dari kiri ke kanan </span>
    </div>

    {#if selectedItems.length === 0}
        <div
            class="flex h-16 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400"
        >
            {t.noSlidesSelected}
        </div>
    {:else}
        <div class="flex gap-2 overflow-x-auto pb-1">
            {#each selectedItems as item, idx (item.id || item.src + idx)}
                <div
                    class="group relative flex size-18 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xs"
                >
                    <img
                        src={item.src}
                        alt={item.altText || `Slide ${idx + 1}`}
                        class="h-full w-full object-cover"
                    />

                    <!-- Order badge -->
                    <div
                        class="absolute top-1 left-1 flex size-4.5 items-center justify-center rounded-full bg-black/70 text-[10px] font-bold text-white"
                    >
                        {idx + 1}
                    </div>

                    <!-- Remove button -->
                    <button
                        type="button"
                        onclick={() => onRemove(idx)}
                        aria-label="Remove slide"
                        class="absolute top-1 right-1 flex size-4.5 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white opacity-90 transition hover:scale-110 hover:opacity-100"
                    >
                        <XIcon size={10} />
                    </button>

                    <!-- Reorder buttons overlay -->
                    <div
                        class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <button
                            type="button"
                            disabled={idx === 0}
                            onclick={() => onMove(idx, idx - 1)}
                            class="cursor-pointer text-white hover:text-theme-300 disabled:opacity-30"
                        >
                            <ChevronLeft size={12} />
                        </button>
                        <button
                            type="button"
                            disabled={idx === selectedItems.length - 1}
                            onclick={() => onMove(idx, idx + 1)}
                            class="cursor-pointer text-white hover:text-theme-300 disabled:opacity-30"
                        >
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
