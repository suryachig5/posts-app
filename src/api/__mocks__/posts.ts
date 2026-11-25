import { jest } from '@jest/globals'

const actual = jest.requireActual<typeof import('../posts')>('../posts')

export const isNotFound = actual.isNotFound
export const fetchPosts = jest.fn<typeof actual.fetchPosts>()
export const fetchIndividualPost = jest.fn<typeof actual.fetchIndividualPost>()
export const fetchComments = jest.fn<typeof actual.fetchComments>()
