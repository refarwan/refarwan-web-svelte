<script lang="ts">
    import Icon from "@iconify/svelte";
    import { formatArticleDate } from "$lib/utils/format-date";
    import { calculateReadingTime } from "$lib/utils/reading-time";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicArticleItem } from "$lib/types/article";

    interface Props {
        article: PublicArticleItem;
        href: ResolvedPathname;
        lang: string;
        minReadSuffix: string;
        priority?: boolean;
    }

    let { article, href, lang, minReadSuffix, priority = false }: Props = $props();

    const formattedDate = $derived(formatArticleDate(article.createdAt, lang));
    const readingTime = $derived(calculateReadingTime(article.shortDescription));
    const imageUrl = $derived(
        article.thumbnail?.medium || article.thumbnail?.small || article.thumbnail?.large || ""
    );
</script>

<a
    {href}
    class="group flex flex-row items-start gap-3 py-4 transition-colors first:pt-0 sm:gap-4 sm:py-5 lg:gap-5 lg:py-6"
>
    <div
        class="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-52 md:w-60 lg:w-72"
    >
        {#if imageUrl}
            <img
                src={imageUrl}
                alt={article.title ?? ""}
                loading={priority ? "eager" : "lazy"}
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        {:else}
            <div
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-xs font-medium text-gray-400"
            >
                No Image
            </div>
        {/if}

        {#if article.category}
            <div class="absolute top-2 right-2">
                <span
                    class="inline-block rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-theme-700 backdrop-blur-xs sm:text-xs"
                >
                    {article.category}
                </span>
            </div>
        {/if}
    </div>

    <div class="flex min-w-0 flex-1 flex-col pt-0.5 sm:pt-1">
        <div class="mb-1.5 flex items-center gap-2 text-xs text-gray-400 sm:mb-2">
            <div class="flex items-center gap-1">
                <Icon icon="lucide:calendar" class="h-3 w-3 shrink-0" />
                <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div class="flex items-center gap-1">
                <Icon icon="lucide:clock" class="h-3 w-3 shrink-0" />
                <span>{readingTime} {minReadSuffix}</span>
            </div>
        </div>

        <h2
            class="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 transition-colors group-hover:text-theme-600 sm:text-base lg:text-lg"
        >
            {article.title ?? "—"}
        </h2>

        {#if article.shortDescription}
            <p class="mt-1 line-clamp-2 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                {article.shortDescription}
            </p>
        {/if}
    </div>
</a>
