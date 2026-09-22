<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { FeaturedProjectSummary } from "$lib/types/landing-page";
    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        title: string;
        subtitle: string;
        visitText: string;
        featuredProjects: FeaturedProjectSummary[];
        onTitleChange: (val: string) => void;
        onSubtitleChange: (val: string) => void;
        onVisitTextChange: (val: string) => void;
        onOpenSelectModal: () => void;
        onRemoveProject: (id: string) => void;
        onMoveUpProject: (index: number) => void;
        onMoveDownProject: (index: number) => void;
        t: LandingPageAdminTranslation;
    }

    let {
        title,
        subtitle,
        visitText,
        featuredProjects,
        onTitleChange,
        onSubtitleChange,
        onVisitTextChange,
        onOpenSelectModal,
        onRemoveProject,
        onMoveUpProject,
        onMoveDownProject,
        t
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.projectsSection}</h2>
    <p class="text-[13px] text-gray-500">
        Configure section headings and select featured projects to highlight on your home page.
    </p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="projects-title" class="block text-[13px] font-medium text-gray-700">
                    {t.projectsTitle}
                </label>
                <input
                    id="projects-title"
                    type="text"
                    value={title}
                    oninput={(e) => onTitleChange(e.currentTarget.value)}
                    placeholder={t.projectsTitlePlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>

            <div>
                <label
                    for="projects-visit-text"
                    class="block text-[13px] font-medium text-gray-700"
                >
                    {t.projectsVisitText}
                </label>
                <input
                    id="projects-visit-text"
                    type="text"
                    value={visitText}
                    oninput={(e) => onVisitTextChange(e.currentTarget.value)}
                    placeholder={t.projectsVisitTextPlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
        </div>

        <div>
            <label for="projects-subtitle" class="block text-[13px] font-medium text-gray-700">
                {t.projectsSubtitle}
            </label>
            <textarea
                id="projects-subtitle"
                rows="2"
                value={subtitle}
                oninput={(e) => onSubtitleChange(e.currentTarget.value)}
                placeholder={t.projectsSubtitlePlaceholder}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>

        <!-- Featured Projects List -->
        <div class="mt-2 flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-700">
                    {t.featuredProjectsList} ({featuredProjects.length})
                </span>
                <button
                    type="button"
                    onclick={onOpenSelectModal}
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-theme-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-theme-700"
                >
                    <Icon icon="lucide:folder-plus" class="h-4 w-4" />
                    <span>{t.selectProjects}</span>
                </button>
            </div>

            {#if featuredProjects.length === 0}
                <div
                    class="rounded-md border border-dashed border-gray-300 p-8 text-center text-xs text-gray-400"
                >
                    <p>{t.noProjectsSelected}</p>
                </div>
            {:else}
                <div class="flex flex-col gap-2.5">
                    {#each featuredProjects as project, index (project.id)}
                        <div
                            class="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50/60 p-3 transition-colors hover:border-gray-300"
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <span class="w-5 text-center text-xs font-bold text-gray-400">
                                    {index + 1}
                                </span>
                                <div
                                    class="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100"
                                >
                                    {#if project.thumbnailUrl}
                                        <img
                                            src={project.thumbnailUrl}
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

                            <div class="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onclick={() => onMoveUpProject(index)}
                                    aria-label={t.moveUp}
                                    class="cursor-pointer rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    disabled={index === featuredProjects.length - 1}
                                    onclick={() => onMoveDownProject(index)}
                                    aria-label={t.moveDown}
                                    class="cursor-pointer rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onclick={() => onRemoveProject(project.id)}
                                    aria-label="Remove"
                                    class="cursor-pointer rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</section>
