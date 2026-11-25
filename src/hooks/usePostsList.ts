import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchComments, fetchPosts } from '../api/posts'
import type { Comment } from '../api/posts'

/** Defines the shared query key and fetcher for the full post list. */
export const postsListOptions = queryOptions({
  queryKey: ['posts', 'list'],
  queryFn: fetchPosts,
})

/** Defines the shared query key and fetcher for the full comment list. */
export const commentsListOptions = queryOptions({
  queryKey: ['comments', 'list'],
  queryFn: fetchComments,
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

/** Loads posts and groups comments by post ID for the feed. */
export function usePostsList() {
  const posts = useQuery(postsListOptions)
  const comments = useQuery({
    ...commentsListOptions,
    select: groupCommentsByPostId,
  })
  return { posts, comments }
}
