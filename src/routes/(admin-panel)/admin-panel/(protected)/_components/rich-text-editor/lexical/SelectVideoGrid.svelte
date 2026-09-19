<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { VideoItem } from "$lib/types/video";

    interface Props {
        items: VideoItem[];
        selectedId?: string;
        loading: boolean;
        onSelect: (item: VideoItem) => void;
        onConfirm: (item: VideoItem) => void;
        t: Record<string, string>;
    }

    let { items, selectedId, loading, onSelect, onConfirm, t }: Props = $props();
</script>

{#if loading}
    <div class="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
        <Icon icon="lucide:loader-2" class="size-6 animate-spin text-theme-600" />
        <p class="text-xs">{t.loadingVideos || "Memuat video..."}</p>
    </div>
{:else if items.length === 0}
    <div class="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
        <Icon icon="lucide:film" class="size-10 text-gray-300" />
        <p class="text-sm font-medium text-gray-600">{t.noVideosFound}</p>
        <p class="text-xs text-gray-400">{t.noVideosSubtitle}</p>
    </div>
{:else}
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each items as item (item.id)}
            {@const isSelected = selectedId === item.id}
            {@const thumbUrl =
                item.thumbnail.medium || item.thumbnail.small || item.thumbnail.large}
            <div
                role="button"
                tabindex="0"
                onclick={() => onSelect(item)}
                ondblclick={() => onConfirm(item)}
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(item);
                    }
                }}
                class={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition-all ${isSelected ? "border-theme-500 bg-theme-50/40 ring-2 ring-theme-500" : "border-gray-200 bg-white hover:border-gray-300 "}`}
            >
                <div class="relative aspect-video w-full overflow-hidden bg-black">
                    {#if thumbUrl}
                        <img
                            src={thumbUrl}
                            alt={item.title || "Video"}
                            class="h-full w-full object-contain"
                            loading="lazy"
                        />
                    {:else}
                        <div class="flex h-full w-full items-center justify-center text-gray-600">
                            <Icon icon="lucide:film" width={24} height={24} />
                        </div>
                    {/if}
                    {#if isSelected}
                        <div
                            class="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-theme-600 text-white"
                        >
                            <svg class="size-3" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M2.5 6L5 8.5L9.5 3.5"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                    {/if}
                </div>

                <div class="p-2">
                    <p class="line-clamp-1 text-xs font-medium text-gray-800">
                        {item.title || "Untitled Video"}
                    </p>
                    {#if item.category}
                        <p class="mt-0.5 text-[10px] text-gray-500">{item.category}</p>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/if}
