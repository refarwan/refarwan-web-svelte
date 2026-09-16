<script lang="ts">
    import Settings2 from "lucide-svelte/icons/settings-2";

    interface Props {
        playbackRate: number;
        onSelectRate: (rate: number) => void;
    }

    let { playbackRate, onSelectRate }: Props = $props();

    let isOpen = $state(false);
    let menuRef: HTMLDivElement | undefined = $state();

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef && !menuRef.contains(event.target as Node)) isOpen = false;
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

<div class="relative" bind:this={menuRef}>
    <button
        type="button"
        onclick={() => (isOpen = !isOpen)}
        class="grid h-8 w-8 place-content-center rounded-full text-white transition-colors hover:bg-white/15"
        aria-label="Playback speed"
    >
        <Settings2 class="h-4.5 w-4.5" />
    </button>

    {#if isOpen}
        <div
            class="absolute right-0 bottom-full z-20 mb-2 w-28 overflow-hidden rounded-lg bg-black/90 py-1 text-sm text-white shadow-xl backdrop-blur-sm"
        >
            {#each rates as rate (rate)}
                <button
                    type="button"
                    onclick={() => {
                        onSelectRate(rate);
                        isOpen = false;
                    }}
                    class={`block w-full px-3 py-1.5 text-left transition-colors hover:bg-white/10 ${
                        rate === playbackRate ? "font-semibold text-theme-400" : ""
                    }`}
                >
                    {rate === 1 ? "Normal" : `${rate}x`}
                </button>
            {/each}
        </div>
    {/if}
</div>
