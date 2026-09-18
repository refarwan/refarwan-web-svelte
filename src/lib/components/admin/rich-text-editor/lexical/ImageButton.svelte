<script lang="ts">
    import { ImageIcon } from "lucide-svelte/icons";

    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { getActiveEditor } from "svelte-lexical";

    import { popup } from "$lib/stores/popup.svelte";

    import { $createResizableImageNode as createResizableImageNode } from "./nodes/resizable-image-node";
    import SelectImageModal from "./SelectImageModal.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    import type { ImageLibraryItem } from "$lib/types";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    let popupId = $state("");

    const openPopup = () => {
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: imagePopupSnippet });
    };

    const close = () => {
        popup.remove(popupId);
    };

    const handleSelect = (item: ImageLibraryItem) => {
        const largeUrl = item.source.large || item.source.medium || item.source.small;
        if (largeUrl) {
            $activeEditor.update(() => {
                insertNodeToNearestRoot(
                    createResizableImageNode({
                        src: largeUrl,
                        altText: item.id || "Article image"
                    })
                );
            });
        }
        close();
    };
</script>

<ToolbarButton title={t.image} onclick={openPopup}>
    <ImageIcon size={14} strokeWidth={2.5} />
</ToolbarButton>

{#snippet imagePopupSnippet()}
    <SelectImageModal {t} onClose={close} onSelect={handleSelect} />
{/snippet}
