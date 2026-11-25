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

/** Fetches a single post by ID and supports request cancellation. */
export async function fetchPost(postId: number, signal: AbortSignal) {
  return (await client.get<Post>(`/posts/${postId}`, { signal })).data
}

/** Fetches comments for one post when an ID is supplied, or all comments otherwise. */
export async function fetchComments(
  signal: AbortSignal | undefined,
  postId?: number,
) {
  const { data } = await client.get<Comment[]>('/comments', {
    params: { postId },
    signal,
  })
  return data
}

/** Checks whether an API request failed with HTTP 404. */
export function isNotFound(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404
}
