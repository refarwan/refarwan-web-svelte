<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import PlayerControls from "./PlayerControls.svelte";
    import PlayerProcessingBanner from "./PlayerProcessingBanner.svelte";
    import PlayerTopBar from "./PlayerTopBar.svelte";
    import { useFullscreen } from "./use-fullscreen.svelte";
    import { useHlsSource } from "./use-hls-source.svelte";
    import { usePlayerControls } from "./use-player-controls.svelte";

    interface Props {
        source: string;
        logoUrl: string;
        title: string;
        watchUrl?: string;
    }

    let { source, logoUrl, title, watchUrl }: Props = $props();

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
        () => source
    );
    const controls = usePlayerControls(() => videoEl);
    const fullscreen = useFullscreen(() => containerEl);

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
    class="group relative aspect-video w-full overflow-hidden bg-black select-none"
>
    <video
        bind:this={videoEl}
        onclick={onVideoClick}
        ondblclick={fullscreen.toggleFullscreen}
        onplay={onPlay}
        onpause={onPause}
        ontimeupdate={onTimeUpdate}
        onloadedmetadata={controls.onLoadedMetadata}
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
        <div
            class={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                showControls || !controls.isPlaying ? "opacity-100" : "opacity-0"
            }`}
        >
            <div class="pointer-events-auto">
                <PlayerTopBar {logoUrl} {title} {watchUrl} />
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
                    onTogglePlay={controls.togglePlay}
                    onToggleMute={controls.toggleMute}
                    onVolumeChange={controls.setVolume}
                    onSelectRate={controls.setPlaybackRate}
                    onToggleFullscreen={fullscreen.toggleFullscreen}
                    onSeek={controls.seek}
                />
            </div>
        </div>
    {/if}
</div>
