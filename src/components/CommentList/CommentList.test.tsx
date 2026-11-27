import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { firstComment } from '../../test/mockData'
import { CommentList } from './CommentList'

it('should show the comment title, email, and body, and handle an empty list', () => {
  const { rerender } = render(<CommentList comments={[firstComment]} />)
  expect(screen.getByRole('heading', { name: firstComment.name })).toBeTruthy()
  expect(screen.getByText(firstComment.email)).toBeTruthy()
  expect(screen.getByText(firstComment.body)).toBeTruthy()
  rerender(<CommentList comments={[]} />)
  expect(screen.getByText('No comments yet.')).toBeTruthy()
})
