<script lang="ts">
    import Icon from "@iconify/svelte";
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { getActiveEditor } from "svelte-lexical";
    import { popup } from "../../../../../stores/popup.svelte";
    import { $createResizableVideoNode as createResizableVideoNode } from "./nodes/resizable-video-node";
    import SelectVideoModal from "./SelectVideoModal.svelte";
    import ToolbarButton from "./ToolbarButton.svelte";

    interface Props {
        t: Record<string, string>;
    }

    let { t }: Props = $props();

    const activeEditor = getActiveEditor();
    let popupId = $state("");

    const openPopup = () => {
        popupId = popup.generateId();
        popup.custom({ id: popupId, component: videoPopupSnippet });
    };

    const close = () => {
        popup.remove(popupId);
    };

    const handleSelect = (embedUrl: string, title: string) => {
        if (embedUrl) {
            $activeEditor.update(() => {
                insertNodeToNearestRoot(
                    createResizableVideoNode({
                        src: embedUrl,
                        title: title || "Video"
                    })
                );
            });
        }
        close();
    };
</script>

<ToolbarButton title={t.video} onclick={openPopup}>
    <Icon icon="lucide:video" width={14} height={14} />
</ToolbarButton>

{#snippet videoPopupSnippet()}
    <SelectVideoModal {t} onClose={close} onSelect={handleSelect} />
{/snippet}
