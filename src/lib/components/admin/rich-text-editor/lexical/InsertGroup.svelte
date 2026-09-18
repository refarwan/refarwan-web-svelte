<script lang="ts">
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { MinusIcon } from "lucide-svelte/icons";

    import { getActiveEditor } from "svelte-lexical";

    import { $createResizableHorizontalRuleNode as createResizableHorizontalRuleNode } from "./nodes/resizable-horizontal-rule-node";
    import ImageButton from "./ImageButton.svelte";
    import SlideShowButton from "./SlideShowButton.svelte";
    import TableButton from "./TableButton.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";
    import VideoButton from "./VideoButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();

    const insertHorizontalRule = () => {
        $activeEditor.update(() => {
            insertNodeToNearestRoot(createResizableHorizontalRuleNode());
        });
    };
</script>

<ToolbarButton title={t.horizontalRule} onclick={insertHorizontalRule}>
    <MinusIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<TableButton {t} />
<ImageButton {t} />
<VideoButton {t} />
<SlideShowButton {t} />
