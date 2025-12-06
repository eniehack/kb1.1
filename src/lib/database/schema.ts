import { z } from 'zod/mini';

export type Bookmark = {
	id: string;
	title: string;
	url: string;
	note: string;
	is_public: boolean;
	created_at: string;
    user_id: string;
};

export const createBookmarkRequestParams = z.object({
	url: z.url(),
	title: z.string(),
	note: z.string(),
	is_public: z._default(z.boolean(), false)
});
export type CreateBookmarkRequestParams = z.infer<typeof createBookmarkRequestParams>;

export const getCreateBookmarkPageUrlParams = z.partial(createBookmarkRequestParams);
