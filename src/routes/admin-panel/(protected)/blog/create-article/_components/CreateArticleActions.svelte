<script lang="ts">
    interface Props {
        t: Record<string, string>;
        cancelLabel: string;
        cancelHref: string;
        onSaveDraft: () => void;
        onPublish: () => void;
    }

    let { t, cancelLabel, cancelHref, onSaveDraft, onPublish }: Props = $props();
</script>

<div class="flex items-center justify-end gap-3 pt-2">
    <a
        href={cancelHref}
        class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
    >
        {cancelLabel}
    </a>

    <button
        type="button"
        onclick={onSaveDraft}
        class="cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
    >
        {t.submitDraft}
    </button>

    <button
        type="button"
        onclick={onPublish}
        class="cursor-pointer rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-theme-700"
    >
        {t.submitPublish}
    </button>
</div>
