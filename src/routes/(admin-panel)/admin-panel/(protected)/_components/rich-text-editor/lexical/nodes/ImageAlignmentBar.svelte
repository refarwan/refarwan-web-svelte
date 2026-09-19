<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { ImageAlign } from "./resizable-image-node";

    interface Props {
        align: ImageAlign;
        onSetAlign: (align: ImageAlign) => void;
    }

    let { align, onSetAlign }: Props = $props();
</script>

<div
    class="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-white p-0.5"
>
    <button
        type="button"
        aria-label="Rata Kiri"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("left");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${align === "left" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"}`}
    >
        <Icon icon="lucide:align-left" width={13} height={13} />
    </button>
    <button
        type="button"
        aria-label="Rata Tengah"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("center");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${align === "center" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"}`}
    >
        <Icon icon="lucide:align-center" width={13} height={13} />
    </button>
    <button
        type="button"
        aria-label="Rata Kanan"
        onclick={(e) => {
            e.stopPropagation();
            onSetAlign("right");
        }}
        class={`flex h-6 w-6 cursor-pointer items-center justify-center rounded ${align === "right" ? "bg-theme-100 text-theme-700" : "text-gray-500 hover:bg-gray-100"}`}
    >
        <Icon icon="lucide:align-right" width={13} height={13} />
    </button>
</div>
