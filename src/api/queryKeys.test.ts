import { expect, it } from 'vitest'

import { commentKeys, postKeys } from './queryKeys'

it('should give the posts collection and each post separate cache keys', () => {
  expect(postKeys.list()).toEqual(['posts', 'list'])
  expect(postKeys.detail(0)).toEqual(['posts', 'detail', 0])
  expect(postKeys.detail(1)).not.toEqual(postKeys.detail(0))
})

it('should separate the comments collection from individual post threads', () => {
  expect(commentKeys.list()).toEqual(['comments', 'list'])
  expect(commentKeys.byPost(0)).toEqual(['comments', 'detail', 0])
  expect(commentKeys.byPost(1)).not.toEqual(commentKeys.byPost(0))
})
