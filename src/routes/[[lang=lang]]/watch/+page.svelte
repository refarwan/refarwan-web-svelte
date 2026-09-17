<script lang="ts">
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { page } from "$app/state";

    import Pagination from "$lib/components/Pagination.svelte";
    import { getWatchTranslation } from "$lib/i18n/watch";

    import AppMainSection from "./_components/AppMainSection.svelte";
    import VideoGrid from "./_components/VideoGrid.svelte";
    import WatchCategoryFilter from "./_components/WatchCategoryFilter.svelte";

    let { data } = $props();

    const t = $derived(getWatchTranslation(data.lang));

    const basePath = $derived(page.params.lang ? `/${page.params.lang}/watch` : "/watch");

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    const buildPageHref = (targetPage: number): string => {
        const params = new SvelteURLSearchParams();
        if (data.activeCategory !== "all") params.set("category", data.activeCategory);
        params.set("page", `${targetPage}`);
        return `${basePath}?${params.toString()}`;
    };

    const buildPlayHref = (id: string): string => `${basePath}/play?v=${id}`;

    const paginationT = $derived({ prev: t.previous, next: t.next });
</script>

<svelte:head>
    <title>{data.appMetadata?.title} Watch</title>
    <meta name="description" content={t.pageDescription} />
</svelte:head>

<AppMainSection>
    <WatchCategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <div class="mt-6 md:mt-7 lg:mt-8">
        <VideoGrid
            videos={data.videos}
            lang={data.lang}
            viewsLabel={t.views}
            noVideosLabel={t.noVideos}
            {buildPlayHref}
        />

        {#if data.totalPage > 1}
            <Pagination
                t={paginationT}
                page={data.currentPage}
                totalPage={data.totalPage}
                buildHref={buildPageHref}
            />
        {/if}
    </div>
</AppMainSection>
