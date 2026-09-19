<script lang="ts">
    import {
        $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
        $isTableCellNode as isTableCellNode
    } from "@lexical/table";
    import { $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode } from "lexical";

    import type { LexicalEditor } from "lexical";

    interface Props {
        editor: LexicalEditor;
    }

    let { editor }: Props = $props();

    const MIN_COL_WIDTH = 50;
    const SNAP_PX = 10; // pixels from right edge to activate

    // Dynamic style tag to force col-resize cursor (overrides contenteditable cursor:text)
    let cursorStyleEl: HTMLStyleElement | null = null;

    const setCursorResize = () => {
        if (cursorStyleEl) return;
        const el = document.createElement("style");
        el.textContent = "* { cursor: col-resize !important; }";
        document.head.appendChild(el);
        cursorStyleEl = el;
    };

    const clearCursorResize = () => {
        if (cursorStyleEl) {
            document.head.removeChild(cursorStyleEl);
            cursorStyleEl = null;
        }
    };

    // Indicator visual state
    let indicatorX = $state(0);
    let indicatorTop = $state(0);
    let indicatorHeight = $state(0);
    let indicatorVisible = $state(false);
    let isDragging = $state(false);

    // Plain JS (non-reactive) – stores info about the border the cursor is near
    type BorderInfo = {
        tableKey: string;
        colIndex: number;
        initialWidth: number;
    };
    let pendingBorder: BorderInfo | null = null;

    // Walk up from any node (incl. text nodes) to find TABLE element
    const findTableElem = (target: Node | null): HTMLTableElement | null => {
        let node: Node | null =
            target && target.nodeType === Node.TEXT_NODE ? target.parentNode : target;
        while (node && node.nodeType === Node.ELEMENT_NODE) {
            if ((node as HTMLElement).nodeName === "TABLE") return node as HTMLTableElement;
            node = node.parentNode;
        }
        return null;
    };

    // Get TableNode key from any table DOM element
    const getTableKey = (tableElem: HTMLTableElement): string | null => {
        const firstCell = tableElem.querySelector<HTMLElement>("td, th");
        if (!firstCell) return null;
        let key: string | null = null;
        editor.read(() => {
            try {
                const cellNode = getNearestNodeFromDOMNode(firstCell);
                if (!isTableCellNode(cellNode)) return;
                key = getTableNodeFromLexicalNodeOrThrow(cellNode).getKey();
            } catch {
                // ignore
            }
        });
        return key;
    };

    const clearIndicator = () => {
        if (indicatorVisible) indicatorVisible = false;
        if (pendingBorder) pendingBorder = null;
        clearCursorResize();
    };

    const onPointerMove = (event: PointerEvent) => {
        if (isDragging) return;

        const tableElem = findTableElem(event.target as Node);
        if (!tableElem) {
            clearIndicator();
            return;
        }

        const firstRowCells =
            tableElem.querySelectorAll<HTMLTableCellElement>("tr:first-of-type > *");
        const tableRect = tableElem.getBoundingClientRect();

        for (let i = 0; i < firstRowCells.length; i++) {
            const rect = firstRowCells[i].getBoundingClientRect();
            if (Math.abs(event.clientX - rect.right) <= SNAP_PX) {
                // Cursor is near this column's right border
                indicatorX = rect.right;
                indicatorTop = tableRect.top;
                indicatorHeight = tableRect.height;
                indicatorVisible = true;

                const key = getTableKey(tableElem);
                if (key) {
                    pendingBorder = {
                        tableKey: key,
                        colIndex: i,
                        initialWidth: Math.round(rect.width)
                    };
                }
                setCursorResize();
                return;
            }
        }

        clearIndicator();
    };

    const onPointerLeave = () => {
        if (!isDragging) clearIndicator();
    };

    // CAPTURE phase – runs before Lexical's own pointerdown handlers
    const onPointerDownCapture = (event: PointerEvent) => {
        if (!pendingBorder) return; // not near any border – let Lexical handle normally

        // We own this event – block Lexical column selection
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        isDragging = true;
        indicatorVisible = true; // keep visible while dragging
        const info = pendingBorder;
        const startX = event.clientX;

        const onMove = (e: PointerEvent) => {
            indicatorX = e.clientX;
        };

        const onUp = (e: PointerEvent) => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            isDragging = false;
            clearIndicator();

            const delta = e.clientX - startX;
            const finalWidth = Math.max(MIN_COL_WIDTH, Math.round(info.initialWidth + delta));

            editor.update(() => {
                const tableElem = editor.getElementByKey(info.tableKey) as HTMLElement | null;
                const firstRowCells =
                    tableElem?.querySelectorAll<HTMLTableCellElement>("tr:first-of-type > *");
                const firstChild = firstRowCells?.[0];
                if (!firstChild) return;
                const cellNode = getNearestNodeFromDOMNode(firstChild);
                if (!isTableCellNode(cellNode)) return;
                const tableNode = getTableNodeFromLexicalNodeOrThrow(cellNode);
                const colCount = tableNode.getColumnCount();
                const widths =
                    tableNode.getColWidths() ??
                    Array.from(firstRowCells, (cell) =>
                        Math.round(cell.getBoundingClientRect().width)
                    );
                const next = [...widths];
                while (next.length < colCount) next.push(100);
                next[info.colIndex] = finalWidth;
                tableNode.setColWidths(next);
            });
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };

    $effect(() => {
        const unregister = editor.registerRootListener((rootElement, prevRootElement) => {
            if (prevRootElement) {
                prevRootElement.removeEventListener("pointermove", onPointerMove);
                prevRootElement.removeEventListener("pointerleave", onPointerLeave);
                prevRootElement.removeEventListener(
                    "pointerdown",
                    onPointerDownCapture,
                    true // capture phase
                );
            }
            if (rootElement) {
                rootElement.addEventListener("pointermove", onPointerMove);
                rootElement.addEventListener("pointerleave", onPointerLeave);
                rootElement.addEventListener(
                    "pointerdown",
                    onPointerDownCapture,
                    true // capture phase – fires before Lexical
                );
            }
        });
        return () => {
            clearCursorResize(); // cleanup if component unmounts while near border
            unregister();
        };
    });
</script>

{#if indicatorVisible || isDragging}
    <!-- pointer-events:none so the line itself doesn't interfere -->
    <div
        style={`left: ${indicatorX}px; top: ${indicatorTop}px; height: ${indicatorHeight}px;`}
        class="pointer-events-none fixed z-[9999] w-0.5 -translate-x-1/2 rounded-full bg-theme-500"
    ></div>
{/if}
