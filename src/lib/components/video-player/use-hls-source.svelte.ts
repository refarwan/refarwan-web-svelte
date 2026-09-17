import Hls from "hls.js";

import { pickAutoSource, readyResolutions } from "./resolution";

import type { ResolutionOption } from "./resolution";

/**
 * Attaches the active resolution's URL to the given video element, using
 * hls.js for `.m3u8` playlists on browsers without native HLS support
 * (falling back to a plain `src` assignment otherwise, e.g. Safari or a
 * direct MP4 file). Re-attaches whenever the selected quality or the
 * available resolutions change, preserving playback position, play state,
 * and speed across the switch.
 */
export function useHlsSource(
    getVideoEl: () => HTMLVideoElement | undefined,
    getResolutions: () => ResolutionOption[]
) {
    let hasError = $state(false);
    let selectedQuality = $state<number | "auto">("auto");
    let hls: Hls | null = null;

    // Captured the instant before the previous source is torn down. Svelte
    // runs an effect's cleanup (below) before re-running the effect body, and
    // hls.destroy() itself resets the video element (removeAttribute("src") +
    // load()) as part of detaching — by the time the new effect body runs,
    // videoEl.currentTime/paused have already been reset. Reading them here,
    // inside cleanup, is the only point where they're still accurate.
    let pendingResumeTime = 0;
    let pendingWasPlaying = false;
    let pendingPlaybackRate = 1;

    const cleanup = () => {
        const videoEl = getVideoEl();
        if (videoEl) {
            pendingResumeTime = videoEl.currentTime || 0;
            pendingWasPlaying = !videoEl.paused;
            pendingPlaybackRate = videoEl.playbackRate;
        }
        hls?.destroy();
        hls = null;
    };

    const activeSource = $derived.by(() => {
        const resolutions = getResolutions();
        if (selectedQuality === "auto") return pickAutoSource(resolutions);
        return (
            readyResolutions(resolutions).find(
                (resolution) => resolution.quality === selectedQuality
            ) ?? pickAutoSource(resolutions)
        );
    });

    const isProcessing = $derived(
        readyResolutions(getResolutions()).length === 0 &&
            getResolutions().some((resolution) => resolution.status === "processing")
    );

    $effect(() => {
        const videoEl = getVideoEl();
        const url = activeSource?.url;

        // Svelte already invoked the previous run's cleanup (which populated
        // pending* from the video's state right before hls.destroy() reset
        // it) before this body runs, so read the snapshot rather than the
        // (by now reset) video element.
        const resumeTime = pendingResumeTime;
        const wasPlaying = pendingWasPlaying;
        const playbackRate = pendingPlaybackRate;

        hasError = false;

        if (!videoEl || !url) return;

        const resumePlayback = () => {
            videoEl.playbackRate = playbackRate;
            if (wasPlaying) void videoEl.play().catch(() => undefined);
        };

        if (url.includes(".m3u8") && Hls.isSupported()) {
            const instance = new Hls();
            hls = instance;

            instance.on(Hls.Events.ERROR, (_event, data) => {
                if (!data.fatal) return;
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    instance.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    instance.recoverMediaError();
                } else {
                    hasError = true;
                    cleanup();
                }
            });

            instance.once(Hls.Events.MANIFEST_PARSED, () => {
                if (resumeTime > 0) videoEl.currentTime = resumeTime;
                resumePlayback();
            });

            instance.loadSource(url);
            instance.attachMedia(videoEl);
        } else {
            videoEl.src = url;
            if (resumeTime > 0) videoEl.currentTime = resumeTime;
            videoEl.addEventListener("loadedmetadata", resumePlayback, { once: true });
        }

        return cleanup;
    });

    return {
        get isProcessing() {
            return isProcessing;
        },
        get hasError() {
            return hasError;
        },
        get resolutions() {
            return getResolutions();
        },
        get selectedQuality() {
            return selectedQuality;
        },
        setQuality(quality: number | "auto") {
            selectedQuality = quality;
        }
    };
}
