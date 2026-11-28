import type {
  QueryClient,
  QueryExecuteOptions,
  QueryKey,
} from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchComments, fetchIndividualPost } from '../api/posts'
import { commentKeys, postKeys } from '../api/queryKeys'
import { commentsListOptions, postsListOptions } from './usePostsList'

/**
 * Returns separate queries for the post and its comments by post ID.
 * Reuses feed data when available and fetches missing data as needed.
 */
export function usePostDetails(postId: number) {
  const client = useQueryClient()
  const enabled = Number.isFinite(postId)

  const post = useQuery({
    queryKey: postKeys.detail(postId),
    enabled,
    ...reuseFeedData(
      client,
      postsListOptions,
      (posts) => posts.find((entry) => entry.id === postId),
      (signal) => fetchIndividualPost(postId, signal),
    ),
  })

  const comments = useQuery({
    queryKey: commentKeys.byPost(postId),
    enabled,
    ...reuseFeedData(
      client,
      commentsListOptions,
      (comments) => comments.filter((comment) => comment.postId === postId),
      (signal) => fetchComments({ postId, signal }),
    ),
  })

  return { post, comments, enabled }
}

function reuseFeedData<Item, Detail, Key extends QueryKey>(
  client: QueryClient,
  feedOptions: QueryExecuteOptions<Item[], Error, Item[], Item[], Key>,
  selectDetail: (items: Item[]) => Detail | undefined,
  fetchDetail: (signal: AbortSignal) => Promise<Detail>,
) {
  const { queryKey } = feedOptions

  return {
    initialData: () => {
      const items = client.getQueryData<Item[]>(queryKey)
      return items === undefined ? undefined : selectDetail(items)
    },
    initialDataUpdatedAt: () => client.getQueryState(queryKey)?.dataUpdatedAt,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      if (client.getQueryState(queryKey)?.fetchStatus === 'fetching') {
        const items = await client.query(feedOptions).catch(() => undefined)
        const detail = items === undefined ? undefined : selectDetail(items)

        if (detail !== undefined) return detail
      }

      return fetchDetail(signal)
    },
  }
}
