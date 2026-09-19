<script lang="ts">
    import DropdownSelect from "../../_components/DropdownSelect.svelte";

    import type { AreaItem } from "../../../../types/area";

    interface Props {
        t: Record<string, string>;
        fullname: string;
        birthday: string;
        birthplaceCode: string;
        gender: string;
        allRegencies: AreaItem[];
    }

    let {
        t,
        fullname = $bindable(),
        birthday = $bindable(),
        birthplaceCode = $bindable(),
        gender = $bindable(),
        allRegencies
    }: Props = $props();

    const birthplaceOptions = $derived(
        allRegencies.map((item) => ({ value: item.code, label: item.name }))
    );
    const genderOptions = $derived([
        { value: "male", label: t.male },
        { value: "female", label: t.female }
    ]);
</script>

<section class="rounded-lg border border-gray-200 bg-white p-5 md:px-6 md:py-5">
    <h2 class="text-base font-semibold text-gray-900">{t.personalTitle}</h2>
    <p class="text-[13px] text-gray-500">{t.personalDescription}</p>
    <hr class="my-4 border-gray-200" />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="fullname">
                {t.fullname}
            </label>
            <input
                id="fullname"
                name="fullname"
                bind:value={fullname}
                required
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <label class="block text-[13px] font-medium text-gray-700" for="birthday">
                {t.birthday}
            </label>
            <input
                id="birthday"
                name="birthday"
                type="date"
                bind:value={birthday}
                class="mt-1 block h-10 w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-theme-500 focus:ring-1 focus:ring-theme-500 focus:outline-none"
            />
        </div>
        <div>
            <input type="hidden" name="birthplaceCode" value={birthplaceCode} />
            <DropdownSelect
                id="birthplaceCode"
                label={t.birthplace}
                value={birthplaceCode}
                options={birthplaceOptions}
                onChange={(code) => (birthplaceCode = code)}
                placeholder={t.select}
                searchable
                searchPlaceholder={t.birthplacePlaceholder}
                class="mt-1"
            />
        </div>
        <div>
            <input type="hidden" name="gender" value={gender} />
            <DropdownSelect
                id="gender"
                label={t.gender}
                value={gender}
                options={genderOptions}
                onChange={(value) => (gender = value)}
                placeholder={t.selectGender}
                class="mt-1"
            />
        </div>
    </div>
</section>
