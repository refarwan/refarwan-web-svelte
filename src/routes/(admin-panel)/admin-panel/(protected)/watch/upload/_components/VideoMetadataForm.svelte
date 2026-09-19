<script lang="ts">
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";
    import VideoDropzone from "./VideoDropzone.svelte";

    interface Option {
        value: string;
        label: string;
    }

    interface Props {
        t: Record<string, string>;
        title: string;
        onTitleChange: (value: string) => void;
        categoryId: string;
        onCategoryChange: (value: string) => void;
        categoryOptions: Option[];
        description: string;
        onDescriptionChange: (value: string) => void;
        videoFile: File | null;
        onVideoSelect: (file: File | undefined) => void;
        onVideoClear: () => void;
        videoDropzoneRef?: { resetInput: () => void };
    }

    let {
        t,
        title,
        onTitleChange,
        categoryId,
        onCategoryChange,
        categoryOptions,
        description,
        onDescriptionChange,
        videoFile,
        onVideoSelect,
        onVideoClear,
        videoDropzoneRef = $bindable()
    }: Props = $props();
</script>

<div class="w-full flex-1 space-y-5">
    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="video-title"
            >{t.titleLabel}</label
        >
        <input
            id="video-title"
            type="text"
            value={title}
            oninput={(event) => onTitleChange((event.target as HTMLInputElement).value)}
            placeholder={t.titlePlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        />
    </div>

    <DropdownSelect
        label={t.categoryLabel}
        value={categoryId}
        options={categoryOptions}
        onChange={onCategoryChange}
        placeholder={t.categoryPlaceholder}
        searchable
        searchPlaceholder={t.categorySearchPlaceholder}
        noResultsText={t.categoryNoResults}
    />

    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="video-description"
            >{t.descriptionLabel}</label
        >
        <textarea
            id="video-description"
            rows="4"
            value={description}
            oninput={(event) => onDescriptionChange((event.target as HTMLTextAreaElement).value)}
            placeholder={t.descriptionPlaceholder}
            class="min-h-25 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        ></textarea>
    </div>

    <VideoDropzone
        bind:this={videoDropzoneRef}
        {t}
        {videoFile}
        onFileSelect={onVideoSelect}
        onClear={onVideoClear}
    />
</div>
