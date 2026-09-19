<script lang="ts">
    import Icon from "@iconify/svelte";
    import { untrack } from "svelte";

    import type { AdminOptionItem } from "$lib/types/video-category";

    interface Props {
        t: Record<string, string>;
        categories: AdminOptionItem[];
        activeCategoryIds: string[];
        onApply: (categoryIds: string[]) => void;
        onReset: () => void;
    }

    let { t, categories, activeCategoryIds, onApply, onReset }: Props = $props();

    let isOpen = $state(false);
    let tempSelectedIds = $state<string[]>(untrack(() => [...activeCategoryIds]));
    let dropdownRef: HTMLDivElement | undefined = $state();

    const toggleDropdown = () => {
        if (!isOpen) tempSelectedIds = [...activeCategoryIds];
        isOpen = !isOpen;
    };

    const toggleCategory = (id: string) => {
        tempSelectedIds = tempSelectedIds.includes(id)
            ? tempSelectedIds.filter((catId) => catId !== id)
            : [...tempSelectedIds, id];
    };

    const applyFilter = () => {
        onApply(tempSelectedIds);
        isOpen = false;
    };

    const resetFilter = () => {
        tempSelectedIds = [];
        onReset();
        isOpen = false;
    };

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef && !dropdownRef.contains(event.target as Node)) isOpen = false;
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

<div class="relative" bind:this={dropdownRef}>
    <button
        type="button"
        onclick={toggleDropdown}
        class={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all ${isOpen || activeCategoryIds.length > 0 ? "border-theme-600 bg-theme-50/50 text-theme-700 ring-1 ring-theme-500/20" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
    >
        <Icon icon="lucide:sliders-horizontal" class="h-4 w-4 text-gray-600" />
        <span>Filter</span>
        {#if activeCategoryIds.length > 0}
            <span
                class="flex h-5 w-5 items-center justify-center rounded-full bg-theme-600 text-[11px] font-semibold text-white"
            >
                {activeCategoryIds.length}
            </span>
        {/if}
    </button>

    {#if isOpen}
        <div
            class="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white md:right-auto md:left-0"
        >
            <div class="px-4 py-2.5">
                <p class="text-xs font-semibold text-gray-900">{t.filterCategory}</p>
            </div>

            <div class="h-px bg-gray-100"></div>

            <div class="max-h-56 scrollbar-thin overflow-y-auto py-1.5">
                {#if categories.length === 0}
                    <div class="px-4 py-3 text-xs text-gray-400">{t.noCategoriesFound}</div>
                {:else}
                    {#each categories as category (category.id)}
                        {@const isChecked = tempSelectedIds.includes(category.id)}
                        <div
                            onclick={() => toggleCategory(category.id)}
                            onkeydown={(event) =>
                                event.key === "Enter" && toggleCategory(category.id)}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabindex="0"
                            class="flex cursor-pointer items-center gap-2.5 px-4 py-2 transition-colors select-none hover:bg-gray-50"
                        >
                            <div
                                class={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm transition-all ${isChecked ? "border border-theme-600 bg-theme-600 text-white" : "border-[1.5px] border-gray-300 bg-white hover:border-gray-400"}`}
                            >
                                {#if isChecked}
                                    <Icon icon="lucide:check" class="h-3 w-3 stroke-3" />
                                {/if}
                            </div>
                            <span class="truncate text-[13px] text-gray-700">{category.name}</span>
                        </div>
                    {/each}
                {/if}
            </div>

            <div class="h-px bg-gray-100"></div>

            <div class="flex items-center justify-end gap-2 bg-gray-50/60 px-4 py-2.5">
                <button
                    type="button"
                    onclick={resetFilter}
                    class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onclick={applyFilter}
                    class="cursor-pointer rounded-md bg-theme-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-theme-700"
                >
                    {t.apply}
                </button>
            </div>
        </div>
    {/if}
</div>
