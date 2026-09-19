<script lang="ts">
    import Icon from "@iconify/svelte";
    import { $findMatchingParent as findMatchingParent, mergeRegister } from "@lexical/utils";
    import {
        FORMAT_ELEMENT_COMMAND,
        $getSelection as getSelection,
        $isElementNode as isElementNode,
        $isRangeSelection as isRangeSelection
    } from "lexical";
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
    <Icon icon="lucide:align-left" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.alignCenter}
    isActive={currentAlign === "center"}
    onclick={() => align("center")}
>
    <Icon icon="lucide:align-center" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.alignRight}
    isActive={currentAlign === "right"}
    onclick={() => align("right")}
>
    <Icon icon="lucide:align-right" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.alignJustify}
    isActive={currentAlign === "justify"}
    onclick={() => align("justify")}
>
    <Icon icon="lucide:align-justify" width={14} height={14} />
</ToolbarButton>
