<script lang="ts">
    import Icon from "@iconify/svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import Pagination from "../../_components/Pagination.svelte";
    import { pageTitleStore } from "../../../../stores/page-title.svelte";
    import { popup } from "../../../../stores/popup.svelte";
    import { axiosErrorMessage } from "../../../../utils/axios-error-message";
    import PlaylistFormModal from "./_components/PlaylistFormModal.svelte";
    import PlaylistReorderModal from "./_components/PlaylistReorderModal.svelte";
    import PlaylistTable from "./_components/PlaylistTable.svelte";
    import { usePlaylistList } from "./use-playlist-list.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { PlaylistDetail, PlaylistItem } from "$lib/types/playlist";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.watchPlaylists);
    });

    const playlistList = usePlaylistList();
    const basePath = resolve("/admin-panel/watch/playlists");

    let searchInput = $state("");
    let statusFilter = $state("");
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const buildHref = (pageNum: number, search: string, status: string): ResolvedPathname => {
        const params = new SvelteURLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (pageNum > 1) params.set("page", String(pageNum));
        const qs = params.toString();
        return (qs ? `${basePath}?${qs}` : basePath) as ResolvedPathname;
    };

    const onSearchInput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            void goto(buildHref(1, searchInput, statusFilter), { keepFocus: true, noScroll: true });
        }, 350);
    };

    const onStatusChange = (val: string) => {
        statusFilter = val;
        void goto(buildHref(1, searchInput, statusFilter), { keepFocus: true, noScroll: true });
    };

    // --- Add / Edit modal ---
    let modalPopupId = $state("");
    let modalMode = $state<"create" | "edit">("create");
    let editingPlaylist = $state<PlaylistDetail | null>(null);

    const closeModal = () => {
        popup.remove(modalPopupId);
    };

    const openCreateModal = () => {
        modalMode = "create";
        editingPlaylist = null;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    const openEditModal = async (item: PlaylistItem) => {
        const detail = await playlistList.fetchDetail(item.id);
        if (!detail) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        modalMode = "edit";
        editingPlaylist = detail;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    // --- Reorder modal ---
    let reorderPopupId = $state("");
    let reorderingPlaylist = $state<PlaylistDetail | null>(null);

    const closeReorderModal = () => {
        popup.remove(reorderPopupId);
    };

    const openReorderModal = async (item: PlaylistItem) => {
        const detail = await playlistList.fetchDetail(item.id);
        if (!detail) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        reorderingPlaylist = detail;
        reorderPopupId = popup.generateId();
        popup.custom({ id: reorderPopupId, component: reorderModalSnippet });
    };

    const confirmDelete = (item: PlaylistItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage.replace("{name}", item.title),
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await playlistList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, t.deleteFailed) });
                }
            }
        });
    };
</script>

<div class="flex flex-col gap-5">
    <!-- Action Bar -->
    <div
        class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4"
    >
        <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative w-full sm:max-w-xs xl:max-w-sm">
                <Icon
                    icon="lucide:search"
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

            <!-- Status Filter -->
            <select
                bind:value={statusFilter}
                onchange={(e) => onStatusChange(e.currentTarget.value)}
                class="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
            </select>
        </div>

        <button
            type="button"
            onclick={openCreateModal}
            class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-theme-700"
        >
            <Icon icon="lucide:plus" class="h-4 w-4" />
            <span>{t.addPlaylist}</span>
        </button>
    </div>

    <!-- Content Table -->
    {#if playlistList.loading}
        <div class="flex justify-center py-16">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-theme-700 border-t-theme-500"
            ></div>
        </div>
    {:else}
        <PlaylistTable
            items={playlistList.list?.data ?? []}
            {t}
            onEdit={openEditModal}
            onReorder={openReorderModal}
            onDelete={confirmDelete}
        />

        {#if playlistList.list && playlistList.list.totalPage > 1}
            <Pagination
                {t}
                page={playlistList.list.currentPage}
                totalPage={playlistList.list.totalPage}
                buildHref={(pageNum) => buildHref(pageNum, searchInput, statusFilter)}
            />
        {/if}
    {/if}
</div>

{#snippet formModalSnippet()}
    <PlaylistFormModal
        mode={modalMode}
        playlist={editingPlaylist}
        contentLanguages={data.contentLanguages}
        onClose={closeModal}
        onCheckSlug={(slug, currentSlug) => playlistList.checkSlug(slug, currentSlug)}
        onFetchAvailableVideos={(search) => playlistList.fetchAvailableVideos(search)}
        onCreate={async (formData) => {
            await playlistList.create(formData);
            popup.success({ message: t.created });
        }}
        onUpdate={async (id, formData) => {
            await playlistList.update(id, formData);
            popup.success({ message: t.updated });
        }}
        {t}
        cancelLabel={commonT.cancel}
    />
{/snippet}

{#snippet reorderModalSnippet()}
    {#if reorderingPlaylist}
        <PlaylistReorderModal
            playlist={reorderingPlaylist}
            onClose={closeReorderModal}
            onReorder={async (id, videoIds) => {
                await playlistList.reorderVideos(id, videoIds);
                popup.success({ message: t.reordered });
            }}
            {t}
            cancelLabel={commonT.cancel}
        />
    {/if}
{/snippet}
