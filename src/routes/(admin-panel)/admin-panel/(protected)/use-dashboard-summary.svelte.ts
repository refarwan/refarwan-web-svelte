import { authorizedHttp } from "../../api/authorized-http";

import type { DataResponse } from "$lib/types/api-response";
import type { DashboardSummary } from "$lib/types/dashboard";

class DashboardSummaryState {
    summary = $state<DashboardSummary | null>(null);
    loading = $state(true);

    constructor() {
        void this.fetchSummary();
    }

    private async fetchSummary() {
        this.loading = true;
        try {
            const res =
                await authorizedHttp.get<DataResponse<DashboardSummary>>("/dashboard/summary");
            this.summary = res.data.data;
        } catch {
            this.summary = null;
        } finally {
            this.loading = false;
        }
    }
}

export function useDashboardSummary() {
    return new DashboardSummaryState();
}
