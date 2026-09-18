<script lang="ts">
    interface Props {
        selectedCount: number;
        selectedLabel: string;
        cancelLabel: string;
        insertLabel: string;
        canInsert: boolean;
        onClose: () => void;
        onConfirm: () => void;
    }

    let {
        selectedCount,
        selectedLabel,
        cancelLabel,
        insertLabel,
        canInsert,
        onClose,
        onConfirm
    }: Props = $props();
</script>

<div class="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-3.5">
    <div class="text-xs text-gray-500">
        {#if selectedCount > 0}
            <span class="font-medium text-gray-700">{selectedLabel}:</span>
            <span class="ml-1 font-semibold text-theme-600">{selectedCount} gambar</span>
        {:else}
            <span class="text-gray-400">Belum ada gambar yang dipilih</span>
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
            disabled={!canInsert}
            class="cursor-pointer rounded-lg bg-theme-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-theme-700 disabled:opacity-40"
        >
            {insertLabel}
        </button>
    </div>
</div>
