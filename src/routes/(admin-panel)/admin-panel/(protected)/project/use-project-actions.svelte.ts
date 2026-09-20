import { popup } from "../../../stores/popup.svelte";
import { axiosErrorMessage } from "../../../utils/axios-error-message";

import type { ProjectItem } from "$lib/types/project";
import type { useProjectList } from "./use-project-list.svelte";

type ProjectListInstance = ReturnType<typeof useProjectList>;

export function useProjectActions(
    projectList: ProjectListInstance,
    getT: () => Record<string, string>,
    getCommonT: () => Record<string, string>
) {
    let deletingId = $state<string | null>(null);
    let archivingId = $state<string | null>(null);

    const confirmDelete = (item: ProjectItem) => {
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
                    await projectList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to delete project") });
                } finally {
                    deletingId = null;
                }
            }
        });
    };

    const confirmArchive = (item: ProjectItem) => {
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
                    await projectList.archive(item.id);
                    popup.success({ message: t.archived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to archive project") });
                } finally {
                    archivingId = null;
                }
            }
        });
    };

    const confirmUnarchive = (item: ProjectItem) => {
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
                    await projectList.unarchive(item.id);
                    popup.success({ message: t.unarchived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to restore project") });
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
