<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet<[]>;
        title: string;
        isActive?: boolean;
        onclick: () => void;
    }

    let { title, isActive = false, onclick, children }: Props = $props();
</script>

<button
    type="button"
    {title}
    aria-label={title}
    onclick={(event) => {
        event.preventDefault();
        onclick();
    }}
    class={`flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-gray-200 ${isActive ? "bg-theme-100 text-theme-700" : "text-gray-500"}`}
>
    {@render children()}
</button>
