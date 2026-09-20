<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { PROJECT_TRANSLATIONS } from "$lib/i18n/project";
    import AppMainSection from "../_components/AppMainSection.svelte";
    import CategoryFilter from "../_components/CategoryFilter.svelte";
    import LoadMoreButton from "../_components/LoadMoreButton.svelte";
    import ProjectGrid from "./_components/ProjectGrid.svelte";

    import type { ListResponse } from "$lib/types/api-response";
    import type { PublicProjectItem } from "$lib/types/project";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(PROJECT_TRANSLATIONS[currentLang]);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/project`);

    const buildCategoryHref = (slug: string): string => {
        const params = new SvelteURLSearchParams();
        if (slug !== "all") params.set("category", slug);
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    let projects = $derived(data.projects);
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
            const res = await fetch(`${apiUrl}/project/all-summary?${query.toString()}`, {
                headers: { "Accept-Language": currentLang }
            });

            if (res.ok) {
                const json = (await res.json()) as ListResponse<PublicProjectItem[]>;
                projects = [...projects, ...(json.data ?? [])];
                currentPage = json.currentPage ?? nextPage;
                totalPage = json.totalPage ?? totalPage;
            }
        } catch (err) {
            console.error("Failed to load more projects:", err);
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>{`${data.metadata.title} ${t.pageTitle}`}</title>
    <meta name="description" content={t.pageDescription} />
</svelte:head>

<AppMainSection>
    <CategoryFilter
        categories={data.categories}
        activeSlug={data.activeCategory}
        allLabel={t.categoriesAll}
        buildHref={buildCategoryHref}
    />

    <ProjectGrid
        {projects}
        {basePath}
        lang={currentLang}
        viewProjectLabel={t.viewProject}
        noProjectsLabel={t.noProjects}
    />

    <LoadMoreButton
        {hasMore}
        {loading}
        label={t.loadMore}
        loadingLabel={t.loading}
        onloadmore={handleLoadMore}
    />
</AppMainSection>
