<script lang="ts">
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    import Pagination from "$lib/components/Pagination.svelte";
    import StatusFilterTabs from "./_components/StatusFilterTabs.svelte";
    import VideoDetailModal from "./_components/VideoDetailModal.svelte";
    import VideoTable from "./_components/VideoTable.svelte";
    import WatchVideoToolbar from "./_components/WatchVideoToolbar.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { useVideoActions } from "./use-video-actions.svelte";
    import { useVideoList } from "./use-video-list.svelte";

    import type { VideoDetail, VideoItem } from "$lib/types";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.watchVideos);
    });

    const basePath = resolve("/admin-panel/watch/videos");
    const videoList = useVideoList();

    const currentPage = $derived(Math.max(1, Number(page.url.searchParams.get("page")) || 1));
    const search = $derived(page.url.searchParams.get("search") ?? "");
    const status = $derived(page.url.searchParams.get("status") ?? "");
    const categoryIds = $derived(
        (page.url.searchParams.get("category") ?? "").split(",").filter(Boolean)
    );

    const statusTabs = $derived([
        { value: "", label: t.statusAll },
        { value: "published", label: t.statusPublished },
        { value: "draft", label: t.statusDraft },
        { value: "archived", label: t.statusArchived }
    ]);

    const buildHref = (
        pageNum: number,
        searchValue: string,
        statusValue: string,
        categoryIdsValue: string[] = categoryIds
    ): string => {
        const params = new SvelteURLSearchParams();
        if (searchValue) params.set("search", searchValue);
        if (statusValue) params.set("status", statusValue);
        if (categoryIdsValue.length > 0) params.set("category", categoryIdsValue.join(","));
        if (pageNum > 1) params.set("page", String(pageNum));
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    const actions = useVideoActions(
        videoList,
        () => t,
        () => commonT
    );

    let detailPopupId = $state("");
    let detailVideo = $state<VideoDetail | null>(null);

    const closeDetail = () => {
        popup.remove(detailPopupId);
        detailVideo = null;
    };

    const openDetail = async (item: VideoItem) => {
        const video = await videoList.fetchDetail(item.id);
        if (!video) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        detailVideo = video;
        detailPopupId = popup.generateId();
        popup.custom({ id: detailPopupId, component: detailModalSnippet });
    };
</script>

<div class="flex flex-col gap-4">
    <WatchVideoToolbar
        {t}
        categories={videoList.categories}
        {categoryIds}
        {search}
        onSearchChange={(value) => {
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            void goto(buildHref(1, value, status), { keepFocus: true, noScroll: true });
        }}
        onApplyCategory={(ids) => {
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            void goto(buildHref(1, search, status, ids));
        }}
        onResetCategory={() => {
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            void goto(buildHref(1, search, status, []));
        }}
    />

    <StatusFilterTabs
        tabs={statusTabs}
        activeValue={status}
        buildHref={(value) => buildHref(1, search, value)}
    />

    <VideoTable
        {t}
        items={videoList.list?.data ?? []}
        {search}
        isLoading={videoList.loading}
        deletingId={actions.deletingId}
        archivingId={actions.archivingId}
        isEn={data.adminLang === "en-US"}
        onView={openDetail}
        onArchive={actions.confirmArchive}
        onUnarchive={actions.confirmUnarchive}
        onDelete={actions.confirmDelete}
    />

    {#if videoList.list && videoList.list.totalPage > 1}
        <Pagination
            {t}
            page={currentPage}
            totalPage={videoList.list.totalPage}
            buildHref={(pageNum) => buildHref(pageNum, search, status)}
        />
    {/if}
</div>

{#snippet detailModalSnippet()}
    {#if detailVideo}
        <VideoDetailModal
            video={detailVideo}
            lang={data.adminLang}
            contentLanguages={data.contentLanguages}
            onClose={closeDetail}
            onRefresh={async () => {
                if (!detailVideo) return;
                const updated = await videoList.fetchDetail(detailVideo.id);
                if (updated) detailVideo = updated;
            }}
        />
    {/if}
{/snippet}
