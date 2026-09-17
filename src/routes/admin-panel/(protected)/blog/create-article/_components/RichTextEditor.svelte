<script lang="ts">
    import { AutoLinkNode, LinkNode } from "@lexical/link";
    import { ListItemNode, ListNode } from "@lexical/list";
    import { HeadingNode, QuoteNode } from "@lexical/rich-text";
    import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

    import {
        Composer,
        ContentEditable,
        LinkPlugin,
        ListPlugin,
        PlaceHolder,
        RichTextPlugin,
        SharedHistoryPlugin,
        TabIndentationPlugin,
        TablePlugin
    } from "svelte-lexical";
    import { theme } from "svelte-lexical/dist/themes/default";

    import EditorToolbar from "./lexical/EditorToolbar.svelte";
    import { ResizableHorizontalRuleNode } from "./lexical/nodes/resizable-horizontal-rule-node";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const initialConfig = {
        namespace: "ArticleEditor",
        theme,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            AutoLinkNode,
            ResizableHorizontalRuleNode,
            TableNode,
            TableRowNode,
            TableCellNode
        ],
        onError: (error: Error) => {
            throw error;
        }
    };
</script>

<div class="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xs">
    <Composer {initialConfig}>
        <EditorToolbar {t} />

        <div class="richtext-content relative">
            <ContentEditable className="min-h-75 px-3.5 py-3 text-sm text-gray-900 outline-none" />
            <PlaceHolder
                className="pointer-events-none absolute top-3 left-3.5 text-sm text-gray-400 select-none"
            >
                {t.contentPlaceholder}
            </PlaceHolder>
        </div>

        <RichTextPlugin />
        <SharedHistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        <TabIndentationPlugin />
    </Composer>
</div>

<style>
    :global(.richtext-content .SL_Theme__paragraph) {
        margin: 0 0 0.75em;
    }
    :global(.richtext-content .SL_Theme__paragraph:last-child) {
        margin-bottom: 0;
    }
    :global(.richtext-content .SL_Theme__ul) {
        list-style-type: disc;
        padding-left: 1.5em;
    }
    :global(.richtext-content .SL_Theme__ol1) {
        list-style-type: decimal;
        padding-left: 1.5em;
    }
    :global(.richtext-content .SL_Theme__ol2),
    :global(.richtext-content .SL_Theme__ol3),
    :global(.richtext-content .SL_Theme__ol4),
    :global(.richtext-content .SL_Theme__ol5) {
        padding-left: 1.5em;
    }
    :global(.richtext-content .SL_Theme__listItem) {
        margin: 0.15em 0;
    }
</style>
