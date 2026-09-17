<script lang="ts">
    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";

    import RichTextEditor from "./RichTextEditor.svelte";

    interface Option {
        value: string;
        label: string;
    }

    interface Props {
        t: Record<string, string>;
        editorT: Record<string, string>;
        title: string;
        onTitleChange: (value: string) => void;
        categoryId: string;
        onCategoryChange: (value: string) => void;
        categoryOptions: Option[];
        shortDescription: string;
        onShortDescriptionChange: (value: string) => void;
    }

    let {
        t,
        editorT,
        title,
        onTitleChange,
        categoryId,
        onCategoryChange,
        categoryOptions,
        shortDescription,
        onShortDescriptionChange
    }: Props = $props();
</script>

<div class="w-full flex-1 space-y-5">
    <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700" for="article-title"
            >{t.titleLabel}</label
        >
        <input
            id="article-title"
            type="text"
            value={title}
            oninput={(event) => onTitleChange((event.target as HTMLInputElement).value)}
            placeholder={t.titlePlaceholder}
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-2xs transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
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
        <label class="block text-sm font-medium text-gray-700" for="article-short-description"
            >{t.shortDescriptionLabel}</label
        >
        <textarea
            id="article-short-description"
            rows="4"
            value={shortDescription}
            oninput={(event) =>
                onShortDescriptionChange((event.target as HTMLTextAreaElement).value)}
            placeholder={t.shortDescriptionPlaceholder}
            class="min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-2xs transition-all placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
        ></textarea>
    </div>

    <div class="space-y-1.5">
        <span class="block text-sm font-medium text-gray-700">{t.contentLabel}</span>
        <RichTextEditor t={editorT} />
    </div>
</div>
