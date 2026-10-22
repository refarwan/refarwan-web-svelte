<script lang="ts">
    import Icon from "@iconify/svelte";

    interface Props {
        id?: string;
        name?: string;
        value?: string;
        placeholder?: string;
        isError?: boolean;
        supporting?: string[];
        class?: string;
        showPassword?: boolean;
        onTogglePassword?: () => void;
    }

    let {
        id,
        name,
        value = $bindable(""),
        placeholder = "••••••••",
        isError = false,
        supporting = [],
        class: className = "",
        showPassword = false,
        onTogglePassword
    }: Props = $props();
</script>

<div data-is-error={isError} class={["group", className]}>
    <div class="relative flex items-center">
        <input
            {id}
            {name}
            type={showPassword ? "text" : "password"}
            {placeholder}
            bind:value
            aria-invalid={isError}
            class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm leading-5.25 text-gray-900 group-data-[is-error=true]:border-red-600 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none group-data-[is-error=true]:focus:border-red-600 group-data-[is-error=true]:focus:ring-red-600"
        />
        <button
            type="button"
            onclick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            class="absolute right-3 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600 focus:text-gray-600 focus:outline-none"
        >
            {#if showPassword}
                <Icon icon="lucide:eye-off" class="h-5 w-5" />
            {:else}
                <Icon icon="lucide:eye" class="h-5 w-5" />
            {/if}
        </button>
    </div>
    {#if supporting.length}
        <div class="px-4">
            {#each supporting as item (item)}
                <span class="mt-1 text-xs text-gray-500 group-data-[is-error=true]:text-red-600">
                    {item}
                </span>
            {/each}
        </div>
    {/if}
</div>
