/** Toggles the browser Fullscreen API on the given container or video element (for iOS Safari) and tracks its state. */

interface WebkitVideoElement extends HTMLVideoElement {
    webkitSupportsFullscreen?: boolean;
    webkitDisplayingFullscreen?: boolean;
    webkitEnterFullscreen?: () => void;
    webkitExitFullscreen?: () => void;
    webkitSupportsPresentationMode?: (mode: string) => boolean;
    webkitPresentationMode?: string;
    webkitSetPresentationMode?: (mode: string) => void;
}

interface WebkitDocument extends Document {
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void> | void;
}

interface WebkitHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void> | void;
}

export function useFullscreen(
    getContainerEl: () => HTMLElement | undefined,
    getVideoEl?: () => HTMLVideoElement | undefined
) {
    let isFullscreen = $state(false);

    const toggleFullscreen = () => {
        const container = getContainerEl();
        const video = getVideoEl?.() as WebkitVideoElement | undefined;
        const doc = document as WebkitDocument;
        const containerEl = container as WebkitHTMLElement | undefined;

        // 1. If container standard fullscreen is active -> exit
        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
            if (doc.exitFullscreen) {
                doc.exitFullscreen().catch(() => {});
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
            return;
        }

        // 2. If iOS native video fullscreen is active -> exit
        if (video?.webkitDisplayingFullscreen) {
            video.webkitExitFullscreen?.();
            return;
        }

        // 3. Try entering container element fullscreen
        const isContainerFullscreenSupported = Boolean(
            containerEl && (containerEl.requestFullscreen || containerEl.webkitRequestFullscreen)
        );

        if (isContainerFullscreenSupported && containerEl) {
            if (containerEl.requestFullscreen) {
                containerEl.requestFullscreen().catch(() => {});
                return;
            } else if (containerEl.webkitRequestFullscreen) {
                containerEl.webkitRequestFullscreen();
                return;
            }
        }

        // 4. Fallback for iOS Safari (iPhone / iPad native video player)
        if (video) {
            if (typeof video.webkitEnterFullscreen === "function") {
                video.webkitEnterFullscreen();
            } else if (
                typeof video.webkitSetPresentationMode === "function" &&
                video.webkitSupportsPresentationMode?.("fullscreen")
            ) {
                video.webkitSetPresentationMode("fullscreen");
            }
        }
    };

    $effect(() => {
        const doc = document as WebkitDocument;

        const checkFullscreenState = () => {
            const video = getVideoEl?.() as WebkitVideoElement | undefined;

            const isDocFullscreen = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
            const isVideoFullscreen = Boolean(
                video?.webkitDisplayingFullscreen || video?.webkitPresentationMode === "fullscreen"
            );

            isFullscreen = isDocFullscreen || isVideoFullscreen;
        };

        const docEvents = [
            "fullscreenchange",
            "webkitfullscreenchange",
            "mozfullscreenchange",
            "MSFullscreenChange"
        ];
        docEvents.forEach((event) => document.addEventListener(event, checkFullscreenState));

        const video = getVideoEl?.() as WebkitVideoElement | undefined;
        const videoEvents = [
            "webkitbeginfullscreen",
            "webkitendfullscreen",
            "webkitpresentationmodechanged"
        ];

        if (video) {
            videoEvents.forEach((event) => video.addEventListener(event, checkFullscreenState));
        }

        return () => {
            docEvents.forEach((event) => document.removeEventListener(event, checkFullscreenState));
            if (video) {
                videoEvents.forEach((event) => video.removeEventListener(event, checkFullscreenState));
            }
        };
    });

    return {
        get isFullscreen() {
            return isFullscreen;
        },
        toggleFullscreen
    };
}

