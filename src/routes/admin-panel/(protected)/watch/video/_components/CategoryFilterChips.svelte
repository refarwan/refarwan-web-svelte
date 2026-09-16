<script lang="ts">
	interface Category {
		id: string;
		name: string;
	}

	interface Props {
		t: Record<string, string>;
		categories: Category[];
		activeCategoryIds: string[];
		buildHref: (categoryId: string) => string;
	}

	let { t, categories, activeCategoryIds, buildHref }: Props = $props();
</script>

{#if categories.length > 0}
	<div class="flex flex-wrap gap-1.5">
		<a
			href={buildHref('')}
			class={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
				activeCategoryIds.length === 0
					? 'border-theme-600 bg-theme-50 text-theme-700'
					: 'border-gray-200 text-gray-500 hover:bg-gray-50'
			}`}
		>
			{t.tableCategory}: {t.statusAll}
		</a>
		{#each categories as category (category.id)}
			<a
				href={buildHref(category.id)}
				class={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
					activeCategoryIds.includes(category.id)
						? 'border-theme-600 bg-theme-50 text-theme-700'
						: 'border-gray-200 text-gray-500 hover:bg-gray-50'
				}`}
			>
				{category.name}
			</a>
		{/each}
	</div>
{/if}
