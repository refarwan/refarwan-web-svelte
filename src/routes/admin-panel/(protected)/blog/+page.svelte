<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.blog}</title>
</svelte:head>

<ComingSoon title={data.t.blogArticles} description={data.t.comingSoon} />
