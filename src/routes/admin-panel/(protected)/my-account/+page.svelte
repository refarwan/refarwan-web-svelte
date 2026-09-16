<script lang="ts">
	import { untrack } from 'svelte';

	import { enhance } from '$app/forms';

	import AccountInfoSection from './_components/AccountInfoSection.svelte';
	import AddressSection from './_components/AddressSection.svelte';
	import PersonalDataSection from './_components/PersonalDataSection.svelte';
	import ProfilePhotoSection from './_components/ProfilePhotoSection.svelte';
	import { popup } from '$lib/stores/popup.svelte';

	let { data, form } = $props();
	const t = $derived(data.t);
	// Seeded once from the initial load; the form below owns these values from then on.
	const account = untrack(() => data.account);

	let username = $state(account?.username ?? '');
	let email = $state(account?.email ?? '');
	let phoneNumber = $state(account?.phoneNumber ?? '');
	let fullname = $state(account?.fullname ?? '');
	let birthday = $state(account?.birthday ?? '');
	let gender = $state(account?.gender ?? '');
	let birthplaceCode = $state(account?.birthplace?.code ?? '');
	let address = $state(account?.address ?? '');
	let provinceCode = $state(account?.province?.code ?? '');
	let regencyCode = $state(account?.regency?.code ?? '');
	let districtCode = $state(account?.district?.code ?? '');
	let villageCode = $state(account?.village?.code ?? '');

	let avatarPreview = $state(account?.profilePicture?.medium ?? null);
	let deleteProfilePicture = $state(false);
	let submitting = $state(false);

	$effect(() => {
		// popup.success/error read and write the popup store's own state, so calling
		// them untracked keeps this effect's only dependency on `form` — otherwise it
		// re-triggers itself via the store write and floods duplicate popups.
		if (form?.success && form.message) {
			untrack(() => popup.success({ message: form.message ?? '' }));
		} else if (form?.error) {
			untrack(() => popup.error({ message: form.error ?? '' }));
		}
	});
</script>

<svelte:head>
	<title>{t.title}</title>
</svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-4 pb-8 md:gap-6">
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				submitting = false;
			};
		}}
		class="flex flex-col gap-4"
	>
		<ProfilePhotoSection {t} {fullname} {username} bind:avatarPreview bind:deleteProfilePicture />

		<AccountInfoSection {t} bind:username bind:email bind:phoneNumber />

		<PersonalDataSection
			{t}
			bind:fullname
			bind:birthday
			bind:birthplaceCode
			bind:gender
			allRegencies={data.allRegencies}
		/>

		<AddressSection
			{t}
			bind:address
			bind:provinceCode
			bind:regencyCode
			bind:districtCode
			bind:villageCode
			provinces={data.provinces}
			initialRegencies={data.initialRegencies}
			initialDistricts={data.initialDistricts}
			initialVillages={data.initialVillages}
		/>

		<div class="flex justify-end">
			<button
				type="submit"
				disabled={submitting}
				class="rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-60"
			>
				{submitting ? t.saving : t.save}
			</button>
		</div>
	</form>
</div>
