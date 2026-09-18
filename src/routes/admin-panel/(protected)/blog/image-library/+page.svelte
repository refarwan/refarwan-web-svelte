<script lang="ts">
    import {
        Image as ImageIcon,
        Plus as PlusIcon,
        Search as SearchIcon
    } from "lucide-svelte/icons";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    import Pagination from "$lib/components/Pagination.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";

    import ImageCard from "./_components/ImageCard.svelte";
    import ImageDetailModal from "./_components/ImageDetailModal.svelte";
    import UploadImageModal from "./_components/UploadImageModal.svelte";
    import { useImageLibraryList } from "./use-image-library-list.svelte";

    import type { ImageLibraryItem } from "$lib/types";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.blogImageLibrary);
    });

    const libraryList = useImageLibraryList();
    const basePath = resolve("/admin-panel/blog/image-library");

    let searchInput = $state("");
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const buildHref = (pageNum: number, search: string): string => {
        const params = new SvelteURLSearchParams();
        if (search) params.set("search", search);
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
            void goto(buildHref(1, searchInput), { keepFocus: true, noScroll: true });
        }, 350);
    };

    // --- Modal Management ---
    let uploadModalId = $state("");
    let detailModalId = $state("");
    let viewingItem = $state<ImageLibraryItem | null>(null);

    const closeUploadModal = () => {
        popup.remove(uploadModalId);
    };

    const closeDetailModal = () => {
        popup.remove(detailModalId);
        viewingItem = null;
    };

    const openUploadModal = () => {
        uploadModalId = popup.generateId();
        popup.custom({ id: uploadModalId, component: uploadModalSnippet });
    };

    const openDetailModal = async (item: ImageLibraryItem) => {
        const detail = await libraryList.fetchDetail(item.id);
        viewingItem = detail ?? item;
        detailModalId = popup.generateId();
        popup.custom({ id: detailModalId, component: detailModalSnippet });
    };

    const confirmDelete = (item: ImageLibraryItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage,
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await libraryList.remove(item.id);
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
        class="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center"
    >
        <div class="relative w-full sm:max-w-xs xl:max-w-sm">
            <SearchIcon class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                bind:value={searchInput}
                oninput={onSearchInput}
                placeholder={t.searchPlaceholder}
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>

        <button
            type="button"
            onclick={openUploadModal}
            class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700 sm:w-auto"
        >
            <PlusIcon class="h-4 w-4" />
            <span>{t.uploadImage}</span>
        </button>
    </div>

    <!-- Grid / Content -->
    {#if libraryList.loading}
        <div class="flex justify-center py-16">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-theme-600"
            ></div>
        </div>
    {:else if !libraryList.list || libraryList.list.data.length === 0}
        <div
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
        >
            <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
            >
                <ImageIcon class="h-6 w-6" />
            </div>
            <h4 class="mt-3 text-sm font-semibold text-gray-900">{t.empty}</h4>
            <p class="mt-1 text-xs text-gray-500">{t.emptySubtitle}</p>
            <button
                type="button"
                onclick={openUploadModal}
                class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-theme-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700"
            >
                <PlusIcon class="h-3.5 w-3.5" />
                <span>{t.uploadImage}</span>
            </button>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
            {#each libraryList.list.data as item (item.id)}
                <ImageCard {item} {t} onView={openDetailModal} onDelete={confirmDelete} />
            {/each}
        </div>

        {#if libraryList.list.totalPage > 1}
            <Pagination
                {t}
                page={libraryList.list.currentPage}
                totalPage={libraryList.list.totalPage}
                buildHref={(pageNum) => buildHref(pageNum, searchInput)}
            />
        {/if}
    {/if}
</div>

{#snippet uploadModalSnippet()}
    <UploadImageModal
        onClose={closeUploadModal}
        onUpload={(file) => libraryList.upload(file)}
        {t}
        cancelLabel={commonT.cancel}
    />
{/snippet}

{#snippet detailModalSnippet()}
    {#if viewingItem}
        <ImageDetailModal item={viewingItem} onClose={closeDetailModal} {t} />
    {/if}
{/snippet}
