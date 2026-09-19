<script lang="ts">
    import { AutoLinkNode, LinkNode } from "@lexical/link";
    import { ListItemNode, ListNode } from "@lexical/list";
    import { HeadingNode, QuoteNode } from "@lexical/rich-text";
    import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
    import { CLEAR_EDITOR_COMMAND } from "lexical";
    import { untrack } from "svelte";
    import {
        Composer,
        ContentEditable,
        generateHtmlFromNodes,
        LinkPlugin,
        ListPlugin,
        OnChangePlugin,
        PlaceHolder,
        RichTextPlugin,
        SharedHistoryPlugin,
        TabIndentationPlugin,
        TablePlugin
    } from "svelte-lexical";
    import { theme } from "./theme";

    import "./editor.css";

    import EditorToolbar from "./lexical/EditorToolbar.svelte";
    import { ResizableHorizontalRuleNode } from "./lexical/nodes/resizable-horizontal-rule-node";
    import { ResizableImageNode } from "./lexical/nodes/resizable-image-node";
    import { ResizableSlideShowNode } from "./lexical/nodes/resizable-slideshow-node";
    import { ResizableVideoNode } from "./lexical/nodes/resizable-video-node";
    import TableEnhancePlugin from "./lexical/table/TableEnhancePlugin.svelte";

    interface Props {
        t: Record<string, string>;
        initialContent?: unknown;
        onChange?: (content: { json: unknown; html: string }) => void;
    }

    let { t, initialContent, onChange }: Props = $props();

    const parseInitialState = (content: unknown): string | undefined => {
        if (!content) return undefined;
        let parsed: unknown = content;
        if (typeof content === "string") {
            try {
                parsed = JSON.parse(content);
            } catch {
                return undefined;
            }
        }
        if (
            parsed &&
            typeof parsed === "object" &&
            "root" in parsed &&
            (parsed as { root?: { type?: string } }).root?.type
        ) {
            return typeof content === "string" ? content : JSON.stringify(content);
        }
        return undefined;
    };

    const initialConfig = {
        namespace: "ArticleEditor",
        theme,
        editorState: untrack(() => parseInitialState(initialContent)),
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
            console.error("Lexical editor error:", error);
        }
    };

    let composer: Composer;

    let prevContent = $state(untrack(() => initialContent));
    let skipNextSync = false;
    $effect(() => {
        if (!composer) return;
        if (initialContent !== prevContent) {
            prevContent = initialContent;
            if (skipNextSync) {
                skipNextSync = false;
                return;
            }
            setContent(initialContent);
        }
    });

    export function getContent(): { json: unknown; html: string } {
        if (!composer) return { json: {}, html: "" };
        const editor = composer.getEditor();
        let html = "";
        editor.read(() => {
            html = generateHtmlFromNodes(editor);
        });
        const json = editor.getEditorState().toJSON();
        return { json, html };
    }

    export function setContent(content: unknown) {
        if (!composer) return;
        const editor = composer.getEditor();
        const stateStr = parseInitialState(content);
        if (!stateStr) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            return;
        }
        try {
            const parsedState = editor.parseEditorState(stateStr);
            editor.setEditorState(parsedState);
        } catch (e) {
            console.error("Failed to parse editor state", e);
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        }
    }
</script>

<div class="w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-gray-300 bg-white">
    <Composer {initialConfig} bind:this={composer}>
        <EditorToolbar {t} />

        <div
            class="richtext-content svelte-lexical relative w-full max-w-full min-w-0 overflow-x-auto"
        >
            <ContentEditable
                className="min-h-75 w-full min-w-0 px-3.5 py-3 text-sm text-gray-900 outline-none"
            />
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
        <OnChangePlugin
            ignoreSelectionChange={true}
            ignoreHistoryMergeTagChange={true}
            onChange={(editorState, editor) => {
                if (!onChange) return;
                editorState.read(() => {
                    const html = generateHtmlFromNodes(editor);
                    const json = editorState.toJSON();
                    skipNextSync = true;
                    onChange({ json, html });
                });
            }}
        />
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
