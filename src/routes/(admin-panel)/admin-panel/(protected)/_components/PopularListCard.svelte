<script lang="ts">
    import { formatViews } from "$lib/utils/watch-format";

    import type { DashboardPopularItem } from "$lib/types/dashboard";

    interface Props {
        title: string;
        buttonLabel: string;
        items: DashboardPopularItem[];
        countLabel: string;
        emptyLabel: string;
        onAddClick?: () => void;
    }

    let { title, buttonLabel, items, countLabel, emptyLabel, onAddClick }: Props = $props();
</script>

<div class="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 class="text-base font-bold tracking-tight text-gray-900 md:text-lg">{title}</h3>
        <button
            type="button"
            onclick={onAddClick}
            class="inline-flex items-center justify-center rounded-md bg-theme-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-theme-700 md:text-sm"
        >
            {buttonLabel}
        </button>
    </div>

    <div class="mt-2 divide-y divide-gray-100">
        {#each items as item, index (item.id)}
            <div
                class="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors first:pt-2 last:pb-1 hover:bg-gray-50/70 md:gap-4"
            >
                <div
                    class="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100"
                >
                    {#if item.thumbnail}
                        <img
                            src={item.thumbnail.small}
                            alt={item.title ?? ""}
                            width={48}
                            height={48}
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                    {/if}
                </div>

                <span class="w-5 shrink-0 text-center text-sm font-semibold text-gray-400">
                    {index + 1}
                </span>

                <span
                    class="line-clamp-1 flex-1 text-xs font-medium text-gray-800 transition-colors group-hover:text-theme-600 md:text-sm"
                >
                    {item.title}
                </span>

                <span class="shrink-0 text-xs font-normal text-gray-400"
                    >{formatViews(item.count)} {countLabel}</span
                >
            </div>
        {:else}
            <p class="py-6 text-center text-sm text-gray-400">{emptyLabel}</p>
        {/each}
    </div>
</div>
