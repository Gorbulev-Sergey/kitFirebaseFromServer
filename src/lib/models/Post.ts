export class Post {
    title: string = '';
    description: string | null = null;
    date: string = new Date().toISOString();
    cover: string | null = null;
}
export interface IPosts {
    [key: string]: Post;
}