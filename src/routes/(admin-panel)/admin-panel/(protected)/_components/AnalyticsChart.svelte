<script lang="ts">
    import { formatViews } from "$lib/utils/watch-format";

    import type { DashboardChartDay } from "$lib/types/dashboard";

    interface Props {
        title: string;
        desc: string;
        days: DashboardChartDay[];
    }

    let { title, desc, days }: Props = $props();

    const maxValue = $derived(Math.max(1, ...days.map((item) => item.value)));
    const yAxisTicks = $derived(
        [1, 0.75, 0.5, 0.25, 0].map((ratio) => formatViews(Math.round(maxValue * ratio)))
    );
    const heightPercent = (value: number) =>
        value === 0 ? 0 : Math.max(4, Math.round((value / maxValue) * 100));
</script>

<div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5">
    <div>
        <h3 class="text-base font-semibold text-gray-900">{title}</h3>
        <p class="mt-1 text-xs text-gray-400">{desc}</p>
    </div>

    <div class="mt-6">
        <div
            class="mb-2 flex items-center justify-between border-b border-gray-100 px-1 pb-1 text-[10px] text-gray-400"
        >
            {#each yAxisTicks as tick, index (index)}
                <span>{tick}</span>
            {/each}
        </div>

        <div class="flex h-36 items-end justify-between gap-2 pt-2">
            {#each days as item, index (index)}
                <div class="group flex h-full flex-1 flex-col items-center justify-end">
                    <div class="flex h-full w-full items-end justify-center">
                        <div
                            style={`height: ${heightPercent(item.value)}%`}
                            title={`${item.day}: ${item.value}`}
                            class="relative w-full max-w-7 origin-bottom rounded-t-xs bg-theme-600 transition-all duration-300 group-hover:scale-y-105 hover:bg-theme-700"
                        ></div>
                    </div>
                    <span class="mt-2 text-xs font-normal text-gray-500">{item.day}</span>
                </div>
            {/each}
        </div>
    </div>
</div>
