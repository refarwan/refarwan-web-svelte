<script lang="ts">
    let { children } = $props();
</script>

<main
    class="mx-auto mt-6 min-h-screen w-full max-w-7xl flex-1 px-5 pb-7 md:mt-8 md:px-8 md:pb-10 lg:px-10 lg:pb-12"
>
    {@render children()}
</main>
