<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import HomeHeader from "./_components/HomeHeader.svelte";
    import HomeNavigation from "./_components/HomeNavigation.svelte";
    import { getFooterTranslation } from "$lib/i18n/footer";
    import { getNavTranslation } from "$lib/i18n/nav";

    let { data, children } = $props();

    const navT = $derived(getNavTranslation(data.lang));
    const footerT = $derived(getFooterTranslation(data.lang));
</script>

<HomeHeader language={data.lang} locale={data.locale} contentLanguages={data.contentLanguages} />
<HomeNavigation t={navT} lang={data.lang} locale={data.locale} />
<main class="mx-auto max-w-7xl flex-1">
    {@render children()}
</main>
<Footer t={footerT} />
