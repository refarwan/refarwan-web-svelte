<script lang="ts">
    import { CircleUserRoundIcon } from "lucide-svelte/icons";
    interface Props {
        t: Record<string, string>;
        fullname: string;
        username: string;
        avatarPreview: string | null;
        deleteProfilePicture: boolean;
    }

    let {
        t,
        fullname,
        username,
        avatarPreview = $bindable(),
        deleteProfilePicture = $bindable()
    }: Props = $props();

    let fileInput: HTMLInputElement | undefined = $state();

    const onFileChange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        avatarPreview = URL.createObjectURL(file);
        deleteProfilePicture = false;
    };

    const onDeletePhoto = () => {
        deleteProfilePicture = true;
        avatarPreview = null;
        if (fileInput) fileInput.value = "";
    };
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.photoTitle}</h2>
    <p class="text-[13px] text-gray-500">{t.photoDescription}</p>
    <hr class="my-4 border-gray-200" />

    <div class="flex flex-wrap items-center gap-5">
        <div
            class="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-50"
        >
            {#if avatarPreview}
                <img src={avatarPreview} alt={fullname} class="h-full w-full object-cover" />
            {:else}
                <CircleUserRoundIcon class="h-full w-full p-1 text-gray-500" strokeWidth={1.5} />
            {/if}
        </div>

        <div class="flex flex-col gap-1">
            <span class="text-lg font-semibold text-gray-900">{fullname}</span>
            <span class="text-sm text-gray-500">{username ? `@${username}` : ""}</span>
        </div>

        <div class="ml-auto flex items-center gap-2.5">
            {#if avatarPreview}
                <button
                    type="button"
                    onclick={onDeletePhoto}
                    class="rounded-md border border-red-500 bg-white px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                    {t.deletePhoto}
                </button>
            {/if}
            <button
                type="button"
                onclick={() => fileInput?.click()}
                class="rounded-md border border-theme-600 bg-white px-4 py-2 text-[13px] font-medium text-theme-600 transition-colors hover:bg-theme-50"
            >
                {t.changePhoto}
            </button>
        </div>
    </div>

    <input
        bind:this={fileInput}
        onchange={onFileChange}
        type="file"
        name="profilePicture"
        accept="image/jpeg,image/png"
        class="hidden"
    />
    <input
        type="hidden"
        name="deleteProfilePicture"
        value={deleteProfilePicture ? "true" : "false"}
    />
</section>
