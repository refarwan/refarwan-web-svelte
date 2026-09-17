<script lang="ts">
    import { mergeRegister } from "@lexical/utils";
    import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, $getNodeByKey as getNodeByKey } from "lexical";
    import { TextAlignCenterIcon, TextAlignStartIcon, TextAlignEndIcon } from "lucide-svelte/icons";

    import { clearSelection, createNodeSelectionStore } from "svelte-lexical";

    import {
        $isResizableHorizontalRuleNode as isResizableHorizontalRuleNode,
        MIN_HR_WIDTH_PERCENT
    } from "./resizable-horizontal-rule-node";

    import type { LexicalEditor } from "lexical";
    import type { HRAlign } from "./resizable-horizontal-rule-node";

    interface Props {
        nodeKey: string;
        editor: LexicalEditor;
    }

    let { nodeKey, editor }: Props = $props();

    const isSelected = createNodeSelectionStore(editor, nodeKey);

    const readState = (): { widthPercent: number; align: HRAlign } => {
        let widthPercent = 100;
        let align: HRAlign = "center";
        editor.getEditorState().read(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableHorizontalRuleNode(node)) {
                widthPercent = node.getWidthPercent();
                align = node.getAlign();
            }
        });
        return { widthPercent, align };
    };

    let widthPercent = $state(readState().widthPercent);
    let align = $state(readState().align);
    let containerRef: HTMLDivElement | undefined = $state();

    $effect(() =>
        mergeRegister(
            editor.registerUpdateListener(() => {
                const next = readState();
                widthPercent = next.widthPercent;
                align = next.align;
            }),
            editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    if (!containerRef?.contains(event.target as Node)) return false;
                    if (!event.shiftKey) clearSelection(editor);
                    $isSelected = !$isSelected;
                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        )
    );

    const justifyClass = $derived(
        align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center"
    );

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        clearSelection(editor);
        $isSelected = !$isSelected;
    };

    const setAlign = (nextAlign: HRAlign) => {
        editor.update(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableHorizontalRuleNode(node)) node.setAlign(nextAlign);
        });
    };

    const startDrag = (event: PointerEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = containerRef?.getBoundingClientRect();
        if (!rect) return;
        const parentWidth = rect.width;

        const onPointerMove = (moveEvent: PointerEvent) => {
            let next: number;
            if (align === "left") {
                next = ((moveEvent.clientX - rect.left) / parentWidth) * 100;
            } else if (align === "right") {
                next = ((rect.right - moveEvent.clientX) / parentWidth) * 100;
            } else {
                const centerX = rect.left + parentWidth / 2;
                next = (Math.abs(moveEvent.clientX - centerX) * 2 * 100) / parentWidth;
            }
            widthPercent = Math.min(100, Math.max(MIN_HR_WIDTH_PERCENT, Math.round(next)));
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
    class={`relative flex items-center py-2 ${justifyClass}`}
    onkeydown={onKeyDown}
>
    {#if $isSelected}
        <div
            class="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5 shadow-md"
        >
            <button
                type="button"
                aria-label="Rata Kiri"
                onclick={(event) => {
                    event.stopPropagation();
                    setAlign("left");
                }}
                class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
                    align === "left"
                        ? "bg-theme-100 text-theme-700"
                        : "text-gray-500 hover:bg-gray-100"
                }`}
            >
                <TextAlignStartIcon size={13} strokeWidth={2.5} />
            </button>
            <button
                type="button"
                aria-label="Rata Tengah"
                onclick={(event) => {
                    event.stopPropagation();
                    setAlign("center");
                }}
                class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
                    align === "center"
                        ? "bg-theme-100 text-theme-700"
                        : "text-gray-500 hover:bg-gray-100"
                }`}
            >
                <TextAlignCenterIcon size={13} strokeWidth={2.5} />
            </button>
            <button
                type="button"
                aria-label="Rata Kanan"
                onclick={(event) => {
                    event.stopPropagation();
                    setAlign("right");
                }}
                class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
                    align === "right"
                        ? "bg-theme-100 text-theme-700"
                        : "text-gray-500 hover:bg-gray-100"
                }`}
            >
                <TextAlignEndIcon size={13} strokeWidth={2.5} />
            </button>
        </div>
    {/if}

    <hr
        style={`width: ${widthPercent}%`}
        class={`m-0 border-0 border-t-2 transition-colors ${
            $isSelected ? "border-theme-500" : "border-gray-300"
        }`}
    />

    {#if $isSelected}
        {#if align === "center"}
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
        {:else if align === "left"}
            <button
                type="button"
                aria-label="Resize"
                onpointerdown={startDrag}
                style={`left: ${widthPercent}%`}
                class="absolute top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
            ></button>
        {:else}
            <button
                type="button"
                aria-label="Resize"
                onpointerdown={startDrag}
                style={`left: ${100 - widthPercent}%`}
                class="absolute top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
            ></button>
        {/if}
    {/if}
</div>
