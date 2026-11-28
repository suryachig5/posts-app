import type { Post } from '../api/posts'

interface PostsPageDisplayOptions {
  entries: Post[]
  favoriteIds: number[]
  search: string
  favoritesOnly: boolean
  userId: number | null
}

/**
 * Takes the loaded posts, favorite IDs, search text, and selected filters.
 * Returns the matching posts, the user dropdown options, and the favorites
 * to preview, along with whether the preview should appear.
 */
export function getPostsPageDisplayData(options: PostsPageDisplayOptions) {
  const { entries, favoriteIds, search, favoritesOnly, userId } = options
  const normalizedSearchValue = search.trim().toLowerCase()
  const favoritePosts = getFavoritePosts(entries, favoriteIds)
  const scopedPosts = favoritesOnly ? favoritePosts : entries
  const userIds = getUserIds(scopedPosts)
  const selectedUserId =
    userId !== null && userIds.includes(userId) ? userId : null
  const visiblePosts = getMatchingPosts(
    scopedPosts,
    normalizedSearchValue,
    selectedUserId,
  )
  const showPreview =
    !favoritesOnly && !normalizedSearchValue && favoritePosts.length > 0
  return {
    favoritePosts,
    normalizedSearchValue,
    selectedUserId,
    showPreview,
    userIds,
    visiblePosts,
  }
}

function getUserIds(posts: Post[]) {
  return [...new Set(posts.map(({ userId }) => userId))].sort(
    (firstUserId, secondUserId) => firstUserId - secondUserId,
  )
}

function getFavoritePosts(posts: Post[], favoriteIds: number[]) {
  const postById = new Map(posts.map((post) => [post.id, post]))
  return favoriteIds
    .map((id) => postById.get(id))
    .filter((post) => post !== undefined)
}

function getMatchingPosts(
  posts: Post[],
  normalizedSearchValue: string,
  userId: number | null,
) {
  return posts.filter((post) => {
    if (userId !== null && post.userId !== userId) return false
    const { title, body } = post
    return (
      title.toLowerCase().includes(normalizedSearchValue) ||
      body.toLowerCase().includes(normalizedSearchValue)
    )
  })
}
