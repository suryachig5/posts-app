import type { Comment, Post } from '../posts'

/** Validates the list of posts returned for the feed. */
export function parsePostsResponse(data: unknown) {
  if (!Array.isArray(data) || !data.every(isPostValid)) {
    throw new Error('Invalid posts response')
  }
  return data
}

/** Validates a post and checks that its ID matches the request. */
export function parseIndividualPostResponse(data: unknown, postId: number) {
  if (!isPostValid(data) || data.id !== postId) {
    throw new Error('Invalid post response')
  }
  return data
}

/** Validates the list of comments returned by the API. */
export function parseCommentsResponse(data: unknown) {
  if (!Array.isArray(data) || !data.every(isCommentValid)) {
    throw new Error('Invalid comments response')
  }
  return data
}

/** Checks that the value is an object and is not null before reading its fields. */
function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Checks that a post response's post and user ID are integers. Also checks that text title and body are strings. */
function isPostValid(value: unknown): value is Post {
  let isValid: boolean

  if (isNonNullObject(value)) {
    const { id, userId, title, body } = value
    const hasValidIds = Number.isSafeInteger(id) && Number.isSafeInteger(userId)
    const hasValidText = typeof title === 'string' && typeof body === 'string'

    isValid = hasValidIds && hasValidText
  } else {
    isValid = false
  }

  return isValid
}

/** Checks that a comment response's comment and post ID are integers. Also checks that name, email, and body are strings. */
function isCommentValid(value: unknown): value is Comment {
  let isValid: boolean

  if (isNonNullObject(value)) {
    const { id, postId, name, email, body } = value
    const hasValidIds = Number.isSafeInteger(id) && Number.isSafeInteger(postId)
    const hasValidText =
      typeof name === 'string' &&
      typeof email === 'string' &&
      typeof body === 'string'

    isValid = hasValidIds && hasValidText
  } else {
    isValid = false
  }

  return isValid
}
