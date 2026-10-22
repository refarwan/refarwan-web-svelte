<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        class?: string;
        children?: Snippet;
    }

    let { type = "button", disabled = false, class: className = "", children }: Props = $props();
</script>

<button
    {type}
    {disabled}
    class={[
        "flex h-12 w-full items-center justify-center rounded-xl bg-theme-600 text-base leading-6 font-semibold text-white transition-colors duration-200 hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-70",
        className
    ]}
>
    {#if children}
        {@render children()}
    {/if}
</button>

<style>
    button {
        appearance: none;
        border: none;
        font-family: inherit;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
    }
</style>
