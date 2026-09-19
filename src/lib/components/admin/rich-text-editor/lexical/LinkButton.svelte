<script lang="ts">
    import Icon from "@iconify/svelte";
    import { $isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
    import { $findMatchingParent as findMatchingParent } from "@lexical/utils";
    import { $getSelection as getSelection, $isRangeSelection as isRangeSelection } from "lexical";
    import { getContext } from "svelte";
    import { getActiveEditor, sanitizeUrl } from "svelte-lexical";
    import { popup } from "$lib/stores/popup.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    import type { Writable } from "svelte/store";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    const isLink = getContext<Writable<boolean>>("isLink");

    const getCurrentUrl = (): string => {
        let url = "";
        $activeEditor.getEditorState().read(() => {
            const selection = getSelection();
            if (!isRangeSelection(selection)) return;
            const node = selection.anchor.getNode();
            const linkNode = findMatchingParent(node, isLinkNode);
            if (linkNode) url = linkNode.getURL();
        });
        return url;
    };

    let popupId = $state("");
    let url = $state("");
    let openNewTab = $state(false);

    const openLinkPopup = () => {
        url = getCurrentUrl();
        openNewTab = false;
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: linkPopupSnippet });
    };

    const close = () => popup.remove(popupId);

    const removeLink = () => {
        $activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        close();
    };

    const saveLink = () => {
        const trimmed = url.trim();
        if (!trimmed) {
            removeLink();
            return;
        }
        $activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: sanitizeUrl(trimmed),
            target: openNewTab ? "_blank" : undefined
        });
        close();
    };
</script>

<ToolbarButton title={t.link} isActive={$isLink} onclick={openLinkPopup}>
    <Icon icon="lucide:link" width={14} height={14} />
</ToolbarButton>

{#snippet linkPopupSnippet()}
    <div class="w-80 rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="mb-4 text-sm font-semibold text-gray-700">{t.linkModalTitle}</h3>
        <input
            type="text"
            bind:value={url}
            placeholder={t.linkUrlPlaceholder}
            onkeyup={(event) => event.key === "Enter" && saveLink()}
            class="mb-4 block h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none focus:border-theme-500 focus:ring-1 focus:ring-theme-500"
        />
        <label
            class="mb-4 flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 select-none"
        >
            <input
                type="checkbox"
                bind:checked={openNewTab}
                class="h-4 w-4 cursor-pointer rounded border-gray-300 text-theme-600 focus:ring-theme-500"
            />
            <span>{t.linkOpenNewTab}</span>
        </label>
        <div class="flex justify-end gap-2">
            <button
                type="button"
                onclick={close}
                class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
                {t.linkCancel}
            </button>
            <button
                type="button"
                onclick={saveLink}
                class="cursor-pointer rounded-lg bg-theme-600 px-4 py-2 text-sm font-medium text-white hover:bg-theme-700"
            >
                {t.linkSave}
            </button>
        </div>
    </div>
{/snippet}
