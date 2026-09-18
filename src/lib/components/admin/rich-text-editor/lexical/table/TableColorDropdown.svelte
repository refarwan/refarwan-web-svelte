<script lang="ts">
    import { Ban, Check } from "lucide-svelte/icons";

    interface Props {
        t: Record<string, string>;
        currentColor: string | null;
        onSelectColor: (color: string | null, target: "cell" | "column") => void;
        onClose: () => void;
    }

    let { t, currentColor, onSelectColor, onClose }: Props = $props();

    let target = $state<"cell" | "column">("cell");

    const PRESET_COLORS: { label: string; value: string }[] = [
        { label: "Light Gray", value: "#f8fafc" },
        { label: "Slate Gray", value: "#f1f5f9" },
        { label: "Border Gray", value: "#e2e8f0" },
        { label: "Soft Blue", value: "#dbeafe" },
        { label: "Sky Blue", value: "#e0f2fe" },
        { label: "Soft Cyan", value: "#cffafe" },
        { label: "Soft Emerald", value: "#d1fae5" },
        { label: "Soft Green", value: "#dcfce7" },
        { label: "Soft Amber", value: "#fef3c7" },
        { label: "Soft Yellow", value: "#fef9c3" },
        { label: "Soft Orange", value: "#ffedd5" },
        { label: "Soft Rose", value: "#ffe4e6" },
        { label: "Soft Purple", value: "#f3e8ff" },
        { label: "Soft Indigo", value: "#e0e7ff" },
        { label: "Charcoal", value: "#334155" }
    ];

    const pickColor = (color: string | null) => {
        onSelectColor(color, target);
        onClose();
    };
</script>

<div
    class="w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl select-none"
    role="dialog"
    aria-label={t.tableCellColor}
>
    <!-- Scope Selector: Cell vs Column -->
    <div class="mb-2.5 flex rounded-lg bg-gray-100 p-0.5 text-xs font-medium">
        <button
            type="button"
            onclick={() => (target = "cell")}
            class={`flex-1 rounded-md py-1 text-center transition-colors ${
                target === "cell"
                    ? "bg-white font-semibold text-gray-800 shadow-2xs"
                    : "text-gray-500 hover:text-gray-700"
            }`}
        >
            {t.tableApplyCell || "Sel Ini"}
        </button>
        <button
            type="button"
            onclick={() => (target = "column")}
            class={`flex-1 rounded-md py-1 text-center transition-colors ${
                target === "column"
                    ? "bg-white font-semibold text-gray-800 shadow-2xs"
                    : "text-gray-500 hover:text-gray-700"
            }`}
        >
            {t.tableApplyColumn || "Satu Kolom"}
        </button>
    </div>

    <!-- Color Palette Grid -->
    <div class="grid grid-cols-4 gap-1.5">
        <!-- Clear / None Button -->
        <button
            type="button"
            title={t.tableColorNone || "Bening"}
            onclick={() => pickColor(null)}
            class="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
        >
            <Ban size={16} />
        </button>

        {#each PRESET_COLORS as item (item.value)}
            {@const isSelected = currentColor?.toLowerCase() === item.value.toLowerCase()}
            <button
                type="button"
                title={item.label}
                onclick={() => pickColor(item.value)}
                style={`background-color: ${item.value}`}
                class="relative flex size-10 items-center justify-center rounded-lg border border-gray-200/80 shadow-2xs transition hover:scale-105"
            >
                {#if isSelected}
                    <Check
                        size={14}
                        class={item.value === "#334155" ? "text-white" : "text-gray-800"}
                        strokeWidth={2.5}
                    />
                {/if}
            </button>
        {/each}
    </div>
</div>
