import { authorizedHttp } from "$lib/api/authorized-http";

import type { AccountItem, DataResponse } from "$lib/types";

class AccountStore {
    account = $state<AccountItem | null>(null);
    loading = $state(true);
    private loaded = false;
    private pending: Promise<void> | null = null;

    load(): Promise<void> {
        if (this.loaded) return Promise.resolve();
        if (this.pending) return this.pending;
        return this.refresh();
    }

    refresh(): Promise<void> {
        this.pending = (async () => {
            try {
                const res = await authorizedHttp.get<DataResponse<AccountItem>>("/account/me");
                this.account = res.data.data;
            } catch {
                this.account = null;
            } finally {
                this.loading = false;
                this.loaded = true;
                this.pending = null;
            }
        })();

        return this.pending;
    }
}

export const accountStore = new AccountStore();
