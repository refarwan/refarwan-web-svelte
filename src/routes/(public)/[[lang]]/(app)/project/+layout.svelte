<script lang="ts">
    import AppHeader from "../_components/AppHeader.svelte";

    let { data, children } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
</script>

<AppHeader
    appName="Project"
    currentApp="project"
    {currentLang}
    contentLanguages={data?.contentLanguages ?? []}
/>
{@render children()}
