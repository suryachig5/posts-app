import { expect, it } from 'vitest'

import { firstPost, secondPost } from '../../test/mockData'
import { getPostsPageDisplayData } from './getPostsPageDisplayData'

const otherUserPost = { ...secondPost, userId: 2 }
const posts = [firstPost, otherUserPost]

it('should preserve saved order and ignore missing favorite IDs', () => {
  const feed = getPostsPageDisplayData(posts, [2, 100, 1], '', false, null)

  expect(feed.favoritePosts).toEqual([otherUserPost, firstPost])
  expect(feed.visiblePosts).toEqual(posts)
  expect(feed.showPreview).toBe(true)
})

it('should show favorites from every user while filtering All posts by user', () => {
  const feed = getPostsPageDisplayData(posts, [2, 1], '', false, 1)

  expect(feed.showPreview).toBe(true)
  expect(feed.favoritePosts).toEqual([otherUserPost, firstPost])
  expect(feed.visiblePosts).toEqual([firstPost])
})

it('should search saved posts by the selected user', () => {
  const feed = getPostsPageDisplayData(posts, [1, 2], ' ORANGE ', true, 2)

  expect(feed.visiblePosts).toEqual([otherUserPost])
  expect(feed.selectedUserId).toBe(2)
  expect(feed.showPreview).toBe(false)
})

it('should use all available favorites when the selected user has none', () => {
  const feed = getPostsPageDisplayData(posts, [1], '', true, 2)

  expect(feed.userIds).toEqual([1])
  expect(feed.selectedUserId).toBeNull()
  expect(feed.visiblePosts).toEqual([firstPost])
})
