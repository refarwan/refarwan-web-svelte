import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";
import type { VideoItem } from "$lib/types";
import type { useVideoList } from "./use-video-list.svelte";

type VideoListInstance = ReturnType<typeof useVideoList>;

export function useVideoActions(
    videoList: VideoListInstance,
    getT: () => Record<string, string>,
    getCommonT: () => Record<string, string>
) {
    let deletingId = $state<string | null>(null);
    let archivingId = $state<string | null>(null);

    const confirmDelete = (item: VideoItem) => {
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
                    await videoList.remove(item.id);
                    popup.success({ message: t.deleted });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to delete video") });
                } finally {
                    deletingId = null;
                }
            }
        });
    };

    const confirmArchive = (item: VideoItem) => {
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
                    await videoList.archive(item.id);
                    popup.success({ message: t.archived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to archive video") });
                } finally {
                    archivingId = null;
                }
            }
        });
    };

    const confirmUnarchive = (item: VideoItem) => {
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
                    await videoList.unarchive(item.id);
                    popup.success({ message: t.unarchived });
                } catch (err) {
                    popup.error({ message: axiosErrorMessage(err, "Failed to restore video") });
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
