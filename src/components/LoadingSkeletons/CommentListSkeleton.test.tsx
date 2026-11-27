import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { CommentListSkeleton } from './CommentListSkeleton'

it('should announce "Loading comments" while the content loads', () => {
  render(<CommentListSkeleton />)

  expect(screen.getByRole('status', { name: 'Loading comments' })).toBeTruthy()
})
