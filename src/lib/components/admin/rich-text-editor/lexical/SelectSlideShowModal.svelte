<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { authorizedHttp } from "$lib/api/authorized-http";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";
    import SelectImageUploadTab from "./SelectImageUploadTab.svelte";
    import SelectSlideShowHeader from "./SelectSlideShowHeader.svelte";
    import SlideShowGrid from "./SlideShowGrid.svelte";
    import SlideShowModalFooter from "./SlideShowModalFooter.svelte";
    import SlideShowSelectedTray from "./SlideShowSelectedTray.svelte";

    import type { ListResponse } from "$lib/types/api-response";
    import type { ImageLibraryItem } from "$lib/types/image-library";
    import type { SlideShowImage } from "./nodes/resizable-slideshow-node";

    interface Props {
        t: Record<string, string>;
        onSelect: (items: SlideShowImage[]) => void;
        onClose: () => void;
    }

    let { t, onSelect, onClose }: Props = $props();

    let activeTab = $state<"library" | "upload">("library");
    let items = $state<ImageLibraryItem[]>([]);
    let loading = $state(true);
    let page = $state(1);
    let totalPage = $state(1);
    let selectedItems = $state<SlideShowImage[]>([]);

    let uploading = $state(false);
    let uploadError = $state("");

    const fetchImages = async (p = 1) => {
        loading = true;
        try {
            const res = await authorizedHttp.get<ListResponse<ImageLibraryItem[]>>(
                `/image-library?page=${p}&limit=15`
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
        void fetchImages(1);
    });

    const toSlideItem = (img: ImageLibraryItem): SlideShowImage => ({
        id: img.id,
        src: img.source.large || img.source.medium || img.source.small,
        altText: img.id || "Slide Image"
    });

    const toggleImage = (item: ImageLibraryItem) => {
        const existingIdx = selectedItems.findIndex((s) => s.id === item.id);
        if (existingIdx !== -1) {
            selectedItems = selectedItems.filter((_, i) => i !== existingIdx);
        } else {
            selectedItems = [...selectedItems, toSlideItem(item)];
        }
    };

    const handleUpload = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.files?.[0]) return;
        uploading = true;
        uploadError = "";
        try {
            const formData = new FormData();
            formData.append("image", input.files[0]);
            await authorizedHttp.post("/image-library", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchImages(1);
            if (items[0]) {
                toggleImage(items[0]);
            }
            activeTab = "library";
        } catch (err) {
            uploadError = axiosErrorMessage(err, "Failed to upload image");
        } finally {
            uploading = false;
            input.value = "";
        }
    };

    const handleRemoveSlide = (idx: number) => {
        selectedItems = selectedItems.filter((_, i) => i !== idx);
    };

    const handleMoveSlide = (fromIdx: number, toIdx: number) => {
        if (toIdx < 0 || toIdx >= selectedItems.length) return;
        const copy = [...selectedItems];
        const [moved] = copy.splice(fromIdx, 1);
        copy.splice(toIdx, 0, moved);
        selectedItems = copy;
    };
</script>

<div
    class="flex h-auto max-h-[92vh] w-[94vw] max-w-180 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
    role="dialog"
    aria-modal="true"
>
    <SelectSlideShowHeader
        title={t.selectSlideShowTitle || "Pilih Gambar Slide Show"}
        subtitle={t.selectSlideShowSubtitle || "Pilih beberapa gambar dan atur urutannya"}
        {activeTab}
        tabLibraryLabel={t.tabLibrary || "Perpustakaan Gambar"}
        tabUploadLabel={t.tabUpload || "Upload Baru"}
        onTabChange={(tab) => (activeTab = tab)}
        {onClose}
    />

    <!-- Main Content Area -->
    <div class="min-h-60 flex-1 overflow-y-auto p-5">
        {#if activeTab === "library"}
            <SlideShowGrid {items} {selectedItems} {loading} onToggle={toggleImage} {t} />

            {#if totalPage > 1}
                <div
                    class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500"
                >
                    <button
                        type="button"
                        disabled={page <= 1 || loading}
                        onclick={() => fetchImages(page - 1)}
                        class="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 hover:bg-gray-50 disabled:opacity-40"
                    >
                        <Icon icon="lucide:chevron-left" class="size-3.5" />
                        <span>Prev</span>
                    </button>
                    <span>{page} / {totalPage}</span>
                    <button
                        type="button"
                        disabled={page >= totalPage || loading}
                        onclick={() => fetchImages(page + 1)}
                        class="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 hover:bg-gray-50 disabled:opacity-40"
                    >
                        <span>Next</span>
                        <Icon icon="lucide:chevron-right" class="size-3.5" />
                    </button>
                </div>
            {/if}
        {:else}
            <SelectImageUploadTab {uploading} {uploadError} onUpload={handleUpload} />
        {/if}
    </div>

    <!-- Selected Tray -->
    <SlideShowSelectedTray
        {selectedItems}
        onRemove={handleRemoveSlide}
        onMove={handleMoveSlide}
        {t}
    />

    <!-- Footer -->
    <SlideShowModalFooter
        selectedCount={selectedItems.length}
        selectedLabel={t.selectedSlidesCount || "Gambar Terpilih"}
        cancelLabel={t.tableCancel || "Batal"}
        insertLabel={t.insertSlideShowAction || "Sisipkan Slide Show"}
        canInsert={selectedItems.length > 0}
        {onClose}
        onConfirm={() => onSelect(selectedItems)}
    />
</div>
