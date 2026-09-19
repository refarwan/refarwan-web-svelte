<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        title: string;
        subtitle: string;
        activeTab: "library" | "embed";
        tabLibraryLabel: string;
        tabEmbedLabel: string;
        onTabChange: (tab: "library" | "embed") => void;
        onClose: () => void;
    }

    let {
        title,
        subtitle,
        activeTab,
        tabLibraryLabel,
        tabEmbedLabel,
        onTabChange,
        onClose
    }: Props = $props();
</script>

<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 select-none">
    <div>
        <h3 class="text-base font-semibold text-gray-900">{title}</h3>
        <p class="text-xs text-gray-500">{subtitle}</p>
    </div>
    <button
        type="button"
        onclick={onClose}
        aria-label="Close"
        class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
    >
        <Icon icon="lucide:x" width={18} height={18} />
    </button>
</div>

<div class="flex border-b border-gray-200 px-6 select-none">
    <button
        type="button"
        onclick={() => onTabChange("library")}
        class={`cursor-pointer border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${activeTab === "library" ? "border-theme-600 text-theme-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    >
        {tabLibraryLabel}
    </button>
    <button
        type="button"
        onclick={() => onTabChange("embed")}
        class={`cursor-pointer border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${activeTab === "embed" ? "border-theme-600 text-theme-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    >
        {tabEmbedLabel}
    </button>
</div>
