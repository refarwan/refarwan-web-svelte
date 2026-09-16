<script lang="ts">
	import type { ContentLanguage } from '$lib/types';

	interface Props {
		languages: ContentLanguage[];
		activeCode: string;
		onSelect: (code: string) => void;
	}

	let { languages, activeCode, onSelect }: Props = $props();
</script>

{#if languages.length > 1}
	<div class="flex flex-wrap gap-1.5">
		{#each languages as lang (lang.code)}
			<button
				type="button"
				onclick={() => onSelect(lang.code)}
				class={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
					activeCode === lang.code
						? 'border-theme-600 bg-theme-50 text-theme-700'
						: 'border-gray-200 text-gray-500 hover:bg-gray-50'
				}`}
			>
				<span class="leading-none">{lang.flag}</span>
				<span>{lang.name}</span>
			</button>
		{/each}
	</div>
{/if}
