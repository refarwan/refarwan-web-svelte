<script lang="ts">
    import { page } from "$app/state";

    import Footer from "$lib/components/Footer.svelte";
    import { getFooterTranslation } from "$lib/i18n/footer";
    import { getWatchTranslation } from "$lib/i18n/watch";

    import AppHeader from "./_components/AppHeader.svelte";
    import Searchbar from "./_components/Searchbar.svelte";

    let { data, children } = $props();

    const t = $derived(getWatchTranslation(data.lang));
    const footerT = $derived(getFooterTranslation(data.lang));
    const basePath = $derived(page.params.lang ? `/${page.params.lang}/watch` : "/watch");
</script>

<AppHeader
    language={data.lang}
    locale={data.locale}
    contentLanguages={data.contentLanguages}
    {basePath}
    {t}
/>
<Searchbar {basePath} placeholder={t.searchPlaceholder} closeLabel={t.closeSearchAriaLabel} />
<div class="w-full flex-1">
    {@render children()}
</div>
<Footer t={footerT} />
