import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";

import type { ArticleItem } from "$lib/types/article";
import type { useArticleList } from "./use-article-list.svelte";

type ArticleListInstance = ReturnType<typeof useArticleList>;

export function useArticleActions(
    articleList: ArticleListInstance,
    getT: () => Record<string, string>,
    getCommonT: () => Record<string, string>
) {
    let deletingId = $state<string | null>(null);
    let archivingId = $state<string | null>(null);

    const confirmDelete = (item: ArticleItem) => {
        const t = getT();
        const commonT = getCommonT();
        popup.confirm({
            title: t.deleteConfirmTitle,
            message: t.deleteConfirmMessage,
            confirmText: t.deleteConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                deletingId = item.id;
                try {
                    await articleList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to delete article") });
                } finally {
                    deletingId = null;
                }
            }
        });
    };

    const confirmArchive = (item: ArticleItem) => {
        const t = getT();
        const commonT = getCommonT();
        popup.confirm({
            title: t.archiveConfirmTitle,
            message: t.archiveConfirmMessage,
            confirmText: t.archiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                archivingId = item.id;
                try {
                    await articleList.archive(item.id);
                    popup.success({ message: t.archived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to archive article") });
                } finally {
                    archivingId = null;
                }
            }
        });
    };

    const confirmUnarchive = (item: ArticleItem) => {
        const t = getT();
        const commonT = getCommonT();
        popup.confirm({
            title: t.unarchiveConfirmTitle,
            message: t.unarchiveConfirmMessage,
            confirmText: t.unarchiveConfirmButton,
            cancelText: commonT.cancel,
            onConfirm: async () => {
                archivingId = item.id;
                try {
                    await articleList.unarchive(item.id);
                    popup.success({ message: t.unarchived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to restore article") });
                } finally {
                    archivingId = null;
                }
            }
        });
    };

    return {
        get deletingId() {
            return deletingId;
        },
        get archivingId() {
            return archivingId;
        },
        confirmDelete,
        confirmArchive,
        confirmUnarchive
    };
}
