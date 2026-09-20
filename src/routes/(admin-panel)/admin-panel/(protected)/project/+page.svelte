<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import Pagination from "../_components/Pagination.svelte";
    import { pageTitleStore } from "../../../stores/page-title.svelte";
    import { popup } from "../../../stores/popup.svelte";
    import StatusFilterTabs from "../watch/videos/_components/StatusFilterTabs.svelte";
    import ProjectDetailModal from "./_components/ProjectDetailModal.svelte";
    import ProjectTable from "./_components/ProjectTable.svelte";
    import ProjectToolbar from "./_components/ProjectToolbar.svelte";
    import { useProjectActions } from "./use-project-actions.svelte";
    import { useProjectList } from "./use-project-list.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ProjectDetail, ProjectItem } from "$lib/types/project";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.project);
    });

    const basePath = resolve("/admin-panel/project");
    const projectList = useProjectList();

    const currentPage = $derived(Math.max(1, Number(page.url.searchParams.get("page")) || 1));
    const search = $derived(page.url.searchParams.get("search") ?? "");
    const status = $derived(page.url.searchParams.get("status") ?? "");
    const categoryIds = $derived(
        (page.url.searchParams.get("category") ?? "").split(",").filter(Boolean)
    );

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
    ): ResolvedPathname => {
        const params = new SvelteURLSearchParams();
        if (searchValue) params.set("search", searchValue);
        if (statusValue) params.set("status", statusValue);
        if (categoryIdsValue.length > 0) params.set("category", categoryIdsValue.join(","));
        if (pageNum > 1) params.set("page", String(pageNum));
        const qs = params.toString();
        return (qs ? `${basePath}?${qs}` : basePath) as ResolvedPathname;
    };

    const actions = useProjectActions(
        projectList,
        () => t,
        () => commonT
    );

    let detailPopupId = $state("");
    let detailProject = $state<ProjectDetail | null>(null);

    const closeDetail = () => {
        popup.remove(detailPopupId);
        detailProject = null;
    };

    const openDetail = async (item: ProjectItem) => {
        const project = await projectList.fetchDetail(item.id);
        if (!project) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        detailProject = project;
        detailPopupId = popup.generateId();
        popup.custom({ id: detailPopupId, component: detailModalSnippet });
    };
</script>

<div class="flex flex-col gap-4">
    <ProjectToolbar
        {t}
        categories={projectList.categories}
        {categoryIds}
        {search}
        onSearchChange={(value) => {
            void goto(buildHref(1, value, status), { keepFocus: true, noScroll: true });
        }}
        onApplyCategory={(ids) => {
            void goto(buildHref(1, search, status, ids));
        }}
        onResetCategory={() => {
            void goto(buildHref(1, search, status, []));
        }}
    />

    <StatusFilterTabs
        tabs={statusTabs}
        activeValue={status}
        buildHref={(value) => buildHref(1, search, value)}
    />

    <ProjectTable
        {t}
        items={projectList.list?.data ?? []}
        {search}
        isLoading={projectList.loading}
        deletingId={actions.deletingId}
        archivingId={actions.archivingId}
        isEn={data.currentLang === "en-US"}
        onView={openDetail}
        onArchive={actions.confirmArchive}
        onUnarchive={actions.confirmUnarchive}
        onDelete={actions.confirmDelete}
    />

    {#if projectList.list && projectList.list.totalPage > 1}
        <Pagination
            {t}
            page={currentPage}
            totalPage={projectList.list.totalPage}
            buildHref={(pageNum) => buildHref(pageNum, search, status)}
        />
    {/if}
</div>

{#snippet detailModalSnippet()}
    {#if detailProject}
        <ProjectDetailModal
            {t}
            project={detailProject}
            onClose={closeDetail}
            isEn={data.currentLang === "en-US"}
        />
    {/if}
{/snippet}
