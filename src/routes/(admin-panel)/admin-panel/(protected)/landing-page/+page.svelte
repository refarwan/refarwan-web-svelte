<script lang="ts">
    import ComingSoon from "../_components/ComingSoon.svelte";
    import { pageTitleStore } from "../../../stores/page-title.svelte";

    let { data } = $props();

    $effect(() => {
        pageTitleStore.set(data.t.landingPage);
    });
</script>

<ComingSoon title={data.t.landingPage} description={data.t.comingSoon} />
