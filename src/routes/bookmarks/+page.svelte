<script lang="ts">
	let { data } = $props();
</script>

<main class="container">
    <ul>
    	{#each data.json.bookmarks as bookmark}
    		<li data-id={bookmark.id}>
    			<a href={bookmark.url}>
    				{bookmark.title}
    			</a>
    		</li>
    	{/each}
    </ul>
</main>
