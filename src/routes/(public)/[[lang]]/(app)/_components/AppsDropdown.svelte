<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";
    import { APPS_DROPDOWN_TRANSLATIONS } from "$lib/i18n/apps-dropdown";

    import type { ResolvedPathname } from "$app/types";
    import type { ContentLocale } from "$lib/i18n/types";

    interface AppItem {
        name: string;
        href: ResolvedPathname;
        label: string;
        icon: string;
    }

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        currentApp: string;
        currentLang: ContentLocale;
    }

    let { isOpen, onClose, currentApp, currentLang }: Props = $props();

    let dropdownRef: HTMLDivElement | undefined = $state();

    const t = $derived(
        APPS_DROPDOWN_TRANSLATIONS[currentLang] ?? APPS_DROPDOWN_TRANSLATIONS["en-US"]
    );
    const localePrefix = $derived(currentLang === "en-US" ? "" : `/${currentLang}`);

    const apps: AppItem[] = $derived([
        {
            name: "home",
            href: resolve((localePrefix || "/") as `/${string}`),
            label: t.home,
            icon: "lucide:house"
        },
        {
            name: "project",
            href: resolve(`${localePrefix}/project` as `/${string}`),
            label: t.project,
            icon: "lucide:folder-git-2"
        },
        {
            name: "watch",
            href: resolve(`${localePrefix}/watch` as `/${string}`),
            label: t.watch,
            icon: "lucide:clapperboard"
        },
        {
            name: "blog",
            href: resolve(`${localePrefix}/blog` as `/${string}`),
            label: t.blog,
            icon: "lucide:newspaper"
        }
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
        aria-label={t.appsMenuAriaLabel}
        role="menu"
        class="absolute top-full right-0 z-50 mt-2.5 w-52.5 rounded-xl border border-gray-200 bg-white p-5 transition-all"
    >
        <div class="grid grid-cols-2 gap-4">
            {#each apps as app (app.name)}
                {@const isActive = currentApp === app.name}
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
                        <Icon icon={app.icon} class="h-6 w-6" />
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
