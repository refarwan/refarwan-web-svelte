<script lang="ts">
	import AdminHeader from './_components/AdminHeader.svelte';
	import AdminSidebar from './_components/AdminSidebar.svelte';

	let { data, children } = $props();
</script>

<AdminSidebar t={data.shellT} />
<div class="flex min-h-screen flex-col xl:pl-65">
	<AdminHeader account={data.account} t={data.shellT} />
	<main class="flex-1 p-4 md:p-6">
		{@render children()}
	</main>
</div>
