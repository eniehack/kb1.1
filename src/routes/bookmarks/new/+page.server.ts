import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { createBookmarkFormParams, getCreateBookmarkPageUrlParams } from '$lib/database/schema';

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod4(createBookmarkFormParams));
		if (!form.valid) {
			return fail(400, { form });
		}
		const data = {
			...form.data,
			tags: form.data.tags.split(/[, ]+/).filter((val) => val.length !== 0)
		};
		const resp = await fetch(`/api/v1/bookmarks/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (resp.status === 401) {
			return error(401, 'please sign in');
		} else if (resp.status === 500) {
			return error(500, 'cannot insert');
		}
		return redirect(307, '/bookmarks');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();
	if (!user || authError) {
		return redirect(307, `/auth/signin`);
	}
	const params = {
		url: url.searchParams.get('url') ?? '',
		title: url.searchParams.get('title') ?? ''
	};
	const form = await superValidate(params, zod4(getCreateBookmarkPageUrlParams));
	return { form };
};
