import axios from 'axios'

import { API_BASE_URL } from '../constants/apiBaseUrl'
import { API_TIMEOUT_MS } from '../constants/queryTimes'
import {
  parseCommentsResponse,
  parseIndividualPostResponse,
  parsePostsResponse,
} from './helpers/postResponseParsers'

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

interface FetchCommentsOptions {
  postId?: number
  signal?: AbortSignal
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
})

/** Fetches the full list of posts for the feed. */
export async function fetchPosts() {
  const { data } = await client.get<unknown>('/posts')
  return parsePostsResponse(data)
}

/** Fetches a single post by ID and supports request cancellation. */
export async function fetchIndividualPost(postId: number, signal: AbortSignal) {
  const { data } = await client.get<unknown>(`/posts/${postId}`, { signal })
  return parseIndividualPostResponse(data, postId)
}

/** Fetches comments for one post when an ID is supplied, or all comments otherwise. */
export async function fetchComments({
  postId,
  signal,
}: FetchCommentsOptions = {}) {
  const { data } = await client.get<unknown>('/comments', {
    params: { postId },
    signal,
  })
  return parseCommentsResponse(data)
}

/** Checks whether an API request failed with HTTP 404. */
export function isNotFound(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404
}
