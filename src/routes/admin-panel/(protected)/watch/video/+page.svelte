<script lang="ts">
    import { tick, untrack } from "svelte";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { enhance } from "$app/forms";

    import Plus from "lucide-svelte/icons/plus";
    import Search from "lucide-svelte/icons/search";

    import CategoryFilterDropdown from "./_components/CategoryFilterDropdown.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import StatusFilterTabs from "./_components/StatusFilterTabs.svelte";
    import VideoDetailModal from "./_components/VideoDetailModal.svelte";
    import VideoTable from "./_components/VideoTable.svelte";
    import { popup } from "$lib/stores/popup.svelte";

    import type { VideoDetail, VideoItem } from "$lib/types";

    let { data, form } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    const basePath = resolve("/admin-panel/watch/video");

    let searchInput = $state(data.search);
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    const statusTabs = $derived([
        { value: "", label: t.statusAll },
        { value: "published", label: t.statusPublished },
        { value: "draft", label: t.statusDraft },
        { value: "archived", label: t.statusArchived }
    ]);

    const buildHref = (
        page: number,
        search: string,
        status: string,
        categoryIds: string[] = data.categoryIds
    ): string => {
        const params = new SvelteURLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (categoryIds.length > 0) params.set("category", categoryIds.join(","));
        if (page > 1) params.set("page", String(page));
        const qs = params.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };

    const onSearchInput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            void goto(buildHref(1, searchInput, data.status), { keepFocus: true, noScroll: true });
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

    let actionForm: HTMLFormElement | undefined = $state();
    let actionId = $state("");
    let actionName = $state<"archive" | "unarchive" | "delete">("delete");

    const submitAction = async (id: string, action: "archive" | "unarchive" | "delete") => {
        actionId = id;
        actionName = action;
        await tick();
        actionForm?.requestSubmit();
    };

    const confirmDelete = (item: VideoItem) => {
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage,
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: () => submitAction(item.id, "delete")
        });
    };

    const confirmArchive = (item: VideoItem) => {
        popup.confirm({
            title: t.archiveConfirmTitle,
            message: t.archiveConfirmMessage,
            confirmText: t.archiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: () => submitAction(item.id, "archive")
        });
    };

    const confirmUnarchive = (item: VideoItem) => {
        popup.confirm({
            title: t.unarchiveConfirmTitle,
            message: t.unarchiveConfirmMessage,
            confirmText: t.unarchiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: () => submitAction(item.id, "unarchive")
        });
    };

    let detailPopupId = $state("");
    let detailVideo = $state<VideoDetail | null>(null);

    const closeDetail = () => {
        popup.remove(detailPopupId);
        detailVideo = null;
    };

    const openDetail = async (item: VideoItem) => {
        const res = await fetch(`/admin-panel/api/video/${item.id}`);
        if (!res.ok) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        const body = (await res.json()) as { data: VideoDetail };
        detailVideo = body.data;
        detailPopupId = popup.generateId();
        popup.custom({ id: detailPopupId, component: detailModalSnippet });
    };
</script>

<svelte:head>
    <title>{t.pageTitle}</title>
</svelte:head>

<form
    method="POST"
    action={`?/${actionName}`}
    bind:this={actionForm}
    use:enhance={() => {
        return async ({ update }) => {
            await update();
        };
    }}
    class="hidden"
>
    <input type="hidden" name="id" value={actionId} />
</form>

<div class="flex flex-col gap-4">
    <div
        class="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4"
    >
        <div class="flex flex-wrap items-center gap-2.5">
            <div class="relative flex-1 sm:w-72 md:w-80">
                <Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                categories={data.categories}
                activeCategoryIds={data.categoryIds}
                onApply={(ids) => goto(buildHref(1, data.search, data.status, ids))}
                onReset={() => goto(buildHref(1, data.search, data.status, []))}
            />
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
            <a
                href={resolve("/admin-panel/watch/create")}
                class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-theme-700"
            >
                <Plus class="h-4 w-4" />
                <span>{t.addVideo}</span>
            </a>
        </div>
    </div>

    <StatusFilterTabs
        tabs={statusTabs}
        activeValue={data.status}
        buildHref={(value) => buildHref(1, data.search, value)}
    />

    <VideoTable
        {t}
        items={data.list?.data ?? []}
        search={data.search}
        onView={openDetail}
        onArchive={confirmArchive}
        onUnarchive={confirmUnarchive}
        onDelete={confirmDelete}
    />

    {#if data.list}
        <Pagination
            {t}
            page={data.page}
            totalPage={data.list.totalPage}
            buildHref={(page) => buildHref(page, data.search, data.status)}
        />
    {/if}
</div>

{#snippet detailModalSnippet()}
    {#if detailVideo}
        <VideoDetailModal {t} video={detailVideo} logoUrl={data.logoUrl} onClose={closeDetail} />
    {/if}
{/snippet}
