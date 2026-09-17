<script lang="ts">
    import {
        CheckIcon,
        ChevronRightIcon,
        LoaderCircleIcon,
        SettingsIcon
    } from "lucide-svelte/icons";

    import { readyResolutions } from "./resolution";

    import type { ResolutionOption } from "./resolution";

    interface Props {
        playbackRate: number;
        onSelectRate: (rate: number) => void;
        resolutions: ResolutionOption[];
        selectedQuality: number | "auto";
        onSelectQuality: (quality: number | "auto") => void;
    }

    let { playbackRate, onSelectRate, resolutions, selectedQuality, onSelectQuality }: Props =
        $props();

    let isOpen = $state(false);
    let tab = $state<"main" | "quality" | "speed">("main");
    let menuRef: HTMLDivElement | undefined = $state();

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const ready = $derived(readyResolutions(resolutions));
    const visibleResolutions = $derived(resolutions.filter((r) => r.status !== "unavailable"));
    const hasProcessing = $derived(resolutions.some((r) => r.status === "processing"));
    const qualityLabel = $derived(selectedQuality === "auto" ? "Auto" : `${selectedQuality}p`);
    const speedLabel = $derived(playbackRate === 1 ? "Normal" : `${playbackRate}x`);

    const close = () => {
        isOpen = false;
        tab = "main";
    };

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef && !menuRef.contains(event.target as Node)) close();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

<div class="relative" bind:this={menuRef}>
    <button
        type="button"
        onclick={() => (isOpen ? close() : (isOpen = true))}
        class="grid h-8 w-8 place-content-center rounded-full text-white transition-colors hover:bg-white/15"
        aria-label="Settings"
    >
        <SettingsIcon class="h-4.5 w-4.5" />
    </button>

    {#if isOpen}
        <div
            class="absolute right-0 bottom-full z-20 mb-2 w-48 overflow-hidden rounded-lg bg-black/90 py-1 text-sm text-white shadow-xl backdrop-blur-sm"
        >
            {#if tab === "main"}
                <button
                    type="button"
                    onclick={() => (tab = "quality")}
                    class="flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-white/10"
                >
                    <span class="text-gray-300">Quality</span>
                    <span class="flex items-center gap-1 font-medium text-theme-400">
                        {qualityLabel}
                        {#if hasProcessing}
                            <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        {/if}
                        <ChevronRightIcon class="h-3.5 w-3.5 text-gray-400" />
                    </span>
                </button>
                <button
                    type="button"
                    onclick={() => (tab = "speed")}
                    class="flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-white/10"
                >
                    <span class="text-gray-300">Speed</span>
                    <span class="flex items-center gap-1 font-medium text-theme-400">
                        {speedLabel}
                        <ChevronRightIcon class="h-3.5 w-3.5 text-gray-400" />
                    </span>
                </button>
            {:else if tab === "quality"}
                <button
                    type="button"
                    onclick={() => (tab = "main")}
                    class="flex w-full items-center gap-1 border-b border-white/10 px-3 py-1.5 text-left text-xs font-semibold text-gray-400 hover:text-white"
                >
                    <ChevronRightIcon class="h-3.5 w-3.5 rotate-180" />
                    <span>Quality</span>
                </button>

                {#if ready.length > 1}
                    <button
                        type="button"
                        onclick={() => {
                            onSelectQuality("auto");
                            close();
                        }}
                        class="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                    >
                        <span>Auto</span>
                        {#if selectedQuality === "auto"}
                            <CheckIcon class="h-3.5 w-3.5 text-theme-400" />
                        {/if}
                    </button>
                {/if}

                {#each visibleResolutions as resolution (resolution.quality)}
                    {#if resolution.status === "ready"}
                        <button
                            type="button"
                            onclick={() => {
                                onSelectQuality(resolution.quality);
                                close();
                            }}
                            class="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        >
                            <span>{resolution.label}</span>
                            {#if selectedQuality === resolution.quality}
                                <CheckIcon class="h-3.5 w-3.5 text-theme-400" />
                            {/if}
                        </button>
                    {:else}
                        <div
                            class="flex w-full cursor-not-allowed items-center justify-between px-3 py-1.5 text-left text-gray-500"
                        >
                            <span>{resolution.label}</span>
                            <span class="inline-flex items-center gap-1 text-xs text-amber-400">
                                <LoaderCircleIcon class="h-3 w-3 animate-spin" />
                                Processing
                            </span>
                        </div>
                    {/if}
                {/each}
            {:else if tab === "speed"}
                <button
                    type="button"
                    onclick={() => (tab = "main")}
                    class="flex w-full items-center gap-1 border-b border-white/10 px-3 py-1.5 text-left text-xs font-semibold text-gray-400 hover:text-white"
                >
                    <ChevronRightIcon class="h-3.5 w-3.5 rotate-180" />
                    <span>Speed</span>
                </button>

                {#each rates as rate (rate)}
                    <button
                        type="button"
                        onclick={() => {
                            onSelectRate(rate);
                            close();
                        }}
                        class={`flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-white/10 ${
                            rate === playbackRate ? "font-semibold text-theme-400" : ""
                        }`}
                    >
                        <span>{rate === 1 ? "Normal" : `${rate}x`}</span>
                        {#if rate === playbackRate}
                            <CheckIcon class="h-3.5 w-3.5 text-theme-400" />
                        {/if}
                    </button>
                {/each}
            {/if}
        </div>
    {/if}
</div>
