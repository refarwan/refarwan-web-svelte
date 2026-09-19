<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import CategoryFilterDropdown from "./CategoryFilterDropdown.svelte";

    import type { AdminOptionItem } from "$lib/types/video-category";

    interface Props {
        t: Record<string, string>;
        categories: AdminOptionItem[];
        categoryIds: string[];
        search: string;
        onSearchChange: (value: string) => void;
        onApplyCategory: (ids: string[]) => void;
        onResetCategory: () => void;
    }

    let {
        t,
        categories,
        categoryIds,
        search,
        onSearchChange,
        onApplyCategory,
        onResetCategory
    }: Props = $props();

    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const val = target.value;
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            onSearchChange(val);
        }, 350);
    };
</script>

<div class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4">
    <div class="flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 sm:w-72 md:w-80">
            <Icon
                icon="lucide:search"
                class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                value={search}
                oninput={handleInput}
                placeholder={t.searchPlaceholder}
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>

        <CategoryFilterDropdown
            {t}
            {categories}
            activeCategoryIds={categoryIds}
            onApply={onApplyCategory}
            onReset={onResetCategory}
        />
    </div>

    <div class="flex flex-wrap items-center gap-2.5">
        <a
            href={resolve("/admin-panel/watch/upload")}
            class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
        >
            <Icon icon="lucide:plus" class="h-4 w-4" />
            <span>{t.addVideo}</span>
        </a>
    </div>
</div>
