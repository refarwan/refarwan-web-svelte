<script lang="ts">
    let { children, data } = $props();
</script>

<svelte:head>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

{@render children()}
