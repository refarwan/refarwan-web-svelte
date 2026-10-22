import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { authorizedHttp } from "../../../../../api/authorized-http";
import { popup } from "../../../../../stores/popup.svelte";
import { axiosErrorMessage } from "../../../../../utils/axios-error-message";

import type { DataResponse } from "$lib/types/api-response";
import type { ProjectDetail } from "$lib/types/project";
import type { AdminOptionItem } from "$lib/types/project-category";

interface ProjectEditT {
    updated: string;
    updateFailed: string;
    loadDetailFailed: string;
}

class ProjectEditState {
    project = $state<ProjectDetail | null>(null);
    categories = $state<AdminOptionItem[]>([]);
    loading = $state(true);
    submitting = $state(false);

    private id = page.params.id ?? "";

    constructor(private getT: () => ProjectEditT) {
        void this.init();
    }

    private async init() {
        try {
            const [projectRes, categoriesRes] = await Promise.all([
                authorizedHttp.get<DataResponse<ProjectDetail>>(`/project/${this.id}`),
                authorizedHttp.get<DataResponse<AdminOptionItem[]>>(
                    "/project-category/admin-options"
                )
            ]);
            this.project = projectRes.data.data;
            this.categories = categoriesRes.data.data;
        } catch {
            popup.error({ message: this.getT().loadDetailFailed });
            void goto(resolve("/admin-panel/project"));
        } finally {
            this.loading = false;
        }
    }

    async update(formData: FormData): Promise<void> {
        this.submitting = true;
        try {
            await authorizedHttp.put(`/project/${this.id}`, formData);
            popup.success({ message: this.getT().updated });
            await goto(resolve("/admin-panel/project"));
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, this.getT().updateFailed) });
        } finally {
            this.submitting = false;
        }
    }
}

export function useProjectEdit(getT: () => ProjectEditT) {
    return new ProjectEditState(getT);
}
