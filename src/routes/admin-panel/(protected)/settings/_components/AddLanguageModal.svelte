<script lang="ts">
	import Search from 'lucide-svelte/icons/search';
	import X from 'lucide-svelte/icons/x';

	import { CONTENT_LANGUAGES } from '$lib/constants';

	interface Props {
		activeCodes: string[];
		onClose: () => void;
		onAddLanguage: (locale: string) => void;
		title: string;
		searchPlaceholder: string;
		defaultLabel: string;
		activeLabel: string;
		addLabel: string;
		doneLabel: string;
		closeLabel: string;
	}

	let {
		activeCodes: initialActiveCodes,
		onClose,
		onAddLanguage,
		title,
		searchPlaceholder,
		defaultLabel,
		activeLabel,
		addLabel,
		doneLabel,
		closeLabel
	}: Props = $props();

	let searchQuery = $state('');
	let activeCodes = $state([...initialActiveCodes]);

	const filteredLanguages = $derived(
		CONTENT_LANGUAGES.filter(
			(lang) =>
				lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lang.code.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const handleAdd = (locale: string, code: string): void => {
		if (activeCodes.includes(code)) return;
		activeCodes = [...activeCodes, code];
		onAddLanguage(locale);
	};
</script>

<div class="relative w-full max-w-105 rounded-xl border border-gray-200 bg-white shadow-xl">
	<div class="flex items-center justify-between px-5 py-4">
		<h3 class="text-base font-semibold text-gray-900">{title}</h3>
		<button
			type="button"
			onclick={onClose}
			aria-label={closeLabel}
			class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
		>
			<X class="h-4 w-4" />
		</button>
	</div>

	<hr class="border-gray-100" />

	<div class="p-4 pb-2">
		<div class="relative flex items-center">
			<Search class="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={searchPlaceholder}
				class="w-full rounded-md border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
			/>
		</div>
	</div>

	<div class="max-h-72 space-y-1 overflow-y-auto px-4 py-2">
		{#each filteredLanguages as item (item.code)}
			{@const active = activeCodes.includes(item.code)}
			<div
				class="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50"
			>
				<div class="flex items-center gap-3">
					<span class="text-base select-none">{item.flag}</span>
					<div>
						<p class="text-sm font-medium text-gray-800">{item.name}</p>
						<p class="text-[11px] text-gray-400">{item.code}</p>
					</div>
				</div>

				{#if item.code === 'en'}
					<span class="rounded-full bg-[#edf7ed] px-2.5 py-0.5 text-xs font-medium text-[#268c40]">
						{defaultLabel}
					</span>
				{:else if active}
					<span class="rounded-full bg-[#edf7ed] px-2.5 py-0.5 text-xs font-medium text-[#268c40]">
						{activeLabel}
					</span>
				{:else}
					<button
						type="button"
						onclick={() => handleAdd(item.locale, item.code)}
						class="cursor-pointer rounded-md border border-theme-600 px-3 py-1 text-xs font-medium text-theme-600 transition-colors hover:bg-theme-50"
					>
						{addLabel}
					</button>
				{/if}
			</div>
		{/each}
	</div>

	<hr class="border-gray-100" />

	<div class="p-4">
		<button
			type="button"
			onclick={onClose}
			class="w-full cursor-pointer rounded-md bg-theme-600 py-2 text-sm font-medium text-white transition-colors hover:bg-theme-700"
		>
			{doneLabel}
		</button>
	</div>
</div>
