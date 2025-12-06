import type { Bookmark } from '$lib/database/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const resp = await fetch('/api/v1/bookmarks', {
		headers: {
			Accept: 'application/json'
		}
	});
	const json = await resp.json() as {bookmarks: Bookmark[]};
	console.debug(json);

	return { json };
};
