<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

{#if $message}
	<p>{$message}</p>
{/if}

<form method="POST" action="?" use:enhance>
	<label for="url">url</label>
	<input
		type="url"
		name="url"
		aria-invalid={$errors.url ? 'true' : undefined}
		bind:value={$form.url}
		{...$constraints.url}
	/>
	{#if $errors.url}
		<span class="text-red-600">{$errors.url}</span>
	{/if}

	<label for="title">title</label>
	<input
		type="text"
		name="title"
		bind:value={$form.title}
		aria-invalid={$errors.title ? 'true' : undefined}
		{...$constraints.title}
	/>
	{#if $errors.title}
		<span class="text-red-600">{$errors.title}</span>
	{/if}

	<label for="note">note</label>
	<input
		type="text"
		name="note"
		bind:value={$form.note}
		aria-invalid={$errors.note ? 'true' : undefined}
		{...$constraints.note}
	/>
	{#if $errors.note}
		<span class="text-red-600">{$errors.note}</span>
	{/if}

	<label for="is_public">public</label>
	<input
		type="checkbox"
		name="is_public"
		aria-invalid={$errors.is_public ? 'true' : undefined}
		{...$constraints.is_public}
		bind:checked={$form.is_public}
	/>
	{#if $errors.is_public}
		<span class="text-red-600">{$errors.is_public}</span>
	{/if}

	<button type="submit">submit</button>
</form>
