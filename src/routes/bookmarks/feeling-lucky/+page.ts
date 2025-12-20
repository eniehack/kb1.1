import { listBookmarkResponseSchema } from '$lib/database/schema';
import type { PageLoad } from './$types';
import { z } from 'zod/mini';

export const load: PageLoad = async ({ fetch }) => {
	const resp = await fetch('/api/v1/bookmarks/feeling-lucky', {
		headers: {
			Accept: 'application/json'
		}
	});
	const json = await resp.json()
	const parsedPayload = z.safeParse(listBookmarkResponseSchema, json);
	if (!parsedPayload.success) {
		throw new Error(`unexpected data received: ${parsedPayload.error}`);
	}

	return { bookmarks: parsedPayload.data };
};
