<script lang="ts">
    import { resolve } from "$app/paths";
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { BLOG_TRANSLATIONS } from "$lib/i18n/blog";
    import AppMainSection from "../../_components/AppMainSection.svelte";
    import CategoryFilter from "../../_components/CategoryFilter.svelte";
    import LoadMoreButton from "../../_components/LoadMoreButton.svelte";
    import SearchResultList from "./_components/SearchResultList.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicArticleItem } from "$lib/types/article";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(BLOG_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/blog`);
    const resultPath = $derived(`${basePath}/result`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        if (data.search) params.set("search", data.search);
        const qs = params.toString();
        return qs ? `${resultPath}?${qs}` : resultPath;
    };

    const buildArticleHref = (article: PublicArticleItem): ResolvedPathname => {
        const categorySlug = article.categorySlug || "general";
        return resolve(`${basePath}/${categorySlug}/${article.slug}`);
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
            if (data.search) query.set("search", data.search);

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
            console.error("Failed to load more search results:", err);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>{data.search} | {data.metadata.title} Blog</title>
</svelte:head>

<AppMainSection>
    <CategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <SearchResultList
        {articles}
        search={data.search}
        lang={currentLang}
        minReadSuffix={t.minReadSuffix}
        noArticlesLabel={t.noArticles}
        buildHref={buildArticleHref}
    />

    <LoadMoreButton
        {hasMore}
        {loading}
        label={t.loadMore}
        loadingLabel={t.loading}
        onloadmore={handleLoadMore}
    />
</AppMainSection>
