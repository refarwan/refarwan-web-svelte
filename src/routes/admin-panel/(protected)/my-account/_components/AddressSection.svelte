<script lang="ts">
	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';

	import type { AreaItem } from '$lib/types';

	interface Props {
		t: Record<string, string>;
		address: string;
		provinceCode: string;
		regencyCode: string;
		districtCode: string;
		villageCode: string;
		provinces: AreaItem[];
		initialRegencies: AreaItem[];
		initialDistricts: AreaItem[];
		initialVillages: AreaItem[];
	}

	let {
		t,
		address = $bindable(),
		provinceCode = $bindable(),
		regencyCode = $bindable(),
		districtCode = $bindable(),
		villageCode = $bindable(),
		provinces,
		initialRegencies,
		initialDistricts,
		initialVillages
	}: Props = $props();

	let regencies = $state<AreaItem[]>(initialRegencies);
	let districts = $state<AreaItem[]>(initialDistricts);
	let villages = $state<AreaItem[]>(initialVillages);

	const fetchAreas = async (path: string): Promise<AreaItem[]> => {
		const res = await fetch(path);
		if (!res.ok) return [];
		const body = (await res.json()) as { data?: AreaItem[] };
		return body.data ?? [];
	};

	const provinceOptions = $derived(
		provinces.map((item) => ({ value: item.code, label: item.name }))
	);
	const regencyOptions = $derived(regencies.map((item) => ({ value: item.code, label: item.name })));
	const districtOptions = $derived(
		districts.map((item) => ({ value: item.code, label: item.name }))
	);
	const villageOptions = $derived(villages.map((item) => ({ value: item.code, label: item.name })));

	const onProvinceSelect = async (code: string) => {
		provinceCode = code;
		regencyCode = '';
		districtCode = '';
		villageCode = '';
		districts = [];
		villages = [];
		regencies = code ? await fetchAreas(`/admin-panel/api/area/regencies/${code}`) : [];
	};

	const onRegencySelect = async (code: string) => {
		regencyCode = code;
		districtCode = '';
		villageCode = '';
		villages = [];
		districts = code ? await fetchAreas(`/admin-panel/api/area/districts/${code}`) : [];
	};

	const onDistrictSelect = async (code: string) => {
		districtCode = code;
		villageCode = '';
		villages = code ? await fetchAreas(`/admin-panel/api/area/villages/${code}`) : [];
	};
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">{t.addressTitle}</h2>
	<p class="text-[13px] text-gray-500">{t.addressDescription}</p>
	<hr class="my-4 border-gray-200" />

	<div class="flex flex-col gap-4">
		<div>
			<label class="block text-[13px] font-medium text-gray-700" for="address">
				{t.address}
			</label>
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
