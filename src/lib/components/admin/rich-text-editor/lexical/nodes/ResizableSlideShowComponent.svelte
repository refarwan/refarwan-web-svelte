<script lang="ts">
    import { mergeRegister } from "@lexical/utils";
    import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, $getNodeByKey as getNodeByKey } from "lexical";

    import { clearSelection, createNodeSelectionStore } from "svelte-lexical";

    import ImageAlignmentBar from "./ImageAlignmentBar.svelte";
    import MediaResizeHandles from "./MediaResizeHandles.svelte";
    import {
        $isResizableSlideShowNode as isResizableSlideShowNode,
        MIN_SLIDESHOW_WIDTH_PERCENT
    } from "./resizable-slideshow-node";
    import SlideShowViewport from "./SlideShowViewport.svelte";

    import type { LexicalEditor } from "lexical";
    import type { SlideShowAlign, SlideShowImage } from "./resizable-slideshow-node";

    interface Props {
        nodeKey: string;
        editor: LexicalEditor;
    }

    let { nodeKey, editor }: Props = $props();

    const isSelected = createNodeSelectionStore(editor, nodeKey);

    const readState = (): {
        items: SlideShowImage[];
        widthPercent: number;
        align: SlideShowAlign;
    } => {
        let items: SlideShowImage[] = [];
        let widthPercent = 100;
        let align: SlideShowAlign = "center";
        editor.getEditorState().read(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableSlideShowNode(node)) {
                items = node.getItems();
                widthPercent = node.getWidthPercent();
                align = node.getAlign();
            }
        });
        return { items, widthPercent, align };
    };

    let items = $state(readState().items);
    let widthPercent = $state(readState().widthPercent);
    let align = $state(readState().align);
    let currentIndex = $state(0);
    let containerRef: HTMLDivElement | undefined = $state();

    $effect(() =>
        mergeRegister(
            editor.registerUpdateListener(() => {
                const next = readState();
                items = next.items;
                widthPercent = next.widthPercent;
                align = next.align;
                if (currentIndex >= items.length) currentIndex = Math.max(0, items.length - 1);
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

    const prevSlide = (e?: Event) => {
        e?.stopPropagation();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    };

    const nextSlide = (e?: Event) => {
        e?.stopPropagation();
        currentIndex = (currentIndex + 1) % items.length;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if ($isSelected) {
            if (event.key === "Backspace" || event.key === "Delete") {
                event.preventDefault();
                editor.update(() => {
                    const node = getNodeByKey(nodeKey);
                    if (node) node.remove();
                });
                return;
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                prevSlide();
                return;
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                nextSlide();
                return;
            }
        }
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        clearSelection(editor);
        $isSelected = !$isSelected;
    };

    const setAlign = (nextAlign: SlideShowAlign) => {
        editor.update(() => {
            const node = getNodeByKey(nodeKey);
            if (isResizableSlideShowNode(node)) node.setAlign(nextAlign);
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
            widthPercent = Math.min(100, Math.max(MIN_SLIDESHOW_WIDTH_PERCENT, Math.round(next)));
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            if (target?.releasePointerCapture) target.releasePointerCapture(upEvent.pointerId);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            const nextWidth = widthPercent;
            editor.update(() => {
                const node = getNodeByKey(nodeKey);
                if (isResizableSlideShowNode(node)) node.setWidthPercent(nextWidth);
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
            class={`relative aspect-video w-full overflow-hidden rounded-lg bg-slate-950 shadow-sm transition-shadow ${
                $isSelected
                    ? "ring-2 ring-theme-500 ring-offset-2"
                    : "hover:ring-1 hover:ring-gray-300"
            }`}
        >
            <SlideShowViewport
                {items}
                {currentIndex}
                onPrev={prevSlide}
                onNext={nextSlide}
                onSelectIndex={(i) => (currentIndex = i)}
            />
        </div>

        {#if $isSelected}
            <MediaResizeHandles {align} onPointerDown={startDrag} />
        {/if}
    </div>
</div>
