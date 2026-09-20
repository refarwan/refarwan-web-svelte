<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        t: Record<string, string>;
        icons: string[];
        onAdd: (icon: string) => void;
        onRemove: (icon: string) => void;
    }

    let { t, icons, onAdd, onRemove }: Props = $props();

    let query = $state("");
    let results = $state<string[]>([]);
    let loading = $state(false);
    let isOpen = $state(false);
    let containerRef: HTMLDivElement | undefined = $state();
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const iconLabel = (icon: string): string => {
        const name = icon.split(":")[1] ?? icon;
        return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const search = async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            results = [];
            loading = false;
            return;
        }

        loading = true;
        try {
            const url = `https://api.iconify.design/search?query=${encodeURIComponent(trimmed)}&prefix=simple-icons&limit=32`;
            const res = await fetch(url);
            const data = (await res.json()) as { icons?: string[] };
            results = Array.isArray(data.icons) ? data.icons : [];
        } catch {
            results = [];
        } finally {
            loading = false;
        }
    };

    const onQueryInput = (event: Event) => {
        query = (event.target as HTMLInputElement).value;
        isOpen = true;
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => search(query), 350);
    };

    const selectIcon = (icon: string) => {
        onAdd(icon);
        query = "";
        results = [];
        isOpen = false;
    };

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef && !containerRef.contains(event.target as Node)) isOpen = false;
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

<div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-700" for="tech-icons-search">
        {t.techIconsLabel}
    </label>

    {#if icons.length > 0}
        <div class="flex flex-wrap gap-2">
            {#each icons as icon (icon)}
                <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-theme-100 bg-theme-50 py-1 pr-2 pl-2.5 text-xs font-medium text-theme-700"
                >
                    <Icon {icon} class="h-3.5 w-3.5" />
                    <span>{iconLabel(icon)}</span>
                    <button
                        type="button"
                        onclick={() => onRemove(icon)}
                        class="cursor-pointer rounded-full text-theme-400 transition-colors hover:text-theme-700"
                    >
                        <Icon icon="lucide:x" class="h-3 w-3" />
                    </button>
                </span>
            {/each}
        </div>
    {/if}

    <div class="relative" bind:this={containerRef}>
        <div class="relative flex items-center">
            <Icon
                icon="lucide:search"
                class="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
            />
            <input
                id="tech-icons-search"
                type="text"
                value={query}
                oninput={onQueryInput}
                onfocus={() => (isOpen = true)}
                placeholder={t.techIconsSearchPlaceholder}
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3.5 pl-9 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>

        {#if isOpen && query.trim()}
            <div
                class="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
            >
                {#if loading}
                    <div class="px-2 py-3 text-center text-xs text-gray-400">
                        {t.techIconsSearching}
                    </div>
                {:else if results.length === 0}
                    <div class="px-2 py-3 text-center text-xs text-gray-400">
                        {t.techIconsNoResults}
                    </div>
                {:else}
                    <div class="grid grid-cols-2 gap-1 sm:grid-cols-3">
                        {#each results as icon (icon)}
                            <button
                                type="button"
                                onclick={() => selectIcon(icon)}
                                disabled={icons.includes(icon)}
                                class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-theme-50 hover:text-theme-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Icon {icon} class="h-4 w-4 shrink-0" />
                                <span class="truncate">{iconLabel(icon)}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    </div>

    <p class="text-xs leading-relaxed text-gray-500">{t.techIconsHelper}</p>
</div>
