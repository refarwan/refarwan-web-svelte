<script lang="ts">
    import { X as XIcon } from "lucide-svelte/icons";

    interface Props {
        isEn?: boolean;
        onClose: () => void;
    }

    let { isEn = true, onClose }: Props = $props();
</script>

<div
    class="flex w-full shrink-0 items-center justify-between border-b border-gray-200 px-6 pt-5 pb-4"
>
    <p class="text-[18px] font-semibold text-gray-900">
        {isEn ? "Video Details" : "Detail Video"}
    </p>
    <button
        type="button"
        onclick={onClose}
        class="flex size-7 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title={isEn ? "Close" : "Tutup"}
    >
        <XIcon class="size-4.5" />
    </button>
</div>
