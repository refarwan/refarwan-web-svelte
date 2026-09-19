<script lang="ts">
    import type { ResolvedPathname } from "$app/types";

    interface Props {
        homeHref: ResolvedPathname;
        homeLabel: string;
        categoryHref: ResolvedPathname;
        categoryName: string;
        articleTitle: string;
    }

    let { homeHref, homeLabel, categoryHref, categoryName, articleTitle }: Props = $props();
</script>

<nav
    aria-label="Breadcrumb"
    class="flex items-center overflow-hidden text-xs text-gray-500 sm:text-sm"
>
    <a href={homeHref} class="shrink-0 transition-colors hover:text-theme-600">
        {homeLabel}
    </a>
    <span class="mx-2 shrink-0 text-gray-300">/</span>
    <a
        href={categoryHref}
        class="shrink-0 font-medium text-gray-700 transition-colors hover:text-theme-600"
    >
        {categoryName}
    </a>
    <span class="mx-2 shrink-0 text-gray-300">/</span>
    <span class="truncate text-gray-400" aria-current="page">
        {articleTitle}
    </span>
</nav>
