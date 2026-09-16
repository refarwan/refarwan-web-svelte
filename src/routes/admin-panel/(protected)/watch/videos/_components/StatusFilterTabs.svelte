<script lang="ts">
    interface Tab {
        value: string;
        label: string;
    }

    interface Props {
        tabs: Tab[];
        activeValue: string;
        buildHref: (value: string) => string;
    }

    let { tabs, activeValue, buildHref }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5">
    {#each tabs as tab (tab.value)}
        <!-- buildHref wraps a resolve()-derived basePath with a query string; the linter
            can't trace resolve() through the prop function. -->
        <!-- eslint-disable svelte/no-navigation-without-resolve -->
        <a
            href={buildHref(tab.value)}
            class={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeValue === tab.value
                    ? "border-theme-600 bg-theme-600 text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
        >
            {tab.label}
        </a>
        <!-- eslint-enable svelte/no-navigation-without-resolve -->
    {/each}
</div>
