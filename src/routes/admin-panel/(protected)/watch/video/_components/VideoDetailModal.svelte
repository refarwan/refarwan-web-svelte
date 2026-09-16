<script lang="ts">
    import { ExternalLinkIcon, EyeIcon, XIcon } from "lucide-svelte/icons";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    import VideoPlayer from "$lib/components/video-player/VideoPlayer.svelte";

    import VideoEmbedSection from "./VideoEmbedSection.svelte";
    import VideoResolutionChips from "./VideoResolutionChips.svelte";

    import type { VideoDetail } from "$lib/types";

    interface Props {
        t: Record<string, string>;
        video: VideoDetail;
        logoUrl: string;
        onClose: () => void;
    }

    let { t, video, logoUrl, onClose }: Props = $props();

    const playSource = $derived(
        video.p1080 && video.p1080 !== "processing"
            ? video.p1080
            : video.p720 && video.p720 !== "processing"
              ? video.p720
              : video.p360 && video.p360 !== "processing"
                ? video.p360
                : "processing"
    );

    const watchUrl = $derived(`${page.url.origin}/watch/play?v=${video.id}`);
    const embedUrl = $derived(`${page.url.origin}/watch/embed?v=${video.id}`);
    const editHref = resolve("/admin-panel/(protected)/watch/video/edit/[id]", { id: video.id });

    const formattedDate = $derived(
        new Date(video.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    );

    const statusBadgeClass = $derived(
        video.status === "published"
            ? "bg-emerald-50 text-emerald-700"
            : video.status === "archived"
              ? "bg-gray-100 text-gray-600"
              : "bg-amber-50 text-amber-700"
    );
</script>

<div
    class="w-[92vw] max-w-2xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
>
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">{t.detailModalTitle}</h3>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title={t.closeLabel}
        >
            <XIcon class="h-5 w-5" />
        </button>
    </div>

    <div class="max-h-[75vh] space-y-4 overflow-y-auto p-6">
        <VideoPlayer source={playSource} {logoUrl} title={video.title ?? ""} />

        <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-theme-600 hover:underline"
        >
            <ExternalLinkIcon class="h-3.5 w-3.5" />
            {t.watchOnSiteLabel}
        </a>

        <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span
                class={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${statusBadgeClass}`}
            >
                {video.status}
            </span>
            <span>{video.category ?? t.noCategory}</span>
            <span class="flex items-center gap-1">
                <EyeIcon class="h-3.5 w-3.5" />
                {video.viewsCount}
                {t.viewsSuffix}
            </span>
            <span>{t.uploadedOnLabel} {formattedDate}</span>
        </div>

        <div>
            <h4 class="text-sm font-semibold text-gray-900">{video.title ?? "—"}</h4>
            <p class="mt-1 text-sm whitespace-pre-line text-gray-600">
                {video.description || t.noDescriptionPlaceholder}
            </p>
        </div>

        <VideoResolutionChips {t} p360={video.p360} p720={video.p720} p1080={video.p1080} />

        <VideoEmbedSection {t} {embedUrl} />
    </div>

    <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
            {t.closeLabel}
        </button>
        <a
            href={editHref}
            class="cursor-pointer rounded-md bg-theme-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-theme-700"
        >
            {t.editVideoLabel}
        </a>
    </div>
</div>
