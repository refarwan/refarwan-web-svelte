<script lang="ts">
    import Icon from "@iconify/svelte";

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
        icon: string;
    }[] = $derived([
        {
            value: "left",
            label: t.tableAlignLeft || "Kiri",
            icon: "lucide:align-horizontal-justify-start"
        },
        {
            value: "center",
            label: t.tableAlignCenter || "Tengah",
            icon: "lucide:align-horizontal-justify-center"
        },
        {
            value: "right",
            label: t.tableAlignRight || "Kanan",
            icon: "lucide:align-horizontal-justify-end"
        }
    ]);
</script>

<div class="flex w-44 flex-col rounded-xl border border-gray-200 bg-white p-1 text-xs">
    {#each options as option (option.value)}
        <button
            type="button"
            onclick={() => onSelect(option.value)}
            class={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-medium transition ${current === option.value ? "bg-theme-50 text-theme-700" : "text-gray-700 hover:bg-gray-50"}`}
        >
            <Icon icon={option.icon} class="h-3.5 w-3.5 shrink-0" />
            <span class="flex-1">{option.label}</span>
            {#if current === option.value}
                <Icon icon="lucide:check" class="h-3.5 w-3.5 shrink-0" />
            {/if}
        </button>
    {/each}
</div>
