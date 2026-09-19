<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";
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

    import type { Writable } from "svelte/store";

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
    <Icon icon="lucide:bold" width={14} height={14} />
</ToolbarButton>
<ToolbarButton title={t.italic} isActive={$isItalic} onclick={() => toggleItalic($activeEditor)}>
    <Icon icon="lucide:italic" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.underline}
    isActive={$isUnderline}
    onclick={() => toggleUnderline($activeEditor)}
>
    <Icon icon="lucide:underline" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.strikethrough}
    isActive={$isStrikethrough}
    onclick={() => toggleStrikethrough($activeEditor)}
>
    <Icon icon="lucide:strikethrough" width={14} height={14} />
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
    <Icon icon="lucide:list-ordered" width={14} height={14} />
</ToolbarButton>
<ToolbarButton
    title={t.bulletedList}
    isActive={$blockType === "bullet"}
    onclick={() => formatBulletList($activeEditor, $blockType)}
>
    <Icon icon="lucide:list" width={14} height={14} />
</ToolbarButton>

<div class="mx-1 h-5 w-px bg-gray-300"></div>

<ToolbarButton
    title={t.blockQuote}
    isActive={$blockType === "quote"}
    onclick={() => formatQuote($activeEditor, $blockType)}
>
    <Icon icon="lucide:quote" width={14} height={14} />
</ToolbarButton>
<LinkButton {t} />
