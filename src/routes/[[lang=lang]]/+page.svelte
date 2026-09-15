<script lang="ts">
	import About from '$lib/components/home/About.svelte';
	import Cta from '$lib/components/home/Cta.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import Projects from '$lib/components/home/Projects.svelte';
	import Skills from '$lib/components/home/Skills.svelte';
	import { getHomeTranslation } from '$lib/i18n/home';

	let { data } = $props();

	const t = $derived(getHomeTranslation(data.lang));
</script>

<svelte:head>
	<title>
		{t.metaTitle ?? 'Aan Refarwan | Fullstack TypeScript Developer & Software Engineer'}
	</title>
	<meta name="description" content={t.metaDescription ?? t.hero.description} />
</svelte:head>

<Hero t={t.hero} />
<About t={t.about} />
<Skills t={t.skills} />
<Projects t={t.projects} />
<Cta t={t.cta} />
