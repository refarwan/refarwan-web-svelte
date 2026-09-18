<script lang="ts">
    import { $patchStyleText as patchStyleText } from "@lexical/selection";
    import { $getSelection as getSelection } from "lexical";
    import { CaseUpperIcon } from "lucide-svelte/icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    import { getActiveEditor } from "svelte-lexical";

    import { popup } from "$lib/stores/popup.svelte";

    import ColorPickerCard from "../../../../../routes/admin-panel/(protected)/_components/ColorPickerCard.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    const fontColor = getContext<Writable<string>>("fontColor");

    const applyColor = (color: string | null) => {
        $activeEditor.update(() => {
            const selection = getSelection();
            if (selection) patchStyleText(selection, { color });
        });
    };

    let popupId = $state("");

    const openColorPicker = () => {
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: colorPickerSnippet });
    };

    const close = () => popup.remove(popupId);
</script>

<button
    type="button"
    onclick={(event) => {
        event.preventDefault();
        openColorPicker();
    }}
    class="flex h-7.5 w-7.5 cursor-pointer flex-col items-center justify-center rounded-sm text-gray-500 transition-colors hover:bg-gray-200"
    title={t.textColor}
    aria-label={t.textColor}
>
    <CaseUpperIcon size={16} strokeWidth={2.5} />
    <div class="h-1 w-5 rounded-md" style={`background-color: ${$fontColor}`}></div>
</button>

{#snippet colorPickerSnippet()}
    <ColorPickerCard
        initialColor={$fontColor && $fontColor !== "#000" ? $fontColor : "#111827"}
        onClose={close}
        onSelectColor={applyColor}
        title={t.colorModalTitle}
        cancelLabel={t.colorCancel}
        applyLabel={t.colorApply}
        clearLabel={t.colorDefault}
    />
{/snippet}
