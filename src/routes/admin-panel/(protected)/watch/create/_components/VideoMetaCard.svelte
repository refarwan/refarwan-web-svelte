<script lang="ts">
	import DropdownSelect from '$lib/components/admin/DropdownSelect.svelte';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		t: Record<string, string>;
		categoryId: string;
		categoryOptions: Option[];
		onCategoryChange: (value: string) => void;
		status: string;
		statusOptions: Option[];
		onStatusChange: (value: string) => void;
	}

	let {
		t,
		categoryId,
		categoryOptions,
		onCategoryChange,
		status,
		statusOptions,
		onStatusChange
	}: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">{t.categoryLabel}</h2>
	<hr class="my-4 border-gray-200" />
	<DropdownSelect
		value={categoryId}
		options={categoryOptions}
		onChange={onCategoryChange}
		placeholder={t.categoryPlaceholder}
		searchable
	/>
</section>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">{t.statusLabel}</h2>
	<hr class="my-4 border-gray-200" />
	<DropdownSelect value={status} options={statusOptions} onChange={onStatusChange} />
</section>
