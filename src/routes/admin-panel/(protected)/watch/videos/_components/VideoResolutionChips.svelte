<script lang="ts">
    interface Props {
        t: Record<string, string>;
        p360: string | null;
        p720: string | null;
        p1080: string | null;
    }

    let { t, p360, p720, p1080 }: Props = $props();

    type ResolutionState = "ready" | "processing" | "unavailable";

    const stateOf = (value: string | null): ResolutionState => {
        if (!value) return "unavailable";
        if (value === "processing") return "processing";
        return "ready";
    };

    const stateClass: Record<ResolutionState, string> = {
        ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
        processing: "border-amber-200 bg-amber-50 text-amber-700",
        unavailable: "border-gray-200 bg-gray-50 text-gray-400"
    };

    const stateLabel = (state: ResolutionState): string => {
        if (state === "ready") return t.resolutionReady;
        if (state === "processing") return t.resolutionProcessing;
        return t.resolutionUnavailable;
    };

    const resolutions = $derived([
        { label: "360p", state: stateOf(p360) },
        { label: "720p", state: stateOf(p720) },
        { label: "1080p", state: stateOf(p1080) }
    ]);
</script>

<div class="space-y-1.5">
    <p class="text-[13px] font-medium text-gray-700">{t.resolutionsLabel}</p>
    <div class="flex flex-wrap gap-2">
        {#each resolutions as resolution (resolution.label)}
            <span
                class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${stateClass[resolution.state]}`}
            >
                {resolution.label}
                <span class="opacity-80">· {stateLabel(resolution.state)}</span>
            </span>
        {/each}
    </div>
</div>
