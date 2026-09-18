<script lang="ts">
    import {
        ChevronDownIcon,
        FolderGit2Icon,
        LayoutDashboardIcon,
        MonitorIcon,
        NewspaperIcon,
        SettingsIcon,
        VideoIcon,
        XIcon
    } from "lucide-svelte/icons";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    import { adminSidebar } from "$lib/stores/admin-sidebar.svelte";

    import type { AdminTranslation } from "$lib/i18n/admin";

    interface Props {
        t: AdminTranslation["shell"];
    }

    let { t }: Props = $props();

    const homeHref = resolve("/admin-panel");

    const navItems = $derived([
        {
            label: t.dashboard,
            href: resolve("/admin-panel"),
            icon: LayoutDashboardIcon,
            exact: true
        },
        {
            label: t.landingPage,
            href: resolve("/admin-panel/landing-page"),
            icon: MonitorIcon,
            exact: true
        },
        {
            label: "Blog",
            href: resolve("/admin-panel/blog/articles"),
            icon: NewspaperIcon,
            subItems: [
                { label: t.blogArticles, href: resolve("/admin-panel/blog/articles"), exact: true },
                {
                    label: t.blogCategories,
                    href: resolve("/admin-panel/blog/categories"),
                    exact: true
                },
                {
                    label: t.blogImageLibrary,
                    href: resolve("/admin-panel/blog/image-library"),
                    exact: true
                }
            ]
        },
        {
            label: "Watch",
            href: resolve("/admin-panel/watch/videos"),
            icon: VideoIcon,
            subItems: [
                { label: t.watchVideos, href: resolve("/admin-panel/watch/videos"), exact: true },
                {
                    label: t.watchCategories,
                    href: resolve("/admin-panel/watch/categories"),
                    exact: true
                }
            ]
        },
        {
            label: "Project",
            href: resolve("/admin-panel/project"),
            icon: FolderGit2Icon,
            exact: true
        },
        {
            label: t.settings,
            href: resolve("/admin-panel/settings"),
            icon: SettingsIcon,
            exact: true
        }
    ]);

    let openMenus = $state<Record<string, boolean>>({});

    const isMenuOpen = (href: string): boolean =>
        openMenus[href] ?? page.url.pathname.startsWith(href);

    const toggleMenu = (href: string): void => {
        openMenus = { ...openMenus, [href]: !isMenuOpen(href) };
    };

    const isActive = (href: string, exact?: boolean): boolean =>
        exact ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

{#snippet logo()}
    <a
        href={homeHref}
        onclick={() => (adminSidebar.open = false)}
        class="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
        <img src="/ercms-logo-row.png" alt="ERCMS Logo" class="h-8.75 w-37.5 object-contain" />
    </a>
{/snippet}

{#snippet nav()}
    <nav class="flex-1 space-y-1">
        {#each navItems as item (item.href)}
            {#if item.subItems}
                <button
                    type="button"
                    onclick={() => toggleMenu(item.href)}
                    aria-expanded={isMenuOpen(item.href)}
                    class={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                        isActive(item.href)
                            ? "bg-theme-600 font-semibold text-white shadow-xs"
                            : "font-medium text-theme-100 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <span class="flex items-center gap-3">
                        <item.icon class="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                    </span>
                    <ChevronDownIcon
                        class={`h-4 w-4 text-theme-100/80 transition-transform duration-200 ${
                            isMenuOpen(item.href) ? "rotate-180 text-white" : ""
                        }`}
                    />
                </button>

                {#if isMenuOpen(item.href)}
                    <div class="flex flex-col space-y-0.5 pl-11">
                        {#each item.subItems as sub (sub.href)}
                            <a
                                href={sub.href}
                                onclick={() => (adminSidebar.open = false)}
                                class={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] transition-colors ${
                                    isActive(sub.href, sub.exact)
                                        ? "bg-white/15 font-semibold text-white"
                                        : "font-medium text-theme-100 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <span class="text-xs leading-none select-none">&bull;</span>
                                <span>{sub.label}</span>
                            </a>
                        {/each}
                    </div>
                {/if}
            {:else}
                <a
                    href={item.href}
                    onclick={() => (adminSidebar.open = false)}
                    class={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                        isActive(item.href, item.exact)
                            ? "bg-theme-600 font-semibold text-white shadow-xs"
                            : "font-medium text-theme-100 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <item.icon class="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                </a>
            {/if}
        {/each}
    </nav>
{/snippet}

<div
    data-is-mobile-visible={adminSidebar.open}
    onclick={(event) => {
        // Only the backdrop itself should close the sidebar. Using stopPropagation()
        // on the aside instead would also stop the click from ever reaching
        // SvelteKit's document-level router listener, forcing every nav link to fall
        // back to a full page reload instead of a client-side navigation.
        if (event.target === event.currentTarget) adminSidebar.open = false;
    }}
    role="presentation"
    class="group invisible fixed top-0 left-0 z-40 h-screen w-screen bg-gray-600/50 opacity-0 transition-[visibility,opacity] duration-300 ease-in-out data-[is-mobile-visible=true]:visible data-[is-mobile-visible=true]:opacity-100 xl:visible xl:z-30 xl:w-max xl:opacity-100"
>
    <aside
        class="fixed -left-full flex h-full min-h-screen w-65 flex-col bg-theme-800 p-6 text-white transition-[left] duration-300 ease-in-out select-none group-data-[is-mobile-visible=true]:left-0 xl:relative xl:left-0"
    >
        <div class="mb-6 flex items-center justify-between">
            {@render logo()}
            <button
                type="button"
                onclick={() => (adminSidebar.open = false)}
                aria-label="Close sidebar"
                class="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white xl:hidden"
            >
                <XIcon class="h-5 w-5" />
            </button>
        </div>
        {@render nav()}
    </aside>
</div>
