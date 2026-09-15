<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.watchCategories}</title>
</svelte:head>

<ComingSoon title={data.t.watchCategories} description={data.t.comingSoon} />
