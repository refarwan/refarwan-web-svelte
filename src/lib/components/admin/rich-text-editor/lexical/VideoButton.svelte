<script lang="ts">
    import { $insertNodeToNearestRoot as insertNodeToNearestRoot } from "@lexical/utils";
    import { VideoIcon } from "lucide-svelte/icons";

    import { getActiveEditor } from "svelte-lexical";

    import { popup } from "$lib/stores/popup.svelte";

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
    <VideoIcon size={14} strokeWidth={2.5} />
</ToolbarButton>

{#snippet videoPopupSnippet()}
    <SelectVideoModal {t} onClose={close} onSelect={handleSelect} />
{/snippet}
