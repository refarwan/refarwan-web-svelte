<script lang="ts">
    let { children } = $props();
</script>

<main
    class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 p-5 pt-22 md:gap-7 md:p-7 md:pt-27"
>
    {@render children()}
</main>
