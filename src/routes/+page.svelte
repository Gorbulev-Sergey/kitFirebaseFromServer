<script lang="ts">
	import { Post } from '$lib/models/Post.js';
	import { fb } from '$lib/scripts/firebase.js';
	import { push, ref, remove } from 'firebase/database';
	import { invalidateAll } from '$app/navigation';
	import Dialog from '$lib/components/Dialog.svelte';
	import { onMount } from 'svelte';

	class KeyPost extends Post {
		key: String | null = '';
	}

	export let data;
	$: posts = data.posts;

	let myPost: KeyPost = new KeyPost();
	let isDeleteDialogShow = false;

	onMount(() => {
		document.addEventListener('visibilitychange', function () {
			if (!document.hidden) {
				invalidateAll();
			}
		});
	});
</script>

<Dialog
	title="Удалить публикацию"
	isShow={isDeleteDialogShow}
	textBtnOk="Удалить"
	onOk={async () => {
		remove(ref(fb, `/posts/${myPost.key}`)).then(() => {
			myPost = new KeyPost();
			isDeleteDialogShow = false;
			invalidateAll();
		});
	}}
	onCancel={() => {
		myPost = new KeyPost();
		isDeleteDialogShow = false;
	}}
>
	<div class="d-flex w-100">
		<div class="bg-white text-dark p-3 rounded d-flex flex-grow-1">
			<div class="d-flex flex-column gap-1 flex-grow-1">
				<h5>{myPost.title}</h5>
				<div>{myPost.description}</div>
			</div>
		</div>
		{#if myPost.cover}
			<div
				class="rounded-end"
				style="background-image: url({myPost.cover});
             background-repeat: no-repeat; background-position: center; background-size: cover; width:10em; min-height:10em ;"
			></div>
		{/if}
	</div>
</Dialog>

<div class="d-flex flex-column align-items-sm-start gap-2 bg-light text-dark p-3 mb-3 rounded">
	<h4>Создать новую публикацию</h4>
	<input class="form-control" placeholder="Заголовок" bind:value={myPost.title} />
	<input
		class="form-control"
		placeholder="Дополнительное описание"
		bind:value={myPost.description}
	/>
	<input class="form-control" placeholder="Url фотографии" bind:value={myPost.cover} />
	{#if myPost.cover != ''}
		<img class="img-fluid w-25" src={myPost.cover} alt="" />
	{/if}
	<button
		class="btn btn-dark text-light"
		on:click={async () => {
			if (myPost.title.trim() != '') {
				myPost.key = null;
				push(ref(fb, '/posts'), myPost).then(() => {
					myPost = new KeyPost();
					invalidateAll();
				});
			}
		}}>Создать</button
	>
</div>

{#if posts}
	<div class="bg-light text-dark rounded p-3 d-flex flex-column gap-3">
		<h4>Список публикаций</h4>
		{#each Object.entries(posts).sort((v1, v2) => new Date(v2[1].date).getTime() - new Date(v1[1].date).getTime()) as [key, post]}
			<div class="d-flex">
				<div class="bg-white text-dark p-3 rounded d-flex flex-grow-1">
					<div class="d-flex flex-column gap-1 flex-grow-1">
						<h5>{post.title}</h5>
						<div>{post.description}</div>
					</div>
					<div>
						<button
							class="btn btn-light text-danger"
							on:click={() => {
								myPost = { key, ...post };
								isDeleteDialogShow = true;
							}}><i class="fa-solid fa-trash"></i></button
						>
					</div>
				</div>
				{#if post.cover}
					<div
						class="rounded-end"
						style="background-image: url({post.cover});
					 background-repeat: no-repeat; background-position: center; background-size: cover; width:30em; min-height:15em ;"
					></div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
