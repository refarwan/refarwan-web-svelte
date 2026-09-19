import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { authorizedHttp } from "$lib/api/authorized-http";
import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";

import type { DataResponse } from "$lib/types/api-response";
import type { ArticleDetail } from "$lib/types/article";
import type { AdminOptionItem } from "$lib/types/video-category";

interface ArticleEditT {
    updated: string;
    loadDetailFailed: string;
}

class ArticleEditState {
    article = $state<ArticleDetail | null>(null);
    categories = $state<AdminOptionItem[]>([]);
    loading = $state(true);
    submitting = $state(false);

    private id = page.params.id ?? "";

    constructor(private getT: () => ArticleEditT) {
        void this.init();
    }

    private async init() {
        try {
            const [articleRes, categoriesRes] = await Promise.all([
                authorizedHttp.get<DataResponse<ArticleDetail>>(`/article/${this.id}`),
                authorizedHttp.get<DataResponse<AdminOptionItem[]>>(
                    "/article-category/admin-options"
                )
            ]);
            this.article = articleRes.data.data;
            this.categories = categoriesRes.data.data;
        } catch {
            popup.error({ message: this.getT().loadDetailFailed });
            void goto(resolve("/admin-panel/blog/articles"));
        } finally {
            this.loading = false;
        }
    }

    async update(formData: FormData): Promise<void> {
        this.submitting = true;
        try {
            await authorizedHttp.put(`/article/${this.id}`, formData);
            popup.success({ message: this.getT().updated });
            await goto(resolve("/admin-panel/blog/articles"));
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, "Failed to update article") });
        } finally {
            this.submitting = false;
        }
    }
}

export function useArticleEdit(getT: () => ArticleEditT) {
    return new ArticleEditState(getT);
}
