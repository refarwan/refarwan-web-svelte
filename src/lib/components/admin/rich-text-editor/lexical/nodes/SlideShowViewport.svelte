<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { SlideShowImage } from "./resizable-slideshow-node";

    interface Props {
        items: SlideShowImage[];
        currentIndex: number;
        onPrev: (e?: Event) => void;
        onNext: (e?: Event) => void;
        onSelectIndex: (index: number) => void;
    }

    let { items, currentIndex, onPrev, onNext, onSelectIndex }: Props = $props();

    const currentItem = $derived(items[currentIndex] ?? null);
</script>

{#if currentItem}
    <img
        src={currentItem.src}
        alt={currentItem.altText || "Slide"}
        class="h-full w-full object-contain"
        draggable="false"
    />
{:else}
    <div class="flex h-full w-full items-center justify-center text-gray-500">
        <Icon icon="lucide:images" class="size-10" />
    </div>
{/if}

{#if items.length > 1}
    <button
        type="button"
        onclick={onPrev}
        aria-label="Previous Slide"
        class="absolute top-1/2 left-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/80"
    >
        <Icon icon="lucide:chevron-left" width={16} height={16} />
    </button>
    <button
        type="button"
        onclick={onNext}
        aria-label="Next Slide"
        class="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/80"
    >
        <Icon icon="lucide:chevron-right" width={16} height={16} />
    </button>

    <div
        class="absolute top-2 right-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs"
    >
        {currentIndex + 1} / {items.length}
    </div>

    <div
        class="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-xs"
    >
        {#each items as item, i (item.id || item.src + i)}
            <button
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onclick={(e) => {
                    e.stopPropagation();
                    onSelectIndex(i);
                }}
                class={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-4 bg-theme-500" : "w-1.5 bg-white/60"}`}
            ></button>
        {/each}
    </div>
{/if}
