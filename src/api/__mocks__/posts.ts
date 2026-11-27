import { vi } from 'vitest'

const actual = await vi.importActual<typeof import('../posts')>('../posts')

export const isNotFound = actual.isNotFound
export const fetchPosts = vi.fn<typeof actual.fetchPosts>()
export const fetchIndividualPost = vi.fn<typeof actual.fetchIndividualPost>()
export const fetchComments = vi.fn<typeof actual.fetchComments>()
