<script lang="ts">
    import Icon from "@iconify/svelte";
    import { resolve } from "$app/paths";

    import type { ErrorTranslation } from "$lib/i18n/error";

    interface Props {
        status?: number;
        message?: string;
        t: ErrorTranslation;
        homeHref: string;
        contactHref: string;
    }

    let { status = 500, message, t, homeHref, contactHref }: Props = $props();

    function handleReload() {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    }

    const displayMessage = $derived(
        message && message !== "Internal Error" ? message : t.defaultMessage
    );
</script>

<svelte:head>
    <title>{t.heading} ({status}) | Aan Refarwan</title>
    <meta name="description" content={t.subtext} />
</svelte:head>

<div
    class="mx-auto flex w-full max-w-85.5 flex-col items-center justify-center py-14 text-center md:max-w-140 md:py-18 lg:max-w-190 lg:py-24"
>
    <!-- Background SVG Glow & Decorative Elements -->
    <div class="relative flex w-full items-center justify-center">
        <svg
            viewBox="0 0 800 560"
            class="pointer-events-none absolute -top-8 left-1/2 z-0 w-130 max-w-none -translate-x-1/2 md:-top-14 md:w-177.5 lg:-top-16 lg:w-200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <g opacity="0.09" filter="url(#error-glow-1)">
                <circle cx="280" cy="270" r="160" fill="#EF4444" />
            </g>
            <g opacity="0.08" filter="url(#error-glow-2)">
                <circle cx="560" cy="280" r="140" fill="var(--color-theme-600, #0284C7)" />
            </g>
            <circle opacity="0.75" cx="240" cy="460" r="85" fill="#FEE2E2" />
            <circle opacity="0.6" cx="590" cy="180" r="60" fill="var(--color-theme-100, #E0F2FE)" />
            <rect opacity="0.2" x="560" y="140" width="110" height="12" rx="6" fill="#EF4444" />
            <rect
                opacity="0.16"
                x="160"
                y="430"
                width="120"
                height="12"
                rx="6"
                fill="var(--color-theme-600, #0284C7)"
            />
            <circle opacity="0.15" cx="620" cy="380" r="10" fill="#EF4444" />
            <circle
                opacity="0.15"
                cx="150"
                cy="160"
                r="10"
                fill="var(--color-theme-600, #0284C7)"
            />
            <rect opacity="0.9" x="520" y="330" width="84" height="54" rx="16" fill="#FEE2E2" />
            <rect opacity="0.12" x="130" y="330" width="84" height="54" rx="16" fill="#EF4444" />
            <defs>
                <filter
                    id="error-glow-1"
                    x="0"
                    y="0"
                    width="560"
                    height="560"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur stdDeviation="60" />
                </filter>
                <filter
                    id="error-glow-2"
                    x="340"
                    y="40"
                    width="460"
                    height="460"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur stdDeviation="55" />
                </filter>
            </defs>
        </svg>

        <!-- Big Status Code -->
        <span
            class="relative z-10 text-8xl font-black tracking-tight text-red-500/90 select-none md:text-[180px] md:leading-45 lg:text-[220px] lg:leading-60"
        >
            {status}
        </span>
    </div>

    <!-- Status Badge -->
    <div class="relative z-10 -mt-2 mb-2 flex items-center justify-center">
        <span
            class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-red-600 backdrop-blur-xs"
        >
            <Icon icon="lucide:alert-triangle" class="h-3.5 w-3.5" />
            <span>HTTP {status}</span>
        </span>
    </div>

    <!-- Title & Description -->
    <div class="relative z-10 mt-3 flex flex-col items-center gap-3 md:mt-4 md:gap-4">
        <h1
            class="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl lg:text-[40px] lg:leading-tight"
        >
            {t.heading}
        </h1>
        <p
            class="max-w-md text-sm leading-relaxed text-gray-500 md:max-w-lg md:text-base lg:text-lg"
        >
            {t.subtext}
        </p>

        <!-- Error Detail Callout -->
        <div
            class="mt-1 flex max-w-md items-center gap-2.5 rounded-xl border border-gray-200/80 bg-gray-50/80 px-4 py-2.5 text-xs text-gray-600 md:max-w-lg md:text-sm"
        >
            <Icon icon="lucide:info" class="h-4 w-4 shrink-0 text-gray-400" />
            <span class="truncate font-mono">{displayMessage}</span>
        </div>
    </div>

    <!-- Actions -->
    <div
        class="relative z-10 mt-8 flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-row md:gap-4"
    >
        <!-- Try Again Button -->
        <button
            type="button"
            onclick={handleReload}
            class="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-theme-600 px-6 text-[15px] font-semibold text-white transition-all hover:bg-theme-700 active:scale-98 md:w-auto"
        >
            <Icon icon="lucide:rotate-cw" class="h-4 w-4" />
            <span>{t.tryAgain}</span>
        </button>

        <!-- Back to Home Button -->
        <a
            href={resolve(homeHref)}
            class="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-6 text-[15px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 md:w-auto"
        >
            <Icon icon="lucide:arrow-left" class="h-4 w-4" />
            <span>{t.backHome}</span>
        </a>

        <!-- Contact Us Button -->
        <a
            href={resolve(contactHref)}
            class="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-5 text-[15px] font-semibold text-theme-600 transition-colors hover:bg-theme-50/70 md:w-auto"
        >
            <Icon icon="lucide:mail" class="h-4 w-4" />
            <span>{t.contactUs}</span>
        </a>
    </div>
</div>
