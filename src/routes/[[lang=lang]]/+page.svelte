<script lang="ts">
	import About from './_components/About.svelte';
	import Cta from './_components/Cta.svelte';
	import Hero from './_components/Hero.svelte';
	import Projects from './_components/Projects.svelte';
	import Skills from './_components/Skills.svelte';
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
