import { fb } from "$lib/scripts/firebase";
import { json } from "@sveltejs/kit";
import { get, push, ref } from "firebase/database";

async function getPosts() {
    let data = await get(ref(fb, '/posts'));
    let posts = await data.val();
    return posts;
}

export async function GET() {
    return new Response(JSON.stringify(await getPosts()))
}

export async function POST({ request }) {
    let post = await request.json();
    let result = await push(ref(fb, '/posts'), post);
    return json({ result: result.key });
}