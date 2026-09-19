<script lang="ts">
    import Icon from "@iconify/svelte";
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { getActiveEditor } from "svelte-lexical";
    import ImageButton from "./ImageButton.svelte";
    import { $createResizableHorizontalRuleNode as createResizableHorizontalRuleNode } from "./nodes/resizable-horizontal-rule-node";
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
    <Icon icon="lucide:minus" width={14} height={14} />
</ToolbarButton>
<TableButton {t} />
<ImageButton {t} />
<VideoButton {t} />
<SlideShowButton {t} />
