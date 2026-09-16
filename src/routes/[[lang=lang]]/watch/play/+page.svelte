<script lang="ts">
    import { page } from "$app/state";
    import { PUBLIC_API_URL } from "$env/static/public";

    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";
    import { getWatchTranslation } from "$lib/i18n/watch";

    import AppMainSection from "../_components/AppMainSection.svelte";
    import PlayRecommendedVideos from "./_components/PlayRecommendedVideos.svelte";
    import PlayVideoInfo from "./_components/PlayVideoInfo.svelte";

    let { data } = $props();

    const t = $derived(getWatchTranslation(data.lang));
    const video = $derived(data.video);

    const basePath = $derived(page.params.lang ? `/${page.params.lang}/watch` : "/watch");
    const buildPlayHref = (id: string): string => `${basePath}/play?v=${id}`;
    const categoryHref = $derived(
        video.categorySlug ? `${basePath}?category=${video.categorySlug}` : basePath
    );

    const playSource = $derived(
        video.p1080 && video.p1080 !== "processing"
            ? video.p1080
            : video.p720 && video.p720 !== "processing"
              ? video.p720
              : video.p360 && video.p360 !== "processing"
                ? video.p360
                : "processing"
    );

    let isPlaying = $state(false);
    let watchedSeconds = 0;
    let lastTime: number | null = null;
    let viewRecorded = false;

    const recordView = async () => {
        try {
            await fetch(`${PUBLIC_API_URL}/video/${video.id}/view`, { method: "POST" });
        } catch {
            // view tracking is non-critical — fail silently
        }
    };

    const handleTimeUpdate = (event: CustomEvent<{ currentTime: number; duration: number }>) => {
        if (viewRecorded) return;
        const { currentTime, duration } = event.detail;

        if (isPlaying && lastTime !== null) {
            const delta = currentTime - lastTime;
            if (delta > 0 && delta < 2) watchedSeconds += delta;
        }
        lastTime = currentTime;

        if (duration <= 0) return;
        const threshold = Math.min(10, Math.max(5, duration * 0.2));
        if (watchedSeconds >= threshold) {
            viewRecorded = true;
            void recordView();
        }
    };
</script>

<svelte:head>
    <title>{video.title ?? t.videoNotFound}</title>
    {#if video.description}
        <meta name="description" content={video.description} />
    {/if}
</svelte:head>

<AppMainSection>
    <div class="pt-0 pb-10 md:pt-6 md:pb-16 lg:pt-8 lg:pb-16">
        <div class="grid grid-cols-1 gap-5 md:gap-7 lg:grid-cols-[1fr_380px] lg:gap-8">
            <div class="min-w-0">
                <div
                    class="relative -mx-5 aspect-video w-auto overflow-hidden rounded-none bg-black shadow-lg md:mx-0 md:w-full md:rounded-2xl"
                >
                    <VideoPlayer
                        source={playSource}
                        logoUrl={data.logoUrl}
                        title={video.title ?? ""}
                        on:play={() => (isPlaying = true)}
                        on:pause={() => (isPlaying = false)}
                        on:ended={() => (isPlaying = false)}
                        on:timeupdate={handleTimeUpdate}
                    />
                </div>
                <PlayVideoInfo {video} lang={data.lang} {t} {categoryHref} />
            </div>
            <div class="w-full lg:w-95">
                <PlayRecommendedVideos
                    videos={data.recommended}
                    lang={data.lang}
                    viewsLabel={t.views}
                    heading={t.recommendedVideos}
                    {buildPlayHref}
                />
            </div>
        </div>
    </div>
</AppMainSection>
