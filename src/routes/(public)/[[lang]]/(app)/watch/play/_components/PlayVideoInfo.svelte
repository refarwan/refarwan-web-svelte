<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { formatTimeAgo, formatViews } from "$lib/utils/watch-format";

    import type { WatchTranslation } from "$lib/i18n/watch";
    import type { PublicVideoDetail } from "$lib/types/video";

    interface Props {
        video: PublicVideoDetail;
        lang: string;
        t: WatchTranslation;
        categoryHref: string;
    }

    let { video, lang, t, categoryHref }: Props = $props();

    let copied = $state(false);
    let copyTimer: ReturnType<typeof setTimeout> | undefined;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            copied = true;
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => (copied = false), 2000);
        } catch {
            // clipboard access denied — non-critical
        }
    };
</script>

<div class="mt-4 space-y-3">
    {#if video.category}
        <a
            href={resolve(categoryHref)}
            class="inline-flex rounded-full bg-theme-50 px-3 py-1 text-xs font-medium text-theme-700 hover:bg-theme-100"
        >
            {video.category}
        </a>
    {/if}

    <h1 class="text-xl font-bold text-gray-900 md:text-2xl">{video.title ?? "—"}</h1>

    <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-gray-500">
            {formatViews(video.viewsCount)}
            {t.views} • {formatTimeAgo(video.createdAt, lang)}
        </p>
        <button
            type="button"
            onclick={handleShare}
            class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
            {#if copied}
                <Icon icon="lucide:check" class="h-3.5 w-3.5 text-emerald-600" />
                {t.copied}
            {:else}
                <Icon icon="lucide:share-2" class="h-3.5 w-3.5" />
                {t.share}
            {/if}
        </button>
    </div>

    <hr class="border-gray-100" />

    {#if video.description}
        <div class="rounded-xl bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-700">
            {video.description}
        </div>
    {/if}
</div>
