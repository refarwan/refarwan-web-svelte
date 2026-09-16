/** Play/pause, volume, and playback-speed state bound to a `<video>` element. */
export function usePlayerControls(getVideoEl: () => HTMLVideoElement | undefined) {
    let isPlaying = $state(false);
    let currentTime = $state(0);
    let duration = $state(0);
    let volume = $state(1);
    let isMuted = $state(false);
    let playbackRate = $state(1);
    let isBuffering = $state(false);

    const togglePlay = () => {
        const el = getVideoEl();
        if (!el) return;
        if (el.paused) void el.play();
        else el.pause();
    };

    const seek = (time: number) => {
        const el = getVideoEl();
        if (!el || !Number.isFinite(time)) return;
        el.currentTime = time;
        currentTime = time;
    };

    const setVolume = (value: number) => {
        const el = getVideoEl();
        if (!el) return;
        volume = value;
        isMuted = value === 0;
        el.volume = value;
        el.muted = isMuted;
    };

    const toggleMute = () => {
        const el = getVideoEl();
        if (!el) return;
        isMuted = !isMuted;
        el.muted = isMuted;
    };

    const setPlaybackRate = (rate: number) => {
        const el = getVideoEl();
        if (!el) return;
        playbackRate = rate;
        el.playbackRate = rate;
    };

    const onTimeUpdate = () => {
        currentTime = getVideoEl()?.currentTime ?? 0;
    };

    const onLoadedMetadata = () => {
        duration = getVideoEl()?.duration || 0;
    };

    const onPlay = () => (isPlaying = true);
    const onPause = () => (isPlaying = false);

    // "waiting" fires when playback stalls for lack of data; "playing" fires
    // once frames are actually rendering again (after "waiting", after a
    // seek, or on initial start), so together they track real buffering
    // rather than just the play/pause intent.
    const onWaiting = () => (isBuffering = true);
    const onPlaying = () => (isBuffering = false);

    return {
        get isPlaying() {
            return isPlaying;
        },
        get currentTime() {
            return currentTime;
        },
        get duration() {
            return duration;
        },
        get volume() {
            return volume;
        },
        get isMuted() {
            return isMuted;
        },
        get playbackRate() {
            return playbackRate;
        },
        get isBuffering() {
            return isBuffering;
        },
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        setPlaybackRate,
        onTimeUpdate,
        onLoadedMetadata,
        onPlay,
        onPause,
        onWaiting,
        onPlaying
    };
}
