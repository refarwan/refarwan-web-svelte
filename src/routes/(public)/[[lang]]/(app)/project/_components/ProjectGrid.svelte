<script lang="ts">
    import ProjectCard from "./ProjectCard.svelte";

    import type { PublicProjectItem } from "$lib/types/project";

    interface Props {
        projects: PublicProjectItem[];
        basePath: string;
        lang: string;
        viewProjectLabel: string;
        noProjectsLabel: string;
    }

    let { projects, basePath, lang, viewProjectLabel, noProjectsLabel }: Props = $props();
</script>

{#if projects.length === 0}
    <div class="py-16 text-center text-sm text-gray-500">{noProjectsLabel}</div>
{:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each projects as project, index (project.id)}
            <ProjectCard {project} {basePath} {lang} {viewProjectLabel} priority={index < 3} />
        {/each}
    </div>
{/if}
