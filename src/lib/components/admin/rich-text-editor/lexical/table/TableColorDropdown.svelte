<script lang="ts">
    import ColorPickerCard from "../../../../../../routes/admin-panel/(protected)/_components/ColorPickerCard.svelte";

    interface Props {
        t: Record<string, string>;
        currentColor: string | null;
        onSelectColor: (color: string | null, target: "cell" | "column") => void;
        onClose: () => void;
    }

    let { t, currentColor, onSelectColor, onClose }: Props = $props();

    let target = $state<"cell" | "column">("cell");

    const pickColor = (color: string | null) => {
        onSelectColor(color, target);
    };
</script>

<ColorPickerCard
    initialColor={currentColor ?? "#f8fafc"}
    {onClose}
    onSelectColor={pickColor}
    title={t.tableCellColor}
    cancelLabel={t.colorCancel}
    applyLabel={t.colorApply}
    clearLabel={t.tableColorNone || "Bening"}
>
    {#snippet extraContent()}
        <!-- Scope Selector: Cell vs Column -->
        <div class="flex rounded-lg bg-gray-100 p-0.5 text-xs font-medium">
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
    {/snippet}
</ColorPickerCard>
