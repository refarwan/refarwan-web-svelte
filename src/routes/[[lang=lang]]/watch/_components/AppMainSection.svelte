<script lang="ts">
    let { children } = $props();
</script>

<main class="mx-auto w-full max-w-7xl flex-1 px-5 pb-7 md:px-8 md:pb-10 lg:px-10 lg:pb-12">
    {@render children()}
</main>
