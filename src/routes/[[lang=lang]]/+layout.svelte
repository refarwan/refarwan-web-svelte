<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';

	import Footer from '$lib/components/Footer.svelte';
	import HomeHeader from '$lib/components/HomeHeader.svelte';
	import HomeNavigation from '$lib/components/HomeNavigation.svelte';
	import { getFooterTranslation } from '$lib/i18n/footer';
	import { getNavTranslation } from '$lib/i18n/nav';

	let { data, children } = $props();

	const navT = $derived(getNavTranslation(data.lang));
	const footerT = $derived(getFooterTranslation(data.lang));
	const themeStyle = $derived(
		Object.entries(data.themeShades)
			.map(([k, v]) => `--color-theme-${k}: ${v}`)
			.join('; ')
	);

	// The [[lang]] segment is optional, so a language switch can navigate between
	// two URLs that share the same route id (only the param differs). Force every
	// load function to rerun so the page content always matches the new locale.
	afterNavigate(({ from, to }) => {
		if (from?.params?.lang !== to?.params?.lang) {
			void invalidateAll();
		}
	});
</script>

<svelte:head>
	{#if data.favicon}
		<link rel="icon" href={data.favicon} />
	{/if}
</svelte:head>

<div
	class="flex min-h-full flex-col bg-white font-sans text-gray-900 antialiased"
	style={themeStyle}
>
	<HomeHeader language={data.lang} locale={data.locale} contentLanguages={data.contentLanguages} />
	<HomeNavigation t={navT} lang={data.lang} locale={data.locale} />
	<main class="mx-auto max-w-7xl flex-1">
		{@render children()}
	</main>
	<Footer t={footerT} />
</div>
