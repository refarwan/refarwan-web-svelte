<script lang="ts">
    import { TextAlignCenterIcon, TextAlignStartIcon, TextAlignEndIcon } from "lucide-svelte/icons";

    import type { ImageAlign } from "./resizable-image-node";

    interface Props {
        align: ImageAlign;
        onSetAlign: (align: ImageAlign) => void;
    }

    let { align, onSetAlign }: Props = $props();
</script>

<div
    class="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5 shadow-md"
>
    <button
        type="button"
        aria-label="Rata Kiri"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("left");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
            align === "left" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"
        }`}
    >
        <TextAlignStartIcon size={13} strokeWidth={2.5} />
    </button>
    <button
        type="button"
        aria-label="Rata Tengah"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("center");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
            align === "center" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"
        }`}
    >
        <TextAlignCenterIcon size={13} strokeWidth={2.5} />
    </button>
    <button
        type="button"
        aria-label="Rata Kanan"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("right");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${
            align === "right" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"
        }`}
    >
        <TextAlignEndIcon size={13} strokeWidth={2.5} />
    </button>
</div>
