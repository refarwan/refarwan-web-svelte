<script lang="ts">
    import { $patchStyleText as patchStyleText } from "@lexical/selection";
    import { $getSelection as getSelection } from "lexical";
    import { CaseUpperIcon } from "lucide-svelte/icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    import { getActiveEditor } from "svelte-lexical";

    import { popup } from "$lib/stores/popup.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    const fontColor = getContext<Writable<string>>("fontColor");

    const presetColors = [
        "#111827",
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#22c55e",
        "#0ea5e9",
        "#3b82f6",
        "#6366f1",
        "#a855f7",
        "#ec4899"
    ];

    const applyColor = (color: string | null) => {
        $activeEditor.update(() => {
            const selection = getSelection();
            if (selection) patchStyleText(selection, { color });
        });
    };

    let popupId = $state("");
    let tempColor = $state("#111827");

    const openColorPicker = () => {
        tempColor = $fontColor && $fontColor !== "#000" ? $fontColor : "#111827";
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
    <div class="flex w-64 flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <h3 class="text-sm font-semibold text-gray-700">{t.colorModalTitle}</h3>

        <div class="grid grid-cols-5 gap-2">
            {#each presetColors as color (color)}
                <button
                    type="button"
                    onclick={() => (tempColor = color)}
                    class={`h-7 w-7 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
                        tempColor === color ? "border-theme-500" : "border-transparent"
                    }`}
                    style={`background-color: ${color}`}
                    aria-label={color}
                ></button>
            {/each}
        </div>

        <input
            type="text"
            bind:value={tempColor}
            placeholder="#000000"
            class="w-full rounded border border-gray-300 bg-transparent px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-theme-500"
        />

        <button
            type="button"
            onclick={() => {
                applyColor(null);
                close();
            }}
            class="w-full cursor-pointer rounded border border-gray-300 py-1 text-center text-xs text-gray-700 transition-colors hover:underline"
        >
            {t.colorDefault}
        </button>

        <div class="flex justify-end gap-2">
            <button
                type="button"
                onclick={close}
                class="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
                {t.colorCancel}
            </button>
            <button
                type="button"
                onclick={() => {
                    applyColor(tempColor);
                    close();
                }}
                class="cursor-pointer rounded-lg bg-theme-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-theme-700"
            >
                {t.colorApply}
            </button>
        </div>
    </div>
{/snippet}
