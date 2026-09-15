<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.landingPage}</title>
</svelte:head>

<ComingSoon title={data.t.landingPage} description={data.t.comingSoon} />
