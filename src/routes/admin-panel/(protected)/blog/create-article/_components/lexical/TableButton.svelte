<script lang="ts">
    import { TableIcon } from "lucide-svelte/icons";

    import { getActiveEditor, insertTable } from "svelte-lexical";

    import { popup } from "$lib/stores/popup.svelte";

    import ToolbarButton from "./ToolbarButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();

    let popupId = $state("");
    let rows = $state(3);
    let columns = $state(3);

    const openTablePopup = () => {
        rows = 3;
        columns = 3;
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: tablePopupSnippet });
    };

    const close = () => popup.remove(popupId);

    const insert = () => {
        insertTable($activeEditor, String(columns), String(rows));
        close();
    };
</script>

<ToolbarButton title={t.table} onclick={openTablePopup}>
    {#snippet icon()}<TableIcon size={14} strokeWidth={2.5} />{/snippet}
</ToolbarButton>

{#snippet tablePopupSnippet()}
    <div class="w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
        <h3 class="mb-4 text-sm font-semibold text-gray-700">{t.tableModalTitle}</h3>
        <div class="mb-4 grid grid-cols-2 gap-3">
            <label class="flex flex-col gap-1 text-xs text-gray-600">
                {t.tableRows}
                <input
                    type="number"
                    min="1"
                    max="50"
                    bind:value={rows}
                    class="h-9 rounded-lg border border-gray-300 px-2.5 text-sm text-gray-700 outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
                />
            </label>
            <label class="flex flex-col gap-1 text-xs text-gray-600">
                {t.tableColumns}
                <input
                    type="number"
                    min="1"
                    max="20"
                    bind:value={columns}
                    class="h-9 rounded-lg border border-gray-300 px-2.5 text-sm text-gray-700 outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
                />
            </label>
        </div>
        <div class="flex justify-end gap-2">
            <button
                type="button"
                onclick={close}
                class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
                {t.tableCancel}
            </button>
            <button
                type="button"
                onclick={insert}
                disabled={rows < 1 || columns < 1}
                class="cursor-pointer rounded-lg bg-theme-600 px-4 py-2 text-sm font-medium text-white hover:bg-theme-700 disabled:opacity-50"
            >
                {t.tableInsert}
            </button>
        </div>
    </div>
{/snippet}
