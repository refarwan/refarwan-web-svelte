<script lang="ts">
    interface Props {
        type?: "text" | "password";
        id?: string;
        name?: string;
        value?: string;
        placeholder?: string;
        isError?: boolean;
        supporting?: string[];
        class?: string;
    }
    let {
        type = "text",
        id,
        name,
        value = $bindable(""),
        placeholder,
        isError = false,
        supporting = [],
        class: className = ""
    }: Props = $props();
</script>

<div data-is-error={isError} class={["group flex flex-col gap-0", className]}>
    <input
        {id}
        {name}
        {type}
        {placeholder}
        bind:value
        aria-invalid={isError}
        class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm leading-5.25 text-gray-900 group-data-[is-error=true]:border-red-600 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none group-data-[is-error=true]:focus:border-red-600 group-data-[is-error=true]:focus:ring-red-600"
    />
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
