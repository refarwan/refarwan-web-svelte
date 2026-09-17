<script lang="ts">
    import { ChevronDownIcon } from "lucide-svelte/icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

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

    const onChange = (event: Event) => {
        const nextValue = (event.target as HTMLSelectElement).value;
        if (nextValue === "paragraph") {
            formatParagraph($activeEditor);
        } else {
            formatHeading($activeEditor, $blockType, nextValue as "h1" | "h2" | "h3");
        }
    };
</script>

<div class="relative h-7.5 w-32 rounded-sm border border-gray-300 bg-white">
    <ChevronDownIcon
        size={16}
        class="pointer-events-none absolute top-2 right-1.25 text-gray-400"
    />
    <select
        {value}
        onchange={onChange}
        class="relative h-7 w-full cursor-pointer appearance-none bg-transparent px-2.5 text-sm outline-none"
    >
        <option value="paragraph">{t.textTypeParagraph}</option>
        <option value="h1">{t.textTypeHeading1}</option>
        <option value="h2">{t.textTypeHeading2}</option>
        <option value="h3">{t.textTypeHeading3}</option>
    </select>
</div>
