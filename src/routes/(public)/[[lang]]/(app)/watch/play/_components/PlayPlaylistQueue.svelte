<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { formatDuration } from "$lib/utils/watch-format";

    import type { ResolvedPathname } from "$app/types";
    import type { WatchTranslationObjects } from "$lib/i18n/watch/types";
    import type { PublicPlaylistDetail } from "$lib/types/playlist";

    interface Props {
        playlist: PublicPlaylistDetail;
        currentVideoId: string;
        t: WatchTranslationObjects;
        basePath: string;
    }

    let { playlist, currentVideoId, t, basePath }: Props = $props();

    const currentIndex = $derived(
        playlist.videos.findIndex((v) => (v.videoId ?? v.id) === currentVideoId)
    );

    const prevVideo = $derived(currentIndex > 0 ? playlist.videos[currentIndex - 1] : null);

    const nextVideo = $derived(
        currentIndex >= 0 && currentIndex < playlist.videos.length - 1
            ? playlist.videos[currentIndex + 1]
            : null
    );

    const buildPlayHref = (videoId: string): ResolvedPathname =>
        `${basePath}/play?v=${videoId}&list=${playlist.slug}` as ResolvedPathname;

    const playlistDetailHref = $derived(
        `${basePath}/playlist/${playlist.slug}` as ResolvedPathname
    );
</script>

<div class="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
    <!-- Header -->
    <div class="border-b border-gray-100 bg-gray-50/80 p-4">
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
                <a
                    href={resolve(playlistDetailHref)}
                    class="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-900"
                >
                    <Icon icon="lucide:list-video" class="h-4 w-4" />
                    <span>{t.playlist}</span>
                    <Icon
                        icon="lucide:external-link"
                        class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                </a>
                <h3 class="mt-0.5 truncate text-base font-semibold text-gray-900">
                    {playlist.title}
                </h3>
                <p class="mt-1 text-xs text-gray-400">
                    {currentIndex >= 0
                        ? `${currentIndex + 1} / ${playlist.videos.length}`
                        : `${playlist.videos.length} videos`}
                </p>
            </div>

            <!-- Quick Prev / Next buttons -->
            <div class="flex shrink-0 items-center gap-1">
                <a
                    href={prevVideo
                        ? resolve(buildPlayHref(prevVideo.videoId ?? prevVideo.id))
                        : "#"}
                    class={`rounded-lg p-2 text-gray-400 transition-colors ${
                        prevVideo
                            ? "hover:bg-gray-200 hover:text-gray-900"
                            : "pointer-events-none opacity-30"
                    }`}
                    title="Previous Video"
                >
                    <Icon icon="lucide:skip-back" class="h-4 w-4" />
                </a>
                <a
                    href={nextVideo
                        ? resolve(buildPlayHref(nextVideo.videoId ?? nextVideo.id))
                        : "#"}
                    class={`rounded-lg p-2 text-gray-400 transition-colors ${
                        nextVideo
                            ? "hover:bg-gray-200 hover:text-gray-900"
                            : "pointer-events-none opacity-30"
                    }`}
                    title="Next Video"
                >
                    <Icon icon="lucide:skip-forward" class="h-4 w-4" />
                </a>
            </div>
        </div>
    </div>

    <!-- Video List Items -->
    <div class="max-h-80 divide-y divide-gray-100 overflow-y-auto p-1">
        {#each playlist.videos as item, idx (item.id)}
            {@const isCurrent = (item.videoId ?? item.id) === currentVideoId}
            <a
                href={resolve(buildPlayHref(item.videoId ?? item.id))}
                class={`group flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                    isCurrent
                        ? "border-l-4 border-l-gray-900 bg-gray-100/90 font-semibold"
                        : "hover:bg-gray-50"
                }`}
            >
                <!-- Number or Playing Icon -->
                <div class="w-5 shrink-0 text-center font-mono text-xs font-medium">
                    {#if isCurrent}
                        <Icon
                            icon="lucide:volume-2"
                            class="inline h-4 w-4 animate-pulse text-gray-900"
                        />
                    {:else}
                        <span class="text-gray-400 group-hover:text-gray-900">{idx + 1}</span>
                    {/if}
                </div>

                <!-- Thumbnail -->
                <div
                    class="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200"
                >
                    {#if item.thumbnail?.small || item.thumbnail?.medium}
                        <img
                            src={item.thumbnail.small || item.thumbnail.medium}
                            alt={item.title}
                            class="h-full w-full object-cover"
                        />
                    {:else}
                        <div class="flex h-full w-full items-center justify-center text-gray-400">
                            <Icon icon="lucide:film" class="h-4 w-4" />
                        </div>
                    {/if}
                    <div
                        class="py-0.2 absolute right-0.5 bottom-0.5 rounded bg-black/80 px-1 text-[9px] font-medium text-white"
                    >
                        {formatDuration(item.duration)}
                    </div>
                </div>

                <!-- Title & Duration -->
                <div class="min-w-0 flex-1">
                    <p
                        class={`truncate text-xs leading-snug font-medium ${isCurrent ? "font-semibold text-gray-900" : "text-gray-800 group-hover:text-theme-600"}`}
                    >
                        {item.title}
                    </p>
                    <p class="mt-0.5 font-mono text-[11px] text-gray-400">
                        {formatDuration(item.duration)}
                    </p>
                </div>
            </a>
        {/each}
    </div>
</div>
