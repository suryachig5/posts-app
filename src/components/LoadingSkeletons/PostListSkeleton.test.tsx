import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { PostListSkeleton } from './PostListSkeleton'

it('should announce that posts are loading and render three placeholders', () => {
  render(<PostListSkeleton />)

  const status = screen.getByRole('status', { name: 'Loading posts' })
  expect(status.children).toHaveLength(3)
})
