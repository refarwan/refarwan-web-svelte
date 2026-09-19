<script lang="ts">
    import Icon from "@iconify/svelte";
    import { untrack } from "svelte";
    import ColorBoard from "./ColorBoard.svelte";

    import type { Snippet } from "svelte";

    interface Props {
        initialColor: string;
        onClose: () => void;
        onSelectColor: (color: string | null) => void;
        title: string;
        cancelLabel: string;
        applyLabel: string;
        clearLabel?: string;
        extraContent?: Snippet;
    }

    let {
        initialColor,
        onClose,
        onSelectColor,
        title,
        cancelLabel,
        applyLabel,
        clearLabel,
        extraContent
    }: Props = $props();

    let color = $state(untrack(() => initialColor));

    const handleApply = (): void => {
        onSelectColor(color);
        onClose();
    };

    const handleClear = (): void => {
        onSelectColor(null);
        onClose();
    };
</script>

<div class="flex w-64 flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
    <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700">{title}</h3>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
            <Icon icon="lucide:x" class="h-4 w-4" />
        </button>
    </div>

    {#if extraContent}
        {@render extraContent()}
    {/if}

    <div class="flex justify-center py-1">
        <ColorBoard bind:value={color} />
    </div>

    {#if clearLabel}
        <button
            type="button"
            onclick={handleClear}
            class="w-full cursor-pointer rounded border border-gray-300 py-1 text-center text-xs text-gray-700 transition-colors hover:underline"
        >
            {clearLabel}
        </button>
    {/if}

    <div class="flex justify-end gap-2 border-t border-gray-100 pt-3">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
            {cancelLabel}
        </button>
        <button
            type="button"
            onclick={handleApply}
            class="cursor-pointer rounded-lg bg-theme-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-theme-700"
        >
            {applyLabel}
        </button>
    </div>
</div>
