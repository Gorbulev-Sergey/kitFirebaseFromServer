import type { IPosts } from "$lib/models/Post";

export async function load({ fetch }) {
    let data = await fetch('/api/posts');
    let posts = await data.json();
    return {
        posts: posts as IPosts
    }
}