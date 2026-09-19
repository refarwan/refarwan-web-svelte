<script lang="ts">
    import { formatDuration, formatTimeAgo, formatViews } from "$lib/utils/watch-format";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicVideoItem } from "$lib/types/video";

    interface Props {
        video: PublicVideoItem;
        href: ResolvedPathname;
        lang: string;
        viewsLabel: string;
        priority?: boolean;
    }

    let { video, href, lang, viewsLabel, priority = false }: Props = $props();
</script>

<a {href} class="group flex flex-col">
    <div class="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {#if video.thumbnail}
            <img
                src={video.thumbnail.medium}
                alt={video.title ?? ""}
                loading={priority ? "eager" : "lazy"}
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
        {/if}
        <span
            class="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white"
        >
            {formatDuration(video.duration)}
        </span>
    </div>
    <h3 class="mt-3 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-theme-600">
        {video.title ?? "—"}
    </h3>
    <p class="mt-1 text-xs text-gray-500">
        {formatViews(video.viewsCount)}
        {viewsLabel} • {formatTimeAgo(video.createdAt, lang)}
    </p>
</a>
