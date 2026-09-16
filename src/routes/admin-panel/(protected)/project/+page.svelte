<script lang="ts">
    import ComingSoon from "$lib/components/admin/ComingSoon.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";

    let { data } = $props();

    $effect(() => {
        pageTitleStore.set(data.t.project);
    });
</script>

<ComingSoon title={data.t.project} description={data.t.comingSoon} />
