<script lang="ts">
    import { BLOG_TRANSLATIONS } from "$lib/i18n/blog";
    import AppHeader from "../_components/AppHeader.svelte";
    import Searchbar from "../_components/Searchbar.svelte";

    let { data, children } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(BLOG_TRANSLATIONS[currentLang]);
    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/blog`);
    const resultPath = $derived(`${basePath}/result`);
</script>

<AppHeader
    appName="Blog"
    currentApp="blog"
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
