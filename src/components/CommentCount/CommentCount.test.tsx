import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { CommentCount } from './CommentCount'

it.each([
  [0, '0 comments'],
  [1, '1 comment'],
  [2, '2 comments'],
])('should format a count of %i as "%s"', (count, label) => {
  render(<CommentCount commentCount={count} />)

  expect(screen.getByText(label)).toBeTruthy()
})

it('should show a skeleton while the count is loading', () => {
  render(<CommentCount />)

  expect(screen.getByLabelText('Loading comment count')).toBeTruthy()
})

it('should hide the count and loading skeleton when comments fail', () => {
  const { container, rerender } = render(<CommentCount commentsFailed />)

  expect(container.firstChild).toBeNull()

  rerender(<CommentCount commentCount={2} commentsFailed />)

  expect(container.firstChild).toBeNull()
})
