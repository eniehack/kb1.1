import { generateID } from '$lib/generateId';
import { Hono } from 'hono';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Bookmark, CreateBookmarkRequestParams } from '$lib/database/schema';

type Bindings = {
	supabase: SupabaseClient;
};

export const router = new Hono<{ Bindings: Bindings }>()
	.post('/bookmarks/new', async (c) => {
		const supabase = c.env.supabase;
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser();
		if (!user || authError) {
			console.debug('err', authError);
			console.debug(user);
			c.status(401);
			return;
		}
		const reqPayload = await c.req.json<CreateBookmarkRequestParams>();
		let id = '';
		for (let i = 0; i <= 32; i++) {
			id = generateID(`bookmark ${reqPayload.url} ${Date.now()}`, i);
			const { count } = await supabase
				.from('bookmarks')
				.select('*', { count: 'exact' })
				.eq('id', id);
			if (count == 0) break;
		}
		const { error } = await supabase.rpc('create_bookmark_with_tags', {
			bookmark_id: id,
			title: reqPayload.title,
			url: reqPayload.url,
			note: reqPayload.note,
			is_public: reqPayload.is_public,
			tags: reqPayload.tags,
			read_later: reqPayload.read_later,
		});
		if (error) {
			console.debug('insert error:', error);
			c.status(500);
			return;
		}
		c.status(202);
		c.header('Location', `/bookmarks/${id}`);
		return;
	})
	.get('/bookmarks', async (c) => {
		const supabase = c.env.supabase;
		const { data, error } = await supabase.from('bookmarks').select(`
				id,
				title,
				url,
				note,
				created_at,
				is_public,
				tags (
					slug
				)
			`)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('select error', error.code, error.message);
			return c.json([]);
		}
		const bookmarks = data.map((bookmark) => ({
			...bookmark,
			tags: bookmark.tags.map((bt) => bt.slug)
		}));
		console.debug(bookmarks);
		return c.json(bookmarks);
	});

export type Router = typeof router;
export const app = new Hono().route('/api/v1', router);
