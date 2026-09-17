<script lang="ts">
    interface Props {
        t: Record<string, string>;
        page: number;
        totalPage: number;
        buildHref: (page: number) => string;
    }

    let { t, page, totalPage, buildHref }: Props = $props();

    type PageEntry = number | "...";

    const getPageNumbers = (currentPage: number, totalPages: number): PageEntry[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    const pages = $derived(getPageNumbers(page, totalPage));
</script>

<div class="flex w-full items-center justify-between gap-2 pt-4 select-none">
    {#if page <= 1}
        <span
            aria-disabled="true"
            class="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100/80 px-3 py-2 text-sm font-medium text-gray-400 md:px-4"
        >
            {t.prev}
        </span>
    {:else}
        <a
            href={buildHref(page - 1)}
            class="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-2xs transition-colors hover:bg-gray-50 md:px-4"
        >
            {t.prev}
        </a>
    {/if}

    <div class="flex items-center gap-1 overflow-x-auto py-1 md:gap-1.5">
        {#each pages as entry, index (`${entry}-${index}`)}
            {#if entry === "..."}
                <span class="px-2 py-2 text-sm font-medium text-gray-900 md:px-3">...</span>
            {:else}
                <a
                    href={buildHref(entry)}
                    aria-current={entry === page ? "page" : undefined}
                    class={`flex h-9 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2.5 py-2 text-sm transition-colors md:min-w-9 md:px-3 ${
                        entry === page
                            ? "bg-theme-600 font-semibold text-white shadow-2xs"
                            : "font-medium text-gray-900 hover:bg-gray-100"
                    }`}
                >
                    {entry}
                </a>
            {/if}
        {/each}
    </div>

    {#if page >= totalPage}
        <span
            aria-disabled="true"
            class="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100/80 px-3 py-2 text-sm font-medium text-gray-400 md:px-4"
        >
            {t.next}
        </span>
    {:else}
        <a
            href={buildHref(page + 1)}
            class="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-2xs transition-colors hover:bg-gray-50 md:px-4"
        >
            {t.next}
        </a>
    {/if}
</div>
