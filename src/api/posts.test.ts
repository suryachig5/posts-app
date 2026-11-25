import { expect, it, jest } from '@jest/globals'
import { firstComment, firstPost } from '../test/mockData'
import { fetchComments, fetchPosts } from './posts'

const mockGet = jest.fn<(path: string) => Promise<unknown>>()

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({ get: (path: string) => mockGet(path) }),
  },
}))

it('should return posts from the posts endpoint', async () => {
  mockGet.mockResolvedValueOnce({ data: [firstPost] })

  await expect(fetchPosts()).resolves.toEqual([firstPost])
  expect(mockGet).toHaveBeenLastCalledWith('/posts')
})

it('should return comments from the comments endpoint', async () => {
  mockGet.mockResolvedValueOnce({ data: [firstComment] })

  await expect(fetchComments()).resolves.toEqual([firstComment])
  expect(mockGet).toHaveBeenLastCalledWith('/comments')
})
