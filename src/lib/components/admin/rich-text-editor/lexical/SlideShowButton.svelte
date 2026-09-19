<script lang="ts">
    import Icon from "@iconify/svelte";
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { getActiveEditor } from "svelte-lexical";
    import { popup } from "$lib/stores/popup.svelte";
    import { $createResizableSlideShowNode as createResizableSlideShowNode } from "./nodes/resizable-slideshow-node";
    import SelectSlideShowModal from "./SelectSlideShowModal.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    import type { SlideShowImage } from "./nodes/resizable-slideshow-node";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    let popupId = $state("");

    const openPopup = () => {
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: slideShowPopupSnippet });
    };

    const close = () => {
        popup.remove(popupId);
    };

    const handleSelect = (items: SlideShowImage[]) => {
        if (items.length > 0) {
            $activeEditor.update(() => {
                insertNodeToNearestRoot(
                    createResizableSlideShowNode({
                        items
                    })
                );
            });
        }
        close();
    };
</script>

<ToolbarButton title={t.slideShow} onclick={openPopup}>
    <Icon icon="lucide:presentation" width={14} height={14} />
</ToolbarButton>

{#snippet slideShowPopupSnippet()}
    <SelectSlideShowModal {t} onClose={close} onSelect={handleSelect} />
{/snippet}
