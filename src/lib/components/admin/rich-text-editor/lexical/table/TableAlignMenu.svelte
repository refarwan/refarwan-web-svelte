<script lang="ts">
    import {
        AlignHorizontalJustifyCenter,
        AlignHorizontalJustifyEnd,
        AlignHorizontalJustifyStart,
        Check
    } from "lucide-svelte/icons";

    import type { TableAlignment } from "./table-commands";

    interface Props {
        current: TableAlignment;
        onSelect: (alignment: TableAlignment) => void;
        t: Record<string, string>;
    }

    let { current, onSelect, t }: Props = $props();

    const options: {
        value: TableAlignment;
        label: string;
        icon: typeof AlignHorizontalJustifyStart;
    }[] = $derived([
        {
            value: "left",
            label: t.tableAlignLeft || "Kiri",
            icon: AlignHorizontalJustifyStart
        },
        {
            value: "center",
            label: t.tableAlignCenter || "Tengah",
            icon: AlignHorizontalJustifyCenter
        },
        {
            value: "right",
            label: t.tableAlignRight || "Kanan",
            icon: AlignHorizontalJustifyEnd
        }
    ]);
</script>

<div class="flex w-44 flex-col rounded-xl border border-gray-200 bg-white p-1 text-xs shadow-xl">
    {#each options as option (option.value)}
        <button
            type="button"
            onclick={() => onSelect(option.value)}
            class={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-medium transition ${
                current === option.value
                    ? "bg-theme-50 text-theme-700"
                    : "text-gray-700 hover:bg-gray-50"
            }`}
        >
            <option.icon size={14} class="shrink-0" />
            <span class="flex-1">{option.label}</span>
            {#if current === option.value}
                <Check size={14} class="shrink-0" />
            {/if}
        </button>
    {/each}
</div>
