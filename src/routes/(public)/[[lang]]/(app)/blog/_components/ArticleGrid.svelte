<script lang="ts">
    import ArticleCard from "./ArticleCard.svelte";

    import type { PublicArticleItem } from "$lib/types/article";

    interface Props {
        articles: PublicArticleItem[];
        basePath: string;
        lang: string;
        readArticleLabel: string;
        minReadSuffix: string;
        noArticlesLabel: string;
    }

    let { articles, basePath, lang, readArticleLabel, minReadSuffix, noArticlesLabel }: Props =
        $props();
</script>

{#if articles.length === 0}
    <div class="py-16 text-center text-sm text-gray-500">{noArticlesLabel}</div>
{:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each articles as article, index (article.id)}
            <ArticleCard
                {article}
                {basePath}
                {lang}
                {readArticleLabel}
                {minReadSuffix}
                priority={index < 3}
            />
        {/each}
    </div>
{/if}
