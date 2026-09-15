<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.project}</title>
</svelte:head>

<ComingSoon title={data.t.project} description={data.t.comingSoon} />
