<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { formatArticleDate } from "$lib/utils/format-date";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicProjectItem } from "$lib/types/project";

    interface Props {
        project: PublicProjectItem;
        basePath: string;
        viewProjectLabel: string;
        lang: string;
        priority?: boolean;
    }

    let { project, basePath, viewProjectLabel, lang, priority = false }: Props = $props();

    const projectHref: ResolvedPathname = $derived(resolve(`${basePath}/${project.slug}`));
    const formattedDate = $derived(formatArticleDate(project.createdAt, lang));
    const imageUrl = $derived(
        project.thumbnail?.large || project.thumbnail?.medium || project.thumbnail?.small || ""
    );
</script>

<article
    class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300"
>
    <a href={projectHref} class="relative block aspect-video w-full overflow-hidden bg-gray-100">
        {#if imageUrl}
            <img
                src={imageUrl}
                alt={project.title ?? ""}
                loading={priority ? "eager" : "lazy"}
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        {:else}
            <div
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-xs font-medium text-gray-400"
            >
                No Image
            </div>
        {/if}

        {#if project.category}
            <div class="absolute top-3 right-3">
                <span
                    class="inline-block rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-theme-700 backdrop-blur-xs"
                >
                    {project.category}
                </span>
            </div>
        {/if}
    </a>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
        <div class="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
            <Icon icon="lucide:calendar" class="h-3.5 w-3.5 shrink-0" />
            <span>{formattedDate}</span>
        </div>

        <h2
            class="mb-2.5 line-clamp-2 text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-theme-600 sm:text-xl"
        >
            <a href={projectHref} class="hover:underline">
                {project.title ?? "Untitled"}
            </a>
        </h2>

        {#if project.shortDescription}
            <p class="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {project.shortDescription}
            </p>
        {/if}

        {#if project.techIcons.length > 0}
            <div class="mb-5 flex flex-wrap gap-1.5">
                {#each project.techIcons.slice(0, 6) as icon (icon)}
                    <span
                        class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-100 bg-gray-50"
                        title={icon.split(":")[1] ?? icon}
                    >
                        <Icon {icon} class="h-4 w-4" />
                    </span>
                {/each}
            </div>
        {/if}

        <div class="mt-auto pt-2">
            <a
                href={projectHref}
                class="inline-flex items-center gap-1.5 text-sm font-semibold text-theme-600 transition-all hover:gap-2.5 hover:text-theme-700"
            >
                <span>{viewProjectLabel}</span>
                <Icon icon="lucide:arrow-right" class="h-4 w-4" />
            </a>
        </div>
    </div>
</article>
