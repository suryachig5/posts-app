import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { CommentListSkeleton } from './CommentListSkeleton'

it('should announce "Loading comments" while the content loads', () => {
  render(<CommentListSkeleton />)

  expect(screen.getByRole('status', { name: 'Loading comments' })).toBeTruthy()
})
