<script lang="ts">
    import { Check as CheckIcon, Image as ImageIcon, Loader2 } from "lucide-svelte/icons";

    import type { ImageLibraryItem } from "$lib/types";

    interface Props {
        items: ImageLibraryItem[];
        selectedId: string | null;
        loading: boolean;
        emptyText: string;
        onSelect: (item: ImageLibraryItem) => void;
        onDoubleClick: (item: ImageLibraryItem) => void;
    }

    let { items, selectedId, loading, emptyText, onSelect, onDoubleClick }: Props = $props();
</script>

{#if loading}
    <div class="flex h-64 items-center justify-center">
        <Loader2 class="size-8 animate-spin text-theme-600" />
    </div>
{:else if items.length === 0}
    <div
        class="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center"
    >
        <ImageIcon class="mb-2 size-8 text-gray-400" />
        <p class="text-sm font-medium text-gray-600">{emptyText}</p>
    </div>
{:else}
    <div
        class="grid max-h-75 grid-cols-3 gap-2.5 overflow-y-auto p-1 sm:grid-cols-4 md:grid-cols-5"
    >
        {#each items as item (item.id)}
            {@const isSelected = selectedId === item.id}
            {@const thumbUrl = item.source.small || item.source.medium || item.source.large}
            <button
                type="button"
                onclick={() => onSelect(item)}
                ondblclick={() => onDoubleClick(item)}
                class={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-black transition-all ${
                    isSelected
                        ? "border-theme-600 ring-2 ring-theme-500"
                        : "border-gray-200 hover:border-gray-400"
                }`}
                title={item.id}
            >
                <img
                    src={thumbUrl}
                    alt={item.id}
                    loading="lazy"
                    class="h-full w-full object-contain object-center transition-transform group-hover:scale-105"
                />
                {#if isSelected}
                    <div
                        class="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-theme-600 text-white shadow-sm"
                    >
                        <CheckIcon class="size-3" strokeWidth={3} />
                    </div>
                {/if}
            </button>
        {/each}
    </div>
{/if}
