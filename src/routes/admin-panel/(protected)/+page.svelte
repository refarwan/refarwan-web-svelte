<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.dashboard}</title>
</svelte:head>

<ComingSoon title={data.t.dashboard} description={data.t.comingSoon} />
