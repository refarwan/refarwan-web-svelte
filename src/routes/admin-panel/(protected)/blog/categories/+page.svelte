<script lang="ts">
	import ComingSoon from '$lib/components/admin/ComingSoon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.t.blogCategories}</title>
</svelte:head>

<ComingSoon title={data.t.blogCategories} description={data.t.comingSoon} />
