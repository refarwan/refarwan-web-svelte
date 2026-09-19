<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { ImageLibrary } from "../../../../../i18n/image-library/types";
    import type { ImageLibraryItem } from "../../../../../types/image-library";

    interface Props {
        item: ImageLibraryItem;
        onView: (item: ImageLibraryItem) => void;
        onDelete: (item: ImageLibraryItem) => void;
        t: ImageLibrary;
    }

    let { item, onView, onDelete, t }: Props = $props();

    const imageUrl = $derived(item.source.medium || item.source.large || item.source.small);
</script>

<div
    class="group relative aspect-16/10 w-full overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100 transition-all duration-200 hover:border-gray-300 sm:aspect-video"
>
    {#if imageUrl}
        <img
            src={imageUrl}
            alt="Library item"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
    {:else}
        <div class="flex h-full w-full items-center justify-center text-xs text-gray-400">
            {t.empty}
        </div>
    {/if}

    <div class="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 sm:gap-2">
        <button
            type="button"
            onclick={() => onView(item)}
            title={t.view}
            aria-label={t.view}
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white/95 text-gray-700 backdrop-blur-xs transition-colors hover:bg-white hover:text-theme-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-500"
        >
            <Icon icon="lucide:eye" class="h-4 w-4" />
        </button>
        <button
            type="button"
            onclick={() => onDelete(item)}
            title={t.delete}
            aria-label={t.delete}
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-white/95 text-red-500 backdrop-blur-xs transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
            <Icon icon="lucide:trash-2" class="h-4 w-4" />
        </button>
    </div>
</div>
