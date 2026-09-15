import { proxyAreaEndpoint } from '$lib/server/area-proxy';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, url, fetch }) =>
	proxyAreaEndpoint(fetch, `/area/regencies/${params.code}`, url.searchParams.toString());
