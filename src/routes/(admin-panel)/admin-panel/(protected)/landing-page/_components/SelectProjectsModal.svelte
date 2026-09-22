<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { authorizedHttp } from "../../../../api/authorized-http";

    import type { ListResponse } from "$lib/types/api-response";
    import type { FeaturedProjectSummary } from "$lib/types/landing-page";
    import type { ProjectItem } from "$lib/types/project";
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        selectedProjectIds: string[];
        onToggleProject: (project: FeaturedProjectSummary) => void;
        onClose: () => void;
        t: LandingPageAdminTranslation;
    }

    let { selectedProjectIds, onToggleProject, onClose, t }: Props = $props();

    let loading = $state(true);
    let projects = $state<ProjectItem[]>([]);
    let searchQuery = $state("");

    onMount(() => {
        void fetchProjects();
    });

    const fetchProjects = async () => {
        loading = true;
        try {
            const res = await authorizedHttp.get<ListResponse<ProjectItem[]>>("/project?limit=100");
            projects = res.data.data || [];
        } catch {
            projects = [];
        } finally {
            loading = false;
        }
    };

    const filteredProjects = $derived(
        projects.filter((p) => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            const titleMatch = (p.title ?? "").toLowerCase().includes(query);
            const categoryMatch = (p.category ?? "").toLowerCase().includes(query);
            return titleMatch || categoryMatch;
        })
    );

    const isSelected = (id: string) => selectedProjectIds.includes(id);

    const handleToggle = (project: ProjectItem) => {
        const summary: FeaturedProjectSummary = {
            id: project.id,
            title: project.title,
            slug: project.slug,
            category: project.category,
            thumbnailUrl:
                project.thumbnail?.medium ||
                project.thumbnail?.small ||
                project.thumbnail?.large ||
                null
        };
        onToggleProject(summary);
    };
</script>

<div class="relative w-full max-w-xl rounded-xl border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
            <h3 class="text-base font-semibold text-gray-900">{t.selectProjectsModalTitle}</h3>
            <p class="mt-0.5 text-xs text-gray-500">{t.selectProjectsModalDescription}</p>
        </div>
        <button
            type="button"
            onclick={onClose}
            aria-label="Close"
            class="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
            <Icon icon="lucide:x" class="h-4 w-4" />
        </button>
    </div>

    <div class="border-b border-gray-100 px-6 py-3">
        <div class="relative">
            <Icon
                icon="lucide:search"
                class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder={t.searchProjectsPlaceholder}
                class="w-full rounded-md border border-gray-300 py-2 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
    </div>

    <div class="max-h-96 overflow-y-auto px-6 py-4">
        {#if loading}
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                <Icon icon="lucide:loader-2" class="h-7 w-7 animate-spin text-theme-600" />
                <span class="mt-2 text-xs">Loading projects...</span>
            </div>
        {:else if filteredProjects.length === 0}
            <div class="py-12 text-center text-sm text-gray-400">
                {t.noProjectsFound}
            </div>
        {:else}
            <div class="flex flex-col gap-2.5">
                {#each filteredProjects as project (project.id)}
                    {@const selected = isSelected(project.id)}
                    <div
                        class={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-all ${
                            selected
                                ? "border-theme-300 bg-theme-50/40"
                                : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                        <div class="flex min-w-0 items-center gap-3">
                            <div
                                class="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-100"
                            >
                                {#if project.thumbnail?.small || project.thumbnail?.medium}
                                    <img
                                        src={project.thumbnail.small || project.thumbnail.medium}
                                        alt={project.title ?? ""}
                                        class="h-full w-full object-cover"
                                    />
                                {:else}
                                    <div
                                        class="flex h-full w-full items-center justify-center text-gray-400"
                                    >
                                        <Icon icon="lucide:image" class="h-5 w-5" />
                                    </div>
                                {/if}
                            </div>
                            <div class="min-w-0 flex-1">
                                <h4 class="truncate text-sm font-semibold text-gray-900">
                                    {project.title || "Untitled"}
                                </h4>
                                <p class="truncate text-xs text-gray-500">
                                    {project.category || "Uncategorized"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onclick={() => handleToggle(project)}
                            class={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                selected
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-theme-600 text-white hover:bg-theme-700"
                            }`}
                        >
                            {#if selected}
                                <Icon icon="lucide:check" class="h-3.5 w-3.5" />
                                <span>Selected</span>
                            {:else}
                                <Icon icon="lucide:plus" class="h-3.5 w-3.5" />
                                <span>Add</span>
                            {/if}
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <div class="flex justify-end rounded-b-xl border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-md bg-theme-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-theme-700"
        >
            Done
        </button>
    </div>
</div>
