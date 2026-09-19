import { authorizedHttp } from "$lib/api/authorized-http";
import { accountStore } from "$lib/stores/account.svelte";
import { popup } from "$lib/stores/popup.svelte";
import { axiosErrorMessage } from "$lib/utils/axios-error-message";

import type { AdminTranslation } from "$lib/i18n/admin";
import type { AccountItem } from "$lib/types/account";
import type { AreaItem } from "$lib/types/area";

type AccountT = AdminTranslation["account"];

const fetchAreas = async (path: string): Promise<AreaItem[]> => {
    const res = await fetch(path);
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: AreaItem[] };
    return body.data ?? [];
};

class AccountFormState {
    loading = $state(true);

    username = $state("");
    email = $state("");
    phoneNumber = $state("");
    fullname = $state("");
    birthday = $state("");
    gender = $state("");
    birthplaceCode = $state("");
    address = $state("");
    provinceCode = $state("");
    regencyCode = $state("");
    districtCode = $state("");
    villageCode = $state("");

    avatarPreview = $state<string | null>(null);
    deleteProfilePicture = $state(false);
    submitting = $state(false);

    initialRegencies = $state<AreaItem[]>([]);
    initialDistricts = $state<AreaItem[]>([]);
    initialVillages = $state<AreaItem[]>([]);

    private getT: () => AccountT;

    constructor(getT: () => AccountT) {
        this.getT = getT;
        void this.init();
    }

    private async init() {
        await accountStore.load();
        const account = accountStore.account;
        if (account) {
            this.seed(account);
            await this.loadInitialAreas(account);
        }
        this.loading = false;
    }

    private seed(account: AccountItem) {
        this.username = account.username;
        this.email = account.email;
        this.phoneNumber = account.phoneNumber ?? "";
        this.fullname = account.fullname;
        this.birthday = account.birthday ?? "";
        this.gender = account.gender ?? "";
        this.birthplaceCode = account.birthplace?.code ?? "";
        this.address = account.address ?? "";
        this.provinceCode = account.province?.code ?? "";
        this.regencyCode = account.regency?.code ?? "";
        this.districtCode = account.district?.code ?? "";
        this.villageCode = account.village?.code ?? "";
        this.avatarPreview = account.profilePicture?.medium ?? null;
    }

    private async loadInitialAreas(account: AccountItem) {
        const [regencies, districts, villages] = await Promise.all([
            account.province
                ? fetchAreas(`/admin-panel/api/area/regencies/${account.province.code}`)
                : Promise.resolve([]),
            account.regency
                ? fetchAreas(`/admin-panel/api/area/districts/${account.regency.code}`)
                : Promise.resolve([]),
            account.district
                ? fetchAreas(`/admin-panel/api/area/villages/${account.district.code}`)
                : Promise.resolve([])
        ]);
        this.initialRegencies = regencies;
        this.initialDistricts = districts;
        this.initialVillages = villages;
    }

    handleSubmit = async (event: SubmitEvent): Promise<void> => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);

        const phoneNumber = formData.get("phoneNumber");
        if (typeof phoneNumber !== "string" || !phoneNumber.trim()) formData.delete("phoneNumber");

        const gender = formData.get("gender");
        if (gender !== "male" && gender !== "female") formData.delete("gender");

        if (formData.get("deleteProfilePicture") !== "true")
            formData.delete("deleteProfilePicture");

        const profilePicture = formData.get("profilePicture");
        if (!(profilePicture instanceof File) || profilePicture.size === 0) {
            formData.delete("profilePicture");
        }

        this.submitting = true;
        try {
            await authorizedHttp.patch("/account/me", formData);
            await accountStore.refresh();
            popup.success({ message: this.getT().updated });
        } catch (err) {
            popup.error({ message: axiosErrorMessage(err, "Update failed") });
        } finally {
            this.submitting = false;
        }
    };
}

export function useAccountForm(getT: () => AccountT) {
    return new AccountFormState(getT);
}
