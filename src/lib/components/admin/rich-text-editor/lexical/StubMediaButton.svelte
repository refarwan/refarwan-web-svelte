<script lang="ts">
    import { popup } from "$lib/stores/popup.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    import type { Snippet } from "svelte";

    interface Props {
        icon: Snippet;
        title: string;
        message: string;
    }

    let { icon, title, message }: Props = $props();
</script>

<ToolbarButton {title} onclick={() => popup.alert({ message })}>
    {@render icon()}
</ToolbarButton>
