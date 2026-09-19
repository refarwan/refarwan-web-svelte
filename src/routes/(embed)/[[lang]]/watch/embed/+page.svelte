<script lang="ts">
    import { page } from "$app/state";
    import { resolutionsFromSources } from "$lib/components/video-player/resolution";
    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch";

    import type { ResolvedPathname } from "$app/types";
    import type { ContentLocale } from "$lib/i18n/types";

    let { data } = $props();

    const currentLang = $derived<ContentLocale>(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);
    const video = $derived(data.video);
    const playSources = $derived(video ? resolutionsFromSources(video.sources) : []);
    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);
    const watchUrl = $derived(
        video ? (`${page.url.origin}${basePath}/play?v=${video.id}` as ResolvedPathname) : undefined
    );
</script>

<svelte:head>
    <title>{video?.title ?? t.videoNotFound} | {data.metadata.title} Watch Embed</title>
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
            <p class="text-lg font-semibold">{t.videoNotFound}</p>
            <p class="text-sm text-gray-400">
                This video may have been deleted, archived, or is unavailable.
            </p>
        </div>
    {/if}
</main>
