<script lang="ts">
    import "@fontsource/poppins/100.css";
    import "@fontsource/poppins/200.css";
    import "@fontsource/poppins/300.css";
    import "@fontsource/poppins/400.css";
    import "@fontsource/poppins/500.css";
    import "@fontsource/poppins/600.css";
    import "@fontsource/poppins/700.css";
    import "@fontsource/poppins/800.css";
    import "@fontsource/poppins/900.css";
    import "./layout.css";

    let { children, data } = $props();
</script>

<svelte:head>
    {#if data?.favicon}
        <link rel="icon" href={data.favicon} />
    {/if}
    {#if data?.themeCss}
        <link rel="stylesheet" href={`data:text/css,${encodeURIComponent(data.themeCss)}`} />
    {/if}
</svelte:head>

{@render children()}
