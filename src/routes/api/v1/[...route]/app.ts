import { generateID } from '$lib/generateId';
import { Hono } from 'hono';
import type { SupabaseClient } from '@supabase/supabase-js';
import { type CreateBookmarkRequestParams, flagSchema } from '$lib/database/schema';
import * as z from 'zod';

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
	})
	.get('/bookmarks/:bookmarkId', async (c) => {
		const supabase = c.env.supabase;
		const targetId = c.req.param('bookmarkId');
		const { data, error } = await supabase
			.from('bookmarks')
			.select(
				`
				id,
				title,
				url,
				note,
				created_at,
				is_public,
				tags (
					slug
				)
			`
			)
			.eq('id', targetId)
			.limit(1)
			.single();
		if (error) {
			console.error('select error', error.code, error.message);
			c.status(500);
			return;
		}
		if (data === null) {
			c.status(404);
			return;
		}
		const bookmarks = {
			...data,
			tags: data.tags.map((bt) => bt.slug)
		};
		return c.json(bookmarks);
	})
	.get('/bookmarks/feeling-lucky', async (c) => {
		const supabase = c.env.supabase;
		const onlyReadlater = z.safeParse(flagSchema, c.req.param('only_readlater'))
		if (!onlyReadlater.success) {
			console.error('rpc(im_feeling_lucky_on_bookmark) error', onlyReadlater.error);
			c.status(400);
			return
		}
		const { data, error } = await supabase.rpc('im_feeling_lucky_on_bookmark', {only_read_later: onlyReadlater});
		if (error) {
			console.error('rpc(im_feeling_lucky_on_bookmark) error', error.code, error.message);
			c.status(500);
			return;
		}
		return c.json(data);
	});

export type Router = typeof router;
export const app = new Hono().route('/api/v1', router);
