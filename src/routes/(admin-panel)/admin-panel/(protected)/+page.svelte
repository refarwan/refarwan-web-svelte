<script lang="ts">
    import { pageTitleStore } from "../../stores/page-title.svelte";
    import AnalyticsChart from "./_components/AnalyticsChart.svelte";
    import PopularListCard from "./_components/PopularListCard.svelte";
    import StatCard from "./_components/StatCard.svelte";
    import { useDashboardSummary } from "./use-dashboard-summary.svelte";

    let { data } = $props();
    const t = $derived(data.dashboardT);

    $effect(() => {
        pageTitleStore.set(data.shellT.dashboard);
    });

    const dashboard = useDashboardSummary();
    const summary = $derived(dashboard.summary);

    const metrics = $derived([
        {
            title: t.statArticles,
            icon: "lucide:file-text",
            value: summary?.articles.total ?? 0,
            trend: summary?.articles.trend ?? 0
        },
        {
            title: t.statVideos,
            icon: "lucide:video",
            value: summary?.videos.total ?? 0,
            trend: summary?.videos.trend ?? 0
        }
    ]);
</script>

<div class="flex flex-col gap-4 md:gap-6">
    {#if dashboard.loading}
        <p class="text-sm text-gray-400">{t.loading}</p>
    {:else}
        <section class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            {#each metrics as metric (metric.title)}
                <StatCard
                    title={metric.title}
                    icon={metric.icon}
                    value={metric.value}
                    trend={metric.trend}
                    vsLabel={t.vsLastMonth}
                />
            {/each}
        </section>

        <section class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            <AnalyticsChart
                title={t.chartArticleReadsTitle}
                desc={t.chartArticleReadsDesc}
                days={summary?.articleReadsChart ?? []}
            />
            <AnalyticsChart
                title={t.chartVideoViewersTitle}
                desc={t.chartVideoViewersDesc}
                days={summary?.videoViewsChart ?? []}
            />
        </section>

        <section class="flex flex-col gap-4 md:gap-6">
            <PopularListCard
                title={t.popularArticlesTitle}
                buttonLabel={t.popularArticlesButton}
                items={summary?.popularArticles ?? []}
                countLabel={t.popularArticlesCountLabel}
                emptyLabel={t.noData}
            />
            <PopularListCard
                title={t.popularVideosTitle}
                buttonLabel={t.popularVideosButton}
                items={summary?.popularVideos ?? []}
                countLabel={t.popularVideosCountLabel}
                emptyLabel={t.noData}
            />
        </section>
    {/if}
</div>
