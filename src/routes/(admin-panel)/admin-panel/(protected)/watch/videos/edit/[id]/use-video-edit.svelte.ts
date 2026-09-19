import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { authorizedHttp } from "../../../../../../api/authorized-http";
import { popup } from "../../../../../../stores/popup.svelte";
import { axiosErrorMessage } from "../../../../../../utils/axios-error-message";

import type { DataResponse } from "$lib/types/api-response";
import type { VideoDetail } from "$lib/types/video";
import type { AdminOptionItem } from "$lib/types/video-category";

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

    async update(formData: FormData): Promise<void> {
        this.submitting = true;
        try {
            await authorizedHttp.put(`/video/${this.id}`, formData);
            popup.success({ message: this.getT().updated });
            void goto(resolve("/admin-panel/watch/videos"));
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, "Failed to save video") });
        } finally {
            this.submitting = false;
        }
    }
}

export function useVideoEdit(getT: () => VideoEditT) {
    return new VideoEditState(getT);
}
