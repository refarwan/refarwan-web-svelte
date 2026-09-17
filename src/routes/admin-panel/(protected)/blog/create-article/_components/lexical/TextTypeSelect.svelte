<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";

    import { formatHeading, formatParagraph, getActiveEditor } from "svelte-lexical";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    const blockType = getContext<Writable<string>>("blockType");

    const headingSizes = ["h1", "h2", "h3"] as const;
    const value = $derived(
        headingSizes.includes($blockType as (typeof headingSizes)[number])
            ? $blockType
            : "paragraph"
    );

    const options = $derived([
        { value: "paragraph", label: t.textTypeParagraph },
        { value: "h1", label: t.textTypeHeading1 },
        { value: "h2", label: t.textTypeHeading2 },
        { value: "h3", label: t.textTypeHeading3 }
    ]);

    const onChange = (nextValue: string) => {
        if (nextValue === "paragraph") {
            formatParagraph($activeEditor);
        } else {
            formatHeading($activeEditor, $blockType, nextValue as "h1" | "h2" | "h3");
        }
    };
</script>

<div class="w-40">
    <DropdownSelect {value} {options} {onChange} />
</div>
