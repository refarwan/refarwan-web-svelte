<script lang="ts">
    import { Plus as PlusIcon, Search as SearchIcon } from "lucide-svelte/icons";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    import Pagination from "$lib/components/Pagination.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { axiosErrorMessage } from "$lib/utils/axios-error-message";

    import CategoryTable from "./_components/CategoryTable.svelte";
    import ArticleCategoryFormModal from "./_components/ArticleCategoryFormModal.svelte";
    import { useCategoryList } from "./use-article-category-list.svelte";

    import type { ArticleCategoryDetail, ArticleCategoryItem } from "$lib/types";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.blogCategories);
    });

    const categoryList = useCategoryList();

    const basePath = resolve("/admin-panel/blog/categories");

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

    // --- Add / Edit modal ---
    let modalPopupId = $state("");
    let modalMode = $state<"create" | "edit">("create");
    let editingCategory = $state<ArticleCategoryDetail | null>(null);

    const closeModal = () => {
        popup.remove(modalPopupId);
    };

    const openCreateModal = () => {
        modalMode = "create";
        editingCategory = null;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    const openEditModal = async (item: ArticleCategoryItem) => {
        const detail = await categoryList.fetchDetail(item.id);
        if (!detail) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        modalMode = "edit";
        editingCategory = detail;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    const confirmDelete = (item: ArticleCategoryItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage.replace("{name}", item.name),
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                try {
                    await categoryList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, t.deleteFailed) });
                }
            }
        });
    };
</script>

<div class="flex flex-col gap-4">
    <div
        class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4"
    >
        <div class="relative w-full md:max-w-xs xl:max-w-sm">
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
            onclick={openCreateModal}
            class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
        >
            <PlusIcon class="h-4 w-4" />
            <span>{t.addCategory}</span>
        </button>
    </div>

    {#if categoryList.loading}
        <div class="flex justify-center py-12">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-theme-600"
            ></div>
        </div>
    {:else}
        <CategoryTable
            {t}
            items={categoryList.list?.data ?? []}
            onEdit={openEditModal}
            onDelete={confirmDelete}
        />

        {#if categoryList.list && categoryList.list.totalPage > 1}
            <Pagination
                {t}
                page={categoryList.list.currentPage}
                totalPage={categoryList.list.totalPage}
                buildHref={(pageNum) => buildHref(pageNum, searchInput)}
            />
        {/if}
    {/if}
</div>

{#snippet formModalSnippet()}
    <ArticleCategoryFormModal
        mode={modalMode}
        category={editingCategory}
        contentLanguages={data.contentLanguages}
        onClose={closeModal}
        onCheckSlug={(slug, currentSlug) => categoryList.checkSlug(slug, currentSlug)}
        onCreate={(payload) => categoryList.create(payload)}
        onUpdate={(id, payload) => categoryList.update(id, payload)}
        {t}
        cancelLabel={commonT.cancel}
    />
{/snippet}
