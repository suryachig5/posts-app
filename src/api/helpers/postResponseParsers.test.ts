import { expect, it } from 'vitest'

import { firstComment, firstPost } from '../../test/mockData'
import {
  parseCommentsResponse,
  parseIndividualPostResponse,
  parsePostsResponse,
} from './postResponseParsers'

it.each([
  null,
  {},
  [null],
  [{ ...firstPost, id: '1' }],
  [{ ...firstPost, userId: '1' }],
  [{ ...firstPost, title: null }],
  [{ ...firstPost, body: null }],
])('should reject a malformed posts response: %j', (data) => {
  expect(() => parsePostsResponse(data)).toThrow('Invalid posts response')
})

it.each([null, { ...firstPost, id: 2 }])(
  'should reject an invalid or mismatched detail response: %j',
  (data) => {
    expect(() => parseIndividualPostResponse(data, 1)).toThrow(
      'Invalid post response',
    )
  },
)

it.each([
  null,
  [null],
  [{ ...firstComment, id: null }],
  [{ ...firstComment, postId: '1' }],
  [{ ...firstComment, name: null }],
  [{ ...firstComment, email: null }],
  [{ ...firstComment, body: null }],
])('should reject a malformed comments response: %j', (data) => {
  expect(() => parseCommentsResponse(data)).toThrow('Invalid comments response')
})
