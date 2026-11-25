import axios from 'axios'

/** A post returned by the posts API. */
export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

/** A comment returned by the comments API, linked to a post by its ID. */
export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
})

/** Fetches the full list of posts for the feed. */
export async function fetchPosts() {
  return (await client.get<Post[]>('/posts')).data
}

/** Fetches the comments used to calculate the comments count on the post. */
export async function fetchComments() {
  return (await client.get<Comment[]>('/comments')).data
}
