<script lang="ts">
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	import { enhance } from '$app/forms';

	import { popup } from '$lib/stores/popup.svelte';

	let { data, form } = $props();
	const t = $derived(data.t);

	let submitting = $state(false);
	let showOld = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);

	const fieldError = (field: string): string | undefined => form?.fieldErrors?.[field];

	$effect(() => {
		if (form?.success && form.message) {
			popup.success({ message: form.message });
		} else if (form?.error) {
			popup.error({ message: form.error });
		}
	});
</script>

<svelte:head>
	<title>{t.title}</title>
</svelte:head>

<div class="flex w-full justify-center pb-8">
	<div class="w-full max-w-120 rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
			class="space-y-4"
		>
			<p class="text-[13px] text-gray-500">{t.description}</p>

			<div class="space-y-1.5">
				<label class="block text-[13px] font-medium text-gray-700" for="oldPassword">
					{t.oldPassword}
				</label>
				<div class="relative flex items-center">
					<input
						id="oldPassword"
						name="oldPassword"
						type={showOld ? 'text' : 'password'}
						disabled={submitting}
						class={`w-full rounded-md border bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
							fieldError('oldPassword')
								? 'border-red-400 focus:border-red-500 focus:ring-red-200'
								: 'border-gray-300 focus:border-theme-600 focus:ring-theme-100'
						}`}
					/>
					<button
						type="button"
						onclick={() => (showOld = !showOld)}
						class="absolute right-3.5 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
					>
						{#if showOld}<EyeOff class="h-5 w-5" />{:else}<Eye class="h-5 w-5" />{/if}
					</button>
				</div>
				{#if fieldError('oldPassword')}
					<p class="text-xs text-red-500">{fieldError('oldPassword')}</p>
				{/if}
			</div>

			<div class="space-y-1.5">
				<label class="block text-[13px] font-medium text-gray-700" for="newPassword">
					{t.newPassword}
				</label>
				<div class="relative flex items-center">
					<input
						id="newPassword"
						name="newPassword"
						type={showNew ? 'text' : 'password'}
						disabled={submitting}
						class={`w-full rounded-md border bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
							fieldError('newPassword')
								? 'border-red-400 focus:border-red-500 focus:ring-red-200'
								: 'border-gray-300 focus:border-theme-600 focus:ring-theme-100'
						}`}
					/>
					<button
						type="button"
						onclick={() => (showNew = !showNew)}
						class="absolute right-3.5 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
					>
						{#if showNew}<EyeOff class="h-5 w-5" />{:else}<Eye class="h-5 w-5" />{/if}
					</button>
				</div>
				{#if fieldError('newPassword')}
					<p class="text-xs text-red-500">{fieldError('newPassword')}</p>
				{/if}
			</div>

			<div class="space-y-1.5">
				<label class="block text-[13px] font-medium text-gray-700" for="confirmPassword">
					{t.confirmPassword}
				</label>
				<div class="relative flex items-center">
					<input
						id="confirmPassword"
						name="confirmPassword"
						type={showConfirm ? 'text' : 'password'}
						disabled={submitting}
						class={`w-full rounded-md border bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${
							fieldError('confirmPassword')
								? 'border-red-400 focus:border-red-500 focus:ring-red-200'
								: 'border-gray-300 focus:border-theme-600 focus:ring-theme-100'
						}`}
					/>
					<button
						type="button"
						onclick={() => (showConfirm = !showConfirm)}
						class="absolute right-3.5 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
					>
						{#if showConfirm}<EyeOff class="h-5 w-5" />{:else}<Eye class="h-5 w-5" />{/if}
					</button>
				</div>
				{#if fieldError('confirmPassword')}
					<p class="text-xs text-red-500">{fieldError('confirmPassword')}</p>
				{/if}
			</div>

			<div class="pt-1">
				<button
					type="submit"
					disabled={submitting}
					class="rounded-md bg-theme-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-theme-700 focus:ring-2 focus:ring-theme-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? t.saving : t.save}
				</button>
			</div>
		</form>
	</div>
</div>
