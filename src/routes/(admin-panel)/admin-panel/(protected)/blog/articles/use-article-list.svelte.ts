import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { authorizedHttp } from "$lib/api/authorized-http";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { ArticleDetail, ArticleItem } from "$lib/types/article";
import type { AdminOptionItem } from "$lib/types/video-category";

class ArticleListState {
    list = $state<ListResponse<ArticleItem[]> | null>(null);
    categories = $state<AdminOptionItem[]>([]);
    loading = $state(true);

    constructor() {
        $effect(() => {
            const params = page.url.searchParams;
            const pageParam = params.get("page") ?? "1";
            const search = params.get("search") ?? "";
            const status = params.get("status") ?? "";
            const categoryIds = (params.get("category") ?? "").split(",").filter(Boolean);
            void this.fetchList(pageParam, search, status, categoryIds);
        });

        void this.fetchCategories();
    }

    private async fetchCategories() {
        try {
            const res = await authorizedHttp.get<DataResponse<AdminOptionItem[]>>(
                "/article-category/admin-options"
            );
            this.categories = res.data.data;
        } catch {
            this.categories = [];
        }
    }

    private async fetchList(
        pageParam: string,
        search: string,
        status: string,
        categoryIds: string[]
    ) {
        this.loading = true;
        try {
            const query = new SvelteURLSearchParams({ page: pageParam, limit: "10" });
            if (search) query.set("search", search);
            if (status) query.set("status", status);
            for (const id of categoryIds) query.append("categoryId", id);
            const res = await authorizedHttp.get<ListResponse<ArticleItem[]>>(
                `/article?${query.toString()}`
            );
            this.list = res.data;
        } catch {
            this.list = null;
        } finally {
            this.loading = false;
        }
    }

    private async refetch() {
        const params = page.url.searchParams;
        const pageParam = params.get("page") ?? "1";
        const search = params.get("search") ?? "";
        const status = params.get("status") ?? "";
        const categoryIds = (params.get("category") ?? "").split(",").filter(Boolean);
        await this.fetchList(pageParam, search, status, categoryIds);
    }

    async fetchDetail(id: string): Promise<ArticleDetail | null> {
        try {
            const res = await authorizedHttp.get<DataResponse<ArticleDetail>>(`/article/${id}`);
            return res.data.data;
        } catch {
            return null;
        }
    }

    async archive(id: string): Promise<void> {
        await authorizedHttp.patch(`/article/${id}/archive`);
        await this.refetch();
    }

    async unarchive(id: string): Promise<void> {
        await authorizedHttp.patch(`/article/${id}/unarchive`);
        await this.refetch();
    }

    async remove(id: string): Promise<void> {
        await authorizedHttp.delete(`/article/${id}`);
        await this.refetch();
    }
}

export function useArticleList() {
    return new ArticleListState();
}
