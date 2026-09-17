<script lang="ts">
    import { $getNodeByKey as getNodeByKey } from "lexical";

    import { clearSelection, createNodeSelectionStore } from "svelte-lexical";

    import {
        $isResizableHorizontalRuleNode as isResizableHorizontalRuleNode,
        MIN_HR_WIDTH_PERCENT
    } from "./resizable-horizontal-rule-node";

    import type { LexicalEditor } from "lexical";

    interface Props {
        nodeKey: string;
        editor: LexicalEditor;
    }

    let { nodeKey, editor }: Props = $props();

    const isSelected = createNodeSelectionStore(editor, nodeKey);

    const readWidthPercent = (): number => {
        let width = 100;
        editor.getEditorState().read(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableHorizontalRuleNode(node)) width = node.getWidthPercent();
        });
        return width;
    };

    let widthPercent = $state(readWidthPercent());
    let containerRef: HTMLDivElement | undefined = $state();

    $effect(() =>
        editor.registerUpdateListener(() => {
            widthPercent = readWidthPercent();
        })
    );

    const onClick = (event: MouseEvent) => {
        if (!event.shiftKey) clearSelection(editor);
        $isSelected = !$isSelected;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        clearSelection(editor);
        $isSelected = !$isSelected;
    };

    const startDrag = (event: PointerEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = containerRef?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const parentWidth = rect.width;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const distance = Math.abs(moveEvent.clientX - centerX);
            widthPercent = Math.min(
                100,
                Math.max(MIN_HR_WIDTH_PERCENT, Math.round((distance * 2 * 100) / parentWidth))
            );
        };

        const onPointerUp = () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            const nextWidth = widthPercent;
            editor.update(() => {
                const node = getNodeByKey(nodeKey);
                if (isResizableHorizontalRuleNode(node)) node.setWidthPercent(nextWidth);
            });
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };
</script>

<div
    bind:this={containerRef}
    role="button"
    tabindex="0"
    class="relative flex items-center py-2"
    onclick={onClick}
    onkeydown={onKeyDown}
>
    <hr
        style={`width: ${widthPercent}%`}
        class={`m-0 border-0 border-t-2 transition-colors ${
            $isSelected ? "border-theme-500" : "border-gray-300"
        }`}
    />
    {#if $isSelected}
        <button
            type="button"
            aria-label="Resize"
            onpointerdown={startDrag}
            style={`left: calc(50% - ${widthPercent / 2}%)`}
            class="absolute top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
        ></button>
        <button
            type="button"
            aria-label="Resize"
            onpointerdown={startDrag}
            style={`left: calc(50% + ${widthPercent / 2}%)`}
            class="absolute top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
        ></button>
    {/if}
</div>
