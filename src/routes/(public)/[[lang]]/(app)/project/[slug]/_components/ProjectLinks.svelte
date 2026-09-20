<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        githubLink?: string | null;
        gitlabLink?: string | null;
        demoLink?: string | null;
        githubLabel: string;
        gitlabLabel: string;
        demoLabel: string;
    }

    let { githubLink, gitlabLink, demoLink, githubLabel, gitlabLabel, demoLabel }: Props = $props();

    const links = $derived(
        [
            githubLink && { label: githubLabel, href: githubLink, icon: "mdi:github" },
            gitlabLink && { label: gitlabLabel, href: gitlabLink, icon: "mdi:gitlab" },
            demoLink && { label: demoLabel, href: demoLink, icon: "lucide:external-link" }
        ].filter((link): link is { label: string; href: string; icon: string } => Boolean(link))
    );
</script>

{#if links.length > 0}
    <div class="mt-6 flex flex-wrap gap-2.5 sm:mt-8">
        {#each links as link (link.href)}
            <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer external"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
                <Icon icon={link.icon} class="h-4.5 w-4.5" />
                {link.label}
            </a>
        {/each}
    </div>
{/if}
