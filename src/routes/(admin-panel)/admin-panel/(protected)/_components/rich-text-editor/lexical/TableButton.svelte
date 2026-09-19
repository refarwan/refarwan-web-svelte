<script lang="ts">
    import Icon from "@iconify/svelte";
    import { INSERT_TABLE_COMMAND } from "@lexical/table";
    import { getActiveEditor } from "svelte-lexical";
    import { popup } from "../../../../../stores/popup.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();

    const GRID_ROWS_COUNT = 8;
    const GRID_COLS_COUNT = 10;
    const GRID_ROWS = Array.from({ length: GRID_ROWS_COUNT }, (_, i) => i);
    const GRID_COLS = Array.from({ length: GRID_COLS_COUNT }, (_, i) => i);

    let popupId = $state("");
    let hoverRow = $state(0);
    let hoverCol = $state(0);
    let showCustom = $state(false);
    let customRows = $state(3);
    let customColumns = $state(3);

    const openTablePopup = () => {
        hoverRow = 0;
        hoverCol = 0;
        showCustom = false;
        customRows = 3;
        customColumns = 3;
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: tablePopupSnippet });
    };

    const close = () => popup.remove(popupId);

    // INSERT_TABLE_COMMAND is a no-op without an existing selection, which
    // there isn't one if the editor was never focused/clicked into first.
    // Only the first row is marked as a header — not the first column, which
    // @lexical/table's boolean `includeHeaders` shorthand would also bold/shade.
    const insertTableWithFocus = (columns: string, rows: string) => {
        $activeEditor.focus(() => {
            $activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
                columns,
                rows,
                includeHeaders: { rows: true, columns: false }
            });
        });
    };

    const insertFromGrid = (row: number, col: number) => {
        insertTableWithFocus(String(col + 1), String(row + 1));
        close();
    };

    const insertCustom = () => {
        insertTableWithFocus(String(customColumns), String(customRows));
        close();
    };
</script>

<ToolbarButton title={t.table} onclick={openTablePopup}>
    <Icon icon="lucide:table" width={14} height={14} />
</ToolbarButton>

{#snippet tablePopupSnippet()}
    <div class="w-64 rounded-xl border border-gray-200 bg-white p-4">
        <h3 class="mb-3 text-sm font-semibold text-gray-700">{t.tableModalTitle}</h3>

        {#if !showCustom}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="grid w-fit gap-1"
                style={`grid-template-columns: repeat(${GRID_COLS_COUNT}, 1fr);`}
                onpointerleave={() => {
                    hoverRow = 0;
                    hoverCol = 0;
                }}
            >
                {#each GRID_ROWS as r (r)}
                    {#each GRID_COLS as c (c)}
                        <button
                            type="button"
                            aria-label={`${r + 1} x ${c + 1}`}
                            onpointerenter={() => {
                                hoverRow = r;
                                hoverCol = c;
                            }}
                            onclick={() => insertFromGrid(r, c)}
                            class={`h-5 w-5 rounded-sm border transition-colors ${r <= hoverRow && c <= hoverCol ? "border-theme-500 bg-theme-100" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
                        ></button>
                    {/each}
                {/each}
            </div>
            <p class="mt-2 text-center text-xs text-gray-500">
                {hoverRow + 1} x {hoverCol + 1}
            </p>
            <button
                type="button"
                onclick={() => (showCustom = true)}
                class="mt-3 w-full cursor-pointer rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
                {t.tableCustomSize || "Ukuran Kustom"}
            </button>
        {:else}
            <div class="mb-4 grid grid-cols-2 gap-3">
                <label class="flex flex-col gap-1 text-xs text-gray-600">
                    {t.tableRows}
                    <input
                        type="number"
                        min="1"
                        max="50"
                        bind:value={customRows}
                        class="h-9 rounded-lg border border-gray-300 px-2.5 text-sm text-gray-700 outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
                    />
                </label>
                <label class="flex flex-col gap-1 text-xs text-gray-600">
                    {t.tableColumns}
                    <input
                        type="number"
                        min="1"
                        max="20"
                        bind:value={customColumns}
                        class="h-9 rounded-lg border border-gray-300 px-2.5 text-sm text-gray-700 outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
                    />
                </label>
            </div>
            <div class="flex items-center justify-between gap-2">
                <button
                    type="button"
                    onclick={() => (showCustom = false)}
                    class="cursor-pointer rounded-lg px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                    {t.tableBackToGrid || "Kembali"}
                </button>
                <div class="flex gap-2">
                    <button
                        type="button"
                        onclick={close}
                        class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                        {t.tableCancel}
                    </button>
                    <button
                        type="button"
                        onclick={insertCustom}
                        disabled={customRows < 1 || customColumns < 1}
                        class="cursor-pointer rounded-lg bg-theme-600 px-4 py-2 text-sm font-medium text-white hover:bg-theme-700 disabled:opacity-50"
                    >
                        {t.tableInsert}
                    </button>
                </div>
            </div>
        {/if}
    </div>
{/snippet}
