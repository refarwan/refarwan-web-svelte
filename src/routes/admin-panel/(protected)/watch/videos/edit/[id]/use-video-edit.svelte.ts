import { goto } from "$app/navigation";
import { page } from "$app/state";
import { resolve } from "$app/paths";

import { authorizedHttp } from "$lib/api/authorized-http";
import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";

import type { AdminOptionItem, DataResponse, VideoDetail } from "$lib/types";

interface VideoEditT {
    updated: string;
    loadDetailFailed: string;
}

class VideoEditState {
    video = $state<VideoDetail | null>(null);
    categories = $state<AdminOptionItem[]>([]);
    loading = $state(true);
    submitting = $state(false);

    private id = page.params.id ?? "";

    constructor(private getT: () => VideoEditT) {
        void this.init();
    }

    private async init() {
        try {
            const [videoRes, categoriesRes] = await Promise.all([
                authorizedHttp.get<DataResponse<VideoDetail>>(`/video/${this.id}`),
                authorizedHttp.get<DataResponse<AdminOptionItem[]>>("/video-category/admin-options")
            ]);
            this.video = videoRes.data.data;
            this.categories = categoriesRes.data.data;
        } catch {
            popup.error({ message: this.getT().loadDetailFailed });
            void goto(resolve("/admin-panel/watch/videos"));
        } finally {
            this.loading = false;
        }
    }

    handleSubmit = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);

        const description = formData.get("description");
        if (typeof description !== "string" || !description.trim()) formData.delete("description");

        const categoryId = formData.get("categoryId");
        if (typeof categoryId !== "string" || !categoryId.trim()) formData.delete("categoryId");

        const thumbnail = formData.get("thumbnail");
        if (!(thumbnail instanceof File) || thumbnail.size === 0) formData.delete("thumbnail");

        this.submitting = true;
        try {
            await authorizedHttp.put(`/video/${this.id}`, formData);
            popup.success({ message: this.getT().updated });
            void goto(resolve("/admin-panel/watch/videos"));
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, "Failed to save video") });
            this.submitting = false;
        }
    };
}

export function useVideoEdit(getT: () => VideoEditT) {
    return new VideoEditState(getT);
}
