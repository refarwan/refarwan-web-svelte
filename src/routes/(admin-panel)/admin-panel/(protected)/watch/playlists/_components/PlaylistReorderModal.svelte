<script lang="ts">
    import Icon from "@iconify/svelte";
    import { untrack } from "svelte";
    import { formatDuration } from "$lib/utils/watch-format";
    import { axiosErrorMessage } from "../../../../../utils/axios-error-message";

    import type { PlaylistDetail, PlaylistVideoItem } from "$lib/types/playlist";
    import type { WatchPlaylistTranslationObjects } from "../../../../../i18n/watch-playlist/types";

    interface Props {
        playlist: PlaylistDetail;
        onClose: () => void;
        onReorder: (id: string, videoIds: string[]) => Promise<void>;
        t: WatchPlaylistTranslationObjects;
        cancelLabel: string;
    }

    let { playlist, onClose, onReorder, t, cancelLabel }: Props = $props();

    let videos = $state<PlaylistVideoItem[]>(untrack(() => [...(playlist.videos ?? [])]));
    let submitting = $state(false);
    let errorMessage = $state("");

    const move = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === videos.length - 1)
        ) {
            return;
        }
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const newArr = [...videos];
        const temp = newArr[index];
        newArr[index] = newArr[targetIndex];
        newArr[targetIndex] = temp;
        videos = newArr;
    };

    const handleSave = async () => {
        errorMessage = "";
        submitting = true;
        try {
            const videoIds = videos.map((v) => v.videoId);
            await onReorder(playlist.id, videoIds);
            onClose();
        } catch (err) {
            errorMessage = axiosErrorMessage(err, "Failed to reorder playlist videos");
        } finally {
            submitting = false;
        }
    };
</script>

<div
    class="w-[92vw] max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
>
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div>
            <h2 class="text-base font-semibold text-gray-900">Reorder Videos</h2>
            <p class="max-w-md truncate text-xs text-gray-400">{playlist.title}</p>
        </div>
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={t.closeModal}
        >
            <Icon icon="lucide:x" class="h-5 w-5" />
        </button>
    </div>

    <!-- Content -->
    <div class="max-h-[calc(75vh-100px)] space-y-4 overflow-y-auto bg-white p-6">
        {#if errorMessage}
            <div
                class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600"
            >
                <Icon icon="lucide:alert-circle" class="h-4 w-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
            </div>
        {/if}

        <p class="text-xs text-gray-500">{t.reorderVideosHint}</p>

        <div class="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {#if videos.length === 0}
                <div class="p-8 text-center text-xs text-gray-400">
                    {t.noVideosSelected}
                </div>
            {:else}
                {#each videos as video, idx (video.videoId)}
                    <div class="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50">
                        <span class="w-6 text-center font-mono text-xs font-semibold text-gray-400">
                            {idx + 1}
                        </span>
                        {#if video.thumbnail?.small || video.thumbnail?.medium}
                            <img
                                src={video.thumbnail.small || video.thumbnail.medium}
                                alt=""
                                class="h-10 w-16 shrink-0 rounded-md object-cover ring-1 ring-gray-200"
                            />
                        {:else}
                            <div
                                class="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400"
                            >
                                <Icon icon="lucide:video" class="h-5 w-5" />
                            </div>
                        {/if}
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-xs font-medium text-gray-900">{video.title}</p>
                            <p class="text-[11px] text-gray-400">
                                {formatDuration(video.duration)}
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                disabled={idx === 0}
                                onclick={() => move(idx, "up")}
                                class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30"
                                title={t.moveUp}
                            >
                                <Icon icon="lucide:arrow-up" class="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                disabled={idx === videos.length - 1}
                                onclick={() => move(idx, "down")}
                                class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30"
                                title={t.moveDown}
                            >
                                <Icon icon="lucide:arrow-down" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
        <button
            type="button"
            onclick={onClose}
            class="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
            {cancelLabel}
        </button>
        <button
            type="button"
            disabled={submitting || videos.length === 0}
            onclick={handleSave}
            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-theme-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-theme-700 disabled:opacity-50"
        >
            {#if submitting}
                <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
            {/if}
            <span>{t.saveChanges}</span>
        </button>
    </div>
</div>
