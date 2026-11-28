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
    queryFn: async ({ signal }) => {
      const cached =
        client.getQueryState(postsListOptions.queryKey)?.fetchStatus ===
        'fetching'
          ? await client.fetchQuery(postsListOptions).catch(() => undefined)
          : undefined
      return (
        cached?.find((entry) => entry.id === postId) ??
        fetchIndividualPost(postId, signal)
      )
    },
    initialData: () =>
      client
        .getQueryData(postsListOptions.queryKey)
        ?.find((entry) => entry.id === postId),
    initialDataUpdatedAt: () =>
      client.getQueryState(postsListOptions.queryKey)?.dataUpdatedAt,
  })

  const comments = useQuery({
    queryKey: commentKeys.byPost(postId),
    enabled,
    queryFn: async ({ signal }) => {
      const cached =
        client.getQueryState(commentsListOptions.queryKey)?.fetchStatus ===
        'fetching'
          ? await client.fetchQuery(commentsListOptions).catch(() => undefined)
          : undefined
      return (
        cached?.filter((comment) => comment.postId === postId) ??
        fetchComments({ postId, signal })
      )
    },
    initialData: () =>
      client
        .getQueryData(commentsListOptions.queryKey)
        ?.filter((comment) => comment.postId === postId),
    initialDataUpdatedAt: () =>
      client.getQueryState(commentsListOptions.queryKey)?.dataUpdatedAt,
  })

  return { post, comments, enabled }
}
