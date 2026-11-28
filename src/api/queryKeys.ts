/** Builds the cache keys for the posts collection and individual posts. */
export const postKeys = {
  list: () => ['posts', 'list'] as const,
  detail: (postId: number) => ['posts', 'detail', postId] as const,
}

/** Builds the cache keys for all comments and for a single post's comments. */
export const commentKeys = {
  list: () => ['comments', 'list'] as const,
  byPost: (postId: number) => ['comments', 'detail', postId] as const,
}
