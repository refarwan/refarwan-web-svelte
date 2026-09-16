<script lang="ts">
    import PopupContainer from "./_components/PopupContainer.svelte";

    let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
    {@render children()}
    <PopupContainer />
</div>
