<script lang="ts">
    import { page } from "$app/state";

    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";
    import { resolutionsFromFields } from "$lib/components/video-player/resolution";

    import WatchDetailEmbedSection from "./WatchDetailEmbedSection.svelte";
    import WatchDetailFooter from "./WatchDetailFooter.svelte";
    import WatchDetailHeader from "./WatchDetailHeader.svelte";
    import WatchDetailInfoBar from "./WatchDetailInfoBar.svelte";
    import WatchDetailLangTabs from "./WatchDetailLangTabs.svelte";
    import WatchDetailResolutions from "./WatchDetailResolutions.svelte";
    import { buildTabLanguages, resolveActiveContent } from "./watch-detail-content";

    import type { ContentLanguage, VideoDetail } from "$lib/types";

    interface Props {
        video: VideoDetail;
        lang?: string;
        contentLanguages?: ContentLanguage[];
        onClose: () => void;
        onRefresh?: () => Promise<void> | void;
    }

    let { video, lang = "en", contentLanguages = [], onClose, onRefresh }: Props = $props();

    const isEn = $derived(lang === "en" || lang === "en-US");
    const playSources = $derived(resolutionsFromFields(video.p360, video.p720, video.p1080));

    const watchUrl = $derived(`${page.url.origin}/watch/play?v=${video.id}`);
    const embedUrl = $derived(`${page.url.origin}/watch/embed?v=${video.id}`);
    const iframeCode = $derived(
        `<iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`
    );

    const tabLanguages = $derived(buildTabLanguages(contentLanguages, video));

    let selectedLangCode = $state<string | null>(null);

    const activeLangCode = $derived(
        selectedLangCode && tabLanguages.some((l) => l.code === selectedLangCode?.toLowerCase())
            ? selectedLangCode.toLowerCase()
            : tabLanguages[0]?.code?.toLowerCase() || "en"
    );

    const activeContent = $derived(resolveActiveContent(video, activeLangCode));

    const formattedDate = $derived(
        new Date(video.createdAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    );
</script>

<div
    class="flex h-auto max-h-[90vh] w-[94vw] max-w-89.5 flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:max-w-125 md:h-175 md:max-w-150"
    role="dialog"
    aria-modal="true"
>
    <WatchDetailHeader {isEn} {onClose} />

    <!-- Body (Scrollable) -->
    <div
        class="flex min-h-0 w-full flex-1 flex-col items-start gap-5 overflow-y-auto px-6 py-5 select-text"
    >
        <WatchDetailLangTabs
            {tabLanguages}
            {activeLangCode}
            onSelect={(code) => (selectedLangCode = code)}
        />

        <!-- Svelte Video Player -->
        <div
            class="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-black shadow-sm"
        >
            <VideoPlayer sources={playSources} thumbnailUrl={video.thumbnail.medium} {watchUrl} />
        </div>

        <WatchDetailInfoBar
            status={video.status}
            category={video.category}
            duration={video.duration}
            viewsCount={video.viewsCount}
            {lang}
            {isEn}
        />

        <!-- Title -->
        <div class="w-full shrink-0 space-y-1">
            <p class="text-[16px] leading-snug font-semibold text-gray-900">
                {activeContent.title || (isEn ? "Untitled" : "Tanpa Judul")}
            </p>
            {#if activeContent.isFallback}
                <p class="text-[11px] text-amber-600">
                    * {isEn
                        ? `No ${activeLangCode.toUpperCase()} translation. Showing default content.`
                        : `Belum ada terjemahan bahasa ${activeLangCode.toUpperCase()}. Menampilkan konten default.`}
                </p>
            {/if}
        </div>

        <!-- Upload Date -->
        <div class="flex w-full shrink-0 flex-col items-start">
            <div class="flex flex-col items-start gap-1">
                <p class="text-[12px] font-medium text-gray-500">
                    {isEn ? "Upload Date" : "Tanggal Upload"}
                </p>
                <span class="text-[13px] font-medium text-gray-700">
                    {formattedDate}
                </span>
            </div>
        </div>

        <WatchDetailResolutions
            p360={video.p360}
            p720={video.p720}
            p1080={video.p1080}
            {isEn}
            {onRefresh}
        />

        <!-- Description -->
        <div class="flex w-full shrink-0 flex-col items-start gap-1.5">
            <p class="text-[12px] font-medium text-gray-500">
                {isEn ? "Description" : "Deskripsi"}
            </p>
            <p class="w-full text-[13px] whitespace-pre-wrap text-gray-700">
                {activeContent.description ||
                    (isEn ? "No description provided." : "Tidak ada deskripsi.")}
            </p>
        </div>

        <WatchDetailEmbedSection {embedUrl} {iframeCode} {isEn} />
    </div>

    <WatchDetailFooter {isEn} videoId={video.id} {onClose} />
</div>
