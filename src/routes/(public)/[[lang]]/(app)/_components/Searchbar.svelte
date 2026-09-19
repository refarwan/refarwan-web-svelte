<script lang="ts">
    import Icon from "@iconify/svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { searchOverlay } from "$lib/stores/search-overlay.svelte";

    interface Props {
        basePath: string;
        resultPath?: string;
        placeholder?: string;
        closeLabel?: string;
    }

    let {
        basePath,
        resultPath,
        placeholder = "Search...",
        closeLabel = "Close search"
    }: Props = $props();

    let query = $derived(page.url.searchParams.get("search") ?? "");
    let inputEl: HTMLInputElement | undefined = $state();

    $effect(() => {
        if (!searchOverlay.open) return;
        inputEl?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                searchOverlay.open = false;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    $effect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => {
            if (window.innerWidth >= 768 && searchOverlay.open) {
                searchOverlay.open = false;
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    $effect(() => {
        document.body.style.overflow = searchOverlay.open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    });

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        const trimmed = query.trim();
        const targetBase = resultPath ?? basePath;
        const params = new SvelteURLSearchParams(page.url.searchParams);

        if (trimmed) {
            params.set("search", trimmed);
            params.delete("category");
            params.delete("page");
            const qs = params.toString();
            void goto(resolve(`${targetBase}${qs ? `?${qs}` : ""}`));
        } else {
            params.delete("search");
            const qs = params.toString();
            void goto(resolve(`${basePath}${qs ? `?${qs}` : ""}`));
        }
        searchOverlay.open = false;
    };
</script>

<div
    data-is-open={searchOverlay.open}
    class="group invisible fixed inset-0 z-50 transition-all data-[is-open=true]:visible md:pointer-events-none md:visible md:top-0 md:left-[50%] md:flex md:h-20 md:w-full md:max-w-md md:-translate-x-1/2 md:items-center md:px-4 lg:max-w-lg"
    onclick={(e) => {
        if (e.target === e.currentTarget) {
            searchOverlay.open = false;
        }
    }}
    role="presentation"
>
    <div
        class="fixed inset-x-0 top-0 z-50 flex h-16 w-full -translate-y-full items-center gap-3 border-b border-gray-200 bg-white px-4 backdrop-blur-md transition-all group-data-[is-open=true]:translate-y-0 md:pointer-events-auto md:relative md:inset-x-auto md:top-0 md:h-auto md:w-full md:translate-y-0 md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none"
        role="search"
    >
        <button
            type="button"
            onclick={() => (searchOverlay.open = false)}
            aria-label={closeLabel}
            class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
        >
            <Icon icon="lucide:arrow-left" class="h-5 w-5" />
        </button>

        <form
            onsubmit={handleSubmit}
            class="flex h-10 w-full flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3.5 py-2 transition-all focus-within:border-theme-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-theme-500 md:border-gray-200 md:bg-gray-50/70"
        >
            <Icon icon="lucide:search" class="h-4 w-4 shrink-0 text-gray-400" />
            <input
                bind:this={inputEl}
                type="text"
                bind:value={query}
                {placeholder}
                class="w-full appearance-none border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
            />
            {#if query}
                <button
                    type="button"
                    onclick={() => (query = "")}
                    class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-600"
                    aria-label="Clear"
                >
                    <Icon icon="lucide:x" class="h-3.5 w-3.5" />
                </button>
            {/if}
        </form>
    </div>
</div>
