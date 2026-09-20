<script lang="ts">
    import ProjectCard from "../../_components/ProjectCard.svelte";

    import type { PublicProjectItem } from "$lib/types/project";

    interface Props {
        heading: string;
        subheading: string;
        projects: PublicProjectItem[];
        basePath: string;
        viewProjectLabel: string;
        lang: string;
    }

    let { heading, subheading, projects, basePath, viewProjectLabel, lang }: Props = $props();
</script>

{#if projects.length > 0}
    <section class="mt-16 border-t border-gray-200 pt-12 sm:mt-20 sm:pt-16">
        <div class="mb-8">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {heading}
            </h2>
            <p class="mt-1 text-sm text-gray-500 sm:text-base">
                {subheading}
            </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {#each projects as project (project.id)}
                <ProjectCard {project} {basePath} {viewProjectLabel} {lang} />
            {/each}
        </div>
    </section>
{/if}
