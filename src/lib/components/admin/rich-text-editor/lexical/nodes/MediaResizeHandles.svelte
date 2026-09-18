<script lang="ts">
    interface Props {
        align: "left" | "center" | "right";
        onPointerDown: (event: PointerEvent) => void;
    }

    let { align, onPointerDown }: Props = $props();
</script>

{#if align === "center"}
    <button
        type="button"
        aria-label="Resize kiri"
        onpointerdown={onPointerDown}
        class="absolute top-1/2 -left-2 h-7 w-2.5 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
    ></button>
    <button
        type="button"
        aria-label="Resize kanan"
        onpointerdown={onPointerDown}
        class="absolute top-1/2 -right-2 h-7 w-2.5 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
    ></button>
{:else if align === "left"}
    <button
        type="button"
        aria-label="Resize kanan"
        onpointerdown={onPointerDown}
        class="absolute top-1/2 -right-2 h-7 w-2.5 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
    ></button>
{:else}
    <button
        type="button"
        aria-label="Resize kiri"
        onpointerdown={onPointerDown}
        class="absolute top-1/2 -left-2 h-7 w-2.5 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-theme-500 shadow"
    ></button>
{/if}
