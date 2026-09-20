<script lang="ts">
    import ProjectTableHeader from "./ProjectTableHeader.svelte";
    import ProjectTableItem from "./ProjectTableItem.svelte";
    import ProjectTableSkeleton from "./ProjectTableSkeleton.svelte";

    import type { ProjectItem } from "$lib/types/project";

    interface Props {
        t: Record<string, string>;
        items: ProjectItem[];
        search?: string;
        isLoading?: boolean;
        deletingId?: string | null;
        archivingId?: string | null;
        isEn?: boolean;
        onView: (project: ProjectItem) => void;
        onArchive: (project: ProjectItem) => void;
        onUnarchive: (project: ProjectItem) => void;
        onDelete: (project: ProjectItem) => void;
    }

    let {
        t,
        items,
        search = "",
        isLoading = false,
        deletingId = null,
        archivingId = null,
        isEn = true,
        onView,
        onArchive,
        onUnarchive,
        onDelete
    }: Props = $props();
</script>

<div class="w-full">
    {#if isLoading}
        <ProjectTableSkeleton rows={5} />
    {:else if items.length === 0}
        <div
            class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center"
        >
            <p class="text-sm font-medium text-gray-500">
                {search ? t.emptySearch : t.empty}
            </p>
        </div>
    {:else}
        <ProjectTableHeader {t} />
        <div class="flex flex-col gap-2 lg:gap-0">
            {#each items as project (project.id)}
                <ProjectTableItem
                    {project}
                    {isEn}
                    isDeleting={deletingId === project.id}
                    isArchiving={archivingId === project.id}
                    onViewDetail={onView}
                    {onArchive}
                    {onUnarchive}
                    {onDelete}
                />
            {/each}
        </div>
    {/if}
</div>
