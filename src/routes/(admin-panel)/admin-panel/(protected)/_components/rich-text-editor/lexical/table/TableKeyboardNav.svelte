<script lang="ts">
    import {
        $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
        $getTableCellNodeFromLexicalNode as getTableCellNodeFromLexicalNode,
        $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
        $insertTableRowAtSelection as insertTableRowAtSelection,
        $isTableRowNode as isTableRowNode
    } from "@lexical/table";
    import {
        COMMAND_PRIORITY_CRITICAL,
        $getSelection as getSelection,
        $isElementNode as isElementNode,
        $isRangeSelection as isRangeSelection,
        KEY_ENTER_COMMAND,
        KEY_TAB_COMMAND
    } from "lexical";

    import type { TableCellNode } from "@lexical/table";
    import type { LexicalEditor } from "lexical";

    interface Props {
        editor: LexicalEditor;
    }

    let { editor }: Props = $props();

    // Finds the cell directly below `cellNode` (same column) via the table map,
    // so merged/spanned cells are accounted for the same way Lexical does internally.
    const findCellBelow = (cellNode: TableCellNode): TableCellNode | null => {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(cellNode);
        const [tableMap] = computeTableMapSkipCellCheck(tableNode, null, null);

        for (let r = 0; r < tableMap.length; r++) {
            for (let c = 0; c < tableMap[r].length; c++) {
                if (tableMap[r][c].cell === cellNode) {
                    const nextRow = tableMap[r + 1];
                    return nextRow ? nextRow[c].cell : null;
                }
            }
        }
        return null;
    };

    // Appends a new row after `cellNode`'s row and returns the cell in the same column.
    const appendRowAndGetCellBelow = (cellNode: TableCellNode): TableCellNode | null => {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(cellNode);
        const [tableMap] = computeTableMapSkipCellCheck(tableNode, null, null);
        let colIndex = -1;
        outer: for (let r = 0; r < tableMap.length; r++) {
            for (let c = 0; c < tableMap[r].length; c++) {
                if (tableMap[r][c].cell === cellNode) {
                    colIndex = c;
                    break outer;
                }
            }
        }
        if (colIndex === -1) return null;

        insertTableRowAtSelection(true);
        const [newTableMap] = computeTableMapSkipCellCheck(tableNode, null, null);
        const newRow = newTableMap[newTableMap.length - 1];
        return newRow ? newRow[colIndex].cell : null;
    };

    const isLastCellOfTable = (cellNode: TableCellNode): boolean => {
        if (cellNode.getNextSibling() !== null) return false;
        const row = cellNode.getParent();
        return isTableRowNode(row) && row.getNextSibling() === null;
    };

    $effect(() => {
        const unregisterEnter = editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event) => {
                if (event?.shiftKey) return false; // allow soft line breaks inside a cell

                const selection = getSelection();
                if (!isRangeSelection(selection) || !selection.isCollapsed()) return false;

                const cellNode = getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!cellNode) return false;

                const cellBelow = findCellBelow(cellNode) ?? appendRowAndGetCellBelow(cellNode);
                if (!cellBelow) return false;

                event?.preventDefault();
                cellBelow.selectStart();
                return true;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        const unregisterTab = editor.registerCommand(
            KEY_TAB_COMMAND,
            (event) => {
                if (event.shiftKey) return false; // let default handle backward navigation

                const selection = getSelection();
                if (!isRangeSelection(selection) || !selection.isCollapsed()) return false;

                const cellNode = getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                if (!cellNode || !isLastCellOfTable(cellNode)) return false;

                event.preventDefault();
                const newRow = insertTableRowAtSelection(true);
                const firstCell = newRow?.getFirstChild();
                if (isElementNode(firstCell)) firstCell.selectStart();
                return true;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        return () => {
            unregisterEnter();
            unregisterTab();
        };
    });
</script>
