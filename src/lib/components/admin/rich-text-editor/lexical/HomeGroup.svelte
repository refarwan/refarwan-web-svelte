<script lang="ts">
    import {
        BoldIcon,
        ItalicIcon,
        ListIcon,
        ListOrderedIcon,
        QuoteIcon,
        StrikethroughIcon,
        UnderlineIcon
    } from "lucide-svelte/icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    import {
        formatBulletList,
        formatNumberedList,
        formatQuote,
        getActiveEditor,
        toggleBold,
        toggleItalic,
        toggleStrikethrough,
        toggleUnderline
    } from "svelte-lexical";

    import AlignButtons from "./AlignButtons.svelte";
    import ColorPickerButton from "./ColorPickerButton.svelte";
    import LinkButton from "./LinkButton.svelte";
    import TextTypeSelect from "./TextTypeSelect.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    const isBold = getContext<Writable<boolean>>("isBold");
    const isItalic = getContext<Writable<boolean>>("isItalic");
    const isUnderline = getContext<Writable<boolean>>("isUnderline");
    const isStrikethrough = getContext<Writable<boolean>>("isStrikethrough");
    const blockType = getContext<Writable<string>>("blockType");
</script>

<TextTypeSelect {t} />

<ToolbarButton title={t.bold} isActive={$isBold} onclick={() => toggleBold($activeEditor)}>
    <BoldIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<ToolbarButton title={t.italic} isActive={$isItalic} onclick={() => toggleItalic($activeEditor)}>
    <ItalicIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<ToolbarButton
    title={t.underline}
    isActive={$isUnderline}
    onclick={() => toggleUnderline($activeEditor)}
>
    <UnderlineIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<ToolbarButton
    title={t.strikethrough}
    isActive={$isStrikethrough}
    onclick={() => toggleStrikethrough($activeEditor)}
>
    <StrikethroughIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<ColorPickerButton {t} />

<div class="mx-1 h-5 w-px bg-gray-300"></div>

<AlignButtons {t} />

<div class="mx-1 h-5 w-px bg-gray-300"></div>

<ToolbarButton
    title={t.numberedList}
    isActive={$blockType === "number"}
    onclick={() => formatNumberedList($activeEditor, $blockType)}
>
    <ListOrderedIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<ToolbarButton
    title={t.bulletedList}
    isActive={$blockType === "bullet"}
    onclick={() => formatBulletList($activeEditor, $blockType)}
>
    <ListIcon size={14} strokeWidth={2.5} />
</ToolbarButton>

<div class="mx-1 h-5 w-px bg-gray-300"></div>

<ToolbarButton
    title={t.blockQuote}
    isActive={$blockType === "quote"}
    onclick={() => formatQuote($activeEditor, $blockType)}
>
    <QuoteIcon size={14} strokeWidth={2.5} />
</ToolbarButton>
<LinkButton {t} />
