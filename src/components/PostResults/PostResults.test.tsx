import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'

import { firstPost } from '../../test/mockData'
import { PostResults } from './PostResults'

const defaultProps = {
  filters: { favoritesOnly: false, normalizedSearchValue: '', userId: null },
  posts: { loading: false },
  comments: { getCount: () => 3 },
  resultsRef: null,
}

it('should show a skeleton while posts load', () => {
  render(<PostResults {...defaultProps} posts={{ loading: true }} />)

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
      filters={{ ...defaultProps.filters, userId: firstPost.userId }}
      posts={{ loading: false, visible: [firstPost] }}
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
  render(
    <PostResults
      {...defaultProps}
      posts={{ loading: false, retry: { pending: false, run } }}
    />,
  )

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
      comments={{ getCount: () => undefined, retry: { pending: false, run } }}
      posts={{ loading: false, visible: [firstPost] }}
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
        filters={{
          ...defaultProps.filters,
          favoritesOnly,
          normalizedSearchValue: search,
        }}
        posts={{ loading: false, visible: [] }}
      />,
    )

    expect(screen.getByText(message)).toBeTruthy()
  },
)
