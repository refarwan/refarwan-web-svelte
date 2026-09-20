import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { authorizedHttp } from "../../../api/authorized-http";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { ProjectDetail, ProjectItem } from "$lib/types/project";
import type { AdminOptionItem } from "$lib/types/project-category";

class ProjectListState {
    list = $state<ListResponse<ProjectItem[]> | null>(null);
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
                "/project-category/admin-options"
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
            const res = await authorizedHttp.get<ListResponse<ProjectItem[]>>(
                `/project?${query.toString()}`
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

    async fetchDetail(id: string): Promise<ProjectDetail | null> {
        try {
            const res = await authorizedHttp.get<DataResponse<ProjectDetail>>(`/project/${id}`);
            return res.data.data;
        } catch {
            return null;
        }
    }

    async archive(id: string): Promise<void> {
        await authorizedHttp.patch(`/project/${id}/archive`);
        await this.refetch();
    }

    async unarchive(id: string): Promise<void> {
        await authorizedHttp.patch(`/project/${id}/unarchive`);
        await this.refetch();
    }

    async remove(id: string): Promise<void> {
        await authorizedHttp.delete(`/project/${id}`);
        await this.refetch();
    }
}

export function useProjectList() {
    return new ProjectListState();
}
