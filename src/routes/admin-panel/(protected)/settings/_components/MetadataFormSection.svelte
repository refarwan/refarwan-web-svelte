<script lang="ts">
    interface Props {
        t: Record<string, string>;
        title: string;
        description: string;
        faviconPreview: string;
        faviconFile: File | null;
    }

    let {
        t,
        title = $bindable(),
        description = $bindable(),
        faviconPreview = $bindable(),
        // eslint-disable-next-line no-useless-assignment
        faviconFile = $bindable()
    }: Props = $props();

    let faviconInput: HTMLInputElement | undefined = $state();

    const onFaviconChange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        faviconFile = file;
        faviconPreview = URL.createObjectURL(file);
    };
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.metadataTitle}</h2>
    <p class="text-[13px] text-gray-500">{t.metadataDescription}</p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-4">
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="title">
                {t.siteTitle}
            </label>
            <input
                id="title"
                name="title"
                bind:value={title}
                required
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="description">
                {t.siteDescription}
            </label>
            <input
                id="description"
                name="description"
                bind:value={description}
                required
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>

        <button
            type="button"
            onclick={() => faviconInput?.click()}
            class="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 p-3 text-left hover:border-theme-400"
        >
            {#if faviconPreview}
                <img src={faviconPreview} alt={t.favicon} class="h-10 w-10 rounded object-cover" />
            {/if}
            <span class="text-sm text-gray-600">{t.faviconHint}</span>
        </button>
        <input
            bind:this={faviconInput}
            onchange={onFaviconChange}
            type="file"
            name="favicon"
            accept="image/png"
            class="hidden"
        />
    </div>
</section>
