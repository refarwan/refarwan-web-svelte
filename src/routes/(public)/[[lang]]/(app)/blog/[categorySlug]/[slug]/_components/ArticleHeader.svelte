<script lang="ts">
    import Icon from "@iconify/svelte";
    import { formatArticleDate } from "$lib/utils/format-date";

    interface Props {
        title: string;
        createdAt: string;
        readingTime: number;
        minReadSuffix: string;
        readsCount?: number;
        readsLabel: string;
        lang: string;
    }

    let {
        title,
        createdAt,
        readingTime,
        minReadSuffix,
        readsCount = 0,
        readsLabel,
        lang
    }: Props = $props();

    const formattedDate = $derived(formatArticleDate(createdAt, lang));
</script>

<header class="w-full">
    <h1
        class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-tight"
    >
        {title}
    </h1>

    <div class="my-4 border-b border-gray-200 sm:my-5"></div>

    <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 sm:text-sm">
        <div class="flex items-center gap-1.5">
            <Icon icon="lucide:calendar" class="h-4 w-4 text-gray-400" />
            <span>{formattedDate}</span>
        </div>
        <span class="text-gray-300">•</span>
        <div class="flex items-center gap-1.5">
            <Icon icon="lucide:clock" class="h-4 w-4 text-gray-400" />
            <span>{readingTime} {minReadSuffix}</span>
        </div>
        {#if readsCount > 0}
            <span class="text-gray-300">•</span>
            <div class="flex items-center gap-1.5">
                <Icon icon="lucide:eye" class="h-4 w-4 text-gray-400" />
                <span>{readsCount} {readsLabel}</span>
            </div>
        {/if}
    </div>
</header>
