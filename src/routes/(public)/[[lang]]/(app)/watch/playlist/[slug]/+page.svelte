<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch";
    import { formatDuration, formatViews } from "$lib/utils/watch-format";
    import AppMainSection from "../../../_components/AppMainSection.svelte";

    import type { ResolvedPathname } from "$app/types";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);
    const playlist = $derived(data.playlist);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);

    const firstVideoId = $derived(playlist.videos[0]?.videoId ?? playlist.videos[0]?.id ?? "");
    const playAllHref = $derived(
        firstVideoId
            ? (`${basePath}/play?v=${firstVideoId}&list=${playlist.slug}` as ResolvedPathname)
            : null
    );

    const buildVideoPlayHref = (videoId: string): ResolvedPathname =>
        `${basePath}/play?v=${videoId}&list=${playlist.slug}` as ResolvedPathname;
</script>

<svelte:head>
    <title>{playlist.title} - {t.playlists} | {data.metadata.title} Watch</title>
    <meta name="description" content={playlist.description || playlist.title} />
</svelte:head>

<AppMainSection>
    <div class="space-y-8">
        <!-- Playlist Header Banner (Clean White Card) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xs md:p-8"
        >
            <div class="flex flex-col items-start gap-6 md:flex-row md:gap-8">
                <!-- Cover Card -->
                <div
                    class="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm md:aspect-[16/10] md:w-72 md:shrink-0"
                >
                    {#if playlist.thumbnail?.large || playlist.thumbnail?.medium}
                        <img
                            src={playlist.thumbnail.large || playlist.thumbnail.medium}
                            alt={playlist.title}
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    {:else}
                        <div class="flex h-full w-full items-center justify-center text-gray-400">
                            <Icon icon="lucide:list-video" class="h-16 w-16" />
                        </div>
                    {/if}

                    <div
                        class="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3"
                    >
                        <div
                            class="flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md"
                        >
                            <Icon icon="lucide:film" class="h-3.5 w-3.5 text-gray-300" />
                            <span>{playlist.videoCount} {t.videosSuffix || "videos"}</span>
                        </div>
                    </div>
                </div>

                <!-- Info Details -->
                <div class="flex-1 space-y-4">
                    <div class="space-y-2">
                        <div
                            class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                            <Icon icon="lucide:list-video" class="h-3.5 w-3.5 text-gray-500" />
                            <span>{t.playlist}</span>
                        </div>
                        <h1 class="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                            {playlist.title}
                        </h1>
                    </div>

                    {#if playlist.description}
                        <p
                            class="max-w-3xl text-sm leading-relaxed whitespace-pre-line text-gray-600"
                        >
                            {playlist.description}
                        </p>
                    {/if}

                    <!-- Metadata Stats -->
                    <div class="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500">
                        <div class="flex items-center gap-1.5">
                            <Icon icon="lucide:layers" class="h-4 w-4 text-gray-400" />
                            <span>{playlist.videoCount} {t.videosSuffix || "videos"}</span>
                        </div>
                        <span class="text-gray-300">•</span>
                        <div class="flex items-center gap-1.5">
                            <Icon icon="lucide:clock" class="h-4 w-4 text-gray-400" />
                            <span
                                >{t.totalDuration}:
                                <span class="font-mono"
                                    >{formatDuration(playlist.totalDuration)}</span
                                ></span
                            >
                        </div>
                    </div>

                    <!-- Action Button -->
                    {#if playAllHref}
                        <div class="pt-2">
                            <a
                                href={resolve(playAllHref)}
                                class="inline-flex items-center gap-2.5 rounded-xl bg-theme-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-theme-600/20 transition-all hover:scale-[1.02] hover:bg-theme-700 active:scale-[0.98]"
                            >
                                <Icon icon="lucide:play" class="h-4 w-4 fill-white" />
                                <span>{t.playAll}</span>
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Video List Section -->
        <div class="space-y-4">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Icon icon="lucide:list-ordered" class="h-5 w-5 text-gray-500" />
                <span>{t.playlistVideos}</span>
            </h2>

            <div
                class="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs"
            >
                {#if playlist.videos.length === 0}
                    <div class="p-12 text-center text-sm text-gray-400">
                        <Icon icon="lucide:video-off" class="mx-auto mb-2 h-8 w-8 text-gray-300" />
                        <p>{t.noVideos}</p>
                    </div>
                {:else}
                    {#each playlist.videos as item (item.id)}
                        <a
                            href={resolve(buildVideoPlayHref(item.id))}
                            class="group flex items-center gap-4 p-3.5 transition-colors hover:bg-gray-50/80 md:p-4"
                        >
                            <!-- Index -->
                            <span
                                class="w-6 shrink-0 text-center font-mono text-sm font-medium text-gray-400 group-hover:text-gray-900"
                            >
                                {item.order}
                            </span>

                            <!-- Thumbnail -->
                            <div
                                class="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 md:w-36"
                            >
                                {#if item.thumbnail?.small || item.thumbnail?.medium}
                                    <img
                                        src={item.thumbnail.small || item.thumbnail.medium}
                                        alt={item.title}
                                        class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                {:else}
                                    <div
                                        class="flex h-full w-full items-center justify-center text-gray-400"
                                    >
                                        <Icon icon="lucide:film" class="h-6 w-6" />
                                    </div>
                                {/if}

                                <div
                                    class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <Icon
                                        icon="lucide:play"
                                        class="h-6 w-6 fill-white text-white"
                                    />
                                </div>

                                <div
                                    class="absolute right-1 bottom-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white"
                                >
                                    {formatDuration(item.duration)}
                                </div>
                            </div>

                            <!-- Details -->
                            <div class="min-w-0 flex-1 space-y-1">
                                <h3
                                    class="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-theme-600"
                                >
                                    {item.title}
                                </h3>
                                <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{formatViews(item.viewsCount)} {t.views}</span>
                                    <span>•</span>
                                    <span class="font-mono">{formatDuration(item.duration)}</span>
                                </div>
                            </div>

                            <Icon
                                icon="lucide:chevron-right"
                                class="h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-600"
                            />
                        </a>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</AppMainSection>
