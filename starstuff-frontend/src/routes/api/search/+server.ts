import { json, type RequestHandler } from '@sveltejs/kit';
import { DEV_API_URL } from '$env/static/private';
import type { SearchResponse } from '$lib/types/search-response';

export const GET: RequestHandler = async ({ url }): Promise<any> => {
	const q = url.searchParams.get('query') ?? '';

	const res = await fetch(`${DEV_API_URL}/search?q=${encodeURIComponent(q)}`);
	if (!res.ok) throw new Error(`Search failed: ${res.status}`);

	const data: SearchResponse = await res.json();

	return json(data);
};
