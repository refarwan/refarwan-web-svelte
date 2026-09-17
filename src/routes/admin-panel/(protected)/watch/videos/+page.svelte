<script lang="ts">
    import { PlusIcon, SearchIcon } from "lucide-svelte/icons";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    import CategoryFilterDropdown from "./_components/CategoryFilterDropdown.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import StatusFilterTabs from "./_components/StatusFilterTabs.svelte";
    import VideoDetailModal from "./_components/VideoDetailModal.svelte";
    import VideoTable from "./_components/VideoTable.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";
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

    let searchInput = $state(search);
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

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

    const onSearchInput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            // buildHref appends a query string to a resolve()-derived basePath; the linter
            // can't trace resolve() through the helper function.
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            void goto(buildHref(1, searchInput, status), { keepFocus: true, noScroll: true });
        }, 350);
    };

    const confirmDelete = (item: VideoItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage,
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await videoList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to delete video") });
                }
            }
        });
    };

    const confirmArchive = (item: VideoItem) => {
        popup.confirm({
            title: t.archiveConfirmTitle,
            message: t.archiveConfirmMessage,
            confirmText: t.archiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await videoList.archive(item.id);
                    popup.success({ message: t.archived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to archive video") });
                }
            }
        });
    };

    const confirmUnarchive = (item: VideoItem) => {
        popup.confirm({
            title: t.unarchiveConfirmTitle,
            message: t.unarchiveConfirmMessage,
            confirmText: t.unarchiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await videoList.unarchive(item.id);
                    popup.success({ message: t.unarchived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to restore video") });
                }
            }
        });
    };

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
    <div
        class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4"
    >
        <div class="flex flex-wrap items-center gap-2.5">
            <div class="relative flex-1 sm:w-72 md:w-80">
                <SearchIcon
                    class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    bind:value={searchInput}
                    oninput={onSearchInput}
                    placeholder={t.searchPlaceholder}
                    class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>

            <CategoryFilterDropdown
                {t}
                categories={videoList.categories}
                activeCategoryIds={categoryIds}
                onApply={(ids) => {
                    // buildHref appends a query string to a resolve()-derived basePath; the
                    // linter can't trace resolve() through the helper function.
                    // eslint-disable-next-line svelte/no-navigation-without-resolve
                    goto(buildHref(1, search, status, ids));
                }}
                onReset={() => {
                    // eslint-disable-next-line svelte/no-navigation-without-resolve
                    goto(buildHref(1, search, status, []));
                }}
            />
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
            <a
                href={resolve("/admin-panel/watch/upload")}
                class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-theme-700"
            >
                <PlusIcon class="h-4 w-4" />
                <span>{t.addVideo}</span>
            </a>
        </div>
    </div>

    <StatusFilterTabs
        tabs={statusTabs}
        activeValue={status}
        buildHref={(value) => buildHref(1, search, value)}
    />

    {#if videoList.loading}
        <div class="flex justify-center py-12">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-theme-600"
            ></div>
        </div>
    {:else}
        <VideoTable
            {t}
            items={videoList.list?.data ?? []}
            {search}
            onView={openDetail}
            onArchive={confirmArchive}
            onUnarchive={confirmUnarchive}
            onDelete={confirmDelete}
        />

        {#if videoList.list}
            <Pagination
                {t}
                page={currentPage}
                totalPage={videoList.list.totalPage}
                buildHref={(pageNum) => buildHref(pageNum, search, status)}
            />
        {/if}
    {/if}
</div>

{#snippet detailModalSnippet()}
    {#if detailVideo}
        <VideoDetailModal {t} video={detailVideo} logoUrl={data.logoUrl} onClose={closeDetail} />
    {/if}
{/snippet}
