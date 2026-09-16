import Hls from "hls.js";

/**
 * Attaches `source` to the given video element, using hls.js for `.m3u8`
 * playlists on browsers without native HLS support (falling back to a plain
 * `src` assignment otherwise, e.g. Safari or a direct MP4 file). Re-attaches
 * whenever `source` changes, preserving the current playback position.
 */
export function useHlsSource(
    getVideoEl: () => HTMLVideoElement | undefined,
    getSource: () => string
) {
    let isProcessing = $state(false);
    let hasError = $state(false);
    let hls: Hls | null = null;

    const cleanup = () => {
        hls?.destroy();
        hls = null;
    };

    $effect(() => {
        const videoEl = getVideoEl();
        const source = getSource();
        cleanup();
        hasError = false;

        if (!videoEl || !source) {
            isProcessing = false;
            return;
        }

        if (source === "processing") {
            isProcessing = true;
            return;
        }
        isProcessing = false;

        const resumeTime = videoEl.currentTime || 0;

        if (source.includes(".m3u8") && Hls.isSupported()) {
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

            if (resumeTime > 0) {
                instance.once(Hls.Events.MANIFEST_PARSED, () => {
                    videoEl.currentTime = resumeTime;
                });
            }

            instance.loadSource(source);
            instance.attachMedia(videoEl);
        } else {
            videoEl.src = source;
            if (resumeTime > 0) videoEl.currentTime = resumeTime;
        }

        return cleanup;
    });

    return {
        get isProcessing() {
            return isProcessing;
        },
        get hasError() {
            return hasError;
        }
    };
}
