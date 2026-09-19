<script lang="ts">
    interface Props {
        isEn?: boolean;
    }

    let { isEn = true }: Props = $props();
</script>

<div
    class="hidden grid-cols-[56px_1fr_245px_120px_60px_110px] gap-4 overflow-hidden rounded-t-xl border border-gray-200 bg-theme-50 px-4 py-3 text-[13px] font-semibold text-gray-900 lg:grid xl:grid-cols-[64px_1fr_245px_120px_60px_110px]"
>
    <div></div>
    <div class="flex-1">{isEn ? "Video Title" : "Judul Video"}</div>
    <div class="grid grid-cols-2">
        <div class="w-27.5">Status</div>
        <div class="w-25">{isEn ? "Category" : "Kategori"}</div>
    </div>
    <div class="w-30">{isEn ? "Uploaded Date" : "Tanggal Diupload"}</div>
    <div class="w-5">{isEn ? "Views" : "Dilihat"}</div>
    <div class="w-27.5 text-center">{isEn ? "Action" : "Aksi"}</div>
</div>
