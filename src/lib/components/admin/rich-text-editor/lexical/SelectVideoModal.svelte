<script lang="ts">
    import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-svelte/icons";
    import { onMount } from "svelte";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { authorizedHttp } from "$lib/api/authorized-http";

    import SelectVideoEmbedTab from "./SelectVideoEmbedTab.svelte";
    import SelectVideoGrid from "./SelectVideoGrid.svelte";
    import SelectVideoHeader from "./SelectVideoHeader.svelte";
    import SelectVideoModalFooter from "./SelectVideoModalFooter.svelte";

    import type { ListResponse, VideoItem } from "$lib/types";

    interface Props {
        t: Record<string, string>;
        onSelect: (embedUrl: string, title: string) => void;
        onClose: () => void;
    }

    let { t, onSelect, onClose }: Props = $props();

    let activeTab = $state<"library" | "embed">("library");
    let items = $state<VideoItem[]>([]);
    let loading = $state(true);
    let page = $state(1);
    let totalPage = $state(1);
    let search = $state("");
    let selectedVideo = $state<VideoItem | null>(null);
    let embedInputValue = $state("");

    const fetchVideos = async (p = 1, query = search) => {
        loading = true;
        try {
            const params = new SvelteURLSearchParams({ page: String(p), limit: "9" });
            if (query.trim()) params.set("search", query.trim());
            const res = await authorizedHttp.get<ListResponse<VideoItem[]>>(
                `/video?${params.toString()}`
            );
            items = res.data.data;
            page = res.data.currentPage;
            totalPage = res.data.totalPage;
        } catch {
            items = [];
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        void fetchVideos(1);
    });

    let searchTimer: ReturnType<typeof setTimeout> | undefined;
    const handleSearchInput = (val: string) => {
        search = val;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => void fetchVideos(1, val), 300);
    };

    const cleanEmbedSrc = $derived.by(() => {
        const val = embedInputValue.trim();
        if (val.startsWith("<iframe")) {
            const match = val.match(/src=["']([^"']+)["']/);
            return match ? match[1] : "";
        }
        return val;
    });

    const handleConfirmVideo = (video: VideoItem) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const embedUrl = `${origin}/watch/embed?v=${video.id}`;
        onSelect(embedUrl, video.title || "");
    };

    const handleConfirm = () => {
        if (activeTab === "library" && selectedVideo) {
            handleConfirmVideo(selectedVideo);
        } else if (activeTab === "embed" && cleanEmbedSrc) {
            onSelect(cleanEmbedSrc, "Embedded Video");
        }
    };

    const canInsert = $derived(
        activeTab === "library" ? Boolean(selectedVideo) : Boolean(cleanEmbedSrc)
    );
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
    role="dialog"
    aria-modal="true"
>
    <div
        class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
    >
        <SelectVideoHeader
            title={t.selectVideoTitle}
            subtitle={t.selectVideoSubtitle}
            {activeTab}
            tabLibraryLabel={t.tabVideoLibrary}
            tabEmbedLabel={t.tabEmbedUrl}
            onTabChange={(tab) => (activeTab = tab)}
            {onClose}
        />

        <div class="flex-1 overflow-y-auto p-6">
            {#if activeTab === "library"}
                <div class="mb-4">
                    <div class="relative">
                        <SearchIcon
                            size={14}
                            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={search}
                            oninput={(e) => handleSearchInput((e.target as HTMLInputElement).value)}
                            placeholder={t.searchVideoPlaceholder}
                            class="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-8 text-xs text-gray-800 placeholder-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                        />
                    </div>
                </div>

                <SelectVideoGrid
                    {items}
                    selectedId={selectedVideo?.id}
                    {loading}
                    onSelect={(item) => (selectedVideo = item)}
                    onConfirm={handleConfirmVideo}
                    {t}
                />

                {#if totalPage > 1}
                    <div
                        class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3"
                    >
                        <span class="text-xs text-gray-500">Page {page} of {totalPage}</span>
                        <div class="flex gap-1">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onclick={() => void fetchVideos(page - 1)}
                                class="cursor-pointer rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                type="button"
                                disabled={page >= totalPage}
                                onclick={() => void fetchVideos(page + 1)}
                                class="cursor-pointer rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                {/if}
            {:else}
                <SelectVideoEmbedTab
                    embedValue={embedInputValue}
                    onInput={(val) => (embedInputValue = val)}
                    {t}
                />
            {/if}
        </div>

        <SelectVideoModalFooter
            selectedTitle={activeTab === "library"
                ? selectedVideo?.title || selectedVideo?.id
                : cleanEmbedSrc}
            selectedLabel={t.selectedVideo}
            cancelLabel={t.tableCancel}
            insertLabel={t.insertVideoAction}
            {canInsert}
            {onClose}
            onConfirm={handleConfirm}
        />
    </div>
</div>
