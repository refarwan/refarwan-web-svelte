<script lang="ts">
    import Icon from "@iconify/svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { onMount } from "svelte";
    import { authorizedHttp } from "$lib/api/authorized-http";
    import { accountStore } from "$lib/stores/account.svelte";
    import { adminSidebar } from "$lib/stores/admin-sidebar.svelte";
    import { authStore } from "$lib/stores/auth.svelte";
    import { pageTitleStore } from "$lib/stores/page-title.svelte";

    import type { Shell } from "../../../i18n/shell/types";

    interface Props {
        t: Shell;
    }

    let { t }: Props = $props();

    let isOpen = $state(false);
    let containerRef: HTMLDivElement | undefined = $state();

    onMount(() => {
        void accountStore.load();
    });

    const title = $derived(pageTitleStore.title ?? t.notFound);

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef && !containerRef.contains(event.target as Node)) isOpen = false;
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    const handleLogout = async () => {
        await authorizedHttp.delete("/auth/logout").catch(() => undefined);
        authStore.clear();
        void goto(resolve("/admin-panel/login"));
    };
</script>

<header
    class="sticky top-0 z-30 flex h-17.25 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 select-none md:px-6 xl:px-10"
>
    <div class="flex shrink-0 items-center xl:hidden">
        <button
            type="button"
            onclick={() => (adminSidebar.open = true)}
            aria-label="Open sidebar menu"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
            <Icon icon="lucide:menu" class="h-6 w-6" />
        </button>
    </div>

    <div class="flex-1 text-center xl:text-left">
        <h1 class="truncate text-xl font-bold tracking-tight text-gray-900 xl:text-2xl">
            {title}
        </h1>
    </div>

    <div bind:this={containerRef} class="relative flex shrink-0 items-center justify-end">
        <button
            type="button"
            onclick={() => (isOpen = !isOpen)}
            class="flex cursor-pointer items-center gap-2 p-0.5"
            aria-label="User menu"
            aria-expanded={isOpen}
        >
            {#if accountStore.account?.profilePicture}
                <img
                    src={accountStore.account.profilePicture.small}
                    alt={accountStore.account.fullname}
                    class="h-9 w-9 rounded-full object-cover"
                />
            {:else}
                <Icon icon="lucide:circle-user-round" class="h-9 w-9 shrink-0 text-gray-400" />
            {/if}
            <span class="hidden text-sm font-medium text-gray-700 md:inline-block">
                {accountStore.account?.fullname ?? ""}
            </span>
        </button>

        {#if isOpen}
            <div
                class="-[0_4px_16px_-2px_rgba(0,0,0,0.1),0_2px_4px_0_rgba(0,0,0,0.06)] absolute top-full right-0 z-50 mt-2 flex w-max flex-col gap-0.5 rounded-xl border border-gray-200 bg-white p-2"
            >
                <a
                    href={resolve("/admin-panel/my-account")}
                    onclick={() => (isOpen = false)}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                    <Icon icon="lucide:circle-user-round" class="h-5 w-5 shrink-0 text-gray-500" />
                    <span class="text-sm font-medium text-gray-800">{t.myAccount}</span>
                </a>
                <a
                    href={resolve("/admin-panel/change-password")}
                    onclick={() => (isOpen = false)}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                    <Icon icon="lucide:key-round" class="h-5 w-5 shrink-0 text-gray-500" />
                    <span class="text-sm font-medium text-gray-800">{t.changePassword}</span>
                </a>

                <div class="my-0.5 h-px w-full bg-gray-200"></div>

                <button
                    type="button"
                    onclick={handleLogout}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-red-50"
                >
                    <Icon icon="lucide:log-out" class="h-5 w-5 shrink-0 text-red-600" />
                    <span class="text-sm font-medium text-red-600">{t.logout}</span>
                </button>
            </div>
        {/if}
    </div>
</header>
