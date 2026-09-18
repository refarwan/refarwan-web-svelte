<script lang="ts">
    import { Clock as ClockIcon, Eye as EyeIcon } from "lucide-svelte/icons";
    import CategoryBadge from "./CategoryBadge.svelte";
    import StatusBadge from "./StatusBadge.svelte";

    interface Props {
        status?: string;
        category?: string | null;
        duration?: number;
        viewsCount?: number;
        lang?: string;
        isEn?: boolean;
    }

    let {
        status = "draft",
        category = null,
        duration = 0,
        viewsCount = 0,
        lang = "en",
        isEn = true
    }: Props = $props();

    const formatDuration = (seconds?: number): string => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
</script>

<div class="flex w-full shrink-0 flex-wrap items-center gap-2.5">
    <StatusBadge {status} {lang} />

    {#if category}
        <CategoryBadge {category} />
    {/if}

    <div class="flex shrink-0 items-center gap-1">
        <ClockIcon class="size-3.5 text-gray-500" />
        <p class="text-[12px] whitespace-nowrap text-gray-500">
            {formatDuration(duration)}
        </p>
    </div>

    <div class="flex shrink-0 items-center gap-1">
        <EyeIcon class="size-3.5 text-gray-500" />
        <p class="text-[12px] whitespace-nowrap text-gray-500">
            {viewsCount.toLocaleString(isEn ? "en-US" : "id-ID")}
        </p>
    </div>
</div>
