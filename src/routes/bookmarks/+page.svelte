<script lang="ts">
	import Bookmark from "$lib/Bookmark.svelte";

	let { data } = $props();
</script>

<main class="container mx-auto mt-[25px]">
	<h1 class="mx-3 pb-[25px] text-xl font-semibold">登録したページ一覧</h1>
	{#each data.bookmarks as bookmark (bookmark.id)}
		<Bookmark {bookmark} />
	{/each}
</main>