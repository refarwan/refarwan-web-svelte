<script lang="ts">
    import { RichTextComposer } from "svelte-lexical";
    import { theme } from "svelte-lexical/dist/themes/default";
</script>

<div class="richtext-editor">
    <RichTextComposer {theme} />
</div>

<style>
    .richtext-editor :global(.editor-shell) {
        margin: 0;
        max-width: none;
    }
</style>
