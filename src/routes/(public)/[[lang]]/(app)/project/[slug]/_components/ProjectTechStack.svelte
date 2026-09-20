<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        techIcons: string[];
        techLabel: string;
    }

    let { techIcons, techLabel }: Props = $props();

    const iconLabel = (icon: string): string => {
        const name = icon.split(":")[1] ?? icon;
        return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };
</script>

{#if techIcons.length > 0}
    <div class="mt-6 sm:mt-8">
        <span class="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            {techLabel}
        </span>
        <div class="mt-2.5 flex flex-wrap gap-2">
            {#each techIcons as icon (icon)}
                <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 sm:text-sm"
                >
                    <Icon {icon} class="h-4 w-4" />
                    {iconLabel(icon)}
                </span>
            {/each}
        </div>
    </div>
{/if}
