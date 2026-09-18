<script lang="ts">
    import { ImageIcon, Loader2 } from "lucide-svelte/icons";

    import type { ImageLibraryItem } from "$lib/types";
    import type { SlideShowImage } from "./nodes/resizable-slideshow-node";

    interface Props {
        items: ImageLibraryItem[];
        selectedItems: SlideShowImage[];
        loading: boolean;
        onToggle: (item: ImageLibraryItem) => void;
        t: Record<string, string>;
    }

    let { items, selectedItems, loading, onToggle, t }: Props = $props();

    const getSelectedIndex = (id: string) => {
        const idx = selectedItems.findIndex((s) => s.id === id);
        return idx !== -1 ? idx + 1 : null;
    };
</script>

{#if loading}
    <div class="flex h-56 flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 class="size-6 animate-spin text-theme-600" />
        <p class="text-xs">{t.loadingImages}</p>
    </div>
{:else if items.length === 0}
    <div class="flex h-56 flex-col items-center justify-center gap-2 text-gray-400">
        <ImageIcon class="size-10 text-gray-300" strokeWidth={1.5} />
        <p class="text-sm font-medium text-gray-600">{t.noImagesFound}</p>
        <p class="text-xs text-gray-400">{t.noImagesSubtitle}</p>
    </div>
{:else}
    <div class="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
        {#each items as item (item.id)}
            {@const orderNum = getSelectedIndex(item.id)}
            {@const isSelected = orderNum !== null}
            {@const thumbUrl = item.source.small || item.source.medium || item.source.large}
            <button
                type="button"
                onclick={() => onToggle(item)}
                class={`group relative flex aspect-square cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition-all ${
                    isSelected
                        ? "border-theme-500 bg-theme-50/30 ring-2 ring-theme-500"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-xs"
                }`}
            >
                <img
                    src={thumbUrl}
                    alt={item.id}
                    class="h-full w-full object-cover"
                    loading="lazy"
                />

                <div
                    class={`absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full text-[11px] font-bold shadow-xs transition-all ${
                        isSelected
                            ? "scale-100 bg-theme-600 text-white"
                            : "border border-white/80 bg-black/40 text-white opacity-70 group-hover:opacity-100"
                    }`}
                >
                    {#if isSelected}
                        {orderNum}
                    {:else}
                        +
                    {/if}
                </div>
            </button>
        {/each}
    </div>
{/if}
