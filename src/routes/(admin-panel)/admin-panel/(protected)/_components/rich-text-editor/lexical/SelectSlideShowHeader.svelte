<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        title: string;
        subtitle: string;
        activeTab: "library" | "upload";
        tabLibraryLabel: string;
        tabUploadLabel: string;
        onTabChange: (tab: "library" | "upload") => void;
        onClose: () => void;
    }

    let {
        title,
        subtitle,
        activeTab,
        tabLibraryLabel,
        tabUploadLabel,
        onTabChange,
        onClose
    }: Props = $props();
</script>

<div class="flex items-center justify-between border-b border-gray-200 px-6 py-3.5 select-none">
    <div>
        <h3 class="text-base font-semibold text-gray-900">{title}</h3>
        <p class="text-xs text-gray-500">{subtitle}</p>
    </div>
    <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Tutup"
    >
        <Icon icon="lucide:x" class="size-5" />
    </button>
</div>

<div class="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-2 select-none">
    <button
        type="button"
        onclick={() => onTabChange("library")}
        class={`relative cursor-pointer px-4 py-2 text-xs font-semibold transition-colors ${activeTab === "library" ? "border-b-2 border-theme-600 text-theme-600" : "text-gray-500 hover:text-gray-700"}`}
    >
        {tabLibraryLabel}
    </button>
    <button
        type="button"
        onclick={() => onTabChange("upload")}
        class={`relative cursor-pointer px-4 py-2 text-xs font-semibold transition-colors ${activeTab === "upload" ? "border-b-2 border-theme-600 text-theme-600" : "text-gray-500 hover:text-gray-700"}`}
    >
        {tabUploadLabel}
    </button>
</div>
