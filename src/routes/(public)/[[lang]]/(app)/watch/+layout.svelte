<script lang="ts">
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch/index.js";
    import AppHeader from "../_components/AppHeader.svelte";
    import Searchbar from "../_components/Searchbar.svelte";

    let { data, children } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);
    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);
    const resultPath = $derived(`${basePath}/result`);
</script>

<AppHeader
    appName="Watch"
    currentApp="watch"
    {currentLang}
    contentLanguages={data?.contentLanguages ?? []}
/>
<Searchbar
    {basePath}
    {resultPath}
    placeholder={t.searchPlaceholder}
    closeLabel={t.closeSearchAriaLabel}
/>
{@render children()}
