<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

{#if $message}
	<p>{$message}</p>
{/if}

<div class="mx-4">
	<form method="POST" action="?" use:enhance class="flex flex-col gap-3">
		<div>
			<label class="text-heading mb-2.5 block text-sm font-medium" for="url">url</label>
			<input
				type="url"
				name="url"
				aria-invalid={$errors.url ? 'true' : undefined}
				class="field"
				bind:value={$form.url}
				{...$constraints.url}
			/>
			{#if $errors.url}
				<span class="text-red-600">{$errors.url}</span>
			{/if}
		</div>

		<div>
			<label for="title">title</label>
			<input
				type="text"
				class="field"
				name="title"
				bind:value={$form.title}
				aria-invalid={$errors.title ? 'true' : undefined}
				{...$constraints.title}
			/>
			{#if $errors.title}
				<span class="text-red-600">{$errors.title}</span>
			{/if}
		</div>

		<div>
			<label for="tags">tag</label>
			<input
				type="text"
				class="field"
				name="tags"
				bind:value={$form.tags}
				placeholder="tag1 tag2 tag3"
				aria-invalid={$errors.tags ? 'true' : undefined}
				{...$constraints.tags}
			/>
			{#if $errors.tags}
				<span class="text-red-600">{$errors.tags}</span>
			{/if}
		</div>

		<div>
			<label for="note">note</label>
			<textarea
				class="field"
				name="note"
				bind:value={$form.note}
				aria-invalid={$errors.note ? 'true' : undefined}
				{...$constraints.note}
			></textarea>
			{#if $errors.note}
				<span class="text-red-600">{$errors.note}</span>
			{/if}
		</div>

		<div>
			<label for="is_public">公開する</label>
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
		</div>

		<div>
			<label for="read_later">後で読む</label>
			<input
				type="checkbox"
				name="read_later"
				aria-invalid={$errors.read_later ? 'true' : undefined}
				{...$constraints.read_later}
				bind:checked={$form.read_later}
			/>
			{#if $errors.read_later}
				<span class="text-red-600">{$errors.read_later}</span>
			{/if}
		</div>

		<button
			class="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 transition active:scale-110"
			type="submit">submit</button
		>
	</form>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.field {
		@apply block w-full rounded-sm border px-3 py-2.5 text-sm shadow-xs focus:border-2 focus:ring-2;
	}
</style>
