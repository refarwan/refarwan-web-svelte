<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch";
    import AppMainSection from "../../_components/AppMainSection.svelte";
    import WatchCategoryFilter from "../../_components/CategoryFilter.svelte";
    import LoadMoreButton from "../../_components/LoadMoreButton.svelte";
    import SearchResultList from "./_components/SearchResultList.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicVideoItem } from "$lib/types/video";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);
    const resultPath = $derived(`${basePath}/result`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        if (data.search) params.set("search", data.search);
        const qs = params.toString();
        return qs ? `${resultPath}?${qs}` : resultPath;
    };

    const buildPlayHref = (id: string): ResolvedPathname =>
        `${basePath}/play?v=${id}` as ResolvedPathname;

    let videos = $derived(data.videos);
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
            const res = await fetch(`${apiUrl}/video/all-summary?${query.toString()}`, {
                headers: { "Accept-Language": currentLang }
            });

            if (res.ok) {
                const json = (await res.json()) as ListResponse<PublicVideoItem[]>;
                videos = [...videos, ...(json.data ?? [])];
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
    <title>{data.search} | {data.metadata.title} Watch</title>
</svelte:head>

<AppMainSection>
    <WatchCategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <SearchResultList
        {videos}
        search={data.search}
        lang={currentLang}
        viewsLabel={t.views}
        noVideosLabel={t.noVideos}
        {buildPlayHref}
    />

    <LoadMoreButton
        {hasMore}
        {loading}
        label={t.loadMore}
        loadingLabel={t.loading}
        onloadmore={handleLoadMore}
    />
</AppMainSection>
