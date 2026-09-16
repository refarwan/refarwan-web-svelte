<script lang="ts">
	import FileText from 'lucide-svelte/icons/file-text';
	import FolderGit2 from 'lucide-svelte/icons/folder-git-2';
	import Video from 'lucide-svelte/icons/video';

	import AnalyticsChart from './_components/AnalyticsChart.svelte';
	import PopularListCard from './_components/PopularListCard.svelte';
	import StatCard from './_components/StatCard.svelte';
	import { ANALYTICS_DATA, POPULAR_SECTIONS } from '$lib/data/admin-dashboard';

	let { data } = $props();
	const t = $derived(data.dashboardT);

	const METRICS = $derived([
		{ title: t.statArticles, icon: FileText, value: 1248, trend: 12 },
		{ title: t.statVideos, icon: Video, value: 384, trend: -8.2 },
		{ title: t.statProjects, icon: FolderGit2, value: 47, trend: 8 }
	]);

	const chartText = $derived([
		{ title: t.chartArticleReadsTitle, desc: t.chartArticleReadsDesc },
		{ title: t.chartVideoViewersTitle, desc: t.chartVideoViewersDesc },
		{ title: t.chartProjectViewersTitle, desc: t.chartProjectViewersDesc }
	]);

	const popularText = $derived([
		{ title: t.popularArticlesTitle, button: t.popularArticlesButton },
		{ title: t.popularVideosTitle, button: t.popularVideosButton },
		{ title: t.popularProjectsTitle, button: t.popularProjectsButton }
	]);
</script>

<svelte:head>
	<title>{data.t.dashboard}</title>
</svelte:head>

<div class="flex flex-col gap-4 md:gap-6">
	<section class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
		{#each METRICS as metric, index (index)}
			<StatCard
				title={metric.title}
				icon={metric.icon}
				value={metric.value}
				trend={metric.trend}
				vsLabel={t.vsLastMonth}
			/>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
		{#each ANALYTICS_DATA as chart, index (index)}
			<AnalyticsChart
				title={chartText[index].title}
				desc={chartText[index].desc}
				days={chart.days}
			/>
		{/each}
	</section>

	<section class="flex flex-col gap-4 md:gap-6">
		{#each POPULAR_SECTIONS as section, index (index)}
			<PopularListCard
				title={popularText[index].title}
				buttonLabel={popularText[index].button}
				items={section.items}
				isIndonesian={data.isIndonesian}
			/>
		{/each}
	</section>
</div>
