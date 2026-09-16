<script lang="ts">
    import { page } from "$app/state";

    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";

    let { data } = $props();

    const video = $derived(data.video);
    const playSource = $derived(video?.sources[0]?.url ?? "processing");
    const watchUrl = $derived(video ? `${page.url.origin}/watch/play?v=${video.id}` : undefined);
</script>

<svelte:head>
    <title>{video?.title ?? "Video Not Found"}</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="relative h-screen w-screen overflow-hidden bg-black">
    {#if video}
        <VideoPlayer
            source={playSource}
            logoUrl={data.logoUrl}
            title={video.title ?? ""}
            {watchUrl}
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
