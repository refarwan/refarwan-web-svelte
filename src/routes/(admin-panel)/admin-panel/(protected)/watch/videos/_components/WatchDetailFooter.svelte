<script lang="ts">
    import { resolve } from "$app/paths";

    interface Props {
        isEn?: boolean;
        videoId: string;
        onClose: () => void;
    }

    let { isEn = true, videoId, onClose }: Props = $props();

    const editHref = $derived(resolve(`/admin-panel/watch/videos/edit/${videoId}` as `/${string}`));
</script>

<div
    class="flex w-full shrink-0 items-center justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-white px-6 pt-4 pb-5"
>
    <button
        type="button"
        onclick={onClose}
        class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 transition-colors hover:bg-gray-50"
    >
        <p class="text-[14px] font-medium whitespace-nowrap text-gray-700">
            {isEn ? "Close" : "Tutup"}
        </p>
    </button>

    <a
        href={editHref}
        class="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-theme-600 px-5 py-2.5 text-white transition-colors hover:bg-theme-700"
    >
        <p class="text-[14px] font-medium whitespace-nowrap">
            {isEn ? "Edit Video" : "Ubah Video"}
        </p>
    </a>
</div>
