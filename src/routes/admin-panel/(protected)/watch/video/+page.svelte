<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.watch}</title>
</svelte:head>

<ComingSoon title={data.t.watchVideo} description={data.t.comingSoon} />
