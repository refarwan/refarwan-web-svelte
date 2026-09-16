import { error, fail } from "@sveltejs/kit";

import { getAdminTranslation } from "$lib/i18n/admin";
import { getAdminLang } from "$lib/server/admin-lang";
import { authFetch, parseApiError } from "$lib/server/api-auth";
import { getActiveContentLangs } from "$lib/server/settings";

import type { Actions, PageServerLoad } from "./$types";

import type { AdminOptionItem, DataResponse, VideoDetail } from "$lib/types";

export const load: PageServerLoad = async ({ parent, params, cookies, fetch }) => {
    const { adminLang } = await parent();

    const [videoRes, categoriesRes, contentLanguages] = await Promise.all([
        authFetch(cookies, fetch, `/video/${params.id}`),
        authFetch(cookies, fetch, "/video-category/admin-options"),
        getActiveContentLangs(fetch)
    ]);

    if (!videoRes.ok) {
        error(videoRes.status === 404 ? 404 : 500, "Video not found");
    }

    const video = ((await videoRes.json()) as DataResponse<VideoDetail>).data;
    const categories = categoriesRes.ok
        ? ((await categoriesRes.json()) as DataResponse<AdminOptionItem[]>).data
        : [];

    return {
        t: getAdminTranslation(adminLang).watchVideo,
        common: getAdminTranslation(adminLang).common,
        video,
        categories,
        contentLanguages
    };
};

export const actions: Actions = {
    update: async ({ request, params, cookies, fetch }) => {
        const raw = await request.formData();
        const t = getAdminTranslation(getAdminLang(cookies)).watchVideo;

        const output = new FormData();
        output.set("title", String(raw.get("title") ?? ""));

        const description = String(raw.get("description") ?? "");
        if (description) output.set("description", description);

        const categoryId = String(raw.get("categoryId") ?? "");
        if (categoryId) output.set("categoryId", categoryId);

        output.set("status", String(raw.get("status") ?? "draft"));

        const translations = raw.get("translations");
        if (typeof translations === "string") output.set("translations", translations);

        const thumbnail = raw.get("thumbnail");
        if (thumbnail instanceof File && thumbnail.size > 0) output.set("thumbnail", thumbnail);

        const res = await authFetch(cookies, fetch, `/video/${params.id}`, {
            method: "PUT",
            body: output
        });

        if (!res.ok) {
            const { message, fieldErrors } = await parseApiError(res, t.saveFailed);
            return fail(res.status, { error: message, fieldErrors });
        }

        return { success: true, message: t.updated };
    }
};
