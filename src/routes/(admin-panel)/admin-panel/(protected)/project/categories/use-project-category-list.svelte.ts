import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { authorizedHttp } from "../../../../api/authorized-http";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { ProjectCategoryDetail, ProjectCategoryItem } from "$lib/types/project-category";

export interface CategoryPayload {
    name: string;
    slug?: string;
    translations: { languageCode: string; name: string }[];
}

class CategoryListState {
    list = $state<ListResponse<ProjectCategoryItem[]> | null>(null);
    loading = $state(true);

    constructor() {
        $effect(() => {
            const pageParam = page.url.searchParams.get("page") ?? "1";
            const search = page.url.searchParams.get("search") ?? "";
            void this.fetchList(pageParam, search);
        });
    }

    private async fetchList(pageParam: string, search: string) {
        this.loading = true;
        try {
            const query = new SvelteURLSearchParams({ page: pageParam, limit: "10" });
            if (search) query.set("search", search);
            const res = await authorizedHttp.get<ListResponse<ProjectCategoryItem[]>>(
                `/project-category?${query.toString()}`
            );
            this.list = res.data;
        } catch {
            this.list = null;
        } finally {
            this.loading = false;
        }
    }

    private async refetch() {
        const pageParam = page.url.searchParams.get("page") ?? "1";
        const search = page.url.searchParams.get("search") ?? "";
        await this.fetchList(pageParam, search);
    }

    async fetchDetail(id: string): Promise<ProjectCategoryDetail | null> {
        try {
            const res = await authorizedHttp.get<DataResponse<ProjectCategoryDetail>>(
                `/project-category/${id}`
            );
            return res.data.data;
        } catch {
            return null;
        }
    }

    async checkSlug(slug: string, currentSlug?: string): Promise<string> {
        const params = new SvelteURLSearchParams({ slug });
        if (currentSlug) params.set("currentSlug", currentSlug);
        try {
            const res = await authorizedHttp.get<DataResponse<{ slug: string }>>(
                `/project-category/slug-check?${params.toString()}`
            );
            return res.data.data.slug;
        } catch {
            return slug;
        }
    }

    async create(payload: CategoryPayload): Promise<void> {
        await authorizedHttp.post("/project-category", payload);
        await this.refetch();
    }

    async update(id: string, payload: CategoryPayload): Promise<void> {
        await authorizedHttp.put(`/project-category/${id}`, payload);
        await this.refetch();
    }

    async remove(id: string): Promise<void> {
        await authorizedHttp.delete(`/project-category/${id}`);
        await this.refetch();
    }
}

export function useCategoryList() {
    return new CategoryListState();
}
