import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const prefix = params.lang ? `/${params.lang}` : "";
    redirect(307, `${prefix}/watch/play?v=${params.id}`);
};
