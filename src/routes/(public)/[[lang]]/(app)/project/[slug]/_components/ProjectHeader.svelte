<script lang="ts">
    import Icon from "@iconify/svelte";
    import { formatArticleDate } from "$lib/utils/format-date";
    import OperationalStatusBadge from "../../_components/OperationalStatusBadge.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { OperationalStatus } from "$lib/types/project";

    interface Props {
        title: string;
        createdAt: string;
        category?: string | null;
        categoryHref?: ResolvedPathname;
        operationalStatus?: OperationalStatus | string;
        lang: string;
    }

    let { title, createdAt, category, categoryHref, operationalStatus, lang }: Props = $props();

    const formattedDate = $derived(formatArticleDate(createdAt, lang));
</script>

<header class="w-full">
    <div class="mb-3 flex flex-wrap items-center gap-2">
        {#if category && categoryHref}
            <a
                href={categoryHref}
                class="inline-block rounded-full bg-theme-50 px-3.5 py-1.5 text-xs font-medium text-theme-700 transition-colors hover:bg-theme-100 sm:text-sm"
            >
                {category}
            </a>
        {/if}
        {#if operationalStatus}
            <OperationalStatusBadge status={operationalStatus} {lang} />
        {/if}
    </div>

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
    </div>
</header>
