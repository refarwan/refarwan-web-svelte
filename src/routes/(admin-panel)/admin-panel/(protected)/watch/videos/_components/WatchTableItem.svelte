<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import CategoryBadge from "./CategoryBadge.svelte";
    import StatusBadge from "./StatusBadge.svelte";

    import type { VideoItem } from "$lib/types/video";

    interface Props {
        video: VideoItem;
        isEn?: boolean;
        isDeleting?: boolean;
        isArchiving?: boolean;
        onViewDetail: (video: VideoItem) => void;
        onArchive: (video: VideoItem) => void;
        onUnarchive: (video: VideoItem) => void;
        onDelete: (video: VideoItem) => void;
    }

    let {
        video,
        isEn = true,
        isDeleting = false,
        isArchiving = false,
        onViewDetail,
        onArchive,
        onUnarchive,
        onDelete
    }: Props = $props();

    const title = $derived(video.title || (isEn ? "Untitled" : "Tanpa Judul"));
    const categoryName = $derived(video.category || "-");
    const isArchived = $derived(video.status === "archived");

    const formattedDate = $derived(
        new Date(video.createdAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    );

    const editHref = $derived(
        resolve(`/admin-panel/watch/videos/edit/${video.id}` as `/${string}`)
    );
</script>

<div
    class={`grid grid-cols-[68px_auto] gap-x-3 gap-y-1 rounded-xl border border-gray-200 bg-white px-3 pt-4 pb-3 transition-all duration-300 lg:grid-cols-[56px_1fr_245px_120px_60px_110px] lg:items-center lg:gap-4 lg:rounded-none lg:border-t-0 lg:last:rounded-b-xl xl:grid-cols-[64px_1fr_245px_120px_60px_110px] ${isDeleting ? "pointer-events-none scale-99 border-red-200 bg-red-50/70 opacity-40" : "hover:bg-gray-50/60"}`}
>
    <!-- 1. Thumbnail (16:9 and centered) -->
    {#if video.thumbnail}
        <button
            type="button"
            onclick={() => onViewDetail(video)}
            class="row-span-5 flex aspect-video w-full cursor-pointer items-center justify-center self-center overflow-hidden rounded-md border border-gray-100 bg-black lg:order-1 lg:row-span-1 lg:self-center"
        >
            <img
                src={video.thumbnail.small}
                alt={`Thumbnail ${title}`}
                class="h-full w-full object-contain object-center"
                loading="eager"
            />
        </button>
    {:else}
        <div
            class="row-span-5 flex aspect-video w-full items-center justify-center self-center rounded-md bg-gray-200 lg:order-1 lg:row-span-1 lg:self-center"
        ></div>
    {/if}

    <!-- 2. Badges (Status + Category) -->
    <div class="flex gap-1.5 lg:order-3 lg:grid lg:grid-cols-2 lg:flex-row-reverse">
        <StatusBadge status={video.status} lang={isEn ? "en" : "id"} class="w-max" />
        <CategoryBadge category={categoryName} />
    </div>

    <!-- 3. Title -->
    <button
        type="button"
        onclick={() => onViewDetail(video)}
        class="line-clamp-1 cursor-pointer text-left text-[14px] font-medium text-gray-900 transition-colors hover:text-theme-500 lg:order-2"
    >
        {title}
    </button>

    <!-- 4. Date -->
    <div class="text-[13px] text-gray-500 lg:order-4">
        {formattedDate}
    </div>

    <!-- 5. Views Count -->
    <div class="flex items-center text-[13px] text-gray-500 lg:order-5 lg:text-gray-900">
        <Icon icon="lucide:eye" class="h-3.5 w-3.5 lg:hidden" />
        <span class="ml-1">
            {(video.viewsCount ?? 0).toLocaleString(isEn ? "en-US" : "id-ID")}
            <span class="lg:hidden">{isEn ? "Views" : "Penayangan"}</span>
        </span>
    </div>

    <!-- 6. Actions (Edit, Archive, Delete) -->
    <div class="flex w-full justify-end gap-3 lg:order-6">
        <a
            href={editHref}
            title={isEn ? "Edit" : "Ubah"}
            class="grid h-7 w-7 cursor-pointer place-content-center rounded-md border border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
            <Icon icon="lucide:square-pen" class="h-3.5 w-3.5" />
        </a>

        <button
            type="button"
            disabled={isDeleting || isArchiving}
            onclick={() => (isArchived ? onUnarchive(video) : onArchive(video))}
            title={isArchived
                ? isEn
                    ? "Unarchive"
                    : "Batalkan Arsip"
                : isEn
                  ? "Archive"
                  : "Arsipkan"}
            class="grid h-7 w-7 cursor-pointer place-content-center rounded-md border border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed"
        >
            {#if isArchiving}
                <Icon icon="lucide:loader-2" class="h-3.5 w-3.5 animate-spin text-gray-500" />
            {:else if isArchived}
                <Icon icon="lucide:archive-restore" class="h-3.5 w-3.5" />
            {:else}
                <Icon icon="lucide:archive" class="h-3.5 w-3.5" />
            {/if}
        </button>

        <button
            type="button"
            disabled={isDeleting}
            onclick={() => onDelete(video)}
            title={isEn ? "Delete" : "Hapus"}
            class="grid h-7 w-7 cursor-pointer place-content-center rounded-md border border-red-300 bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed"
        >
            {#if isDeleting}
                <Icon icon="lucide:loader-2" class="h-3.5 w-3.5 animate-spin text-red-500" />
            {:else}
                <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
            {/if}
        </button>
    </div>
</div>
