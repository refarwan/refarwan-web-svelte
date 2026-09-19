<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { DropdownOption } from "./DropdownSelect.svelte";

    interface Props {
        id?: string;
        disabled: boolean;
        isOpen: boolean;
        selectedOption?: DropdownOption;
        placeholder: string;
        onToggle: () => void;
        onKeyDown: (event: KeyboardEvent) => void;
        triggerRef?: HTMLButtonElement;
    }

    let {
        id,
        disabled,
        isOpen,
        selectedOption,
        placeholder,
        onToggle,
        onKeyDown,
        triggerRef = $bindable()
    }: Props = $props();
</script>

<button
    bind:this={triggerRef}
    {id}
    type="button"
    {disabled}
    onclick={onToggle}
    onkeydown={onKeyDown}
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
    <Icon
        icon="lucide:chevron-down"
        class={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
</button>
