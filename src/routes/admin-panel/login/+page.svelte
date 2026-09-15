<script lang="ts">
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let showPassword = $state(false);
	let submitting = $state(false);
</script>

<svelte:head>
	<title>{data.t.pageTitle}</title>
</svelte:head>

<main class="flex min-h-screen w-full flex-col md:flex-row">
	<div class="grid h-48.5 place-content-center bg-theme-700 md:h-screen md:w-76.75 xl:w-xl">
		<img src="/ercms-logo-cell.png" alt="ERCMS Logo" class="h-auto w-26.25 md:w-50" />
	</div>

	<div class="grid flex-1 place-content-center p-6">
		<form
			method="POST"
			class="flex w-85 flex-col gap-6 xl:w-125"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<div>
				<h1 class="text-[28px] leading-10.5 font-extrabold tracking-normal text-gray-900">
					{data.t.title}
				</h1>
				<p class="text-sm leading-5.25 font-normal text-gray-500">{data.t.subtitle}</p>
			</div>

			{#if form?.error}
				<p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</p>
			{/if}

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<label class="text-sm leading-5.25 font-medium text-gray-700" for="identifier">
						{data.t.identifierLabel}
					</label>
					<input
						id="identifier"
						name="identifier"
						type="text"
						required
						value={form?.identifier ?? ''}
						placeholder={data.t.identifierPlaceholder}
						class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm leading-5.25 text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
					/>
				</div>

				<div class="flex flex-col gap-1.5">
					<label class="text-sm leading-5.25 font-medium text-gray-700" for="password">
						{data.t.passwordLabel}
					</label>
					<div class="relative flex items-center">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							placeholder="••••••••"
							class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm leading-5.25 text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							class="absolute right-3.5 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="flex h-12 w-full items-center justify-center rounded-xl bg-theme-600 text-base leading-6 font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{submitting ? data.t.submitting : data.t.submit}
			</button>
		</form>
	</div>
</main>
