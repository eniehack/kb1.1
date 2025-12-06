import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code') as string;
    const next = url.searchParams.get('next') ?? '/';
    
    console.debug("code in callback", code)
    if (!code) {
        redirect(303, '/auth/error')
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
        
    if (error) {
        console.error("error in /auth/callback", error)
        redirect(303, '/auth/error')
    }
    redirect(303, `/${next.slice(1)}`)
}