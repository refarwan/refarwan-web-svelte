<script lang="ts">
    import SearchResultRow from "./SearchResultRow.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicArticleItem } from "$lib/types/article";

    interface Props {
        articles: PublicArticleItem[];
        search: string;
        lang: string;
        minReadSuffix: string;
        noArticlesLabel: string;
        buildHref: (article: PublicArticleItem) => ResolvedPathname;
    }

    let { articles, search, lang, minReadSuffix, noArticlesLabel, buildHref }: Props = $props();
</script>

{#if articles.length === 0}
    <div class="py-16 text-center">
        <p class="text-base font-medium text-gray-700">
            {search ? `${noArticlesLabel} ("${search}")` : noArticlesLabel}
        </p>
    </div>
{:else}
    <div class="divide-y divide-gray-200">
        {#each articles as article, idx (article.id)}
            <SearchResultRow
                {article}
                href={buildHref(article)}
                {lang}
                {minReadSuffix}
                priority={idx < 2}
            />
        {/each}
    </div>
{/if}
