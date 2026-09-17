<script lang="ts">
    import { getContext } from "svelte";
    import { $generateHtmlFromNodes as generateHtml } from "@lexical/html";
    import type { LexicalEditor } from "lexical";
    import ToolbarButton from "./ToolbarButton.svelte";

    const editor = getContext<LexicalEditor | undefined>("lexical-editor");

    function logJsonState() {
        if (!editor) {
            console.warn("Editor not ready");
            return;
        }

        editor.getEditorState().read(() => {
            const json = editor.getEditorState().toJSON();
            console.log("📄 Editor JSON State:", json);
        });
    }

    function logHtmlState() {
        if (!editor) {
            console.warn("Editor not ready");
            return;
        }

        editor.getEditorState().read(() => {
            const html = generateHtml(editor);
            console.log("🌐 Editor HTML Output:", html);
        });
    }

    function logBoth() {
        logJsonState();
        logHtmlState();
    }
</script>

<div class="flex gap-2 border-l border-gray-300 pl-2">
    <ToolbarButton onclick={logJsonState} title="Log JSON State">
        <span>📄 JSON</span>
    </ToolbarButton>
    <ToolbarButton onclick={logHtmlState} title="Log HTML Output">
        <span>🌐 HTML</span>
    </ToolbarButton>
    <ToolbarButton onclick={logBoth} title="Log Both JSON and HTML">
        <span>🔀 Both</span>
    </ToolbarButton>
</div>
