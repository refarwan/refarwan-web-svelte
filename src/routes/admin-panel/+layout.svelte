<script lang="ts">
	import PopupContainer from '$lib/components/admin/PopupContainer.svelte';

	let { data, children } = $props();

	const themeStyle = $derived(
		Object.entries(data.themeShades)
			.map(([k, v]) => `--color-theme-${k}: ${v}`)
			.join('; ')
	);
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased" style={themeStyle}>
	{@render children()}
	<PopupContainer />
</div>
