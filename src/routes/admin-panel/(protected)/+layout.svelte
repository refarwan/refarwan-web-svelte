<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    import { authStore } from "$lib/stores/auth.svelte";

    import AdminHeader from "./_components/AdminHeader.svelte";
    import AdminSidebar from "./_components/AdminSidebar.svelte";

    let { data, children } = $props();

    $effect(() => {
        if (!authStore.accessToken) {
            void goto(resolve("/admin-panel/login"));
        }
    });
</script>

{#if authStore.accessToken}
    <AdminSidebar t={data.shellT} />
    <div class="flex min-h-screen flex-col xl:pl-65">
        <AdminHeader t={data.shellT} />
        <main class="flex-1 p-4 md:p-6">
            {@render children()}
        </main>
    </div>
{/if}
