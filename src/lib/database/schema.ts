import { z } from 'zod/mini';

const bookmarkSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string(),
	note: z.string(),
	is_public: z.boolean(),
	created_at: z.string(),
	user_id: z.string()
});
export type Bookmark = z.infer<typeof bookmarkSchema>;

export const listBookmarkResponseSchema = z.array(bookmarkSchema);
export type ListBookmarkResponse = z.infer<typeof bookmarkSchema>;

export const createBookmarkRequestParams = z.object({
	url: z.url(),
	title: z.string(),
	note: z.string(),
	is_public: z._default(z.boolean(), false)
});
export type CreateBookmarkRequestParams = z.infer<typeof createBookmarkRequestParams>;

export const getCreateBookmarkPageUrlParams = z.partial(createBookmarkRequestParams);
