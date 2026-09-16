<script lang="ts">
	import type { ContentLanguage } from '$lib/types';

	interface Props {
		t: Record<string, string>;
		activeLang?: ContentLanguage;
		value: string;
		onInput: (value: string) => void;
	}

	let { t, activeLang, value, onInput }: Props = $props();
</script>

<div class="flex flex-col gap-1.5">
	<label class="block text-[13px] font-medium text-gray-700" for="category-name">
		{t.nameLabel}
		{#if activeLang}
			<span class="font-normal text-gray-400">({activeLang.name})</span>
		{/if}
	</label>
	<input
		id="category-name"
		type="text"
		{value}
		oninput={(event) => onInput((event.target as HTMLInputElement).value)}
		placeholder={t.namePlaceholder}
		class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
	/>
</div>
