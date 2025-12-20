<script lang="ts">
    import dayjs from "dayjs";
    import type { Bookmark } from "./database/schema";

    type Props =  {
        bookmark: Bookmark
    }
    let { bookmark }: Props = $props();
	const humanizedCreatedAt = dayjs(bookmark.created_at).format('YYYY-MM-DD')
</script>

<section
	data-id={bookmark.id}
	data-url={bookmark.url}
	class={bookmark.is_public ? 'public_bookmark' : 'private_bookmark'}
>
	<h2 class="grid grid-flow-col grid-cols-[24px_1fr] grid-rows-1 gap-0 text-lg">
		<div class="flex place-items-center text-gray-700">
			{#if bookmark.is_public}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-unlock-fill"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M12 0a4 4 0 0 1 4 4v2.5h-1V4a3 3 0 1 0-6 0v2h.5A2.5 2.5 0 0 1 12 8.5v5A2.5 2.5 0 0 1 9.5 16h-7A2.5 2.5 0 0 1 0 13.5v-5A2.5 2.5 0 0 1 2.5 6H8V4a4 4 0 0 1 4-4"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-lock-fill"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
					/>
				</svg>
			{/if}
		</div>
		<a href={bookmark.url}>
			{bookmark.title}
		</a>
	</h2>
	<div class="meta">
		<span class="text-sm text-gray-700 select-all">{bookmark.id}</span>
		<time class="text-sm text-gray-700" datetime={bookmark.created_at}>
			{humanizedCreatedAt}
		</time>
	</div>
	<div class="tags flex gap-2">
		{#each bookmark.tags as tag (tag)}
			<a href={`/bookmarks/tags/${tag}`}>#{tag}</a>
		{/each}
	</div>
	<div>
		<button class="text-red-600" type="button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-trash-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
				/>
			</svg>
		</button>
		<button type="button"> archive </button>
	</div>
</section>

<style lang="postcss">
	@reference "tailwindcss";
	.private_bookmark {
		@apply m-3 flex flex-col gap-1 bg-gray-300 px-1 py-3;
	}
	.public_bookmark {
		@apply m-3 flex flex-col gap-1 px-1 py-3;
	}
	a {
		@apply text-cyan-600;
	}
</style>