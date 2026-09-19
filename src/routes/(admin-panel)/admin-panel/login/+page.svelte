<script lang="ts">
    import Icon from "@iconify/svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { untrack } from "svelte";
    import { http } from "../../api/http";
    import { LOGIN_TRANSLATIONS } from "../../i18n/login";
    import { authStore } from "../../stores/auth.svelte";
    import { axiosErrorMessage } from "../../utils/axios-error-message";

    import type { DataResponse } from "$lib/types/api-response";

    let { data } = $props();
    const t = LOGIN_TRANSLATIONS[untrack(() => data.currentLang)];

    let showPassword = $state(false);
    let submitting = $state(false);
    let identifier = $state("");
    let password = $state("");
    let error = $state("");

    $effect(() => {
        if (authStore.accessToken) void goto(resolve("/admin-panel"));
    });

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        error = "";

        if (!identifier.trim()) {
            error = t.identifierRequired;
            return;
        }
        if (!password) {
            error = t.passwordRequired;
            return;
        }

        submitting = true;
        try {
            const res = await http.post<DataResponse<{ accessToken: string }>>("/auth/login", {
                identifier: identifier.trim(),
                password
            });
            authStore.setAccessToken(res.data.data.accessToken);
            void goto(resolve("/admin-panel"));
        } catch (err) {
            error = axiosErrorMessage(err, "Login failed");
        } finally {
            submitting = false;
        }
    };
</script>

<main class="flex min-h-screen w-full flex-col md:flex-row">
    <div class="grid h-48.5 place-content-center bg-theme-700 md:h-screen md:w-76.75 xl:w-xl">
        <img src="/ercms-logo-cell.png" alt="ERCMS Logo" class="h-auto w-26.25 md:w-50" />
    </div>

    <div class="grid flex-1 place-content-center p-6">
        <form class="flex w-85 flex-col gap-6 xl:w-125" onsubmit={handleSubmit}>
            <div>
                <h1 class="text-[28px] leading-10.5 font-extrabold tracking-normal text-gray-900">
                    {t.title}
                </h1>
                <p class="text-sm leading-5.25 font-normal text-gray-500">
                    {t.subtitle}
                </p>
            </div>

            {#if error}
                <p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            {/if}

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm leading-5.25 font-medium text-gray-700" for="identifier">
                        {t.identifierLabel}
                    </label>
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        required
                        bind:value={identifier}
                        placeholder={t.identifierPlaceholder}
                        class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm leading-5.25 text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                    />
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-sm leading-5.25 font-medium text-gray-700" for="password">
                        {t.passwordLabel}
                    </label>
                    <div class="relative flex items-center">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            bind:value={password}
                            placeholder="••••••••"
                            class="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm leading-5.25 text-gray-900 placeholder:text-gray-400 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onclick={() => (showPassword = !showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            class="absolute right-3.5 flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
                        >
                            {#if showPassword}
                                <Icon icon="lucide:eye-off" class="h-5 w-5" />
                            {:else}
                                <Icon icon="lucide:eye" class="h-5 w-5" />
                            {/if}
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                class="flex h-12 w-full items-center justify-center rounded-xl bg-theme-600 text-base leading-6 font-semibold text-white transition-colors duration-200 hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {submitting ? t.submitting : t.submit}
            </button>
        </form>
    </div>
</main>
