<script lang="ts">
    import type { ChartDayData } from "$lib/data/admin-dashboard";

    interface Props {
        title: string;
        desc: string;
        days: ChartDayData[];
    }

    let { title, desc, days }: Props = $props();

    const Y_AXIS_TICKS = ["2.5k", "2k", "1.5k", "1k", "500"];
</script>

<div
    class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-2xs"
>
    <div>
        <h3 class="text-base font-semibold text-gray-900">{title}</h3>
        <p class="mt-1 text-xs text-gray-400">{desc}</p>
    </div>

    <div class="mt-6">
        <div
            class="mb-2 flex items-center justify-between border-b border-gray-100 px-1 pb-1 text-[10px] text-gray-400"
        >
            {#each Y_AXIS_TICKS as tick (tick)}
                <span>{tick}</span>
            {/each}
        </div>

        <div class="flex h-36 items-end justify-between gap-2 pt-2">
            {#each days as item (item.day)}
                <div class="group flex h-full flex-1 flex-col items-center justify-end">
                    <div class="flex h-full w-full items-end justify-center">
                        <div
                            style={`height: ${item.heightPercent}%`}
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
