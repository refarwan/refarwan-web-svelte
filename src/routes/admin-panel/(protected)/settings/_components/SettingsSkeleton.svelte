<div class="flex flex-col gap-4" aria-busy="true" aria-label="Loading settings">
    {#each [0, 1, 2] as index (index)}
        <div class="animate-pulse rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
            <div class="h-4 w-40 rounded bg-gray-200"></div>
            <div class="mt-2 h-3 w-64 rounded bg-gray-100"></div>
            <hr class="my-4 border-gray-200" />
            <div class="flex flex-col gap-3">
                <div class="h-10 w-full rounded-md bg-gray-100"></div>
                <div class="h-10 w-full rounded-md bg-gray-100"></div>
            </div>
        </div>
    {/each}
</div>
