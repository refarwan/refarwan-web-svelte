<script lang="ts">
	import Loader2 from 'lucide-svelte/icons/loader-2';

	interface Props {
		t: Record<string, string>;
		slug: string;
		disabled: boolean;
		isEnglishTab: boolean;
		isCheckingSlug: boolean;
		isTaken: boolean;
		suggestedSlug: string;
		onInput: (value: string) => void;
		onApplySuggestion: () => void;
	}

	let {
		t,
		slug,
		disabled,
		isEnglishTab,
		isCheckingSlug,
		isTaken,
		suggestedSlug,
		onInput,
		onApplySuggestion
	}: Props = $props();
</script>

<div class="space-y-1.5">
	<label class="block text-sm font-medium text-gray-900" for="category-slug">{t.slugLabel}</label>
	<div class="relative">
		<input
			id="category-slug"
			type="text"
			{disabled}
			value={slug}
			oninput={(event) => onInput((event.target as HTMLInputElement).value)}
			class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-9 pl-3.5 text-sm text-gray-900 shadow-2xs transition-all focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
		/>
		{#if isCheckingSlug}
			<div class="absolute top-1/2 right-3 -translate-y-1/2">
				<Loader2 class="h-4 w-4 animate-spin text-gray-400" />
			</div>
		{/if}
	</div>
	{#if isTaken && suggestedSlug}
		<div class="flex items-center gap-1 text-xs text-amber-600">
			<span>{t.slugTakenLabel}</span>
			<button
				type="button"
				onclick={onApplySuggestion}
				class="cursor-pointer font-semibold underline hover:text-amber-800"
			>
				{suggestedSlug}
			</button>
		</div>
	{/if}
	<p class="text-xs leading-relaxed text-gray-500">
		{isEnglishTab ? t.slugHelperEnglish : t.slugHelperOtherLang}
	</p>
</div>
