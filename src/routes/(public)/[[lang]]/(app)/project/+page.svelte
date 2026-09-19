<script lang="ts">
    import { resolve } from "$app/paths";
    import ComingSoon from "$lib/components/ComingSoon.svelte";
    import { COMING_SOON_TRANSLATIONS } from "$lib/i18n/coming-soon/index.js";
    import AppHeader from "../_components/AppHeader.svelte";

    let { data } = $props();

    const t = $derived(COMING_SOON_TRANSLATIONS[data.currentLang]);
    const localePrefix = $derived(data.currentLang === "en-US" ? "" : `/${data.currentLang}`);
    const homeHref = $derived(resolve(`${localePrefix}/` as `/${string}`));
    const watchHref = $derived(resolve(`${localePrefix}/watch` as `/${string}`));
</script>

<AppHeader
    appName="Project"
    currentApp="project"
    currentLang={data.currentLang}
    contentLanguages={data.contentLanguages}
/>

<svelte:head>
    <title>{data.metadata.title} Project</title>
</svelte:head>

<ComingSoon type="project" {t} {homeHref} {watchHref} />
