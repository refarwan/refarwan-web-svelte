<script lang="ts">
    import { formatDuration, formatTimeAgo, formatViews } from "$lib/utils/watch-format";

    import type { PublicVideoItem } from "$lib/types";

    interface Props {
        video: PublicVideoItem;
        href: string;
        lang: string;
        viewsLabel: string;
        priority?: boolean;
    }

    let { video, href, lang, viewsLabel, priority = false }: Props = $props();
</script>

<!-- href is a resolve()-derived string built by the caller and passed in as a plain
    prop, which the linter can't trace through the component boundary. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
    {href}
    class="group flex flex-row items-start gap-3 py-4 transition-colors first:pt-0 sm:gap-4 sm:py-5 lg:gap-4 lg:py-6"
>
    <div
        class="relative aspect-video w-35 shrink-0 overflow-hidden rounded-lg bg-black shadow-xs sm:w-60 md:w-70 lg:w-90"
    >
        {#if video.thumbnail}
            <img
                src={video.thumbnail.medium}
                alt={video.title ?? ""}
                loading={priority ? "eager" : "lazy"}
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
        {/if}
        <span
            class="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs sm:right-2 sm:bottom-2 sm:px-1.5 sm:text-[11px]"
        >
            {formatDuration(video.duration)}
        </span>
    </div>

    <div class="flex min-w-0 flex-1 flex-col pt-0.5 sm:pt-1">
        <h2
            class="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 transition-colors group-hover:text-theme-600 sm:text-base"
        >
            {video.title ?? "—"}
        </h2>
        <p class="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-[13px]">
            {formatViews(video.viewsCount)}
            {viewsLabel}
            {#if video.createdAt}
                • {formatTimeAgo(video.createdAt, lang)}
            {/if}
        </p>
    </div>
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
