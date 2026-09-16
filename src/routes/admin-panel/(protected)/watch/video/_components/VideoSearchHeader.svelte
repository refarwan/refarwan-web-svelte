<script lang="ts">
	import Search from 'lucide-svelte/icons/search';

	interface Props {
		t: Record<string, string>;
		value: string;
		onInput: () => void;
		addHref: string;
	}

	let { t, value = $bindable(), onInput, addHref }: Props = $props();
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<div class="relative w-full max-w-sm">
		<Search
			class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
		/>
		<input
			type="text"
			bind:value
			oninput={onInput}
			placeholder={t.searchPlaceholder}
			class="h-10 w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
		/>
	</div>
	<a
		href={addHref}
		class="inline-flex items-center justify-center rounded-md bg-theme-600 px-4 py-2 text-sm font-medium text-white shadow-2xs transition-colors hover:bg-theme-700"
	>
		{t.addVideo}
	</a>
</div>
