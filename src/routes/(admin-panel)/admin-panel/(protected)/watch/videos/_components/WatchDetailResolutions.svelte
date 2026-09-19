<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        p360?: string | null;
        p720?: string | null;
        p1080?: string | null;
        isEn?: boolean;
        onRefresh?: () => Promise<void> | void;
    }

    let { p360, p720, p1080, isEn = true, onRefresh }: Props = $props();

    const resolutionItems = $derived([
        { key: "360p", label: "360p", value: p360 },
        { key: "720p", label: "720p", value: p720 },
        { key: "1080p", label: "1080p", value: p1080 }
    ]);

    const hasProcessingResolutions = $derived(
        resolutionItems.some((item) => item.value === "processing")
    );

    let isRefreshing = $state(false);

    const triggerRefresh = async () => {
        if (!onRefresh || isRefreshing) return;
        isRefreshing = true;
        try {
            await onRefresh();
        } finally {
            isRefreshing = false;
        }
    };
</script>

<div class="flex w-full shrink-0 flex-col items-start gap-2">
    <div class="flex w-full items-center justify-between">
        <p class="text-[12px] font-medium text-gray-700">
            {isEn ? "Video Resolution" : "Resolusi Video"}
        </p>
        {#if hasProcessingResolutions && onRefresh}
            <button
                type="button"
                onclick={triggerRefresh}
                disabled={isRefreshing}
                class="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-theme-600 transition-colors hover:text-theme-700 disabled:opacity-50"
                title={isEn ? "Refresh resolution status" : "Perbarui status resolusi"}
            >
                <Icon
                    icon="lucide:refresh-cw"
                    class={`size-3 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>{isEn ? "Refresh" : "Perbarui"}</span>
            </button>
        {/if}
    </div>

    <div class="flex w-full flex-wrap items-center gap-2 text-[11px]">
        {#each resolutionItems as res (res.key)}
            {@const isReady = Boolean(res.value) && res.value !== "processing"}
            {@const isProcessing = res.value === "processing"}

            {#if isReady}
                <div
                    class="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-600"
                >
                    <p class="font-semibold">{res.label}</p>
                    <p class="font-normal">{isEn ? "ready" : "tersedia"}</p>
                </div>
            {:else if isProcessing}
                <div
                    class="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-amber-700"
                >
                    <p class="font-semibold">{res.label}</p>
                    <p class="font-normal">{isEn ? "processing" : "diproses"}</p>
                </div>
            {:else}
                <div
                    class="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-gray-400"
                >
                    <p class="font-semibold">{res.label}</p>
                    <p class="font-normal">{isEn ? "unavailable" : "tidak tersedia"}</p>
                </div>
            {/if}
        {/each}
    </div>
</div>
