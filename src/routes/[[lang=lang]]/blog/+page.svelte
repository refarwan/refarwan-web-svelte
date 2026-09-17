<script lang="ts">
    import { resolve } from "$app/paths";

    import ComingSoon from "$lib/components/ComingSoon.svelte";
    import { getComingSoonTranslation } from "$lib/i18n/coming-soon";

    let { data } = $props();

    const t = $derived(getComingSoonTranslation(data.lang, "blog"));
    const langParam = $derived(data.lang === "en" ? undefined : data.locale);
    const homeHref = $derived(resolve("/[[lang=lang]]", { lang: langParam }));
    const watchHref = $derived(resolve("/[[lang=lang]]/watch", { lang: langParam }));
</script>

<svelte:head>
    <title>{data.title} Blog</title>
    <meta name="description" content={t.title} />
</svelte:head>

<ComingSoon type="blog" {t} {homeHref} {watchHref} />
