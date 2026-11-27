import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { PostDetailsSkeleton } from './PostDetailsSkeleton'

it('should announce "Loading post" while the content loads', () => {
  render(<PostDetailsSkeleton />)

  expect(screen.getByRole('status', { name: 'Loading post' })).toBeTruthy()
})
