import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchComments, fetchPost } from '../api/posts'
import { commentsListOptions, postsListOptions } from './usePostsList'

/** Reuses completed or in-flight feed queries before requesting a specific post's data. */
export function usePostDetails(postId: number) {
  const client = useQueryClient()
  const enabled = Number.isFinite(postId)

  const post = useQuery({
    queryKey: ['posts', 'detail', postId],
    enabled,
    queryFn: async ({ signal }) => {
      const cached =
        client.getQueryState(postsListOptions.queryKey)?.fetchStatus ===
        'fetching'
          ? await client.fetchQuery(postsListOptions).catch(() => undefined)
          : undefined
      return (
        cached?.find((entry) => entry.id === postId) ??
        fetchPost(postId, signal)
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
    queryKey: ['comments', 'detail', postId],
    enabled,
    queryFn: async ({ signal }) => {
      const cached =
        client.getQueryState(commentsListOptions.queryKey)?.fetchStatus ===
        'fetching'
          ? await client.fetchQuery(commentsListOptions).catch(() => undefined)
          : undefined
      return (
        cached?.filter((comment) => comment.postId === postId) ??
        fetchComments(signal, postId)
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
