<script lang="ts">
    import {
        ClapperboardIcon,
        FolderGit2Icon,
        HouseIcon,
        NewspaperIcon
    } from "lucide-svelte/icons";
    interface AppItem {
        name: "home" | "project" | "watch" | "blog";
        href: string;
        label: string;
        icon: typeof HouseIcon;
    }

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        currentApp: "home" | "watch";
        homeHref: string;
        projectHref: string;
        watchHref: string;
        blogHref: string;
        homeLabel: string;
        projectLabel: string;
        watchLabel: string;
        blogLabel: string;
    }

    let {
        isOpen,
        onClose,
        currentApp,
        homeHref,
        projectHref,
        watchHref,
        blogHref,
        homeLabel,
        projectLabel,
        watchLabel,
        blogLabel
    }: Props = $props();

    let dropdownRef: HTMLDivElement | undefined = $state();

    const apps: AppItem[] = $derived([
        { name: "home", href: homeHref, label: homeLabel, icon: HouseIcon },
        { name: "project", href: projectHref, label: projectLabel, icon: FolderGit2Icon },
        { name: "watch", href: watchHref, label: watchLabel, icon: ClapperboardIcon },
        { name: "blog", href: blogHref, label: blogLabel, icon: NewspaperIcon }
    ]);

    $effect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef && !dropdownRef.contains(event.target as Node)) onClose();
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    });
</script>

{#if isOpen}
    <div
        bind:this={dropdownRef}
        aria-label="Apps Menu"
        role="menu"
        class="absolute top-full right-0 z-50 mt-2.5 w-52.5 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(0,0,0,0.15),0_1px_4px_0_rgba(0,0,0,0.08)] transition-all"
    >
        <div class="grid grid-cols-2 gap-4">
            {#each apps as app (app.name)}
                {@const isActive = currentApp === app.name}
                {@const Icon = app.icon}
                <a
                    href={app.href}
                    onclick={onClose}
                    class="group flex h-23.5 w-19 flex-col items-center justify-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                >
                    <div
                        class={`flex h-13 w-13 items-center justify-center rounded-full transition-colors ${
                            isActive
                                ? "bg-theme-100 text-theme-500"
                                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200/70 group-hover:text-gray-600"
                        }`}
                    >
                        <Icon class="h-6 w-6" />
                    </div>
                    <span
                        class={`text-xs leading-4.5 transition-colors ${
                            isActive
                                ? "font-medium text-theme-500"
                                : "font-normal text-gray-500 group-hover:text-gray-700"
                        }`}
                    >
                        {app.label}
                    </span>
                </a>
            {/each}
        </div>
    </div>
{/if}
