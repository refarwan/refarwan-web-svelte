<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Search from 'lucide-svelte/icons/search';

	export interface DropdownOption {
		value: string;
		label: string;
		icon?: string;
	}

	interface Props {
		id?: string;
		label?: string;
		value?: string;
		options: DropdownOption[];
		placeholder?: string;
		onChange: (value: string) => void;
		disabled?: boolean;
		helperText?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		noResultsText?: string;
		class?: string;
	}

	let {
		id,
		label,
		value,
		options,
		placeholder = 'Select...',
		onChange,
		disabled = false,
		helperText,
		searchable = false,
		searchPlaceholder = 'Search...',
		noResultsText = 'No results found',
		class: className = ''
	}: Props = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let activeIndex = $state(-1);
	let dropdownRef: HTMLDivElement | undefined = $state();
	let triggerRef: HTMLButtonElement | undefined = $state();
	let searchInputRef: HTMLInputElement | undefined = $state();
	let itemRefs: (HTMLButtonElement | undefined)[] = $state([]);

	const selectedOption = $derived(options.find((opt) => opt.value === value));
	const filteredOptions = $derived(
		searchable
			? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
			: options
	);

	const openDropdown = (): void => {
		if (disabled) return;
		isOpen = true;
		const currentIndex = filteredOptions.findIndex((opt) => opt.value === value);
		activeIndex = currentIndex >= 0 ? currentIndex : filteredOptions.length > 0 ? 0 : -1;
		if (searchable) {
			setTimeout(() => searchInputRef?.focus(), 50);
		}
	};

	const closeDropdown = (): void => {
		isOpen = false;
		searchQuery = '';
		activeIndex = -1;
	};

	const handleSelect = (optionValue: string): void => {
		onChange(optionValue);
		closeDropdown();
		triggerRef?.focus();
	};

	const handleKeyDown = (event: KeyboardEvent): void => {
		if (!isOpen) {
			if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
				event.preventDefault();
				openDropdown();
			}
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = filteredOptions.length > 0 ? (activeIndex + 1) % filteredOptions.length : -1;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex =
				filteredOptions.length > 0
					? (activeIndex - 1 + filteredOptions.length) % filteredOptions.length
					: -1;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
				handleSelect(filteredOptions[activeIndex].value);
			}
		} else if (event.key === 'Escape' || event.key === 'Tab') {
			if (event.key === 'Escape') event.preventDefault();
			closeDropdown();
			triggerRef?.focus();
		}
	};

	const handleSearchChange = (event: Event): void => {
		searchQuery = (event.target as HTMLInputElement).value;
		activeIndex = 0;
	};

	$effect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) closeDropdown();
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	$effect(() => {
		if (activeIndex >= 0) itemRefs[activeIndex]?.scrollIntoView({ block: 'nearest' });
	});
</script>

<div class={`w-full space-y-1.5 ${className}`} bind:this={dropdownRef}>
	{#if label}
		<span class="block text-[13px] font-medium text-gray-700">{label}</span>
	{/if}

	<div class="relative">
		<button
			bind:this={triggerRef}
			{id}
			type="button"
			{disabled}
			onclick={() => (isOpen ? closeDropdown() : openDropdown())}
			onkeydown={handleKeyDown}
			class="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3.5 py-2 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
		>
			<span class="flex items-center gap-2.5 truncate">
				{#if selectedOption?.icon}
					<span class="shrink-0 text-base select-none">{selectedOption.icon}</span>
				{/if}
				<span class="truncate text-sm font-normal text-gray-900">
					{selectedOption ? selectedOption.label : placeholder}
				</span>
			</span>
			<ChevronDown
				class={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
			/>
		</button>

		{#if isOpen}
			<div
				role="listbox"
				tabindex="-1"
				onkeydown={handleKeyDown}
				class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg focus:outline-none"
			>
				{#if searchable}
					<div class="sticky top-0 z-10 border-b border-gray-100 bg-white p-2">
						<div class="relative flex items-center">
							<Search class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
							<input
								bind:this={searchInputRef}
								type="text"
								value={searchQuery}
								oninput={handleSearchChange}
								placeholder={searchPlaceholder}
								class="w-full rounded border border-gray-200 py-1.5 pr-2.5 pl-8 text-xs text-gray-800 placeholder:text-gray-400 focus:border-theme-500 focus:outline-none"
								onclick={(event) => event.stopPropagation()}
							/>
						</div>
					</div>
				{/if}

				{#if filteredOptions.length === 0}
					<div class="px-3.5 py-3 text-center text-xs text-gray-400">{noResultsText}</div>
				{:else}
					{#each filteredOptions as opt, index (opt.value)}
						{@const isSelected = opt.value === value}
						{@const isActive = index === activeIndex}
						<button
							bind:this={itemRefs[index]}
							type="button"
							role="option"
							aria-selected={isSelected}
							onmouseenter={() => (activeIndex = index)}
							onclick={() => handleSelect(opt.value)}
							class={`flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-[13px] transition-colors ${
								isActive ? 'bg-theme-50 text-theme-900' : 'text-gray-800 hover:bg-gray-50'
							}`}
						>
							<span class="flex items-center gap-2.5 truncate">
								{#if opt.icon}
									<span class="shrink-0 text-base select-none">{opt.icon}</span>
								{/if}
								<span class={`truncate ${isActive || isSelected ? 'font-medium' : 'font-normal'}`}>
									{opt.label}
								</span>
							</span>
							{#if isSelected}
								<Check class="h-4 w-4 shrink-0 text-theme-600" />
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	{#if helperText}
		<p class="text-[11px] text-gray-500">{helperText}</p>
	{/if}
</div>
