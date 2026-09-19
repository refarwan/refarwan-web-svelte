<script lang="ts">
    interface Props {
        count?: number;
    }

    let { count = 5 }: Props = $props();
    const items = $derived(Array.from({ length: count }, (_, i) => i));
</script>

{#each items as idx (`skeleton-${idx}`)}
    <div
        class="grid grid-cols-[68px_auto] gap-x-3 gap-y-1 rounded-xl border border-gray-200 bg-white px-3 pt-4 pb-3 lg:grid-cols-[56px_1fr_245px_120px_60px_110px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:last:rounded-b-xl xl:grid-cols-[64px_1fr_245px_120px_60px_110px]"
    >
        <!-- 1. Thumbnail -->
        <div
            class="row-span-5 aspect-video w-full animate-pulse self-center rounded-md bg-gray-200 lg:order-1 lg:row-span-1 lg:self-center"
        ></div>

        <!-- 2. Badges -->
        <div class="flex gap-1.5 lg:order-3 lg:grid lg:grid-cols-2 lg:flex-row-reverse">
            <div class="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
            <div class="h-5 w-20 animate-pulse rounded-full bg-gray-200"></div>
        </div>

        <!-- 3. Title -->
        <div class="lg:order-2">
            <div class="h-4 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
        </div>

        <!-- 4. Date -->
        <div class="lg:order-4">
            <div class="h-3.5 w-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>

        <!-- 5. Views Count -->
        <div class="flex items-center lg:order-5">
            <div class="h-3.5 w-3.5 animate-pulse rounded-full bg-gray-200 lg:hidden"></div>
            <div class="ml-1 h-3.5 w-16 animate-pulse rounded-md bg-gray-200 lg:ml-0 lg:w-8"></div>
        </div>

        <!-- 6. Actions -->
        <div class="flex w-full justify-end gap-3 lg:order-6">
            <div class="h-7 w-7 animate-pulse rounded-md bg-gray-200"></div>
            <div class="h-7 w-7 animate-pulse rounded-md bg-gray-200"></div>
            <div class="h-7 w-7 animate-pulse rounded-md bg-gray-200"></div>
        </div>
    </div>
{/each}
