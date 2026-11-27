import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { CommentCountSkeleton } from './CommentCountSkeleton'

it('should render decorative placeholders for the comment icon and count', () => {
  render(<CommentCountSkeleton />)

  const placeholder = screen.getByLabelText('Loading comment count')
  expect(placeholder.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
})
