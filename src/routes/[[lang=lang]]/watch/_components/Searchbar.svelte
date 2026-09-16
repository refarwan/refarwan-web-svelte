<script lang="ts">
    import ArrowLeft from "lucide-svelte/icons/arrow-left";
    import Search from "lucide-svelte/icons/search";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    import { searchOverlay } from "$lib/stores/search-overlay.svelte";

    interface Props {
        basePath: string;
        placeholder: string;
        closeLabel: string;
    }

    let { basePath, placeholder, closeLabel }: Props = $props();

    let query = $derived(page.url.searchParams.get("search") ?? "");
    let inputEl: HTMLInputElement | undefined = $state();

    $effect(() => {
        if (!searchOverlay.open) return;
        inputEl?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") searchOverlay.open = false;
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        const trimmed = query.trim();
        const params = new SvelteURLSearchParams(page.url.searchParams);
        if (trimmed) {
            params.set("search", trimmed);
            params.delete("category");
        } else {
            params.delete("search");
        }
        const qs = params.toString();
        void goto(qs ? `${basePath}?${qs}` : basePath);
        searchOverlay.open = false;
    };
</script>

<div
    class={`sticky top-0 -mt-16 h-16 w-full items-center transition-colors md:-mt-20 md:h-20 md:justify-center ${
        searchOverlay.open
            ? "pointer-events-auto z-50 flex gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md md:pointer-events-none md:z-40 md:border-b-0 md:bg-transparent md:px-0 md:backdrop-blur-none"
            : "pointer-events-none z-40 hidden md:flex"
    }`}
>
    {#if searchOverlay.open}
        <button
            type="button"
            onclick={() => (searchOverlay.open = false)}
            aria-label={closeLabel}
            class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
        >
            <ArrowLeft class="h-5 w-5" />
        </button>
    {/if}

    <form
        onsubmit={handleSubmit}
        class="pointer-events-auto flex h-10 w-full flex-1 items-center gap-2 rounded-full border-[1.5px] border-gray-200 bg-white px-3 py-2 transition-all focus-within:border-theme-500 focus-within:ring-1 focus-within:ring-theme-500 md:w-full md:max-w-62.5 md:flex-initial lg:max-w-97.5"
    >
        <Search class="h-4 w-4 shrink-0 text-gray-400" />
        <input
            bind:this={inputEl}
            type="search"
            bind:value={query}
            {placeholder}
            class="w-full appearance-none border-0 bg-transparent text-sm text-gray-800 outline-hidden placeholder:text-gray-400"
        />
    </form>
</div>
