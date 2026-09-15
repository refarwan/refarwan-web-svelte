<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white py-24 text-center"
>
	<h2 class="text-lg font-semibold text-gray-900">{title}</h2>
	<p class="text-sm text-gray-500">{description}</p>
</div>
