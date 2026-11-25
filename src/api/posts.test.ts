import { describe, expect, it, jest } from '@jest/globals'
import {
  fetchComments,
  fetchIndividualPost,
  fetchPosts,
  isNotFound,
} from './posts'
import { firstComment, firstPost } from '../test/mockData'

const mockGet = jest.fn<(...args: unknown[]) => Promise<unknown>>()

jest.mock('axios', () => {
  const axios = jest.requireActual<typeof import('axios')>('axios').default
  return {
    __esModule: true,
    default: {
      ...axios,
      create: () => ({ get: (...args: unknown[]) => mockGet(...args) }),
    },
  }
})

describe('posts API', () => {
  it('should return the post list response body', async () => {
    mockGet.mockResolvedValueOnce({ data: [firstPost] })
    await expect(fetchPosts()).resolves.toEqual([firstPost])
    expect(mockGet).toHaveBeenLastCalledWith('/posts')
  })

  it('should request a single post with a cancellation signal', async () => {
    const { signal } = new AbortController()
    mockGet.mockResolvedValueOnce({ data: firstPost })
    await expect(fetchIndividualPost(1, signal)).resolves.toEqual(firstPost)
    expect(mockGet).toHaveBeenLastCalledWith('/posts/1', { signal })
  })

  it('should request all comments or filter by post ID', async () => {
    mockGet.mockResolvedValue({ data: [firstComment] })
    await expect(fetchComments(undefined)).resolves.toEqual([firstComment])
    expect(mockGet).toHaveBeenLastCalledWith('/comments', {
      params: { postId: undefined },
      signal: undefined,
    })

    const { signal } = new AbortController()
    await expect(fetchComments(signal, 1)).resolves.toEqual([firstComment])
    expect(mockGet).toHaveBeenLastCalledWith('/comments', {
      params: { postId: 1 },
      signal,
    })
  })

  it('should recognize Axios 404 errors only', () => {
    expect(isNotFound({ isAxiosError: true, response: { status: 404 } })).toBe(
      true,
    )
    expect(isNotFound({ isAxiosError: true, response: { status: 500 } })).toBe(
      false,
    )
    expect(isNotFound(new Error('offline'))).toBe(false)
  })
})
