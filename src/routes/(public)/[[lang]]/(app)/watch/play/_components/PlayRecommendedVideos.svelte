<script lang="ts">
    import { formatDuration, formatTimeAgo, formatViews } from "$lib/utils/watch-format";

    import type { ResolvedPathname } from "$app/types";
    import type { PublicVideoItem } from "$lib/types/video";

    interface Props {
        videos: PublicVideoItem[];
        lang: string;
        viewsLabel: string;
        heading: string;
        buildPlayHref: (id: string) => ResolvedPathname;
    }

    let { videos, lang, viewsLabel, heading, buildPlayHref }: Props = $props();
</script>

{#if videos.length > 0}
    <div>
        <h2 class="text-base font-semibold text-gray-900">{heading}</h2>
        <div class="mt-3 flex flex-col gap-3">
            {#each videos as video (video.id)}
                <a href={buildPlayHref(video.id)} class="group flex gap-3">
                    <div class="relative w-32 shrink-0 overflow-hidden rounded-lg bg-black md:w-36">
                        <div class="aspect-video w-full">
                            {#if video.thumbnail}
                                <img
                                    src={video.thumbnail.small}
                                    alt={video.title ?? ""}
                                    class="h-full w-full object-contain"
                                />
                            {/if}
                        </div>
                        <span
                            class="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white"
                        >
                            {formatDuration(video.duration)}
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h3
                            class="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-theme-600"
                        >
                            {video.title ?? "—"}
                        </h3>
                        <p class="mt-1 text-xs text-gray-500">
                            {formatViews(video.viewsCount)}
                            {viewsLabel} • {formatTimeAgo(video.createdAt, lang)}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
{/if}
