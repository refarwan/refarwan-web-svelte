<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { untrack } from "svelte";
    import FilledButton from "../../../_components/FilledButton.svelte";
    import PasswordField from "../../../_components/PasswordField.svelte";
    import Textfield from "../../../_components/Textfield.svelte";
    import { http } from "../../api/http";
    import { LOGIN_TRANSLATIONS } from "../../i18n/login";
    import { authStore } from "../../stores/auth.svelte";
    import { axiosErrorMessage } from "../../utils/axios-error-message";

    import type { DataResponse } from "$lib/types/api-response";

    let { data } = $props();
    let currentLang = $state(untrack(() => data.currentLang) || "id-ID");
    const t = $derived(LOGIN_TRANSLATIONS[currentLang]);

    let showPassword = $state(false);
    let submitting = $state(false);
    let identifier = $state("");
    let password = $state("");
    let error = $state("");
    let hasSubmitted = $state(false);

    const switchLanguage = async (lang: "id-ID" | "en-US") => {
        currentLang = lang;
        const formData = new FormData();
        formData.append("admin_preferred_language", lang);
        await fetch("?/setPreferredLanguage", {
            method: "POST",
            body: formData
        });
    };

    $effect(() => {
        if (authStore.accessToken) void goto(resolve("/admin-panel"));
    });

    const identifierErrors = $derived.by(() => {
        const errors: string[] = [];
        if (hasSubmitted && !identifier.trim()) {
            errors.push(t.identifierRequired);
        }
        return errors;
    });

    const passwordErrors = $derived.by(() => {
        const errors: string[] = [];
        if (hasSubmitted && !password) {
            errors.push(t.passwordRequired);
        }
        return errors;
    });

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        error = "";
        hasSubmitted = true;

        if (!identifier.trim() || !password) {
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

{#snippet languageButtonItem(isActive: boolean, text: string, value: "en-US" | "id-ID")}
    <button
        disabled={isActive}
        onclick={() => switchLanguage(value)}
        class="cursor-pointer px-2 py-1 text-gray-500 transition-colors hover:text-theme-600 disabled:cursor-default disabled:font-semibold disabled:text-gray-900"
    >
        {text}
    </button>
{/snippet}

<main class="flex min-h-screen w-full flex-col md:flex-row">
    <div class="grid h-48.5 place-content-center bg-theme-700 md:h-screen md:w-76.75 xl:w-xl">
        <img src="/ercms-logo-cell.png" alt="ERCMS Logo" class="h-auto w-26.25 md:w-50" />
    </div>

    <div class="relative grid flex-1 place-content-center p-6">
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
                    <Textfield
                        id="identifier"
                        name="identifier"
                        type="text"
                        bind:value={identifier}
                        placeholder={t.identifierPlaceholder}
                        isError={identifierErrors.length > 0}
                        supporting={identifierErrors}
                        class="w-full"
                    />
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-sm leading-5.25 font-medium text-gray-700" for="password">
                        {t.passwordLabel}
                    </label>
                    <PasswordField
                        id="password"
                        name="password"
                        bind:value={password}
                        placeholder="••••••••"
                        isError={passwordErrors.length > 0}
                        supporting={passwordErrors}
                        {showPassword}
                        onTogglePassword={() => (showPassword = !showPassword)}
                        class="w-full"
                    />
                </div>
            </div>

            <FilledButton type="submit" disabled={submitting}>
                {submitting ? t.submitting : t.submit}
            </FilledButton>
        </form>

        <div class="absolute right-6 bottom-6 flex items-center gap-2 text-sm text-gray-600">
            {@render languageButtonItem(currentLang === "en-US", "Engllish", "en-US")}

            <span class="text-gray-300">|</span>
            {@render languageButtonItem(currentLang === "id-ID", "Bahasa Indonesia", "id-ID")}
        </div>
    </div>
</main>
