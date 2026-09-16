<script lang="ts">
    import type { ThemeShades } from "$lib/types";

    interface Props {
        t: Record<string, string>;
        themeShades: ThemeShades;
        isThemeChanged: boolean;
        selectedColor: string;
        resetting: boolean;
        onOpenColorPicker: () => void;
        onResetTheme: () => void;
    }

    let {
        t,
        themeShades,
        isThemeChanged,
        selectedColor,
        resetting,
        onOpenColorPicker,
        onResetTheme
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-base font-semibold text-gray-900">{t.themeTitle}</h2>
            <p class="text-[13px] text-gray-500">{t.themeDescription}</p>
        </div>
        <div class="flex items-center gap-2">
            <button
                type="button"
                disabled={resetting}
                onclick={onResetTheme}
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                {resetting ? t.saving : t.resetDefault}
            </button>
            <button
                type="button"
                onclick={onOpenColorPicker}
                class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-theme-600 px-3 py-1.5 text-sm font-medium text-theme-600 transition-colors hover:bg-theme-50"
            >
                <span
                    class="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
                    style="background: conic-gradient(from 90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
                ></span>
                <span>{t.pickColor}</span>
            </button>
        </div>
    </div>
    <input type="hidden" name="colorCode" value={isThemeChanged ? selectedColor : ""} />
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-wrap gap-3">
        {#each Object.entries(themeShades) as [shade, hex] (shade)}
            <div class="flex flex-col items-center gap-1">
                <div
                    class="h-10 w-10 rounded-lg border border-gray-200"
                    style={`background:${hex}`}
                ></div>
                <span class="text-xs text-gray-500">{shade}</span>
            </div>
        {/each}
    </div>
</section>
