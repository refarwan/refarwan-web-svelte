<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { formatArticleDate } from "$lib/utils/format-date";
    import { calculateReadingTime } from "$lib/utils/reading-time";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicArticleItem } from "$lib/types/article";

    interface Props {
        article: PublicArticleItem;
        basePath: string;
        readArticleLabel: string;
        minReadSuffix: string;
        lang: string;
        priority?: boolean;
    }

    let {
        article,
        basePath,
        readArticleLabel,
        minReadSuffix,
        lang,
        priority = false
    }: Props = $props();

    const categorySlug = $derived(article.categorySlug || "general");
    const articleHref: ResolvedPathname = $derived(
        resolve(`${basePath}/${categorySlug}/${article.slug}`)
    );
    const formattedDate = $derived(formatArticleDate(article.createdAt, lang));
    const readingTime = $derived(calculateReadingTime(article.shortDescription));
    const imageUrl = $derived(
        article.thumbnail?.large || article.thumbnail?.medium || article.thumbnail?.small || ""
    );
</script>

<article
    class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300"
>
    <a href={articleHref} class="relative block aspect-video w-full overflow-hidden bg-gray-100">
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
            <div class="absolute top-3 right-3">
                <span
                    class="inline-block rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-theme-700 backdrop-blur-xs"
                >
                    {article.category}
                </span>
            </div>
        {/if}
    </a>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
        <div class="mb-3 flex items-center gap-2 text-xs text-gray-400">
            <div class="flex items-center gap-1.5">
                <Icon icon="lucide:calendar" class="h-3.5 w-3.5 shrink-0" />
                <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div class="flex items-center gap-1.5">
                <Icon icon="lucide:clock" class="h-3.5 w-3.5 shrink-0" />
                <span>{readingTime} {minReadSuffix}</span>
            </div>
        </div>

        <h2
            class="mb-2.5 line-clamp-2 text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-theme-600 sm:text-xl"
        >
            <a href={articleHref} class="hover:underline">
                {article.title ?? "Untitled"}
            </a>
        </h2>

        {#if article.shortDescription}
            <p class="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {article.shortDescription}
            </p>
        {/if}

        <div class="mt-auto pt-2">
            <a
                href={articleHref}
                class="inline-flex items-center gap-1.5 text-sm font-semibold text-theme-600 transition-all hover:gap-2.5 hover:text-theme-700"
            >
                <span>{readArticleLabel}</span>
                <Icon icon="lucide:arrow-right" class="h-4 w-4" />
            </a>
        </div>
    </div>
</article>
