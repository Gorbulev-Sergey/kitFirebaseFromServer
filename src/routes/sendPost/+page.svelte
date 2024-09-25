<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Post } from '$lib/models/Post';

	let post = new Post();
</script>

<div class="d-flex flex-column align-items-sm-start gap-2 bg-light text-dark p-3 mb-3 rounded">
	<h4>Создать новую публикацию</h4>
	<input class="form-control" placeholder="Заголовок" bind:value={post.title} />
	<input class="form-control" placeholder="Дополнительное описание" bind:value={post.description} />
	<input class="form-control" placeholder="Url фотографии" bind:value={post.cover} />
	{#if post.cover != ''}
		<img class="img-fluid w-25" src={post.cover} alt="" />
	{/if}
	<button
		class="btn btn-dark text-light"
		on:click={async () => {
			if (post.title.trim() != '') {
				const response = await fetch('/api/posts', {
					method: 'POST',
					body: JSON.stringify(post),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				post = new Post();
				invalidateAll();
			}
		}}>Создать</button
	>
</div>
