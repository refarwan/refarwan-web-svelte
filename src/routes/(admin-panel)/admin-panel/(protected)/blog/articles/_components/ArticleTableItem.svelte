<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import CategoryBadge from "./CategoryBadge.svelte";
    import StatusBadge from "./StatusBadge.svelte";

    import type { ArticleItem } from "$lib/types/article";

    interface Props {
        article: ArticleItem;
        isEn?: boolean;
        isDeleting?: boolean;
        isArchiving?: boolean;
        onViewDetail: (article: ArticleItem) => void;
        onArchive: (article: ArticleItem) => void;
        onUnarchive: (article: ArticleItem) => void;
        onDelete: (article: ArticleItem) => void;
    }

    let {
        article,
        isEn = true,
        isDeleting = false,
        isArchiving = false,
        onViewDetail,
        onArchive,
        onUnarchive,
        onDelete
    }: Props = $props();

    const title = $derived(article.title || (isEn ? "Untitled" : "Tanpa Judul"));
    const categoryName = $derived(article.category || "-");
    const isArchived = $derived(article.status === "archived");

    const formattedDate = $derived(
        new Date(article.createdAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    );

    const editHref = $derived(
        resolve(`/admin-panel/blog/articles/edit/${article.id}` as `/${string}`)
    );
</script>

<div
    class={`grid grid-cols-[68px_auto] gap-x-3 gap-y-1 rounded-xl border border-gray-200 bg-white px-3 pt-4 pb-3 transition-all duration-300 lg:grid-cols-[68px_1fr_200px_120px_80px_110px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:last:rounded-b-xl ${isDeleting ? "pointer-events-none scale-99 border-red-200 bg-red-50/70 opacity-40" : "hover:bg-gray-50/60"}`}
>
    <!-- Thumbnail -->
    {#if article.thumbnail}
        <button
            type="button"
            onclick={() => onViewDetail(article)}
            class="row-span-4 flex aspect-video w-full cursor-pointer items-center justify-center self-center overflow-hidden rounded-md border border-gray-100 bg-black lg:order-1 lg:row-span-1 lg:self-center"
        >
            <img
                src={article.thumbnail.small}
                alt={`Thumbnail ${title}`}
                class="h-full w-full object-cover object-center"
                loading="eager"
            />
        </button>
    {:else}
        <div
            class="row-span-4 flex aspect-video w-full items-center justify-center self-center rounded-md bg-gray-200 lg:order-1 lg:row-span-1 lg:self-center"
        ></div>
    {/if}

    <!-- Title & Date -->
    <div class="min-w-0 lg:order-2">
        <button
            type="button"
            onclick={() => onViewDetail(article)}
            class="line-clamp-2 cursor-pointer text-left text-sm font-semibold text-gray-900 transition-colors hover:text-theme-600 focus:outline-none"
        >
            {title}
        </button>
        <p class="mt-0.5 text-xs text-gray-400">{formattedDate}</p>
    </div>

    <!-- Category -->
    <div class="col-start-2 lg:order-3 lg:col-start-auto">
        <CategoryBadge category={categoryName} />
    </div>

    <!-- Status -->
    <div class="col-start-2 flex items-center lg:order-4 lg:col-start-auto">
        <StatusBadge status={article.status} lang={isEn ? "en" : "id"} />
    </div>

    <!-- Reads Count -->
    <div class="hidden text-right text-sm font-medium text-gray-600 lg:order-5 lg:block">
        {article.readsCount.toLocaleString()}
    </div>

    <!-- Actions -->
    <div
        class="col-span-2 flex items-center justify-end gap-1 pt-2 lg:order-6 lg:col-span-1 lg:justify-end lg:pt-0"
    >
        <button
            type="button"
            onclick={() => onViewDetail(article)}
            aria-label={isEn ? "View details" : "Lihat detail"}
            class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
        >
            <Icon icon="lucide:eye" class="h-4 w-4" />
        </button>

        <a
            href={editHref}
            aria-label={isEn ? "Edit article" : "Edit artikel"}
            class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
        >
            <Icon icon="lucide:square-pen" class="h-4 w-4" />
        </a>

        {#if isArchived}
            <button
                type="button"
                disabled={isArchiving}
                onclick={() => onUnarchive(article)}
                aria-label={isEn ? "Restore article" : "Pulihkan artikel"}
                class="cursor-pointer rounded-lg p-1.5 text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-700 focus:outline-none disabled:opacity-50"
            >
                {#if isArchiving}
                    <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
                {:else}
                    <Icon icon="lucide:archive-restore" class="h-4 w-4" />
                {/if}
            </button>
        {:else}
            <button
                type="button"
                disabled={isArchiving}
                onclick={() => onArchive(article)}
                aria-label={isEn ? "Archive article" : "Arsipkan artikel"}
                class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            >
                {#if isArchiving}
                    <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
                {:else}
                    <Icon icon="lucide:archive" class="h-4 w-4" />
                {/if}
            </button>
        {/if}

        <button
            type="button"
            disabled={isDeleting}
            onclick={() => onDelete(article)}
            aria-label={isEn ? "Delete article" : "Hapus artikel"}
            class="cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none disabled:opacity-50"
        >
            {#if isDeleting}
                <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
            {:else}
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
            {/if}
        </button>
    </div>
</div>
