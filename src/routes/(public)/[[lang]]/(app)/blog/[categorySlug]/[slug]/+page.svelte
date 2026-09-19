<script lang="ts">
    import { resolve } from "$app/paths";
    import { env } from "$env/dynamic/public";
    import { BLOG_TRANSLATIONS } from "$lib/i18n/blog";
    import { calculateReadingTime } from "$lib/utils/reading-time";
    import AppMainSection from "../../../_components/AppMainSection.svelte";
    import ArticleBody from "./_components/ArticleBody.svelte";
    import ArticleBreadcrumbs from "./_components/ArticleBreadcrumbs.svelte";
    import ArticleHeader from "./_components/ArticleHeader.svelte";
    import ArticleHeroCover from "./_components/ArticleHeroCover.svelte";
    import ArticleTags from "./_components/ArticleTags.svelte";
    import RelatedArticlesSection from "./_components/RelatedArticlesSection.svelte";

    import type { ResolvedPathname } from "$app/types";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(BLOG_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/blog`);
    const homeHref: ResolvedPathname = $derived(resolve(basePath as `/${string}`));

    const categoryHref: ResolvedPathname = $derived(
        resolve(
            (data.article.categorySlug
                ? `${basePath}?category=${data.article.categorySlug}`
                : basePath) as `/${string}`
        )
    );

    const readingTime = $derived(calculateReadingTime(data.article.contentHTML));

    $effect(() => {
        if (data.article?.id) {
            const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";
            void fetch(`${apiUrl}/article/${data.article.id}/read`, {
                method: "POST"
            }).catch(() => {});
        }
    });
</script>

<svelte:head>
    <title>{`${data.article.title ?? "Untitled"} | ${data.metadata.title} Blog`}</title>
    <meta
        name="description"
        content={data.article.shortDescription || data.article.title || t.pageDescription}
    />
    <meta
        property="og:title"
        content={`${data.article.title ?? "Untitled"} | ${data.metadata.title} Blog`}
    />
    <meta
        property="og:description"
        content={data.article.shortDescription || data.article.title || t.pageDescription}
    />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={data.article.createdAt} />
    {#if data.article.thumbnail?.large || data.article.thumbnail?.medium}
        <meta
            property="og:image"
            content={data.article.thumbnail.large || data.article.thumbnail.medium}
        />
    {/if}
</svelte:head>

<AppMainSection>
    <ArticleBreadcrumbs
        {homeHref}
        homeLabel={t.homeBreadcrumb}
        {categoryHref}
        categoryName={data.article.category ?? "Blog"}
        articleTitle={data.article.title ?? ""}
    />

    <ArticleHeader
        title={data.article.title ?? "Untitled"}
        createdAt={data.article.createdAt}
        {readingTime}
        minReadSuffix={t.minReadSuffix}
        readsCount={data.article.readsCount}
        readsLabel={t.reads}
        lang={currentLang}
    />

    <ArticleHeroCover thumbnail={data.article.thumbnail} title={data.article.title ?? ""} />

    <ArticleBody contentHTML={data.article.contentHTML} />

    <ArticleTags
        categoryName={data.article.category}
        categorySlug={data.article.categorySlug}
        {basePath}
    />

    <RelatedArticlesSection
        heading={t.relatedArticlesHeading}
        subheading={t.relatedArticlesSubheading}
        articles={data.relatedArticles}
        {basePath}
        readArticleLabel={t.readArticle}
        minReadSuffix={t.minReadSuffix}
        lang={currentLang}
    />
</AppMainSection>
