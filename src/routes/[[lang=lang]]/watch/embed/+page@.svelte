<script lang="ts">
    import { page } from "$app/state";

    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";
    import { resolutionsFromSources } from "$lib/components/video-player/resolution";
    import { getWatchTranslation } from "$lib/i18n/watch";

    let { data } = $props();

    const t = $derived(getWatchTranslation(data.lang));
    const video = $derived(data.video);
    const playSources = $derived(video ? resolutionsFromSources(video.sources) : []);
    const basePath = $derived(page.params.lang ? `/${page.params.lang}/watch` : "/watch");
    const watchUrl = $derived(
        video ? `${page.url.origin}${basePath}/play?v=${video.id}` : undefined
    );
</script>

<svelte:head>
    <title>{video?.title ?? "Video Not Found"}</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="relative h-screen w-screen overflow-hidden bg-black">
    {#if video}
        <VideoPlayer
            sources={playSources}
            logoUrl={data.logoUrl}
            title={video.title ?? ""}
            thumbnailUrl={video.thumbnail.large}
            {watchUrl}
            playOnWatchLabel={t.playOnWatch}
            class="h-full w-full"
        />
    {:else}
        <div
            class="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-white"
        >
            <p class="text-lg font-semibold">Video Not Found</p>
            <p class="text-sm text-gray-400">
                This video may have been deleted, archived, or is unavailable.
            </p>
        </div>
    {/if}
</main>
