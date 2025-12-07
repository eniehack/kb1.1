<script lang="ts">
	import dayjs from 'dayjs';

	let { data } = $props();
</script>

<main class="container">
	{#each data.bookmarks as bookmark}
		{@const humanizedCreatedAt = dayjs(bookmark.created_at).format('YYYY-MM-DD')}
		<section data-id={bookmark.id} data-url={bookmark.url} class="m-3 flex flex-col gap-1">
			<h2 class="text-lg text-black">
				<a href={bookmark.url}>
					{bookmark.title}
				</a>
			</h2>
			<a class="inline-block text-sm text-cyan-400" href={bookmark.url}>
				{bookmark.url}
			</a>
			<div class="meta">
				<span class="text-sm text-gray-700">{bookmark.id}</span>
				<time class="text-sm text-gray-700" datetime={bookmark.created_at}>
					{humanizedCreatedAt}
				</time>
			</div>
			<div class="tags">
				{#each bookmark.tags as tag (tag)}
					<a href={`/bookmarks/tags/${tag}`}>#{tag}</a>
				{/each}
			</div>
			<div>
				<button type="button"> remove </button>
				<button type="button"> archive </button>
			</div>
		</section>
	{/each}
</main>
