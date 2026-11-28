import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'

import { firstPost } from '../../test/mockData'
import { PostResults } from './PostResults'

const defaultProps = {
  favoritesOnly: false,
  getCommentCount: () => 3,
  loadingPosts: false,
  normalizedSearchValue: '',
  resultsRef: null,
  userId: null,
}

it('should show a skeleton while posts load', () => {
  render(<PostResults {...defaultProps} loadingPosts />)

  expect(screen.getByRole('status', { name: 'Loading posts' })).toBeTruthy()
  expect(screen.queryByRole('list')).toBeNull()
})

it('should show the filtered post, its comment count, and a reset action', async () => {
  const user = userEvent.setup()
  const onReset = vi.fn()
  render(
    <PostResults
      {...defaultProps}
      onReset={onReset}
      userId={firstPost.userId}
      visiblePosts={[firstPost]}
    />,
    { wrapper: MemoryRouter },
  )

  expect(screen.getByRole('heading', { name: 'Posts by User 1' })).toBeTruthy()
  expect(screen.getByRole('status').textContent).toBe('1 post')
  expect(screen.getByText(firstPost.body)).toBeTruthy()
  expect(screen.getByText('3 comments')).toBeTruthy()

  await user.click(screen.getByRole('button', { name: 'Reset filters' }))
  expect(onReset).toHaveBeenCalledOnce()
})

it('should let the user retry a failed posts request', async () => {
  const user = userEvent.setup()
  const run = vi.fn()
  render(<PostResults {...defaultProps} retryPosts={{ pending: false, run }} />)

  expect(screen.getByText('We couldn’t load the posts.')).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(run).toHaveBeenCalledOnce()
})

it('should keep posts visible and let the user retry a failed comments request', async () => {
  const user = userEvent.setup()
  const run = vi.fn()
  render(
    <PostResults
      {...defaultProps}
      getCommentCount={() => undefined}
      retryComments={{ pending: false, run }}
      visiblePosts={[firstPost]}
    />,
    { wrapper: MemoryRouter },
  )

  expect(screen.getByText(firstPost.body)).toBeTruthy()
  expect(screen.getByText('We couldn’t load comments.')).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(run).toHaveBeenCalledOnce()
})

it.each([
  { favoritesOnly: false, search: '', message: 'No posts to display.' },
  {
    favoritesOnly: true,
    search: '',
    message: 'Your favorites will appear here.',
  },
  {
    favoritesOnly: true,
    search: 'apple',
    message: 'No posts match your search.',
  },
])(
  'should show the empty message "$message"',
  ({ favoritesOnly, search, message }) => {
    render(
      <PostResults
        {...defaultProps}
        favoritesOnly={favoritesOnly}
        normalizedSearchValue={search}
        visiblePosts={[]}
      />,
    )

    expect(screen.getByText(message)).toBeTruthy()
  },
)
