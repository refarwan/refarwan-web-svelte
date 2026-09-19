<script lang="ts">
    import WatchTableHeader from "./WatchTableHeader.svelte";
    import WatchTableItem from "./WatchTableItem.svelte";
    import WatchTableSkeleton from "./WatchTableSkeleton.svelte";

    import type { VideoItem } from "$lib/types/video";

    interface Props {
        t: Record<string, string>;
        items: VideoItem[];
        search: string;
        isLoading?: boolean;
        deletingId?: string | null;
        archivingId?: string | null;
        isEn?: boolean;
        onView: (item: VideoItem) => void;
        onArchive: (item: VideoItem) => void;
        onUnarchive: (item: VideoItem) => void;
        onDelete: (item: VideoItem) => void;
    }

    let {
        t,
        items,
        search,
        isLoading = false,
        deletingId = null,
        archivingId = null,
        isEn = true,
        onView,
        onArchive,
        onUnarchive,
        onDelete
    }: Props = $props();
</script>

<div class="flex flex-col">
    <!-- Header (Desktop) -->
    <WatchTableHeader {isEn} />

    <!-- Content Body -->
    <div class="flex flex-col gap-3 lg:gap-0">
        {#if isLoading}
            <WatchTableSkeleton count={5} />
        {:else if items.length === 0}
            <div
                class="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 lg:rounded-none lg:rounded-b-xl lg:py-12"
            >
                {search ? t.emptySearch : t.empty}
            </div>
        {:else}
            {#each items as item (item.id)}
                <WatchTableItem
                    video={item}
                    {isEn}
                    isDeleting={deletingId === item.id}
                    isArchiving={archivingId === item.id}
                    onViewDetail={onView}
                    {onArchive}
                    {onUnarchive}
                    {onDelete}
                />
            {/each}
        {/if}
    </div>
</div>
