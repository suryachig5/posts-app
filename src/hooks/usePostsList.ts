import { queryOptions, useQuery } from '@tanstack/react-query'

import type { Comment } from '../api/posts'
import { fetchComments, fetchPosts } from '../api/posts'

/** Defines the shared query key and fetcher for the full post list. */
export const postsListOptions = queryOptions({
  queryKey: ['posts', 'list'],
  queryFn: fetchPosts,
})

/** Defines the shared query key and fetcher for the full comment list. */
export const commentsListOptions = queryOptions({
  queryKey: ['comments', 'list'],
  queryFn: () => fetchComments(),
})

function groupCommentsByPostId(comments: Comment[]) {
  const commentsByPostId = new Map<number, Comment[]>()

  for (const comment of comments) {
    const { postId } = comment
    const postComments = commentsByPostId.get(postId)

    if (postComments) {
      postComments.push(comment)
    } else {
      commentsByPostId.set(postId, [comment])
    }
  }

  return commentsByPostId
}

/**
 * Starts the posts and comments requests in parallel so the feed can render
 * posts as soon as they arrive. Groups comments by post ID for card counts
 * while keeping the original list in the query cache for the detail view.
 */
export function usePostsList() {
  const posts = useQuery(postsListOptions)
  const comments = useQuery({
    ...commentsListOptions,
    select: groupCommentsByPostId,
  })
  return { posts, comments }
}
