<script lang="ts">
    interface Props {
        t: Record<string, string>;
        activeLangCode: string;
        value: string;
        disabled: boolean;
        onInput: (value: string) => void;
    }

    let { t, activeLangCode, value, disabled, onInput }: Props = $props();

    const isEnglishTab = $derived(activeLangCode.toLowerCase() === "en");
    const placeholder = $derived(
        isEnglishTab
            ? t.namePlaceholder
            : t.namePlaceholderLang.replace("{lang}", activeLangCode.toUpperCase())
    );
</script>

<div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-900" for="category-name">
        {t.nameLabel}
    </label>
    <input
        id="category-name"
        type="text"
        {disabled}
        {value}
        oninput={(event) => onInput((event.target as HTMLInputElement).value)}
        {placeholder}
        class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-all focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none disabled:opacity-60"
    />
</div>
