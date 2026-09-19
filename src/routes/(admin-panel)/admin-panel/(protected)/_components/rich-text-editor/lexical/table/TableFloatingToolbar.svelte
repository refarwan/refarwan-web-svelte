<script lang="ts">
    import Icon from "@iconify/svelte";
    import {
        deleteCol,
        deleteCurrentTable,
        deleteRow,
        insertCol,
        insertRow,
        mergeSelectedCells,
        setCellBgColor,
        setColumnBgColor,
        setTableAlignment,
        toggleCellHeader,
        unmergeActiveCell
    } from "./table-commands";
    import TableAlignMenu from "./TableAlignMenu.svelte";
    import TableColorDropdown from "./TableColorDropdown.svelte";
    import TableGridMenu from "./TableGridMenu.svelte";

    import type { LexicalEditor } from "lexical";
    import type { ActiveTableDetails, TableAlignment } from "./table-commands";

    interface Props {
        editor: LexicalEditor;
        details: ActiveTableDetails;
        menuX: number;
        menuY: number;
        onClose: () => void;
        t: Record<string, string>;
    }

    let { editor, details, menuX, menuY, onClose, t }: Props = $props();

    let isColorOpen = $state(false);
    let isColMenuOpen = $state(false);
    let isRowMenuOpen = $state(false);
    let isAlignMenuOpen = $state(false);

    const closeAll = () => {
        isColorOpen = false;
        isColMenuOpen = false;
        isRowMenuOpen = false;
        isAlignMenuOpen = false;
        onClose();
    };

    const handleSelectColor = (color: string | null, target: "cell" | "column") => {
        if (target === "cell") {
            setCellBgColor(editor, color);
        } else {
            setColumnBgColor(editor, color);
        }
        onClose();
    };

    const handleSelectAlignment = (alignment: TableAlignment) => {
        setTableAlignment(editor, alignment);
        closeAll();
    };
</script>

<!-- Floating Context Menu (right-click) -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
    style={`top: ${menuY}px; left: ${menuX}px;`}
    class="absolute z-50 min-w-52 rounded-xl border border-gray-200 bg-white p-1.5 select-none"
    role="menu"
    aria-label="Table Actions"
    onclick={(e) => e.stopPropagation()}
>
    <!-- Cell Color -->
    <div class="relative">
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                isColorOpen = !isColorOpen;
                isColMenuOpen = false;
                isRowMenuOpen = false;
                isAlignMenuOpen = false;
            }}
            class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition hover:bg-gray-100 ${isColorOpen ? "bg-gray-100" : ""}`}
        >
            <Icon
                icon="lucide:paint-bucket"
                width={14}
                height={14}
                class="shrink-0 text-gray-500"
            />
            <span class="flex-1 text-left text-gray-700"
                >{t.tableCellColor || "Warna Background"}</span
            >
            <span class="text-xs text-gray-400">›</span>
        </button>
        {#if isColorOpen}
            <div class="absolute top-0 left-full z-50 ml-1">
                <TableColorDropdown
                    {t}
                    currentColor={details.cellColor}
                    onSelectColor={handleSelectColor}
                    onClose={() => (isColorOpen = false)}
                />
            </div>
        {/if}
    </div>

    <!-- Toggle TH/TD -->
    <button
        type="button"
        role="menuitem"
        onclick={() => {
            toggleCellHeader(editor);
            onClose();
        }}
        class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition hover:bg-gray-100 ${details.isHeader ? "text-theme-700" : "text-gray-700"}`}
    >
        <Icon icon="lucide:rows-4" width={14} height={14} class="shrink-0 text-gray-500" />
        <span class="flex-1 text-left">
            {details.isHeader
                ? t.tableCellHeaderToTd || "Ubah ke TD (Data)"
                : t.tableCellHeaderToTh || "Ubah ke TH (Header)"}
        </span>
    </button>

    <!-- Merge/Unmerge -->
    {#if details.canMerge}
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                mergeSelectedCells(editor);
                onClose();
            }}
            class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
            <Icon icon="lucide:combine" width={14} height={14} class="shrink-0 text-blue-500" />
            <span class="flex-1 text-left">{t.tableMergeCells || "Gabungkan Sel"}</span>
        </button>
    {/if}
    {#if details.canUnmerge}
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                unmergeActiveCell(editor);
                onClose();
            }}
            class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
        >
            <Icon icon="lucide:split" width={14} height={14} class="shrink-0 text-purple-500" />
            <span class="flex-1 text-left">{t.tableUnmergeCell || "Pisahkan Sel"}</span>
        </button>
    {/if}

    <div class="my-1 h-px bg-gray-100"></div>

    <!-- Column Actions -->
    <div class="relative">
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                isColMenuOpen = !isColMenuOpen;
                isColorOpen = false;
                isRowMenuOpen = false;
                isAlignMenuOpen = false;
            }}
            class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 ${isColMenuOpen ? "bg-gray-100" : ""}`}
        >
            <Icon icon="lucide:columns-3" width={14} height={14} class="shrink-0 text-gray-500" />
            <span class="flex-1 text-left">{t.tableColumn || "Kolom"}</span>
            <span class="text-xs text-gray-400">›</span>
        </button>
        {#if isColMenuOpen}
            <div class="absolute top-0 left-full z-50 ml-1">
                <TableGridMenu
                    kind="column"
                    onInsertBefore={() => {
                        insertCol(editor, false);
                        closeAll();
                    }}
                    onInsertAfter={() => {
                        insertCol(editor, true);
                        closeAll();
                    }}
                    onDelete={() => {
                        deleteCol(editor);
                        closeAll();
                    }}
                    {t}
                />
            </div>
        {/if}
    </div>

    <!-- Row Actions -->
    <div class="relative">
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                isRowMenuOpen = !isRowMenuOpen;
                isColorOpen = false;
                isColMenuOpen = false;
                isAlignMenuOpen = false;
            }}
            class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 ${isRowMenuOpen ? "bg-gray-100" : ""}`}
        >
            <Icon icon="lucide:rows-3" width={14} height={14} class="shrink-0 text-gray-500" />
            <span class="flex-1 text-left">{t.tableRow || "Baris"}</span>
            <span class="text-xs text-gray-400">›</span>
        </button>
        {#if isRowMenuOpen}
            <div class="absolute top-0 left-full z-50 ml-1">
                <TableGridMenu
                    kind="row"
                    onInsertBefore={() => {
                        insertRow(editor, false);
                        closeAll();
                    }}
                    onInsertAfter={() => {
                        insertRow(editor, true);
                        closeAll();
                    }}
                    onDelete={() => {
                        deleteRow(editor);
                        closeAll();
                    }}
                    {t}
                />
            </div>
        {/if}
    </div>

    <div class="my-1 h-px bg-gray-100"></div>

    <!-- Table Alignment -->
    <div class="relative">
        <button
            type="button"
            role="menuitem"
            onclick={() => {
                isAlignMenuOpen = !isAlignMenuOpen;
                isColorOpen = false;
                isColMenuOpen = false;
                isRowMenuOpen = false;
            }}
            class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 ${isAlignMenuOpen ? "bg-gray-100" : ""}`}
        >
            <Icon
                icon="lucide:align-horizontal-justify-center"
                width={14}
                height={14}
                class="shrink-0 text-gray-500"
            />
            <span class="flex-1 text-left">{t.tableAlignment || "Posisi Tabel"}</span>
            <span class="text-xs text-gray-400">›</span>
        </button>
        {#if isAlignMenuOpen}
            <div class="absolute top-0 left-full z-50 ml-1">
                <TableAlignMenu current={details.alignment} onSelect={handleSelectAlignment} {t} />
            </div>
        {/if}
    </div>

    <div class="my-1 h-px bg-gray-100"></div>

    <!-- Delete Table -->
    <button
        type="button"
        role="menuitem"
        onclick={() => {
            deleteCurrentTable(editor);
            onClose();
        }}
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
    >
        <Icon icon="lucide:trash-2" width={14} height={14} class="shrink-0" />
        <span class="flex-1 text-left">{t.tableDeleteTable || "Hapus Tabel"}</span>
    </button>
</div>
