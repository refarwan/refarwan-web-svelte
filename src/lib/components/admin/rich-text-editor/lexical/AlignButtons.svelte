<script lang="ts">
    import { $findMatchingParent as findMatchingParent, mergeRegister } from "@lexical/utils";
    import {
        $getSelection as getSelection,
        $isElementNode as isElementNode,
        $isRangeSelection as isRangeSelection,
        FORMAT_ELEMENT_COMMAND
    } from "lexical";
    import {
        AlignCenterIcon,
        AlignJustifyIcon,
        AlignLeftIcon,
        AlignRightIcon
    } from "lucide-svelte/icons";
    import { onMount } from "svelte";

    import { getActiveEditor } from "svelte-lexical";

    import ToolbarButton from "./ToolbarButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    let currentAlign = $state("left");

    onMount(() =>
        mergeRegister(
            $activeEditor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = getSelection();
                    if (!isRangeSelection(selection)) return;
                    const anchorNode = selection.anchor.getNode();
                    const element = isElementNode(anchorNode)
                        ? anchorNode
                        : findMatchingParent(anchorNode, isElementNode);
                    currentAlign = element?.getFormatType() || "left";
                });
            })
        )
    );

    const align = (format: "left" | "center" | "right" | "justify") => {
        $activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
    };
</script>

<ToolbarButton
    title={t.alignLeft}
    isActive={currentAlign === "left" || currentAlign === ""}
    onclick={() => align("left")}
>
    {#snippet icon()}<AlignLeftIcon size={14} strokeWidth={2.5} />{/snippet}
</ToolbarButton>
<ToolbarButton
    title={t.alignCenter}
    isActive={currentAlign === "center"}
    onclick={() => align("center")}
>
    {#snippet icon()}<AlignCenterIcon size={14} strokeWidth={2.5} />{/snippet}
</ToolbarButton>
<ToolbarButton
    title={t.alignRight}
    isActive={currentAlign === "right"}
    onclick={() => align("right")}
>
    {#snippet icon()}<AlignRightIcon size={14} strokeWidth={2.5} />{/snippet}
</ToolbarButton>
<ToolbarButton
    title={t.alignJustify}
    isActive={currentAlign === "justify"}
    onclick={() => align("justify")}
>
    {#snippet icon()}<AlignJustifyIcon size={14} strokeWidth={2.5} />{/snippet}
</ToolbarButton>
