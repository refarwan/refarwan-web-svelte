<script lang="ts">
    import { pageTitleStore } from "$lib/stores/page-title.svelte";
    import AccountInfoSection from "./_components/AccountInfoSection.svelte";
    import AccountSkeleton from "./_components/AccountSkeleton.svelte";
    import AddressSection from "./_components/AddressSection.svelte";
    import PersonalDataSection from "./_components/PersonalDataSection.svelte";
    import ProfilePhotoSection from "./_components/ProfilePhotoSection.svelte";
    import { useAccountForm } from "./use-account-form.svelte";

    let { data } = $props();
    const t = $derived(data.t);

    $effect(() => {
        pageTitleStore.set(data.shellT.myAccount);
    });

    const form = useAccountForm(() => t);
</script>

<div class="mx-auto flex max-w-5xl flex-col gap-4 pb-8 md:gap-6">
    {#if form.loading}
        <AccountSkeleton />
    {:else}
        <form
            onsubmit={form.handleSubmit}
            enctype="multipart/form-data"
            class="flex flex-col gap-4"
        >
            <ProfilePhotoSection
                {t}
                fullname={form.fullname}
                username={form.username}
                bind:avatarPreview={form.avatarPreview}
                bind:deleteProfilePicture={form.deleteProfilePicture}
            />

            <AccountInfoSection
                {t}
                bind:username={form.username}
                bind:email={form.email}
                bind:phoneNumber={form.phoneNumber}
            />

            <PersonalDataSection
                {t}
                bind:fullname={form.fullname}
                bind:birthday={form.birthday}
                bind:birthplaceCode={form.birthplaceCode}
                bind:gender={form.gender}
                allRegencies={data.allRegencies}
            />

            <AddressSection
                {t}
                bind:address={form.address}
                bind:provinceCode={form.provinceCode}
                bind:regencyCode={form.regencyCode}
                bind:districtCode={form.districtCode}
                bind:villageCode={form.villageCode}
                provinces={data.provinces}
                initialRegencies={form.initialRegencies}
                initialDistricts={form.initialDistricts}
                initialVillages={form.initialVillages}
            />

            <div class="flex justify-end">
                <button
                    type="submit"
                    disabled={form.submitting}
                    class="rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-60"
                >
                    {form.submitting ? t.saving : t.save}
                </button>
            </div>
        </form>
    {/if}
</div>
