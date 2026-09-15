import { env } from '$env/dynamic/private';

export const getApiData = async <T>(
	endpoint: string,
	fetchFn: typeof fetch = fetch
): Promise<T | undefined> => {
	try {
		const apiUrl = env.API_URL || 'http://localhost:3000';
		const res = await fetchFn(`${apiUrl}/${endpoint}`);

		if (!res.ok) return undefined;
		return (await res.json()) as T;
	} catch (error) {
		console.error(error);
		return undefined;
	}
};
