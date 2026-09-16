<script lang="ts">
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

	interface Props {
		t: Record<string, string>;
		slug: string;
		disabled: boolean;
		status: 'idle' | 'checking' | 'available' | 'taken';
		suggestedSlug: string;
		onInput: (value: string) => void;
		onApplySuggestion: () => void;
	}

	let { t, slug, disabled, status, suggestedSlug, onInput, onApplySuggestion }: Props = $props();
</script>

<div class="flex flex-col gap-1.5">
	<label class="block text-[13px] font-medium text-gray-700" for="category-slug">
		{t.slugLabel}
	</label>
	<input
		id="category-slug"
		type="text"
		value={slug}
		oninput={(event) => onInput((event.target as HTMLInputElement).value)}
		{disabled}
		class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
	/>
	<p class="text-[11px] text-gray-500">{t.slugHelper}</p>

	{#if !disabled && slug.trim()}
		<div class="flex items-center gap-1.5 text-xs">
			{#if status === 'checking'}
				<Loader2 class="h-3.5 w-3.5 animate-spin text-gray-400" />
				<span class="text-gray-400">{t.slugCheckingLabel}</span>
			{:else if status === 'available'}
				<CircleCheck class="h-3.5 w-3.5 text-emerald-600" />
				<span class="text-emerald-600">{t.slugAvailableLabel}</span>
			{:else if status === 'taken'}
				<TriangleAlert class="h-3.5 w-3.5 text-amber-500" />
				<span class="text-amber-600">{t.slugTakenLabel}</span>
				<button
					type="button"
					onclick={onApplySuggestion}
					class="cursor-pointer font-medium text-theme-600 underline hover:text-theme-700"
				>
					{t.useSuggestion} ({suggestedSlug})
				</button>
			{/if}
		</div>
	{/if}
</div>
