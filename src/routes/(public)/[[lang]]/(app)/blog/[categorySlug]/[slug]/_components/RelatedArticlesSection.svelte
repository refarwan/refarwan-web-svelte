<script lang="ts">
    import ArticleCard from "../../../_components/ArticleCard.svelte";

    import type { PublicArticleItem } from "$lib/types/article";

    interface Props {
        heading: string;
        subheading: string;
        articles: PublicArticleItem[];
        basePath: string;
        readArticleLabel: string;
        minReadSuffix: string;
        lang: string;
    }

    let { heading, subheading, articles, basePath, readArticleLabel, minReadSuffix, lang }: Props =
        $props();
</script>

{#if articles.length > 0}
    <section class="mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
        <div class="mb-8">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {heading}
            </h2>
            <p class="mt-1 text-sm text-gray-500 sm:text-base">
                {subheading}
            </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {#each articles as article (article.id)}
                <ArticleCard {article} {basePath} {readArticleLabel} {minReadSuffix} {lang} />
            {/each}
        </div>
    </section>
{/if}
