<script lang="ts">
    import { CircleUserRoundIcon, KeyRoundIcon, LogOutIcon, MenuIcon } from "lucide-svelte/icons";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    import { authorizedHttp } from "$lib/api/authorized-http";
    import { adminSidebar } from "$lib/stores/admin-sidebar.svelte";
    import { authStore } from "$lib/stores/auth.svelte";

    import type { AdminTranslation } from "$lib/i18n/admin";
    import type { AccountItem } from "$lib/types";

    interface Props {
        account: AccountItem | null;
        t: AdminTranslation["shell"];
    }

    let { account, t }: Props = $props();

    let isOpen = $state(false);
    let containerRef: HTMLDivElement | undefined = $state();

    const title = $derived.by(() => {
        const path = page.url.pathname;
        if (path.startsWith("/admin-panel/blog/categories")) return t.blogCategories;
        if (path.startsWith("/admin-panel/blog")) return t.blog;
        if (path.startsWith("/admin-panel/watch/category")) return t.watchCategories;
        if (path.startsWith("/admin-panel/watch/video")) return t.watchVideo;
        if (path.startsWith("/admin-panel/watch")) return t.watch;
        if (path.startsWith("/admin-panel/project")) return t.project;
        if (path.startsWith("/admin-panel/landing-page")) return t.landingPage;
        if (path.startsWith("/admin-panel/settings")) return t.settings;
        if (path.startsWith("/admin-panel/change-password")) return t.changePassword;
        if (path.startsWith("/admin-panel/my-account")) return t.myAccount;
        return t.dashboard;
    });

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
            <MenuIcon class="h-6 w-6" />
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
            {#if account?.profilePicture}
                <img
                    src={account.profilePicture.small}
                    alt={account.fullname}
                    class="h-9 w-9 rounded-full object-cover"
                />
            {:else}
                <CircleUserRoundIcon class="h-9 w-9 shrink-0 text-gray-400" strokeWidth={2} />
            {/if}
            <span class="hidden text-sm font-medium text-gray-700 md:inline-block">
                {account?.fullname ?? ""}
            </span>
        </button>

        {#if isOpen}
            <div
                class="absolute top-full right-0 z-50 mt-2 flex w-max flex-col gap-0.5 rounded-xl border border-gray-200 bg-white p-2 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.1),0_2px_4px_0_rgba(0,0,0,0.06)]"
            >
                <a
                    href={resolve("/admin-panel/my-account")}
                    onclick={() => (isOpen = false)}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                    <CircleUserRoundIcon class="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                    <span class="text-sm font-medium text-gray-800">{t.myAccount}</span>
                </a>
                <a
                    href={resolve("/admin-panel/change-password")}
                    onclick={() => (isOpen = false)}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                    <KeyRoundIcon class="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
                    <span class="text-sm font-medium text-gray-800">{t.changePassword}</span>
                </a>

                <div class="my-0.5 h-px w-full bg-gray-200"></div>

                <button
                    type="button"
                    onclick={handleLogout}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors hover:bg-red-50"
                >
                    <LogOutIcon class="h-5 w-5 shrink-0 text-red-600" strokeWidth={2} />
                    <span class="text-sm font-medium text-red-600">{t.logout}</span>
                </button>
            </div>
        {/if}
    </div>
</header>
