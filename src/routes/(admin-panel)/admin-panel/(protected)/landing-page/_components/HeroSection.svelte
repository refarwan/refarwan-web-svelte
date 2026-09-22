<script lang="ts">
    import Icon from "@iconify/svelte";

    import type { LandingPageAdminTranslation } from "../../../../i18n/landing-page/types";

    interface Props {
        heroRole: string;
        heroViewProjects: string;
        heroDescription: string;
        photoUrl: string | null;
        onPhotoSelect: (file: File | undefined) => void;
        onPhotoClear: () => void;
        t: LandingPageAdminTranslation;
    }

    let {
        heroRole = $bindable(),
        heroViewProjects = $bindable(),
        heroDescription = $bindable(),
        photoUrl,
        onPhotoSelect,
        onPhotoClear,
        t
    }: Props = $props();

    let fileInput: HTMLInputElement | undefined = $state();

    const handleFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        onPhotoSelect(input.files?.[0]);
    };
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.heroSection}</h2>
    <p class="text-[13px] text-gray-500">
        Primary header content displayed above the fold on the landing page.
    </p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div
                class="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100"
            >
                <img
                    src={photoUrl || "/images/profile.png"}
                    alt="Hero avatar"
                    class="h-full w-full object-cover"
                />
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-700">{t.heroPhotoLabel}</span>
                <p class="text-xs text-gray-500">{t.heroPhotoHelper}</p>

                <div class="mt-1.5 flex items-center gap-2">
                    <input
                        bind:this={fileInput}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onchange={handleFileChange}
                        class="hidden"
                    />
                    <button
                        type="button"
                        onclick={() => fileInput?.click()}
                        class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <Icon icon="lucide:upload" class="h-3.5 w-3.5 text-gray-500" />
                        <span>{photoUrl ? t.changePhoto : t.uploadPhoto}</span>
                    </button>

                    {#if photoUrl}
                        <button
                            type="button"
                            onclick={onPhotoClear}
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                            <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                            <span>{t.removePhoto}</span>
                        </button>
                    {/if}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label for="hero-role" class="block text-[13px] font-medium text-gray-700">
                    {t.heroRole}
                </label>
                <input
                    id="hero-role"
                    name="heroRole"
                    type="text"
                    bind:value={heroRole}
                    placeholder={t.heroRolePlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
            <div>
                <label for="hero-view-projects" class="block text-[13px] font-medium text-gray-700">
                    {t.heroViewProjects}
                </label>
                <input
                    id="hero-view-projects"
                    name="heroViewProjects"
                    type="text"
                    bind:value={heroViewProjects}
                    placeholder={t.heroViewProjectsPlaceholder}
                    class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                />
            </div>
        </div>

        <div>
            <label for="hero-description" class="block text-[13px] font-medium text-gray-700">
                {t.heroDescription}
            </label>
            <textarea
                id="hero-description"
                name="heroDescription"
                rows="3"
                bind:value={heroDescription}
                placeholder={t.heroDescriptionPlaceholder}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            ></textarea>
        </div>
    </div>
</section>
