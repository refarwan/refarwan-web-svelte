import {
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
    $deleteTableColumnAtSelection as deleteTableColumnAtSelection,
    $deleteTableRowAtSelection as deleteTableRowAtSelection,
    $getTableCellNodeFromLexicalNode as getTableCellNodeFromLexicalNode,
    $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
    $insertTableColumnAtSelection as insertTableColumnAtSelection,
    $insertTableRowAtSelection as insertTableRowAtSelection,
    $isTableCellNode as isTableCellNode,
    $isTableSelection as isTableSelection,
    $mergeCells as mergeCells,
    TableCellHeaderStates,
    $unmergeCell as unmergeCell
} from "@lexical/table";
import { $getSelection as getSelection, $isRangeSelection as isRangeSelection } from "lexical";

import type { TableCellNode, TableNode } from "@lexical/table";
import type { ElementFormatType, LexicalEditor } from "lexical";

export type TableAlignment = "left" | "center" | "right";

export interface ActiveTableDetails {
    tableNode: TableNode;
    cellNode: TableCellNode;
    rowIndex: number;
    colIndex: number;
    canMerge: boolean;
    canUnmerge: boolean;
    cellColor: string | null;
    isHeader: boolean;
    alignment: TableAlignment;
}

const toTableAlignment = (format: ElementFormatType): TableAlignment => {
    if (format === "center") return "center";
    if (format === "right" || format === "end") return "right";
    return "left";
};

export const getActiveTableCell = (): TableCellNode | null => {
    const selection = getSelection();
    if (!selection) return null;
    if (isRangeSelection(selection) || isTableSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const cell = getTableCellNodeFromLexicalNode(anchorNode);
        return isTableCellNode(cell) ? cell : null;
    }
    return null;
};

export const getActiveTableDetails = (editor: LexicalEditor): ActiveTableDetails | null => {
    let details: ActiveTableDetails | null = null;
    editor.getEditorState().read(() => {
        const cell = getActiveTableCell();
        if (!cell) return;
        const table = getTableNodeFromLexicalNodeOrThrow(cell);
        const [tableMap] = computeTableMapSkipCellCheck(table, null, null);

        let rowIndex = 0;
        let colIndex = 0;
        for (let r = 0; r < tableMap.length; r++) {
            for (let c = 0; c < tableMap[r].length; c++) {
                if (tableMap[r][c].cell === cell) {
                    rowIndex = r;
                    colIndex = c;
                    break;
                }
            }
        }

        const selection = getSelection();
        const canMerge = isTableSelection(selection);
        const canUnmerge = cell.getColSpan() > 1 || cell.getRowSpan() > 1;
        const isHeader = (cell.getHeaderStyles() & TableCellHeaderStates.ROW) !== 0;

        details = {
            tableNode: table,
            cellNode: cell,
            rowIndex,
            colIndex,
            canMerge,
            canUnmerge,
            cellColor: cell.getBackgroundColor(),
            isHeader,
            alignment: toTableAlignment(table.getFormatType())
        };
    });
    return details;
};

export const setCellBgColor = (editor: LexicalEditor, color: string | null) => {
    editor.update(() => {
        const cell = getActiveTableCell();
        if (cell) cell.setBackgroundColor(color);
    });
};

export const setColumnBgColor = (editor: LexicalEditor, color: string | null) => {
    editor.update(() => {
        const cell = getActiveTableCell();
        if (!cell) return;
        const table = getTableNodeFromLexicalNodeOrThrow(cell);
        const [tableMap] = computeTableMapSkipCellCheck(table, null, null);

        let colIndex = -1;
        for (let r = 0; r < tableMap.length && colIndex === -1; r++) {
            for (let c = 0; c < tableMap[r].length; c++) {
                if (tableMap[r][c].cell === cell) {
                    colIndex = c;
                    break;
                }
            }
        }

        if (colIndex === -1) return;
        const touchedCells = new Set<string>();
        for (let r = 0; r < tableMap.length; r++) {
            const mapCell = tableMap[r][colIndex]?.cell;
            if (mapCell && !touchedCells.has(mapCell.getKey())) {
                touchedCells.add(mapCell.getKey());
                mapCell.setBackgroundColor(color);
            }
        }
    });
};

export const setTableAlignment = (editor: LexicalEditor, alignment: TableAlignment) => {
    editor.update(() => {
        const cell = getActiveTableCell();
        if (!cell) return;
        const table = getTableNodeFromLexicalNodeOrThrow(cell);
        table.setFormat(alignment);
    });
};

export const mergeSelectedCells = (editor: LexicalEditor) => {
    editor.update(() => {
        const selection = getSelection();
        if (isTableSelection(selection)) {
            const nodes = selection.getNodes();
            const cells = nodes.filter(isTableCellNode);
            mergeCells(cells);
        }
    });
};

export const unmergeActiveCell = (editor: LexicalEditor) => {
    editor.update(() => {
        unmergeCell();
    });
};

export const insertCol = (editor: LexicalEditor, after: boolean) => {
    editor.update(() => {
        insertTableColumnAtSelection(after);
    });
};

export const deleteCol = (editor: LexicalEditor) => {
    editor.update(() => {
        deleteTableColumnAtSelection();
    });
};

export const insertRow = (editor: LexicalEditor, after: boolean) => {
    editor.update(() => {
        insertTableRowAtSelection(after);
    });
};

export const deleteRow = (editor: LexicalEditor) => {
    editor.update(() => {
        deleteTableRowAtSelection();
    });
};

export const deleteCurrentTable = (editor: LexicalEditor) => {
    editor.update(() => {
        const cell = getActiveTableCell();
        if (cell) {
            const table = getTableNodeFromLexicalNodeOrThrow(cell);
            table.remove();
        }
    });
};

export const toggleCellHeader = (editor: LexicalEditor) => {
    editor.update(() => {
        const cell = getActiveTableCell();
        if (!cell) return;
        const current = cell.getHeaderStyles();
        const next =
            (current & TableCellHeaderStates.ROW) !== 0
                ? current & ~TableCellHeaderStates.ROW
                : current | TableCellHeaderStates.ROW;
        cell.setHeaderStyles(next);
    });
};
