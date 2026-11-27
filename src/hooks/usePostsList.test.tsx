import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchComments, fetchPosts } from '../api/posts'
import {
  firstComment,
  firstPost,
  secondComment,
  secondPost,
} from '../test/mockData'
import { createQueryHarness } from '../test/queryHarness'
import { usePostsList } from './usePostsList'

vi.mock('../api/posts')

const fetchPostsMock = vi.mocked(fetchPosts)
const fetchCommentsMock = vi.mocked(fetchComments)

beforeEach(() => {
  fetchPostsMock.mockResolvedValue([firstPost, secondPost])
  fetchCommentsMock.mockResolvedValue([firstComment])
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('usePostsList', () => {
  it('should load the feed and group multiple comments by their post ID', async () => {
    const { wrapper } = createQueryHarness()
    const anotherComment = { ...firstComment, id: 12 }
    fetchCommentsMock.mockResolvedValue([
      firstComment,
      secondComment,
      anotherComment,
    ])
    const { result } = renderHook(usePostsList, { wrapper })

    await waitFor(() =>
      expect(result.current.posts.data).toEqual([firstPost, secondPost]),
    )
    await waitFor(() =>
      expect(result.current.comments.data).toEqual(
        new Map([
          [1, [firstComment, anotherComment]],
          [2, [secondComment]],
        ]),
      ),
    )
    expect(fetchCommentsMock).toHaveBeenCalledWith(undefined)
  })

  it('should keep posts available when comments fail', async () => {
    const { wrapper } = createQueryHarness()
    fetchCommentsMock.mockRejectedValue(new Error('Offline'))
    const { result } = renderHook(usePostsList, { wrapper })
    await waitFor(() => expect(result.current.comments.isError).toBe(true))
    expect(result.current.posts.data).toEqual([firstPost, secondPost])
  })
})
