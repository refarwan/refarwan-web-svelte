<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { VideoCategoryItem } from "$lib/types/video-category";

    interface Props {
        t: Record<string, string>;
        items: VideoCategoryItem[];
        onEdit: (item: VideoCategoryItem) => void;
        onDelete: (item: VideoCategoryItem) => void;
    }

    let { t, items, onEdit, onDelete }: Props = $props();
</script>

<div class="flex flex-col">
    <div
        class="hidden grid-cols-[1fr_240px_130px_90px] gap-4 overflow-hidden rounded-t-xl border border-gray-200 bg-theme-50 px-4 py-3 text-[13px] font-semibold text-gray-900 md:grid"
    >
        <div>{t.tableName}</div>
        <div>{t.tableSlug}</div>
        <div>{t.tableVideos}</div>
        <div class="text-center">{t.tableAction}</div>
    </div>

    <div class="flex flex-col gap-3 md:gap-0">
        {#if items.length === 0}
            <div
                class="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 md:rounded-none md:rounded-b-xl md:border-x md:border-t-0 md:border-b md:py-12"
            >
                {t.empty}
            </div>
        {:else}
            {#each items as item (item.id)}
                <div
                    class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:bg-gray-50/60 md:grid-cols-[1fr_240px_130px_90px] md:items-center md:gap-4 md:rounded-none md:border-x md:border-t-0 md:border-b md:border-gray-200 md:px-4 md:py-3 md:last:rounded-b-xl"
                >
                    <div class="col-span-1 min-w-0 md:order-1 md:col-auto">
                        <div class="truncate text-[14px] font-medium text-gray-900">
                            {item.name}
                        </div>
                        <div class="mt-0.5 truncate font-mono text-xs text-gray-400 md:hidden">
                            {item.slug}
                        </div>
                    </div>

                    <div
                        class="hidden truncate font-mono text-xs text-gray-500 md:order-2 md:col-auto md:block lg:text-sm"
                    >
                        {item.slug}
                    </div>

                    <div
                        class="col-start-2 row-start-1 flex justify-end md:order-3 md:col-auto md:row-auto md:justify-start"
                    >
                        <span
                            class="inline-flex items-center rounded-full bg-theme-50 px-2.5 py-0.5 text-xs font-medium text-theme-700 md:rounded-none md:bg-transparent md:p-0 md:text-[13px] md:text-gray-600"
                        >
                            {item.videoCount}
                            {t.videosSuffix}
                        </span>
                    </div>

                    <div
                        class="col-span-2 flex items-center justify-end gap-2 pt-2 md:order-4 md:col-auto md:justify-center md:pt-0"
                    >
                        <button
                            type="button"
                            onclick={() => onEdit(item)}
                            class="grid h-7 w-7 cursor-pointer place-content-center rounded-md border border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                            title={t.edit}
                        >
                            <Icon icon="lucide:square-pen" class="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onclick={() => onDelete(item)}
                            class="grid h-7 w-7 cursor-pointer place-content-center rounded-md border border-red-300 bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
                            title={t.delete}
                        >
                            <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
