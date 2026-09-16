<script lang="ts">
	interface Props {
		t: Record<string, string>;
		page: number;
		totalPage: number;
		buildHref: (page: number) => string;
	}

	let { t, page, totalPage, buildHref }: Props = $props();
</script>

{#if totalPage > 1}
	<div class="flex items-center justify-between text-sm">
		<a
			href={buildHref(page - 1)}
			aria-disabled={page <= 1}
			class={`rounded-md border border-gray-300 px-3 py-1.5 font-medium transition-colors ${
				page <= 1 ? 'pointer-events-none text-gray-300' : 'text-gray-700 hover:bg-gray-50'
			}`}
		>
			{t.prev}
		</a>
		<span class="text-gray-500">
			{t.pageOf.replace('{current}', String(page)).replace('{total}', String(totalPage))}
		</span>
		<a
			href={buildHref(page + 1)}
			aria-disabled={page >= totalPage}
			class={`rounded-md border border-gray-300 px-3 py-1.5 font-medium transition-colors ${
				page >= totalPage ? 'pointer-events-none text-gray-300' : 'text-gray-700 hover:bg-gray-50'
			}`}
		>
			{t.next}
		</a>
	</div>
{/if}
