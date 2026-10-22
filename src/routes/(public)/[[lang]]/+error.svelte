<script lang="ts">
    import { page } from "$app/state";
    import { CONTENT_LANGUAGES } from "$lib/i18n/content-language";
    import { ERROR_TRANSLATIONS } from "$lib/i18n/error";
    import { NOT_FOUND_TRANSLATIONS } from "$lib/i18n/not-found";
    import ErrorContent from "../../_components/ErrorContent.svelte";
    import NotFoundContent from "../../_components/NotFoundContent.svelte";

    const langCode = $derived(
        CONTENT_LANGUAGES.find((item) => item.locale === page.params.lang)?.locale ?? "en-US"
    );
    const notFoundT = $derived(NOT_FOUND_TRANSLATIONS[langCode]);
    const errorT = $derived(ERROR_TRANSLATIONS[langCode]);
    const homeHref = $derived(
        `/${(page.params.lang !== "en-US" && CONTENT_LANGUAGES.find((l) => l.locale === page.params.lang)?.locale) || ""}`
    );
    const contactHref = $derived(`${homeHref}#contact`);
</script>

{#if page.status === 404}
    <NotFoundContent t={notFoundT} {homeHref} {contactHref} />
{:else}
    <ErrorContent
        status={page.status}
        message={page.error?.message}
        t={errorT}
        {homeHref}
        {contactHref}
    />
{/if}
