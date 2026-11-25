import { jest } from '@jest/globals'

const actual = jest.requireActual<typeof import('../posts')>('../posts')

export const isNotFound = actual.isNotFound
export const fetchPosts = jest.fn<typeof actual.fetchPosts>()
export const fetchPost = jest.fn<typeof actual.fetchPost>()
export const fetchComments = jest.fn<typeof actual.fetchComments>()
