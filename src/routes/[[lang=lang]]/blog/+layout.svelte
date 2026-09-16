<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import { getFooterTranslation } from "$lib/i18n/footer";
    import { getWatchTranslation } from "$lib/i18n/watch";

    import AppHeader from "../_components/AppHeader.svelte";

    let { data, children } = $props();

    const t = $derived(getWatchTranslation(data.lang));
    const footerT = $derived(getFooterTranslation(data.lang));
</script>

<AppHeader
    appName="Blog"
    currentApp="blog"
    language={data.lang}
    locale={data.locale}
    contentLanguages={data.contentLanguages}
    {t}
/>
{@render children()}
<Footer t={footerT} />
