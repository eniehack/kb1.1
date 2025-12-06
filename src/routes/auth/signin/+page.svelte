<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { PUBLIC_HOST } from '$env/static/public';

	const handleOAuth = async (provider: 'github') => {
		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${PUBLIC_HOST}/auth/callback`
			}
		});
	};
</script>

<button onclick={() => handleOAuth('github')}>GitHubでログイン</button>
