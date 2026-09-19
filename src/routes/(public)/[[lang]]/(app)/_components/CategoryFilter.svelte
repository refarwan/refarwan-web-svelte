<script lang="ts">
    import { resolve } from "$app/paths";

    import type { PublicArticleCategoryItem } from "$lib/types/article-category";
    import type { PublicVideoCategoryItem } from "$lib/types/video-category";

    interface Props {
        categories: (PublicVideoCategoryItem | PublicArticleCategoryItem)[];
        activeSlug: string;
        allLabel: string;
        buildHref: (slug: string) => string;
    }

    let { categories, activeSlug, allLabel, buildHref }: Props = $props();

    const pillClass = (isActive: boolean) =>
        isActive
            ? "bg-theme-600 text-white"
            : "border border-gray-200 bg-theme-50 text-theme-700 hover:border-theme-300 hover:bg-theme-100";
</script>

<div class="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1 md:gap-2.5">
    <a
        href={resolve(buildHref("all"))}
        class={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap md:py-2 ${pillClass(activeSlug === "all")}`}
    >
        {allLabel}
    </a>
    {#each categories as category (category.slug)}
        <a
            href={resolve(buildHref(category.slug))}
            class={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap md:py-2 ${pillClass(activeSlug === category.slug)}`}
        >
            {category.name}
        </a>
    {/each}
</div>
