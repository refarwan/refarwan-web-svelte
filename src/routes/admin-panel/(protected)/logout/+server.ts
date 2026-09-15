import { redirect } from '@sveltejs/kit';

import { logout } from '$lib/server/auth';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, fetch }) => {
	await logout(cookies, fetch);
	redirect(303, '/admin-panel/login');
};
