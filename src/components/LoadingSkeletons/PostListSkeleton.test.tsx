import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { PostListSkeleton } from './PostListSkeleton'

it('should announce that posts are loading and render three placeholders', () => {
  render(<PostListSkeleton />)

  const status = screen.getByRole('status', { name: 'Loading posts' })
  expect(status.children).toHaveLength(3)
})
