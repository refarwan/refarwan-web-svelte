<script lang="ts">
    import { afterNavigate, invalidateAll } from "$app/navigation";

    let { children } = $props();

    // The [[lang]] segment is optional, so a language switch can navigate between
    // two URLs that share the same route id (only the param differs). Force every
    // load function to rerun so the page content always matches the new locale.
    afterNavigate(({ from, to }) => {
        if (from?.params?.lang !== to?.params?.lang) {
            void invalidateAll();
        }
    });
</script>

<div class="flex min-h-full flex-col bg-white font-sans text-gray-900 antialiased">
    {@render children()}
</div>
