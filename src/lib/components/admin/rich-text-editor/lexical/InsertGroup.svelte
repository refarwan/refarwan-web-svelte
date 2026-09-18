<script lang="ts">
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { ImageIcon, MinusIcon, PresentationIcon, VideoIcon } from "lucide-svelte/icons";

    import { getActiveEditor } from "svelte-lexical";

    import { $createResizableHorizontalRuleNode as createResizableHorizontalRuleNode } from "./nodes/resizable-horizontal-rule-node";
    import StubMediaButton from "./StubMediaButton.svelte";
    import TableButton from "./TableButton.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

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
<StubMediaButton title={t.image} message={t.featureInDevelopment}>
    {#snippet icon()}<ImageIcon size={14} strokeWidth={2.5} />{/snippet}
</StubMediaButton>
<StubMediaButton title={t.video} message={t.featureInDevelopment}>
    {#snippet icon()}<VideoIcon size={14} strokeWidth={2.5} />{/snippet}
</StubMediaButton>
<StubMediaButton title={t.slideShow} message={t.featureInDevelopment}>
    {#snippet icon()}<PresentationIcon size={14} strokeWidth={2.5} />{/snippet}
</StubMediaButton>
