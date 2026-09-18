<script lang="ts">
    interface Props {
        kind: "column" | "row";
        onInsertBefore: () => void;
        onInsertAfter: () => void;
        onDelete: () => void;
        t: Record<string, string>;
    }

    let { kind, onInsertBefore, onInsertAfter, onDelete, t }: Props = $props();

    const insertBeforeLabel = $derived(
        kind === "column"
            ? t.tableInsertColumnBefore || "Sisipkan Kolom Kiri"
            : t.tableInsertRowBefore || "Sisipkan Baris Atas"
    );
    const insertAfterLabel = $derived(
        kind === "column"
            ? t.tableInsertColumnAfter || "Sisipkan Kolom Kanan"
            : t.tableInsertRowAfter || "Sisipkan Baris Bawah"
    );
    const deleteLabel = $derived(
        kind === "column" ? t.tableDeleteColumn || "Hapus Kolom" : t.tableDeleteRow || "Hapus Baris"
    );
</script>

<div class="flex w-44 flex-col rounded-xl border border-gray-200 bg-white p-1 text-xs shadow-xl">
    <button
        type="button"
        onclick={onInsertBefore}
        class="cursor-pointer rounded-lg px-2.5 py-1.5 text-left font-medium text-gray-700 hover:bg-gray-50"
    >
        {insertBeforeLabel}
    </button>
    <button
        type="button"
        onclick={onInsertAfter}
        class="cursor-pointer rounded-lg px-2.5 py-1.5 text-left font-medium text-gray-700 hover:bg-gray-50"
    >
        {insertAfterLabel}
    </button>
    <button
        type="button"
        onclick={onDelete}
        class="cursor-pointer rounded-lg px-2.5 py-1.5 text-left font-medium text-red-600 hover:bg-red-50"
    >
        {deleteLabel}
    </button>
</div>
