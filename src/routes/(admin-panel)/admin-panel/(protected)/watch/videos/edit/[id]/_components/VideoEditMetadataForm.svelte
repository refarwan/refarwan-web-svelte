<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { VideoDetail } from "$lib/types/video";

    interface Option {
        value: string;
        label: string;
    }

    interface Props {
        t: Record<string, string>;
        video: VideoDetail;
        title: string;
        onTitleChange: (value: string) => void;
        categoryId: string;
        onCategoryChange: (value: string) => void;
        categoryOptions: Option[];
        description: string;
        onDescriptionChange: (value: string) => void;
    }

    let {
        t,
        video,
        title,
        onTitleChange,
        categoryId,
        onCategoryChange,
        categoryOptions,
        description,
        onDescriptionChange
    }: Props = $props();

    const readyResolutions = $derived(
        [
            video.p360 ? "360p" : null,
            video.p720 ? "720p" : null,
            video.p1080 ? "1080p" : null
        ].filter(Boolean) as string[]
    );

    const formatDuration = (sec: number): string => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const watchHref = $derived(
        video.id ? (`${resolve("/watch/play")}?v=${video.id}` as ResolvedPathname) : null
    );
</script>

<div class="w-full flex-1 space-y-5">
    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="video-title"
            >{t.titleLabel}</label
        >
        <input
            id="video-title"
            type="text"
            value={title}
            oninput={(event) => onTitleChange((event.target as HTMLInputElement).value)}
            placeholder={t.titlePlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        />
    </div>

    <DropdownSelect
        label={t.categoryLabel}
        value={categoryId}
        options={categoryOptions}
        onChange={onCategoryChange}
        placeholder={t.categoryPlaceholder}
        searchable
        searchPlaceholder={t.categorySearchPlaceholder}
        noResultsText={t.categoryNoResults}
    />

    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="video-description"
            >{t.descriptionLabel}</label
        >
        <textarea
            id="video-description"
            rows="4"
            value={description}
            oninput={(event) => onDescriptionChange((event.target as HTMLTextAreaElement).value)}
            placeholder={t.descriptionPlaceholder}
            class="min-h-25 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        ></textarea>
    </div>

    <div class="space-y-1.5">
        <span class="block text-sm font-medium text-gray-900">{t.videoDropzoneLabel}</span>
        <div
            class="flex items-center justify-between gap-3 rounded-lg border border-theme-200 bg-theme-50/60 p-3.5 sm:p-4"
        >
            <div class="flex min-w-0 flex-1 items-center gap-3">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-theme-600 text-white"
                >
                    <Icon icon="lucide:film" class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="line-clamp-2 text-sm font-medium break-all text-gray-900">
                        {video.title || t.editVideoLabel || "Video"}
                    </p>
                    <div class="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {#if video.duration}
                            <span>{formatDuration(video.duration)}</span>
                            <span>•</span>
                        {/if}
                        {#if readyResolutions.length > 0}
                            <span class="flex items-center gap-1">
                                {#each readyResolutions as res (res)}
                                    <span
                                        class="rounded bg-theme-100 px-1.5 py-0.5 text-[10px] font-semibold text-theme-700"
                                    >
                                        {res}
                                    </span>
                                {/each}
                            </span>
                        {:else}
                            <span>{t.resolutionReady}</span>
                        {/if}
                    </div>
                </div>
            </div>

            {#if watchHref}
                <a
                    href={watchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-theme-600"
                >
                    <Icon icon="lucide:external-link" class="size-3.5" />
                    <span class="hidden sm:inline">{t.watchOnSiteLabel}</span>
                </a>
            {/if}
        </div>
    </div>
</div>
