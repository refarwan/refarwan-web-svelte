<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { resolutionsFromFields } from "$lib/components/video-player/resolution";
    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";
    import { WATCH_TRANSLATIONS } from "$lib/i18n/watch";
    import AppMainSection from "../../_components/AppMainSection.svelte";
    import PlayRecommendedVideos from "./_components/PlayRecommendedVideos.svelte";
    import PlayVideoInfo from "./_components/PlayVideoInfo.svelte";

    import type { ResolvedPathname } from "$app/types";

    let { data } = $props();

    const currentLang = $derived(data?.currentLang ?? "en-US");
    const t = $derived(WATCH_TRANSLATIONS[currentLang]);
    const video = $derived(data.video);

    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);
    const basePath = $derived(`${localePrefix}/watch`);
    const buildPlayHref = (id: string): ResolvedPathname =>
        `${basePath}/play?v=${id}` as ResolvedPathname;
    const categoryHref = $derived(
        video.categorySlug ? `${basePath}?category=${video.categorySlug}` : basePath
    );

    const playSources = $derived(resolutionsFromFields(video.p360, video.p720, video.p1080));

    let isPlaying = $state(false);
    let watchedSeconds = 0;
    let lastTime: number | null = null;
    let viewRecorded = false;

    const recordView = async () => {
        try {
            const apiUrl = env.PUBLIC_API_URL || "http://localhost:3000";
            await fetch(`${apiUrl}/video/${video.id}/view`, { method: "POST" });
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
    <title>{video.title ?? t.videoNotFound} | {data.metadata.title} Watch</title>
</svelte:head>

<AppMainSection>
    <div>
        <div class="grid grid-cols-1 gap-5 md:gap-7 lg:grid-cols-[1fr_380px] lg:gap-8">
            <div class="min-w-0">
                <div
                    class="relative -mx-5 aspect-video w-auto overflow-hidden rounded-none bg-black md:mx-0 md:w-full md:rounded-2xl"
                >
                    <VideoPlayer
                        sources={playSources}
                        thumbnailUrl={video.thumbnail.large}
                        on:play={() => (isPlaying = true)}
                        on:pause={() => (isPlaying = false)}
                        on:ended={() => (isPlaying = false)}
                        on:timeupdate={handleTimeUpdate}
                    />
                </div>
                <PlayVideoInfo {video} lang={currentLang} {t} {categoryHref} />
            </div>
            <div class="w-full lg:w-95">
                <PlayRecommendedVideos
                    videos={data.recommended}
                    lang={currentLang}
                    viewsLabel={t.views}
                    heading={t.recommendedVideos}
                    {buildPlayHref}
                />
            </div>
        </div>
    </div>
</AppMainSection>
