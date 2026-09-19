<script lang="ts">
    interface Props {
        selectedId?: string;
        selectedLabel: string;
        cancelLabel: string;
        insertLabel: string;
        onClose: () => void;
        onConfirm: () => void;
    }

    let { selectedId, selectedLabel, cancelLabel, insertLabel, onClose, onConfirm }: Props =
        $props();
</script>

<div class="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-3.5">
    <div class="text-xs text-gray-500">
        {#if selectedId}
            <span class="font-medium text-gray-700">{selectedLabel}:</span>
            <span class="ml-1 inline-block max-w-45 truncate align-bottom font-mono text-[11px]"
                >{selectedId}</span
            >
        {/if}
    </div>
    <div class="flex items-center gap-2.5">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
            {cancelLabel}
        </button>
        <button
            type="button"
            onclick={onConfirm}
            disabled={!selectedId}
            class="cursor-pointer rounded-lg bg-theme-600 px-4 py-2 text-xs font-semibold text-white hover:bg-theme-700 disabled:opacity-40"
        >
            {insertLabel}
        </button>
    </div>
</div>
