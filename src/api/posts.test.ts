import { describe, expect, it, vi } from 'vitest'

import { firstComment, firstPost } from '../test/mockData'
import {
  fetchComments,
  fetchIndividualPost,
  fetchPosts,
  isNotFound,
} from './posts'

const { mockCreate, mockGet } = vi.hoisted(() => {
  const mockGet = vi.fn<(...args: unknown[]) => Promise<unknown>>()
  const mockCreate = vi.fn(() => ({ get: mockGet }))
  return { mockCreate, mockGet }
})

vi.mock('axios', async () => {
  const axios = (await vi.importActual<typeof import('axios')>('axios')).default
  return {
    __esModule: true,
    default: {
      ...axios,
      create: mockCreate,
    },
  }
})

describe('posts API', () => {
  it('should target JSONPlaceholder', () => {
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://jsonplaceholder.typicode.com',
      }),
    )
  })

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
    await expect(fetchComments()).resolves.toEqual([firstComment])
    expect(mockGet).toHaveBeenLastCalledWith('/comments', {
      params: { postId: undefined },
      signal: undefined,
    })

    const { signal } = new AbortController()
    await expect(fetchComments({ postId: 1, signal })).resolves.toEqual([
      firstComment,
    ])
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
