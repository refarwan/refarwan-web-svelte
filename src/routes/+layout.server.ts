import { getApiData } from "$lib/server/get-api-data.js";

import type { ThemeShades, DataResponse } from "$lib/types";

export const load = async () => {
    const [faviconRes, themeShadesRes] = await Promise.all([
        getApiData<DataResponse<string>>("setting/favicon", "settings"),
        getApiData<DataResponse<ThemeShades>>("setting/theme-shades", "settings")
    ]);

    const themeShades = themeShadesRes?.data;
    const themeCss = themeShades
        ? `:root { ${Object.entries(themeShades)
            .map(([k, v]) => `--color-theme-${k}: ${v};`)
            .join(" ")} }`
        : '';

    return { favicon: faviconRes?.data, themeCss };
};
