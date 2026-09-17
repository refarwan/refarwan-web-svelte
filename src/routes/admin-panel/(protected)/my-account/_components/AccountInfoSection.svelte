<script lang="ts">
    interface Props {
        t: Record<string, string>;
        username: string;
        email: string;
        phoneNumber: string;
    }

    let {
        t,
        username = $bindable(),
        email = $bindable(),
        phoneNumber = $bindable()
    }: Props = $props();
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.infoTitle}</h2>
    <p class="text-[13px] text-gray-500">{t.infoDescription}</p>
    <hr class="my-4 border-gray-200" />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="username">
                {t.username}
            </label>
            <input
                id="username"
                name="username"
                bind:value={username}
                required
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="email">{t.email}</label>
            <input
                id="email"
                name="email"
                type="email"
                bind:value={email}
                required
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="phoneNumber">
                {t.phoneNumber}
            </label>
            <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                bind:value={phoneNumber}
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
    </div>
</section>
