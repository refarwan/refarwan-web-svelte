import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { authorizedHttp } from "../../../../api/authorized-http";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { PlaylistDetail, PlaylistItem } from "$lib/types/playlist";
import type { VideoItem } from "$lib/types/video";

class PlaylistListState {
    list = $state<ListResponse<PlaylistItem[]> | null>(null);
    loading = $state(true);

    constructor() {
        $effect(() => {
            const pageParam = page.url.searchParams.get("page") ?? "1";
            const search = page.url.searchParams.get("search") ?? "";
            const status = page.url.searchParams.get("status") ?? "";
            void this.fetchList(pageParam, search, status);
        });
    }

    private async fetchList(pageParam: string, search: string, status: string) {
        this.loading = true;
        try {
            const query = new SvelteURLSearchParams({ page: pageParam, limit: "10" });
            if (search) query.set("search", search);
            if (status && status !== "all") query.set("status", status);
            const res = await authorizedHttp.get<ListResponse<PlaylistItem[]>>(
                `/playlist?${query.toString()}`
            );
            this.list = res.data;
        } catch {
            this.list = null;
        } finally {
            this.loading = false;
        }
    }

    async refetch() {
        const pageParam = page.url.searchParams.get("page") ?? "1";
        const search = page.url.searchParams.get("search") ?? "";
        const status = page.url.searchParams.get("status") ?? "";
        await this.fetchList(pageParam, search, status);
    }

    async fetchDetail(id: string): Promise<PlaylistDetail | null> {
        try {
            const res = await authorizedHttp.get<DataResponse<PlaylistDetail>>(`/playlist/${id}`);
            return res.data.data;
        } catch {
            return null;
        }
    }

    async fetchAvailableVideos(search = ""): Promise<VideoItem[]> {
        try {
            const query = new SvelteURLSearchParams({ limit: "100" });
            if (search) query.set("search", search);
            const res = await authorizedHttp.get<ListResponse<VideoItem[]>>(
                `/video?${query.toString()}`
            );
            return res.data.data ?? [];
        } catch {
            return [];
        }
    }

    async checkSlug(slug: string, currentSlug?: string): Promise<string> {
        const params = new SvelteURLSearchParams({ slug });
        if (currentSlug) params.set("currentSlug", currentSlug);
        try {
            const res = await authorizedHttp.get<DataResponse<{ slug: string }>>(
                `/playlist/slug-check?${params.toString()}`
            );
            return res.data.data.slug;
        } catch {
            return slug;
        }
    }

    async create(formData: FormData): Promise<void> {
        await authorizedHttp.post("/playlist", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        await this.refetch();
    }

    async update(id: string, formData: FormData): Promise<void> {
        await authorizedHttp.put(`/playlist/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        await this.refetch();
    }

    async reorderVideos(id: string, videoIds: string[]): Promise<void> {
        await authorizedHttp.put(`/playlist/${id}/reorder`, { videoIds });
        await this.refetch();
    }

    async remove(id: string): Promise<void> {
        await authorizedHttp.delete(`/playlist/${id}`);
        await this.refetch();
    }
}

export function usePlaylistList() {
    return new PlaylistListState();
}
