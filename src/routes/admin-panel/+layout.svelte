<script lang="ts">
    import { onMount } from "svelte";

    import { http } from "$lib/api/http";
    import { authStore } from "$lib/stores/auth.svelte";

    import PopupContainer from "./_components/PopupContainer.svelte";

    import type { AuthCheckResult, DataResponse } from "$lib/types";

    let { children } = $props();

    onMount(async () => {
        try {
            const res = await http.get<DataResponse<AuthCheckResult>>("/auth/check");
            // A manual login/logout may have already resolved the auth state while this
            // request was in flight — don't let a stale response clobber it.
            if (authStore.initialized) return;

            if (res.data.data.status === "authenticated") {
                authStore.setAccessToken(res.data.data.accessToken);
            } else {
                authStore.clear();
            }
        } catch {
            if (!authStore.initialized) authStore.clear();
        }
    });
</script>

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
