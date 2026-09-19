<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { authorizedHttp } from "$lib/api/authorized-http";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";
    import SelectImageGrid from "./SelectImageGrid.svelte";
    import SelectImageModalFooter from "./SelectImageModalFooter.svelte";
    import SelectImageUploadTab from "./SelectImageUploadTab.svelte";

    import type { ListResponse } from "$lib/types/api-response";
    import type { ImageLibraryItem } from "$lib/types/image-library";

    interface Props {
        t: Record<string, string>;
        onSelect: (item: ImageLibraryItem) => void;
        onClose: () => void;
    }

    let { t, onSelect, onClose }: Props = $props();

    let activeTab = $state<"library" | "upload">("library");
    let items = $state<ImageLibraryItem[]>([]);
    let loading = $state(true);
    let page = $state(1);
    let totalPage = $state(1);
    let selectedItem = $state<ImageLibraryItem | null>(null);

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

    const handleUpload = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.files?.[0]) return;
        const file = input.files[0];

        uploading = true;
        uploadError = "";
        try {
            const formData = new FormData();
            formData.append("image", file);
            await authorizedHttp.post("/image-library", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchImages(1);
            if (items[0]) selectedItem = items[0];
            activeTab = "library";
        } catch (err) {
            uploadError = axiosErrorMessage(err, "Failed to upload image");
        } finally {
            uploading = false;
            input.value = "";
        }
    };

    const confirmSelection = () => {
        if (!selectedItem) return;
        onSelect(selectedItem);
    };
</script>

<div
    class="flex h-auto max-h-[90vh] w-[94vw] max-w-160 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white md:w-160"
    role="dialog"
    aria-modal="true"
>
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 class="text-base font-semibold text-gray-900">
            {t.selectImageTitle || "Pilih Gambar dari Image Library"}
        </h3>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Tutup"
        >
            <Icon icon="lucide:x" class="size-5" />
        </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-2">
        <button
            type="button"
            onclick={() => (activeTab = "library")}
            class={`relative cursor-pointer px-4 py-2 text-xs font-semibold transition-colors ${activeTab === "library" ? "border-b-2 border-theme-600 text-theme-600" : "text-gray-500 hover:text-gray-700"}`}
        >
            {t.tabLibrary || "Perpustakaan Gambar"}
        </button>
        <button
            type="button"
            onclick={() => (activeTab = "upload")}
            class={`relative cursor-pointer px-4 py-2 text-xs font-semibold transition-colors ${activeTab === "upload" ? "border-b-2 border-theme-600 text-theme-600" : "text-gray-500 hover:text-gray-700"}`}
        >
            {t.tabUpload || "Upload Baru"}
        </button>
    </div>

    <!-- Content -->
    <div class="min-h-75 flex-1 p-6">
        {#if activeTab === "library"}
            <SelectImageGrid
                {items}
                selectedId={selectedItem?.id ?? null}
                {loading}
                emptyText={t.noImagesFound || "Tidak ada gambar di perpustakaan"}
                onSelect={(item) => (selectedItem = item)}
                onDoubleClick={(item) => {
                    selectedItem = item;
                    confirmSelection();
                }}
            />

            <!-- Pagination -->
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

    <SelectImageModalFooter
        selectedId={selectedItem?.id}
        selectedLabel={t.selectedImage || "Terpilih"}
        cancelLabel={t.tableCancel || "Batal"}
        insertLabel={t.insertImageAction || "Sisipkan Gambar"}
        {onClose}
        onConfirm={confirmSelection}
    />
</div>
