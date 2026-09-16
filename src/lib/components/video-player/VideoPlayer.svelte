<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { LoaderCircleIcon, PlayIcon } from "lucide-svelte/icons";

    import PlayerControls from "./PlayerControls.svelte";
    import PlayerProcessingBanner from "./PlayerProcessingBanner.svelte";
    import PlayerTopBar from "./PlayerTopBar.svelte";
    import { useFullscreen } from "./use-fullscreen.svelte";
    import { useHlsSource } from "./use-hls-source.svelte";
    import { usePlayerControls } from "./use-player-controls.svelte";

    import type { ResolutionOption } from "./resolution";

    interface Props {
        sources: ResolutionOption[];
        logoUrl?: string;
        title?: string;
        watchUrl?: string;
        playOnWatchLabel?: string;
        thumbnailUrl: string;
        class?: string;
    }

    let {
        sources,
        logoUrl,
        title,
        watchUrl,
        playOnWatchLabel,
        thumbnailUrl,
        class: className = ""
    }: Props = $props();

    // Shown in place of the video until playback first starts, so the poster
    // (rather than a blank black box) is what the visitor sees while hls.js
    // preloads the stream in the background.
    let hasStartedPlaying = $state(false);
    let thumbnailLoaded = $state(false);

    const dispatch = createEventDispatcher<{
        play: void;
        pause: void;
        ended: void;
        timeupdate: { currentTime: number; duration: number };
    }>();

    let videoEl: HTMLVideoElement | undefined = $state();
    let containerEl: HTMLDivElement | undefined = $state();
    let showControls = $state(true);
    let hideControlsTimer: ReturnType<typeof setTimeout> | undefined;

    const hlsSource = useHlsSource(
        () => videoEl,
        () => sources
    );
    const controls = usePlayerControls(() => videoEl);
    const fullscreen = useFullscreen(
        () => containerEl,
        () => videoEl
    );

    const scheduleHideControls = () => {
        clearTimeout(hideControlsTimer);
        if (!controls.isPlaying) return;
        hideControlsTimer = setTimeout(() => (showControls = false), 2500);
    };

    const onActivity = () => {
        showControls = true;
        scheduleHideControls();
    };

    const onVideoClick = () => {
        controls.togglePlay();
        onActivity();
    };

    const onPlay = () => {
        controls.onPlay();
        hasStartedPlaying = true;
        scheduleHideControls();
        dispatch("play");
    };

    const onPause = () => {
        controls.onPause();
        showControls = true;
        clearTimeout(hideControlsTimer);
        dispatch("pause");
    };

    const onTimeUpdate = () => {
        controls.onTimeUpdate();
        dispatch("timeupdate", { currentTime: controls.currentTime, duration: controls.duration });
    };

    const onEnded = () => {
        showControls = true;
        clearTimeout(hideControlsTimer);
        dispatch("ended");
    };
</script>

<div
    bind:this={containerEl}
    onmousemove={onActivity}
    onpointerdown={onActivity}
    role="presentation"
    class={`group relative aspect-video w-full overflow-hidden bg-black select-none ${className}`}
>
    <video
        bind:this={videoEl}
        onclick={onVideoClick}
        ondblclick={fullscreen.toggleFullscreen}
        onplay={onPlay}
        onpause={onPause}
        ontimeupdate={onTimeUpdate}
        onloadedmetadata={controls.onLoadedMetadata}
        onwaiting={controls.onWaiting}
        onplaying={controls.onPlaying}
        onended={onEnded}
        playsinline
        class="h-full w-full object-contain"
    ></video>

    {#if hlsSource.isProcessing}
        <PlayerProcessingBanner />
    {:else if hlsSource.hasError}
        <div
            class="absolute inset-0 flex items-center justify-center bg-black text-sm text-gray-300"
        >
            Failed to load video.
        </div>
    {:else}
        {#if thumbnailUrl && !hasStartedPlaying}
            <button
                type="button"
                onclick={onVideoClick}
                aria-label="Play video"
                class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black"
            >
                {#if !thumbnailLoaded}
                    <LoaderCircleIcon class="h-10 w-10 animate-spin text-white/70" />
                {/if}
                <img
                    src={thumbnailUrl}
                    alt=""
                    onload={() => (thumbnailLoaded = true)}
                    class={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                        thumbnailLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
                <div class="absolute inset-0 bg-black/20 transition-colors hover:bg-black/10"></div>
                <div
                    class="absolute grid h-14 w-14 place-content-center rounded-full bg-theme-600 text-white shadow-xl transition-transform hover:scale-110"
                >
                    <PlayIcon class="h-6 w-6 translate-x-0.5" fill="currentColor" />
                </div>
            </button>
        {/if}

        {#if controls.isBuffering}
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
                <LoaderCircleIcon class="h-12 w-12 animate-spin text-white/90 drop-shadow-md" />
            </div>
        {/if}

        <div
            class={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                showControls || !controls.isPlaying ? "opacity-100" : "opacity-0"
            }`}
        >
            <div class="pointer-events-auto">
                <PlayerTopBar {logoUrl} {title} {watchUrl} {playOnWatchLabel} />
            </div>
            <div class="pointer-events-auto">
                <PlayerControls
                    isPlaying={controls.isPlaying}
                    currentTime={controls.currentTime}
                    duration={controls.duration}
                    volume={controls.volume}
                    isMuted={controls.isMuted}
                    playbackRate={controls.playbackRate}
                    isFullscreen={fullscreen.isFullscreen}
                    resolutions={hlsSource.resolutions}
                    selectedQuality={hlsSource.selectedQuality}
                    onTogglePlay={controls.togglePlay}
                    onToggleMute={controls.toggleMute}
                    onVolumeChange={controls.setVolume}
                    onSelectRate={controls.setPlaybackRate}
                    onSelectQuality={hlsSource.setQuality}
                    onToggleFullscreen={fullscreen.toggleFullscreen}
                    onSeek={controls.seek}
                />
            </div>
        </div>
    {/if}
</div>
