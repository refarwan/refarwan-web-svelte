<script lang="ts">
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { page } from "$app/state";

    import Pagination from "$lib/components/Pagination.svelte";
    import { getWatchTranslation } from "$lib/i18n/watch";

    import AppMainSection from "../_components/AppMainSection.svelte";
    import WatchCategoryFilter from "../_components/WatchCategoryFilter.svelte";
    import SearchResultList from "./_components/SearchResultList.svelte";

    let { data } = $props();

    const t = $derived(getWatchTranslation(data.lang));

    const basePath = $derived(page.params.lang ? `/${page.params.lang}/watch` : "/watch");
    const resultPath = $derived(`${basePath}/result`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        if (data.search) params.set("search", data.search);
        const qs = params.toString();
        return qs ? `${resultPath}?${qs}` : resultPath;
    };

    const buildPageHref = (targetPage: number): string => {
        const params = new SvelteURLSearchParams();
        if (data.activeCategory !== "all") params.set("category", data.activeCategory);
        if (data.search) params.set("search", data.search);
        params.set("page", `${targetPage}`);
        return `${resultPath}?${params.toString()}`;
    };

    const buildPlayHref = (id: string): string => `${basePath}/play?v=${id}`;

    const paginationT = $derived({ prev: t.previous, next: t.next });
</script>

<svelte:head>
    <title>{data.search || t.pageTitle} | {data.metadata?.title} Watch</title>
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
        <SearchResultList
            videos={data.videos}
            search={data.search}
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
