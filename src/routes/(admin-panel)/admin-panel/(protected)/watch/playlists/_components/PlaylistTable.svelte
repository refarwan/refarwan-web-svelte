<script lang="ts">
    import Icon from "@iconify/svelte";
    import { formatDuration } from "$lib/utils/watch-format";
    import StatusBadge from "../../videos/_components/StatusBadge.svelte";

    import type { PlaylistItem } from "$lib/types/playlist";
    import type { WatchPlaylistTranslationObjects } from "../../../../../i18n/watch-playlist/types";

    interface Props {
        items: PlaylistItem[];
        t: WatchPlaylistTranslationObjects;
        onEdit: (item: PlaylistItem) => void;
        onDelete: (item: PlaylistItem) => void;
        onReorder: (item: PlaylistItem) => void;
    }

    let { items, t, onEdit, onDelete, onReorder }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
    <table class="w-full text-left text-sm text-gray-600">
        <thead
            class="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold tracking-wider text-gray-500 uppercase"
        >
            <tr>
                <th scope="col" class="px-5 py-3.5">{t.tableName}</th>
                <th scope="col" class="px-4 py-3.5">{t.tableVideos}</th>
                <th scope="col" class="px-4 py-3.5">{t.tableDuration}</th>
                <th scope="col" class="px-4 py-3.5">{t.tableStatus}</th>
                <th scope="col" class="px-5 py-3.5 text-right">{t.tableAction}</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            {#if items.length === 0}
                <tr>
                    <td colspan="5" class="px-5 py-12 text-center text-gray-400">
                        <Icon icon="lucide:list-video" class="mx-auto mb-2 h-8 w-8 text-gray-300" />
                        <p>{t.empty}</p>
                    </td>
                </tr>
            {:else}
                {#each items as playlist (playlist.id)}
                    <tr class="transition-colors hover:bg-gray-50/80">
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3.5">
                                {#if playlist.thumbnail?.medium || playlist.thumbnail?.small}
                                    <img
                                        src={playlist.thumbnail.small || playlist.thumbnail.medium}
                                        alt={playlist.title}
                                        class="h-12 w-20 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                                    />
                                {:else}
                                    <div
                                        class="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 ring-1 ring-gray-200"
                                    >
                                        <Icon icon="lucide:list-video" class="h-6 w-6" />
                                    </div>
                                {/if}
                                <div class="min-w-0 flex-1">
                                    <p class="truncate font-medium text-gray-900">
                                        {playlist.title}
                                    </p>
                                    <p class="truncate font-mono text-xs text-gray-400">
                                        /{playlist.slug}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4 text-xs whitespace-nowrap text-gray-700">
                            <span
                                class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-800"
                            >
                                {playlist.videoCount}
                                {t.videosSuffix || "videos"}
                            </span>
                        </td>
                        <td class="px-4 py-4 font-mono text-xs whitespace-nowrap text-gray-500">
                            {formatDuration(playlist.totalDuration)}
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                            <StatusBadge status={playlist.status} />
                        </td>
                        <td class="px-5 py-4 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onclick={() => onReorder(playlist)}
                                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                    title="Reorder Videos"
                                >
                                    <Icon icon="lucide:arrow-up-down" class="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onclick={() => onEdit(playlist)}
                                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                    title={t.edit}
                                >
                                    <Icon icon="lucide:pencil" class="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onclick={() => onDelete(playlist)}
                                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    title={t.delete}
                                >
                                    <Icon icon="lucide:trash-2" class="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
