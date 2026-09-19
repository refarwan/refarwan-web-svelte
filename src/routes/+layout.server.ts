import { getApiData } from "$lib/server/api-data";

import type { DataResponse } from "$lib/types/api-response";
import type { ThemeShades } from "$lib/types/theme-shades";

export const load = async () => {
    const [faviconRes, themeShadesRes] = await Promise.all([
        getApiData<DataResponse<string>>("setting/public/favicon", "settings"),
        getApiData<DataResponse<ThemeShades>>("setting/public/theme-shades", "settings")
    ]);

    const themeShades = themeShadesRes?.data;
    const themeCss = themeShades
        ? `:root { ${Object.entries(themeShades)
              .map(([k, v]) => `--color-theme-${k}: ${v};`)
              .join(" ")} }`
        : null;
    const favicon = faviconRes ? faviconRes.data : "";

    return { favicon, themeCss };
};
