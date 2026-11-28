import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchComments, fetchIndividualPost, fetchPosts } from '../api/posts'
import {
  firstComment,
  firstPost,
  secondComment,
  secondPost,
} from '../test/mockData'
import { createQueryHarness } from '../test/queryHarness'
import { usePostDetails } from './usePostDetails'
import { commentsListOptions, postsListOptions } from './usePostsList'

vi.mock('../api/posts')

const fetchPostsMock = vi.mocked(fetchPosts)
const fetchPostMock = vi.mocked(fetchIndividualPost)
const fetchCommentsMock = vi.mocked(fetchComments)

beforeEach(() => {
  fetchPostsMock.mockResolvedValue([firstPost, secondPost])
  fetchPostMock.mockResolvedValue(firstPost)
  fetchCommentsMock.mockResolvedValue([firstComment])
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('usePostDetails', () => {
  it('should use both cached collections without making another request', () => {
    const { client, wrapper } = createQueryHarness()
    client.setQueryData(postsListOptions.queryKey, [firstPost, secondPost])
    client.setQueryData(commentsListOptions.queryKey, [
      firstComment,
      secondComment,
    ])
    const { result } = renderHook(() => usePostDetails(1), { wrapper })

    expect(result.current.post.data).toEqual(firstPost)
    expect(result.current.comments.data).toEqual([firstComment])
    expect(fetchPostMock).not.toHaveBeenCalled()
    expect(fetchCommentsMock).not.toHaveBeenCalled()
  })

  it('should start detail requests when the feed cache is empty', async () => {
    const { wrapper } = createQueryHarness()
    const { result } = renderHook(() => usePostDetails(1), { wrapper })
    await waitFor(() =>
      expect(result.current.comments.data).toEqual([firstComment]),
    )
    expect(result.current.post.data).toEqual(firstPost)
    expect(fetchPostMock).toHaveBeenCalledWith(1, expect.any(AbortSignal))
    expect(fetchCommentsMock).toHaveBeenCalledWith({
      postId: 1,
      signal: expect.any(AbortSignal),
    })
    expect(fetchPostsMock).not.toHaveBeenCalled()
  })

  it('should wait for feed queries already in flight', async () => {
    const { client, wrapper } = createQueryHarness()
    fetchCommentsMock.mockResolvedValue([firstComment, secondComment])
    const posts = client.fetchQuery(postsListOptions)
    const comments = client.fetchQuery(commentsListOptions)
    const { result } = renderHook(() => usePostDetails(1), { wrapper })
    await Promise.all([posts, comments])
    await waitFor(() =>
      expect(result.current.comments.data).toEqual([firstComment]),
    )
    expect(result.current.post.data).toEqual(firstPost)
    expect(fetchPostMock).not.toHaveBeenCalled()
    expect(fetchCommentsMock).toHaveBeenCalledTimes(1)
  })

  it('should fall back to detail requests if pending feed requests fail', async () => {
    const { client, wrapper } = createQueryHarness()
    fetchPostsMock.mockRejectedValueOnce(new Error('Feed unavailable'))
    fetchCommentsMock.mockRejectedValueOnce(
      new Error('Feed comments unavailable'),
    )
    const feedRequests = Promise.allSettled([
      client.fetchQuery(postsListOptions),
      client.fetchQuery(commentsListOptions),
    ])
    const { result } = renderHook(() => usePostDetails(1), { wrapper })
    await feedRequests
    await waitFor(() =>
      expect(result.current.comments.data).toEqual([firstComment]),
    )
    expect(result.current.post.data).toEqual(firstPost)
    expect(fetchPostMock).toHaveBeenCalledTimes(1)
    expect(fetchCommentsMock).toHaveBeenCalledTimes(2)
  })
})
