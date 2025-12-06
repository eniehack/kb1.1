import { listBookmarkResponseSchema } from '$lib/database/schema';
import type { PageServerLoad } from './$types';
import { z } from 'zod/mini';

export const load: PageServerLoad = async ({ fetch }) => {
	const resp = await fetch('/api/v1/bookmarks', {
		headers: {
			Accept: 'application/json'
		}
	});
	const parsedPayload = z.safeParse(listBookmarkResponseSchema, await resp.json());
	if (!parsedPayload.success) {
		throw new Error('unexpected data received');
	}

	return { bookmarks: parsedPayload.data };
};
