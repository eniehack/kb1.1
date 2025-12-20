import { z } from 'zod/mini';

export const bookmarkSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string(),
	note: z.string(),
	is_public: z.boolean(),
	created_at: z.string(),
	tags: z.array(z.string())
});
export type Bookmark = z.infer<typeof bookmarkSchema>;

export const flagSchema = z._default(z.coerce.boolean(), false);

export const listBookmarkResponseSchema = z.array(bookmarkSchema);
export type ListBookmarkResponse = z.infer<typeof listBookmarkResponseSchema>;

export const createBookmarkRequestParams = z.object({
	url: z.url(),
	title: z.string(),
	note: z._default(z.string(), ''),
	tags: z._default(z.array(z.string()), []),
	is_public: z._default(z.boolean(), false),
	read_later: z._default(z.boolean(), false)
});
export type CreateBookmarkRequestParams = z.infer<typeof createBookmarkRequestParams>;

export const createBookmarkFormParams = z.object({
	...z.omit(createBookmarkRequestParams, { tags: true }).shape,
	tags: z.string()
});

export const getCreateBookmarkPageUrlParams = z.partial(createBookmarkFormParams);
