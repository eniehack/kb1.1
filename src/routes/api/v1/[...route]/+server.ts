import { app } from './app';
import type { RequestHandler } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// SvelteKitのサーバーハンドラ
export const GET: RequestHandler = (event) => handle(event);
export const POST: RequestHandler = (event) => handle(event);
export const PUT: RequestHandler = (event) => handle(event);
export const DELETE: RequestHandler = (event) => handle(event);
export const PATCH: RequestHandler = (event) => handle(event);

// Honoに処理を委譲するラッパー関数
async function handle(event: RequestEvent) {
	const { supabase } = event.locals;

	const resp = await app.fetch(event.request, { supabase });

	return resp;
}
