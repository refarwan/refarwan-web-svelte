<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import Pagination from "$lib/components/Pagination.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";
    import ImageCard from "./_components/ImageCard.svelte";
    import ImageDetailModal from "./_components/ImageDetailModal.svelte";
    import UploadImageModal from "./_components/UploadImageModal.svelte";
    import { useImageLibraryList } from "./use-image-library-list.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ImageLibraryItem } from "$lib/types/image-library";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);
    const isEn = $derived(data.adminLang === "en-US");

    $effect(() => {
        pageTitleStore.set(data.shellT.blogImageLibrary);
    });

    const libraryList = useImageLibraryList();
    const basePath = resolve("/admin-panel/blog/image-library");

    const buildHref = (pageNum: number): ResolvedPathname => {
        return (pageNum > 1 ? `${basePath}?page=${pageNum}` : basePath) as ResolvedPathname;
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
    <div class="flex items-center justify-end">
        <button
            type="button"
            onclick={openUploadModal}
            class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
        >
            <Icon icon="lucide:plus" class="h-4 w-4" />
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
                <Icon icon="lucide:image" class="h-6 w-6" />
            </div>
            <h4 class="mt-3 text-sm font-semibold text-gray-900">{t.empty}</h4>
            <p class="mt-1 text-xs text-gray-500">{t.emptySubtitle}</p>
            <button
                type="button"
                onclick={openUploadModal}
                class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-theme-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-theme-700"
            >
                <Icon icon="lucide:plus" class="h-3.5 w-3.5" />
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
                buildHref={(pageNum) => buildHref(pageNum)}
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
        <ImageDetailModal
            item={viewingItem}
            {isEn}
            onClose={closeDetailModal}
            onDelete={() => {
                const item = viewingItem;
                closeDetailModal();
                if (item) confirmDelete(item);
            }}
            {t}
        />
    {/if}
{/snippet}
