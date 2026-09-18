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
        TablePlugin,
        generateHtmlFromNodes
    } from "svelte-lexical";
    import { theme } from "svelte-lexical/dist/themes/default";

    import EditorToolbar from "./lexical/EditorToolbar.svelte";
    import { ResizableHorizontalRuleNode } from "./lexical/nodes/resizable-horizontal-rule-node";
    import { ResizableImageNode } from "./lexical/nodes/resizable-image-node";
    import { ResizableSlideShowNode } from "./lexical/nodes/resizable-slideshow-node";
    import { ResizableVideoNode } from "./lexical/nodes/resizable-video-node";
    import TableEnhancePlugin from "./lexical/table/TableEnhancePlugin.svelte";

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
            ResizableImageNode,
            ResizableVideoNode,
            ResizableSlideShowNode,
            TableNode,
            TableRowNode,
            TableCellNode
        ],

        onError: (error: Error) => {
            throw error;
        }
    };

    let composer: Composer;
</script>

<button
    onclick={() => {
        const editor = composer.getEditor();
        editor.read(() => {
            const html = generateHtmlFromNodes(editor);
            console.log(html);
        });
    }}>Export HTML</button
>

<button
    onclick={() => {
        console.log(composer.getEditor().toJSON());
    }}
>
    Export JSON
</button>

<div class="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xs">
    <Composer {initialConfig} bind:this={composer}>
        <EditorToolbar {t} />

        <div class="richtext-content svelte-lexical relative">
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
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        <TableEnhancePlugin {t} />
        <TabIndentationPlugin />
    </Composer>
</div>

<style>
    :global(.richtext-content table) {
        border-collapse: collapse;
        margin: 1em 0;
        width: max-content;
        max-width: 100%;
    }
    /* Higher specificity than the rule above so lexical's alignment classes can win */
    :global(.richtext-content table.SL_Theme__tableAlignmentCenter) {
        margin-left: auto;
        margin-right: auto;
    }
    :global(.richtext-content table.SL_Theme__tableAlignmentRight) {
        margin-left: auto;
        margin-right: 0;
    }
    :global(.richtext-content th),
    :global(.richtext-content td) {
        border: 1px solid #d1d5db;
        padding: 6px 10px;
        min-width: 50px;
        vertical-align: top;
        position: relative;
    }
    :global(.richtext-content th) {
        background-color: #f8fafc;
        font-weight: 600;
    }
    :global(.richtext-content .SL_Theme__paragraph) {
        margin: 0.75em 0;
    }

    :global(.richtext-content .SL_Theme__paragraph:last-child) {
        margin-bottom: 0;
    }
    :global(.richtext-content .SL_Theme__paragraph:first-child) {
        margin-top: 0;
    }
    :global(.richtext-content .SL_Theme__ul) {
        list-style-type: disc;
        padding-left: 3em;
    }
    :global(.richtext-content .SL_Theme__ol1) {
        list-style-type: decimal;
        padding-left: 3em;
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
