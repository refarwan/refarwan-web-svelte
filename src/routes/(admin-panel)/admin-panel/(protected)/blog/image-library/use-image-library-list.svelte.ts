import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { authorizedHttp } from "../../../../api/authorized-http";

import type { DataResponse, ListResponse } from "$lib/types/api-response";
import type { ImageLibraryItem } from "../../../../types/image-library";

class ImageLibraryListState {
    list = $state<ListResponse<ImageLibraryItem[]> | null>(null);
    loading = $state(true);

    constructor() {
        $effect(() => {
            const pageParam = page.url.searchParams.get("page") ?? "1";
            void this.fetchList(pageParam);
        });
    }

    private async fetchList(pageParam: string) {
        this.loading = true;
        try {
            const query = new SvelteURLSearchParams({ page: pageParam, limit: "12" });
            const res = await authorizedHttp.get<ListResponse<ImageLibraryItem[]>>(
                `/image-library?${query.toString()}`
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
        await this.fetchList(pageParam);
    }

    async fetchDetail(id: string): Promise<ImageLibraryItem | null> {
        try {
            const res = await authorizedHttp.get<DataResponse<ImageLibraryItem>>(
                `/image-library/${id}`
            );
            return res.data.data;
        } catch {
            return null;
        }
    }

    async upload(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("image", file);
        await authorizedHttp.post("/image-library", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        await this.refetch();
    }

    async remove(id: string): Promise<void> {
        await authorizedHttp.delete(`/image-library/${id}`);
        await this.refetch();
    }
}

export function useImageLibraryList() {
    return new ImageLibraryListState();
}
