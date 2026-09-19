<script lang="ts">
    import { onMount } from "svelte";
    import { http } from "$lib/api/http";
    import { authStore } from "$lib/stores/auth.svelte";
    import PopupContainer from "./admin-panel/_components/PopupContainer.svelte";

    import type { DataResponse } from "$lib/types/api-response";
    import type { AuthCheckResult } from "$lib/types/auth";

    let { children } = $props();

    onMount(async () => {
        try {
            if (authStore.initialized) return;
            const res = await http.get<DataResponse<AuthCheckResult>>("/auth/check");
            if (res.data.data.status === "authenticated")
                authStore.setAccessToken(res.data.data.accessToken);
            else authStore.clear();
        } catch {
            if (!authStore.initialized) authStore.clear();
        }
    });
</script>

<svelte:head>
    <title>ERCMS Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
    {#if authStore.initialized}
        {@render children()}
    {:else}
        <div class="flex min-h-screen items-center justify-center">
            <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-theme-600"
            ></div>
        </div>
    {/if}
    <PopupContainer />
</div>
