<script lang="ts">
    import ArticleTableHeader from "./ArticleTableHeader.svelte";
    import ArticleTableItem from "./ArticleTableItem.svelte";
    import ArticleTableSkeleton from "./ArticleTableSkeleton.svelte";

    import type { ArticleItem } from "$lib/types/article";

    interface Props {
        t: Record<string, string>;
        items: ArticleItem[];
        search?: string;
        isLoading?: boolean;
        deletingId?: string | null;
        archivingId?: string | null;
        isEn?: boolean;
        onView: (article: ArticleItem) => void;
        onArchive: (article: ArticleItem) => void;
        onUnarchive: (article: ArticleItem) => void;
        onDelete: (article: ArticleItem) => void;
    }

    let {
        t,
        items,
        search = "",
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

<div class="w-full">
    {#if isLoading}
        <ArticleTableSkeleton rows={5} />
    {:else if items.length === 0}
        <div
            class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center"
        >
            <p class="text-sm font-medium text-gray-500">
                {search ? t.emptySearch : t.empty}
            </p>
        </div>
    {:else}
        <ArticleTableHeader {t} />
        <div class="flex flex-col gap-2 lg:gap-0">
            {#each items as article (article.id)}
                <ArticleTableItem
                    {article}
                    {isEn}
                    isDeleting={deletingId === article.id}
                    isArchiving={archivingId === article.id}
                    onViewDetail={onView}
                    {onArchive}
                    {onUnarchive}
                    {onDelete}
                />
            {/each}
        </div>
    {/if}
</div>
