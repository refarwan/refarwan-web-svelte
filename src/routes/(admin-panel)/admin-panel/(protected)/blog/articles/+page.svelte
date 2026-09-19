<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { SvelteURLSearchParams } from "svelte/reactivity";
    import Pagination from "$lib/components/Pagination.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import { popup } from "$lib/stores/popup.svelte";
    import StatusFilterTabs from "../../watch/videos/_components/StatusFilterTabs.svelte";
    import ArticleDetailModal from "./_components/ArticleDetailModal.svelte";
    import ArticleTable from "./_components/ArticleTable.svelte";
    import ArticleToolbar from "./_components/ArticleToolbar.svelte";
    import { useArticleActions } from "./use-article-actions.svelte";
    import { useArticleList } from "./use-article-list.svelte";

    import type { ResolvedPathname } from "$app/types";
    import type { ArticleDetail, ArticleItem } from "$lib/types/article";

    let { data } = $props();
    const t = $derived(data.t);
    const commonT = $derived(data.common);

    $effect(() => {
        pageTitleStore.set(data.shellT.blogArticles);
    });

    const basePath = resolve("/admin-panel/blog/articles");
    const articleList = useArticleList();

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

    const actions = useArticleActions(
        articleList,
        () => t,
        () => commonT
    );

    let detailPopupId = $state("");
    let detailArticle = $state<ArticleDetail | null>(null);

    const closeDetail = () => {
        popup.remove(detailPopupId);
        detailArticle = null;
    };

    const openDetail = async (item: ArticleItem) => {
        const article = await articleList.fetchDetail(item.id);
        if (!article) {
            popup.error({ message: t.loadDetailFailed });
            return;
        }
        detailArticle = article;
        detailPopupId = popup.generateId();
        popup.custom({ id: detailPopupId, component: detailModalSnippet });
    };
</script>

<div class="flex flex-col gap-4">
    <ArticleToolbar
        {t}
        categories={articleList.categories}
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

    <ArticleTable
        {t}
        items={articleList.list?.data ?? []}
        {search}
        isLoading={articleList.loading}
        deletingId={actions.deletingId}
        archivingId={actions.archivingId}
        isEn={data.currentLang === "en-US"}
        onView={openDetail}
        onArchive={actions.confirmArchive}
        onUnarchive={actions.confirmUnarchive}
        onDelete={actions.confirmDelete}
    />

    {#if articleList.list && articleList.list.totalPage > 1}
        <Pagination
            {t}
            page={currentPage}
            totalPage={articleList.list.totalPage}
            buildHref={(pageNum) => buildHref(pageNum, search, status)}
        />
    {/if}
</div>

{#snippet detailModalSnippet()}
    {#if detailArticle}
        <ArticleDetailModal
            {t}
            article={detailArticle}
            onClose={closeDetail}
            isEn={data.currentLang === "en-US"}
        />
    {/if}
{/snippet}
