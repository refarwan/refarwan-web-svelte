<script lang="ts">
    import { XIcon } from "lucide-svelte/icons";

    interface Props {
        t: Record<string, string>;
        id: string;
        tags: string[];
        tagInput: string;
        onTagInputChange: (value: string) => void;
        onAddTag: (event: KeyboardEvent) => void;
        onRemoveTag: (tag: string) => void;
    }

    let { t, id, tags, tagInput, onTagInputChange, onAddTag, onRemoveTag }: Props = $props();
</script>

<div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-700" for={id}>{t.tagsLabel}</label>
    <div
        class="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-2xs focus-within:border-theme-500 focus-within:ring-1 focus-within:ring-theme-500"
    >
        {#each tags as tag (tag)}
            <span
                class="inline-flex items-center gap-1.5 rounded-full border border-theme-100 bg-theme-50 px-2.5 py-1 text-xs font-medium text-theme-600"
            >
                <span>{tag}</span>
                <button
                    type="button"
                    onclick={() => onRemoveTag(tag)}
                    class="cursor-pointer rounded-full text-theme-400 transition-colors hover:text-theme-700"
                >
                    <XIcon class="h-3 w-3" />
                </button>
            </span>
        {/each}
        <input
            {id}
            type="text"
            value={tagInput}
            oninput={(event) => onTagInputChange((event.target as HTMLInputElement).value)}
            onkeydown={onAddTag}
            placeholder={tags.length === 0
                ? t.tagInputPlaceholderEmpty
                : t.tagInputPlaceholderFilled}
            class="min-w-24 flex-1 border-none bg-transparent px-1 py-0.5 text-xs text-gray-800 placeholder-gray-400 outline-none"
        />
    </div>
</div>
