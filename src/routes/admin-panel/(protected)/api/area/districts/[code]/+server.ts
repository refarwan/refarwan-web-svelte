import { proxyAreaEndpoint } from '$lib/server/area-proxy';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, url, fetch }) =>
	proxyAreaEndpoint(fetch, `/area/districts/${params.code}`, url.searchParams.toString());
