<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch/index.js";
    import AppMainSection from "../_components/AppMainSection.svelte";
    import CategoryFilter from "../_components/CategoryFilter.svelte";
    import LoadMoreButton from "../_components/LoadMoreButton.svelte";
    import VideoGrid from "./_components/VideoGrid.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicVideoItem } from "$lib/types/video";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
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
            console.error("Failed to load more videos:", err);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>{`${data.metadata.title} Watch`}</title>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

<AppMainSection>
    <CategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <VideoGrid
        {videos}
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
