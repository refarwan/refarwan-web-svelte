<script lang="ts">
    import { tick } from "svelte";

    import { enhance } from "$app/forms";

    import DropdownSelect from "$lib/components/admin/DropdownSelect.svelte";

    interface Props {
        t: Record<string, string>;
        initialLang: string;
    }

    let { t, initialLang }: Props = $props();

    let adminLang = $state(initialLang);
    let adminLangForm: HTMLFormElement | undefined = $state();
    let adminLangPending = $state(false);

    const adminLangOptions = [
        { value: "en-US", label: "English", icon: "🇺🇸" },
        { value: "id-ID", label: "Indonesia", icon: "🇮🇩" }
    ];

    const onAdminLangChange = async (lang: string) => {
        if (lang !== "en-US" && lang !== "id-ID") return;
        adminLang = lang;
        adminLangPending = true;
        // The hidden input's value is bound reactively, so wait for Svelte to flush
        // the DOM update before reading it via requestSubmit(), otherwise the form
        // would submit the previous (stale) language value.
        await tick();
        adminLangForm?.requestSubmit();
    };
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <div class="flex items-start justify-between gap-4">
        <div>
            <h2 class="text-base font-semibold text-gray-900">{t.adminLanguageTitle}</h2>
            <p class="mt-1 text-xs text-gray-500">{t.adminLanguageDescription}</p>
        </div>
        <span
            class="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
        >
            {t.autoSaved}
        </span>
    </div>
    <hr class="my-4 border-gray-200" />

    <form
        method="POST"
        action="?/setAdminLang"
        bind:this={adminLangForm}
        use:enhance={() => {
            return async ({ update }) => {
                await update();
                adminLangPending = false;
            };
        }}
    >
        <input type="hidden" name="lang" value={adminLang} />
        <DropdownSelect
            label={t.displayLanguage}
            value={adminLang}
            options={adminLangOptions}
            onChange={onAdminLangChange}
            helperText={t.languageHelper}
            disabled={adminLangPending}
        />
    </form>
</section>
