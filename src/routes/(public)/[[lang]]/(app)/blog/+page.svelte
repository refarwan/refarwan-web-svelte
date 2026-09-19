<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { BLOG_TRANSLATIONS } from "$lib/i18n/blog";
    import AppMainSection from "../_components/AppMainSection.svelte";
    import CategoryFilter from "../_components/CategoryFilter.svelte";
    import LoadMoreButton from "../_components/LoadMoreButton.svelte";
    import ArticleGrid from "./_components/ArticleGrid.svelte";

    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicArticleItem } from "$lib/types/article";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(BLOG_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/blog`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    let articles = $derived(data.articles);
    let currentPage = $derived(data.currentPage);
    let totalPage = $derived(data.totalPage);
    let loading = $state(false);

    const hasMore = $derived(currentPage < totalPage);

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;
        loading = true;
        try {
            const nextPage = currentPage + 1;
            const query = new SvelteURLSearchParams({ page: `${nextPage}` });
            if (data.activeCategory !== "all") query.set("categorySlug", data.activeCategory);

            const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";
            const res = await fetch(`${apiUrl}/article/all-summary?${query.toString()}`, {
                headers: { "Accept-Language": currentLang }
            });

            if (res.ok) {
                const json = (await res.json()) as ListResponse<PublicArticleItem[]>;
                articles = [...articles, ...(json.data ?? [])];
                currentPage = json.currentPage ?? nextPage;
                totalPage = json.totalPage ?? totalPage;
            }
        } catch (err) {
            console.error("Failed to load more articles:", err);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>{`${data.metadata.title} Blog`}</title>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

<AppMainSection>
    <CategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <ArticleGrid
        {articles}
        {basePath}
        lang={currentLang}
        readArticleLabel={t.readArticle}
        minReadSuffix={t.minReadSuffix}
        noArticlesLabel={t.noArticles}
    />

    <LoadMoreButton
        {hasMore}
        {loading}
        label={t.loadMore}
        loadingLabel={t.loading}
        onloadmore={handleLoadMore}
    />
</AppMainSection>
