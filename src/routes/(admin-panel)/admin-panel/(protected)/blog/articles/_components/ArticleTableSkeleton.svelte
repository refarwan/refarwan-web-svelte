<script lang="ts">
    interface Props {
        rows?: number;
    }

    let { rows = 5 }: Props = $props();
    const items = $derived(Array.from({ length: rows }, (_, i) => i));
</script>

<div class="flex flex-col gap-2 lg:gap-0">
    {#each items as idx (`skeleton-${idx}`)}
        <div
            class="grid grid-cols-[68px_auto] gap-x-3 gap-y-2 rounded-xl border border-gray-200 bg-white p-3 lg:grid-cols-[68px_1fr_200px_120px_80px_110px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:last:rounded-b-xl"
        >
            <div
                class="row-span-4 aspect-video w-full animate-pulse rounded-md bg-gray-200 lg:row-span-1"
            ></div>
            <div class="space-y-1.5">
                <div class="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div class="h-3 w-1/3 animate-pulse rounded bg-gray-100"></div>
            </div>
            <div class="hidden h-6 w-24 animate-pulse rounded-full bg-gray-100 lg:block"></div>
            <div class="hidden h-5 w-20 animate-pulse rounded-md bg-gray-100 lg:block"></div>
            <div class="hidden h-4 w-12 animate-pulse rounded bg-gray-100 lg:block"></div>
            <div
                class="hidden h-8 w-8 animate-pulse rounded-lg bg-gray-100 lg:block lg:justify-self-end"
            ></div>
        </div>
    {/each}
</div>
