<script lang="ts">
    import { resolve } from "$app/paths";

    import type { ResolvedPathname } from "$app/types";

    interface Props {
        categoryName?: string | null;
        categorySlug?: string | null;
        basePath: string;
    }

    let { categoryName, categorySlug, basePath }: Props = $props();

    const categoryHref: ResolvedPathname = $derived(
        resolve(categorySlug ? `${basePath}?category=${categorySlug}` : basePath)
    );
</script>

{#if categoryName}
    <div class="mt-4">
        <div class="flex flex-wrap items-center gap-2">
            <a
                href={categoryHref}
                class="rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
            >
                {categoryName}
            </a>
        </div>
    </div>
{/if}
