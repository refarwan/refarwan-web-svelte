<script lang="ts">
    import { tick, untrack } from "svelte";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import Plus from "lucide-svelte/icons/plus";
    import Search from "lucide-svelte/icons/search";

    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { enhance } from "$app/forms";

    import CategoryTable from "./_components/CategoryTable.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import VideoCategoryFormModal from "./_components/VideoCategoryFormModal.svelte";
    import { popup } from "$lib/stores/popup.svelte";

    import type { VideoCategoryDetail, VideoCategoryItem } from "$lib/types";

    let { data, form } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    const basePath = resolve("/admin-panel/watch/category");

    let searchInput = $state(data.search);
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const buildHref = (page: number, search: string): string => {
        const params = new SvelteURLSearchParams();
        if (search) params.set("search", search);
        if (page > 1) params.set("page", String(page));
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    const onSearchInput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            void goto(buildHref(1, searchInput), { keepFocus: true, noScroll: true });
        }, 350);
    };

    $effect(() => {
        // popup.success/error read and write the popup store's own state, so calling
        // them untracked keeps this effect's only dependency on `form` — otherwise it
        // re-triggers itself via the store write and floods duplicate popups.
        if (form?.success && form.message) {
            untrack(() => popup.success({ message: form.message ?? "" }));
        } else if (form?.error) {
            untrack(() => popup.error({ message: form.error ?? "" }));
        }
    });

    // --- Add / Edit modal ---
    let modalPopupId = $state("");
    let modalMode = $state<"create" | "edit">("create");
    let editingCategory = $state<VideoCategoryDetail | null>(null);

    const closeModal = () => {
        popup.remove(modalPopupId);
    };

    const openCreateModal = () => {
        modalMode = "create";
        editingCategory = null;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    const openEditModal = async (item: VideoCategoryItem) => {
        const res = await fetch(`/admin-panel/api/video-category/${item.id}`);
        if (!res.ok) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        const body = (await res.json()) as { data: VideoCategoryDetail };
        modalMode = "edit";
        editingCategory = body.data;
        modalPopupId = popup.generateId();
        popup.custom({ id: modalPopupId, component: formModalSnippet });
    };

    // --- Delete ---
    let deleteForm: HTMLFormElement | undefined = $state();
    let deleteId = $state("");

    const confirmDelete = (item: VideoCategoryItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage.replace("{name}", item.name),
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                deleteId = item.id;
                await tick();
                deleteForm?.requestSubmit();
            }
        });
    };
</script>

<svelte:head>
    <title>{t.pageTitle}</title>
</svelte:head>

<form
    method="POST"
    action="?/delete"
    bind:this={deleteForm}
    use:enhance={() => {
        return async ({ update }) => {
            await update();
        };
    }}
    class="hidden"
>
    <input type="hidden" name="id" value={deleteId} />
</form>

<div class="flex flex-col gap-4">
    <div
        class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4"
    >
        <div class="relative w-full md:max-w-xs xl:max-w-sm">
            <Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
            <Plus class="h-4 w-4" />
            <span>{t.addCategory}</span>
        </button>
    </div>

    <CategoryTable
        {t}
        items={data.list?.data ?? []}
        onEdit={openEditModal}
        onDelete={confirmDelete}
    />

    {#if data.list}
        <Pagination
            {t}
            page={data.page}
            totalPage={data.list.totalPage}
            buildHref={(page) => buildHref(page, data.search)}
        />
    {/if}
</div>

{#snippet formModalSnippet()}
    <VideoCategoryFormModal
        mode={modalMode}
        category={editingCategory}
        contentLanguages={data.contentLanguages}
        onClose={closeModal}
        {t}
        cancelLabel={commonT.cancel}
    />
{/snippet}
