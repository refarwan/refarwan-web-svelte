<script lang="ts">
	import type { ContentLanguage } from '$lib/types';

	interface Props {
		t: Record<string, string>;
		activeLang?: ContentLanguage;
		title: string;
		description: string;
		onTitleInput: (value: string) => void;
		onDescriptionInput: (value: string) => void;
	}

	let { t, activeLang, title, description, onTitleInput, onDescriptionInput }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
	<h2 class="text-base font-semibold text-gray-900">
		{t.titleLabel}
		{#if activeLang}
			<span class="font-normal text-gray-400">({activeLang.name})</span>
		{/if}
	</h2>
	<hr class="my-4 border-gray-200" />

	<div class="flex flex-col gap-4">
		<div>
			<input
				type="text"
				value={title}
				oninput={(event) => onTitleInput((event.target as HTMLInputElement).value)}
				placeholder={t.titlePlaceholder}
				class="h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
			/>
		</div>
		<div>
			<label class="block text-[13px] font-medium text-gray-700" for="video-description">
				{t.descriptionLabel}
			</label>
			<textarea
				id="video-description"
				value={description}
				oninput={(event) => onDescriptionInput((event.target as HTMLTextAreaElement).value)}
				placeholder={t.descriptionPlaceholder}
				rows="4"
				class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
			></textarea>
		</div>
	</div>
</section>
