<script lang="ts">
    import Icon from "@iconify/svelte";
    import DropdownOptionItem from "./DropdownOptionItem.svelte";
    import DropdownTrigger from "./DropdownTrigger.svelte";

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
        placeholder = "Select...",
        onChange,
        disabled = false,
        helperText,
        searchable = false,
        searchPlaceholder = "SearchIcon...",
        noResultsText = "No results found",
        class: className = ""
    }: Props = $props();

    let isOpen = $state(false);
    let searchQuery = $state("");
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
        searchQuery = "";
        activeIndex = -1;
    };

    const handleSelect = (optionValue: string): void => {
        onChange(optionValue);
        closeDropdown();
        triggerRef?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (!isOpen) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
                event.preventDefault();
                openDropdown();
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            activeIndex =
                filteredOptions.length > 0 ? (activeIndex + 1) % filteredOptions.length : -1;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            activeIndex =
                filteredOptions.length > 0
                    ? (activeIndex - 1 + filteredOptions.length) % filteredOptions.length
                    : -1;
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                handleSelect(filteredOptions[activeIndex].value);
            }
        } else if (event.key === "Escape" || event.key === "Tab") {
            if (event.key === "Escape") event.preventDefault();
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    $effect(() => {
        if (activeIndex >= 0) itemRefs[activeIndex]?.scrollIntoView({ block: "nearest" });
    });
</script>

<div class={`w-full space-y-1.5 ${className}`} bind:this={dropdownRef}>
    {#if label}
        <span class="block text-[13px] font-medium text-gray-700">{label}</span>
    {/if}

    <div class="relative">
        <DropdownTrigger
            {id}
            {disabled}
            {isOpen}
            {selectedOption}
            {placeholder}
            onToggle={() => (isOpen ? closeDropdown() : openDropdown())}
            onKeyDown={handleKeyDown}
            bind:triggerRef
        />

        {#if isOpen}
            <div
                role="listbox"
                tabindex="-1"
                onkeydown={handleKeyDown}
                class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 focus:outline-none"
            >
                {#if searchable}
                    <div class="sticky top-0 z-10 border-b border-gray-100 bg-white p-2">
                        <div class="relative flex items-center">
                            <Icon
                                icon="lucide:search"
                                class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-gray-400"
                            />
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
                        <DropdownOptionItem
                            option={opt}
                            isSelected={opt.value === value}
                            isActive={index === activeIndex}
                            onHover={() => (activeIndex = index)}
                            onSelect={() => handleSelect(opt.value)}
                            bind:itemRef={itemRefs[index]}
                        />
                    {/each}
                {/if}
            </div>
        {/if}
    </div>

    {#if helperText}
        <p class="text-[11px] text-gray-500">{helperText}</p>
    {/if}
</div>
