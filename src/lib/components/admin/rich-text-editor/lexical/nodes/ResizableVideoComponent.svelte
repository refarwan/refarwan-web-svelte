<script lang="ts">
    import { mergeRegister } from "@lexical/utils";
    import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, $getNodeByKey as getNodeByKey } from "lexical";

    import { clearSelection, createNodeSelectionStore } from "svelte-lexical";

    import ImageAlignmentBar from "./ImageAlignmentBar.svelte";
    import MediaResizeHandles from "./MediaResizeHandles.svelte";
    import {
        $isResizableVideoNode as isResizableVideoNode,
        MIN_VIDEO_WIDTH_PERCENT
    } from "./resizable-video-node";

    import type { LexicalEditor } from "lexical";
    import type { VideoAlign } from "./resizable-video-node";

    interface Props {
        nodeKey: string;
        editor: LexicalEditor;
    }

    let { nodeKey, editor }: Props = $props();

    const isSelected = createNodeSelectionStore(editor, nodeKey);

    const readState = (): {
        src: string;
        title: string;
        widthPercent: number;
        align: VideoAlign;
    } => {
        let src = "";
        let title = "";
        let widthPercent = 100;
        let align: VideoAlign = "center";
        editor.getEditorState().read(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableVideoNode(node)) {
                src = node.getSrc();
                title = node.getTitle();
                widthPercent = node.getWidthPercent();
                align = node.getAlign();
            }
        });
        return { src, title, widthPercent, align };
    };

    let src = $state(readState().src);
    let title = $state(readState().title);
    let widthPercent = $state(readState().widthPercent);
    let align = $state(readState().align);
    let containerRef: HTMLDivElement | undefined = $state();

    $effect(() =>
        mergeRegister(
            editor.registerUpdateListener(() => {
                const next = readState();
                src = next.src;
                title = next.title;
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
        if ($isSelected && (event.key === "Backspace" || event.key === "Delete")) {
            event.preventDefault();
            editor.update(() => {
                const node = getNodeByKey(nodeKey);
                if (node) node.remove();
            });
            return;
        }
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        clearSelection(editor);
        $isSelected = !$isSelected;
    };

    const setAlign = (nextAlign: VideoAlign) => {
        editor.update(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableVideoNode(node)) node.setAlign(nextAlign);
        });
    };

    const startDrag = (event: PointerEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement | null;
        if (target?.setPointerCapture) target.setPointerCapture(event.pointerId);

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
            widthPercent = Math.min(100, Math.max(MIN_VIDEO_WIDTH_PERCENT, Math.round(next)));
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            if (target?.releasePointerCapture) target.releasePointerCapture(upEvent.pointerId);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            const nextWidth = widthPercent;
            editor.update(() => {
                const node = getNodeByKey(nodeKey);
                if (isResizableVideoNode(node)) node.setWidthPercent(nextWidth);
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
    class={`relative my-4 flex items-center select-none ${justifyClass}`}
    onkeydown={onKeyDown}
>
    {#if $isSelected}
        <ImageAlignmentBar {align} onSetAlign={setAlign} />
    {/if}

    <div class="relative inline-block max-w-full" style={`width: ${widthPercent}%`}>
        <div
            class={`relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm transition-shadow ${
                $isSelected
                    ? "ring-2 ring-theme-500 ring-offset-2"
                    : "hover:ring-1 hover:ring-gray-300"
            }`}
        >
            <iframe
                {src}
                title={title || "Embedded Video"}
                class="pointer-events-none h-full w-full border-0 select-none"
                tabindex="-1"
                frameborder="0"
                allowfullscreen
            ></iframe>

            <button
                type="button"
                aria-label="Select Video"
                onclick={(e) => {
                    e.stopPropagation();
                    if (!$isSelected) {
                        clearSelection(editor);
                        $isSelected = true;
                    }
                }}
                class="absolute inset-0 z-5 cursor-pointer bg-transparent"
            ></button>
        </div>

        {#if $isSelected}
            <MediaResizeHandles {align} onPointerDown={startDrag} />
        {/if}
    </div>
</div>
