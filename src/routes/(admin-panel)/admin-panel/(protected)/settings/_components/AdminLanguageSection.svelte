<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import DropdownSelect from "../../_components/DropdownSelect.svelte";

    import type { SettingsTranslationObjects } from "../../../../i18n/settings/types";

    interface Props {
        t: SettingsTranslationObjects;
        initialLang: "en-US" | "id-ID";
    }

    let { t, initialLang }: Props = $props();

    let adminLangPending = $state(false);

    const adminLangOptions = [
        { value: "en-US", label: "English", icon: "🇺🇸" },
        { value: "id-ID", label: "Bahasa Indonesia", icon: "🇮🇩" }
    ];

    const switchLanguage = async (lang: "id-ID" | "en-US") => {
        const formData = new FormData();
        formData.append("admin_preferred_language", lang);
        await fetch("?/setPreferredLanguage", {
            method: "POST",
            body: formData
        });
        await invalidateAll();
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

    <DropdownSelect
        label={t.displayLanguage}
        bind:value={initialLang}
        options={adminLangOptions}
        onChange={(value) => {
            if (value === "en-US" || value === "id-ID") switchLanguage(value);
        }}
        helperText={t.languageHelper}
        disabled={adminLangPending}
    />
</section>
