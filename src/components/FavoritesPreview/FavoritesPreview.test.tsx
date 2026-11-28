import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'

import { firstPost } from '../../test/mockData'
import { FavoritesPreview } from './FavoritesPreview'

it('should show a saved post and its comment count without a view-all action', () => {
  render(
    <FavoritesPreview
      posts={[firstPost]}
      commentsFailed={false}
      getCommentCount={() => 2}
      showAll={vi.fn()}
    />,
    { wrapper: MemoryRouter },
  )

  expect(screen.getByRole('heading', { name: 'Favorites (1)' })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: firstPost.title }).getAttribute('href'),
  ).toBe('/posts/1')
  expect(screen.getByText('2 comments')).toBeTruthy()
  expect(
    screen.queryByRole('button', { name: 'View all favorites' }),
  ).toBeNull()
})

it('should show four of five saved posts and let the user view them all', async () => {
  const user = userEvent.setup()
  const showAll = vi.fn()
  const posts = Array.from({ length: 5 }, (_, index) => ({
    ...firstPost,
    id: index + 1,
    title: `Saved post ${index + 1}`,
  }))

  render(
    <FavoritesPreview
      posts={posts}
      commentsFailed
      getCommentCount={() => undefined}
      showAll={showAll}
    />,
    { wrapper: MemoryRouter },
  )

  expect(screen.getByRole('heading', { name: 'Favorites (5)' })).toBeTruthy()
  expect(screen.getAllByRole('link')).toHaveLength(4)
  expect(screen.queryByRole('link', { name: 'Saved post 5' })).toBeNull()

  await user.click(screen.getByRole('button', { name: 'View all favorites' }))
  expect(showAll).toHaveBeenCalledOnce()
})
