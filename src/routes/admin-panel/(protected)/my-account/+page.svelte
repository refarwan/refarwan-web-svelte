<script lang="ts">
	import { untrack } from 'svelte';

	import CircleUserRound from 'lucide-svelte/icons/circle-user-round';

	import { enhance } from '$app/forms';

	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';
	import { popup } from '$lib/stores/popup.svelte';

	import type { AreaItem } from '$lib/types';

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

	let regencies = $state<AreaItem[]>(untrack(() => data.initialRegencies));
	let districts = $state<AreaItem[]>(untrack(() => data.initialDistricts));
	let villages = $state<AreaItem[]>(untrack(() => data.initialVillages));

	let avatarPreview = $state(account?.profilePicture?.medium ?? null);
	let deleteProfilePicture = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();
	let submitting = $state(false);

	const fetchAreas = async (path: string): Promise<AreaItem[]> => {
		const res = await fetch(path);
		if (!res.ok) return [];
		const body = (await res.json()) as { data?: AreaItem[] };
		return body.data ?? [];
	};

	const onProvinceChange = async () => {
		regencyCode = '';
		districtCode = '';
		villageCode = '';
		districts = [];
		villages = [];
		regencies = provinceCode
			? await fetchAreas(`/admin-panel/api/area/regencies/${provinceCode}`)
			: [];
	};

	const onRegencyChange = async () => {
		districtCode = '';
		villageCode = '';
		villages = [];
		districts = regencyCode
			? await fetchAreas(`/admin-panel/api/area/districts/${regencyCode}`)
			: [];
	};

	const onDistrictChange = async () => {
		villageCode = '';
		villages = districtCode
			? await fetchAreas(`/admin-panel/api/area/villages/${districtCode}`)
			: [];
	};

	const onFileChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		avatarPreview = URL.createObjectURL(file);
		deleteProfilePicture = false;
	};

	const onDeletePhoto = () => {
		deleteProfilePicture = true;
		avatarPreview = null;
		if (fileInput) fileInput.value = '';
	};

	const genderOptions = $derived([
		{ value: 'male', label: t.male },
		{ value: 'female', label: t.female }
	]);

	const birthplaceOptions = $derived(
		data.allRegencies.map((item) => ({ value: item.code, label: item.name }))
	);
	const provinceOptions = $derived(
		data.provinces.map((item) => ({ value: item.code, label: item.name }))
	);
	const regencyOptions = $derived(
		regencies.map((item) => ({ value: item.code, label: item.name }))
	);
	const districtOptions = $derived(
		districts.map((item) => ({ value: item.code, label: item.name }))
	);
	const villageOptions = $derived(villages.map((item) => ({ value: item.code, label: item.name })));

	const onProvinceSelect = (code: string) => {
		provinceCode = code;
		void onProvinceChange();
	};
	const onRegencySelect = (code: string) => {
		regencyCode = code;
		void onRegencyChange();
	};
	const onDistrictSelect = (code: string) => {
		districtCode = code;
		void onDistrictChange();
	};

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
				await update();
				submitting = false;
			};
		}}
		class="flex flex-col gap-4"
	>
		<!-- Profile Photo -->
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
						<CircleUserRound class="h-full w-full p-1 text-gray-500" strokeWidth={1.5} />
					{/if}
				</div>

				<div class="flex flex-col gap-1">
					<span class="text-lg font-semibold text-gray-900">{fullname}</span>
					<span class="text-sm text-gray-500">{username ? `@${username}` : ''}</span>
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
				value={deleteProfilePicture ? 'true' : 'false'}
			/>
		</section>

		<!-- Account Info -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<h2 class="text-base font-semibold text-gray-900">{t.infoTitle}</h2>
			<p class="text-[13px] text-gray-500">{t.infoDescription}</p>
			<hr class="my-4 border-gray-200" />

			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="username"
						>{t.username}</label
					>
					<input
						id="username"
						name="username"
						bind:value={username}
						required
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="email">{t.email}</label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						required
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="phoneNumber">
						{t.phoneNumber}
					</label>
					<input
						id="phoneNumber"
						name="phoneNumber"
						type="tel"
						bind:value={phoneNumber}
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<!-- Personal Data -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<h2 class="text-base font-semibold text-gray-900">{t.personalTitle}</h2>
			<p class="text-[13px] text-gray-500">{t.personalDescription}</p>
			<hr class="my-4 border-gray-200" />

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="fullname"
						>{t.fullname}</label
					>
					<input
						id="fullname"
						name="fullname"
						bind:value={fullname}
						required
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="birthday"
						>{t.birthday}</label
					>
					<input
						id="birthday"
						name="birthday"
						type="date"
						bind:value={birthday}
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>
				<div>
					<input type="hidden" name="birthplaceCode" value={birthplaceCode} />
					<DropdownSelect
						id="birthplaceCode"
						label={t.birthplace}
						value={birthplaceCode}
						options={birthplaceOptions}
						onChange={(code) => (birthplaceCode = code)}
						placeholder={t.select}
						searchable
						searchPlaceholder={t.birthplacePlaceholder}
						class="mt-1"
					/>
				</div>
				<div>
					<input type="hidden" name="gender" value={gender} />
					<DropdownSelect
						id="gender"
						label={t.gender}
						value={gender}
						options={genderOptions}
						onChange={(value) => (gender = value)}
						placeholder={t.selectGender}
						class="mt-1"
					/>
				</div>
			</div>
		</section>

		<!-- Address -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
			<h2 class="text-base font-semibold text-gray-900">{t.addressTitle}</h2>
			<p class="text-[13px] text-gray-500">{t.addressDescription}</p>
			<hr class="my-4 border-gray-200" />

			<div class="flex flex-col gap-4">
				<div>
					<label class="block text-[13px] font-medium text-gray-700" for="address"
						>{t.address}</label
					>
					<input
						id="address"
						name="address"
						bind:value={address}
						class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<input type="hidden" name="provinceCode" value={provinceCode} />
						<DropdownSelect
							id="provinceCode"
							label={t.province}
							value={provinceCode}
							options={provinceOptions}
							onChange={onProvinceSelect}
							placeholder={t.select}
							searchable
							class="mt-1"
						/>
					</div>
					<div>
						<input type="hidden" name="regencyCode" value={regencyCode} />
						<DropdownSelect
							id="regencyCode"
							label={t.regency}
							value={regencyCode}
							options={regencyOptions}
							onChange={onRegencySelect}
							placeholder={provinceCode ? t.select : t.selectProvinceFirst}
							disabled={!provinceCode}
							searchable
							class="mt-1"
						/>
					</div>
					<div>
						<input type="hidden" name="districtCode" value={districtCode} />
						<DropdownSelect
							id="districtCode"
							label={t.district}
							value={districtCode}
							options={districtOptions}
							onChange={onDistrictSelect}
							placeholder={regencyCode ? t.select : t.selectRegencyFirst}
							disabled={!regencyCode}
							searchable
							class="mt-1"
						/>
					</div>
					<div>
						<input type="hidden" name="villageCode" value={villageCode} />
						<DropdownSelect
							id="villageCode"
							label={t.village}
							value={villageCode}
							options={villageOptions}
							onChange={(code) => (villageCode = code)}
							placeholder={districtCode ? t.select : t.selectDistrictFirst}
							disabled={!districtCode}
							searchable
							class="mt-1"
						/>
					</div>
				</div>
			</div>
		</section>

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
