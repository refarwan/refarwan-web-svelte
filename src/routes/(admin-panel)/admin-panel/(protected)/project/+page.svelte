<script lang="ts">
    import ComingSoon from "../_components/ComingSoon.svelte";
    import { pageTitleStore } from "../../../stores/page-title.svelte";

    let { data } = $props();

    $effect(() => {
        pageTitleStore.set(data.t.project);
    });
</script>

<ComingSoon title={data.t.project} description={data.t.comingSoon} />
