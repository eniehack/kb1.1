import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { createBookmarkRequestParams, getCreateBookmarkPageUrlParams } from '$lib/database/schema';

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod4(createBookmarkRequestParams));
		if (!form.valid) {
			return fail(400, { form });
		}
		const resp = await fetch(`/api/v1/bookmarks/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});
		if (!resp.ok) {
			return error(500, 'cannot insert');
		}
		return redirect(307, '/bookmarks');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url }) => {
	const params = {
		url: url.searchParams.get('url') ?? '',
		title: url.searchParams.get('title') ?? ''
	};
	const form = await superValidate(params, zod4(getCreateBookmarkPageUrlParams));
	return { form };
};
